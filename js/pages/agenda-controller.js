import { carregarMenu } from '../modules/menu.js';

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Injeta o menu lateral
    await carregarMenu();

    // 2. Mock de eventos da agenda
    const eventosMock = [
        {
            titulo: 'Caminhada no Bairro CPA',
            tipo: 'Caminhada',
            data: '11 Nov 2026',
            hora: '08:00 - 11:30',
            local: 'Praça Principal do CPA',
            participantes: 'Equipe Azul, Coordenação',
            classeCSS: 'tipo-caminhada'
        },
        {
            titulo: 'Reunião com Lideranças Comunitárias',
            tipo: 'Reunião',
            data: '11 Nov 2026',
            hora: '14:00 - 15:30',
            local: 'Av. das Torres, 1500',
            participantes: 'Conselho de Bairro',
            classeCSS: 'tipo-reuniao'
        },
        {
            titulo: 'Entrevista Rádio Local',
            tipo: 'Mídia',
            data: '12 Nov 2026',
            hora: '09:00 - 10:00',
            local: 'Estúdio FM 99.9',
            participantes: 'Candidato, Assessor de Imprensa',
            classeCSS: 'tipo-midia'
        },
        {
            titulo: 'Carreata Região Norte',
            tipo: 'Mobilização',
            data: '16 Nov 2026',
            hora: '16:00 - 19:00',
            local: 'Ponto de Partida: Trevo MT-010',
            participantes: 'Todos os Voluntários',
            classeCSS: 'tipo-caminhada'
        }
    ];

    // 3. Renderizar eventos
    const feed = document.getElementById('agenda-lista');
    
    eventosMock.forEach(evento => {
        const card = document.createElement('div');
        card.className = `evento-card ${evento.classeCSS}`;
        
        card.innerHTML = `
            <div class="evento-header">
                <h3 class="evento-titulo">${evento.titulo}</h3>
                <span class="evento-tipo">${evento.tipo}</span>
            </div>
            
            <div class="evento-detalhes">
                <span><i class="ph-fill ph-calendar-blank"></i> ${evento.data}</span>
                <span><i class="ph-fill ph-clock"></i> ${evento.hora}</span>
                <span><i class="ph-fill ph-map-pin"></i> ${evento.local}</span>
            </div>
            
            <div class="evento-detalhes" style="margin-top: 5px;">
                <span><i class="ph-fill ph-users"></i> ${evento.participantes}</span>
            </div>
            
            <div class="evento-actions">
                <button class="btn btn-sm btn-outline" onclick="alert('Detalhes do Evento...')"><i class="ph ph-eye"></i> Detalhes</button>
                <button class="btn btn-sm btn-primary" onclick="alert('Compartilhando convite...')"><i class="ph ph-share-network"></i> Convidar</button>
            </div>
        `;
        
        feed.appendChild(card);
    });
});
