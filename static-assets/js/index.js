$(document).ready(function() {
    $('#multiple-checkboxes').multiselect();

    $('#btnPredict').click(function() {
        var courses = $('#multiple-checkboxes').val();

        courses.forEach(course => {
            let text;
            let grade = prompt("Please enter your grage in " + course);
            if (grade == null || grade == "") {
                text = "User cancelled the prompt.";
            } else {
                text = grade;
            }
            document.getElementById("demo").innerHTML = text;
        });
    });
});