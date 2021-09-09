import { KNN, predicted_grade, sigma, distance } from '/assets/js/KNN.js';


$(window).load(async function() {


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


                //KNNResult = KNN(KNNData, newStudentSample, predictCourse);

                //console.log(KNNData);

                //console.log(multipleCourses);
                //console.log(predictCourse);

                console.log(newStudentSample);
                console.log(predictCourse);
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

        var newStudent = [];
        var coursesTaken = {};
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


    //create the data with appropriate form to knn algorithm
    async function createKNNData(allGrades) {

        var studentsId = getStudentId();
        var pureStudentGradesArr = [];
        var pureStudentGradesObj;

        studentsId.forEach(async function(sId) {

            var studentGrades = await fetch('/api/student/' + sId['_id'] + '/enroll').then(response => response.json());
            pureStudentGradesObj = {};
            pureStudentGradesObj['_id'] = sId['_id'];
            studentGrades.forEach(SG => {
                pureStudentGradesObj[SG['course']] = SG['grade'];
            });

            if (Object.keys(pureStudentGradesObj).length > 1) {
                pureStudentGradesArr.push(pureStudentGradesObj);
            }

        });

        return pureStudentGradesArr;

    }

    function getStudentId() {

        var studentsId = [];
        allStudents.forEach(g => {
            studentsId.push({ '_id': g['_id'] });
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

});