# Medix - Plataforma de Gestão de Saúde

O Medix é uma aplicação web desenvolvida para otimizar a interação entre pacientes e unidades de saúde.

A plataforma permite o agendamento de consultas, acompanhamento de atendimentos, visualização de informações clínicas e suporte via chatbot com IA. O sistema também conta com recursos administrativos para gestão de usuários, unidades, salas, colaboradores e agendamentos.

## Tecnologias

- Angular
- Vercel

## Funcionalidades

- Cadastro e autenticação de usuários
- Área do paciente
- Agendamento de consultas
- Consulta de agendamentos futuros
- Cancelamento de agendamentos
- Listagem de médicos disponíveis
- Listagem de unidades de saúde
- Seleção de horários disponíveis
- Chatbot Medix AI para suporte, dúvidas e fluxo de agendamento
- Integração com API Java Spring Boot
- Integração com banco de dados Oracle

## Integração com a API

Este frontend consome a API do projeto Medix desenvolvida em Java Spring Boot.

A API é responsável por:

- autenticação e segurança;
- regras de negócio;
- persistência dos dados;
- gestão de pacientes, colaboradores, salas e unidades;
- criação, listagem e cancelamento de agendamentos;
- suporte ao chatbot com IA;
- consulta de contexto institucional via RAG simplificado.

Repositório da API:

```text
https://github.com/challengeoracle/sprint-04-java
```

## Como executar o projeto

Instale as dependências:

```bash
npm install
```

Execute o projeto localmente:

```bash
ng serve
```

Acesse:

```text
http://localhost:4200
```

## Build

Para gerar a versão de produção:

```bash
ng build
```

Os arquivos finais serão gerados na pasta `dist/`.

## Deploy

O projeto está preparado para deploy na Vercel.

## Observações

Antes de utilizar todas as funcionalidades, a API Java precisa estar em execução e configurada corretamente com o banco Oracle e as variáveis de ambiente necessárias.

## Integrantes

- Arthur Thomas Mariano de Souza — RM: 561061
- Davi Cavalcanti Jorge — RM: 559873
- Mateus da Silveira Lima — RM: 559728

## Grupo

Challenge Oracle
