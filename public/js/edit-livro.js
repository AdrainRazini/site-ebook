document.addEventListener('DOMContentLoaded', () => {
    const livroSelect = document.getElementById('select-livro');
    const form = document.getElementById('edit-livro-form');

    // Carrega os livros existentes para preencher o seletor
    fetch('/data/livros.json')
        .then(response => response.json())
        .then(livros => {
            livros.forEach(livro => {
                const option = document.createElement('option');
                option.value = livro.id;
                option.textContent = livro.titulo;
                livroSelect.appendChild(option);
            });
        })
        .catch(err => console.error('Erro ao carregar os livros:', err));

    // Preenche o formulário com os dados do livro selecionado
    livroSelect.addEventListener('change', () => {
        const livroId = livroSelect.value;
        if (livroId) {
            fetch(`/data/livros.json`)
                .then(response => response.json())
                .then(livros => {
                    const livro = livros.find(l => l.id === livroId);
                    if (livro) {
                        document.getElementById('id-livro').value = livro.id;
                        document.getElementById('titulo').value = livro.titulo;
                        document.getElementById('autor').value = livro.autor;
                        document.getElementById('descricao').value = livro.descricao;
                        document.getElementById('imagem').value = livro.imagem;
                        document.getElementById('historia').value = livro.historia.join('\n');
                        document.getElementById('anoPublicacao').value = livro.anoPublicacao;
                        document.getElementById('genero').value = livro.genero;
                        document.getElementById('editora').value = livro.editora;
                        document.getElementById('pagina').value = livro.pagina;
                        document.getElementById('avaliacao').value = livro.avaliacao;
                        document.getElementById('tags').value = livro.tags.join(', ');
                    }
                });
        }
    });

    // Envia as alterações do livro
    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const livroId = document.getElementById('id-livro').value;
        const dadosLivro = {
            titulo: document.getElementById('titulo').value,
            autor: document.getElementById('autor').value,
            descricao: document.getElementById('descricao').value,
            imagem: document.getElementById('imagem').value,
            historia: document.getElementById('historia').value,
            anoPublicacao: document.getElementById('anoPublicacao').value,
            genero: document.getElementById('genero').value,
            editora: document.getElementById('editora').value,
            pagina: document.getElementById('pagina').value,
            avaliacao: document.getElementById('avaliacao').value,
            tags: document.getElementById('tags').value,
        };

        fetch(`/data/livros/${livroId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dadosLivro)
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message || 'Alterações salvas com sucesso!');
        })
        .catch(err => {
            console.error('Erro ao editar o livro:', err);
            alert('Erro ao salvar as alterações.');
        });
    });
});
