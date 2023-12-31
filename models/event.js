const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const eventSchema = new Schema({
  organizerId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ["Professional Development", "Networking", "Campus Events"],
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
  location: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: false,
  },
  visibility: {
    type: String,
    enum: ["Public", "Private"],
    default: "Public",
    required: true,
  },
});

const Event = mongoose.model("Event", eventSchema);
module.exports = Event;
