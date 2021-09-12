$(window).on('load', async function() {

    const UrlSplit = window.location.href.split('=');
    const studentId = UrlSplit[UrlSplit.length - 1];
    var studentGrades;
    var studentInfo;
    var coursesInfo;





    try {
        studentInfo = await fetch('/api/student/' + studentId).then(response => response.json());
    } catch (err) {
        window.location.replace("/error");
    }
    studentGrades = getStudentGrades();
    coursesInfo = await fetch('/api/course').then(response => response.json());

    var studentInfoTable = createInfoJson(studentGrades, coursesInfo);
    fillStudentInfo(studentInfo);
    fillGrades(studentInfoTable)



    async function getStudentGrades() {
        const allGrades = await fetch('/assets/js/KNNData.json').then(response => response.json());

        allGrades.forEach(async function(sGrade) {
            if (sGrade['student'] == studentId) {
                studentGrades = sGrade;
                return studentGrades;
            }
        });
    };


    function fillStudentInfo(studentInfo) {

        var row = '<tr>' +
            '<td class="column1" >' + studentInfo['_id'] + '</td >' +
            '<td class="column2">' + studentInfo['firstName'] + '</td>' +
            '<td class="column3">' + studentInfo['lastName'] + '</td>' +
            '</tr>';

        $("#studentInfo tbody").append(row);

    }

    function fillGrades(studentInfoTable) {

        var row;
        studentInfoTable.forEach(info => {

            row = '<tr>' +
                '<td class="column1" >' + info['name'] + '</td >' +
                '<td class="column2">' + info['points'] + '</td>' +
                '<td class="column3">' + info['semester'] + '</td>' +
                '<td class="column4">' + info['grade'] + '</td>' +
                '</tr>';

            $("#studentCourses tbody").append(row);
        });
    }

    /*function examBuildTableRow(studentGrade,courseInfo) {


        var ret = '<tr>' +
            '<td class="column1" >' + courseInfo['_id'] + '</td >' +
            '<td class="column2">' + coursesInfo['_id'] + '</td>' +
            '<td class="column3">' + exam.id + '</td>' +
            '<td class="column4">' + exam.dateStarted + '</td>' +
            '<td class="column5">' + exam.durationMinutes + '</td>' +
            '<td>' + strnigButton + '</td>' +
            '</tr>';

        return ret;

    }*/


    function createInfoJson(studentGrades, coursesInfo) {


        var infoArr = [];
        var infoObj = {};

        coursesInfo.forEach(c => {

            //console.log(studentGrades[c['_id']]);
            infoObj = {}
            infoObj['name'] = c['_id'];
            infoObj['points'] = c['points'];
            infoObj['semester'] = c['semester'];
            infoObj['grade'] = studentGrades[c['_id']];
            infoArr.push(infoObj);

        });

        return infoArr;
    }
});