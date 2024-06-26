const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const studentSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
    },
    password: { type: String, required: true },
    semester: {type: String, required: true},
    paymentStatus: {type: Boolean, default: false},
    pay_reference: {type: String},
    courseRegistration: {type: Boolean, default: false},
    courses: {
        type: [{ courseName: String, credits: { type: Number, default: 0 } }],
        default: []
    }
});

studentSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});


studentSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

const Student = mongoose.models.Student || mongoose.model('Student', studentSchema);

module.exports = Student;