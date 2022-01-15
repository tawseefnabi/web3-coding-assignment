const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// create student schema & model
const UserSchema = new Schema({
    user_id: {
        type: String,
        required: [true, 'User ID field is required'],
        unique: true
    },
    login: {
        type: String,
        required: [true, 'Login field is required']
    },
    password: {
        type: String,
        required: [true, 'Password field is required']
    }
},
{
    timestamps: true
}
);


const User = mongoose.model('user',UserSchema);

module.exports = User;
