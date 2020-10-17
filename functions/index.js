const functions = require('firebase-functions');

// The Firebase Admin SDK to access Cloud Firestore.
const admin = require('firebase-admin');
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

exports.newMessage = functions.https.onRequest(async (req, res) => {
  // Send back a message that we've succesfully written the message
  res.json({ result: `Message is added.` });
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
      seminars.push(doc.data());
    });
    res.json({ data: seminars });
  } catch (err) {
    throw err;
  }
});
