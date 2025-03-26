// Definindo todos os estados conforme o desafio
const estados = {
    's0': {
        nome: 'Carro desligado',
        acoes: {
            'a0': [
                {proximo: 's1', probabilidade: 0.7, descricao: 'Carro ligado'},
                {proximo: 's2', probabilidade: 0.2, descricao: 'Bateria fraca'},
                {proximo: 's3', probabilidade: 0.1, descricao: 'Pane elétrica'}
            ]
        }
    },
    's1': {
        nome: 'Carro ligado',
        acoes: {
            'a1': [
                {proximo: 's4', probabilidade: 0.9, descricao: 'Pronto para uso'},
                {proximo: 's5', probabilidade: 0.1, descricao: 'Falha no motor'}
            ]
        }
    },
    's2': {
        nome: 'Bateria fraca',
        acoes: {
            'a2': [
                {proximo: 's6', probabilidade: 0.6, descricao: 'Bateria recarregada'},
                {proximo: 's7', probabilidade: 0.4, descricao: 'Bateria morreu'}
            ]
        }
    },
    's3': {
        nome: 'Pane elétrica',
        acoes: {
            'a3': [
                {proximo: 's8', probabilidade: 0.5, descricao: 'Sistema reiniciado'},
                {proximo: 's9', probabilidade: 0.3, descricao: 'Problema persistente'},
                {proximo: 's10', probabilidade: 0.2, descricao: 'Queima de fusíveis'}
            ]
        }
    },
    // Estados filhos (primeiro nível)
    's4': {
        nome: 'Pronto para uso',
        acoes: {
            'a4': [
                {proximo: 's11', probabilidade: 0.8, descricao: 'Dirigindo normalmente'},
                {proximo: 's12', probabilidade: 0.15, descricao: 'Problema na direção'},
                {proximo: 's13', probabilidade: 0.05, descricao: 'Superaquecimento'}
            ]
        }
    },
    's5': {
        nome: 'Falha no motor',
        acoes: {
            'a5': [
                {proximo: 's14', probabilidade: 0.3, descricao: 'Motor recuperado'},
                {proximo: 's15', probabilidade: 0.6, descricao: 'Motor inoperante'},
                {proximo: 's16', probabilidade: 0.1, descricao: 'Incêndio no motor'}
            ]
        }
    },
    's6': {
        nome: 'Bateria recarregada',
        acoes: {
            'a6': [
                {proximo: 's17', probabilidade: 0.9, descricao: 'Carro ligado com sucesso'},
                {proximo: 's18', probabilidade: 0.1, descricao: 'Problema no alternador'}
            ]
        }
    },
    's7': {
        nome: 'Bateria morreu',
        acoes: {
            'a7': [
                {proximo: 's19', probabilidade: 0.4, descricao: 'Bateria substituída'},
                {proximo: 's20', probabilidade: 0.6, descricao: 'Necessário reboque'}
            ]
        }
    },
    // Estados netos (segundo nível)
    's8': { nome: 'Sistema reiniciado', acoes: {} },
    's9': { nome: 'Problema persistente', acoes: {} },
    's10': { nome: 'Queima de fusíveis', acoes: {} },
    's11': { nome: 'Dirigindo normalmente', acoes: {} },
    's12': { nome: 'Problema na direção', acoes: {} },
    's13': { nome: 'Superaquecimento', acoes: {} },
    's14': { nome: 'Motor recuperado', acoes: {} },
    's15': { nome: 'Motor inoperante', acoes: {} },
    's16': { nome: 'Incêndio no motor', acoes: {} },
    's17': { nome: 'Carro ligado com sucesso', acoes: {} },
    's18': { nome: 'Problema no alternador', acoes: {} },
    's19': { nome: 'Bateria substituída', acoes: {} },
    's20': { nome: 'Necessário reboque', acoes: {} }
};

let estadoAtual = 's0';
let historico = [];

