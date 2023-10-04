# MauAgendar

## Projeto de Eng de Software/Empreendedorismo/Arquitetura/LP2

- Ana Helena Marcacini RA: 20.01305-0
- Enrico Giannobile RA: 19.00610-0
- Ettore Padula Dalben RA: 20.00387-0
- Guilherme de Campos - RA: 20.00089-8
- Laura Caroline Pinto Correia RA: 20.00171-0
- Luis Guilherme de Souza Munhoz RA: 20.01937-8

![](https://avatars.githubusercontent.com/u/129552822?s=400&u=48a7f16b037ad21fe054d0aee8e59fb70a155a35&v)

### Tecnologias utilizadas

- Node
- Express
- bcrypt
- jsonwebtoken
- Docker
- Kubernetes
- RabbitMQ
- PostgreSQL
- Typescript
- SwaggerUI

### Como rodar o projeto

- Clone o repositório
- Altere os arquivos .env.example na raíz e no diretório frontend para .env e preencha as variáveis de ambiente
- Instale o docker, caso já não o tenha instalado, é possível encontrar o tutorial de instalação no site oficial do docker em : <https://docs.docker.com/engine/install/>
- Execute o comando `docker compose up --build -d` para subir o projeto
- Acesse o localhost:${API_PORT} para acessar o swagger e testar as rotas
- Acesse o localhost:${CLIENT_PORT} para acessar o frontend


### Como rodar o Kubernetes
- Clone o repositório
- Altere o arquivo .env.example na raíz para .env e preencha as variáveis de ambiente
- Instale o docker, caso já não o tenha instalado, é possível encontrar o tutorial de instalação no site oficial do docker em : <https://docs.docker.com/engine/install/>
- Habilite o kubernetes no docker desktop
- Digite ```kubectl apply -f ./kubernetes``` na raíz do projeto

### Link do vídeo

<https://youtu.be/U6bmKo-6JgA>
