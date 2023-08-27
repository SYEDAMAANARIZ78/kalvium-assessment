const express = require('express');
const app = express();
const PORT = 3000;

// Array to store history
const history = [];
function buildExpressionFromURLPath(urlPath) {
    const operators = {
        "plus": "+",
        "minus": "-",
        "into": "*",
        "divided": "/"
    };

    const parts = urlPath.split('/').filter(part => part !== ""); // Remove empty parts

    if (parts.length < 3 || parts.length % 2 === 0) {
        return "Invalid expression"; // Not enough parts or invalid structure
    }

    let expression = parts[0]; // Initialize with the first operand

    for (let i = 1; i < parts.length; i += 2) {
        const operator = operators[parts[i]];
        const operand = parts[i + 1];
        
        if (operator && operand) {
            expression += operator + operand;
        } else {
            return "Invalid expression"; // Invalid operator or operand
        }
    }

    return expression;
}
// Helper function to calculate the result of an expression
const calculateResult = (expression) => {
    try {
        return eval(expression);
    } catch (error) {
        return 'Invalid expression';
    }
};

app.use(express.json()); // Parse JSON in requests


// Endpoint to perform mathematical operations
app.get('/:operands*', async (req, res) => {
    const expression = buildExpressionFromURLPath(req.path);
    const result = calculateResult(expression);
    const operation = {
        question: expression,
        answer: result
    };

    history.push(operation);
    if (history.length > 20) {
        history.shift();
    }

    res.json(operation); // Send the result as JSON
});


// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});