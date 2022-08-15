const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.json());

const events = [];

app.post("/events", (req, res) => {
  const event = req.body;

  events.push(event);

  axios
    .post("http://posts-clusterip-srv:4000/events", event)
    .catch((E) => console.log("error happened on event-bus: ", E));
  axios
    .post("http://comments-clusterip-srv:4001/events", event)
    .catch((E) => console.log("error happened on event-bus: ", E));
  axios
    .post("http://query-clusterip-srv:4002/events", event)
    .catch((E) => console.log("error happened on event-bus: ", E));
  axios
    .post("http://moderation-clusterip-srv:4003/events", event)
    .catch((E) => console.log("error happened on event-bus: ", E));

  res.send({ status: "OK" });
});

app.get("/events", (req, res) => {
  res.send(events);
});

app.listen(4005, () => console.log("event bus listening to port 4005 build 1"));
