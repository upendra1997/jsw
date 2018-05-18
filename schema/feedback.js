const {Schema} = require('mongoose');

const feedbackSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    feedback: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 2048,
        trim: true,
    }
});


module.exports = {feedbackSchema};