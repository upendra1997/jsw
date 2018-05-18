const {Schema} = require('mongoose');

const historySchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    Object: {
        type: Schema.Types.Mixed,
        required: true,
    }
});


module.exports = {historySchema};