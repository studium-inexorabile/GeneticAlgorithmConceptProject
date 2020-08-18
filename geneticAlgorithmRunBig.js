const test = require('./testBig.json')
const GeneticAlgorithmConstructor = require('geneticalgorithm')
const algoStart = process.hrtime()

//global variables
const multipleChoice = ['A','B','C','D','E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M'];
const breakpoint = process.argv[2] || 'medium';
let generation = 1;
let continueEvolve = true;

// configures functions used inside genetic algorithm
// then passes configuration to GA constructor
const config = {
    mutationFunction,
    crossoverFunction,
    fitnessFunction,
    population: [ createPhenotype() ],
    populationSize: 10
}
const geneticalgorithm = GeneticAlgorithmConstructor( config );

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
    let parsedOldPhenotype = tryParse(oldPhenotype)
    // value can be changed here to control amount of phenotypes that are mutated
    // higher number means more mutation
    // to get over maxima issues, mutation increases after 1500 generations
    if(generation > 1500){
        if (Math.random() > 0.8) return parsedOldPhenotype;
    }else{
        if (Math.random() > 0.5) return parsedOldPhenotype;
    }
    for(let i = 1; i <= 100; i++){
        // value can be changed here to control amount of genes in phenotype that
        // can be changed. higher number means less genes are mutated
        if(Math.random() >= 0.8){
            let available = multipleChoice.filter((item) => item != parsedOldPhenotype[i]["chosenAnswer"])
            resultPhenotype[i] = {
                chosenAnswer :available[Math.floor(Math.random() * available.length)]
            }
        }else{
            resultPhenotype[i] = parsedOldPhenotype[i]
        }
    }
	return resultPhenotype
}

// function 'mates' top performers by picking halfway point in parent phenotypes,
// answers on either side of that point are swapped between 
// the two parent phenotypes, and two offspring are returned.
function crossoverFunction(phenoTypeA, phenoTypeB) {
    let result1 = {} , result2 = {}
    const parsedPhenoTypeA = tryParse(phenoTypeA)
    const parsedPhenoTypeB = tryParse(phenoTypeB)
    for(let i = 1; i <= 50; i++){
        result1[i] = parsedPhenoTypeA[i]
        result2[i] = parsedPhenoTypeB[i]
    }
    for(let i = 51; i <= 100; i++){
        result1[i] = parsedPhenoTypeB[i]
        result2[i] = parsedPhenoTypeA[i]
    }
	return [result1,result2]
}

// function to determine fitness of phenotype.
function fitnessFunction(phenotype) {
    let fitness = 0
    let combinedWeight = 0
    let testScore = {}
    const parsedPhenotype = tryParse(phenotype)
    // creates an object that combines the answers(genes) of a phenotype
    // and its corresponding weight (found in test)
    for(let i = 1; i <= 100; i ++){
        testScore[i] = {
            answer : parsedPhenotype[i]["chosenAnswer"],
            weight : test[i]["answers"][multipleChoice.indexOf(parsedPhenotype[i]["chosenAnswer"])]["weight"]
        }
    }
    //combines all weight values into single value
    for(let i in testScore){
        combinedWeight += testScore[i]['weight']
    }
    // determines how to modify fitness score based on desired score-range - subtracts 
    // fitness score from top end of desired ranged if combinedWeight is higher than breakpoint
    switch(breakpoint){
        case "low" :
            combinedWeight > 307.1 ? fitness = 307.1 - combinedWeight : fitness = combinedWeight
        break;
        case "low-medium":
            combinedWeight > 472.1 ? fitness = 472.1 - combinedWeight : fitness = combinedWeight
        break;
        case "medium":
            combinedWeight > 637.1 ? fitness = 637.1 - combinedWeight : fitness = combinedWeight
        break;
        case "high-medium":
            combinedWeight > 802.1 ? fitness = 802.1 - combinedWeight : fitness = combinedWeight
        break;
        case "high":
            combinedWeight > 967.1 ? fitness = 967.1 - combinedWeight : fitness = combinedWeight
        break;
    }
    return fitness
}

// loop continues to run algorithm and evolve new generations until given criteria is met
// criteria is determined by command line argument 'breakpoint'
const runGeneticAlgorithm = () => {
    while (continueEvolve) {
        let score = geneticalgorithm.bestScore()
        switch(breakpoint){
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
        if(generation % 100 == 0){
            console.log("**Generation - ", generation)
            console.log("**Best score of generation - ", geneticalgorithm.bestScore())
        }
    }
}

// score for best phenotype is calculated so that it can be displayed.
// relevant metrics are displayed for correct phenotype
const runMetrics = () => {
    const algoStop = process.hrtime(algoStart)
    console.log("Best phenotype: ", geneticalgorithm.scoredPopulation()[0].phenotype)
    console.log("Final score: ", geneticalgorithm.bestScore())
    console.log("Algorithm completed in " + generation + " generations.")
    console.log('Execution time: %ds %dms', algoStop[0], algoStop[1] / 1000000)
}

runGeneticAlgorithm();
runMetrics();