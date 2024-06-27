const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
    name: { type: String, required: true },
    totalIntake: {type: Number, required: true},
    availableSeats: { type: Number, required: true }
});

const categorySchema = new mongoose.Schema({
    categoryName: { type: String, required: true },
    categoryCredit: {type: Number, default: 0},
    subjects: [subjectSchema]
});

const courseSchema = new mongoose.Schema({
    semester: { type: String, required: true },
    category: [categorySchema]
});

const Course = mongoose.models.Course || mongoose.model('Course', courseSchema);

module.exports = Course;
