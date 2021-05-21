const express = require("express");
const morgan = require("morgan");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const cookieParser = require("cookie-parser");
const compression = require("compression");
const cors = require("cors");

const ApiError = require(`${__dirname}/utils/apiError`);
const globalErrorController = require(`${__dirname}/controllers/errorController`);

const eventRouter = require(`${__dirname}/routes/eventRoutes`);
const userRouter = require(`${__dirname}/routes/userRoutes`);
const viewRouter = require(`${__dirname}/routes/viewRoutes`);

const app = express();
app.enable("trust proxy");

// to initialise pug templates
// app.set("view engine", "pug");
// app.set("views", `${__dirname}/views`);

// parses body and limits size
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// to allow cross origin requests
app.use(cors());

// to allow complex requests from cross origin (origin is simply the host url)
app.options("*", cors());

// protects against no sql attacks
app.use(mongoSanitize());

// protects against cross site scripting
app.use(xss());

// protects against parameter pollution (Removes duplicates)
app.use(
  hpp({
    whitelist: [],
  })
);

// serving static files
// app.use(express.static(`${__dirname}/public`));
app.use(express.static(`${__dirname}/client/build`));

// logging
if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

// app.use("*", (req, res, next) => {
//   console.log(req.body);
//   next();
// });

// compression text in response
app.use(compression());

// app.use("/", viewRouter);
app.use("/api/v1/events", eventRouter);
app.use("/api/v1/users", userRouter);

app.all("*", (req, res, next) => {
  // next(
  //   new ApiError(404, "fail", `Cant find ${req.originalUrl} on this server`)
  // );
  res.sendFile("index.html");
});

// Handle all errors all together
app.use(globalErrorController);

module.exports = app;
