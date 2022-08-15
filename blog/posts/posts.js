const express = require("express");
const bodyParser = require("body-parser");
const { randomBytes } = require("crypto");
const cors = require("cors");
const axios = require("axios");

// get posts list
// create post

const app = express();

console.log("POSTS started");

app.use(bodyParser.json());
app.use(cors());

const posts = {};

app.get("/posts", (req, res) => {
  console.log("posts requested");
  res.send(posts);
});

app.post("/posts/create", async (req, res) => {
  console.log("req: ", req.body);
  const { title } = req.body;
  const id = randomBytes(4).toString("hex");
  const newPost = {
    id,
    title,
  };

  posts[id] = newPost;

  await axios
    .post("http://event-bus-srv:4005/events", {
      type: "PostCreated",
      data: newPost,
    })
    .catch((e) => console.log("error while sending to event bus: ", e));

  res.status(201).send(posts[id]);
});

app.post("/events", (req, res) => {
  console.log("Received Event: ", req.body.type);
  res.send({});
});

app.listen(4000, () => {
  console.log("updating k8s");
  console.log("333 updating k8s");
  console.log("11 updating k8s");
  console.log("Listening to port 4000");
});
