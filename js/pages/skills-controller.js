// js/pages/skills-controller.js

import { DB_SKILLS } from '../modules/db-skills.js';

let skillsAtuais = [];
let skillEmEdicao = null;
let filtroAtual = 'Todas';
let termoBusca = '';

const ICONES = ['🎯', '💼', '📊', '🎤', '🤝', '⚡', '💡', '🔧', '📱', '🌐', '📋', '🗳️', '📢', '🎓', '💪', '🔄', '📈', '🛠️', '🌟', '⚙️', '🔗', '📌', '🎪', '🏆'];

const CATEGORIAS = ['Transversal', 'Gestão', 'Política', 'Técnica', 'Comunicação', 'Liderança'];

const CORES = ['#3182CE', '#E53E3E', '#38A169', '#805AD5', '#D69E2E', '#DD6B20', '#319795', '#B83280'];

function renderizarSkills() {
    const container = document.getElementById('skills-grid');
    let skills = DB_SKILLS.obterTodas();
    
    if (termoBusca) {
        skills = DB_SKILLS.buscar(termoBusca);
    } else if (filtroAtual !== 'Todas') {
        skills = DB_SKILLS.filtrarPorCategoria(filtroAtual);
    }
    
    skillsAtuais = skills;
    
    if (skills.length === 0) {
        container.innerHTML = `
            <div class="empty-state" style="grid-column: 1 / -1;">
                <div class="empty-state-icon">🎯</div>
                <h3>Nenhuma skill encontrada</h3>
                <p>Clique em "Nova Skill" para adicionar a primeira.</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = skills.map(skill => `
        <div class="skill-card" data-id="${skill.id}">
            <div class="skill-card-header">
                <div class="skill-icon" style="background-color: ${skill.cor}20; color: ${skill.cor};">
                    ${skill.icone}
                </div>
                <div class="skill-actions">
                    <button onclick="editarSkill('${skill.id}')" title="Editar">✏️</button>
                    <button onclick="confirmarExclusao('${skill.id}')" title="Excluir">🗑️</button>
                </div>
            </div>
            <h3 class="skill-title">${skill.titulo}</h3>
            <p class="skill-description">${skill.descricao}</p>
            <div class="skill-meta">
                <span class="skill-category" style="color: ${skill.cor};">${skill.categoria}</span>
                <div class="skill-level" title="Nível ${skill.nivel} de 5">
                    ${renderizarNivel(skill.nivel)}
                </div>
            </div>
        </div>
    `).join('');
    
    atualizarEstatisticas();
}

function renderizarNivel(nivel) {
    let dots = '';
    for (let i = 1; i <= 5; i++) {
        dots += `<span class="level-dot ${i <= nivel ? 'active' : ''}"></span>`;
    }
    return dots;
}

function atualizarEstatisticas() {
    const todas = DB_SKILLS.obterTodas();
    const total = todas.length;
    const media = todas.length > 0 
        ? (todas.reduce((acc, s) => acc + s.nivel, 0) / todas.length).toFixed(1)
        : 0;
    
    document.getElementById('stat-total').textContent = total;
    document.getElementById('stat-media').textContent = media;
    document.getElementById('stat-categorias').textContent = DB_SKILLS.getCategorias().length - 1;
}

function renderizarCategorias() {
    const container = document.getElementById('filter-tabs');
    const categorias = DB_SKILLS.getCategorias();
    
    container.innerHTML = categorias.map(cat => `
        <button class="filter-tab ${cat === filtroAtual ? 'active' : ''}" onclick="filtrarPorCategoria('${cat}')">
            ${cat}
        </button>
    `).join('');
}

function abrirModal(skill = null) {
    skillEmEdicao = skill;
    const modal = document.getElementById('modal-skills');
    const form = document.getElementById('form-skill');
    const titulo = document.getElementById('modal-titulo');
    
    modal.classList.remove('hidden');
    
    if (skill) {
        titulo.textContent = 'Editar Skill';
        form.titulo.value = skill.titulo;
        form.descricao.value = skill.descricao;
        form.categoria.value = skill.categoria;
        form.nivel.value = skill.nivel;
        document.getElementById('icon-preview').textContent = skill.icone;
        document.getElementById('cor-selecionada').value = skill.cor;
        document.querySelector(`.color-option[data-cor="${skill.cor}"]`)?.classList.add('selected');
        document.querySelector(`.icon-option[data-icone="${skill.icone}"]`)?.classList.add('selected');
    } else {
        titulo.textContent = 'Nova Skill';
        form.reset();
        document.getElementById('icon-preview').textContent = '🎯';
        document.getElementById('cor-selecionada').value = CORES[0];
        document.querySelectorAll('.icon-option').forEach(el => el.classList.remove('selected'));
        document.querySelectorAll('.color-option').forEach(el => el.classList.remove('selected'));
        document.querySelector(`.icon-option[data-icone="🎯"]`)?.classList.add('selected');
        document.querySelector(`.color-option[data-cor="${CORES[0]}"]`)?.classList.add('selected');
    }
    
    atualizarNivelSelector(skill?.nivel || 1);
}

function fecharModal() {
    document.getElementById('modal-skills').classList.add('hidden');
    skillEmEdicao = null;
}

function renderizarIcones() {
    const container = document.getElementById('icon-picker');
    container.innerHTML = ICONES.map(icon => `
        <button type="button" class="icon-option" data-icone="${icon}" onclick="selecionarIcone('${icon}')">
            ${icon}
        </button>
    `).join('');
}

function selecionarIcone(icone) {
    document.querySelectorAll('.icon-option').forEach(el => el.classList.remove('selected'));
    document.querySelector(`.icon-option[data-icone="${icone}"]`).classList.add('selected');
    document.getElementById('icon-preview').textContent = icone;
}

function renderizarCores() {
    const container = document.getElementById('color-picker');
    container.innerHTML = CORES.map(cor => `
        <button type="button" class="color-option" data-cor="${cor}" style="background-color: ${cor};" onclick="selecionarCor('${cor}')"></button>
    `).join('');
}

function selecionarCor(cor) {
    document.querySelectorAll('.color-option').forEach(el => el.classList.remove('selected'));
    document.querySelector(`.color-option[data-cor="${cor}"]`).classList.add('selected');
    document.getElementById('cor-selecionada').value = cor;
}

function atualizarNivelSelector(nivel) {
    document.querySelectorAll('.level-selector button').forEach((btn, i) => {
        btn.classList.toggle('active', i < nivel);
    });
}

function salvarSkill(e) {
    e.preventDefault();
    const form = e.target;
    
    const skillData = {
        titulo: form.titulo.value.trim(),
        descricao: form.descricao.value.trim(),
        icone: document.getElementById('icon-preview').textContent,
        cor: document.getElementById('cor-selecionada').value,
        categoria: form.categoria.value,
        nivel: parseInt(form.nivel.value)
    };
    
    if (skillEmEdicao) {
        DB_SKILLS.atualizar(skillEmEdicao.id, skillData);
    } else {
        DB_SKILLS.salvar(skillData);
    }
    
    fecharModal();
    renderizarSkills();
    renderizarCategorias();
}

function window.editarSkill(id) {
    const skill = DB_SKILLS.obterPorId(id);
    if (skill) {
        abrirModal(skill);
    }
}

function window.confirmarExclusao(id) {
    const skill = DB_SKILLS.obterPorId(id);
    if (!skill) return;
    
    const feedback = document.getElementById('feedback-delete');
    document.getElementById('skill-para-excluir').textContent = skill.titulo;
    feedback.classList.remove('hidden');
    
    window.excluirSkillConfirmado = () => {
        DB_SKILLS.excluir(id);
        feedback.classList.add('hidden');
        renderizarSkills();
        renderizarCategorias();
    };
    
    window.cancelarExclusao = () => {
        feedback.classList.add('hidden');
    };
}

function window.filtrarPorCategoria(categoria) {
    filtroAtual = categoria;
    termoBusca = '';
    document.getElementById('search-input').value = '';
    renderizarCategorias();
    renderizarSkills();
}

function buscarSkills(termo) {
    termoBusca = termo;
    filtroAtual = 'Todas';
    renderizarCategorias();
    renderizarSkills();
}

function inicializar() {
    renderizarIcones();
    renderizarCores();
    renderizarCategorias();
    renderizarSkills();
    
    document.getElementById('btn-nova-skill').addEventListener('click', () => abrirModal());
    document.getElementById('form-skill').addEventListener('submit', salvarSkill);
    document.getElementById('modal-close').addEventListener('click', fecharModal);
    document.getElementById('btn-cancelar').addEventListener('click', fecharModal);
    
    document.getElementById('search-input').addEventListener('input', (e) => {
        buscarSkills(e.target.value);
    });
    
    document.querySelectorAll('.level-selector button').forEach((btn, index) => {
        btn.addEventListener('click', () => {
            document.getElementById('nivel-input').value = index + 1;
            atualizarNivelSelector(index + 1);
        });
    });
    
    document.getElementById('modal-skills').addEventListener('click', (e) => {
        if (e.target.id === 'modal-skills') fecharModal();
    });
}

document.addEventListener('DOMContentLoaded', inicializar);
