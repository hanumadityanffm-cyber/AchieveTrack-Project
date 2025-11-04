const express = require('express');
const {
    upload,
    submitAchievement,
    getMyAchievements,
    getAllAchievements,
    getAchievementById,
    updateAchievementStatus,
    updateAchievement,
    deleteAchievement
} = require('../controllers/achievementController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
    .post(protect, upload.single('proof'), submitAchievement)
    .get(protect, authorizeRoles('admin'), getAllAchievements);

router.get('/my', protect, getMyAchievements);

router.route('/:id')
    .get(protect, getAchievementById)
    .put(protect, upload.single('proof'), updateAchievement) // Students can update their own pending achievements with new proof
    .delete(protect, deleteAchievement); // Students can delete their own, admin can delete any

router.put('/:id/status', protect, authorizeRoles('admin'), updateAchievementStatus);

module.exports = router;