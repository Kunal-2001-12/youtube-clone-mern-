const express = require("express");
const router = require("./Router/router");
const app = express();
const path = require("path");
const port = 4000;
const bodyParser = require("body-parser");
const cors = require("cors");

// CORS middleware
app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5174",
    "http://localhost:5177",
    "http://127.0.0.1:5177"
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, "public")));

// Parse JSON bodies
app.use(express.json());

// Middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(router);
app.set("view engine", "hbs");
app.set('views', path.join(__dirname, 'views'));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
