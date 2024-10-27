document.addEventListener('DOMContentLoaded', () => {
    let livros = []; // Variável para armazenar os livros carregados

    // Função para carregar os livros inicialmente
    async function loadBooks() {
        try {
            const response = await fetch('/data/livros.json');
            livros = await response.json();
            displayBooks(livros); // Exibe todos os livros carregados
            mostrarLivrosAnimados(); // Mostra livros com animação
        } catch (error) {
            console.error('Erro ao carregar os livros:', error);
        }
    }

    // Função para exibir os livros com animação
    function mostrarLivrosAnimados() {
        const booksList = document.getElementById('books-list');
        booksList.innerHTML = ''; // Limpa a lista antes de mostrar livros animados
        let index = 0;

        function mostrarLivro() {
            if (index < livros.length) {
                const livro = livros[index];
                const bookDiv = document.createElement('div');
                bookDiv.classList.add('book');
                bookDiv.style.opacity = 0;

                // Estrutura do livro com o título sobreposto à imagem
                bookDiv.innerHTML = `
                    <img src="${livro.imagem}" alt="${livro.titulo}">
                    <div class="book-title">${livro.titulo}</div>
                    <a href="livros.html?id=${livro.id}" class="btn">Ler</a>
                `;

                booksList.appendChild(bookDiv);

                // Animação de aparecer
                setTimeout(() => {
                    bookDiv.style.transition = 'opacity 0.1s ease-in';
                    bookDiv.style.opacity = 1;
                }, 10);

                index++;
                setTimeout(mostrarLivro, 1000);
            }
        }

        mostrarLivro();
    }

    // Função para buscar livros
    function searchBooks(event) {
        event.preventDefault(); // Previne o envio padrão do formulário
        const searchInput = document.getElementById('search-input').value.toLowerCase();
        const filteredBooks = livros.filter(livro => 
            livro.titulo.toLowerCase().includes(searchInput) || 
            livro.autor.toLowerCase().includes(searchInput)
        );

        // Ordena os livros filtrados por título
        filteredBooks.sort((a, b) => {
            const titleA = a.titulo.toLowerCase();
            const titleB = b.titulo.toLowerCase();
            return titleA.localeCompare(titleB);
        });

        displayBooks(filteredBooks); // Exibe os livros filtrados
    }

    // Função para exibir os livros
    function displayBooks(books) {
        const booksList = document.getElementById('books-list');
        booksList.innerHTML = ''; // Limpa a lista de livros

        if (books.length === 0) {
            booksList.innerHTML = '<p>Nenhum livro encontrado.</p>';
            return;
        }

        books.forEach(livro => {
            // Cria um elemento para cada livro e o adiciona diretamente na lista
            const bookDiv = document.createElement('div');
            bookDiv.classList.add('book'); // Classe para estilização
            bookDiv.innerHTML = `
                <img src="${livro.imagem}" alt="${livro.titulo}">
                <div class="book-title">${livro.titulo}</div>
                <p>Autor: ${livro.autor}</p>
                <p>${livro.descricao}</p>
                <a href="livros.html?id=${livro.id}" class="btn">Ler</a>
            `;
            booksList.appendChild(bookDiv);
        });
    }

    // Adiciona o evento de busca ao formulário
    const searchForm = document.getElementById('search-form');
    searchForm.addEventListener('submit', searchBooks);

    // Chama a função para carregar os livros ao iniciar
    loadBooks();
});
// app.js
document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');

    menuToggle.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden'); // Alterna a classe 'hidden' para mostrar/ocultar o menu
    });
});
