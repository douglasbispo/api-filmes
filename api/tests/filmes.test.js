const request = require("supertest");
const app = require("../server");
const db = require("../config/db");

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