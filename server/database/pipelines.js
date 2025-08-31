const pipelines = {

    userAndProviderDataAggregation: [
        {
            '$lookup': {
                'from': 'users',
                'localField': 'serviceUserUuid',
                'foreignField': 'uuid',
                'pipeline': [{'$project': {'fullname': 1}}],
                'as': 'rider',
            }
        },
        {
            '$lookup': {
                'from': 'providers',
                'localField': 'driverUuid',
                'foreignField': 'uuid',
                'pipeline': [{'$project': {'fullName': 1}}],
                'as': 'driver'
            }
        }
    ],

    projectUserNameUuidAndPhone: [
        {
            '$project': {
                'fullname': 1,
                'uuid': 1,
                'phone': 1
            }
        }
    ],

    projectProviderNameUuidAndPhone: [
        {
            '$project': {
                'fullName': 1,
                'uuid': 1,
                'phone': 1
            }
        }
    ]
}

const pipelineGenerators = {
    fuzzySearch: (indexField, searchTerm) => [
        {
            $search: {
                "index": indexField,
                "text": {
                    "path": {
                        wildcard: "*"
                    },
                    "query": searchTerm,
                    "fuzzy": {}
                }
            }
        }
    ],

    matchUuid: (uuid) => [
        {
            '$match' : {
                'uuid' : uuid
            }
        }
    ]
}

module.exports = {pipelines, pipelineGenerators};