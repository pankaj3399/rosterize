const express = require('express');
const router = express.Router();

const {create, list, remove} = require('../controllers/Roles');

router.post('/create', create);
router.get('/list/:company_id', list);
router.delete('/remove/:role_id', remove);

module.exports = router;