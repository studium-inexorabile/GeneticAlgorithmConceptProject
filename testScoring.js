const fs = require('fs');

let test = {}
try {
    let jsonString = fs.readFileSync('./test.json')
    test = JSON.parse(jsonString)
} catch(err) {
    console.log(err)
    return
}

let takenTest = {}
try {
    let jsonString = fs.readFileSync('./takenTest.json')
    takenTest = JSON.parse(jsonString)
} catch(err) {
    console.log(err)
    return
}

let testScore = {}
let reverseMultiple = {
    A: 0,
    B:1,
    C:2,
    D:3,
    E:4
}
const scoreTest = () => {
    for(let i = 1; i <= 10; i ++){
        testScore[i] = {
            answer : takenTest[i]["chosenAnswer"],
            weight : test[i]["answers"][reverseMultiple[takenTest[i]["chosenAnswer"]]]["weight"]
        }
    }
    let score = 0
    for(let i in testScore){
        score += testScore[i]['weight']
    }
    return score
}

console.log(scoreTest())