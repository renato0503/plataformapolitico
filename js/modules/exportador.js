// js/modules/exportador.js

import { formatarDataBR } from './formatadores.js';

export function baixarRelatorioCSV(dados) {
    if (!dados || dados.length === 0) {
        alert("Não há dados para exportar.");
        return;
    }

    // 1. Monta o cabeçalho das colunas
    let csvContent = "Data Recebimento,Cidadao,Contato,Bairro,Categoria,Status,Mensagem\n";

    // 2. Monta as linhas
    dados.forEach(d => {
        const dataStr = formatarDataBR(d.data);
        const nomeStr = `"${d.nome || ''}"`;
        const contatoStr = `"${d.contato || ''}"`;
        const bairroStr = `"${d.bairro || ''}"`;
        const categoriaStr = `"${d.categoria || ''}"`;
        const statusStr = `"${d.status || ''}"`;
        
        // Limpa quebras de linha da mensagem para não quebrar o CSV no Excel
        const msgLimpa = d.mensagem ? `"${d.mensagem.replace(/(\r\n|\n|\r)/gm, " ")}"` : '""';

        csvContent += `${dataStr},${nomeStr},${contatoStr},${bairroStr},${categoriaStr},${statusStr},${msgLimpa}\n`;
    });

    // 3. Cria um "arquivo falso" na memória do navegador e força o clique
    const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `relatorio_gabinete_${new Date().toISOString().split('T')[0]}.csv`);
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}