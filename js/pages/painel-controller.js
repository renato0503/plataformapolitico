// js/pages/painel-controller.js

import { DB } from '../modules/storage.js';
import { formatarDataBR } from '../modules/formatadores.js';
import { renderizarGraficoBairros, renderizarGraficoCategorias } from '../modules/charts.js';
import { abrirWhatsApp } from '../modules/api-whatsapp.js';
import { baixarRelatorioCSV } from '../modules/exportador.js';

// 1. IMPORTANDO O NOVO MOTOR DO MENU
import { carregarMenu } from '../modules/menu.js'; 

let dadosEmMemoria = [];

document.addEventListener('DOMContentLoaded', async () => {
    // 2. INJETA O MENU ANTES DE QUALQUER COISA
    await carregarMenu();
    
    // Carrega os dados e gráficos
    await carregarDashboard();
    
    // Configura o filtro de busca ao digitar
    document.getElementById('busca-tabela').addEventListener('input', (e) => {
        const termo = e.target.value.toLowerCase();
        const filtrados = dadosEmMemoria.filter(d => 
            (d.nome && d.nome.toLowerCase().includes(termo)) ||
            (d.bairro && d.bairro.toLowerCase().includes(termo)) ||
            (d.mensagem && d.mensagem.toLowerCase().includes(termo)) ||
            (d.categoria && d.categoria.toLowerCase().includes(termo)) // Permite buscar por categoria também
        );
        renderizarTabela(filtrados);
    });

    // Botão de Exportar CSV
    document.getElementById('btn-exportar').addEventListener('click', (e) => {
        e.preventDefault();
        baixarRelatorioCSV(dadosEmMemoria);
    });
});

async function carregarDashboard() {
    dadosEmMemoria = await DB.obterTodas();
    atualizarKPIs(dadosEmMemoria);
    renderizarGraficoBairros(dadosEmMemoria);
    renderizarGraficoCategorias(dadosEmMemoria);
    renderizarTabela(dadosEmMemoria);
}

function atualizarKPIs(dados) {
    document.getElementById('kpi-total').textContent = dados.length;
    document.getElementById('kpi-novas').textContent = dados.filter(d => d.status === 'Nova' || d.status === 'Em análise').length;
    document.getElementById('kpi-resolvidas').textContent = dados.filter(d => d.status === 'Encerrada' || d.status === 'Respondida').length;
}

function getBadgeClass(status) {
    const map = { 'Nova': 'badge-nova', 'Em análise': 'badge-analise', 'Respondida': 'badge-respondida', 'Encerrada': 'badge-encerrada' };
    return map[status] || 'badge-nova';
}

function renderizarTabela(dados) {
    const tbody = document.querySelector('#tabela-demandas tbody');
    tbody.innerHTML = '';

    if (dados.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;">Nenhuma demanda encontrada.</td></tr>';
        return;
    }

    // 3. Pega apenas as 10 demandas mais recentes para não estourar a tela do Dashboard principal
    const ultimasDemandas = dados.slice(0, 10);

    ultimasDemandas.forEach(demanda => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${formatarDataBR(demanda.data).split(' ')[0]}</td>
            <td><strong>${demanda.nome}</strong><br><small style="color:var(--text-muted)">${demanda.contato}</small></td>
            <td>${demanda.bairro}</td>
            <td>${demanda.categoria}</td>
            <td><span class="badge ${getBadgeClass(demanda.status)}">${demanda.status}</span></td>
            <td>
                <button class="btn btn-success btn-sm btn-zap" data-tel="${demanda.contato}" data-nome="${demanda.nome}" data-cat="${demanda.categoria}" style="padding: 4px 10px;">
                    <i class="ph-bold ph-whatsapp-logo"></i>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });

    // Adiciona o evento de clique nos botões de WhatsApp gerados
    document.querySelectorAll('.btn-zap').forEach(btn => {
        btn.addEventListener('click', (e) => {
            // O closest garante que vai pegar o dataset do botão, mesmo se a pessoa clicar exatamente em cima da tag <i> (do ícone)
            const button = e.target.closest('button');
            const { tel, nome, cat } = button.dataset;
            abrirWhatsApp(tel, nome, cat);
        });
    });
}