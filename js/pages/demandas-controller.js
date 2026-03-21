// js/pages/demandas-controller.js

import { DB } from '../modules/storage.js';
import { formatarDataBR } from '../modules/formatadores.js';
import { abrirWhatsApp } from '../modules/api-whatsapp.js';

// 1. IMPORTANDO O MOTOR DO MENU
import { carregarMenu } from '../modules/menu.js';

let todasDemandas = [];

document.addEventListener('DOMContentLoaded', async () => {
    // 2. INJETA O MENU ANTES DE QUALQUER COISA
    await carregarMenu();

    // Carrega os cartões nas colunas
    await carregarQuadro();

    // Filtro de busca no Kanban
    document.getElementById('busca-kanban').addEventListener('input', (e) => {
        const termo = e.target.value.toLowerCase();
        const filtradas = todasDemandas.filter(d => 
            (d.nome && d.nome.toLowerCase().includes(termo)) ||
            (d.bairro && d.bairro.toLowerCase().includes(termo)) ||
            (d.mensagem && d.mensagem.toLowerCase().includes(termo)) ||
            (d.categoria && d.categoria.toLowerCase().includes(termo))
        );
        renderizarKanban(filtradas);
    });
});

async function carregarQuadro() {
    todasDemandas = await DB.obterTodas();
    renderizarKanban(todasDemandas);
}

function renderizarKanban(demandas) {
    // Limpa as colunas
    const colunas = {
        'Nova': document.getElementById('cards-nova'),
        'Em análise': document.getElementById('cards-analise'),
        'Respondida': document.getElementById('cards-respondida'),
        'Encerrada': document.getElementById('cards-encerrada')
    };

    Object.values(colunas).forEach(col => col.innerHTML = '');

    // Contadores
    const contagens = { 'Nova': 0, 'Em análise': 0, 'Respondida': 0, 'Encerrada': 0 };

    // Distribui os cartões
    demandas.forEach(d => {
        const statusAtual = d.status || 'Nova';
        if (colunas[statusAtual]) {
            colunas[statusAtual].appendChild(criarCartao(d));
            contagens[statusAtual]++;
        }
    });

    // Atualiza os números no topo
    document.getElementById('count-nova').textContent = contagens['Nova'];
    document.getElementById('count-analise').textContent = contagens['Em análise'];
    document.getElementById('count-respondida').textContent = contagens['Respondida'];
    document.getElementById('count-encerrada').textContent = contagens['Encerrada'];
}

function criarCartao(demanda) {
    const div = document.createElement('div');
    div.className = 'k-card';
    
    // Define qual é o próximo status no fluxo
    const fluxo = ['Nova', 'Em análise', 'Respondida', 'Encerrada'];
    const indexAtual = fluxo.indexOf(demanda.status);
    const proximoStatus = indexAtual < 3 ? fluxo[indexAtual + 1] : null;

    let botaoMover = '';
    if (proximoStatus) {
        botaoMover = `<button class="btn-move" onclick="avancarStatus('${demanda.id}', '${proximoStatus}')">
                        Avançar <i class="ph-bold ph-arrow-right"></i>
                      </button>`;
    }

    div.innerHTML = `
        <div class="k-card-header">
            <span class="k-card-bairro">${demanda.bairro || 'Não informado'}</span>
            <span class="k-card-data">${formatarDataBR(demanda.data).split(' ')[0]}</span>
        </div>
        <div class="k-card-title">${demanda.categoria}</div>
        <div class="k-card-msg">"${demanda.mensagem}"</div>
        <div style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 10px;">
            <i class="ph-fill ph-user"></i> ${demanda.nome}
        </div>
        <div class="k-card-footer">
            <button class="btn btn-outline btn-sm btn-zap" style="padding: 2px 8px; border-color: #38A169; color: #38A169;" 
                onclick="abrirZap('${demanda.contato}', '${demanda.nome}', '${demanda.categoria}')">
                <i class="ph-fill ph-whatsapp-logo"></i>
            </button>
            ${botaoMover}
        </div>
    `;
    return div;
}

// Funções Globais para os botões dentro do HTML gerado
window.avancarStatus = async (id, novoStatus) => {
    const sucesso = await DB.atualizarStatus(id, novoStatus);
    if (sucesso) {
        await carregarQuadro(); // Recarrega o quadro inteiro
    }
};

window.abrirZap = (tel, nome, cat) => {
    abrirWhatsApp(tel, nome, cat);
};