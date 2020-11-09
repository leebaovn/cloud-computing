const express = require('express');

const router = express.Router();
const {
  createSeminar,
  getSeminars,
  getSeminarById,
  deleteSeminar,
  updateSeminar,
} = require('./seminar.controller');
const { isAuth } = require('../../middlewares/auth.middleware');

// router.use(isAuth);

router.get('/', getSeminars);
router.get('/:id', getSeminarById);
router.post('/create', createSeminar);
router.put('/update/:id', updateSeminar);
router.put('/delete/:id', deleteSeminar);

//error handler
// router.use();

module.exports = router;
