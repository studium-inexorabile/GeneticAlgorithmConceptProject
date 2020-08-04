let test = require('./test.json')
let GeneticAlgorithmConstructor = require('geneticalgorithm')
let algoStart = process.hrtime()
//variables
const reverseMultiple = {
    A: 0,
    B:1,
    C:2,
    D:3,
    E:4
}
const multipleChoice = ['A','B','C','D','E']
let generation = 1;
let continueEvolve = true;
// command line argument that determines target range (options: "low", "low-medium", "medium", "high-medium", "high")
let goal = process.argv[2]
if(!goal) goal = 'medium'

// configures functions used inside genetic algorithm
// then passes configuration to GA constructor
let config = {
    mutationFunction: mutationFunction,
    crossoverFunction: crossoverFunction,
    fitnessFunction: fitnessFunction,
    population: [createPhenotype()],
    populationSize: 10
}
let geneticalgorithm = GeneticAlgorithmConstructor( config ) 

// helper function that will try to parse passed in JSON
const tryParse = (item) => {
    let newItem;
    if(typeof item == "string"){
        newItem = JSON.parse(item)
    }else{
        newItem = item
    }
    return newItem
}

//returns a randomly filled phenotype to populate GA
function createPhenotype() {
    let phenotype = {}
    for(let i = 1; i <= 10; i++){
        phenotype[i] = {
            chosenAnswer : multipleChoice[Math.floor(Math.random() * multipleChoice.length)]
        }
    }
    return JSON.stringify(phenotype)
}

// function used to introduce mutation to population
function mutationFunction(oldPhenotype) {
    let resultPhenotype = {}
    oldPhenotype = tryParse(oldPhenotype)
    // value can be changed here to control amount of phenotypes that are mutated
    // higher number means less mutation
     if (Math.random() > 0.8) return oldPhenotype;

    for(let i = 1; i <= 10; i++){
        // value can be changed here to control amount of genes in phenotype that
        // can be changed. higher number means less genes are mutated
        if(Math.random() >= 0.5){
            resultPhenotype[i] = {
                chosenAnswer : multipleChoice[Math.floor(Math.random() * multipleChoice.length)]
            }
        }else{
            resultPhenotype[i] = oldPhenotype[i]
        }
    }
	return resultPhenotype
}

// function 'mates' top performers by taking two phenotypes 
// and creating two new phenotypes by halving copies of the parents
// and transposing those halves
function crossoverFunction(phenoTypeA, phenoTypeB) {
    let result1 = {} , result2 = {}
    phenoTypeA = tryParse(phenoTypeA)
    phenoTypeB = tryParse(phenoTypeB)
    // console.log(phenoTypeA)
    // console.log(phenoTypeB)
    for(let i = 0; i < 5; i++){
        result1[i + 1] = phenoTypeA[i + 1]
        result2[i + 1] = phenoTypeB[i + 1]
    }
    for(let i = 5; i < 10; i++){
        result1[i + 1] = phenoTypeB[i + 1]
        result2[i + 1] = phenoTypeA[i + 1]
    }
    // console.log([result1,result2])
	return [result1,result2]
}

// function to determine fitness of phenotype
function fitnessFunction(phenotype) {
    let fitness = 0
    let testScore = {}
    phenotype = tryParse(phenotype)
    // creates an object that combines the answers(genes) of a phenotype
    // and its corresponding weight (found in test)
    for(let i = 1; i <= 10; i ++){
        testScore[i] = {
            answer : phenotype[i]["chosenAnswer"],
            weight : test[i]["answers"][reverseMultiple[phenotype[i]["chosenAnswer"]]]["weight"]
        }
    }
    //combines all weight values into single value
    for(let i in testScore){
        fitness += testScore[i]['weight']
    }
    // determines how to modify fitness score based on desired score-range
    switch(goal){
        case "low" :
            if(fitness > 18.1){
                fitness = 18.1 - fitness
            }
        break;
        case "low-medium":
            if(fitness > 26.1){
                fitness = 26.1 - fitness
            }
        break;
        case "medium":
            if(fitness > 34.1){
                fitness = 34.1 - fitness
            }
        break;
        case "high-medium":
            if(fitness > 42.1){
                fitness = 42.1 - fitness
            }
        break;
        case "high":
            if(fitness > 50.1){
                fitness = 50.1 - fitness
            }
        break;
    }
    return Math.abs(fitness)
}

// loop continues to run algorithm and evolve new generations until given criteria is met
// criteria is determined by command line argument 'goal'
const runGeneticAlgorithm = () => {
    while (continueEvolve) {
        let score = geneticalgorithm.bestScore()
        switch(goal){
            case "low" :
                if(score > 0 && score < 18.1){
                    continueEvolve = false;
                }
            break;
            case "low-medium":
                if(score >= 18.1 && score < 26.1){
                    continueEvolve = false;
                }
            break;
            case "medium":
                if(score >= 26.1 && score < 34.1){
                    continueEvolve = false;
                }
            break;
            case "high-medium":
                if(score >= 34.1 && score < 42.1){
                    continueEvolve = false;
                }
            break;
            case "high":
                if(score >= 42.1 && score < 50.1){
                    continueEvolve = false;
                }
            break;
        }
        generation++;
        //method continues to next generation
        geneticalgorithm.evolve()
        // console.log("**Generation - ", generation)
        // console.log("**Best score of generation - ", geneticalgorithm.bestScore())
    }
}

// score for best phenotype is calculated so that it can be displayed.
// relevant metrics are displayed for correct phenotype
const runMetrics = () => {
    let finalBest = geneticalgorithm.scoredPopulation()[0];
    let algoStop = process.hrtime(algoStart)
    console.log("Best phenotype: ", finalBest.phenotype)
    console.log("Final score: ", finalBest.score)
    console.log("Algorithm completed in " + generation + " generations.")
    console.log('Execution time: %ds %dms', algoStop[0], algoStop[1] / 1000000)
}

runGeneticAlgorithm();
runMetrics();