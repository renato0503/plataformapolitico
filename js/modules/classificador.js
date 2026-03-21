// js/modules/classificador.js

const DICIONARIO_CATEGORIAS = {
    "Infraestrutura": ["buraco", "asfalto", "rua", "pavimentação", "calçada", "bueiro", "alaga", "ponte"],
    "Saúde": ["médico", "posto", "ubs", "remédio", "consulta", "exame", "hospital", "fila", "medicamento"],
    "Educação": ["escola", "creche", "professor", "merenda", "vaga", "aluno", "ensino"],
    "Segurança": ["roubo", "assalto", "polícia", "iluminação", "escuro", "perigoso", "patrulha", "luz"],
    "Transporte": ["ônibus", "ponto", "linha", "atraso", "trânsito", "semáforo", "frota"],
    "Meio Ambiente": ["lixo", "mato", "terreno", "coleta", "árvore", "poda", "mosquito", "dengue"],
    "Assistência Social": ["cesta", "básica", "auxílio", "cadastro", "cras", "social", "benefício"]
};

/**
 * Analisa o texto e retorna a categoria mais provável
 */
export function classificarDemanda(texto) {
    if (!texto) return "Outros";
    
    const textoLimpo = texto.toLowerCase();
    let melhorCategoria = "Outros";
    let maxPontos = 0;

    for (const [categoria, palavrasChave] of Object.entries(DICIONARIO_CATEGORIAS)) {
        let pontos = 0;
        palavrasChave.forEach(palavra => {
            if (textoLimpo.includes(palavra)) {
                pontos++;
            }
        });

        if (pontos > maxPontos) {
            maxPontos = pontos;
            melhorCategoria = categoria;
        }
    }

    return melhorCategoria;
}