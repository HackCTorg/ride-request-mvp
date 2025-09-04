require('dotenv').config({ path: '../.env' });
const { MongoClient } = require('mongodb');

async function getDatabaseConnectionAsync(dbUri)
{
    // Should these share a client or should there be multiple clients?
    const client = await new MongoClient(dbUri).connect();

    async function getCollectionAsync(collectionName) {
        const db = client.db();
        const collection = db.collection(collectionName);
        await collection.createIndex({ uuid: 1 }, { unique: true });
        return collection;
    }

    return {getCollectionAsync};
}

async function configSearchIndex(collection, indexName) {
    let index;
    do {
        const indexes = await collection.listSearchIndexes().toArray();
        index = indexes.find(index => index.name === indexName);
        if (!index) {
            const result = await collection.createSearchIndex(
                {
                    name: indexName,
                    definition: {
                        mappings: {
                            dynamic: true
                        }
                    }
                }
            );
            if (!result || result !== indexName) {
                throw new Error(`Error creating search index ${indexName}`);
            }
        }
    } while (!index);

    while (!index || index.status !== "READY") {
        await delay(1000);

        const indexes = await collection.listSearchIndexes().toArray();
        index = indexes.find(index => index.name === indexName);
    }
}

function delay(ms)
{
    return new Promise(res => setTimeout(res, ms));
}

module.exports = {getDatabaseConnectionAsync, configSearchIndex}