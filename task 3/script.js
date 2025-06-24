class Calculator {
    constructor() {
        this.previousOperandElement = document.querySelector('.previous-operand');
        this.currentOperandElement = document.querySelector('.current-operand');
        this.memory = 0;
        this.clear();
        this.setupEventListeners();
    }

    clear() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
        this.updateDisplay();
    }

    delete() {
        if (this.currentOperand === '0') return;
        this.currentOperand = this.currentOperand.toString().slice(0, -1);
        if (this.currentOperand === '') this.currentOperand = '0';
    }

    appendNumber(number) {
        if (number === '.' && this.currentOperand.includes('.')) return;
        if (this.currentOperand === '0' && number !== '.') {
            this.currentOperand = number.toString();
        } else {
            this.currentOperand = this.currentOperand.toString() + number.toString();
        }
    }

    chooseOperation(operation) {
        if (this.currentOperand === '') return;
        if (this.previousOperand !== '') {
            this.calculate();
        }
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '0';
    }

    calculate() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);

        if (isNaN(prev) || isNaN(current)) return;

        try {
            switch (this.operation) {
                case 'add':
                    computation = prev + current;
                    break;
                case 'subtract':
                    computation = prev - current;
                    break;
                case 'multiply':
                    computation = prev * current;
                    break;
                case 'divide':
                    if (current === 0) throw new Error('Cannot divide by zero');
                    computation = prev / current;
                    break;
                case 'power':
                    computation = Math.pow(prev, current);
                    break;
                case 'mod':
                    computation = prev % current;
                    break;
                default:
                    return;
            }

            this.currentOperand = computation.toString();
            this.operation = undefined;
            this.previousOperand = '';
        } catch (error) {
            this.showError(error.message);
        }
    }

    executeFunction(func) {
        const current = parseFloat(this.currentOperand);
        if (isNaN(current)) return;

        try {
            switch (func) {
                case 'sin':
                    this.currentOperand = Math.sin(current * Math.PI / 180).toString();
                    break;
                case 'cos':
                    this.currentOperand = Math.cos(current * Math.PI / 180).toString();
                    break;
                case 'tan':
                    this.currentOperand = Math.tan(current * Math.PI / 180).toString();
                    break;
                case 'log':
                    if (current <= 0) throw new Error('Invalid input for logarithm');
                    this.currentOperand = Math.log10(current).toString();
                    break;
                case 'ln':
                    if (current <= 0) throw new Error('Invalid input for natural logarithm');
                    this.currentOperand = Math.log(current).toString();
                    break;
                case 'sqrt':
                    if (current < 0) throw new Error('Cannot calculate square root of negative number');
                    this.currentOperand = Math.sqrt(current).toString();
                    break;
                case 'factorial':
                    if (current < 0 || !Number.isInteger(current)) {
                        throw new Error('Invalid input for factorial');
                    }
                    this.currentOperand = this.calculateFactorial(current).toString();
                    break;
                case 'pi':
                    this.currentOperand = Math.PI.toString();
                    break;
                case 'e':
                    this.currentOperand = Math.E.toString();
                    break;
                case 'plusMinus':
                    this.currentOperand = (current * -1).toString();
                    break;
            }
        } catch (error) {
            this.showError(error.message);
        }
    }

    calculateFactorial(n) {
        if (n > 170) throw new Error('Number too large for factorial');
        if (n === 0 || n === 1) return 1;
        let result = 1;
        for (let i = 2; i <= n; i++) {
            result *= i;
        }
        return result;
    }

    handleMemory(action) {
        const current = parseFloat(this.currentOperand);
        switch (action) {
            case 'memory':
                this.memory += current;
                this.showMemoryIndicator();
                break;
            case 'memoryRecall':
                this.currentOperand = this.memory.toString();
                break;
        }
    }

    showMemoryIndicator() {
        this.currentOperandElement.classList.add('memory-active');
        setTimeout(() => {
            this.currentOperandElement.classList.remove('memory-active');
        }, 1000);
    }

    showError(message) {
        this.currentOperand = message;
        this.currentOperandElement.classList.add('error');
        setTimeout(() => {
            this.clear();
            this.currentOperandElement.classList.remove('error');
        }, 2000);
    }

    formatNumber(number) {
        const stringNumber = number.toString();
        const integerDigits = parseFloat(stringNumber.split('.')[0]);
        const decimalDigits = stringNumber.split('.')[1];
        let integerDisplay;

        if (isNaN(integerDigits)) {
            integerDisplay = '';
        } else {
            integerDisplay = integerDigits.toLocaleString('en', {
                maximumFractionDigits: 0
            });
        }

        if (decimalDigits != null) {
            return `${integerDisplay}.${decimalDigits}`;
        } else {
            return integerDisplay;
        }
    }

    updateDisplay() {
        this.currentOperandElement.textContent = this.formatNumber(this.currentOperand);
        if (this.operation != null) {
            this.previousOperandElement.textContent = 
                `${this.formatNumber(this.previousOperand)} ${this.getOperationSymbol(this.operation)}`;
        } else {
            this.previousOperandElement.textContent = '';
        }
    }

    getOperationSymbol(operation) {
        const symbols = {
            add: '+',
            subtract: '−',
            multiply: '×',
            divide: '÷',
            power: '^',
            mod: 'mod'
        };
        return symbols[operation] || '';
    }

    setupEventListeners() {
        document.querySelectorAll('.number').forEach(button => {
            button.addEventListener('click', () => {
                this.appendNumber(button.innerText);
                this.updateDisplay();
            });
        });

        document.querySelectorAll('.operator').forEach(button => {
            button.addEventListener('click', () => {
                this.chooseOperation(button.dataset.action);
                this.updateDisplay();
            });
        });

        document.querySelectorAll('.function').forEach(button => {
            button.addEventListener('click', () => {
                const action = button.dataset.action;
                if (action === 'memory' || action === 'memoryRecall') {
                    this.handleMemory(action);
                } else {
                    this.executeFunction(action);
                }
                this.updateDisplay();
            });
        });

        document.querySelector('[data-action="calculate"]').addEventListener('click', () => {
            this.calculate();
            this.updateDisplay();
        });

        document.querySelector('[data-action="clear"]').addEventListener('click', () => {
            this.clear();
        });

        document.querySelector('[data-action="delete"]').addEventListener('click', () => {
            this.delete();
            this.updateDisplay();
        });

        // Keyboard support
        document.addEventListener('keydown', (e) => {
            if (e.key >= '0' && e.key <= '9' || e.key === '.') {
                this.appendNumber(e.key);
                this.updateDisplay();
            } else if (e.key === '+') {
                this.chooseOperation('add');
                this.updateDisplay();
            } else if (e.key === '-') {
                this.chooseOperation('subtract');
                this.updateDisplay();
            } else if (e.key === '*') {
                this.chooseOperation('multiply');
                this.updateDisplay();
            } else if (e.key === '/') {
                e.preventDefault();
                this.chooseOperation('divide');
                this.updateDisplay();
            } else if (e.key === 'Enter' || e.key === '=') {
                e.preventDefault();
                this.calculate();
                this.updateDisplay();
            } else if (e.key === 'Backspace') {
                this.delete();
                this.updateDisplay();
            } else if (e.key === 'Escape') {
                this.clear();
            }
        });
    }
}

const calculator = new Calculator();