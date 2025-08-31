require('dotenv').config({ path: '../.env' });
const { MongoClient } = require('mongodb');

async function getDatabaseConnectionAsync(dbUri, dbName)
{
    // Should these share a client or should there be multiple clients?
    const client = await new MongoClient(dbUri).connect();

    async function getCollectionAsync(collectionName) {
        const db = client.db(dbName);
        const collection = db.collection(collectionName);
        await collection.createIndex({ uuid: 1 }, { unique: true });
        return collection;
    }

    return {getCollectionAsync};
}

module.exports = getDatabaseConnectionAsync;