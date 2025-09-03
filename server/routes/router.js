require('dotenv').config({ path: '../.env' });
const express = require('express');


function createRouter(api)
{
    const router = express.Router();

    router.get(`/riderequests`, async (req, res) => {
        res.json(await api.getRideRequests());
    });

    router.get(`/riderequests/:id`, async (req, res) => {
        res.json(await api.getRideRequest(req.params.id));
    });

    router.post(`/riderequests`, async (req, res) => {
        res.json(await api.addRideRequest(req.body));
    });

    router.put(`/riderequests/:id`, async (req, res) => {
        res.json(await api.updateRideRequest(req.params.id, req.body));
    });

    router.get(`/users`, async (req, res) => {
        res.json(await api.getUsers());
    });

    router.get(`/users/:id`, async (req, res) => {
        res.json(await api.getUser(req.params.id));
    });

    router.get(`/users/:id/fields/:fields`, async (req, res) => {
        res.json(await api.getSpecifiedFieldsOfUser(req.params.id, req.params.fields.split(',')));
    });

    router.post(`/users`, async (req, res) => {
        res.json(await api.addUser(req.body));
    });

    router.get(`/users/fields/:fields`, async (req, res) => {
        res.json(await api.getSpecifiedFieldsOfUsers(req.params.fields.split(',')));
    });

    router.get(`/users/fuzzy/:searchTerm`, async (req, res) => {
        res.json(await api.fuzzyUserSearch(req.params.searchTerm));
    });

    router.get(`/providers`, async (req, res) => {
        res.json(await api.getProviders());
    });

    router.get(`/providers/:id`, async (req, res) => {
        res.json(await api.getProvider(req.params.id));
    });

    router.get(`/providers/fuzzy/:searchTerm`, async (req, res) => {
        res.json(await api.fuzzyProviderSearch(req.params.searchTerm));
    });

    router.post(`/providers`, async (req, res) => {
        res.json(await api.addProvider(req.body));
    });

    router.get(`/vehicles/fuzzy/:searchTerm`, async (req, res) => {
        res.json(await api.fuzzyVehicleSearch(req.params.searchTerm));
    });

    router.post(`/vehicles`, async (req, res) => {
        res.json(await api.addVehicle(req.body));
    });


    return router;
}

module.exports = createRouter;