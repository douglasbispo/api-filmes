const request = require("supertest");
const app = require("../server");
const db = require("../config/db");
const filmesService = require("../services/filmesService");

beforeAll(async () => {
  // limpa a tabela antes de começar
  await new Promise((resolve, reject) => {
    db.query("DELETE FROM filmes", (err) => (err ? reject(err) : resolve()));
  });
});

afterAll(async () => {
  // fecha a conexão ao terminar os testes
  db.end();
});

describe("API de Filmes", () => {
  let filmeId;

  test("POST /api/filmes → deve criar um novo filme", async () => {
    const res = await request(app)
      .post("/api/filmes")
      .send({
        titulo: "Matrix",
        genero: "Ficção Científica",
        ano: 1999,
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body.titulo).toBe("Matrix");
    filmeId = res.body.id;
  });

  test("GET /api/filmes → deve retornar lista de filmes", async () => {
    const res = await request(app).get("/api/filmes");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  test("DELETE /api/filmes/:id → deve retornar 400 para ID inválido (não numérico)", async () => {
    const res = await request(app).delete("/api/filmes/abc");
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("message", "ID inválido");
  });

  test("DELETE /api/filmes/:id → deve deletar o filme existente", async () => {
    const res = await request(app).delete(`/api/filmes/${filmeId}`);
    expect(res.statusCode).toBe(204);
  });

  test("DELETE /api/filmes/:id → deve retornar 404 se o filme não existir", async () => {
    const res = await request(app).delete("/api/filmes/9999");
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty("message", "Filme não encontrado");
  });
});

describe("API de Filmes - Testes de Erro", () => {

  test("POST /api/filmes → deve retornar 500 se o service falhar", async () => {
    const originalFunction = filmesService.criarFilme;
    filmesService.criarFilme = jest.fn(() => Promise.reject(new Error("Erro de conexão simulado")));

    const res = await request(app)
      .post("/api/filmes")
      .send({
        titulo: "Inception",
        genero: "Sci-Fi",
        ano: 2010,
      });

    expect(res.statusCode).toBe(500);
    expect(res.body).toHaveProperty("message", "Erro de conexão simulado");

    filmesService.criarFilme = originalFunction; 
  });

  test("POST /api/filmes → deve retornar 400 se o service falhar com erro de validação", async () => {
    const validationError = new Error("Campos obrigatórios faltando");
    validationError.status = 400; 

    const originalFunction = filmesService.criarFilme;
    filmesService.criarFilme = jest.fn(() => Promise.reject(validationError));

    const res = await request(app)
      .post("/api/filmes")
      .send({
        titulo: "Inception",
      });

    expect(res.statusCode).toBe(400);
    filmesService.criarFilme = originalFunction;
  });

  // Teste para GET
  test("GET /api/filmes → deve retornar 500 se o service de listar falhar", async () => {
    const originalFunction = filmesService.listarFilmes;
    filmesService.listarFilmes = jest.fn(() => Promise.reject(new Error("Erro ao buscar no DB simulado")));

    const res = await request(app).get("/api/filmes");

    expect(res.statusCode).toBe(500);
    expect(res.body).toHaveProperty("message", "Erro ao buscar no DB simulado");
    
    filmesService.listarFilmes = originalFunction;
  });

  // Teste para DELETE falhar (Cobre o catch do deleteFilme)
  test("DELETE /api/filmes/:id → deve retornar 500 se o service falhar", async () => {
    const originalFunction = filmesService.removerFilme;
    filmesService.removerFilme = jest.fn(() => Promise.reject(new Error("Erro ao deletar no DB simulado")));

    const res = await request(app).delete("/api/filmes/1");

    expect(res.statusCode).toBe(500);
    expect(res.body).toHaveProperty("message", "Erro ao deletar no DB simulado");
    
    filmesService.removerFilme = originalFunction;
  });
});