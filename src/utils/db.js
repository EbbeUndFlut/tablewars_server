const { MongoClient } = require("mongodb")
const uri = process.env.DB_URL
const client = new MongoClient(uri)

async function createCampaign(campaign) {
	await client.connect()
	const result = await client.db('tablewars').collection('campaigns').insertOne(campaign)
}


module.exports = createCampaign
