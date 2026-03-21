// js/pages/equipe-controller.js

import { DB_EQUIPE } from '../modules/storage.js';
import { mascaraTelefone } from '../modules/formatadores.js';

// 1. IMPORTANDO O MOTOR DO MENU
import { carregarMenu } from '../modules/menu.js';

let listaEquipe = [];

document.addEventListener('DOMContentLoaded', async () => {
    // 2. INJETA O MENU E MARCA A ABA ATIVA
    await carregarMenu();

    // Carrega a tabela logo que a página abre
    carregarTabelaEquipe();

    const formContainer = document.getElementById('form-cadastro-equipe');
    const form = document.getElementById('form-equipe');
    const inputTel = document.getElementById('eq-tel');

    // Máscara de Telefone em tempo real
    inputTel.addEventListener('input', (e) => { 
        e.target.value = mascaraTelefone(e.target.value); 
    });

    // Controla a exibição do formulário
    document.getElementById('btn-novo-membro').addEventListener('click', () => {
        formContainer.style.display = 'block';
    });
    
    document.getElementById('btn-cancelar-eq').addEventListener('click', () => {
        formContainer.style.display = 'none';
        form.reset();
    });

    // Salvar novo membro da equipe
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const novoMembro = {
            nome: document.getElementById('eq-nome').value,
            telefone: inputTel.value,
            regiao: document.getElementById('eq-regiao').value,
            cargo: document.getElementById('eq-cargo').value
        };
        
        DB_EQUIPE.salvar(novoMembro);
        
        // Limpa e esconde o form, atualiza a tabela
        form.reset();
        formContainer.style.display = 'none';
        carregarTabelaEquipe();
    });

    // Filtro de Busca Dinâmico
    document.getElementById('busca-equipe').addEventListener('input', (e) => {
        const termo = e.target.value.toLowerCase();
        const filtrados = listaEquipe.filter(membro => 
            (membro.nome && membro.nome.toLowerCase().includes(termo)) ||
            (membro.regiao && membro.regiao.toLowerCase().includes(termo)) ||
            (membro.cargo && membro.cargo.toLowerCase().includes(termo))
        );
        renderizarTabelaEquipe(filtrados);
    });
});

function carregarTabelaEquipe() {
    listaEquipe = DB_EQUIPE.obterTodos();
    renderizarTabelaEquipe(listaEquipe);
}

// Gera badges com cores diferentes baseadas na hierarquia da campanha
function getBadgeCargo(cargo) {
    if (cargo === 'Coordenador') return '<span class="badge" style="background:#2A4365; color:#EBF8FF;">⭐ Coordenador</span>';
    if (cargo === 'Cabo Eleitoral') return '<span class="badge" style="background:#C6F6D5; color:#22543D;">🤝 Mobilizador</span>';
    if (cargo === 'Voluntário Digital') return '<span class="badge" style="background:#E9D8FD; color:#44337A;">📱 Digital</span>';
    if (cargo === 'Motorista') return '<span class="badge" style="background:#EDF2F7; color:#4A5568;">🚗 Logística</span>';
    
    return `<span class="badge badge-nova">${cargo}</span>`;
}

function renderizarTabelaEquipe(dados) {
    const tbody = document.querySelector('#tabela-equipe tbody');
    tbody.innerHTML = '';

    if (dados.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;">Nenhum membro da equipe cadastrado no momento.</td></tr>';
        return;
    }

    dados.forEach(membro => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><strong>${membro.nome}</strong></td>
            <td>${membro.telefone}</td>
            <td><i class="ph-fill ph-map-pin" style="color: var(--text-muted); margin-right: 5px;"></i> ${membro.regiao}</td>
            <td>${getBadgeCargo(membro.cargo)}</td>
            <td>
                <button class="btn btn-outline btn-sm btn-zap-equipe" data-tel="${membro.telefone}" data-nome="${membro.nome}" style="padding: 4px 10px; border-color: #38A169; color: #38A169;">
                    <i class="ph-bold ph-whatsapp-logo"></i> Acionar
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });

    // Adiciona o evento de clique aos botões do WhatsApp
    document.querySelectorAll('.btn-zap-equipe').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const button = e.target.closest('button');
            const { tel, nome } = button.dataset;
            abrirZapEquipe(tel, nome);
        });
    });
}

// Função para chamar o WhatsApp adaptada para a equipe
function abrirZapEquipe(tel, nome) { 
    // Manda uma mensagem ligeiramente diferente para a equipe interna
    const mensagem = `Olá, ${nome}! Aqui é do QG do Gabinete. Tudo certo com as demandas da sua região hoje?`;
    const numeroLimpo = tel.replace(/\D/g, '');
    const url = `https://wa.me/55${numeroLimpo}?text=${encodeURIComponent(mensagem)}`;
    window.open(url, '_blank');
}