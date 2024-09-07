const express = require('express');
const router = express.Router();

const { updateCompany } = require('../controllers/Company');

router.put('/:company_id', updateCompany);

module.exports = router;