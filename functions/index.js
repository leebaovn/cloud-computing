const functions = require('firebase-functions');
const admin = require('firebase-admin');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const myPlaintextPassword = 's0//P4$$w0rD';

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
  service: 'gmail',
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
    return res.json({ message: 'Bạn không được phép!' });
  }
  try {
    const { seminarId, status, authorId } = req.body; // get event to update status, get authorId to send mail confirm
    const authorData = await db.collection('users').doc(authorId).get();
    if (!authorData.data().email) {
      return res.json({ message: 'Không tìm thấy tác giả!' });
    } else {
      const authorEmail = authorData.data().email;
      const mailOptions = {
        from: process.env.MAIL_ADDRESS,
        to: authorEmail,
        subject: 'Confirm seminar',
        html: `<p>Your seminar was <b>${status}<b></p>`,
      };
      return transporter.sendMail(mailOptions, async (err, info) => {
        if (err) {
          return res.json({ message: `Không thể gửi email ${err}` });
        }
        const eventFound = db.collection('seminars').doc(seminarId);
        eventFound
          .update({ status: status })
          .then(() => {
            return res.json({ data: 'Gửi email xác nhận thành công!' });
          })
          .catch(() => {
            return res.json({ message: 'Không tìm thấy seminar!' });
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
      return res.json({ message: 'Vui lòng nhập thêm thông tin!' });
    }
    const userFound = await db
      .collection('users')
      .where('email', '==', email)
      .get();
    if (!userFound.empty) {
      return res.json({
        message: 'Email này đã tồn tại. Vui lòng chọn email khác!',
      });
    }

    const hashpassword = bcrypt.hashSync(password, saltRounds);

    const newUser = {
      email,
      password: hashpassword,
      name,
      role,
      studentId,
    };

    const addedUser = await db.collection('users').add(newUser);

    res.json({ result: `user with ID: ${addedUser.id} added.` }); //message return when create new User
  } catch (err) {
    // throw err;
    res.json({ message: 'Lỗi bất ngờ xảy ra!' });
  }
});

//create new seminar
app.post('/createseminar', async (req, res) => {
  if (!req.isAuth) {
    res.send(404, 'Vui lòng đăng nhập!');
  }
  if (req.role === 'audience') {
    res.send(404, 'Bạn không được phép!');
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
      res.send(404, 'Vui lòng nhập thông tin cần thiết!');
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
    res.send(404, 'Vui lòng đăng nhập!');
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
      res.json({ message: 'Email hoặc mật khẩu không chính xác!' });
    }
    let ok = false;
    let user;

    userFound.forEach((doc) => {
      const pwd = bcrypt.compareSync(password, doc.data().password);

      if (pwd) {
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
      res.json({ message: 'Email hoặc mật khẩu không chính xác!' });
    }
  } catch (err) {
    throw err;
  }
});

//get all user to manage
app.get('/users', async (req, res) => {
  if (!req.isAuth) {
    res.send(404, 'Vui lòng đăng nhập!');
  }
  if (req.role !== 'admin') {
    res.send(404, 'Bạn không được phép!');
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
    res.json({ message: 'Không có người dùng nào!' });
  }
});

// const { createSeminar } = require('../functions/modules/seminar/seminar.controller');
// app.put('/update-seminar/:id', deleteSeminar);
// app.post('/create-seminar', createSeminar);
const seminarRouter = require('./modules/seminar/seminar.router');
const { hash } = require('bcrypt');
app.use('/seminar', seminarRouter);

//create new category
app.post('/createcategory', async (req, res) => {
  if (!req.isAuth) {
    res.send(404, 'Vui lòng đăng nhập!');
  }
  if (req.role === 'audience') {
    res.send(404, 'Bạn không được phép!');
  }
  try {
    const { title, description } = req.body;
    if (!title || !description) {
      res.send(404, 'Vui lòng nhập thông tin!');
    }
    const newCategory = {
      title,
      description,
    };

    const addedCategory = await db.collection('categories').add(newCategory);
    res.json({ category: addedCategory.id });
  } catch (err) {
    throw err;
  }
});

//get all categories
app.get('/categories', async (req, res) => {
  if (!req.isAuth) {
    res.send(404, 'Vui lòng đăng nhập!');
  }
  // if (req.role === 'audience') {
  //   res.send(404, 'You dont have permission');
  // }
  const snapshot = await db.collection('categories').get();
  if (!snapshot.empty) {
    const categories = snapshot.docs.map((category) => {
      return {
        ...category.data(),
        id: category.id,
      };
    });
    res.json({ data: categories });
  } else {
    res.json({ message: 'Không có danh mục nào!' });
  }
});

app.delete('/category/:id', async (req, res) => {
  if (!req.isAuth) {
    res.send(404, 'Vui lòng đăng nhập!');
  }
  if (req.role !== 'admin') {
    res.send(404, 'Bạn không được phép!');
  }
  try {
    const data = await db.collection('categories').doc(req.params.id).delete();
    return res.json({ message: 'deleted' });
  } catch (err) {
    throw new Error('Không thể xóa danh mục này!');
  }
});

//update category
app.patch('/category/:id', async (req, res) => {
  //   if (!req.isAuth) {
  //   res.send(404, 'Unauthorization!');
  // }
  // if (req.role === 'audience') {
  //   res.send(404, 'You dont have permission to create category!');
  // }
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      res.send(404, 'Vui lòng nhập thông tin!');
    }

    const id = req.params.id;

    const categoryFound = await db.collection('categories').doc(id).get();

    if (!categoryFound.data().title) {
      res.json({ message: 'Không tìm thấy danh mục!' });
    } else {
      //res.json({ message: 'Succeed!' });

      // categoryFound.title = req.body.title;
      // categoryFound.description = req.body.description;

      await db.collection('categories').doc(id).update({
        title,
        description,
      });

      // updatedCategory.update({title: req.body.title, description: req.body.description}).then(() => {
      return res.json({ message: 'Chỉnh sửa danh mục thành công!' });
      // })
      // .catch(() => {
      //   return res.json({ message: 'Update fail' });
      // });
    }
  } catch (err) {
    throw err;
  }
});

exports.api = functions.https.onRequest(app);
