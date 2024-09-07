const Review = require('../models/Review');
const Company = require('../models/Company');
const User = require('../models/User');
const Plans = require('../models/Plans');

module.exports = {

    listReviews: async(req, res) => {
        try {

            const {rating} = req.query;
            const findCondition = {};
            if (rating) {
                findCondition.rating = rating;
            }
            const reviews = await Review.find(findCondition).populate('company').populate({ path: 'user', populate: { path: 'companyRole' } });
            res.send(reviews);
        } catch (error) {
            return res.status(500).send(error.message || 'Error fetching reviews');
        }
    },
    changeReviewStatus: async(req, res) => {
        try {
            const { review_id, status } = req.body;

            if (!review_id || !status) {
                return res.status(400).send('Please provide review id and status');
            }

            // check if already two reviews are approved
            if (status === 'active') {
                const approvedReviews = await Review.find({ status: 'active' });
                if (approvedReviews.length >= 2) {
                    return res.status(400).send({ error: 'Only two reviews can be approved' });
                }
            }

            const updatedReview = await Review.findByIdAndUpdate(review_id, { status }, { new: true });
            if (!updatedReview) {
                return res.status(500).send('Error updating review status')
            }
            return res.send(updatedReview);
        } catch (error) {
            res.status(500).send(error.message || 'Error updating review status');
        }
    },
    addPlan: async(req, res) => {
        try {
            const { name, range, cost } = req.body;
            if(!name || !range || !cost) {
                return res.status(400).send('Please provide all details');
            }
            const newPlan = new Plans({
                name,
                range,
                cost,
                createdAt: new Date(),
                updatedAt: new Date()
            });
            const savedPlan = await newPlan.save();
            res.send(savedPlan);
        } catch (error) {
            return res.status(500).send(error.message || 'Error adding plan');
        }
    },
    listPlans: async(req, res) => {
        try {
            const plans = await Plans.find();
            res.send(plans);
        } catch (error) {
            return res.status(500).send(error.message || 'Error fetching plans');
        }
    },
    deletePlan: async(req, res) => {
        try {
            const { planId: id } = req.params;
            if (!id) {
                return res.status(400).send('Please provide plan id');
            }
            const deletedPlan = await Plans.findByIdAndDelete(id);
            if (!deletedPlan) {
                return res.status(500).send('Error deleting plan');
            }
            res.send(deletedPlan);
        } catch (error) {
            return res.status(500).send(error.message || 'Error deleting plan');
        }
    },

}