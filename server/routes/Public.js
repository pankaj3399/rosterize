const express = require('express');
const router = express.Router();

const { listPlansAndReviews, postCompany, enquire } = require('../controllers/Public');

router.get('/list', listPlansAndReviews);
router.post('/company', postCompany);
router.post('/enquire', enquire);

module.exports = router;