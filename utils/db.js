const { MongoClient } = require("mongodb")
const URL = "mongodb://localhost:27017/"

MongoClient.connect(URL, (err, db) => {
    if (err) console.log(err)

    let dbo = db.db("campaign")
    dbo.createCollection("players", (err, res) => {
        if (err) console.log(err)
        console.log("collection created")
        db.close()
    })
})
