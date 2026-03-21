import { carregarMenu } from '../modules/menu.js';

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Carrega o menu lateral padrão
    await carregarMenu();

    // 2. Lógica de Adicionar/Remover Palavras-Chave (Tags)
    const inputKeyword = document.getElementById('input-keyword');
    const btnAddKeyword = document.getElementById('add-keyword-btn');
    const containerTags = document.getElementById('container-tags');

    btnAddKeyword.addEventListener('click', () => {
        const val = inputKeyword.value.trim();
        if (val) {
            adicionarTag(val, containerTags);
            inputKeyword.value = '';
        }
    });

    inputKeyword.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            btnAddKeyword.click();
        }
    });

    // Delegacao de eventos para remover tags
    containerTags.addEventListener('click', (e) => {
        if (e.target.tagName === 'I' || e.target.classList.contains('ph-x')) {
            e.target.closest('.keyword-tag').remove();
        }
    });

    // 3. Botões de Redes Sociais (Toggle ativo)
    document.querySelectorAll('.rede-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            btn.classList.toggle('active');
        });
    });

    // 4. Inicializar o Gráfico de Sentimento
    inicializarGraficoSentimento();

    // 5. Iniciar simulação do Bot de Radar
    iniciarBotSimulado();
});

function adicionarTag(texto, container) {
    const span = document.createElement('span');
    span.className = 'keyword-tag';
    span.innerHTML = `${texto} <i class="ph-bold ph-x" style="margin-left:5px; cursor:pointer;"></i>`;
    container.appendChild(span);
}

function inicializarGraficoSentimento() {
    const ctx = document.getElementById('chartSentimento');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Positivo', 'Neutro', 'Negativo'],
            datasets: [{
                data: [65, 20, 15],
                backgroundColor: ['#38A169', '#A0AEC0', '#E53E3E'],
                borderWidth: 0,
                hoverOffset: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '70%',
            plugins: {
                legend: { position: 'bottom', labels: { usePointStyle: true, padding: 20 } }
            }
        }
    });
}

// SIMULAÇÃO DE DADOS EM TEMPO REAL
const MENSAGENS_MOCK = [
    { fonte: 'Instagram', user: '@eleitor_mario', texto: 'A proposta para a área da <mark>saúde na cidade</mark> parece muito boa! Vamos ver se cumpre.', sent: 'positive', tempo: 'Agora' },
    { fonte: 'Twitter', user: '@cidadao_indignado', texto: 'Inacreditável o que aconteceu hoje. O candidato sumiu quando precisamos.', sent: 'negative', tempo: 'Há 2 min' },
    { fonte: 'Facebook', user: 'Maria Silva', texto: 'Alguém tem o link para a live do candidato amanhã?', sent: 'neutral', tempo: 'Há 5 min' },
    { fonte: 'Google News', user: 'Portal Metrópoles', texto: 'Candidato lidera propostas sobre revitalização do centro da cidade.', sent: 'positive', tempo: 'Há 12 min' },
    { fonte: 'Instagram', user: '@jovem_politica', texto: 'Não gostei do posicionamento no debate. Faltou clareza.', sent: 'negative', tempo: 'Há 15 min' }
];

function iniciarBotSimulado() {
    const feedContainer = document.getElementById('radar-feed-container');
    if (!feedContainer) return;

    // Injeta os dados iniciais
    MENSAGENS_MOCK.forEach(msg => {
        feedContainer.appendChild(criarCardMencao(msg));
    });

    // Simula a chegada de novas mensagens a cada 8 a 15 segundos
    setInterval(() => {
        const novaMencao = gerarMencaoAleatoria();
        const card = criarCardMencao(novaMencao);
        feedContainer.insertBefore(card, feedContainer.firstChild); // Adiciona no topo
        
        // Remove a última se tiver mais de 10 cards para não sobrecarregar
        if (feedContainer.children.length > 10) {
            feedContainer.removeChild(feedContainer.lastChild);
        }
    }, Math.floor(Math.random() * 7000) + 8000);
}

function criarCardMencao(msg) {
    const icones = {
        'Instagram': '<i class="ph-fill ph-instagram-logo" style="color: #E1306C; font-size:1.2rem;"></i>',
        'Twitter': '<i class="ph-fill ph-twitter-logo" style="color: #1DA1F2; font-size:1.2rem;"></i>',
        'Facebook': '<i class="ph-fill ph-facebook-logo" style="color: #1877F2; font-size:1.2rem;"></i>',
        'Google News': '<i class="ph-fill ph-google-logo" style="color: #DB4437; font-size:1.2rem;"></i>'
    };

    const badges = {
        'positive': '<span class="sentiment-badge positive">Positivo</span>',
        'negative': '<span class="sentiment-badge negative">Negativo</span>',
        'neutral': '<span class="sentiment-badge neutral">Neutro</span>'
    };

    const div = document.createElement('div');
    div.className = 'mention-card';
    div.innerHTML = `
        <div class="mention-header">
            <div class="mention-source">
                ${icones[msg.fonte] || ''} ${msg.fonte}
                <span style="font-weight:normal; color:#718096; margin-left:5px;">• ${msg.user}</span>
            </div>
            ${badges[msg.sent]}
        </div>
        <div class="mention-content">
            "${msg.texto}"
        </div>
        <div class="mention-time">
            ${msg.tempo}
        </div>
    `;
    return div;
}

function gerarMencaoAleatoria() {
    const fontes = ['Instagram', 'Twitter', 'Facebook'];
    const sents = ['positive', 'negative', 'neutral'];
    const textos = [
        "Apoiando 100% as novas ideias para o <mark>#joaoprefeito</mark>!",
        "Precisamos de mais clareza sobre os projetos. Ainda estou em dúvida.",
        "Péssima atitude na região norte. O asfalto ainda não chegou.",
        "Alguém sabe onde vai ser o evento de amanhã?",
        "Melhor gestão disparado! Parabéns à equipe."
    ];
    
    const randomSent = sents[Math.floor(Math.random() * sents.length)];
    const randomFonte = fontes[Math.floor(Math.random() * fontes.length)];
    const randomTexto = textos[Math.floor(Math.random() * textos.length)];
    
    return {
        fonte: randomFonte,
        user: '@usuario' + Math.floor(Math.random() * 1000),
        texto: randomTexto,
        sent: randomSent,
        tempo: 'Agora mesmo'
    };
}
