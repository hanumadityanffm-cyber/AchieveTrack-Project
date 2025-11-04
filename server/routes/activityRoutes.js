const express = require('express');
const { createActivity, getActivities, getActivityById, updateActivity, deleteActivity } = require('../controllers/activityController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
    .post(protect, authorizeRoles('admin'), createActivity)
    .get(protect, getActivities);

router.route('/:id')
    .get(protect, getActivityById)
    .put(protect, authorizeRoles('admin'), updateActivity)
    .delete(protect, authorizeRoles('admin'), deleteActivity);

module.exports = router;