function atualizarTela() {
    // Atualiza o estado atual
    document.getElementById('current-state-id').textContent = estadoAtual;
    document.getElementById('current-state-name').textContent = estados[estadoAtual].nome;
    
    // Atualiza as ações disponíveis
    const acoesContainer = document.getElementById('actions-container');
    acoesContainer.innerHTML = '';
    
    for (const acao in estados[estadoAtual].acoes) {
        const transicoes = estados[estadoAtual].acoes[acao];
        
        const actionBtn = document.createElement('button');
        actionBtn.className = 'action-btn';
        actionBtn.onclick = function() { executarAcao(acao); };
        
        const actionName = document.createElement('span');
        actionName.className = 'action-name';
        actionName.textContent = acao;
        
        const actionProb = document.createElement('span');
        actionProb.className = 'action-prob';
        actionProb.textContent = transicoes.map(t => `${t.proximo} (${(t.probabilidade*100).toFixed(0)}%)`).join(' | ');
        
        actionBtn.appendChild(actionName);
        actionBtn.appendChild(actionProb);
        acoesContainer.appendChild(actionBtn);
    }
    
    // Atualiza o histórico
    atualizarHistorico();
    
    // Atualiza a visualização da árvore de estados
    atualizarArvoreEstados();
}

function executarAcao(acao) {
    const possiveisResultados = estados[estadoAtual].acoes[acao];
    const random = Math.random();
    let somaProbabilidades = 0;
    let resultadoEscolhido;
    
    // Mostra o cálculo das probabilidades
    mostrarCalculoProbabilidade(acao, random);
    
    // Escolhe o resultado baseado nas probabilidades
    for (const resultado of possiveisResultados) {
        somaProbabilidades += resultado.probabilidade;
        if (random <= somaProbabilidades) {
            resultadoEscolhido = resultado;
            break;
        }
    }
    
    // Registra no histórico
    const timestamp = new Date().toLocaleTimeString();
    historico.unshift({
        time: timestamp,
        action: `${estadoAtual}: ${acao}`,
        result: `→ ${resultadoEscolhido.proximo} (${resultadoEscolhido.descricao})`,
        randomValue: random.toFixed(4)
    });
    
    // Muda para o novo estado
    estadoAtual = resultadoEscolhido.proximo;
    
    // Atualiza a tela
    atualizarTela();
}

function mostrarCalculoProbabilidade(acao, randomValue) {
    const calcContainer = document.getElementById('probability-calculation');
    const transicoes = estados[estadoAtual].acoes[acao];
    
    let html = `<div class="prob-step">Valor aleatório gerado: <strong>${randomValue.toFixed(4)}</strong></div>`;
    
    let acumulado = 0;
    for (const trans of transicoes) {
        const limiteSuperior = acumulado + trans.probabilidade;
        html += `<div class="prob-step">`;
        html += `Se ${randomValue.toFixed(4)} ≤ ${limiteSuperior.toFixed(4)} (acumulado ${acumulado.toFixed(4)} + ${trans.probabilidade.toFixed(4)}) → ${trans.proximo}`;
        html += `</div>`;
        acumulado = limiteSuperior;
    }
    
    // Determina qual foi o resultado escolhido
    acumulado = 0;
    let resultadoEscolhido;
    for (const trans of transicoes) {
        if (randomValue <= acumulado + trans.probabilidade) {
            resultadoEscolhido = trans;
            break;
        }
        acumulado += trans.probabilidade;
    }
    
    html += `<div class="prob-result">Resultado: ${resultadoEscolhido.proximo} (${resultadoEscolhido.descricao})</div>`;
    
    calcContainer.innerHTML = html;
}

