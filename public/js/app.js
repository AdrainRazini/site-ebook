document.addEventListener('DOMContentLoaded', () => {
    let livros = []; // Variável para armazenar os livros carregados
    const booksList = document.getElementById('books-list');
    const searchForm = document.getElementById('search-form');
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const closeMenu = document.getElementById('close-menu');

    // Função para carregar os livros inicialmente
    async function loadBooks() {
        try {
            const response = await fetch('/data/livros.json');
            if (!response.ok) throw new Error('Erro ao buscar livros.');
            livros = await response.json();
            const melhoresLivros = livros.filter(livro => livro.avaliacao >= 4.5); // Filtra os melhores livros
            displayBooks(melhoresLivros); // Exibe apenas os melhores livros
            mostrarLivrosAnimados(melhoresLivros); // Mostra livros com animação
        } catch (error) {
            booksList.innerHTML = '<p>Erro ao carregar os livros. Tente novamente mais tarde.</p>';
            console.error('Erro ao carregar os livros:', error);
        }
    }

    // Função para exibir os livros com animação
    function mostrarLivrosAnimados(livrosFiltrados) {
        booksList.innerHTML = ''; // Limpa a lista antes de mostrar livros animados
        let index = 0;

        function mostrarLivro() {
            if (index < livrosFiltrados.length) {
                const livro = livrosFiltrados[index];
                const bookDiv = document.createElement('div');
                bookDiv.classList.add('book');
                bookDiv.style.opacity = 0;

                bookDiv.innerHTML = `
                    <img src="${livro.imagem}" alt="${livro.titulo}">
                    <div class="book-title">${livro.titulo}</div>
                    <a href="livros.html?id=${livro.id}" class="btn">Ler</a>
                `;

                booksList.appendChild(bookDiv);

                // Animação de aparecer
                setTimeout(() => {
                    bookDiv.style.transition = 'opacity 0.5s ease-in';
                    bookDiv.style.opacity = 1;
                }, 1);

                index++;
                setTimeout(mostrarLivro, 50); // Ajustado para um intervalo mais fluido
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

        filteredBooks.sort((a, b) => a.titulo.localeCompare(b.titulo)); // Ordena os livros filtrados
        displayBooks(filteredBooks); // Exibe os livros filtrados
    }

    // Função para exibir livros
    function displayBooks(books) {
        booksList.innerHTML = ''; // Limpa a lista de livros
        if (books.length === 0) {
            booksList.innerHTML = '<p>Nenhum livro encontrado.</p>';
            return;
        }

        books.forEach(livro => {
            const bookDiv = document.createElement('div');
            bookDiv.classList.add('book');
            bookDiv.innerHTML = `
                <div class="book-cover">
                    <a href="livros.html?id=${livro.id}">
                        <img src="${livro.imagem}" alt="${livro.titulo}">
                    </a>
                    <div class="book-title">${livro.titulo}</div>
                </div>
                <p>Autor: ${livro.autor}</p>
                <p>${livro.descricao}</p>
                <a href="livros.html?id=${livro.id}" class="btn">Ler</a>
            `;
            booksList.appendChild(bookDiv);
        });
    }

    // Adiciona o evento de busca ao formulário
    searchForm.addEventListener('submit', searchBooks);

    // Controle do menu
    menuToggle.addEventListener('click', () => {
        mobileMenu.classList.toggle('show'); // Alterna a classe 'show'
    });

    closeMenu.addEventListener('click', () => {
        mobileMenu.classList.remove('show'); // Remove a classe 'show'
    });

    // Chama a função para carregar os livros ao iniciar
    loadBooks();
});
