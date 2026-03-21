// js/pages/disparos-controller.js

import { DB, DB_ELEITORES } from '../modules/storage.js';

// 1. IMPORTANDO O MOTOR DO MENU
import { carregarMenu } from '../modules/menu.js';

let publicoAtual = [];
let contatosFiltrados = [];

document.addEventListener('DOMContentLoaded', async () => {
    // 2. INJETA O MENU E MARCA A ABA ATIVA
    await carregarMenu();

    // Referências dos elementos
    const selectBase = document.getElementById('filtro-base');
    const inputBairro = document.getElementById('filtro-bairro');
    const inputStatus = document.getElementById('filtro-status');
    const btnFiltrar = document.getElementById('btn-filtrar');
    const textMensagem = document.getElementById('texto-mensagem');
    const btnExportar = document.getElementById('btn-exportar-lote');
    const btnIniciarFila = document.getElementById('btn-iniciar-fila');
    const areaFila = document.getElementById('area-fila-manual');

    // Ao clicar em Filtrar
    btnFiltrar.addEventListener('click', async () => {
        // Carrega a base correta
        if (selectBase.value === 'demandas') {
            publicoAtual = await DB.obterTodas();
        } else {
            publicoAtual = DB_ELEITORES.obterTodos();
        }

        const termoBairro = inputBairro.value.toLowerCase();
        const termoStatus = inputStatus.value.toLowerCase();

        // Filtra a base
        contatosFiltrados = publicoAtual.filter(pessoa => {
            const bairroMatch = !termoBairro || (pessoa.bairro && pessoa.bairro.toLowerCase().includes(termoBairro));
            // Na base de demandas temos categoria/status. Na base de eleitores temos perfil.
            const statusMatch = !termoStatus || 
                (pessoa.status && pessoa.status.toLowerCase().includes(termoStatus)) ||
                (pessoa.categoria && pessoa.categoria.toLowerCase().includes(termoStatus)) ||
                (pessoa.perfil && pessoa.perfil.toLowerCase().includes(termoStatus));
            
            return bairroMatch && statusMatch;
        });

        // Tira contatos sem número de telefone
        contatosFiltrados = contatosFiltrados.filter(p => p.contato || p.telefone);

        // Atualiza o contador na tela
        document.getElementById('contador-alvos').textContent = contatosFiltrados.length;
        areaFila.style.display = 'none'; // Esconde a fila se fez um novo filtro
    });

    // Ao clicar em Iniciar Fila Manual
    btnIniciarFila.addEventListener('click', () => {
        if (contatosFiltrados.length === 0) {
            alert("Nenhum contato selecionado. Aplique os filtros primeiro.");
            return;
        }
        if (!textMensagem.value) {
            alert("Escreva uma mensagem antes de iniciar o disparo.");
            return;
        }
        
        gerarFilaManual(contatosFiltrados, textMensagem.value);
        areaFila.style.display = 'block';
    });

    // Ao clicar em Exportar Lote
    btnExportar.addEventListener('click', () => {
        if (contatosFiltrados.length === 0) {
            alert("Nenhum contato selecionado. Aplique os filtros primeiro.");
            return;
        }
        exportarParaRobo(contatosFiltrados, textMensagem.value);
    });
});

function prepararMensagem(template, nomeOriginal) {
    // Pega só o primeiro nome da pessoa para não ficar robótico (Ex: "João da Silva" vira "João")
    const primeiroNome = (nomeOriginal || "Cidadão").split(" ")[0];
    return template.replace(/{nome}/g, primeiroNome);
}

function gerarFilaManual(contatos, templateMsg) {
    const tbody = document.querySelector('#tabela-fila tbody');
    tbody.innerHTML = '';

    contatos.forEach((c, index) => {
        const telefoneOriginal = c.contato || c.telefone;
        const numeroLimpo = telefoneOriginal.replace(/\D/g, '');
        const mensagemPronta = prepararMensagem(templateMsg, c.nome);
        const urlZap = `https://wa.me/55${numeroLimpo}?text=${encodeURIComponent(mensagemPronta)}`;

        const tr = document.createElement('tr');
        // Adiciona um ID para podermos "riscar" a linha quando o botão for clicado
        tr.id = `fila-row-${index}`;
        tr.innerHTML = `
            <td><strong>${c.nome}</strong></td>
            <td>${telefoneOriginal}</td>
            <td>${c.bairro || '--'}</td>
            <td>
                <a href="${urlZap}" target="_blank" class="btn btn-success btn-sm" onclick="marcarComoEnviado(${index})">
                    <i class="ph-bold ph-paper-plane-right"></i> Enviar
                </a>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Função global para deixar a linha "apagada" após clicar em enviar
window.marcarComoEnviado = function(index) {
    const row = document.getElementById(`fila-row-${index}`);
    if (row) {
        row.style.opacity = '0.5';
        const btn = row.querySelector('.btn');
        btn.classList.remove('btn-success');
        btn.classList.add('btn-outline');
        btn.innerHTML = '<i class="ph-bold ph-check"></i> Enviado';
    }
}

function exportarParaRobo(contatos, templateMsg) {
    let csvContent = "Nome,Telefone,Mensagem\n";

    contatos.forEach(c => {
        const telefoneOriginal = c.contato || c.telefone;
        const numeroLimpo = "55" + telefoneOriginal.replace(/\D/g, ''); // Padrão DDI Brasil
        const mensagemPronta = prepararMensagem(templateMsg, c.nome);
        
        const nomeStr = `"${c.nome || ''}"`;
        const numStr = `"${numeroLimpo}"`;
        const msgStr = `"${mensagemPronta.replace(/(\r\n|\n|\r)/gm, " ")}"`;

        csvContent += `${nomeStr},${numStr},${msgStr}\n`;
    });

    const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `lista_disparo_${new Date().getTime()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}