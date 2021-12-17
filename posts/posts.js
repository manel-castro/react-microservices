const express =require('express')
const bodyParser = require("body-parser")
const { randomBytes } =require('crypto')
const cors = require("cors")
const axios = require("axios")

// get posts list
// create post


const app = express()

app.use(bodyParser.json())
app.use(cors())

const posts = {}


app.get("/posts", (req,res) => {
    res.send(posts)
})


app.post("/posts", async (req,res) => {
    console.log("req: ", req.body)
    const {title} = req.body;
    const id = randomBytes(4).toString("hex")
    const newPost = {
        id,
        title
    }
    
    posts[id] = newPost

    await axios.post("http://localhost:4005/events", {
        type:"PostCreated",
        data: newPost
    }).catch(e=> console.log("error while sending to event bus: ", e))

    res.status(201).send(posts[id])
})

app.listen(4000, () => console.log("Listening to port 4000"))

