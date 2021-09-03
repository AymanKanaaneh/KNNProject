// fields
const { MongoClient } = require('mongodb'); // driver
const DB = "StudentsGrades"; // database name (SQL: using StudentsGrades)
const TABLE = "Grades"; // table name
const URI = "mongodb+srv://demo:helloworld@cluster0.u3osq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(URI); // client

/**
 * KNN algo runs over ALL data, and returns k (in our case k = 5) students that has the closest grades to the "our" student
 * @param new_student the student's data that comes from the user-side
 * @param subject the subject we want to try to predict
 * @param k number of closest students
 * @returns predicted grade as an integer
 */
async function KNN(new_student, subject, k = 5) {
    let distances = [] // an empty array of distances
    const data = await getData() // data is the list of students in the database

    data.forEach(student => {
        distances.push([distance(student, new_student, subject), student["_id"]])
    }); // add (x,y) where x is the distance and y is the student number/id

    distances.sort(function(a, b) {
            return a[0][0] - b[0][0];
        }) // sort by first value
        //console.log(distances) // works!
    return predicted_grade(distances.slice(0, k), subject) // returns the student's predicted grade
}

/**
 * grab all data from database, where SQL is "SELECT * FROM TABLE" (TABLE = "grades")
 * @returns data as an array
 */
async function getData() {
    await client.connect();
    const cursor = await client.db(DB).collection(TABLE).find({}).toArray() // select * from table
    await client.close()
    return cursor; // data[0] = {} , data[1] = {} , ...
}

/**
 * calculates the weighted average grade of k-closest students
 * @param distances an array of k best-matched students, k-closest students as (x,y) where x is distance, and y is the grade in the desired course
 * @param subject the that the user wants to predict
 * @returns returns predicted grade
 */
function predicted_grade(distances, subject) {
    let sum = 0
    for (let i = distances.length; i > 0; i--) {
        console.log("sum" + sum)
            /*
                data -> Json.
                data -> {{},{},{}}
                {} -> _id, PHP, ...
                distances[1] = _id as integer
                distances-i =
             */
            /*
                [
                      [ [ 0, 34 ], 12 ],
                      [ [ 29.5296461204668, 1 ], 30 ],
                      [ [ 56.37375275782161, 34 ], 27 ],
                      [ [ 57.367238037053866, 13 ], 41 ],
                      [ [ 58.68560300448484, 78 ], 7 ]
                ]
             */
        sum += i * distances[distances.length - i][0][1] // i == weight; distances[distances.length - i][0][1] == grade
    }
    return sum / sigma(distances.length) // ( k * grade(1) + ... + 1 * grade(k) ) / ( sigma(k) )
}

/**
 * sigma as in math, from i=1 to n
 * @param n 1->n
 * @returns sigma
 */
function sigma(n) {
    if (n === 1)
        return 1
    return n + sigma(n - 1)
}

/**
 * distance function, "straightforward", that to say Pythagoras in N dimensions (=or "euclidean distance")
 * !!!NOTE: new_student MUST BE THE ARGUMENT IN FOR() since new_student has at least one less subject than the data_member!!!
 * @param data_member first number (as array)
 * @param new_student second number (as array)
 * @param sub the subject wanted to be predicted
 * @returns number, grade in requested subject where number is a float that is the distance between data_member to new_student
 */
function distance(data_member, new_student, sub) {
    if (!(sub in data_member))
        return Infinity // drops when sorted. !NOTE: in full-data case, it won't get here!
    let sum = 0
    for (const subject in new_student) {
        if (!(subject in data_member))
            return Infinity // drops when sorted. !NOTE: in full-data case, it won't get here!
        if (subject !== "_id") {
            // (b-a)^2
            sum += ((data_member[subject] - new_student[subject]) * (data_member[subject] - new_student[subject]))
        }
    }
    return [Math.sqrt(sum), data_member[sub]] // sqrt(sum), subject as in data_member's
}