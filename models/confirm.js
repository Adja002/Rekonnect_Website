const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const confirmSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    eventId: {
        type: Schema.Types.ObjectId,
        ref: 'Event',
        required: true
    },
    response: {
        type: String,
        enum: ['Confirmed', 'Undecided', 'Canceled'],
        required: true
    },
    respondedAt: {
        type: Date,
        default: Date.now
    }
});

const Confirm = mongoose.model('Confirm', confirmSchema);
module.exports = Confirm;
