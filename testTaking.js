const fs = require('fs');

const teskTaking = (answers = []) => {
    //dictionary to use for converting between array position and answer choice
    let multipleChoice = {
        0: 'A',
        1: 'B',
        2: 'C',
        3: 'D',
        4: 'E'
    }
    //uses given answer array or
    //fills object with random answer choices (A-E)
    let takenTest = {}
    for(let i = 1; i <= 10; i++){
        if(answers.length > 0){
            takenTest[i] = {
                chosenAnswer : answers[i - 1]
            }
        }else {
            takenTest[i] = {
                chosenAnswer : multipleChoice[Math.floor(Math.random() * 5)]
            }
        }
    }
    //writes answers to takenTest.json
    const json = JSON.stringify(takenTest)
    // fs.writeFileSync('./takenTest.json', json, (err) => {
    //     if(err){
    //         console.log(err)
    //     }else{
    //         console.log("success")
    //     }
    // })
    return json
}

module.exports = teskTaking