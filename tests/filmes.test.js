const request = require("supertest");
const app = require("../server");
const db = require("../config/db");
const filmesService = require("../services/filmesService");
const errorHandler = require("../middleware/errorHandler");
const util = require("util");

// promisify para deixar o código mais claro
const queryAsync = util.promisify(db.query).bind(db);

beforeAll(async () => {
  // limpa a tabela antes de começar
  await queryAsync("DELETE FROM filmes");
});

afterAll(async () => {
  // garante que a conexão será fechada
  db.end();
});

// restaura todos os mocks depois de cada teste
afterEach(() => {
  jest.restoreAllMocks();
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
    jest.spyOn(filmesService, "criarFilme").mockRejectedValue(new Error("Erro de conexão simulado"));

    const res = await request(app)
      .post("/api/filmes")
      .send({
        titulo: "Inception",
        genero: "Sci-Fi",
        ano: 2010,
      });

    expect(res.statusCode).toBe(500);
    expect(res.body).toHaveProperty("message", "Erro de conexão simulado");
  });

  test("POST /api/filmes → deve retornar 400 se o service falhar com erro de validação", async () => {
    const validationError = new Error("Campos obrigatórios faltando");
    validationError.status = 400;

    jest.spyOn(filmesService, "criarFilme").mockRejectedValue(validationError);

    const res = await request(app)
      .post("/api/filmes")
      .send({
        titulo: "Inception",
      });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("message", "Campos obrigatórios faltando");
  });

  test("POST /api/filmes → deve retornar 401 se o service falhar com erro de autenticação", async () => {
    const authError = new Error("Token inválido");
    authError.status = 401;

    jest.spyOn(filmesService, "criarFilme").mockRejectedValue(authError);

    const res = await request(app)
      .post("/api/filmes")
      .send({
        titulo: "Inception",
        genero: "Sci-Fi",
        ano: 2010,
      });

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty("message", "Token inválido");
  });

  test("GET /api/filmes → deve retornar 500 se o service de listar falhar", async () => {
    jest.spyOn(filmesService, "listarFilmes").mockRejectedValue(new Error("Erro ao buscar no DB simulado"));

    const res = await request(app).get("/api/filmes");

    expect(res.statusCode).toBe(500);
    expect(res.body).toHaveProperty("message", "Erro ao buscar no DB simulado");
  });

  test("DELETE /api/filmes/:id → deve retornar 500 se o service falhar", async () => {
    jest.spyOn(filmesService, "removerFilme").mockRejectedValue(new Error("Erro ao deletar no DB simulado"));

    const res = await request(app).delete("/api/filmes/1");

    expect(res.statusCode).toBe(500);
    expect(res.body).toHaveProperty("message", "Erro ao deletar no DB simulado");
  });
});

// testes unitários do middleware para aumentar cobertura de branches
describe("Middleware - errorHandler", () => {
  test("Deve retornar 500 quando err.status for undefined", () => {
    const err = new Error("Erro genérico");
    // err.status undefined

    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      status: "error",
      message: "Erro genérico",
    });
  });

  test("Deve retornar 500 e mensagem padrão quando err.message for undefined", () => {
    const err = {}; // sem message e sem status
    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      status: "error",
      message: "Erro interno do servidor",
    });
  });
});