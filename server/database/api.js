require('dotenv').config({ path: '../.env' });
const database = require("./database");
const getDatabaseConnectionAsync = require("./connection");


async function generateApi()
{
    const dbUri = process.env.MONGODB_URI;
    const dbName = process.env.DB_NAME;

    const databaseConnection = await getDatabaseConnectionAsync(dbUri, dbName);

    let rideRequestCollection;
    let userCollection;
    let providerCollection;

    await Promise.all([
        databaseConnection.getCollectionAsync("ride-requests"),
        databaseConnection.getCollectionAsync("users"),
        databaseConnection.getCollectionAsync("service-providers")
        ]
    ).then(collections => {
        rideRequestCollection = collections[0];
        userCollection = collections[1];
        providerCollection = collections[2];
    })

    const api = {
        getRideRequest: async(uuid) => await database.getRideRequestWithUserAndProviderData(rideRequestCollection, uuid),
        getRideRequests: async() => await database.getRideRequestsWithUserAndProviderData(rideRequestCollection),
        addRideRequest: async(rideReq) => await database.add(rideRequestCollection, rideReq),
        updateRideRequest: async(uuid, replacementFields) => await database.update(rideRequestCollection, uuid, replacementFields),
        getUser: async(uuid) => await database.getByUuidString(userCollection, uuid),
        getUsers: async() => await database.getCollection(userCollection),
        addUser: async(user) => await database.add(userCollection, user),
        getProvider: async(uuid) => await database.getByUuidString(providerCollection, uuid),
        getProviders: async() => await database.getCollection(providerCollection),
        addProvider: async(provider) => await database.add(providerCollection, provider),
        fuzzyUserSearch: async(searchTerm) => await database.fuzzyUserSearch(userCollection, searchTerm),
        fuzzyProviderSearch: async(searchTerm) => await database.fuzzyProviderSearch(providerCollection, searchTerm),
    }

    return api;
}

module.exports = generateApi;