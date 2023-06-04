# `auth`

### Microserviço de registro e login de usuario

<br/>
<br/>

# 🏁 Início Rápido

### Clonar este repositório

``` bash
git clone [this repository]
```

### Acessar diretório

``` bash
cd auth
```

### Instalar módulos NodeJS: Para

``` bash
npm install
```

### Iniciar microserviço

``` bash
npm start
```

<br/>

# Configurações

1. Renomeie o arquivo `.env`.example para `.env`.
2. Abra o arquivo `.env` e defina os valores das seguintes variáveis de ambiente:
SECRET_KEY: Uma chave secreta usada para assinar os tokens JWT.
DATABASE_URL: A URL de conexão com o banco de dados.
<br/>

# ✨ Dependeincias

Dependências:

- bcrypt: Para a criptografia e comparação de senhas.
- express: Para criar o servidor e lidar com as rotas.
- jsonwebtoken: Para gerar e verificar tokens JWT.
- pg: Para a conexão com o banco de dados PostgreSQL.

<br/>
<br/>

# 💻 Como Usar

### O microserviço sobe na porta `5050` mas pode ser alterado no arquivo ``.env`` devinindo PORT

<br/>

## JSON

### Formatação de JSON para requests

``` JSON
{
  "email": "example@example.com",
  "password": "Secr3tp@ssw0rd",
  "phonenumber": "(12)93456-7890",
  "name": " Bongo"
}
```

<br/>

# 🔒 Request de login

## POST - Enviar dados de login

### Realizar uma operação POST com a estrutura especificada no tópico *JSON* acima na URL  `localhost:5050/user/login`

<br/>
<br/>

# ✅ Request de register

## POST - Enviar dados de register

### Realizar uma operação POST com a estrutura especificada no tópico *JSON* acima na URL  `localhost:5050/user/register`

<br/>
