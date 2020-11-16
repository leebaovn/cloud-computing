const admin = require('firebase-admin');
const db = admin.firestore();

exports.getSeminars = async (req, res, next) => {
  if (!req.isAuth) {
    res.send(404, 'Unauthorized!');
  }

  // const { sort } = req.params;
  // const order = sort ? sort.substring(1, sort.length) : '';
  // const orderByDirection = sort && sort[0] === '-' ? 'desc' : 'asc';

  try {
    if (req.role === 'speaker') {
      const snapshot = await db
        .collection('seminars')
        .where('createdBy', '==', req.userId)
        // .orderBy(order, orderByDirection)
        .get();
      const mySeminars = snapshot.docs.map((seminar) => {
        return {
          ...seminar.data(),
          id: seminar.id,
        };
      });
      res.json({ data: mySeminars });
    } else if (req.role === 'admin') {
      const snapshot = await db
        .collection('seminars')
        // .orderBy(order, orderByDirection)
        .get();
      const seminars = snapshot.docs.map((seminar) => {
        return {
          ...seminar.data(),
          id: seminar.id,
        };
      });
      res.json({ data: seminars });
    } else {
      const snapshot = await db
        .collection('seminars')
        .where('status', '==', 'accepted')
        // .orderBy(order, orderByDirection)
        .get();
      const seminars = snapshot.docs.map((seminar) => {
        return {
          ...seminar.data(),
          id: seminar.id,
        };
      });
      res.json({ data: seminars });
    }
  } catch (error) {
    () => next(error);
  }
};

exports.getSeminarById = async (req, res, next) => {
  if (!req.isAuth) {
    res.send(404, 'Unauthorized!');
  }
  try {
    const doc = await db.collection('seminars').doc(req.params.id).get();
    res.send({ data: { ...doc.data(), id: doc.id } });
  } catch (error) {
    () => next(error);
  }
};

exports.createSeminar = async (req, res, next) => {
  if (!req.isAuth) {
    res.send(404, 'Unauthorized!');
  }
  if (req.role === 'audience') {
    res.send(404, 'You don not have permission to create seminar!');
  }

  try {
    const {
      title,
      imageUrl,
      description,
      quantity,
      authorName,
      location,
      date,
      time,
    } = req.body;
    if (!title || !date) {
      res.send(404, 'title and date are required!');
    }
    const newSeminar = {
      image: imageUrl,
      title,
      description,
      quantity: quantity || 50,
      authorName,
      location,
      date,
      time,
      createdBy: req.userId,
      status: 'pending',
      members: [],
    };

    const addedSeminar = await db.collection('seminars').add(newSeminar);
    res.json({ data: addedSeminar.data() });
  } catch (error) {
    () => next(error);
  }
};

exports.updateSeminar = async (req, res, next) => {
  if (!req.isAuth) {
    res.send(404, 'Unauthorized!');
  }
  if (req.role === 'audience') {
    res.send(404, 'You don not have permission to update seminar!');
  }

  try {
    const docRef = db.collection('seminars').doc(req.params.id);

    await db.runTransaction(async (transaction) => {
      const doc = await transaction.get(docRef);

      if (!doc.exists) {
        throw new Error('error');
      }
      transaction.update(docRef, req.body);
    });
    const updatedDoc = await docRef.get();
    res.json({ data: updatedDoc.data() });
  } catch (error) {
    () => next(error);
  }
};

exports.deleteSeminar = async (req, res, next) => {
  if (!req.isAuth) {
    res.send(404, 'Unauthorized!');
  }
  if (req.role === 'audience') {
    res.send(404, 'You don not have permission to delete seminar!');
  }

  try {
    const docRef = db.collection('seminars').doc(req.params.id);

    await db.runTransaction(async (transaction) => {
      const doc = await transaction.get(docRef);

      if (!doc.exists) {
        throw new Error('error');
      }
      transaction.delete(docRef);
    });
    res.send(200, 'Deleted successfully');
  } catch (error) {
    () => next(error);
  }
};
