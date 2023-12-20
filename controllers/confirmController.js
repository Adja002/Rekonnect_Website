const ejs = require('ejs');
const path = require('path');
const Confirm = require('../models/confirm');
const Event = require('../models/event');

exports.createOrUpdateConfirm = async (req, res) => {

    const eventId = req.params.id;

    const event = await Event.findById({"_id":eventId});
    if (!event) return res.status(404).json({ message: "Event has not found" });

    if (req.method === "GET") {
        const existingConfirm = await Confirm.findOne({ userId: req.session.user.id, eventId: eventId });

        const content = await ejs.renderFile(
            path.join(__dirname, "..", "views", "eventAttendance.ejs"),
            { confirm: existingConfirm, event }
        );
        return res.render("partials/layout", {
            body: content
        });
    }

    if (req.method === "POST") {
        const confirm = req.body;

        const existingConfirm = await Confirm.findOne({ userId: req.session.user.id, eventId: eventId });

        confirm.userId = req.session.user.id;
        confirm.eventId = eventId;
    
        if (existingConfirm) {
            await Confirm.findByIdAndUpdate(existingConfirm._id, confirm);
        } else {
            const newConfirm = new Confirm(confirm);
            await newConfirm.save();
        }

        res.redirect(`/events/${eventId}`);
    }   
}


exports.updateConfirm= async (req, res) => {
    try{
        const { id } = req.params;
        const { userId, eventId, response, respondedAt } = req.body;
        const confirm = await Confirm.findByIdAndUpdate(id, { userId, eventId, response, respondedAt }, { new: true });
        res.status(200).json({ confirm });
    }
    catch(error){
        res.status(500).json({ error: error.message });
    }

}

exports.deleteConfirm = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Confirm.findByIdAndDelete(id);
        if (deleted) {
            return res.status(200).send("Confirmation deleted");
        }
        throw new Error("Confirmation not found");
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}