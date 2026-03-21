// js/modules/formatadores.js

/**
 * Aplica máscara de telefone no padrão (XX) XXXXX-XXXX
 */
export function mascaraTelefone(valor) {
    if (!valor) return "";
    let v = valor.replace(/\D/g, ""); // Remove tudo o que não é dígito
    if (v.length > 11) v = v.slice(0, 11); // Limita a 11 dígitos
    
    if (v.length > 10) {
        v = v.replace(/^(\d{2})(\d{5})(\d{4}).*/, "($1) $2-$3");
    } else if (v.length > 5) {
        v = v.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, "($1) $2-$3");
    } else if (v.length > 2) {
        v = v.replace(/^(\d{2})(\d{0,5})/, "($1) $2");
    } else {
        v = v.replace(/^(\d*)/, "($1");
    }
    return v;
}

/**
 * Converte data ISO do banco para o formato de leitura brasileiro
 */
export function formatarDataBR(isoString) {
    if (!isoString) return "--/--/----";
    const data = new Date(isoString);
    return data.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}