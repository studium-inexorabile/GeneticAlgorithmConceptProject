let test = require('./testBig.json')
let GeneticAlgorithmConstructor = require('geneticalgorithm')
let algoStart = process.hrtime()
//variables
const reverseMultiple = {
    A: 0,
    B:1,
    C:2,
    D:3,
    E:4,
    F:5,
    G:6,
    H:7,
    I:8,
    J:9,
    K:10,
    L:11,
    M:12
}
const multipleChoice = ['A','B','C','D','E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M']
let generation = 1;
let continueEvolve = true;
// configures functions used inside genetic algorithm
// then passes configuration to GA constructor
let config = {
    mutationFunction: mutationFunction,
    crossoverFunction: crossoverFunction,
    fitnessFunction: fitnessFunction,
    population: [ createPhenotype() ],
    populationSize: 40
}
let geneticalgorithm = GeneticAlgorithmConstructor( config )

// command line argument that determines target range (options: "low", "low-medium", "medium", "high-medium", "high")
// defaults to "medium"
let goal = process.argv[2]
if(!goal) goal = 'medium'

//returns a randomly filled phenotype to populate GA
function createPhenotype() {
    let phenotype = {}
    for(let i = 1; i <= 100; i++){
        phenotype[i] = {
            chosenAnswer : multipleChoice[Math.floor(Math.random() * multipleChoice.length)]
        }
    }
    return JSON.stringify(phenotype)
}

// helper function try parse passed in JSON
const tryParse = (item) => {
    let newItem;
    if(typeof item == "string"){
        newItem = JSON.parse(item)
    }else{
        newItem = item
    }
    return newItem
}

// function used to introduce mutation to population
function mutationFunction (oldPhenotype) {
    let resultPhenotype = {}
    oldPhenotype = tryParse(oldPhenotype)
    // value can be changed here to control amount of phenotypes that are mutated
    // higher number means more mutation
    // to get over maxima issues, mutation increases after 1500 generations
    if(generation > 1500){
        if (Math.random() > 0.8) return oldPhenotype;
    }else{
        if (Math.random() > 0.4) return oldPhenotype;
    }
    for(let i = 1; i <= 100; i++){
        // value can be changed here to control amount of genes in phenotype that
        // can be changed. higher number means less genes are mutated
        if(Math.random() >= 0.7){
            let available = multipleChoice.filter((item) => item != oldPhenotype[i]["chosenAnswer"])
            resultPhenotype[i] = {
                chosenAnswer :available[Math.floor(Math.random() * available.length)]
            }
        }else{
            resultPhenotype[i] = oldPhenotype[i]
        }
    }
	return resultPhenotype
}

// function 'mates' top performers by picking halfway point in parent phenotypes,
// answers on either side of that point are swapped between 
// the two parent phenotypes, and two offspring are returned.
function crossoverFunction(phenoTypeA, phenoTypeB) {
    let result1 = {} , result2 = {}
    phenoTypeA = tryParse(phenoTypeA)
    phenoTypeB = tryParse(phenoTypeB)
    for(let i = 0; i < 50; i++){
        result1[i + 1] = phenoTypeA[i + 1]
        result2[i + 1] = phenoTypeB[i + 1]
    }
    for(let i = 50; i < 100; i++){
        result1[i + 1] = phenoTypeB[i + 1]
        result2[i + 1] = phenoTypeA[i + 1]
    }
	return [result1,result2]
}

// function to determine fitness of phenotype.
function fitnessFunction(phenotype) {
    let fitness = 0
    let testScore = {}
    phenotype = tryParse(phenotype)
    // creates an object that combines the answers(genes) of a phenotype
    // and its corresponding weight (found in test)
    for(let i = 1; i <= 100; i ++){
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
            if(fitness > 307.1){
                fitness = 307.1 - fitness
            }
        break;
        case "low-medium":
            if(fitness > 472.1){
                fitness = 472.1 - fitness
            }
        break;
        case "medium":
            if(fitness > 637.1){
                fitness = 637.1 - fitness
            }
        break;
        case "high-medium":
            if(fitness > 802.1){
                fitness = 802.1 - fitness
            }
        break;
        case "high":
            if(fitness > 967.1){
                fitness = 967.1 - fitness
            }
        break;
    }
    return fitness
}

// loop continues to run algorithm and evolve new generations until given criteria is met
// criteria is determined by command line argument 'goal'
const runGeneticAlgorithm = () => {
    while (continueEvolve) {
        let score = geneticalgorithm.bestScore()
        switch(goal){
            case "low" :
                if(score > 0 && score < 307.1){
                    continueEvolve = false;
                }
            break;
            case "low-medium":
                if(score >= 307.1 && score < 472.1){
                    continueEvolve = false;
                }
            break;
            case "medium":
                if(score >= 472.1 && score < 637.1){
                    continueEvolve = false;
                }
            break;
            case "high-medium":
                if(score >= 637.1 && score < 802.1){
                    continueEvolve = false;
                }
            break;
            case "high":
                if(score >= 802.1 && score < 967.1){
                    continueEvolve = false;
                }
            break;
        }
        generation++;
        //method evolves to next generation
        geneticalgorithm.evolve()
        console.log("**Generation - ", generation)
        console.log("**Best score of generation - ", geneticalgorithm.bestScore())
    }
}

// score for best phenotype is calculated so that it can be displayed.
// relevant metrics are displayed for correct phenotype
const runMetrics = () => {
    let algoStop = process.hrtime(algoStart)
    console.log("Best phenotype: ", geneticalgorithm.scoredPopulation()[0].phenotype)
    console.log("Final score: ", geneticalgorithm.bestScore())
    console.log("Algorithm completed in " + generation + " generations.")
    console.log('Execution time: %ds %dms', algoStop[0], algoStop[1] / 1000000)
}

runGeneticAlgorithm();
runMetrics();