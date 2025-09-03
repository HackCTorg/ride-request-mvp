require('dotenv').config({ path: '../.env' });
const {pipelineGenerators, pipelines} = require("./pipelines");

async function getCollection(collection)
{
    return await collection.find({}).toArray();
}

async function add(collection, document)
{
    return await collection.insertOne(document);
}

async function update(collection, uuid, replacementFields){
    const replacementDoc = {$set: replacementFields};
    const filter = {uuid: parseInt(uuid)};
    return await collection.updateOne(filter, replacementDoc);
}

async function fuzzyUserSearch(collection, searchTerm)
{
    const pipeline =
        pipelineGenerators.fuzzySearch("userSearch", searchTerm)
            .concat(pipelines.projectUserNameUuidAndPhone);
    const results = await collection.aggregate(pipeline).toArray();
    return results;
}

async function fuzzyProviderSearch(collection, searchTerm)
{
    const pipeline =
        pipelineGenerators.fuzzySearch("providerSearch", searchTerm)
            .concat(pipelines.projectProviderNameUuidAndPhone);
    const results = await collection.aggregate(pipeline).toArray();
    return results;
}

async function fuzzyVehicleSearch(collection, searchTerm)
{
    const pipeline =
        pipelineGenerators.fuzzySearch("vehicleSearch", searchTerm)
            .concat(pipelines.projectVehicleNameUuiAndFleetId);
    const results = await collection.aggregate(pipeline).toArray();
    return results;
}

async function fuzzySearch(collection, searchTerm, indexField) {
    const results = await collection.aggregate(pipelineGenerators.fuzzySearch(indexField, searchTerm))
    return await results.toArray();
}

async function getRideRequestsWithUserAndProviderData(collection)
{
    return await collection.aggregate(pipelines.userAndProviderDataAggregation).toArray();
}

async function getRideRequestWithUserAndProviderData(collection, uuid)
{
    const pipeline = pipelineGenerators.matchUuid(parseInt(uuid)).concat(pipelines.userAndProviderDataAggregation);
    const results = await collection.aggregate(pipeline).toArray();
    return results[0];
}

async function getByUuidString(collection, uuid)
{
    return await collection.findOne({uuid: parseInt(uuid)})
}

async function getSpecifiedFieldsOfDocument(collection, uuid, fields)
{
    const pipeline = pipelineGenerators.matchUuid(uuid).concat(pipelineGenerators.projectFields(fields));
    const results = await collection.aggregate(pipeline).toArray();
    return results[0];
}

async function getSpecifiedFieldsOfCollection(collection, fields)
{
    const pipeline = pipelineGenerators.projectFields(fields);
    return await collection.aggregate(pipeline).toArray();
}

module.exports = {
    getCollection,
    add,
    update,
    fuzzyUserSearch,
    fuzzyProviderSearch,
    fuzzyVehicleSearch,
    getRideRequestWithUserAndProviderData,
    getRideRequestsWithUserAndProviderData,
    getByUuidString,
    getSpecifiedFieldsOfDocument,
    getSpecifiedFieldsOfCollection
};