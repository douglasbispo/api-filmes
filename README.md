# API de Filmes

API REST simples para gerenciar filmes, criada com **Node.js + Express + MySQL**, seguindo uma estrutura **MVC + Services + Middleware**.

---

## Tecnologias

- Node.js
- Express
- MySQL
- dotenv
- nodemon (desenvolvimento)

---

## Estrutura do Projeto

```

api-filmes/
├─ config/
│  └─ db.js
├─ controllers/
│  └─ filmesController.js
├─ middleware/
│  └─ errorHandler.js
├─ models/
│  └─ filme.js
├─ routes/
│  └─ filmesRoutes.js
├─ services/
│  └─ filmesService.js
├─ .env
├─ server.js
├─ package.json
└─ README.md

````

---

## Funcionalidades

- `GET /api/filmes` → Listar todos os filmes.
- `POST /api/filmes` → Adicionar um novo filme (campos: `titulo`, `genero`, `ano`).

---

## Executando a API

1. Clone o repositório:

```bash
git clone https://github.com/douglasbispo/api-filmes.git
cd api-filmes
````

2. Instale as dependências:

```bash
npm install
```

3. Configure o arquivo `.env` com suas credenciais MySQL:

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=api_filmes
PORT=8080
```

4. Crie o banco no MySQL:

```sql
CREATE DATABASE IF NOT EXISTS api_filmes;
```

> Se quiser criar a tabela do zero, pode rodar:

```sql
CREATE TABLE filmes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  titulo VARCHAR(255) NOT NULL,
  genero VARCHAR(100) NOT NULL,
  ano INT NOT NULL
);
```

5. Execute a API:

```bash
npm run dev
```

Acesse em: `http://localhost:8080/api/filmes`

---

## Workflow escolhido

Decidi trabalhar com **MySQL + Services + Middleware de erro**, por alguns motivos:

1. **Persistência real**: os filmes ficam salvos mesmo após reiniciar o servidor.
2. **Separação de responsabilidades**:

   * Models cuidam do banco.
   * Services cuidam da lógica de negócio.
   * Controllers cuidam das requisições/respostas.
3. **Tratamento centralizado de erros**: middleware captura e padroniza mensagens de erro.
4. **Escalabilidade**: estrutura parecida com projetos profissionais, fácil de adicionar novas rotas e regras de negócio.

Mesmo sendo um projeto simples, essa abordagem deixa a API **robusta e organizada**.

---

## Testando no Postman

### GET - Listar filmes

```
GET http://localhost:8080/api/filmes
```

### POST - Adicionar filme

```
POST http://localhost:8080/api/filmes
Headers: Content-Type: application/json
Body:
{
  "titulo": "Matrix",
  "genero": "Ficção Científica",
  "ano": 1999
}
```

> Resposta esperada:

```json
{
  "id": 1,
  "titulo": "Matrix",
  "genero": "Ficção Científica",
  "ano": 1999
}
```
