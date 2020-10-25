const functions = require('firebase-functions');
const admin = require('firebase-admin');

require('dotenv').config();
const express = require('express');

const jwt = require('jsonwebtoken');

const nodeMailer = require('nodemailer');
const cors = require('cors');

admin.initializeApp();
const db = admin.firestore();

const app = express();
app.use(cors({ origin: '*' }));

const transporter = nodeMailer.createTransport({
  service: 'Gmail',
  host: 'gmail.com',
  auth: {
    user: process.env.MAIL_ADDRESS,
    pass: process.env.SECRET_PASSWORD,
  },
});
//middleware
app.use((req, res, next) => {
  const authHeader = req.get('Authorization');
  if (!authHeader) {
    req.isAuth = false;
    return next();
  }
  const token = authHeader.split(' ')[1]; //Bearer token => token
  if (!token || token === '') {
    req.isAuth = false;
    return next();
  }

  let decodedToken;
  try {
    decodedToken = jwt.verify(token, 'secretKey');
  } catch (err) {
    req.isAuth = false;
    return next();
  }
  if (!decodedToken) {
    req.isAuth = false;
    return next();
  }

  req.isAuth = true;
  req.role = decodedToken.role;
  req.userId = decodedToken.userId;
  next();
});

//Send mail to speaker as if their seminar is accepted or not
app.post('/seminarpermission', async (req, res) => {
  if (req.role !== 'admin') {
    return res.json({ message: 'You dont have permission on this action!' });
  }
  try {
    const { seminarId, status, authorId } = req.body; // get event to update status, get authorId to send mail confirm
    const authorData = await db.collection('users').doc(authorId).get();
    if (!authorData.data().email) {
      return res.json({ message: 'Author not found!' });
    } else {
      const authorEmail = authorData.data().email;
      const mailOptions = {
        from: process.env.MAIL_ADDRESS,
        to: authorEmail,
        subject: 'Confirm seminar',
        html: `<p>Your seminar was ${status}</p>`,
      };
      return transporter.sendMail(mailOptions, async (err, info) => {
        if (err) {
          return res.json({ message: `Cannot send mail ${err}` });
        }
        const eventFound = db.collection('seminars').doc(seminarId);
        eventFound
          .update({ status: status })
          .then(() => {
            return res.json({ data: 'Email sent' });
          })
          .catch(() => {
            return res.json({ message: 'Seminar not found' });
          });
      });
    }
  } catch (err) {
    return res.json({ message: err });
  }
});

//Create new user
app.post('/createuser', async (req, res) => {
  try {
    const { email, password, name, role, studentId } = req.body;
    if (!email || !password || !name) {
      return res.json({ message: 'You are missing some field' });
    }
    const userFound = await db
      .collection('users')
      .where('email', '==', email)
      .get();
    if (!userFound.empty) {
      return res.json({
        message: 'Email is exist. Please choose another email.',
      });
    }
    const newUser = {
      email,
      password,
      name,
      role,
      studentId,
    };

    const addedUser = await db.collection('users').add(newUser);

    res.json({ result: `user with ID: ${addedUser.id} added.` }); //message return when create new User
  } catch (err) {
    // throw err;
    res.json({ hello: 'fail roi' });
  }
});

//create new seminar
app.post('/createseminar', async (req, res) => {
  if (!req.isAuth) {
    res.send(404, 'Unauthorization!');
  }
  if (req.role === 'audience') {
    res.send(404, 'You dont have permission to create seminar!');
  }

  try {
    const {
      title,
      description,
      quantity,
      authorName,
      location,
      timeStart,
    } = req.body;
    if (!title || !timeStart) {
      res.send(404, 'title and time start are required!');
    }
    const newSeminar = {
      title,
      description,
      quantity: quantity || 50,
      authorName,
      location,
      timeStart,
      createdBy: req.userId,
      status: 'pending',
    };

    const addedSeminar = await db.collection('seminars').add(newSeminar);
    res.json({ seminar: addedSeminar.id });
  } catch (err) {
    throw err;
  }
});

//Get seminar
app.get('/seminars', async (req, res) => {
  if (!req.isAuth) {
    res.send(404, 'Unauthorization!');
  }

  try {
    const seminars = [];
    if (req.role !== 'speaker') {
      const snapshot = await db.collection('seminars').get();
      snapshot.docs.forEach((doc) => {
        seminars.push({ ...doc.data(), id: doc.id });
      });
      res.json({ data: seminars });
    } else {
      const mySeminars = await db
        .collection('seminars')
        .where('createdBy', '==', req.userId)
        .get();
      const seminarsQuery = mySeminars.docs.map((seminar) => {
        return {
          ...seminar.data(),
        };
      });

      res.json({ data: seminarsQuery });
    }
  } catch (err) {
    throw err;
  }
});

//login and return token
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const userFound = await db
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
        user = { ...doc.data(), userId: doc.id };
      }
    });
    if (ok) {
      const { email: userEmail, name, role, userId } = user;
      const token = await jwt.sign(
        {
          name,
          email: userEmail,
          role,
          userId,
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

//get all user to manage
app.get('/users', async (req, res) => {
  if (!req.isAuth) {
    res.send(404, 'Unauthorization!');
  }
  if (req.role !== 'admin') {
    res.send(404, 'You dont have permission');
  }
  const snapshot = await db.collection('users').get();
  if (!snapshot.empty) {
    const users = snapshot.docs.map((user) => {
      return {
        ...user.data(),
        id: user.id,
      };
    });
    res.json({ data: users });
  } else {
    res.json({ message: 'Not found!' });
  }
});
exports.api = functions.https.onRequest(app);
