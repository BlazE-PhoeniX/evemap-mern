const express = require("express");

const eventController = require(`${__dirname}/../controllers/eventController`);
const authController = require(`${__dirname}/../controllers/authController`);

const router = express.Router();

router.use(authController.verifyUser);

router
  .route("/:id")
  .get(authController.verifyUser, eventController.getEvent)
  .patch(eventController.setUserInQuery, eventController.updateEvent)
  .delete(eventController.setUserInQuery, eventController.deleteEvent);

router
  .route("/")
  .get(
    eventController.completeEvents,
    eventController.setUserInQuery,
    eventController.getEvents
  )
  .post(eventController.setUserInBody, eventController.addEvent);

module.exports = router;
