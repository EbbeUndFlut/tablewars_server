const express = require("express")
const cors = require("cors")
const jwt = require("jsonwebtoken")
const dotenv = require("dotenv")
dotenv.config()
const app = express()
const PORT = 9898
const { createCampaign, checkUser } = require("./utils/db.js")
let counts = 0

let tokenCreation = (req, res, next) => {
    checkUser({
        name: req.body.user,
        password: req.body.pass,
    }).then((data) => console.log("HIER IST DER USER", data[0]._id))
    // token needs exp time etc.
    let token = jwt.sign({ user: req.body.user }, process.env.TOKEN_SECRET)
    res.locals.token = token
    next()
}

let tokenCheck = (req, res, next) => {
    // token aus dem request fischen
    let token = req.headers.authorization
    token = token.split(" ")
    token = token[1]
    console.log(token)
    try {
        const check = jwt.verify(token, process.env.TOKEN_SECRET)
        console.log("SUPER DUPER")
    } catch (err) {
        console.log("HURRA EIN FEHLER IST DA")
    }
    // token veryfien
    next()
}

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get("/api/", (req, res) => {
    res.end("Welcome")
})

app.post("/api/login", tokenCreation, (req, res) => {
    console.log(res.locals.token)
    res.status(200).json({ token: res.locals.token })
})
app.post("/api/createcampaign", tokenCheck, async (req, res) => {
    createCampaign(req.body)
    res.status(200).end()
})

app.get("/api/validate", tokenCheck, (req, res) => {
    res.status(200).end()
})
app.get("/counter", (req, res) => {
    counts++

    res.status(200).json({ count: counts })
})
app.listen(PORT, () => {
    console.log("Server listen on port:", PORT)
})
