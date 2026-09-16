# API Feriados Nacionais

## Sobre o projeto

Esta API REST foi desenvolvida como atividade acadêmica utilizando ASP.NET Core e .NET 10.

O tema escolhido foi **Feriados Nacionais**, tendo como recurso principal os feriados nacionais brasileiros de 2026.

A API permite listar, buscar, cadastrar, atualizar e remover feriados por meio de requisições HTTP.

Os dados são armazenados somente em memória utilizando uma `List<Feriado>`. Portanto, alterações realizadas durante a execução, como cadastros, atualizações e exclusões, são perdidas quando a aplicação é encerrada ou reiniciada.

## Tecnologias utilizadas

* .NET 10
* ASP.NET Core
* Minimal API
* C#
* Postman

## Requisitos

Para executar o projeto é necessário possuir o **SDK do .NET 10** instalado.

Para verificar a versão instalada:

```bash
dotnet --version
```

## Como executar

Clone o repositório e acesse a pasta do projeto.

Restaure e compile o projeto:

```bash
dotnet build
```

Execute a API utilizando a porta `5050`:

```bash
dotnet run --urls http://localhost:5050
```

A API estará disponível em:

`http://localhost:5050`

## Endpoints

| Método | Rota                 | Descrição                               |
| ------ | -------------------- | --------------------------------------- |
| GET    | `/`                  | Verifica se a API está em funcionamento |
| GET    | `/api/feriados`      | Lista todos os feriados                 |
| GET    | `/api/feriados/{id}` | Busca um feriado pelo ID                |
| POST   | `/api/feriados`      | Cadastra um novo feriado                |
| PUT    | `/api/feriados/{id}` | Atualiza um feriado existente           |
| DELETE | `/api/feriados/{id}` | Remove um feriado                       |

## Exemplo de POST

Endpoint:

`POST /api/feriados`

Body JSON:

```json
{
  "nome": "Exemplo de Feriado",
  "data": "10/08/2026",
  "tipo": "Nacional"
}
```

Quando o cadastro é realizado com sucesso, a API retorna o código HTTP **201 Created** e os dados do novo registro.

## Exemplo de PUT

Endpoint:

`PUT /api/feriados/{id}`

Body JSON:

```json
{
  "nome": "Feriado Atualizado",
  "data": "10/08/2026",
  "tipo": "Nacional"
}
```

Quando o registro é encontrado e atualizado, a API retorna **200 OK**.

Caso o ID informado não exista, a API retorna **404 Not Found**.

## Armazenamento dos dados

Esta aplicação não utiliza banco de dados.

Os registros são armazenados em uma `List<Feriado>` em memória. Dessa forma, qualquer cadastro, alteração ou exclusão realizada durante os testes será perdida quando a aplicação for reiniciada.

## Testes com Postman

As requisições utilizadas para testar a API foram organizadas em uma Collection do Postman.

O arquivo exportado da Collection está disponível na pasta:

`postman/`

A Collection contém testes para:

* verificar se a API está no ar;
* listar os feriados;
* buscar um feriado pelo ID;
* cadastrar um novo feriado;
* atualizar um feriado;
* remover um feriado;
* confirmar a remoção por meio de uma resposta `404 Not Found`.

Durante os testes são demonstrados os códigos HTTP **200 OK**, **201 Created**, **204 No Content** e **404 Not Found**.

## Vídeo de demonstração

**Link:** será adicionado após a gravação e publicação do vídeo.

O vídeo apresenta a estrutura do projeto, a execução da API e os testes das operações CRUD utilizando o Postman.
