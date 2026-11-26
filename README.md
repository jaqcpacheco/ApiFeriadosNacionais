# API de Feriados Nacionais — AS

## 1. Tema e objetivo

O projeto consiste em uma API REST para gerenciamento de feriados, desenvolvida com ASP.NET Core e Entity Framework Core, utilizando SQLite para persistência dos dados.

A aplicação permite cadastrar, consultar, atualizar e excluir feriados, além de disponibilizar uma interface web integrada à API.

Nesta etapa, o projeto foi reorganizado para melhorar a separação de responsabilidades, a manutenção e a organização do código.

## 2. Tecnologias utilizadas

- C#
- .NET 10
- ASP.NET Core Minimal API
- Entity Framework Core
- SQLite
- HTML, CSS e JavaScript
- Postman
- Git e GitHub

## 3. Pré-requisitos

- .NET SDK 10
- Git
- Postman para execução das requisições HTTP

## 4. Como executar o projeto

Clone o repositório:

```bash
git clone https://github.com/jaqcpacheco/ApiFeriadosNacionais.git
```

Acesse a pasta:

```bash
cd ApiFeriadosNacionais
```

Restaure as dependências:

```bash
dotnet restore
```

Compile o projeto:

```bash
dotnet build
```

Execute a aplicação:

```bash
dotnet run --urls http://localhost:5050
```

A interface web estará disponível em:

http://localhost:5050/index.html

## 5. Organização do projeto

```text
ApiFeriadosNacionais/
├── Data/
│   └── ApiDbContext.cs
├── Dtos/
│   └── FeriadoInput.cs
├── Migrations/
├── models/
│   └── FeriadosNacionaisEntity.cs
├── postman/
│   └── ApiFeriadosNacionais.postman_collection.json
├── wwwroot/
├── Program.cs
├── appsettings.json
├── ApiFeriadosNacionais.csproj
├── ApiFeriadosNacionais.postman_collection.json
├── .gitignore
└── README.md
```

### Responsabilidades

- **Models:** entidade que representa os feriados no banco de dados.
- **Dtos:** estrutura responsável pelo recebimento dos dados nas requisições.
- **Data:** contexto do Entity Framework Core e acesso ao banco de dados.
- **Migrations:** gerenciamento da estrutura do banco de dados.
- **wwwroot:** interface web integrada à API.
- **Program.cs:** configuração dos serviços, middlewares e endpoints.
- **appsettings.json:** configurações da aplicação e conexão com o banco de dados.

## 6. Endpoints

| Método | Rota | Descrição | Status |
|---|---|---|---|
| GET | /api/feriados | Listar feriados | 200 |
| GET | /api/feriados/{id} | Consultar feriado | 200 ou 404 |
| POST | /api/feriados | Cadastrar feriado | 201 |
| PUT | /api/feriados/{id} | Atualizar feriado | 200 ou 404 |
| DELETE | /api/feriados/{id} | Excluir feriado | 204 ou 404 |

## 7. Exemplos de requisições

### POST — Cadastro

```json
{
    "nome": "Natal",
    "data": "25/12/2026",
    "tipo": "Nacional"
}
```

### PUT — Atualização

```json
{
    "nome": "Feriado Atualizado",
    "data": "26/12/2026",
    "tipo": "Municipal"
}
```

O identificador é informado na URL nas operações de consulta individual, atualização e exclusão.

## 8. Persistência dos dados

A aplicação utiliza SQLite em conjunto com o Entity Framework Core.

Os dados cadastrados permanecem armazenados mesmo após o encerramento e a reinicialização da aplicação.

## 9. Tratamento de erros

A aplicação possui middleware de tratamento de exceções e utiliza códigos de status HTTP adequados para representar os resultados das operações.

## 10. Collection de testes

As requisições HTTP estão organizadas no arquivo:

`postman/ApiFeriadosNacionais.postman_collection.json`

Para utilizá-las, importe o arquivo no Postman.

O Postman foi utilizado como alternativa ao Bruno devido a limitações de armazenamento no ambiente de desenvolvimento.

## 11. Vídeo de demonstração — AS

Link do vídeo: 

## 12. Autora

Jaqueline da Costa Pacheco

Curso de Análise e Desenvolvimento de Sistemas.