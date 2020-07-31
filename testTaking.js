const fs = require('fs');

let takenTest = {}
let multipleChoice = {
    0: 'A',
    1: 'B',
    2: 'C',
    3: 'D',
    4: 'E'
}
for(let i = 1; i <= 10; i++){
    takenTest[i] = {
        chosenAnswer : multipleChoice[Math.floor(Math.random() * 5)]
    }
}

const json = JSON.stringify(takenTest)
fs.writeFileSync('./takenTest.json', json, (err) => {
    if(err){
        console.log(err)
    }else{
        console.log("success")
    }
})
