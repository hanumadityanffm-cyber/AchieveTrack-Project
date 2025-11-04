const mongoose = require('mongoose');

const achievementSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        activity: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Activity',
        },
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
        },
        date: {
            type: Date,
            required: true,
        },
        proof: {
            type: String,
        },
        status: {
            type: String,
            enum: ['Pending', 'Approved', 'Rejected'],
            default: 'Pending',
        },
        adminNotes: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

const Achievement = mongoose.model('Achievement', achievementSchema);

module.exports = Achievement;