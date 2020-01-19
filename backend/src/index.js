require('dotenv/config');
const express = require("express");
const cors = require("cors");
const http = require('http');

const routes = require("./routes");
const { setupWebsocket } = require('./websocket'); 
const calculateDistance = require('./utils/calculateDistance'); 

const app = express();
const server = http.Server(app);
setupWebsocket(server);

const mongoose = require("mongoose");
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useFindAndModify: true,
  useUnifiedTopology: true
});

app.use(cors());
app.use(express.json());
app.use(routes);

server.listen(3333);
