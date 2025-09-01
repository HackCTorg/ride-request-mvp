require('dotenv').config({ path: '../../.env' });
const { MongoClient } = require('mongodb');
const express = require('express');

const router = express.Router();

const uri = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME;
const client = new MongoClient(uri);

let providersCollection;

async function connectDB() {
    await client.connect();
    const db = client.db(dbName);
    providersCollection = db.collection('service-providers');
    await providersCollection.createIndex({ uuid: 1 }, { unique: true });
}

connectDB().catch(console.error);

router.post('/create-provider', async (req, res) => {
    try {
        const provider = req.body;
        const result = await providersCollection.insertOne(provider);
        res.json(result);
    } catch (error) {
        console.error('Error creating provider:', error);
        res.status(500).json({ message: 'Error creating provider' });
    }
});

router.get('/get-providers', async (req, res) => {
    try {
        const providers = await providersCollection.find({}).toArray();
        res.json(providers);
    } catch (error) {
        console.error('Error fetching providers:', error);
        res.status(500).json({ message: 'Error fetching providers' });
    }
});

module.exports = router;