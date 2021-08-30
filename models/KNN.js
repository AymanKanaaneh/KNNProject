/*
const {MongoClient} = require('mongodb');
const constants = require("constants");
const DB = "StudentsGrades"
const TABLE = "Grades"
const URI = "mongodb+srv://demo:helloworld@cluster0.u3osq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(URI);
*/

const a = [[1, 2, 3], [4, 5, 6], [7, 8, 9]] // sample data -> a should be the list of students in the database
const b = [3, 4, 5] // sample student -> b should be the student's data that comes from the user-side
/**
 * KNN algo runs over ALL data, and returns k (default 1) students that has the closest grades to "our" student
 * @param data the list of students in the database
 * @param new_student the student's data that comes from the user-side
 * @param k number of closest students (default = 1)
 * @returns {*[]} returns an array of k best-matched students
 * @constructor
 */
function KNN(data, new_student, k = 1) {
    let distances = [] // empty array of distances
    data.forEach(student =>{
        distances.push([distance(student, new_student), student["_id"]]) // add (x,y) where x is the distance and y is the student number/id
    });

    distances.sort(function (a,b){return a[0] - b[0];}) // sort by first value (distance)
    return distances.slice(0, k) // returns k best students
}

/**
 * distance function, "straightforward", that to say Pitagoras in N dimintions (=or "euclidean distance")
 * !!!NOTE: new_student MUST BE THE ARGUMENT IN FOR() since new_studnet has at least one less subject than the data_member!!!
 * @param data_member first number (as array)
 * @param new_student second number (as array)
 * @returns {number} float that is the distance between data_member to new_student
 */
function distance(data_member, new_student) {
    let sum = 0
    for (const val in new_student) {
        if(val !== "_id")
            sum += ((data_member[val] - new_student[val]) * (data_member[val] - new_student[val]))
    }
    return Math.sqrt(sum)
}

/**
!!NOT FINAL!! (v.0.0.1) :)
*/
async function getBestMatch(student, subject){
    try {
        await client.connect();
        const cursor = await client.db(DB).collection(TABLE).find({}).toArray() // select * from studnetGrades
        const best = await cursor[KNN(cursor, student, 1)][subject]
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
        return best
    }
}
/*
function main() { // simple just to check it works fine, as it is :)
    firstTry();
}
async function firstTry() {
    try {
        console.log("HELLO")
        await client.connect();
        const cursor = await client.db(DB).collection(TABLE).find({PHP: {$gt: 50}}).toArray()
        await console.log("Student id " + KNN(cursor, {
            _id: -1,  PHP: 70,
            JavaScript: 55,
            Java: 32,
            SQL: 26,
            Jquery: 57,
            DotNet: 93
        }, 50)[0][1] + " is the best match!")
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}


main()*/
