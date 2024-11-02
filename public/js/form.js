document.getElementById('add-book-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Previne o envio padrão do formulário

    const livro = {
        id: Date.now().toString(), // Usar um timestamp como string para consistência
        titulo: document.getElementById('titulo').value,
        autor: document.getElementById('autor').value,
        descricao: document.getElementById('descricao').value,
        imagem: document.getElementById('imagem').value,
        historia: document.getElementById('historia').value,
    };

    // Envia o livro para o servidor
    fetch('/data/livros.json', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(livro),
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message || 'Livro adicionado com sucesso!'); // Exibe a mensagem de sucesso
        document.getElementById('add-book-form').reset(); // Limpa o formulário
    })
    .catch(error => console.error('Erro ao adicionar livro:', error));
});
