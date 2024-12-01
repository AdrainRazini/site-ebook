const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const PORT = process.env.PORT || 3000;

const JSON_BIN_ID = '67266d8ae41b4d34e44d2cb4';
const JSON_BIN_API_KEY = '$2a$10$OfR0ONHrpfIYEftgs1xhne033N7n/tnO7MTYBoyU8K.sy135ST75i';

const apiUrl = `https://api.jsonbin.io/v3/b/${JSON_BIN_ID}`;

// Middleware
app.use(cors());
app.use(express.static('public'));
app.use(express.json());

// Função auxiliar para obter livros
const lerLivros = async () => {
  try {
    const response = await axios.get(apiUrl, {
      headers: { 'X-Master-Key': JSON_BIN_API_KEY }
    });
    return response.data.record;
  } catch (error) {
    console.error('Erro ao ler os livros:', error);
    throw error;
  }
};

// Função auxiliar para salvar livros
const salvarLivros = async (livros) => {
  try {
    await axios.put(apiUrl, livros, {
      headers: {
        'X-Master-Key': JSON_BIN_API_KEY,
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Erro ao salvar os livros:', error);
    throw error;
  }
};

// Rota para obter os livros
app.get('/data/livros.json', async (req, res) => {
  try {
    const livros = await lerLivros();
    res.json(livros);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao obter livros.' });
  }
});

// Rota para adicionar um novo livro
app.post('/data/livros.json', async (req, res) => {
  try {
    const livros = await lerLivros();
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
    await salvarLivros(livros);
    res.json({ message: 'Livro adicionado com sucesso!' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao adicionar o livro.' });
  }
});

// Rota para deletar um livro
app.delete('/data/livros.json', async (req, res) => {
  const livroId = req.query.id;
  try {
    const livros = await lerLivros();
    const livrosAtualizados = livros.filter(livro => livro.id !== livroId);

    if (livros.length === livrosAtualizados.length) {
      return res.status(404).json({ message: 'Livro não encontrado.' });
    }

    await salvarLivros(livrosAtualizados);
    res.json({ message: 'Livro deletado com sucesso!' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao deletar o livro.' });
  }
});

// Inicia o servidor
server.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
