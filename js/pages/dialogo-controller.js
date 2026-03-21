// js/pages/dialogo-controller.js

// Importando os módulos do nosso "Cérebro"
import { mascaraTelefone } from '../modules/formatadores.js';
import { classificarDemanda } from '../modules/classificador.js';
import { DB } from '../modules/storage.js';

// Mapeamento dos elementos da tela
const form = document.getElementById('form-demanda');
const inputContato = document.getElementById('contato');
const divSucesso = document.getElementById('mensagem-sucesso');
const btnNovaDemanda = document.getElementById('btn-nova-demanda');

// Aplica a máscara de telefone enquanto o eleitor digita
inputContato.addEventListener('input', (e) => {
    e.target.value = mascaraTelefone(e.target.value);
});

// Captura o envio do formulário
form.addEventListener('submit', async (e) => {
    e.preventDefault(); // Impede a página de recarregar

    // Coleta os dados digitados
    const textoMensagem = document.getElementById('mensagem').value.trim();
    
    // Passa a mensagem pela Inteligência (NLP) para definir a categoria
    const categoriaSugerida = classificarDemanda(textoMensagem);

    const novaDemanda = {
        nome: document.getElementById('nome').value.trim(),
        contato: inputContato.value,
        bairro: document.getElementById('bairro').value,
        mensagem: textoMensagem,
        categoria: categoriaSugerida,
        prioridade: "Média" // Padrão inicial
    };

    // Salva no banco local (Storage)
    try {
        await DB.salvar(novaDemanda);
        
        // Esconde o formulário e mostra a tela de agradecimento
        form.style.display = 'none';
        divSucesso.style.display = 'block';
    } catch (error) {
        alert("Houve um erro ao registrar sua demanda. Tente novamente.");
        console.error(error);
    }
});

// Permite o envio de uma nova demanda sem precisar recarregar a página
btnNovaDemanda.addEventListener('click', () => {
    form.reset(); // Limpa os campos
    divSucesso.style.display = 'none';
    form.style.display = 'block';
});