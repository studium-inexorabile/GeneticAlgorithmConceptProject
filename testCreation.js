const fs = require('fs');

const testCreation = () => {
    //creates random strings to use as answer
    const randomString = (length) => {
        var result           = '';
        var characters       = ' abcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    //creates random answers and weight for each question
    const answerCreator = () => {
        let answerArray = [];
        let multipleChoice = {
            0: 'A',
            1: 'B',
            2: 'C',
            3: 'D',
            4: 'E'
        }
        for(let i = 0; i < 5; i++){
            answerArray.push({
                [multipleChoice[i]] : randomString(7),
                weight: Math.floor(Math.random() * 5) + 1
            })
        }
        return answerArray
    }

    //creates test with random strings and random answers
    const test = {}
    const questionCreator = () => {
        for(let i = 1; i <= 10; i++){
            test[i] = {
                question: randomString(15),
                answers: answerCreator()
            }
        }
    }

    //evaluates created test and provides metrics in terminal window
    let disparity = 0;
    const evaluateTest = () => {
        let min = 0;
        let max = 0;
        for(i in test){
            let weights = test[i]["answers"].map(item => item.weight)
            min += parseFloat(Math.min(...weights))
            max += parseFloat(Math.max(...weights))
        }
        
        disparity = max - min;
        if(disparity >= 40){
            console.log("**Created Test Metrics**")
            console.log("Maximum test score: ", max)
            console.log("Minimum test score: ", min)
            console.log("Min / Max disparity : ", disparity)
            let breakpoints = ((disparity) / 5)
            console.log("Potential breakpoints")
            console.log(" Low - <", (breakpoints * 1  + min)  + .1)
            console.log(" Medium-Low - <", (breakpoints * 2  + min)  + .1)
            console.log(" Medium - <", (breakpoints * 3  + min)  + .1)
            console.log(" Medium-High - <", (breakpoints * 4  + min)  + .1)
            console.log(" High - <", (breakpoints * 5  + min)  + .1)
        }
    }

    //will continue to create and evaluate tests until a certain disparity is reached
    //40 seems to be the max disparity
    while(disparity < 40) {
        questionCreator();
        evaluateTest()
    }

    const json = JSON.stringify(test)
    fs.writeFileSync('./test.json', json, (err) => {
        if(err){
            console.log(err)
        }else{
            console.log("success")
        }
    })
}

module.exports = testCreation