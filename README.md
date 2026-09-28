# TrackMyRepo Web

## Objetivos e Observação

### OBS: Primeiramente peço desculpas por não ter enviado o vídeo, acabei confundindo a data e não consegui gravar tudo a tempo. Tentarei documentar da melhor forma possível, o cenário escolhido foi o 1.1 onde tenho um front-end e uma api que se conectará com uma externa.


### Objetivo: Frontend do **TrackMyRepo**, uma aplicação web para acompanhamento de repositórios open-source do GitHub de maneira mais agradável e centralizada.

Esse repositório contém a interface desenvolvida em Next.js e também o `compose.yml` responsável por subir a aplicação completa com frontend, backend e PostgreSQL.

O backend possui documentação própria no repositório `trackmyrepo-api` `https://github.com/GabriielB/trackmyrepo-api`, com detalhes sobre endpoints, arquitetura interna e integração com a GitHub REST API.

---

## Tecnologias

- Next.js
- React
- TypeScript
- Tailwind CSS
- Axios
- React Hook Form
- Recharts
- Docker
- Docker Compose

---

## Funcionalidades

A interface permite:

- cadastrar repositórios públicos do GitHub;
- listar projetos monitorados;
- favoritar e desfavoritar projetos;
- visualizar apenas favoritos;
- atualizar dados do repositório;
- remover projetos;
- visualizar métricas do dashboard;
- visualizar distribuição por linguagem.

---

## Arquitetura

```text
TrackMyRepo Web
      │
      │ REST / JSON
      ▼
TrackMyRepo API
   ┌───────┴────────┐
   ▼                ▼
PostgreSQL     GitHub REST API
```

O frontend se comunica apenas com a API FastAPI.

---


### Organização

- `app`: páginas, layout e estilos globais;
- `components`: componentes visuais;
- `hooks`: estado e ações da interface;
- `services`: chamadas HTTP;
- `lib`: configuração do Axios;
- `types`: contratos TypeScript;
- `utils`: formatação e cálculos auxiliares.

# Executando o projeto completo

## Pré-requisitos

É necessário possuir:

- Git
- Docker
- Docker Compose

---

## 1. Clone os dois repositórios

```bash
git clone https://github.com/GabriielB/trackmyrepo-web
git clone https://github.com/GabriielB/trackmyrepo-api 
```


## 2. Entre no frontend

```bash
cd trackmyrepo-web
```

---

## 3. Inicie a aplicação

```bash
docker compose up --build
```

O Docker Compose irá iniciar:

```text
web → Next.js
api → FastAPI
db  → PostgreSQL
```

---

## Endereços

Frontend:

```text
http://localhost:3000
```

Swagger da API:

```text
http://localhost:8000/docs
```

Health check:

```text
http://localhost:8000/health
```

---

## Verificando os containers

```bash
docker compose ps
```

Os serviços `web`, `api` e `db` devem estar em execução.

---

## Parando a aplicação

```bash
docker compose down
```

Os dados do PostgreSQL permanecem salvos no volume Docker.

Para remover também os dados:

```bash
docker compose down -v
```

> O comando acima remove os dados persistidos no banco.

---

## Iniciando novamente

```bash
docker compose up
```

Caso o código ou os Dockerfiles tenham sido alterados:

```bash
docker compose up --build
```

---

# Teste rápido

Após iniciar a aplicação, acesse:

```text
http://localhost:3000
```

Cadastre, por exemplo:

```text
flutter/flutter
```

ou:

```text
fastapi/fastapi
```

Depois teste:

1. favoritar o projeto;
2. abrir a aba de favoritos;
3. atualizar os dados;
4. remover o projeto.

Essas ações exercitam a comunicação entre frontend, API, PostgreSQL e GitHub REST API.

---

# Desenvolvimento local do frontend

Caso queira executar somente o frontend fora do Docker:

```bash
npm install
npm run dev
```

O frontend ficará disponível em:

```text
http://localhost:3000
```

Por padrão, a API é esperada em:

```text
http://localhost:8000
```

A URL pode ser configurada pela variável:

```text
NEXT_PUBLIC_API_URL
```

---

# Docker

Este repositório possui:

```text
Dockerfile
.dockerignore
compose.yml
```

O `Dockerfile` é responsável pela imagem do frontend.

O `compose.yml` orquestra:

- frontend;
- backend;
- PostgreSQL.

---

# Documentação do backend

Para detalhes sobre:

- endpoints REST;
- FastAPI;
- modelos;
- PostgreSQL;
- integração com a GitHub REST API;
- variáveis de ambiente;
- estrutura interna do backend;

consulte o README do repositório:

```
https://github.com/GabriielB/trackmyrepo-api
```

---
