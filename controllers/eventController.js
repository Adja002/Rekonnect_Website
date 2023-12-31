const ejs = require("ejs");
const path = require("path");

const Event = require("../models/event");
const Confirm = require("../models/confirm");
const mongoose = require("mongoose");

exports.getEvents = async (req, res) => {
  const isAuthenticated = req.session.isAuthenticated;
  const eventsQuery = isAuthenticated ? {} : { visibility: "Public" };

  const page = parseInt(req.query.page) || 1; 
  const limit = 15; 
  const skip = (page - 1) * limit; 
  const totalEvents = await Event.countDocuments(eventsQuery);
  const totalPages = Math.ceil(totalEvents / limit);
  const events = await Event.find(eventsQuery).skip(skip).limit(limit);

  events.forEach((event) => {
    event.isOrganizer =
      isAuthenticated &&
      event.organizerId.toString() === req.session.user.id.toString();
  });

  const content = await ejs.renderFile(
    path.join(__dirname, "..", "views", "events.ejs"),
    { events, page, totalPages }
  );

  res.render("partials/layout", {
    body: content,
  });
};

exports.createOrUpdateEvent = async (req, res) => {

  let event = null;
  let message = null;
  if (req.method === "POST") {
    try {

      if (req.body.id) {
        event = await Event.findById(
          new mongoose.Types.ObjectId(req.body.id)
        );
        if (!event) return res.status(404).json({ message: "Event has not been found" });
        event.title = req.body.title;
        event.description = req.body.description;
        event.category = req.body.category;
        event.date = req.body.date;
        event.location = req.body.location;
        event.image = req.body.image;
        event.visibility = req.body.visibility;
        await event.save();
        message = "Event has been updated successfully";
        return res.redirect(`/events/${event._id}`);
      }

      const payload = req.body;
      console.log("payload: ", payload);
      payload.organizerId = req.session.user.id;

      event = new Event(payload);
      await event.save();
      message = "Event has been created successfully";
      return res.redirect("/events");
    } catch (error) {
      message = `Failed creating the event ${error.message} ${req.session.user}`;
    }
  }
  else if (req.method === "GET") {

    event = await Event.findById(
      new mongoose.Types.ObjectId(req.params.id)
    );

  }

  const content = await ejs.renderFile(
    path.join(__dirname, "..", "views", "addEvents.ejs"),
    { message, event }
  );

  res.render("partials/layout", {
    body: content
  });
};

exports.getEvent = async (req, res) => {
  console.log("event Id: ", req.params.id);
  const event = await Event.findById(
    new mongoose.Types.ObjectId(req.params.id)
  );
  if (!event) return res.status(404).json({ message: "Event has not been found" });

  let isOrganizer = false;
  let participants = null;

  if (event.organizerId.toString() === req.session?.user?.id.toString()) {
    isOrganizer = true;
  }

  if (isOrganizer || (req.session.user && req.session.user.role === "admin")) {
    participants = await Confirm.aggregate([
      {
        $match: {
          eventId: new mongoose.Types.ObjectId(req.params.id),
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
      {
        $project: {
          "user._id": 1,
          "user.email": 1,
          "user.firstName": 1,
          "user.lastName": 1,
          response: 1,
        },
      },
    ]);
}


  const content = await ejs.renderFile(
    path.join(__dirname, "..", "views", "event.ejs"),
    { event, participants, isOrganizer }
  );

  res.render("partials/layout", {
    body: content,
  });
};

exports.deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Event.findByIdAndDelete(id);
    if (deleted) {
      return res.redirect("/events");
    }
    throw new Error("Event not found");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
