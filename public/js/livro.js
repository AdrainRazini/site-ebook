document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const livroId = urlParams.get('id');

    // Carregar o livro do JSON
    fetch('/data/livros.json')
        .then(response => response.json())
        .then(livros => {
            const livro = livros.find(l => l.id === livroId);

            if (livro) {
                document.getElementById('livro-titulo').textContent = livro.titulo;
                document.getElementById('livro-autor').textContent = livro.autor;
                document.getElementById('livro-imagem').src = livro.imagem;
                document.getElementById('livro-conteudo').textContent = "Aqui vai o conteúdo do livro...";
            }
        })
        .catch(error => console.error('Erro ao carregar o livro:', error));

    let tempoInicio;
    let tempoLeitura = 0;
    let timer;

    document.getElementById('iniciar-leitura').addEventListener('click', () => {
        tempoInicio = Date.now();
        timer = setInterval(() => {
            const tempoAtual = Math.round((Date.now() - tempoInicio) / 1000);
            document.getElementById('tempo-leitura').textContent = `Tempo de Leitura: ${tempoAtual + tempoLeitura} segundos`;
        }, 1000);
    });

    document.getElementById('parar-leitura').addEventListener('click', () => {
        clearInterval(timer);
        tempoLeitura += Math.round((Date.now() - tempoInicio) / 1000);

        // Coletar dados para enviar
        const usuario = 'Nome do Usuário'; // Você pode modificar para capturar o nome do usuário de forma dinâmica
        const livroId = new URLSearchParams(window.location.search).get('id');

        // Fazer a requisição POST
        fetch('/salvar-leitura', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                livroId: livroId,
                usuario: usuario,
                tempoLeitura: tempoLeitura,
            }),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Leitura salva com sucesso:', data.message);
            alert(`Você leu por ${tempoLeitura} segundos!`);
        })
        .catch(error => {
            console.error('Erro ao salvar a leitura:', error);
        });
    });
});
