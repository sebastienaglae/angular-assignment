const express = require('express');
const router = express.Router();
const SubjectService = require('../services/subject');

const {SubjectDto} = require('../models/dto/subject');

const {ObjectNotFoundError} = require("../models/error");
const {ObjectIdValidator} = require('../util/validator');

router.get('/', async (req, res, next) => {
    try {
        const list = await SubjectService.fetchAll();

        res.json(list.map(SubjectDto));
    } catch (error) {
        next(error);
    }
});

router.get('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        ObjectIdValidator('id', id);

        const subject = await SubjectService.fetch(id);

        if (!subject) {
            throw new ObjectNotFoundError('Subject not found');
        }

        res.json(SubjectDto(subject));
    } catch (error) {
        next(error);
    }
});

module.exports = router;
