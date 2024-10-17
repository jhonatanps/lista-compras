const btnSalvar = document.getElementById('btn-novo');
const btnSalvarAlteracao = document.getElementById('btn-Alteracao');

let idLista;

btnSalvarAlteracao.classList.add('ocultar-btn');

btnSalvarAlteracao.addEventListener('click', salvarAlteracao);
btnSalvar.addEventListener('click', adicionarItem);

function adicionarItem() {
    const produto = document.getElementById('produto').value;
    const quantidade = parseInt(document.getElementById('quantidade').value) || 0;
    const preco = parseFloat(document.getElementById('preco').value.replace(',', '.')) || 0;

    if (!produto) {
        alert('Favor inserir um produto');
        return;
    }

    if (produto && quantidade >= 0 && preco >= 0) {
        // Recupera o array existente ou cria um novo
        let itens = JSON.parse(localStorage.getItem('itens')) || [];
        
        const novoItem = {
            id: itens.length,
            produto: produto,
            quantidade: quantidade,
            preco: preco
        };

        // Adiciona o novo item ao array
        itens.push(novoItem);
        localStorage.setItem('itens', JSON.stringify(itens));

        // Limpa os campos de entrada
        document.getElementById('produto').value = "";
        document.getElementById('quantidade').value = "";
        document.getElementById('preco').value = "";

        // Carregar a lista e atualizar receita
        mostrarLista();
        receita(); // Atualiza a receita aqui
    }
}

function remover(id) {
    let itens = JSON.parse(localStorage.getItem('itens')) || [];
    itens = itens.filter(item => item.id !== id);
    localStorage.setItem('itens', JSON.stringify(itens));
    
    mostrarLista();
    receita(); // Atualiza a receita aqui
}

function alterar(id) {
    let itens = JSON.parse(localStorage.getItem('itens')) || [];
    const obj = itens.find(item => item.id === id);

    if (obj) {
        // Preenche os inputs com os valores existentes para edição
        idLista = obj.id;
        document.getElementById('produto').value = obj.produto;
        document.getElementById('quantidade').value = obj.quantidade;
        document.getElementById('preco').value = obj.preco;

        btnSalvar.classList.add('ocultar-btn');
        btnSalvarAlteracao.classList.remove('ocultar-btn');
    }
}

function salvarAlteracao() {
    let itens = JSON.parse(localStorage.getItem('itens')) || [];

    const produto = document.getElementById('produto').value;
    const quantidade = parseInt(document.getElementById('quantidade').value) || 0;
    const preco = parseFloat(document.getElementById('preco').value.replace(',', '.'));

    const itemAtualizado = {
        id: idLista,
        produto: produto,
        quantidade: quantidade,
        preco: preco
    };

    // Atualiza o item no array
    itens = itens.map(item => item.id === idLista ? itemAtualizado : item);
    localStorage.setItem('itens', JSON.stringify(itens));

    mostrarLista();
    
    // Limpa os campos de entrada
    document.getElementById('produto').value = "";
    document.getElementById('quantidade').value = "";
    document.getElementById('preco').value = "";

    btnSalvar.classList.remove('ocultar-btn');
    btnSalvarAlteracao.classList.add('ocultar-btn');
    
    receita(); // Atualiza a receita aqui
}

function mostrarLista() {
    const ul = document.getElementById('lista');
    ul.innerHTML = '';

    const itens = JSON.parse(localStorage.getItem('itens')) || [];

    itens.forEach(item => {
        const li = document.createElement('li');
        li.textContent = `Produto: ${item.produto} - Quantidade: ${item.quantidade} - Preço: R$${item.preco.toFixed(2)}`;
        
        const btnAlterar = document.createElement('button');
        const btnRemover = document.createElement('button');
        btnAlterar.innerText = 'Alterar';
        btnRemover.innerText = 'Remover';

        btnRemover.addEventListener('click', () => { remover(item.id) });
        btnAlterar.addEventListener('click', () => { alterar(item.id) });
        
        const div = document.createElement('div');
        div.appendChild(btnAlterar);
        div.appendChild(btnRemover);
        li.appendChild(div);
        ul.appendChild(li);
    });
}

function receita() {
    const itens = JSON.parse(localStorage.getItem('itens')) || [];

    const total = itens.reduce((acumulador, item) => {
        if(item.quantidade > 0){
            acumulador += (parseFloat(item.quantidade) * parseFloat(item.preco));
        } else {
            acumulador += parseFloat(item.preco);
        }
        return acumulador;
    }, 0);

    const receita = document.getElementById('receita');
    receita.innerHTML = ''; // Limpa o conteúdo anterior
    const h2 = document.createElement('h2');
    receita.appendChild(h2);
    h2.innerText = `Total: R$${total.toFixed(2)}`; // Formata o total para duas casas decimais
}

// Chama a função receita e mostrarLista apenas no carregamento inicial
document.addEventListener('DOMContentLoaded', () => {
    receita();
    mostrarLista();
});
