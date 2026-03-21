// js/pages/config-controller.js

// 1. IMPORTANDO O MOTOR DO MENU
import { carregarMenu } from '../modules/menu.js';

document.addEventListener('DOMContentLoaded', async () => {
    // 2. INJETA O MENU E MARCA A ABA ATIVA
    await carregarMenu();

    // Lógica para Salvar Configurações (Fictícia no MVP, salva no localStorage)
    document.getElementById('form-config').addEventListener('submit', (e) => {
        e.preventDefault();
        const nomeGabinete = document.getElementById('nome-gabinete').value;
        const faseCampanha = document.getElementById('fase-campanha').value;
        
        localStorage.setItem('elo_config_nome', nomeGabinete);
        localStorage.setItem('elo_config_fase', faseCampanha);
        
        alert(`Configurações salvas com sucesso!\n\nGabinete: ${nomeGabinete}\nCiclo: ${faseCampanha}`);
    });

    // Lógica da Zona de Perigo (Reset do LocalStorage)
    document.getElementById('btn-limpar-dados').addEventListener('click', () => {
        const confirmar = confirm("🚨 ATENÇÃO 🚨\n\nIsso apagará TODAS as demandas cadastradas no seu navegador. Essa ação não tem volta. Deseja realmente resetar o sistema para o estado inicial?");
        
        if (confirmar) {
            // Apaga a chave exata onde as demandas estão (definido lá no storage.js)
            localStorage.removeItem('elo_demandas_v1');
            alert("Sistema resetado. Recarregando a página para puxar os dados de demonstração (sementes.json).");
            // Volta para o painel inicial
            window.location.href = 'painel.html';
        }
    });

    // Ao carregar a tela, preenche com os dados salvos anteriormente (se houver)
    const nomeSalvo = localStorage.getItem('elo_config_nome');
    const faseSalva = localStorage.getItem('elo_config_fase');
    
    if (nomeSalvo) document.getElementById('nome-gabinete').value = nomeSalvo;
    if (faseSalva) document.getElementById('fase-campanha').value = faseSalva;
});