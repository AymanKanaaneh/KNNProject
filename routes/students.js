const express = require('express');
const Students = require('../models/student');
const Courses = require('../models/course');
const Enrollments = require('../models/enrollment');
const router = express.Router();

router.get('/', async(req, res) => {
    const students = await Students.find();
    res.send(students);
});

router.get('/:studentId', async(req, res) => {
    const { studentId } = req.params;
    if (!studentId) {
        return res.sendStatus(400); // bad request
    }
    const student = await Students.findById(studentId);
    if (!student) {
        return res.sendStatus(404); // not found
    }
    res.send(student);
});

router.post('/', async(req, res) => {
    const fields = req.body;
    try {
        const student = await Students.create(fields);
        res.send(student);
    } catch (err) {
        console.error(err);
        res.sendStatus(400);
    }
});

router.delete('/:studentId', async(req, res) => {
    const { studentId } = req.params;
    if (!studentId) {
        return res.sendStatus(400); // bad request
    }
    await Enrollments.deleteMany({ student: studentId });
    await Students.findByIdAndDelete(studentId);
    res.sendStatus(200);
});

router.put('/:studentId', async(req, res) => {
    const { studentId } = req.params;
    if (!studentId) {
        return res.sendStatus(400); // bad request
    }
    const fields = req.body;
    try {
        const student = await Students.findByIdAndUpdate(studentId, fields, { new: true });
        res.send(student);
    } catch (err) {
        console.error(err);
        res.sendStatus(400);
    }
});

router.get('/:studentId/enroll', async(req, res) => {
    const { studentId } = req.params;
    const student = await Students.findById(studentId);
    if (!student) {
        return res.sendStatus(400);
    }
    const enrollments = await Enrollments.find({ student: student }, ['student', 'course', 'grade'])
        .populate('student,course', '_id');
    res.send(enrollments);
});

router.post('/:studentId/enroll', async(req, res) => {
    const { studentId } = req.params;
    const { courseId } = req.body;
    const student = await Students.findById(studentId);
    if (!student) {
        return res.sendStatus(400);
    }
    const course = await Courses.findById(courseId);
    if (!course) {
        return res.sendStatus(400);
    }
    const enrollment = await Enrollments.create({ course: course, student: student });
    res.send(enrollment);
});


module.exports = router;