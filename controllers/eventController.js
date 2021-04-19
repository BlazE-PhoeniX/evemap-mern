const Event = require(`${__dirname}/../models/eventModel`);
const catchAsync = require(`${__dirname}/../utils/catchAsync`);
const ApiError = require(`${__dirname}/../utils/apiError`);
const factory = require(`${__dirname}/../utils/handlerFactory`);

exports.setUserInQuery = (req, res, next) => {
  req.query.user = req.user.id;
  next();
};

exports.setUserInBody = (req, res, next) => {
  req.body.user = req.user.id;
  next();
};

exports.getEvents = factory.getAll(Event, "Event");

exports.getEvent = factory.getOne(Event, "Event");

exports.addEvent = factory.createOne(Event, "Event");

exports.updateEvent = factory.updateOne(Event, "Event");

exports.deleteEvent = factory.deleteOne(Event, "Event");

exports.completeEvents = async (req, res, next) => {
  const events = await Event.find({ user: req.user });
  events.forEach(async event => {
    if (new Date(event.date) <= Date.now()) {
      await Event.findByIdAndUpdate(event.id, { completed: true });
    }
  });
  next();
};
