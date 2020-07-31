const fs = require('fs');

//dictionary to use for converting between array position and answer choice
let multipleChoice = {
    0: 'A',
    1: 'B',
    2: 'C',
    3: 'D',
    4: 'E'
}

//fills object with random answer choices (A-E)
let takenTest = {}
for(let i = 1; i <= 10; i++){
    takenTest[i] = {
        chosenAnswer : multipleChoice[Math.floor(Math.random() * 5)]
    }
}

//writes answers to takenTest.json
const json = JSON.stringify(takenTest)
fs.writeFileSync('./takenTest.json', json, (err) => {
    if(err){
        console.log(err)
    }else{
        console.log("success")
    }
})
