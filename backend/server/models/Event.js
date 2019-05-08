// server/models/Event.js
const mongoose = require('mongoose');
const mongooseTypes = mongoose.Schema.Types;

let EventSchema = new mongoose.Schema(
    {
        title: String,
        time: mongooseTypes.Date,
        tags: [{ type: String }],
        chefs: [{ type: mongooseTypes.ObjectId }],
        host: mongooseTypes.ObjectId,
        dishes: [{ type: mongooseTypes.ObjectId }],
    }
);

EventSchema.methods.getEvent = function (_title) {
    Event.find({'title': _title}).then((event) => {
        return event
    })
};

module.exports = mongoose.model('Event', EventSchema);
