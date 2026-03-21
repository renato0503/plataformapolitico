// js/modules/lifecycle.js

const CONFIG_KEY = 'elo_config_v1';

const CONFIG_PADRAO = {
    nomeGabinete: 'Gabinete Demo',
    faseCampanha: 'diagnostico' // Opções: 'diagnostico', 'campanha', 'mandato'
};

export const Lifecycle = {
    obterConfig: () => {
        const config = JSON.parse(localStorage.getItem(CONFIG_KEY));
        return config || CONFIG_PADRAO;
    },
    
    salvarConfig: (novaConfig) => {
        localStorage.setItem(CONFIG_KEY, JSON.stringify(novaConfig));
        return true;
    }
};