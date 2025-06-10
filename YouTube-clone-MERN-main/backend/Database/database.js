require("dotenv").config();
const mongoose = require("mongoose");

// Use the MONGO_URI from .env if available, otherwise fallback to old style
const mongoUri = process.env.MONGO_URI ||
  `mongodb+srv://${process.env.DB_user}:${process.env.DB_password}@cluster0.f9aqief.mongodb.net/${process.env.DB_name}?retryWrites=true&w=majority`;

mongoose
  .connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected")) //If connected to DB
  .catch((err) => console.log(err)); //If not connected to DB