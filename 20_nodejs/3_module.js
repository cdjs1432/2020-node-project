/* exports.add = (a, b) => {
    return a + b;
};

exports.sub = (a, b) => {
    return a - b;
}; */

const myCalc = {
    add(a, b) {
        return a + b;
    },
    sub(a, b) {
        return a - b;
    }
}

// exports.xxx = myCalc;
exports.calc = myCalc;