// js/modules/api-whatsapp.js

/**
 * Gera o link do WhatsApp com mensagem pré-formatada
 */
export function abrirWhatsApp(telefone, nome, categoria) {
    if (!telefone) {
        alert("Cidadão não informou um telefone válido.");
        return;
    }

    // Remove tudo que não for número (ex: parênteses e traços)
    const numeroLimpo = telefone.replace(/\D/g, '');
    
    // Monta a mensagem padrão
    const mensagem = `Olá, ${nome}! Aqui é da equipe do Gabinete. Vimos o seu registro no EloEleitoral sobre a questão de ${categoria} e gostaríamos de dar um retorno sobre o caso.`;
    
    // Codifica a mensagem para o formato de URL
    const textoCodificado = encodeURIComponent(mensagem);
    
    // Cria o link (Assumindo DDI 55 do Brasil)
    const url = `https://wa.me/55${numeroLimpo}?text=${textoCodificado}`;
    
    // Abre em uma nova aba
    window.open(url, '_blank');
}