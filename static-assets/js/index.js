import { KNN, predicted_grade, sigma, distance } from '/assets/js/KNN.js';


$(window).load(async function() {

    //addData();

    var predictCourse; //this course what the student want to predict it's gade
    var multipleCourses; //json list of previous student's courses with his grades

    //all courses in the system from mongoDb
    var allCourses = await fetch('/api/course').then(response => response.json());
    //all students in the system from mongoDb
    var allStudents = await fetch('/api/student').then(response => response.json());
    //all grades in the system from mongoDb
    var allGrades = await fetch('/api/enrollment').then(response => response.json());
    var newStudentSample; //student sample to KNN paramter algorthim
    var coursesTaken; //student selected taken courses from user interface application
    var KNNData; //list of json that each element is student with his courses and it's grades
    var KNNResult; //the result grade of KNN allgrorthim




    fillCourses(); //fill the select box with courses from mongoDb
    $('#multiple-checkboxes').multiselect();

    $('#btnPredict').click(async function() {

        //student selected previous courses
        multipleCourses = $('#multiple-checkboxes').val();
        //student selected predict course grade he is want
        predictCourse = $('.predictCourse').val();

        if (predictCourse && multipleCourses) {


            if (!checkCourseTaken(multipleCourses, predictCourse)) {

                KNNData = await createKNNData(allGrades);
                newStudentSample = createStudent(multipleCourses);



                KNNResult = KNN(KNNData, newStudentSample, predictCourse);


                //console.log(multipleCourses);
                //console.log(predictCourse);

                //console.log(KNNData);
                console.log(KNNResult);
                //console.log(newStudentSample);
                //console.log(predictCourse);
            } else {
                alert("This predict course already exist in previous courses");
            }

        } else {
            alert('You should choose which course you want to predict and your previous courses');
        }
    });


    function fillCourses() {

        allCourses.forEach(course => {
            $('.SCourses').append(`<option value="${course["_id"]}">${course["_id"]}</option>`);
        });

    }

    //create student sample with appropriate form to knn algorithm
    function createStudent(courses) {

        //var newStudent = [];
        var coursesTaken = {};
        courses.forEach(course => {
            //let text;
            let grade = prompt("Please enter your grade in " + course);
            while (grade === null || grade === "" || grade < 0 || grade > 100) { // forces user enter a grade
                grade = prompt("Something went wrong, please try again to enter your grage in " + course);
                //text = "User cancelled the prompt.";
            } //else {
            //text = grade;
            coursesTaken[course] = grade;
            //}
            //document.getElementById("demo").innerHTML = text;
        });

        //newStudent.push(coursesTaken);
        //return newStudent;
        return JSON.parse(JSON.stringify(coursesTaken)) // it is just an object (json) with corses + grades
    }



    //create the data with appropriate form to knn algorithm
    async function createKNNData(allGrades) {

        var studentsId = getStudentId();
        const pureStudentGradesArr = [];
        var pureStudentGradesObj = {};
        var studentGrades;

        for (let i = 0; i < studentsId.length; i++) {

            console.log(studentsId[i]['_id'] + " for");


            studentGrades = await fetch('/api/student/' + studentsId[i]['_id'] + '/enroll').then(response => response.json());
            pureStudentGradesObj = {};

            pureStudentGradesObj['_id'] = studentsId[i]['_id'];

            for (let j = 0; j < studentGrades.length; j++) {
                pureStudentGradesObj[studentGrades[j]['course']] = studentGrades[j]['grade'];
            }

            if (Object.keys(pureStudentGradesObj).length > 1) {
                pureStudentGradesArr.push(JSON.parse(JSON.stringify(pureStudentGradesObj)));
                pureStudentGradesObj = null;
            }

            studentGrades = null;

        }

        return pureStudentGradesArr;

    }

    function getStudentId() {

        var studentsId = [];
        allStudents.forEach(s => {
            studentsId.push({ '_id': s['_id'] });
        });
        return studentsId;

    }


    //Check if the student has chosen a predictive course that he has already enrolled in
    function checkCourseTaken(multipleCourses, predictCourse) {

        var checkResult = false;
        multipleCourses.forEach(c => {
            if (c === predictCourse) {
                checkResult = true;
            }
        });

        return checkResult;
    }

    async function addData() {
        addCoursesData();
        addStudentData();
        addgradesData();
    }

    async function addCoursesData() {

        var coursesData = await fetch('/assets/js/coursesData.json').then(response => response.json());
        var options;

        coursesData.forEach(async function(c) {

            options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(c)
            };

            await fetch("/api/course", options);
        });

    }

    async function addStudentData() {

        var studentsData = await fetch('/assets/js/studentsData.json').then(response => response.json());
        var options;

        studentsData.forEach(async function(s) {

            options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(s)
            };

            await fetch("/api/student", options);
        });

    }

    async function addgradesData() {

        var gradesData = await fetch('/assets/js/gradesData.json').then(response => response.json());
        var options;

        for (var course in gradesData) {

            gradesData[course].forEach(async function(grade) {

                options = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(grade)
                };

                await fetch("/api/enrollment", options);
            })
        }


    }

});