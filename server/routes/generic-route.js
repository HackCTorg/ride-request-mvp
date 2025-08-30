require('dotenv').config({ path: '../.env' });
const { MongoClient } = require('mongodb');
const express = require('express');


function createRouter(collectionName)
{
    const router = express.Router();

    const uri = process.env.MONGODB_URI;
    const dbName = process.env.DB_NAME;
    const client = new MongoClient(uri);
    let collection;
    connectDB(collectionName).catch(console.error);

    router.get(``, async (req, res) => {
        try {
            const file = await collection.find({}).toArray();
            res.json(file);
        } catch (error) {
            console.error(`Error fetching file ${collectionName}:`, error);
            res.status(500).json({ message: `Error fetching file ${collectionName}:`});
        }
    });

    router.get(`/aggregate`, async (req, res) => {
        try {
            const file = await getAggregate();
            res.json(file);
        } catch (error) {
            console.error(`Error fetching file ${collectionName}:`, error);
            res.status(500).json({ message: `Error fetching file ${collectionName}:`});
        }
    });

    router.get(`/:id`, async (req, res) => {
        try {
            const document = await collection.findOne({uuid: parseInt(req.params.id)});
            res.json(document);
        } catch (error) {
            console.error(`Error fetching document ${req.params.id} from collection ${collectionName}`, error);
            res.status(500).json({ message: `Error fetching document ${req.params.id} from collection ${collectionName}` });
        }
    });

    router.get(`/:id/aggregate`, async (req, res) => {
        try {
            const document = await collection.findOne({uuid: parseInt(req.params.id)});
            res.json(document);
        } catch (error) {
            console.error(`Error fetching document ${req.params.id} from collection ${collectionName}`, error);
            res.status(500).json({ message: `Error fetching document ${req.params.id} from collection ${collectionName}` });
        }
    });

    router.post(``, async (req, res) => {
        try {
            const document = req.body;
            const result = await collection.insertOne(document);
            res.json(result);
        } catch (error) {
            console.error(`Error creating new document in collection ${collectionName}:`, error);
            res.status(500).json({ message: `Error creating new document in collection ${collectionName}`});
        }
    });

    router.put(`/:uuid`, async (req, res) => {
        try {
            const uuid = req.params.uuid;
            const replacementDoc = {$set: req.body};
            const filter = {uuid: parseInt(uuid)};
            const result = await collection.updateOne(filter, replacementDoc);
            res.json(result);
        } catch (error) {
            console.error(`Error updating document ${uuid} in collection ${collectionName}:`, error);
            res.status(500).json({ message: `Error updating document ${uuid} in collection ${collectionName}:`});
        }
    });

    return router;

    async function connectDB(collectionName) {
        await client.connect();
        const db = client.db(dbName);
        collection = db.collection(collectionName);
        await collection.createIndex({ uuid: 1 }, { unique: true });
    }

    async function getAggregate(uuid)
    {
        let pipeline = [];

        if (uuid)
        {
            pipeline.push(
                {
                    '$match' : {
                        'uuid' : uuid
                    }
                }
            )
        }

        pipeline.push(
            {
                '$lookup' : {
                    'from' : 'users',
                    'localField' : 'serviceUserUuid',
                    'foreignField' : 'uuid',
                    'pipeline' : [{'$project': {'fullname': 1}}],
                    'as' : 'rider',
                }
            },
            {
                '$lookup' : {
                    'from' : 'providers',
                    'localField' : 'driverUuid',
                    'foreignField' : 'uuid',
                    'pipeline' : [{'$project': {'fullName': 1}}],
                    'as' : 'driver'
                }
            }
        );

        const rideRequestsWithRiderAndDriver = await collection.aggregate(pipeline).toArray();
        return rideRequestsWithRiderAndDriver;
    }
}

module.exports = createRouter;