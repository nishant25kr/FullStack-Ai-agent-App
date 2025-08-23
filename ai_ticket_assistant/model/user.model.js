import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: "user",
        enum: ['user', 'modetator', 'admin']
    },
    skills: [String]

}, { timestamps: true })

export default mongoose.model('User', userSchema)