# EloEleitoral 🏛️📊

Plataforma de inteligência de dados, participação cidadã e gestão de gabinete desenvolvida para campanhas eleitorais e mandatos modernos.

## 🚀 Visão Geral
O EloEleitoral é uma solução (MVP) que conecta o cidadão diretamente ao tomador de decisão. Através de formulários inteligentes e painéis analíticos, o gabinete consegue diagnosticar os problemas da cidade, agir rapidamente e prestar contas.

## 🛠️ Arquitetura e Tecnologias
Este MVP foi construído com arquitetura modular estática (MPA - Multi-Page Application) visando alta performance e hospedagem serverless via **GitHub Pages**.

- **Frontend:** HTML5 Acessível, CSS3 (Modular com variáveis CSS) e Vanilla JavaScript (ES6 Modules).
- **Armazenamento:** Persistência no navegador via `localStorage` com simulação de API via JSON estático (`sementes.json`).
- **Análise de Dados:** Integração com **Chart.js** para renderização de dashboards.
- **NLP/IA Simples:** Módulo de classificação automática de textos por palavras-chave (`classificador.js`).
- **Automação:** Deep Linking com API do WhatsApp para respostas com um clique.

## 📂 Estrutura Modular
- `/dialogo.html`: Portal mobile-first para captura de demandas do cidadão.
- `/painel.html`: Dashboard executivo com mapas de calor, KPIs e triagem.
- `/js/modules/`: Componentes lógicos isolados (Formatadores, Exportadores CSV, Cérebro de Banco de Dados).

## 👨‍💻 Desenvolvedor / Contato
Projeto idealizado e estruturado por **CerradoTech / Renato Rosa**. Focado em inovação para o setor público e gestão estratégica.