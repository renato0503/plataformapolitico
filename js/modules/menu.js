// js/modules/menu.js

export async function carregarMenu() {
    // 1. Puxa as configurações salvas (se existirem) para personalizar o rodapé
    const nomeGabinete = localStorage.getItem('elo_config_nome') || 'Gabinete Padrão';
    const faseCampanha = localStorage.getItem('elo_config_fase') === 'mandato' ? 'Mandato Ativo' : 'Campanha 2026';
    
    // Pega as iniciais para o Avatar (ex: "Gabinete Renato" vira "GR")
    const iniciais = nomeGabinete.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase() || 'GB';

    // 2. Colocamos todo o HTML do menu Premium direto na memória do JS
    const sidebarHTML = `
        <aside class="sidebar">
            <div class="sidebar-header">
                <div class="brand-logo">
                    <i class="ph-fill ph-chat-circle-text"></i>
                </div>
                <span class="brand-name">Elo<strong>Eleitoral</strong></span>
            </div>
            
            <nav class="sidebar-nav">
                <div class="nav-category">Inteligência & Monitoramento</div>
                <a href="painel.html" class="nav-item">
                    <i class="ph ph-squares-four"></i> Visão Geral
                </a>
                <a href="monitoramento.html" class="nav-item">
                    <i class="ph ph-radar"></i> Monitoramento de Redes
                </a>
                <a href="mapa.html" class="nav-item">
                    <i class="ph ph-map-pin"></i> Mapa Eleitoral
                </a>

                <div class="nav-category">Gestão & CRM</div>
                <a href="eleitores.html" class="nav-item">
                    <i class="ph ph-users"></i> Base de Eleitores (CRM)
                </a>
                <a href="demandas.html" class="nav-item">
                    <i class="ph ph-kanban"></i> Demandas & Ofícios
                    <span class="nav-badge danger" id="menu-badge-demandas">Novas</span>
                </a>
                <a href="agenda.html" class="nav-item">
                    <i class="ph ph-calendar-check"></i> Agenda da Campanha
                </a>

                <div class="nav-category">Comunicação</div>
                <a href="disparos.html" class="nav-item">
                    <i class="ph ph-paper-plane-tilt"></i> Disparos (WhatsApp)
                </a>
                <a href="dialogo.html" target="_blank" class="nav-item">
                    <i class="ph ph-browser"></i> Portal do Cidadão
                    <i class="ph ph-arrow-up-right external-icon"></i>
                </a>

                <div class="nav-category">Administração</div>
                <a href="equipe.html" class="nav-item">
                    <i class="ph ph-identification-badge"></i> Equipe / Voluntários
                </a>
                <a href="configuracoes.html" class="nav-item">
                    <i class="ph ph-gear"></i> Configurações
                </a>
            </nav>

            <div class="sidebar-footer">
                <div class="user-mini-profile">
                    <div class="avatar-mini">${iniciais}</div>
                    <div class="user-details">
                        <span class="user-name">${nomeGabinete}</span>
                        <span class="user-role">${faseCampanha}</span>
                    </div>
                </div>
            </div>
        </aside>
    `;

    try {
        // 3. Injeta na div reservada para ele na página
        const container = document.getElementById('sidebar-container');
        if (container) {
            container.innerHTML = sidebarHTML;
        }

        // 4. Lógica inteligente para marcar o link Ativo de azul
        let paginaAtual = window.location.pathname.split('/').pop();
        if (!paginaAtual || paginaAtual === '') paginaAtual = 'painel.html'; // Fallback
        
        const links = document.querySelectorAll('.sidebar-nav .nav-item');
        links.forEach(link => {
            if (link.getAttribute('href') === paginaAtual) {
                link.classList.add('active');
            }
        });

        // 5. Injetar Botão Mobile Header e Overlay
        const header = document.querySelector('.top-header');
        if (header && !document.getElementById('btn-mobile-menu')) {
            const btn = document.createElement('button');
            btn.id = 'btn-mobile-menu';
            btn.className = 'btn-mobile-menu';
            btn.innerHTML = '<i class="ph ph-list"></i>';
            // Ocultado nativamente via .btn-mobile-menu no CSS (só aparece <=768px)
            
            header.insertBefore(btn, header.firstChild);

            const overlay = document.createElement('div');
            overlay.className = 'sidebar-overlay';
            document.body.appendChild(overlay);

            btn.addEventListener('click', () => {
                const sidebar = document.querySelector('.sidebar');
                if(sidebar) sidebar.classList.add('mobile-open');
                overlay.classList.add('active');
            });

            overlay.addEventListener('click', () => {
                const sidebar = document.querySelector('.sidebar');
                if(sidebar) sidebar.classList.remove('mobile-open');
                overlay.classList.remove('active');
            });
        }
        
    } catch (error) {
        console.error("Erro ao injetar o menu lateral:", error);
    }
}