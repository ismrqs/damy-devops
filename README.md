# DAMY — DevOps Tools & Cloud Computing

## 1. Sobre o projeto

O DAMY é uma plataforma educacional desenvolvida para o Challenge FIAP em parceria com a Amazul, com o objetivo de ampliar o conhecimento sobre as aplicações e os benefícios da tecnologia nuclear.

Nesta Sprint, desenvolvemos um projeto utilizando uma API educativa de quiz, executada em um container Docker hospedado em uma máquina virtual Linux no Microsoft Azure.

## 2. Integrantes

| Nome                     | RM     |
| ------------------------ | ------ |
| Isabely Marques da Silva | 566663 |
| Luana Alves de Oliveira           | 566621 |
| Mateus Ribeiro Azevedo          | 566630 |
| Paulo Gustavo Moraes de Sousa           | 568580 |

**Turma:** 2TDSPR

## 3. Tecnologias utilizadas

- Node.js e Express
- Docker e Dockerfile
- Docker Compose
- Microsoft Azure Virtual Machines
- Azure CLI
- Linux Ubuntu
- Git e GitHub

## 4. Arquitetura

A aplicação é executada em um container Docker dentro de uma máquina virtual Linux provisionada no Microsoft Azure por meio da Azure CLI.

A comunicação ocorre por HTTP, utilizando o IP público da VM e a porta 3000.

O armazenamento das perguntas é realizado em um arquivo JSON incluído na imagem da aplicação.

**Diagrama:** `docs/arquitetura-damy.png`

## 5. Funcionalidades da API

| Método | Endpoint         | Descrição                    |
| ------ | ---------------- | ---------------------------- |
| GET    | `/`              | Informações da API           |
| GET    | `/health`        | Verificação de funcionamento |
| GET    | `/perguntas`     | Lista de perguntas           |
| GET    | `/perguntas/:id` | Consulta de pergunta         |
| POST   | `/responder`     | Correção e pontuação         |

## 6. Execução com Docker

Construir a imagem:

```bash
docker build -t damy-api:1.0 .
```

Executar o container:

```bash
docker run -d --name damy-api -p 3000:3000 damy-api:1.0
```

Verificar:

```bash
docker ps
docker logs damy-api
```

Também é possível executar com Docker Compose:

```bash
docker compose up -d --build
```

## 7. Provisionamento no Azure

O provisionamento da infraestrutura é realizado pela Azure CLI, utilizando o script:

`scripts/criar-vm.sh`

O script cria o grupo de recursos, provisiona a máquina virtual e configura a porta de acesso da API.

Executar no Azure Cloud Shell:

```bash
chmod +x scripts/criar-vm.sh
./scripts/criar-vm.sh
```

Após a criação, conectar por SSH, instalar o Docker, clonar o repositório e executar a aplicação na VM.

### Comandos Azure CLI utilizados

O provisionamento da infraestrutura foi realizado por meio da Azure CLI, utilizando os seguintes comandos:

```bash
# Criar o grupo de recursos
az group create --name rg-damy-devops --location spaincentral

# Criar a máquina virtual
az vm create \
  --resource-group rg-damy-devops \
  --name vm-damy-devops \
  --location spaincentral \
  --image Ubuntu2404 \
  --size Standard_B2ls_v2 \
  --admin-username azureuser \
  --authentication-type ssh \
  --generate-ssh-keys \
  --public-ip-sku Standard

# Liberar a porta da API
az vm open-port --resource-group rg-damy-devops --name vm-damy-devops --port 3000 --priority 1010

# Consultar as informações da VM
az vm show --resource-group rg-damy-devops --name vm-damy-devops --show-details --output table

# Consultar o IP público
az vm list-ip-addresses --resource-group rg-damy-devops --name vm-damy-devops --output table

# Excluir o grupo de recursos
az group delete --name rg-damy-devops --yes

# Confirmar a exclusão
az group exists --name rg-damy-devops
```

Esses comandos também estão organizados nos scripts `criar-vm.sh` e `excluir-recursos.sh`, disponíveis no repositório.

## 8. Testes em nuvem

Após a execução do container na VM do Azure, o funcionamento da API pode ser verificado acessando os endpoints `/health` e `/perguntas` pelo IP público da máquina virtual, utilizando a porta 3000.

## 9. Como Docker e Cloud Computing podem ser utilizados na solução proposta pelo grupo?

O Docker permite empacotar a API do DAMY com suas dependências, facilitando a execução da aplicação em diferentes ambientes sem a necessidade de configurar cada componente separadamente. Já o Cloud Computing possibilita disponibilizar a solução em uma infraestrutura acessível pela internet. Utilizamos uma máquina virtual no Microsoft Azure para hospedar o container da API, demonstrando como uma funcionalidade do DAMY poderia ser disponibilizada na nuvem.

Essa arquitetura poderá servir como base para futuras expansões da plataforma, incluindo novos jogos educativos, gerenciamento de conteúdos e funcionalidades competitivas.
