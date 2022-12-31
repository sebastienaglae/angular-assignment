const express = require('express');
const router = express.Router();
const TeacherService = require('../services/teacher');

const {TeacherDto} = require('../models/dto/teacher');

const {ObjectNotFoundError} = require("../models/error");
const {StringLengthValidator, NumberValidator, ObjectIdValidator} = require('../util/validator');

router.get('/search', async (req, res, next) => {
    try {
        const name = req.query.name || '';
        const limit = req.query.limit;

        StringLengthValidator('name', name, 0, 100);
        NumberValidator('limit', limit, 1, 50);

        const teachers = await TeacherService.search(name, limit);

        res.json(teachers.map(TeacherDto));
    } catch (error) {
        next(error);
    }
});

router.get('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        ObjectIdValidator('id', id);

        const teacher = await TeacherService.fetch(id);

        if (!teacher) {
            throw new ObjectNotFoundError('Subject not found');
        }

        res.json(TeacherDto(teacher));
    } catch (error) {
        next(error);
    }
});

module.exports = router;
