const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 3000;
const studentsRoutes = require('./routes/students');
const coursesroutes = require('./routes/courses');
const enrollmentsRoutes = require('./routes/enrollments');
const path = require('path');

mongoose.connect('mongodb+srv://cluster0.ti9v3.mongodb.net?retryWrites=true&w=majority', {
    user: 'demouser',
    pass: 'demopassword',
    dbName: 'demo',
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
});

/*mongoose.connect('mongodb://localhost:27017/', {
	user: 'root',
	pass: 'hellowolrd',
	dbName: 'demo',
	useCreateIndex: true,
	useNewUrlParser: true,
	useUnifiedTopology: true
});*/

app.use(express.json());

app.use('/assets', express.static('static-assets'));

app.use('/api/course', coursesroutes);
app.use('/api/student', studentsRoutes);
app.use('/api/enrollment', enrollmentsRoutes);



app.get('/api/KNN', (req, res) => res.sendFile(path.join(__dirname, './models/KNN.JS')));

/*app.use('http', (res, req) => {
    var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
    res.sendFile(fullUrl);
});*/

app.get('/', (req, res) => res.sendFile(path.join(__dirname, '/index.html')));

app.listen(port, () => console.log(`server is running on http://localhost:${port}`));