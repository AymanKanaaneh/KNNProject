import { KNN } from '/assets/js/KNN.js';


$(window).load(async function() {

    await addData();

    var predictCourse; //this course what the student want to predict it's gade
    var multipleCourses; //json list of previous student's courses with his grades

    //all courses in the system from mongoDb
    var allCourses = await fetch('/api/course').then(response => response.json());
    //all students in the system from mongoDb
    var allStudents = await fetch('/api/student').then(response => response.json());
    //all grades in the system from mongoDb
    //var allGrades = await fetch('/api/enrollment').then(response => response.json());

    //all grades in the system from mongoDb it so big !!!!
    //var allGrades = await fetch('/api/enrollment').then(response => response.json());

    //all grades from json file, too large so we simulate that gradesData comes from mongoDb
    var allGrades = await fetch('/assets/js/gradesData.json').then(response => response.json());

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

                //KNNData = await createKNNData(allGrades);
                KNNData = await fetch('/assets/js/KNNData.json').then(response => response.json());
                newStudentSample = createStudent(multipleCourses);



                KNNResult = KNN(KNNData, newStudentSample, predictCourse);
                $('.pGrade')[0].innerHTML = KNNResult;
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
            while (isNaN(grade) || grade < 0 || grade > 100) { // forces user enter a grade
                grade = prompt("Something went wrong, please try again to enter your grage in " + course);
            }
            coursesTaken[course] = grade;
        });



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


            //studentGrades = await fetch('/api/student/' + studentsId[i]['_id'] + '/enroll').then(response => response.json());
            //studentGrades = allGrades['_id']

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
        //addCoursesData();
        //addStudentData();
        await addgradesData();
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

        //too large so we simulate that gradesData comes from mongoDb
        /*var options;

        gradesData.forEach(async function(grade) {
            options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(grade)
            };

            await fetch("/api/enrollment", options);
        });*/
    }
});