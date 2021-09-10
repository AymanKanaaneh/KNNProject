/*
 * this file shows how did we added new students to our Mongo database. It has no comments since it quite short and readable and clear :-)
 */

// fields
const { MongoClient } = require('mongodb'); // driver
const DB = "StudentsGrades"; // database name (SQL: using StudentsGrades)
const TABLE = "Grades"; // table name
const URI = "mongodb+srv://demo:helloworld@cluster0.u3osq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(URI); // client

async function addStudents() {
    try {
        await client.connect()
        for (let i = 0; i < 300; i++) {
            await addStudent(client, {
                _id: i,
                PHP: generateNumber(),
                JavaScript: generateNumber(),
                Java: generateNumber(),
                SQL: generateNumber(),
                Jquery: generateNumber(),
                DotNet: generateNumber()
            })
        }
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}

async function addStudent(client, student) {
    await client.db(DB).collection(TABLE).insertOne(student);
}

function generateNumber() {
    return Math.floor(Math.random() * 100)
}