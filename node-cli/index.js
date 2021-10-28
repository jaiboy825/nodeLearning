#!/usr/bin/env node
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.clear();
const answerCallback = (answer) => {
    if (answer === 'y') {
        console.log('재밌군요!');
        rl.close();
    }else if (answer === 'n'){
        console.log('재미없군요!');
        rl.close();
    }else {
        console.clear();
        console.log('y 또는 n만 입력하세요.');
        rl.question('노드가 재미있습니까 ? (y/n)', answerCallback);
    }
}

rl.question('노드가 재미있습니까 ? (y/n)', answerCallback);
