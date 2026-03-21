// js/pages/mapa-controller.js

import { DB } from '../modules/storage.js';

// 1. IMPORTANDO O MOTOR DO MENU
import { carregarMenu } from '../modules/menu.js';

// Base de Coordenadas de Cuiabá (Lat, Lng)
const GEO_BAIRROS = {
    "CPA": [-15.5562, -56.0725],
    "CPA I": [-15.5562, -56.0725],
    "CPA II": [-15.5490, -56.0680],
    "CPA III": [-15.5410, -56.0610],
    "CPA IV": [-15.5350, -56.0550],
    "Coxipó": [-15.6321, -56.0378],
    "Pedra 90": [-15.6881, -56.0125],
    "Tijucal": [-15.6433, -56.0112],
    "Centro": [-15.6014, -56.0974],
    "Centro Sul": [-15.6030, -56.0950],
    "Morada do Ouro": [-15.5721, -56.0711],
    "Santa Rosa": [-15.5847, -56.1158],
    "Jardim Vitória": [-15.5680, -56.0450],
    "Dom Aquino": [-15.6150, -56.0850]
};

const CENTRO_CUIABA = [-15.6010, -56.0974];

let mapaInterativo;
let layerPinos; 
let layerCalor; 
let modoCalorAtivo = false;
let pontosDeCalor = []; 

document.addEventListener('DOMContentLoaded', async () => {
    
    // 2. INJETA O MENU ANTES DE QUALQUER COISA
    await carregarMenu();

    // Inicializa o mapa base
    mapaInterativo = L.map('mapa-container').setView(CENTRO_CUIABA, 12);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap &copy; CARTO',
        maxZoom: 18,
    }).addTo(mapaInterativo);

    layerPinos = L.layerGroup().addTo(mapaInterativo);

    const demandas = await DB.obterTodas();
    processarPlotagem(demandas);

    const btnToggle = document.getElementById('btn-toggle-calor');
    btnToggle.addEventListener('click', () => {
        modoCalorAtivo = !modoCalorAtivo;
        
        if (modoCalorAtivo) {
            mapaInterativo.removeLayer(layerPinos);
            if (!layerCalor) {
                layerCalor = L.heatLayer(pontosDeCalor, {
                    radius: 25, 
                    blur: 15, 
                    maxZoom: 14,
                    gradient: {0.4: 'blue', 0.6: 'cyan', 0.7: 'lime', 0.8: 'yellow', 1.0: 'red'}
                }).addTo(mapaInterativo);
            } else {
                mapaInterativo.addLayer(layerCalor);
            }
            btnToggle.innerHTML = '<i class="ph-fill ph-map-pin" style="margin-right: 5px;"></i> Voltar para Pinos';
            btnToggle.style.borderColor = 'var(--primary-color)';
            btnToggle.style.color = 'var(--primary-color)';
        } else {
            if (layerCalor) mapaInterativo.removeLayer(layerCalor);
            mapaInterativo.addLayer(layerPinos);
            
            btnToggle.innerHTML = '<i class="ph-fill ph-fire" style="margin-right: 5px;"></i> Ver Mapa de Calor';
            btnToggle.style.borderColor = '#E53E3E';
            btnToggle.style.color = '#E53E3E';
        }
    });

    document.getElementById('filtro-mapa').addEventListener('input', (e) => {
        const termo = e.target.value.toLowerCase();
        for (const [bairro, coords] of Object.entries(GEO_BAIRROS)) {
            if (bairro.toLowerCase().includes(termo) && termo.length > 2) {
                mapaInterativo.flyTo(coords, 14, { duration: 1.5 });
                break;
            }
        }
    });
});

function processarPlotagem(demandas) {
    let count = 0;
    layerPinos.clearLayers();
    pontosDeCalor = []; 

    demandas.forEach(demanda => {
        let coords = GEO_BAIRROS[demanda.bairro];
        
        if (!coords && demanda.bairro) {
            for (const [key, value] of Object.entries(GEO_BAIRROS)) {
                if (demanda.bairro.toLowerCase().includes(key.toLowerCase())) {
                    coords = value;
                    break;
                }
            }
        }

        if (coords) {
            const variacaoLat = (Math.random() - 0.5) * 0.015;
            const variacaoLng = (Math.random() - 0.5) * 0.015;
            const posicaoFinal = [coords[0] + variacaoLat, coords[1] + variacaoLng];

            pontosDeCalor.push([posicaoFinal[0], posicaoFinal[1], 1]);

            const popupHTML = `
                <div style="min-width: 220px; font-family: 'Inter', sans-serif;">
                    <div style="background: var(--bg-color); padding: 5px; border-radius: 4px; display: inline-block; font-size: 0.75rem; font-weight: bold; color: var(--primary-color); margin-bottom: 5px;">
                        ${demanda.categoria}
                    </div>
                    <strong style="display: block; font-size: 1rem; color: var(--text-main);">${demanda.bairro}</strong>
                    <p style="margin: 8px 0; color: var(--text-muted); font-size: 0.85rem; line-height: 1.4;">
                        "${demanda.mensagem}"
                    </p>
                    <hr style="border:0; border-top:1px solid #E2E8F0; margin: 10px 0;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <small style="color: var(--text-muted);">👤 ${demanda.nome}</small>
                        <span style="font-size: 0.75rem; background: #EDF2F7; padding: 2px 6px; border-radius: 4px;">${demanda.status}</span>
                    </div>
                </div>
            `;

            const marcador = L.marker(posicaoFinal);
            marcador.bindPopup(popupHTML);
            layerPinos.addLayer(marcador);
            
            count++;
        }
    });

    document.getElementById('map-count').textContent = count;
}