function atualizarHistorico() {
    const historyList = document.getElementById('history-list');
    historyList.innerHTML = '';
    
    for (const item of historico) {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        
        const timeDiv = document.createElement('div');
        timeDiv.className = 'history-time';
        timeDiv.textContent = item.time;
        
        const actionDiv = document.createElement('div');
        actionDiv.className = 'history-action';
        actionDiv.textContent = item.action;
        
        const resultDiv = document.createElement('div');
        resultDiv.className = 'history-result';
        resultDiv.textContent = item.result;
        
        const randomDiv = document.createElement('div');
        randomDiv.className = 'history-random';
        randomDiv.textContent = `Rand: ${item.randomValue}`;
        
        historyItem.appendChild(timeDiv);
        historyItem.appendChild(actionDiv);
        historyItem.appendChild(resultDiv);
        historyItem.appendChild(randomDiv);
        historyList.appendChild(historyItem);
    }
}

function atualizarArvoreEstados() {
    const statesVis = document.getElementById('states-visualization');
    statesVis.innerHTML = '';
    
    function renderState(stateId, level = 0) {
        const state = estados[stateId];
        const stateElement = document.createElement('div');
        stateElement.className = `state-node ${stateId === estadoAtual ? 'current-state' : ''}`;
        
        const header = document.createElement('div');
        header.className = 'state-node-header';
        
        const idSpan = document.createElement('span');
        idSpan.className = 'state-id';
        idSpan.textContent = stateId;
        
        const nameSpan = document.createElement('span');
        nameSpan.className = 'state-name';
        nameSpan.textContent = state.nome;
        
        header.appendChild(idSpan);
        header.appendChild(nameSpan);
        stateElement.appendChild(header);
        
        if (Object.keys(state.acoes).length > 0) {
            const transitionsContainer = document.createElement('div');
            transitionsContainer.className = 'state-transitions';
            
            for (const action in state.acoes) {
                const actionTransitions = state.acoes[action];
                
                for (const trans of actionTransitions) {
                    const transitionElement = document.createElement('div');
                    transitionElement.className = 'transition';
                    
                    const actionSpan = document.createElement('span');
                    actionSpan.className = 'transition-action';
                    actionSpan.textContent = action;
                    
                    const probSpan = document.createElement('span');
                    probSpan.className = 'transition-prob';
                    probSpan.textContent = `P=${trans.probabilidade}`;
                    
                    transitionElement.appendChild(actionSpan);
                    transitionElement.appendChild(probSpan);
                    transitionsContainer.appendChild(transitionElement);
                    
                    // Renderiza os estados filhos
                    if (estados[trans.proximo] && level < 3) {
                        const childState = renderState(trans.proximo, level + 1);
                        transitionsContainer.appendChild(childState);
                    }
                }
            }
            
            stateElement.appendChild(transitionsContainer);
        }
        
        return stateElement;
    }
    
    statesVis.appendChild(renderState('s0'));
}

function showAllProbabilities() {
    const calcContainer = document.getElementById('probability-calculation');
    let html = '<h3>Matriz Completa de Probabilidades</h3>';
    
    for (const stateId in estados) {
        const state = estados[stateId];
        html += `<div class="prob-matrix-state"><strong>${stateId}: ${state.nome}</strong></div>`;
        
        if (Object.keys(state.acoes).length > 0) {
            html += '<ul>';
            for (const action in state.acoes) {
                const transitions = state.acoes[action];
                html += `<li>${action}:`;
                html += '<ul>';
                for (const trans of transitions) {
                    html += `<li>→ ${trans.proximo} (${trans.descricao}): ${(trans.probabilidade*100).toFixed(0)}%</li>`;
                }
                html += '</ul></li>';
            }
            html += '</ul>';
        } else {
            html += '<div class="prob-matrix-noactions">Sem ações disponíveis</div>';
        }
    }
    
    calcContainer.innerHTML = html;
}

function resetSimulation() {
    estadoAtual = 's0';
    historico = [];
    document.getElementById('probability-calculation').innerHTML = '<p>Clique em uma ação para ver o cálculo das probabilidades</p>';
    atualizarTela();
}

// Inicializa a simulação
atualizarTela();