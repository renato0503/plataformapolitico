// js/pages/index-controller.js

import { DB } from '../modules/storage.js';

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const demandas = await DB.obterTodas();
        
        if (demandas.length > 0) {
            // Calcula Total
            const total = demandas.length;
            
            // Calcula Bairros Únicos
            const bairrosUnicos = new Set(demandas.map(d => d.bairro).filter(Boolean));
            
            // Calcula Taxa de Resolução
            const resolvidas = demandas.filter(d => d.status === 'Encerrada' || d.status === 'Respondida').length;
            const taxa = Math.round((resolvidas / total) * 100);

            // Injeta na tela
            document.getElementById('stat-cidadaos').textContent = `+${total}`;
            document.getElementById('stat-bairros').textContent = bairrosUnicos.size;
            document.getElementById('stat-taxa').textContent = `${taxa}%`;
        }
    } catch (e) {
        console.log("Erro ao carregar stats da home.", e);
    }
});