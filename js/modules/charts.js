// js/modules/charts.js

let graficoBairrosInstance = null;
let graficoCategoriasInstance = null;

/**
 * Conta as ocorrências de uma chave específica em um array de objetos
 */
function agregarDados(dados, chave) {
    return dados.reduce((acc, item) => {
        const valor = item[chave] || 'Não Informado';
        acc[valor] = (acc[valor] || 0) + 1;
        return acc;
    }, {});
}

export function renderizarGraficoBairros(dados) {
    const ctx = document.getElementById('chartBairros').getContext('2d');
    const dadosAgregados = agregarDados(dados, 'bairro');
    
    // Ordena do maior para o menor
    const labels = Object.keys(dadosAgregados).sort((a, b) => dadosAgregados[b] - dadosAgregados[a]);
    const valores = labels.map(label => dadosAgregados[label]);

    if (graficoBairrosInstance) graficoBairrosInstance.destroy();

    graficoBairrosInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Volume de Demandas',
                data: valores,
                backgroundColor: '#1A365D',
                borderRadius: 4
            }]
        },
        options: { responsive: true, maintainAspectRatio: false }
    });
}

export function renderizarGraficoCategorias(dados) {
    const ctx = document.getElementById('chartCategorias').getContext('2d');
    const dadosAgregados = agregarDados(dados, 'categoria');
    
    const labels = Object.keys(dadosAgregados);
    const valores = Object.values(dadosAgregados);

    if (graficoCategoriasInstance) graficoCategoriasInstance.destroy();

    graficoCategoriasInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: valores,
                backgroundColor: ['#1A365D', '#38A169', '#3182CE', '#D69E2E', '#E53E3E', '#805AD5', '#319795']
            }]
        },
        options: { responsive: true, maintainAspectRatio: false, cutout: '70%' }
    });
}