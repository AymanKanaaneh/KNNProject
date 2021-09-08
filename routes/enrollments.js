const express = require('express');
const Enrollments = require('../models/enrollment');
const router = express.Router();

router.get('/', async(req, res) => {
    const enrollments = await Enrollments.find();
    res.send(enrollments);
});

router.post('/', async(req, res) => {
    const fields = req.body;
    try {
        const { student, course, grade } = req.body;
        const enrollment = await Enrollments.create({ student, course, grade });
        res.send(enrollment);
    } catch (err) {
        console.error(err);
        res.sendStatus(400);
    }
});


module.exports = router;