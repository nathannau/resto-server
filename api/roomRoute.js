const { RoomModel } = require('../database');
const { Router } = require('express');
const { wrap } = require('./tools');

module.exports = new Router()
    .get('/', wrap(async  (req, res) => {
        const items = await RoomModel.getAll();
        res.json(items);
    }))
    .get('/:id', wrap(async (req, res) => { 
        const item = await RoomModel.getOne(req.params.id);
        res.json(item);
    }))
    .delete('/:id', wrap(async (req, res) => {
        console.log("delete")
        const item = await RoomModel.getOne(req.params.id);
        await item.delete();
        res.json(item);
    }))
    .post('/', wrap(async (req, res) => {
        const item = new RoomModel(req.body);
        await item.save();
        res.json(item);
    }))
    .post('/:id', wrap(async (req, res) => { 
        const item = await RoomModel.getOne(req.params.id);
        item.populate(req.body)
        await item.save();
        res.json(item);
    }))
