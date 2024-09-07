const express = require('express');
const router = express.Router();

const { getLeaves, changeLeaveStatus, schedule, addSchedule, downloadSchedule } = require('../controllers/DepartmentHead');

router.get('/leaves', getLeaves);
router.post('/leave/status/:id', changeLeaveStatus);
router.get('/schedule', schedule);
router.post('/schedule', addSchedule);
router.get('/downloadschedule', downloadSchedule);

module.exports = router;