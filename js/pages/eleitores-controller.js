// js/pages/eleitores-controller.js

import { DB_ELEITORES } from '../modules/storage.js';
import { mascaraTelefone } from '../modules/formatadores.js';
import { abrirWhatsApp } from '../modules/api-whatsapp.js';

// 1. IMPORTANDO O MOTOR DO MENU
import { carregarMenu } from '../modules/menu.js';

let listaEleitores = [];

document.addEventListener('DOMContentLoaded', async () => {
    // 2. INJETA O MENU E MARCA A ABA ATIVA
    await carregarMenu();

    carregarTabela();

    const formContainer = document.getElementById('form-cadastro-eleitor');
    const form = document.getElementById('form-eleitor');
    const inputTel = document.getElementById('el-tel');

    // Máscara
    inputTel.addEventListener('input', (e) => { 
        e.target.value = mascaraTelefone(e.target.value); 
    });

    // Exibe/Oculta Form
    document.getElementById('btn-novo-eleitor').addEventListener('click', () => {
        formContainer.style.display = 'block';
    });
    
    document.getElementById('btn-cancelar-el').addEventListener('click', () => {
        formContainer.style.display = 'none';
        form.reset();
    });

    // Salvar Novo Eleitor
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const novo = {
            nome: document.getElementById('el-nome').value,
            telefone: inputTel.value,
            bairro: document.getElementById('el-bairro').value,
            perfil: document.getElementById('el-perfil').value,
            mobilizacao: document.getElementById('el-mobilizacao').value,
            notas: document.getElementById('el-notas').value
        };
        DB_ELEITORES.salvar(novo);
        form.reset();
        formContainer.style.display = 'none';
        carregarTabela();
    });

    // Busca Rápida
    document.getElementById('busca-eleitor').addEventListener('input', (e) => {
        const termo = e.target.value.toLowerCase();
        const filtrados = listaEleitores.filter(el => 
            (el.nome && el.nome.toLowerCase().includes(termo)) ||
            (el.telefone && el.telefone.includes(termo)) ||
            (el.bairro && el.bairro.toLowerCase().includes(termo))
        );
        renderizarTabela(filtrados);
    });
});

function carregarTabela() {
    listaEleitores = DB_ELEITORES.obterTodos();
    renderizarTabela(listaEleitores);
}

function getBadge(perfil) {
    if (perfil === 'Liderança') return '<span class="badge" style="background:#FEFCBF; color:#B7791F;">👑 Liderança</span>';
    if (perfil === 'Indeciso') return '<span class="badge" style="background:#EDF2F7; color:#4A5568;">❓ Indeciso</span>';
    return '<span class="badge" style="background:#EBF8FF; color:#2B6CB0;">🤝 Apoiador</span>';
}

function renderizarTabela(dados) {
    const tbody = document.querySelector('#tabela-eleitores tbody');
    tbody.innerHTML = '';

    if (dados.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;">Nenhum eleitor cadastrado no CRM.</td></tr>';
        return;
    }

    dados.forEach(el => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>
                <strong>${el.nome}</strong>
                <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 4px; max-width: 200px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                    <i class="ph-fill ph-note"></i> ${el.notas || 'Sem histórico.'}
                </div>
            </td>
            <td>${el.telefone}</td>
            <td>${el.bairro}</td>
            <td>
                ${getBadge(el.perfil)}<br>
                <small style="color:var(--text-muted); font-weight:600;">Mob: ${el.mobilizacao || 'N/A'}</small>
            </td>
            <td>
                <button class="btn btn-outline btn-sm btn-zap" data-tel="${el.telefone}" data-nome="${el.nome}" style="padding: 4px 10px; border-color: #38A169; color: #38A169;">
                    <i class="ph-bold ph-whatsapp-logo"></i> Acionar
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });

    // Adiciona evento aos botões de zap dinâmicos
    document.querySelectorAll('.btn-zap').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const button = e.target.closest('button');
            const { tel, nome } = button.dataset;
            abrirWhatsApp(tel, nome, 'acompanhamento do mandato');
        });
    });
}