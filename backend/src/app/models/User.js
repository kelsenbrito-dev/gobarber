import mongoose from 'mongoose';

/** Schema para negócios relacionados ao usuário **/
const Schema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        index: true,
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: true
    },
    avatar: {
        type: String
    }
},
{
    timestamps: {
        createdAt: 'createdAt',
        updatedAt: 'updatedAt'
    }
});

export default mongoose.model('Users', Schema)