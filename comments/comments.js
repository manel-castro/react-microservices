const express = require("express");
const bodyParser = require("body-parser");
const { randomBytes } = require("crypto");
const cors = require("cors");
const axios = require("axios");

// get posts list
// create post

const app = express();

app.use(bodyParser.json());
app.use(cors());

const commentsByPostId = {};

app.get("/posts/:id/comments", (req, res) => {
  res.send(commentsByPostId[req.params.id] || []);
});

app.post("/posts/:id/comments", async (req, res) => {
  const commentId = randomBytes(4).toString("hex");
  const postId = req.params.id;
  const { content } = req.body;

  const comments = commentsByPostId[postId] || [];

  const newComment = { id: commentId, content, status: "pending" };
  comments.push(newComment);

  commentsByPostId[postId] = comments;

  await axios
    .post("http://localhost:4005/events", {
      type: "CommentCreated",
      data: {
        ...newComment,
        postId,
      },
    })
    .catch((e) => console.log("error while sending comment to event bus: ", e));

  res.status(201).send(comments);
});

app.post("/events", async (req, res) => {
  console.log("Received Event: ", req.body.type);

  const { type, data } = req.body;

  if (type === "CommentModerated") {
    const { postId, id, status, content } = data;
    const comments = commentsByPostId[postId] || [];

    const comment = comments.find((comment) => comment.id === id);

    console.log("status is: ", status);

    console.log("comment.status is: ", comment.status);

    comment.status = status;

    await axios
      .post("http://localhost:4005/events", {
        type: "CommentUpdated",
        data: {
          id,
          status,
          postId,
          content,
        },
      })
      .catch((e) => console.log("axios error when comment updated: ", e));
  }

  res.send({});
});

app.listen(4001, () => console.log("comments listening to port 4001"));
