
const express = require("express");
const perguntas = require("./perguntas.json");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    projeto: "DAMY",
    challenge: "Amazul",
    descricao: "API educativa sobre tecnologia nuclear",
    status: "online",
    endpoints: [
      "GET /health",
      "GET /perguntas",
      "GET /perguntas/:id",
      "POST /responder"
    ]
  });
});

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    servico: "damy-api"
  });
});

function perguntaPublica(pergunta) {
  return {
    id: pergunta.id,
    tema: pergunta.tema,
    pergunta: pergunta.pergunta,
    alternativas: pergunta.alternativas
  };
}

app.get("/perguntas", (req, res) => {
  res.json(perguntas.map(perguntaPublica));
});

app.get("/perguntas/:id", (req, res) => {
  const id = Number(req.params.id);
  const pergunta = perguntas.find(p => p.id === id);

  if (!pergunta) {
    return res.status(404).json({
      erro: "Pergunta não encontrada"
    });
  }

  res.json(perguntaPublica(pergunta));
});

app.post("/responder", (req, res) => {
  const { respostas } = req.body || {};

  if (!Array.isArray(respostas) ||
      respostas.length === 0 ||
      respostas.some(r =>
        !r ||
        !Number.isInteger(r.id) ||
        !Number.isInteger(r.resposta) ||
        r.resposta < 0 ||
        r.resposta > 3
      )) {
    return res.status(400).json({
      erro: "Envie uma lista válida de respostas"
    });
  }

  const ids = respostas.map(r => r.id);

  if (new Set(ids).size !== ids.length ||
      ids.some(id => !perguntas.some(p => p.id === id))) {
    return res.status(400).json({
      erro: "Perguntas inválidas ou repetidas"
    });
  }

  let acertos = 0;

  const resultado = respostas.map(item => {
    const pergunta = perguntas.find(p => p.id === item.id);
    const acertou = item.resposta === pergunta.correta;

    if (acertou) acertos++;

    return {
      id: pergunta.id,
      acertou,
      respostaCorreta: pergunta.correta,
      explicacao: pergunta.explicacao
    };
  });

  res.json({
    projeto: "DAMY",
    total: respostas.length,
    acertos,
    pontuacao: acertos * 10,
    resultado
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`DAMY API executando na porta ${PORT}`);
});
