const express = require('express');
const axios = require('axios');

const app = express();
const port = 9876;

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});

const windowSize = 10;
let numberWindow = [];

const isQualifiedId = (id) => ['p', 'f', 'e', 'r'].includes(id);

function isPrime(num) {
    for (let i = 2, sqrt = Math.sqrt(num); i <= sqrt; i++)
        if (num % i === 0) return false;
    return num > 1;
}

function generatePrimes(n) {
    const primes = [];
    for (let i = 2; primes.length < n; i++) {
        if (isPrime(i)) primes.push(i);
    }
    return primes;
}

function generateFibonacci(n) {
    const fib = [0, 1];
    for (let i = 2; fib.length < n; i++) {
        fib[i] = fib[i - 1] + fib[i - 2];
    }
    return fib;
}

function generateEvenNumbers(n) {
    const evens = [];
    for (let i = 0; evens.length < n; i++) {
        if (i % 2 === 0) evens.push(i);
    }
    return evens;
}

function generateRandomNumbers(n, max = 100) {
    const randoms = [];
    for (let i = 0; randoms.length < n; i++) {
        randoms.push(Math.floor(Math.random() * max));
    }
    return randoms;
}

const fetchNumbersFromServer = async (id) => {
    let numbers = [];
    switch (id) {
        case 'p':
            numbers = generatePrimes(10); 
            break;
        case 'f':
            numbers = generateFibonacci(10);
            break;
        case 'e':
            numbers = generateEvenNumbers(10); 
            break;
        case 'r':
            numbers = generateRandomNumbers(10); 
            break;
        default:
            console.error('Invalid ID:', id);
            return [];
    }
    return numbers;
};

const calculateAverage = (numbers) => {
    if (numbers.length === 0) return 0;
    const sum = numbers.reduce((acc, num) => acc + num, 0);
    return (sum / numbers.length).toFixed(2);
};

app.get('/numbers/:id', async (req, res) => {
    const { id } = req.params;

    if (!isQualifiedId(id)) {
        return res.status(400).json({ error: 'Invalid number ID' });
    }

    const windowPrevState = [...numberWindow];
    const newNumbers = await fetchNumbersFromServer(id);

    newNumbers.forEach((num) => {
        if (!numberWindow.includes(num)) {
            numberWindow.push(num);
        }
    });

    
    if (numberWindow.length > windowSize) {
        numberWindow = numberWindow.slice(-windowSize);
    }

    const avg = calculateAverage(numberWindow);

    res.json({
        windowPrevState,
        windowCurrState: numberWindow,
        numbers: newNumbers,
        avg,
    });
});
