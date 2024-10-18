const btnSalvar = document.getElementById('btn-novo');
const btnSalvarAlteracao = document.getElementById('btn-Alteracao');


let idLista;

// btnSalvarAlteracao.classList.add('ocultar-btn');

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

        btnSalvar.classList.remove('btn');
        btnSalvar.classList.add('ocultar-btn');
        btnSalvarAlteracao.classList.remove('ocultar-btn');
        btnSalvarAlteracao.classList.add('btn');
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
    btnSalvar.classList.add('btn');
    btnSalvarAlteracao.classList.add('ocultar-btn');
    btnSalvarAlteracao.classList.remove('btn');
    
    receita(); // Atualiza a receita aqui
}

function mostrarLista() {
    const ul = document.getElementById('lista');
    ul.innerHTML = '';

    const itens = JSON.parse(localStorage.getItem('itens')) || [];

    itens.forEach(item => {
        const div = document.createElement('div');
        div.classList.add('col-12','d-flex', 'justify-content-center', 'align-items-center', 'gap-3');
        const li = document.createElement('li');
        const divSpan = document.createElement('div');
        const spanId = document.createElement('span');
        const spanProduto = document.createElement('span');
        const spanQtde = document.createElement('span');
        const spanPreco = document.createElement('span');
        divSpan.classList.add('col-6','d-flex', 'justify-content-start'  ,'align-content-center', 'gap-1');
        
        spanId.textContent = `${item.id}`;
        spanId.classList.add('col-1');
        spanProduto.textContent = `${item.produto}`;
        spanProduto.classList.add('col-4', 'text-break');
        spanQtde.textContent = `QTDE: ${item.quantidade}`;
        spanQtde.classList.add('col-3');
        spanPreco.textContent = `R$ ${item.preco.toFixed(2)}`;
        spanPreco.classList.add('col-5', 'text-break');

        divSpan.appendChild(spanId);
        divSpan.appendChild(spanProduto);
        divSpan.appendChild(spanQtde);
        divSpan.appendChild(spanPreco);
        
        div.appendChild(divSpan);
        
        
        const btnAlterar = document.createElement('button');
        btnAlterar.classList.add('btn', 'btn-warning', 'btn-sm');
        const btnRemover = document.createElement('button');
        btnRemover.classList.add('btn', 'btn-danger', 'btn-sm');
        btnAlterar.innerText = 'Alterar';
        btnRemover.innerText = 'Remover';

        btnRemover.addEventListener('click', () => { remover(item.id) });
        btnAlterar.addEventListener('click', () => { alterar(item.id) });
        
        const divBtn = document.createElement('div');
        divBtn.classList.add('col-5', 'd-flex', 'justify-content-center', 'gap-2');
        
        divBtn.appendChild(btnAlterar);
        divBtn.appendChild(btnRemover);

        div.appendChild(divBtn);

        const linha = document.createElement('hr');

        // div.appendChild(btnAlterar);
        // div.appendChild(btnRemover);
        li.appendChild(div);
        ul.appendChild(linha);
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
