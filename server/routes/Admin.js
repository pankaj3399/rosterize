const express = require('express');
const router = express.Router();

const { listReviews, changeReviewStatus, addPlan, listPlans, deletePlan } = require('../controllers/Admin');

router.get('/reviews', listReviews);
router.post('/status', changeReviewStatus);
router.post('/plan', addPlan);
router.get('/plans', listPlans);
router.delete('/plan/:planId', deletePlan);

module.exports = router;