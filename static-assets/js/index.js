$(window).load(async function() {


    var predictCourse;
    $('#multiple-checkboxes').multiselect();


    $('#btnPredict').click(function() {

        var courses = $('#multiple-checkboxes').val();
        predictCourse = $('.predictCourse').val();
        newStudent = createStudent(courses);
        var KNNResult = KNN(courses, newStudent);


        console.log(KNNResult);
    });

    function createStudent(courses) {

        newStudent = [];
        coursesTaken = {};
        courses.forEach(course => {
            let text;
            let grade = prompt("Please enter your grage in " + course);
            if (grade == null || grade == "") {
                text = "User cancelled the prompt.";
            } else {
                text = grade;
                coursesTaken[course] = grade;
            }
            //document.getElementById("demo").innerHTML = text;
        });

        newStudent.push(coursesTaken);
        return newStudent;
    }

});

/*
const {MongoClient} = require('mongodb');
const constants = require("constants");
const DB = "StudentsGrades"
const TABLE = "Grades"
const URI = "mongodb+srv://demo:helloworld@cluster0.u3osq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(URI);
*/