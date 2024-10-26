const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

const livrosPath = path.join(__dirname, 'data/livros.json');

// Middleware
app.use(cors());
app.use(express.static('public'));
app.use(express.json());

// Função auxiliar para ler o arquivo de livros
const lerLivros = () => JSON.parse(fs.readFileSync(livrosPath, 'utf-8'));

// Função auxiliar para salvar os livros
const salvarLivros = (livros) => fs.writeFileSync(livrosPath, JSON.stringify(livros, null, 2));

// Rota para obter os livros
app.get('/data/livros.json', (req, res) => {
    try {
        const livros = lerLivros();
        res.json(livros);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao ler o arquivo de livros.' });
    }
});

// Rota para adicionar um novo livro
app.post('/data/livros.json', (req, res) => {
    try {
        const livros = lerLivros();
        const novoLivro = {
            id: Date.now().toString(),
            titulo: req.body.titulo,
            autor: req.body.autor,
            descricao: req.body.descricao,
            imagem: req.body.imagem,
            historia: req.body.historia.split('\n'),
            anoPublicacao: req.body.anoPublicacao,
            genero: req.body.genero,
            editora: req.body.editora,
            pagina: req.body.pagina,
            avaliacao: req.body.avaliacao,
            tags: req.body.tags ? req.body.tags.split(',').map(tag => tag.trim()) : [],
            dataAdicao: new Date().toISOString().split('T')[0]
        };

        livros.push(novoLivro);
        salvarLivros(livros);
        res.json({ message: 'Livro adicionado com sucesso!' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao adicionar o livro.' });
    }
});

// Rota para deletar um livro
app.delete('/data/livros.json', (req, res) => {
    const livroId = req.query.id;
    try {
        const livros = lerLivros();
        const livrosAtualizados = livros.filter(livro => livro.id !== livroId);

        if (livros.length === livrosAtualizados.length) {
            return res.status(404).json({ message: 'Livro não encontrado.' });
        }

        salvarLivros(livrosAtualizados);
        res.json({ message: 'Livro deletado com sucesso!' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao deletar o livro.' });
    }
});

// Rota para obter partes da história do livro
app.get('/data/livros/:id/historia', (req, res) => {
    const livroId = req.params.id;
    const pagina = parseInt(req.query.pagina, 10) || 0;

    try {
        const livros = lerLivros();
        const livro = livros.find(l => l.id == livroId);

        if (livro) {
            const partesHistoria = livro.historia;
            const partesPorPagina = 5;
            const inicio = pagina * partesPorPagina;
            const fim = inicio + partesPorPagina;

            res.json({
                historia: partesHistoria.slice(inicio, fim),
                paginaAtual: pagina,
                totalPaginas: Math.ceil(partesHistoria.length / partesPorPagina)
            });
        } else {
            res.status(404).json({ message: 'Livro não encontrado.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Erro ao ler a história do livro.' });
    }
});

// Rota para editar um livro existente
app.put('/data/livros/:id', (req, res) => {
    const livroId = req.params.id;

    try {
        const livros = lerLivros();
        const index = livros.findIndex(livro => livro.id === livroId);

        if (index !== -1) {
            livros[index] = { ...livros[index], ...req.body };
            salvarLivros(livros);
            res.json({ message: 'Livro atualizado com sucesso!' });
        } else {
            res.status(404).json({ message: 'Livro não encontrado.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Erro ao editar o livro.' });
    }
});

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
