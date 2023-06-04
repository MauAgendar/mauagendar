# `calendar`

### Microserviço de agendamento de atividades do usuario

<br/>
<br/>

# 🏁 Início Rápido

### Clonar este repositório

``` bash
git clone [this repository]
```

### Acessar diretório

``` bash
cd calendar
```

### Instalar módulos NodeJS

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

<br/>

# 💻 Como Usar

### O microserviço sobe na porta `5000` mas pode ser alterado no arquivo `.env` devinindo PORT

<br/>

## JSON

### Formatação de JSON para requests

``` JSON
{
    "title": "fazer café",
    "description": "cafezinho da tarde",
    "start_time": "2023-05-30T03:00:00.000Z",
    "end_time": "2023-03-30T03:00:00.000Z"
}
```

<br/>

# 📅 Request para a atividade

## GET - Obter atividades cadastradas

### Realizar uma operação GET na URL  `localhost:5000/user/:userId/appointments`
>
>":userId" trata-se do numero de Id de um usuario especifico

<br/>
<br/>

## POST - Criação de atividade

### Realizar uma operação POST com a estrutura especificada no tópico *JSON* acima na URL  `localhost:5000/user/:userId/appointments`
>
>":userId" trata-se do numero de Id de um usuario especifico

<br/>
<br/>

## PUT - Atualizar atividade

### Realizar uma operação PUT com a estrutura especificada no tópico *JSON* acima na URL `localhost:5000/user/:userId/appointments/:appointmentId`

>":userId" trata-se do numero de Id de um usuario especifico

>":appointmentId" trata-se do numero da atividade

<br/>
<br/>

## DELETE - Deletar atividade

### Realizar uma operação DELETE com a estrutura especificada no tópico *JSON* acima na URL `localhost:5000/user/:userId/appointments/:appointmentId`

>":userId" trata-se do numero de Id de um usuario especifico

>":appointmentId" trata-se do numero da atividade

<br/>
