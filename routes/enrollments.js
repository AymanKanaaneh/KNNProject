const express = require('express');
const Enrollments = require('../models/enrollment');
const router = express.Router();

router.get('/', async(req, res) => {
    const enrollments = await Enrollments.find();
    res.send(enrollments);
});

router.get('/:enrollmentsId', async(req, res) => {
    const { enrollmentsId } = req.params;
    if (!enrollmentsId) {
        return res.sendStatus(400); // bad request
    }
    const enrollment = await Enrollments.findById(enrollmentsId);
    if (!enrollment) {
        return res.sendStatus(404); // not found
    }
    res.send(enrollment);
});

router.post('/', async(req, res) => {
    const fields = req.body;
    try {
        const enrollment = await Enrollments.create(fields);
        res.send(enrollment);
    } catch (err) {
        console.error(err);
        res.sendStatus(400);
    }
});


module.exports = router;