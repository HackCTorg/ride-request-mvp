require('dotenv').config({ path: '../../.env' });
const { MongoClient } = require('mongodb');
const express = require('express');

const router = express.Router();

const uri = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME;
const client = new MongoClient(uri);

let usersCollection;

async function connectDB() {
    await client.connect();
    const db = client.db(dbName);
    usersCollection = db.collection('service-users');
    await usersCollection.createIndex({ uuid: 1 }, { unique: true });
}

connectDB().catch(console.error);

router.post('/create-user', async (req, res) => {
    try {
        const user = req.body;
        const result = await usersCollection.insertOne(user);
        res.json(result);
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'Error creating user' });
    }
});

router.get('/get-users', async (req, res) => {
    try {
        const users = await usersCollection.find({}).toArray();
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Error fetching users' });
    }
});

module.exports = router;