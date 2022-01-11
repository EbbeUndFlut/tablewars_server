const express = require("express")
const app = express()
const PORT = 9898

app.get("/api/", (req, res) => {
    res.end("Welcome")
})

app.listen(PORT, () => {
    console.log("Server listen on port:", PORT)
})
