const Activity = require('../models/Activity');

const createActivity = async (req, res) => {
    const { name, category, description } = req.body;

    const activityExists = await Activity.findOne({ name });
    if (activityExists) {
        return res.status(400).json({ message: 'Activity with this name already exists' });
    }

    const activity = await Activity.create({ name, category, description });
    if (activity) {
        res.status(201).json(activity);
    } else {
        res.status(400).json({ message: 'Invalid activity data' });
    }
};

const getActivities = async (req, res) => {
    const activities = await Activity.find({});
    res.json(activities);
};

const getActivityById = async (req, res) => {
    const activity = await Activity.findById(req.params.id);
    if (activity) {
        res.json(activity);
    } else {
        res.status(404).json({ message: 'Activity not found' });
    }
};

const updateActivity = async (req, res) => {
    const { name, category, description } = req.body;
    const activity = await Activity.findById(req.params.id);

    if (activity) {
        activity.name = name || activity.name;
        activity.category = category || activity.category;
        activity.description = description || activity.description;

        const updatedActivity = await activity.save();
        res.json(updatedActivity);
    } else {
        res.status(404).json({ message: 'Activity not found' });
    }
};

const deleteActivity = async (req, res) => {
    const activity = await Activity.findById(req.params.id);
    if (activity) {
        await Activity.deleteOne({ _id: activity._id });
        res.json({ message: 'Activity removed' });
    } else {
        res.status(404).json({ message: 'Activity not found' });
    }
};

module.exports = {
    createActivity,
    getActivities,
    getActivityById,
    updateActivity,
    deleteActivity,
};