const express = require("express")
const cors = require("cors")
const app = express()
const PORT = 9898
let counts = 0

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get("/api/", (req, res) => {
    require("./utils/db.js")
    res.end("Welcome")
})

app.post("/api/createcampaign", (req, res) => {
    console.log(req.body.campaign)
    res.status(200).end()
})

app.get("/counter", (req, res) => {
    console.log("anfrage")
    counts++

    res.status(200).json({ count: counts })
})
app.listen(PORT, () => {
    console.log("Server listen on port:", PORT)
})
