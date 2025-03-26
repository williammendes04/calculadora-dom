// Elementos
const numero1 = document.getElementById("n1");
const numero2 = document.getElementById("n2");
const resultado = document.getElementById("resultado");
const historyList = document.getElementById("history-list");
const historyContainer = document.querySelector(".history-container");
let operadorSelecionado = "+";
let calculationHistory = [];

// Mostra tooltip ao clicar no input
function mostrarTooltip(input) {
    const tooltip = input.nextElementSibling;
    tooltip.classList.add('visible');
    
    setTimeout(() => {
        tooltip.classList.remove('visible');
    }, 3000);
}

// Validação em tempo real
function validarNumero(input) {
    const tooltip = input.nextElementSibling;
    const cursorPos = input.selectionStart;
    const valorOriginal = input.value;
    
    input.value = valorOriginal
        .replace(/[^0-9.-]/g, '')
        .replace(/(\..*)\./g, '$1')
        .replace(/(?!^)-/g, '');
    
    if (valorOriginal !== input.value) {
        input.classList.add('input-invalido');
        tooltip.classList.add('visible');
        setTimeout(() => {
            input.classList.remove('input-invalido');
            tooltip.classList.remove('visible');
        }, 1500);
        input.setSelectionRange(cursorPos - 1, cursorPos - 1);
    }
}

// Define o operador selecionado
function setOperator(op) {
    operadorSelecionado = op;
    document.querySelectorAll('.operator-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
}

// Função principal de cálculo
function calcular() {
    try {
        const n1 = parseFloat(numero1.value) || 0;
        const n2 = parseFloat(numero2.value) || 0;
        let res, operationSymbol;

        if (isNaN(n1) || isNaN(n2)) {
            throw new Error("Por favor, insira números válidos");
        }

        switch(operadorSelecionado) {
            case '+': res = n1 + n2; operationSymbol = '+'; break;
            case '-': res = n1 - n2; operationSymbol = '-'; break;
            case '*': res = n1 * n2; operationSymbol = '×'; break;
            case '/': 
                res = n2 !== 0 ? n1 / n2 : "Erro: Divisão por zero"; 
                operationSymbol = '÷';
                break;
            case '**': res = Math.pow(n1, n2); operationSymbol = '^'; break;
            case '%': res = n1 % n2; operationSymbol = '%'; break;
            default: res = "Operação inválida";
        }

        resultado.value = res;
        
        if (typeof res === 'number') {
            addToHistory(n1, n2, operationSymbol, res);
        }
    } catch (error) {
        alert(error.message);
        resultado.value = "";
    }
}

// Adiciona cálculo ao histórico
function addToHistory(n1, n2, operator, result) {
    const calculation = {
        n1: n1,
        n2: n2,
        operator: operator,
        result: result,
        timestamp: new Date()
    };
    
    calculationHistory.unshift(calculation);
    if (calculationHistory.length > 5) {
        calculationHistory.pop();
    }
    
    updateHistoryDisplay();
}

// Atualiza a exibição do histórico
function updateHistoryDisplay() {
    historyList.innerHTML = '';
    calculationHistory.forEach(item => {
        const li = document.createElement('li');
        li.textContent = `${item.n1} ${item.operator} ${item.n2} = ${item.result}`;
        historyList.appendChild(li);
    });
}

// Alterna visibilidade do histórico
function toggleHistory() {
    historyContainer.style.display = historyContainer.style.display === 'none' ? 'block' : 'none';
}

// Limpa todos os campos
function limpar() {
    numero1.value = '';
    numero2.value = '';
    resultado.value = '';
    operadorSelecionado = '+';
    document.querySelectorAll('.operator-btn').forEach(btn => {
        btn.classList.remove('active');
    });
}

// Alterna o accordion da descrição
function toggleAccordion() {
    const description = document.querySelector('.project-description');
    const button = document.querySelector('.accordion-btn');
    
    description.classList.toggle('active');
    button.innerHTML = description.classList.contains('active') 
        ? 'Sobre este projeto ▲' 
        : 'Sobre este projeto ▼';
}

// Suporte a teclado
document.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        calcular();
    }
});

// Cria botão para mostrar/ocultar histórico
function createToggleHistoryButton() {
    const btn = document.createElement('button');
    btn.className = 'toggle-history';
    btn.textContent = 'Mostrar/Ocultar Histórico';
    btn.onclick = toggleHistory;
    document.querySelector('.calculator-content').appendChild(btn);
}

// Inicialização
window.onload = function() {
    createToggleHistoryButton();
    // Oculta o histórico inicialmente
    historyContainer.style.display = 'none';
};