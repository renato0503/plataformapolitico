// js/modules/db-skills.js

const STORAGE_SKILLS = 'elo_skills_v1';

const DEFAULT_SKILLS = [
    {
        id: 'skill_1',
        titulo: 'Comunicação Popular',
        descricao: 'Capacidade de se conectar com diferentes públicos e transmitir mensagens de forma clara e acessível.',
        icone: '🎤',
        cor: '#3182CE',
        categoria: 'Transversal',
        nivel: 4,
        dataCriacao: '2024-01-15T10:00:00Z'
    },
    {
        id: 'skill_2',
        titulo: 'Gestão de Crises',
        descricao: 'Habilidade para tomar decisões rápidas e eficazes em situações de emergência ou conflito.',
        icone: '⚡',
        cor: '#E53E3E',
        categoria: 'Gestão',
        nivel: 3,
        dataCriacao: '2024-01-15T10:00:00Z'
    },
    {
        id: 'skill_3',
        titulo: 'Negociação Política',
        descricao: 'Competência para mediar interesses diversos e construir consensos entre diferentes atores.',
        icone: '🤝',
        cor: '#38A169',
        categoria: 'Política',
        nivel: 5,
        dataCriacao: '2024-01-15T10:00:00Z'
    },
    {
        id: 'skill_4',
        titulo: 'Análise de Dados',
        descricao: 'Capacidade de interpretar indicadores e métricas para fundamentar decisões estratégicas.',
        icone: '📊',
        cor: '#805AD5',
        categoria: 'Técnica',
        nivel: 3,
        dataCriacao: '2024-01-15T10:00:00Z'
    }
];

export const DB_SKILLS = {
    obterTodas: () => {
        let skills = JSON.parse(localStorage.getItem(STORAGE_SKILLS));
        if (!skills || skills.length === 0) {
            localStorage.setItem(STORAGE_SKILLS, JSON.stringify(DEFAULT_SKILLS));
            return DEFAULT_SKILLS;
        }
        return skills;
    },
    
    obterPorId: (id) => {
        const skills = DB_SKILLS.obterTodas();
        return skills.find(s => s.id === id);
    },
    
    salvar: (skill) => {
        let skills = DB_SKILLS.obterTodas();
        const novo = {
            id: `skill_${Date.now()}`,
            dataCriacao: new Date().toISOString(),
            ...skill
        };
        skills.unshift(novo);
        localStorage.setItem(STORAGE_SKILLS, JSON.stringify(skills));
        return novo;
    },
    
    atualizar: (id, dados) => {
        let skills = DB_SKILLS.obterTodas();
        const index = skills.findIndex(s => s.id === id);
        if (index !== -1) {
            skills[index] = { ...skills[index], ...dados };
            localStorage.setItem(STORAGE_SKILLS, JSON.stringify(skills));
            return skills[index];
        }
        return null;
    },
    
    excluir: (id) => {
        let skills = DB_SKILLS.obterTodas();
        const filtered = skills.filter(s => s.id !== id);
        localStorage.setItem(STORAGE_SKILLS, JSON.stringify(filtered));
        return true;
    },
    
    buscar: (termo) => {
        const skills = DB_SKILLS.obterTodas();
        const termoLower = termo.toLowerCase();
        return skills.filter(s => 
            s.titulo.toLowerCase().includes(termoLower) ||
            s.descricao.toLowerCase().includes(termoLower) ||
            s.categoria.toLowerCase().includes(termoLower)
        );
    },
    
    filtrarPorCategoria: (categoria) => {
        if (!categoria || categoria === 'Todas') {
            return DB_SKILLS.obterTodas();
        }
        const skills = DB_SKILLS.obterTodas();
        return skills.filter(s => s.categoria === categoria);
    },
    
    getCategorias: () => {
        const skills = DB_SKILLS.obterTodas();
        const categorias = [...new Set(skills.map(s => s.categoria))];
        return ['Todas', ...categorias.sort()];
    }
};
