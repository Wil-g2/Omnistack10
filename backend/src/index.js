const express = require("express");
const app = express();
const routes = require("./routes");
const cors = require("cors");

const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/omnistack", {
  useNewUrlParser: true,
  useFindAndModify: true,
  useUnifiedTopology: true
});

app.use(cors());
app.use(express.json());
app.use(routes);

app.listen(3333);
