// js/modules/storage.js

const STORAGE_DEMANDAS = 'elo_demandas_v1';
const STORAGE_ELEITORES = 'elo_eleitores_v1';
const STORAGE_EQUIPE = 'elo_equipe_v1';

// --- MÓDULO DE DEMANDAS (Já existente) ---
async function inicializarDemandas() {
    let dados = JSON.parse(localStorage.getItem(STORAGE_DEMANDAS));
    if (dados && dados.length > 0) return dados;

    try {
        const response = await fetch('./data/sementes.json');
        if (!response.ok) throw new Error("Sementes não encontradas");
        const sementes = await response.json();
        localStorage.setItem(STORAGE_DEMANDAS, JSON.stringify(sementes));
        return sementes;
    } catch (error) {
        localStorage.setItem(STORAGE_DEMANDAS, JSON.stringify([]));
        return [];
    }
}

export const DB = {
    obterTodas: async () => {
        let demandas = await inicializarDemandas();
        return demandas.sort((a, b) => new Date(b.data) - new Date(a.data));
    },
    salvar: async (demanda) => {
        let demandas = await inicializarDemandas();
        const nova = { id: String(Date.now()), data: new Date().toISOString(), status: "Nova", ...demanda };
        demandas.unshift(nova);
        localStorage.setItem(STORAGE_DEMANDAS, JSON.stringify(demandas));
        return nova;
    },
    atualizarStatus: async (id, novoStatus) => {
        let demandas = await inicializarDemandas();
        const index = demandas.findIndex(d => d.id === id);
        if (index !== -1) {
            demandas[index].status = novoStatus;
            localStorage.setItem(STORAGE_DEMANDAS, JSON.stringify(demandas));
            return true;
        }
        return false;
    }
};

// --- MÓDULO DE ELEITORES (CRM) ---
export const DB_ELEITORES = {
    obterTodos: () => {
        return JSON.parse(localStorage.getItem(STORAGE_ELEITORES)) || [];
    },
    salvar: (eleitor) => {
        let eleitores = DB_ELEITORES.obterTodos();
        const novo = { id: String(Date.now()), dataCadastro: new Date().toISOString(), ...eleitor };
        eleitores.unshift(novo);
        localStorage.setItem(STORAGE_ELEITORES, JSON.stringify(eleitores));
        return novo;
    }
};

// --- MÓDULO DE EQUIPE ---
export const DB_EQUIPE = {
    obterTodos: () => {
        return JSON.parse(localStorage.getItem(STORAGE_EQUIPE)) || [];
    },
    salvar: (membro) => {
        let equipe = DB_EQUIPE.obterTodos();
        const novo = { id: String(Date.now()), dataCadastro: new Date().toISOString(), ...membro };
        equipe.unshift(novo);
        localStorage.setItem(STORAGE_EQUIPE, JSON.stringify(equipe));
        return novo;
    }
};