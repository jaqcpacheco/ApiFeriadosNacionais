# API Feriados Nacionais — AP2

**Autora:** Jaqueline Pacheco

## Sobre o projeto

Projeto acadêmico desenvolvido com ASP.NET Core e .NET 10, com o tema Feriados Nacionais.

Esta entrega evolui o mesmo projeto e repositório da AP1. A lista em memória foi substituída pela persistência em SQLite utilizando Entity Framework Core.

A aplicação permite cadastrar, listar, buscar por ID, atualizar e excluir feriados. O frontend está no mesmo projeto e realiza as operações por meio dos endpoints reais da API.

Os registros não excluídos continuam disponíveis após reiniciar a aplicação.

## Tecnologias

- C# e .NET 10
- ASP.NET Core Minimal API
- Entity Framework Core 10
- SQLite
- HTML, CSS e JavaScript
- Postman

## Organização do projeto

- `Program.cs`: configuração da aplicação, rotas, Model e DbContext.
- `Migrations/`: migrations para criar a estrutura do banco.
- `wwwroot/`: frontend com HTML, CSS e JavaScript.
- `postman/`: Collection com as requisições de teste.
- `appsettings.Development.json`: configuração da conexão SQLite no ambiente de desenvolvimento.
- `ApiFeriadosNacionais.csproj`: configuração e dependências do projeto.

## Requisitos

- SDK do .NET 10.
- Ferramenta de linha de comando do Entity Framework Core 10.
- Postman para executar a Collection.
- Navegador atualizado.

Confira o SDK instalado:

```powershell
dotnet --version
```

Caso ainda não tenha a ferramenta do Entity Framework Core, instale:

```powershell
dotnet tool install --global dotnet-ef --version 10.0.12
```

Confira a instalação:

```powershell
dotnet ef --version
```

## Preparação e execução

### 1. Clonar o repositório

```powershell
git clone https://github.com/jaqcpacheco/ApiFeriadosNacionais.git
cd ApiFeriadosNacionais
```

### 2. Restaurar e compilar

```powershell
dotnet restore
dotnet build
```

### 3. Preparar o banco de dados

No PowerShell, defina o ambiente de desenvolvimento para utilizar a conexão configurada em `appsettings.Development.json`:

```powershell
$env:ASPNETCORE_ENVIRONMENT = "Development"
dotnet ef database update
```

Esse comando aplica as migrations versionadas e cria o banco SQLite local `api-feriados-nacionais.db`.

A conexão utilizada é:

```text
Data Source=api-feriados-nacionais.db
```

O banco local e seus arquivos auxiliares não são versionados. Cada pessoa deve preparar o banco utilizando as migrations.

### 4. Iniciar a aplicação

```powershell
dotnet run --urls http://localhost:5050
```

Mantenha o terminal aberto durante o uso.

## Como abrir a interface

Com a aplicação em execução, acesse:

http://localhost:5050/index.html

A interface é servida pela própria API, na mesma origem. Não é necessário executar outro servidor para o frontend.

Pela interface, é possível:

- Listar os feriados armazenados no banco.
- Cadastrar um feriado.
- Editar um feriado existente.
- Excluir um feriado.
- Atualizar a lista.
- Filtrar os registros por tipo.

O JavaScript utiliza `fetch` para acessar `/api/feriados`. Os dados apresentados são obtidos da API real.

## Modelo de dados

A entidade `FeriadosNacionaisEntity` possui os seguintes campos:

| Campo | Tipo | Descrição |
| --- | --- | --- |
| `id` | inteiro | Identificador gerado pelo banco |
| `nome` | texto | Nome do feriado |
| `data` | texto | Data no formato DD/MM/AAAA |
| `tipo` | texto | Classificação do feriado |

O `ApiDbContext` disponibiliza o conjunto `Feriados`. As operações de criação, atualização e exclusão são gravadas com `SaveChangesAsync()`.

## Rotas da API

URL base: `http://localhost:5050`

| Método | Rota | Operação | Resposta de sucesso |
| --- | --- | --- | --- |
| GET | `/api/feriados` | Listar todos | 200 OK |
| GET | `/api/feriados/{id}` | Buscar por ID | 200 OK |
| POST | `/api/feriados` | Cadastrar | 201 Created |
| PUT | `/api/feriados/{id}` | Atualizar | 200 OK |
| DELETE | `/api/feriados/{id}` | Excluir | 204 No Content |

As operações de busca por ID, atualização e exclusão retornam `404 Not Found` quando o registro não existe.

### Exemplo de cadastro

```http
POST http://localhost:5050/api/feriados
Content-Type: application/json
```

```json
{
  "nome": "Feriado de teste AP2",
  "data": "15/11/2026",
  "tipo": "Nacional"
}
```

Não é necessário enviar o campo `id`: ele é gerado pelo banco.

### Exemplo de atualização

Substitua `{id}` pelo identificador retornado no cadastro.

```http
PUT http://localhost:5050/api/feriados/{id}
Content-Type: application/json
```

```json
{
  "nome": "Feriado atualizado AP2",
  "data": "15/11/2026",
  "tipo": "Facultativo"
}
```

## Testes com Postman

A Collection está disponível em:

[Collection do Postman](postman/Feriados%20Nacionais.postman_collection.json)

Com a aplicação em execução, importe esse arquivo no Postman e execute as requisições na seguinte ordem:

1. Cadastrar um feriado — retorno `201`.
2. Listar os feriados — retorno `200`.
3. Buscar o feriado pelo ID — retorno `200`.
4. Atualizar o feriado — retorno `200`.
5. Consultar novamente para conferir a alteração.
6. Excluir o feriado — retorno `204`.
7. Consultar o ID excluído — retorno `404`.

O POST armazena o ID criado na variável de Collection `feriadoId`, utilizada nas requisições seguintes.

## Teste pelo navegador

1. Abra `http://localhost:5050/index.html`.
2. Cadastre um feriado e confira sua presença na lista.
3. Edite o registro e confira a alteração.
4. Consulte o mesmo registro no Postman para confirmar a integração.
5. Exclua o registro pela interface e confira sua remoção.

## Teste de persistência

1. Cadastre um registro pela interface.
2. Mantenha esse registro salvo, sem excluí-lo.
3. Pare a aplicação com `Ctrl+C`.
4. Execute novamente:

```powershell
dotnet run --urls http://localhost:5050
```

5. Atualize a página do navegador.
6. Confira que o registro continua disponível.

Esse procedimento comprova que os dados estão armazenados no SQLite e permanecem disponíveis após reiniciar a API.

## Vídeo de demonstração — AP2
**Link público:**   https://drive.google.com/file/d/1gS69cSXvWJ5nOzDfEf-JzAz0soT1y_Hf/view?usp=sharing

O vídeo demonstra:

- Organização e execução do projeto.
- CRUD no Postman e códigos de resposta HTTP.
- Resposta `404` após excluir um registro.
- Cadastro, listagem, edição e exclusão pelo frontend.
- Confirmação de um dado da interface pela API.
- Persistência de um registro após reiniciar a aplicação.

O link deve permitir acesso sem solicitação de autorização e ser testado em janela anônima.

## Repositório

https://github.com/jaqcpacheco/ApiFeriadosNacionais