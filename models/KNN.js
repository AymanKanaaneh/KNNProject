const a = [[1, 2, 3], [4, 5, 6], [7, 8, 9]] // sample data -> a should be the list of students in the database
const b = [3, 4, 5] // sample student -> b should be the student's data that comes from the user-side
/**
 * KNN algo runs over ALL data, and returns k (default 2) students that has the closest grades to the "our" student
 * @param data the list of students in the database
 * @param new_student the student's data that comes from the user-side
 * @param k number of closest students
 * @returns {*[]} returns an array of k best-matched students
 * @constructor
 */
function KNN(data, new_student, k = 2) {
    let distances = [] // empty array of distances
    for (let student = 0; student < data.length; student++) {
        let d = distance(data[student], new_student)
        distances[student] = [d, student] // add (x,y) where x is the distance and y is the student number/id
    }
    distances.sort() // sort
    return distances.slice(0, k) // returns k best students
}

/**
 * distance function, "straightforward", that to say Pitagoras in N dimes (=or "euclidean distance")
 * @param a first number (as array)
 * @param b second number (as array)
 * @returns {number} float that is the distance between a to b
 */
function distance(a, b) {
    let sum = 0
    for (const val in a) {
        sum += ((b[val] - a[val]) * (b[val] - a[val]))
    }
    return Math.sqrt(sum)
}
/*
function main() { // simple just to check it works fine, as it is :)
    console.log(KNN(a, b, 3))
}

main()*/
