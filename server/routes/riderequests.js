require('dotenv').config({ path: '../../.env' });
const { MongoClient } = require('mongodb');
const express = require('express');

const router = express.Router();

const uri = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME;
const client = new MongoClient(uri);

let rideRequestsCollection;

async function connectDB() {
    await client.connect();
    const db = client.db(dbName);
    rideRequestsCollection = db.collection('ride-requests');
    await rideRequestsCollection.createIndex({ uuid: 1 }, { unique: true });
}

connectDB().catch(console.error);

router.get('/get-ride-requests', async (req, res) => {
    try {
        const rideRequests = await rideRequestsCollection.find({}).toArray();
        res.json(rideRequests);
    } catch (error) {
        console.error('Error fetching ride requests:', error);
        res.status(500).json({ message: 'Error fetching ride requests' });
    }
});

router.post('/create-ride-request', async (req, res) => {
    try {
        const rideRequest = req.body;
        const result = await rideRequestsCollection.insertOne(rideRequest);
        res.json(result);
    } catch (error) {
        console.error('Error creating ride request:', error);
        res.status(500).json({ message: 'Error creating ride request' });
    }
});


router.delete('/delete-ride-request/:uuid', async (req, res) => {
    try {
        const uuid = req.params.uuid;
        const result = await rideRequestsCollection.deleteOne({ uuid });
        res.json(result);
    } catch (error) {
        console.error('Error deleting ride request:', error);
        res.status(500).json({ message: 'Error deleting ride request' });
    }
});

module.exports = router;