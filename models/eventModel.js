const mongoose = require("mongoose");
const Email = require("./../utils/email");

const EventSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Event name must not be a empty string"],
      unique: [true, "Event with the name already exists"],
    },

    date: {
      type: Date,
      required: [true, "Event must have a date"],
      validate: {
        validator: function (val) {
          return new Date(val) > Date.now();
        },
        message: "Date and time already passed, Please use a valid date",
      },
    },

    description: {
      type: String,
    },

    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },

    location: {
      type: {
        type: String,
        default: "Point",
        enum: ["Point"],
      },
      coordinates: {
        type: [Number],
        required: [true, "Event location must have coordinates"],
      },
      address: {
        type: String,
        required: [true, "Event location must have address"],
      },
    },

    completed: {
      type: Boolean,
      default: false,
      select: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

EventSchema.index({ location: "2dsphere" });

EventSchema.virtual("status").get(function () {
  return `${
    this.name[0].toUpperCase() + this.name.slice(1)
  } on ${this.date.toLocaleString("en-IN", { day: "numeric", month: "long", year: "numeric" })}`;
});

EventSchema.pre(/^find/, function (next) {
  this.find({ completed: { $ne: true } });
  next();
});

EventSchema.post("save", function (doc) {
  // doc.setRemainder(doc);
  doc.setTimer(doc);
});

EventSchema.methods.setTimer = function (doc) {
  setTimeout(async () => {
    const event = await doc.constructor.findById(doc.id);
    if (new Date(event.date).getTime() <= Date.now()) {
      await event.constructor.findByIdAndUpdate(event.id, { completed: true });
    } else {
      event.setTimer(event);
    }
  }, new Date(doc.date) - Date.now());
};

// EventSchema.methods.setRemainder = function (doc) {
//   const timeInMs = new Date(doc.date) - Date.now() - 15 * 60 * 1000;

//   if (timeInMs > 0) {
//     setTimeout(async () => {
//       const event = await doc.constructor.findById(doc.id).populate({
//         path: "user",
//         select: "name email",
//       });
//       if (new Date(event.date).getTime() - 15 * 60 * 1000 <= Date.now()) {
//         await new Email(
//           event.user,
//           `${req.protocol}://${req.get("host")}/`
//         ).sendRemainder();
//       } else {
//         event.setRemainder(event);
//       }
//     }, timeInMs);
//   }
// };

const Event = mongoose.model("Event", EventSchema);

module.exports = Event;
