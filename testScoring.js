const fs = require('fs');

//pulls data from test.json
let test = {}
try {
    let jsonString = fs.readFileSync('./test.json')
    test = JSON.parse(jsonString)
} catch(err) {
    console.log(err)
    return
}

//pulls data from takenTest.json
let takenTest = {}
try {
    let jsonString = fs.readFileSync('./takenTest.json')
    takenTest = JSON.parse(jsonString)
} catch(err) {
    console.log(err)
    return
}

//dictionary to use for converting between array position and answer choice
let reverseMultiple = {
    A: 0,
    B:1,
    C:2,
    D:3,
    E:4
}

//pulls answers and related weights from taken test
//combined selected weights into one score
let testScore = {}
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

//logs score to terminal window
console.log(scoreTest())