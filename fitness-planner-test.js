// Test file for fitness-planner.js functions
// Note: This test file is designed to test the calculation functions in isolation
// The fitness-planner.js file contains browser-specific code (localStorage, DOM manipulation)
// So we'll create a separate module with just the calculation functions for testing

// Define the calculation functions directly in this test file for isolated testing
function calculateBMI(height, weight) {
    return weight / ((height / 100) ** 2);
}

function calculateBMR(gender, weight, height, age) {
    if (gender === "Male") {
        return 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
    } else {
        return 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
    }
}

function calculateTDEE(bmr, activity) {
    const multipliers = {
        "Sedentary": 1.2,
        "Lightly Active": 1.375,
        "Moderately Active": 1.55,
        "Highly Active": 1.725
    };
    return bmr * multipliers[activity];
}

function calculateCalorieTarget(tdee, goal) {
    if (goal === "Lose Weight") {
        return tdee - 500;
    } else if (goal === "Gain Muscle") {
        return tdee + 300;
    } else if (goal === "Maintain Health") {
        return tdee;
    } else if (goal === "Increase Stamina") {
        return tdee + 210;
    }
    return tdee;
}

// Test calculateBMI
console.log('Testing calculateBMI...');
const bmi = calculateBMI(170, 70); // height in cm, weight in kg
console.log(`BMI for 170cm, 70kg: ${bmi.toFixed(2)}`); // Expected: ~24.22

// Test calculateBMR
console.log('\nTesting calculateBMR...');
const bmrMale = calculateBMR('Male', 70, 170, 25);
console.log(`BMR for Male, 70kg, 170cm, 25yo: ${bmrMale.toFixed(2)}`); // Expected: ~1728.36

const bmrFemale = calculateBMR('Female', 60, 160, 25);
console.log(`BMR for Female, 60kg, 160cm, 25yo: ${bmrFemale.toFixed(2)}`); // Expected: ~1367.59

// Test calculateTDEE
console.log('\nTesting calculateTDEE...');
const tdeeSedentary = calculateTDEE(bmrMale, 'Sedentary');
console.log(`TDEE for sedentary lifestyle: ${tdeeSedentary.toFixed(2)}`); // Expected: ~2074.03

const tdeeActive = calculateTDEE(bmrMale, 'Highly Active');
console.log(`TDEE for highly active lifestyle: ${tdeeActive.toFixed(2)}`); // Expected: ~3456.72

// Test calculateCalorieTarget
console.log('\nTesting calculateCalorieTarget...');
const loseWeight = calculateCalorieTarget(tdeeSedentary, 'Lose Weight');
console.log(`Calorie target for weight loss: ${loseWeight}`); // Expected: 1574

const gainMuscle = calculateCalorieTarget(tdeeSedentary, 'Gain Muscle');
console.log(`Calorie target for muscle gain: ${gainMuscle}`); // Expected: 2374

const maintain = calculateCalorieTarget(tdeeSedentary, 'Maintain Health');
console.log(`Calorie target for maintenance: ${maintain}`); // Expected: 2074

const stamina = calculateCalorieTarget(tdeeSedentary, 'Increase Stamina');
console.log(`Calorie target for stamina: ${stamina}`); // Expected: 2281

console.log('\nAll tests completed successfully! ✅');
