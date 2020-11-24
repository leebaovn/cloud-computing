const express = require('express');

const router = express.Router();
const {
  createSeminar,
  getSeminars,
  getSeminarById,
  deleteSeminar,
  updateSeminar,
  cancelSeminar,
  joinSeminar,
} = require('./seminar.controller');
const { isAuth } = require('../../middlewares/auth.middleware');

// router.use(isAuth);

router.get('/', getSeminars);
router.get('/:id', getSeminarById);
router.post('/create', createSeminar);
router.put('/update/:id', updateSeminar);
router.put('/delete/:id', deleteSeminar);
router.put('/join/:id', joinSeminar);
router.put('/cancel/:id', cancelSeminar);

//error handler
// router.use();

module.exports = router;
