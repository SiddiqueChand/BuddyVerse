// Calling the "mongoose" package
const { text } = require("body-parser");
const { BSONType } = require("mongodb");
const mongoose = require("mongoose");

// Creating a Schema for uploaded events
const eventSchema = new mongoose.Schema({
  createdAt: {
    type: Date,
    default: Date.now,
  },
  eventID: {
    unique: true,
    type: String,
    trim: true,
    required: true,
  },
  eventName: {
    type: String,
    maxlength: 100,
    trim: true,
    required: true,
  },
  eventStartDate: {
    type: Date,
    required: true,
  },
  eventEndDate: {
    type: Date,
    required: true,
  },
  eventType: {
    type: String,
    trim: true,
    required: true,
  },
  eventLocation: {
    type: String,
    trim: true,
    required: true,
  },
  eventAbout: {
    type: String,
    trim: true,
    maxlength: 500,
    required: true,
  },
  eventBgPhoto: {
    type: Object,
    required: true,
    data: {
      type: Buffer,
      required: true,
    },
    contentType: {
      type: String,
      required: true,
    }
  },
  eventHeroPhoto: {
    type: Object,
    required: true,
    data: {
      type: Buffer,
      required: true,
    },
    contentType: {
      type: String,
      required: true,
    }
  }
});

const EventSchema = new mongoose.Schema({
  eventID: { type: String, required: true },
  eventName: { type: String, required: true },
  eventStartDate: { type: Date, required: true },
  eventEndDate: { type: Date, required: true },
  eventType: { type: String, required: true },
  eventLocation: { type: String, required: true },
  eventAbout: { type: String, required: true },
  eventBgPhoto: {
      contentType: { type: String, required: true },
      data: { type: Buffer, required: true },
  },
  eventHeroPhoto: {
      contentType: { type: String, required: true },
      data: { type: Buffer, required: true },
  },
});

module.exports = mongoose.model("Event", EventSchema);

// Creating a Model from that Schema
const Event = mongoose.model("Events", eventSchema);

// Exporting the Model to use it in app.js event.
module.exports = Event;