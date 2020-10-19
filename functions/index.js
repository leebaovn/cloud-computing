const functions = require('firebase-functions');

// The Firebase Admin SDK to access Cloud Firestore.
const admin = require('firebase-admin');
const jwt = require('jsonwebtoken');
const cors = require('cors')({ origin: true });
admin.initializeApp();

//Mẫu làm việc với functions
exports.addMessage = functions.https.onRequest(async (req, res) => {
  // Grab the text parameter.
  const original = req.query.text;
  // Push the new message into Cloud Firestore using the Firebase Admin SDK.
  const writeResult = await admin
    .firestore()
    .collection('messages')
    .add({ original: original });
  // Send back a message that we've succesfully written the message
  res.json({ result: `Message with ID: ${writeResult.id} added.` });
});

//Create new user
exports.createUser = functions.https.onRequest(async (req, res) => {
  try {
    const { email, password, name, role } = req.body;
    const newUser = {
      email,
      password,
      name,
      role,
    };

    const addedUser = await admin.firestore().collection('users').add(newUser);

    res.json({ result: `user with ID: ${addedUser.id} added.` }); //message return when create new User
  } catch (err) {
    throw err;
  }
});

exports.createSeminar = functions.https.onRequest(async (req, res) => {
  try {
    const {
      title,
      description,
      quantity,
      authorName,
      location,
      timeStart,
    } = req.body;

    const newSeminar = {
      title,
      description,
      quantity,
      authorName,
      location,
      timeStart,
    };

    const addedSeminar = await admin
      .firestore()
      .collection('seminars')
      .add(newSeminar);
    res.json({ seminar: addedSeminar.id });
  } catch (err) {
    throw err;
  }
});

exports.seminars = functions.https.onRequest(async (req, res) => {
  try {
    const seminars = [];
    const snapshot = await admin.firestore().collection('seminars').get();
    snapshot.docs.forEach((doc) => {
      console.log(doc);
      seminars.push({ ...doc.data(), id: doc.id });
    });
    res.json({ data: seminars });
  } catch (err) {
    throw err;
  }
});

exports.login = functions.https.onRequest(async (req, res) => {
  cors(req, res, () => {});

  try {
    const { email, password } = req.body;
    const userFound = await admin
      .firestore()
      .collection('users')
      .where('email', '==', email)
      .get();
    if (userFound.empty) {
      res.json({ message: 'Email or password is incorrect!' });
    }
    let ok = false;
    let user;
    userFound.forEach((doc) => {
      if (password === doc.data().password) {
        ok = true;
        user = doc.data();
      }
    });
    if (ok) {
      const { email: userEmail, name, role } = user;
      const token = await jwt.sign(
        {
          name,
          email: userEmail,
          role,
        },
        'secretKey',
        {
          expiresIn: '24h',
        }
      );

      res.json({ token });
    } else {
      res.json({ message: 'Email or password is incorrect!' });
    }
  } catch (err) {
    throw err;
  }
});
