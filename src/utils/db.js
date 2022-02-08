const { MongoClient } = require("mongodb")
const uri = process.env.DB_URL
const client = new MongoClient(uri)

async function createCampaign(campaign) {
	await client.connect()
	const result = await client.db('tablewars').collection('campaigns').insertOne(campaign)
}

async function createUser(user) {
	await client.connect()
	const result = await client.db('tablewars').collection('users').insertOne(user)
}

async function checkUser(user) {
	await client.connect()
	const result = await client.db('tablewars').collection('user').find(user).toArray()
	return result
}

module.exports = {
	createCampaign,
	checkUser,
}
