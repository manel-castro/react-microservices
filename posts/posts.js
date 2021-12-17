const express =require('express')
const bodyParser = require("body-parser")
const { randomBytes } =require('crypto')
const cors = require("cors")

// get posts list
// create post


const app = express()

app.use(bodyParser.json())
app.use(cors())

const posts = {}


app.get("/posts", (req,res) => {
    res.send(posts)
})


app.post("/posts", (req,res) => {
    console.log("req: ", req.body)
    const {title} = req.body;
    const id = randomBytes(4).toString("hex")
    posts[id] = {
        id,
        title
    }
    res.status(201).send(posts[id])
})

app.listen(4000, () => console.log("Listening to port 4000"))

