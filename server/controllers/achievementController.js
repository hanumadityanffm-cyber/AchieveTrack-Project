const Achievement = require('../models/Achievement');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({ storage: storage });

const submitAchievement = async (req, res) => {
    const { activity, title, description, date } = req.body;
    const proof = req.file ? `/uploads/${req.file.filename}` : null;

    const achievement = new Achievement({
        user: req.user._id,
        activity,
        title,
        description,
        date,
        proof,
        status: 'Pending',
    });

    const createdAchievement = await achievement.save();
    res.status(201).json(createdAchievement);
};

const getMyAchievements = async (req, res) => {
    const achievements = await Achievement.find({ user: req.user._id }).populate('activity', 'name category');
    res.json(achievements);
};

const getAllAchievements = async (req, res) => {
    const achievements = await Achievement.find({}).populate('user', 'name email studentId').populate('activity', 'name category');
    res.json(achievements);
};

const getAchievementById = async (req, res) => {
    const achievement = await Achievement.findById(req.params.id)
        .populate('user', 'name email studentId')
        .populate('activity', 'name category');

    if (achievement) {
        res.json(achievement);
    } else {
        res.status(404).json({ message: 'Achievement not found' });
    }
};

const updateAchievementStatus = async (req, res) => {
    const { status, adminNotes } = req.body;
    const achievement = await Achievement.findById(req.params.id);

    if (achievement) {
        achievement.status = status || achievement.status;
        achievement.adminNotes = adminNotes || achievement.adminNotes;

        const updatedAchievement = await achievement.save();
        res.json(updatedAchievement);
    } else {
        res.status(404).json({ message: 'Achievement not found' });
    }
};

const updateAchievement = async (req, res) => {
    const { activity, title, description, date } = req.body;
    const achievement = await Achievement.findById(req.params.id);

    if (!achievement) {
        return res.status(404).json({ message: 'Achievement not found' });
    }

    if (achievement.user.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized to update this achievement' });
    }

    achievement.activity = activity || achievement.activity;
    achievement.title = title || achievement.title;
    achievement.description = description || achievement.description;
    achievement.date = date || achievement.date;

    if (req.file) {
        achievement.proof = `/uploads/${req.file.filename}`;
    }

    const updatedAchievement = await achievement.save();
    res.json(updatedAchievement);
};

const deleteAchievement = async (req, res) => {
    const achievement = await Achievement.findById(req.params.id);

    if (!achievement) {
        return res.status(404).json({ message: 'Achievement not found' });
    }

    if (req.user.role === 'student' && achievement.user.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized to delete this achievement' });
    }
    
    await Achievement.deleteOne({ _id: achievement._id });
    res.json({ message: 'Achievement removed' });
};


module.exports = {
    upload,
    submitAchievement,
    getMyAchievements,
    getAllAchievements,
    getAchievementById,
    updateAchievementStatus,
    updateAchievement,
    deleteAchievement
};