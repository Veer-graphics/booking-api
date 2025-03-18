import express from "express";
import * as Sentry from "@sentry/node";

const app = express();
import amenitiesRouter from './routes/amenities.js';
import loginRouter from './routes/login.js';
import hostRouter from './routes/hosts.js';
import propertyRouter from './routes/properties.js';
import reviewRouter from './routes/reviews.js';
import userRouter from './routes/users.js';
import bookingRouter from './routes/bookings.js';
import errorHandler from './middleware/errorHandler.js';
import log from './middleware/logMiddleware.js';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  integrations: [

    new Sentry.Integrations.Http({
      tracing: true,
    }),

    new Sentry.Integrations.Express({
      app,
    }),
  ],
  // Performance Monitoring
  tracesSampleRate: 1.0, // Capture 100% of the transactions, reduce in production!,
});

app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());
app.use(Sentry.Handlers.errorHandler());
app.use(errorHandler);
app.use(log)

app.get("/", (req, res) => {
  res.send("Hello world!");
});


app.use(express.json());
app.use('/amenities', amenitiesRouter);
app.use('/hosts', hostRouter);
app.use('/properties', propertyRouter);
app.use('/reviews', reviewRouter);
app.use('/users', userRouter);
app.use('/bookings', bookingRouter);
app.use('/login', loginRouter);

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
