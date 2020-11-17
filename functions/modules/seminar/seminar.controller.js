const admin = require('firebase-admin');
const db = admin.firestore();
const { Error } = require('../../utils/Error');
const { Success } = require('../../utils/Success');

exports.getSeminars = async (req, res, next) => {
  if (!req.isAuth) {
    // res.send(404, 'Unauthorized!');
    throw new Error({ statusCode: 404, message: 'Unauthorized' });
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
      // res.json({ data: mySeminars });
      const success = new Success({ data: mySeminars });
      res.status(200).send(success);
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
      // res.json({ data: seminars });
      const success = new Success({ data: seminars });
      res.status(200).send(success);
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
      // res.json({ data: seminars });
      const success = new Success({ data: seminars });
      res.status(200).send(success);
    }
  } catch (error) {
    () => next(error);
  }
};

exports.getSeminarById = async (req, res, next) => {
  if (!req.isAuth) {
    // res.send(404, 'Unauthorized!');
    throw new Error({ statusCode: 404, message: 'Unauthorized' });
  }
  try {
    const doc = await db.collection('seminars').doc(req.params.id).get();
    // res.send({ data: doc.data() });
    const success = new Success({ data: doc.data(), id: doc.id });
    res.status(200).send(success);
  } catch (error) {
    () => next(error);
  }
};

exports.createSeminar = async (req, res, next) => {
  if (!req.isAuth) {
    // res.send(404, 'Unauthorized!');
    throw new Error({ statusCode: 404, message: 'Unauthorized' });
  }
  if (req.role === 'audience') {
    // res.send(404, 'You do not have permission to create seminar!');
    throw new Error({ statusCode: 404, message: 'Do not have permission' });
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
      // res.send(404, 'title and date are required!');
      throw new Error({
        statusCode: 404,
        message: 'title and date are required',
      }).addField(errors, {
        title: 'title is required',
        date: 'date is required'
      });
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
    // res.json({ data: addedSeminar.data() });
    const success = new Success({ data: addedSeminar.data(), id: addedSeminar.id });
    res.status(200).send(success);
  } catch (error) {
    () => next(error);
  }
};

exports.updateSeminar = async (req, res, next) => {
  if (!req.isAuth) {
    // res.send(404, 'Unauthorized!');
    throw new Error({ statusCode: 404, message: 'Unauthorized' });
  }
  if (req.role === 'audience') {
    // res.send(404, 'You do not have permission to update seminar!');
    throw new Error({ statusCode: 404, message: 'Do not have permission' });
  }

  try {
    const docRef = db.collection('seminars').doc(req.params.id);

    await db.runTransaction(async (transaction) => {
      const doc = await transaction.get(docRef);

      if (!doc.exists) {
        throw new Error({ statusCode: 400, message: 'Seminar not found' });
      }
      const {
        title,
        imageUrl,
        description,
        quantity,
        location,
        date,
        time,
      } = req.body;
      const data = {
        title,
        imageUrl,
        description,
        quantity,
        location,
        date,
        time,
      };
      transaction.update(docRef, data);
    });
    const updatedDoc = await docRef.get();
    // res.json({ data: updatedDoc.data() });
    const success = new Success({ data: updatedDoc.data(), id: updatedDoc.id });
    res.status(200).send(success);
  } catch (error) {
    () => next(error);
  }
};

exports.deleteSeminar = async (req, res, next) => {
  if (!req.isAuth) {
    // res.send(404, 'Unauthorized!');
    throw new Error({ statusCode: 404, message: 'Unauthorized' });
  }
  if (req.role === 'audience') {
    // res.send(404, 'You do not have permission to delete seminar!');
    throw new Error({ statusCode: 404, message: 'Do not have permission' });
  }

  try {
    const docRef = db.collection('seminars').doc(req.params.id);

    await db.runTransaction(async (transaction) => {
      const doc = await transaction.get(docRef);

      if (!doc.exists) {
        throw new Error({ statusCode: 400, message: 'Seminar not found' });
      }
      transaction.delete(docRef);
    });
    // res.send(200, 'Deleted successfully');
    const success = new Success();
    res.status(200).send(success);
  } catch (error) {
    () => next(error);
  }
};
