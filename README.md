# CafeManager

## Sobre o projeto

O **CafeManager** é uma aplicação web desenvolvida com o objetivo de permitir o cadastro e gerenciamento de **cafés especiais**, **receitas de preparo** e o cálculo automático da proporção entre água e café.

O projeto também foi utilizado como ambiente de estudos práticos de **Quality Assurance**, abrangendo testes funcionais, testes de API, automação de testes, validação de regras de negócio, testes de autorização e controle de qualidade durante o desenvolvimento.

### Objetivos do projeto

O desenvolvimento foi dividido em duas etapas principais:

1. **Backend / API**

   * CRUD de usuários;
   * CRUD de cafés;
   * CRUD de receitas;
   * autenticação e autorização por meio de Bearer Token;
   * controle de acesso de acordo com a função do usuário;
   * cálculo automático de parâmetros das receitas;
   * persistência dos dados em PostgreSQL.

2. **Frontend**

   * criação da interface da aplicação;
   * autenticação e gerenciamento de sessão;
   * calculadora de café;
   * gerenciamento de usuários;
   * gerenciamento de cafés;
   * gerenciamento de receitas;
   * gerenciamento do perfil e da conta;
   * controle de elementos da interface de acordo com a função do usuário.

### Funcionalidades do sistema

O sistema possui as seguintes áreas principais:

* **Calculadora:** permite calcular automaticamente água, café ou proporção a partir de dois valores informados.
* **Cafés:** permite cadastrar e gerenciar cafés especiais.
* **Receitas:** permite cadastrar receitas associadas a um café ou de forma independente.
* **Usuários:** permite o gerenciamento de contas, de acordo com as permissões do usuário.
* **Perfil:** permite consultar e alterar os dados da própria conta.
* **Autenticação:** controla o acesso às funcionalidades protegidas da aplicação.
* **Swagger:** disponibiliza a documentação interativa da API e permite explorar seus endpoints diretamente.

### Regras de negócio e possibilidades de teste

As regras abaixo representam o comportamento funcional esperado da aplicação e servem como referência para a exploração manual e para a criação dos testes automatizados.

#### Exploração da API pelo Swagger

A API disponibiliza sua documentação interativa em:

`http://localhost:8000/docs`

O Swagger permite consultar os endpoints disponíveis, seus métodos HTTP, parâmetros, estruturas de requisição e resposta e requisitos de autenticação.

A documentação do projeto não reproduz individualmente todos os endpoints e seus respectivos corpos de requisição, pois o Swagger deve ser utilizado como referência técnica para essa consulta.

#### Usuários e autenticação

O sistema possui dois tipos de usuário:

* `user`
* `admin`

O primeiro usuário da aplicação é configurado diretamente no banco de dados como administrador e possui o `id` 1.

##### Permissões do usuário comum

Um usuário comum pode:

* alterar seus próprios dados;
* alterar seu nome;
* alterar seu e-mail;
* alterar sua senha;
* excluir a própria conta;
* criar seus próprios cafés;
* editar seus próprios cafés;
* excluir seus próprios cafés;
* criar suas próprias receitas;
* editar suas próprias receitas;
* excluir suas próprias receitas.

Um usuário comum não pode alterar a função (`role`) de outros usuários nem acessar ou modificar dados pertencentes a outros usuários.

##### Permissões do administrador

O administrador pode:

* criar usuários;
* editar usuários;
* excluir usuários;
* alterar a função de usuários;
* visualizar cafés de qualquer usuário;
* editar cafés de qualquer usuário;
* excluir cafés de qualquer usuário;
* visualizar receitas de qualquer usuário;
* editar receitas de qualquer usuário;
* excluir receitas de qualquer usuário.

##### Autenticação

As operações protegidas da API exigem autenticação por meio de Bearer Token.

Quando uma requisição protegida é realizada sem token, a API retorna:

`Not authenticated`

Quando é utilizado um token inexistente ou inválido, a API retorna:

`Credenciais inválidas.`

No login, e-mail ou senha incorretos resultam em:

`Email ou senha inválidos.`

A criação de uma conta pelo frontend realiza o login automaticamente após o cadastro e direciona o usuário para a aplicação de acordo com sua função.

##### Cadastro de usuário

O e-mail não pode ser duplicado.

As validações atualmente implementadas incluem:

* nome vazio → `Informe o nome de usuário.`
* e-mail vazio ou inválido → `Informe um e-mail válido.`
* senha vazia → `Informe a senha.`

A API também possui suas próprias validações para esses campos.

A função do usuário deve ser `user` ou `admin`. A tentativa de utilizar outra função pela API resulta em erro de validação.

Um usuário comum tentando alterar a função de outro usuário recebe:

`Apenas administradores podem executar esta operação.`

#### Cafés

Para criar um café, os campos `empresa` e `nome_cafe` são obrigatórios.

A combinação de **empresa + nome do café** deve ser única para cada usuário.

Por exemplo, um usuário pode cadastrar:

```json
{
  "empresa": "Ísole",
  "nome_cafe": "Adélia Vivian"
}
```

Uma nova tentativa de cadastrar a mesma combinação para o mesmo usuário deve resultar em:

`Já existe um café com esse nome`

A mesma regra deve ser considerada durante a edição. Caso um usuário altere a empresa ou o nome de um café de forma que resulte em uma combinação já existente para aquele usuário, a alteração deve ser rejeitada.

Os campos `empresa` e `nome_cafe` não podem ser vazios, conter somente espaços ou ser compostos somente por números.

A pontuação do café deve estar entre `0` e `100`, podendo utilizar valores decimais.

Um usuário comum somente pode visualizar, editar e excluir seus próprios cafés.

Um administrador pode visualizar e gerenciar cafés de qualquer usuário.

Quando um usuário comum tenta acessar ou modificar um café pertencente a outro usuário, a API responde:

`Café não encontrado.`

As operações protegidas de criação, edição e exclusão exigem autenticação.

#### Receitas

Uma receita pode ser:

* associada a um café cadastrado; ou
* independente, sem café associado.

Quando uma receita recebe um `cafe_id`, o café informado deve pertencer ao mesmo usuário responsável pela receita.

O único campo obrigatório para a criação da receita é o método de preparo.

O método deve corresponder exatamente a uma das opções disponíveis:

* `Melitta`
* `Hario V60`
* `Chemex`
* `Kalita Wave`
* `Coador de Pano`
* `Koar`
* `Origami`
* `Tricolate`
* `Prensa Francesa`
* `Cafeteira Clever`
* `Aeropress`
* `Cafeteira Italiana (Moka)`
* `Máquina de Espresso`
* `Globinho (Siphon)`
* `Cafeteira Turca (Ibrik)`
* `Cold Brew`
* `Hario Switch`

O método é sensível a maiúsculas e minúsculas.

Os valores de `proporcao`, `agua_ml` e `cafe_g` devem ser numéricos e maiores que zero quando enviados à API.

Quando dois dos três valores de cálculo são informados, o terceiro pode ser obtido automaticamente:

* `agua_ml / cafe_g = proporcao`
* `agua_ml / proporcao = cafe_g`
* `cafe_g * proporcao = agua_ml`

A avaliação da receita deve estar entre `0` e `5`, podendo utilizar valores decimais.

Um usuário comum somente pode visualizar, editar e excluir suas próprias receitas.

Um administrador pode visualizar e gerenciar receitas de qualquer usuário.

#### Calculadora de café

A calculadora possui três campos:

* Água (ml)
* Café (g)
* Proporção

Inicialmente todos os campos estão vazios e o botão de cálculo permanece indisponível.

O usuário deve informar exatamente dois valores válidos para que o terceiro seja calculado automaticamente.

As combinações possíveis são:

| Valores informados | Valor calculado |
| ------------------ | --------------- |
| Água + Café        | Proporção       |
| Água + Proporção   | Café            |
| Café + Proporção   | Água            |

Valores iguais a zero resultam em:

`Informe um valor maior que zero.`

Valores que não são numéricos resultam em:

`Informe um número válido.`

Quando exatamente dois campos válidos são preenchidos, o campo restante recebe a indicação de que seu valor será calculado automaticamente.

Após o cálculo, caso o usuário altere um dos valores utilizados no cálculo, o resultado calculado anteriormente é removido e precisa ser recalculado.

A opção **Reiniciar** limpa os valores e retorna a calculadora ao estado inicial.

#### Perfil e gerenciamento da conta

Após o login, o usuário pode acessar a área **Perfil**, onde são apresentados:

* nome cadastrado;
* e-mail cadastrado;
* função do usuário.

Administradores são identificados como:

`Perfil: Administrador`

Usuários comuns são identificados como:

`Perfil: Amante do Café`

O usuário pode alterar seus dados pessoais e sua senha.

Também é possível:

* cancelar uma alteração;
* sair da conta;
* excluir a conta.

Ao excluir a conta, o sistema solicita confirmação:

```text
Deseja realmente excluir sua conta?
Todos os seus cafés e receitas também serão excluídos.
```

Ao confirmar, a conta e os dados relacionados são excluídos e o usuário é direcionado para a calculadora.

#### Exclusão de usuários e dados associados

A exclusão de um usuário provoca a exclusão dos dados relacionados a ele.

Esse comportamento é garantido pelos relacionamentos entre as entidades e pelas configurações de cascata utilizadas no projeto.

* `UsuarioDB` possui relacionamento com seus cafés e receitas utilizando `cascade="all, delete-orphan"`.
* `CafeDB.usuario_id` possui uma chave estrangeira para `usuarios.id` com `ondelete="CASCADE"`.
* `ReceitaDB.usuario_id` possui uma chave estrangeira para `usuarios.id` com `ondelete="CASCADE"`.
* `ReceitaDB.cafe_id` possui uma chave estrangeira para `cafes.id` com `ondelete="CASCADE"`.
* `CafeDB` possui relacionamento com suas receitas utilizando `cascade="all, delete-orphan"`.

Dessa forma, ao excluir um usuário:

1. Seus cafés são excluídos.
2. Suas receitas são excluídas.
3. As receitas associadas aos cafés excluídos também são removidas.
4. Receitas que não possuem um café associado também são excluídas, pois possuem uma relação direta com o usuário.

Exemplo:

```text
Usuário
├── Café A
│   ├── Receita 1
│   └── Receita 2
├── Café B
│   └── Receita 3
└── Receita 4 (sem café associado)
```

Após a exclusão do usuário, todos esses registros relacionados devem deixar de existir.

#### Exclusão de cafés e receitas associadas

A exclusão de um café também possui comportamento de cascata.

Quando um café é excluído, **somente as receitas associadas àquele café são excluídas**.

Por exemplo:

```text
Usuário
├── Café A
│   ├── Receita 1
│   └── Receita 2
├── Café B
│   └── Receita 3
└── Receita 4 (sem café associado)
```

Se o **Café A** for excluído:

```text
Usuário
├── Café B
│   └── Receita 3
└── Receita 4 (sem café associado)
```

Nesse cenário:

* Receita 1 é excluída;
* Receita 2 é excluída;
* Receita 3 permanece;
* Receita 4 permanece.

Portanto, a exclusão de um café não deve afetar:

* receitas associadas a outros cafés;
* receitas independentes, sem café associado.

Esse comportamento deve ser validado nos testes de integridade dos dados.

### Fluxo geral de desenvolvimento

O desenvolvimento do projeto foi realizado de forma incremental, começando pela construção da API e posteriormente pela implementação do frontend.

A aplicação foi evoluindo por funcionalidades, permitindo que cada nova implementação pudesse ser validada por meio de testes manuais e automatizados.

A estrutura também foi utilizada para praticar:

* testes funcionais;
* testes de API;
* testes de autenticação e autorização;
* validação de regras de negócio;
* automação com Playwright;
* testes de API com Postman e Newman;
* organização de testes utilizando Page Object Model;
* integração de testes em pipeline CI/CD;
* utilização de Git e GitHub para controle de versão.

### Relação entre regras de negócio e testes

As regras de negócio apresentadas nesta seção servem como referência para a estratégia de testes do projeto.

Os testes procuram validar não apenas se uma funcionalidade funciona em seu fluxo principal, mas também comportamentos relacionados a:

* dados inválidos;
* campos obrigatórios;
* autenticação;
* autorização;
* diferentes funções de usuário;
* acesso a dados de outros usuários;
* regras de unicidade;
* cálculos;
* alterações e exclusões;
* integridade dos relacionamentos entre entidades;
* comportamento da aplicação após alterações nos dados.

Dessa forma, o CafeManager funciona simultaneamente como uma aplicação de estudo e como um ambiente prático para aplicação de conceitos de Quality Assurance.

## Tecnologias utilizadas

### Backend

* **Python** — linguagem utilizada no desenvolvimento da API.
* **FastAPI** — framework utilizado para desenvolvimento da API REST.
* **SQLAlchemy** — ORM utilizado para interação com o banco de dados.
* **PostgreSQL** — banco de dados utilizado pela aplicação.
* **Pydantic** — utilizado para validação e modelagem dos dados da API.
* **Uvicorn** — servidor ASGI utilizado para executar a aplicação FastAPI.
* **python-dotenv** — utilizado para carregamento de variáveis de ambiente.
* **JWT / python-jose** — utilizado no mecanismo de autenticação baseado em tokens.
* **Passlib / bcrypt** — utilizados no tratamento e armazenamento seguro das senhas.

### Frontend

* **JavaScript** — linguagem utilizada no desenvolvimento da interface.
* **React** — biblioteca utilizada para construção da interface web.
* **React Router** — utilizado para gerenciamento das rotas da aplicação.
* **Axios** — utilizado para comunicação entre o frontend e a API.
* **Vite** — ferramenta utilizada para desenvolvimento e build da aplicação.
* **ESLint** — utilizado para análise estática e padronização do código.

### Testes e automação

* **Playwright** — framework utilizado para automação de testes end-to-end da aplicação web.
* **Page Object Model (POM)** — padrão utilizado na organização dos testes automatizados, separando a interação com a aplicação da lógica dos testes.

### DevOps e CI/CD

* **Git** — controle de versão do projeto.
* **GitHub** — hospedagem do repositório e gerenciamento do código.
* **GitHub Actions** — utilizado para automação do processo de integração contínua.
* **Postman / Newman** — utilizados para execução automatizada dos testes da API.
* **PostgreSQL** — utilizado como serviço de banco de dados durante a execução do pipeline da API.

## Pré-requisitos

Para executar o CafeManager localmente e reproduzir os testes automatizados, é necessário preparar o ambiente de desenvolvimento com algumas ferramentas e tecnologias.

A lista abaixo apresenta as principais ferramentas utilizadas pelo projeto, sua finalidade e como realizar a instalação.

### 1. Git

O Git é utilizado para controle de versão do projeto. Ele permite registrar alterações no código, criar branches, integrar modificações e manter o histórico do desenvolvimento.

O Git também é utilizado em conjunto com o GitHub para armazenar o código-fonte e executar o fluxo de desenvolvimento do projeto.

**Instalação:**

O instalador pode ser obtido no site oficial:

https://git-scm.com/downloads

Após a instalação, é possível verificar se o Git está disponível pelo terminal:

```bash
git --version
```

Exemplo de resultado:

```text
git version 2.x.x
```

---

### 2. Python

O Python é utilizado no desenvolvimento da API do CafeManager.

A API foi desenvolvida utilizando o framework FastAPI e possui suas dependências gerenciadas por meio do arquivo `requirements.txt`.

**Versão utilizada no ambiente de CI:**

```text
Python 3.12
```

**Instalação:**

O instalador pode ser obtido no site oficial:

https://www.python.org/downloads/

Durante a instalação no Windows, é importante habilitar a opção:

```text
Add Python to PATH
```

Após a instalação, verificar pelo terminal:

```bash
python --version
```

O resultado esperado deve indicar uma versão compatível com o projeto.

Também é possível verificar o gerenciador de pacotes do Python:

```bash
pip --version
```

---

### 3. Node.js e npm

O Node.js é utilizado para executar as ferramentas do ecossistema JavaScript utilizadas pelo frontend e pelos testes automatizados.

O npm (Node Package Manager) é instalado juntamente com o Node.js e é utilizado para instalar as dependências declaradas no arquivo:

```text
CafeManagerWeb/package.json
```

Entre essas dependências estão React, Vite, Axios, React Router e Playwright.

**Instalação:**

O instalador pode ser obtido no site oficial:

https://nodejs.org/

Para este projeto, recomenda-se utilizar uma versão LTS do Node.js.

Após a instalação:

```bash
node --version
```

E:

```bash
npm --version
```

---

### 4. PostgreSQL

O PostgreSQL é o banco de dados utilizado pela API do CafeManager.

A aplicação utiliza o PostgreSQL para armazenar os dados de usuários, cafés, receitas e demais informações persistidas pelo sistema.

A conexão com o banco é realizada pela API por meio do SQLAlchemy e do driver `psycopg`.

**Instalação:**

O instalador pode ser obtido no site oficial:

https://www.postgresql.org/download/

Durante a configuração do PostgreSQL, é necessário definir uma senha para o usuário do banco.

O projeto utiliza um banco chamado:

```text
cafemanager
```

A configuração completa da conexão será apresentada na seção [Configuração do ambiente](#configuração-do-ambiente).

---

### 5. Dependências Python

As bibliotecas utilizadas pela API estão registradas no arquivo:

```text
requirements.txt
```

Entre as principais dependências estão:

* **FastAPI** — framework utilizado para desenvolvimento da API.
* **Uvicorn** — servidor utilizado para executar a aplicação FastAPI.
* **SQLAlchemy** — ORM utilizado para comunicação entre a aplicação e o banco de dados.
* **Psycopg** — driver utilizado para conexão com PostgreSQL.
* **Pydantic** — utilizado para validação e estruturação dos dados recebidos e enviados pela API.
* **python-dotenv** — utilizado para carregar configurações armazenadas em variáveis de ambiente.
* **python-jose** — utilizado no tratamento de tokens JWT utilizados pela autenticação.
* **Passlib / bcrypt** — utilizados no tratamento e armazenamento seguro das senhas.
* **email-validator** — utilizado para validação de endereços de e-mail.

A instalação dessas dependências não é feita individualmente. O projeto possui um arquivo `requirements.txt` justamente para permitir que todas sejam instaladas de uma vez.

A partir da pasta raiz do projeto:

```bash
pip install -r requirements.txt
```

Isso instala as dependências nas versões especificadas pelo projeto.

---

### 6. Dependências JavaScript

As dependências do frontend estão declaradas no arquivo:

```text
CafeManagerWeb/package.json
```

Entre as principais dependências utilizadas estão:

* **React** — biblioteca utilizada para construção da interface do sistema.
* **React DOM** — integração do React com o navegador.
* **React Router** — utilizado para gerenciamento das rotas da aplicação.
* **Axios** — utilizado para realizar requisições HTTP para a API.

As ferramentas utilizadas durante o desenvolvimento e os testes estão declaradas como `devDependencies`, incluindo:

* **Vite** — ferramenta utilizada para executar e gerar o frontend.
* **ESLint** — utilizado para análise estática e padronização do código JavaScript.
* **Playwright** — utilizado para automação dos testes de interface.

A instalação também é feita de uma única vez, utilizando o `package.json`.

Dentro da pasta do frontend:

```bash
cd CafeManagerWeb
npm install
```

O npm utilizará o arquivo `package.json` para instalar as dependências necessárias.

---

### 7. Playwright

O Playwright é utilizado para automação dos testes da interface web do CafeManager.

Os testes são escritos em JavaScript e utilizam o Playwright Test.

O Playwright está declarado como uma dependência de desenvolvimento no arquivo:

```text
CafeManagerWeb/package.json
```

Por isso, normalmente sua instalação ocorre junto com:

```bash
npm install
```

Depois da instalação das dependências, os navegadores utilizados pelo Playwright também precisam ser instalados:

```bash
npx playwright install
```

Esse comando instala os navegadores necessários para a execução dos testes.

A execução dos testes automatizados será detalhada posteriormente na seção [Como executar os testes automatizados](#como-executar-os-testes-automatizados).

---

### 8. Postman

O Postman é utilizado para criação e execução dos testes da API.

O projeto possui uma coleção Postman contendo os testes das funcionalidades da API, armazenada em:

```text
postman/Projeto_Café.postman_collection.json
```

O Postman possui uma interface gráfica que pode ser utilizada para executar e analisar as requisições manualmente.

**Instalação:**

O aplicativo pode ser obtido no site oficial:

https://www.postman.com/downloads/

A utilização do Postman será detalhada posteriormente na seção de testes da API.

---

### 9. Newman

O Newman é a ferramenta de linha de comando utilizada para executar coleções do Postman de forma automatizada.

Ele é especialmente importante no CafeManager porque permite executar os testes da API dentro do pipeline de integração contínua do GitHub Actions.

O Newman é instalado utilizando o npm:

```bash
npm install -g newman
```

Após a instalação:

```bash
newman --version
```

A execução dos testes utilizando Newman é apresentada posteriormente na seção [Pipeline CI/CD](#pipeline-cicd).

---

### 10. GitHub

O GitHub é utilizado para armazenamento remoto do código-fonte e para gerenciamento do fluxo de desenvolvimento do projeto.

O repositório contém:

* código da API;
* código do frontend;
* testes automatizados;
* coleção e ambiente do Postman;
* arquivos de configuração;
* workflows do GitHub Actions.

O projeto também utiliza branches para separar o desenvolvimento da versão considerada estável.

O GitHub não precisa de uma instalação local. É necessário apenas possuir uma conta e acesso ao repositório do projeto.

Site:

https://github.com/

---

### 11. GitHub Actions

O GitHub Actions é utilizado para automação do processo de integração contínua (CI).

Diferentemente das ferramentas anteriores, não é necessário instalar o GitHub Actions no computador local.

Os workflows são executados pelos servidores do GitHub e ficam armazenados dentro do próprio repositório, no diretório:

```text
.github/workflows/
```

Atualmente o projeto possui um workflow responsável pela execução automatizada dos testes da API:

```text
.github/workflows/postman.yml
```

Esse workflow realiza tarefas como:

1. baixar o código do repositório;
2. configurar o Python;
3. iniciar um serviço PostgreSQL;
4. instalar as dependências da API;
5. configurar o banco de dados;
6. criar as tabelas;
7. criar o usuário administrador;
8. iniciar a API;
9. instalar o Newman;
10. executar a coleção de testes do Postman.

Posteriormente, o projeto também poderá utilizar GitHub Actions para executar os testes automatizados do frontend com Playwright.

---

### Resumo das ferramentas necessárias

| Ferramenta     | Utilização no projeto                     | Instalação                               |
| -------------- | ----------------------------------------- | ---------------------------------------- |
| Git            | Controle de versão                        | Instalador oficial                       |
| Python         | Desenvolvimento da API                    | Instalador oficial                       |
| Node.js        | Ambiente JavaScript                       | Instalador oficial                       |
| npm            | Gerenciamento das dependências JavaScript | Instalado com Node.js                    |
| PostgreSQL     | Banco de dados                            | Instalador oficial                       |
| FastAPI        | Framework da API                          | `pip install -r requirements.txt`        |
| SQLAlchemy     | Comunicação com o banco                   | `pip install -r requirements.txt`        |
| Uvicorn        | Servidor da API                           | `pip install -r requirements.txt`        |
| React          | Interface web                             | `npm install`                            |
| Vite           | Execução/build do frontend                | `npm install`                            |
| Axios          | Requisições HTTP                          | `npm install`                            |
| React Router   | Rotas do frontend                         | `npm install`                            |
| Playwright     | Automação da interface                    | `npm install` + `npx playwright install` |
| Postman        | Testes da API                             | Instalador oficial                       |
| Newman         | Execução automatizada do Postman          | `npm install -g newman`                  |
| GitHub         | Repositório remoto                        | Não requer instalação                    |
| GitHub Actions | Integração contínua                       | Não requer instalação                    |

> **Observação:** nem todas as tecnologias listadas na tabela precisam ser instaladas individualmente. FastAPI, SQLAlchemy, Uvicorn, React, Vite, Axios, React Router e Playwright são instalados por meio dos arquivos de dependências do projeto (`requirements.txt` e `package.json`).

## Configuração do ambiente

Esta seção apresenta os procedimentos necessários para configurar o CafeManager em um ambiente local de desenvolvimento.

O projeto é dividido principalmente em:

* **API:** responsável pelas regras de negócio, autenticação e comunicação com o banco de dados.
* **Frontend:** responsável pela interface web utilizada pelos usuários.
* **Testes automatizados:** responsáveis pela validação da API e da interface web.
* **Banco de dados:** responsável pelo armazenamento das informações da aplicação.

Os procedimentos abaixo consideram um ambiente Windows e devem ser executados após a instalação das ferramentas descritas na seção [Pré-requisitos](#pré-requisitos).

### 1. Obter o código do projeto

O primeiro passo é obter uma cópia do repositório do GitHub.

No terminal, navegue até a pasta em que deseja armazenar o projeto e execute:

```bash
git clone https://github.com/lucas83mariano-ship-it/CafeManager
```

Após o download, acesse a pasta do projeto:

```bash
cd CafeManager
```

A estrutura inicial esperada é semelhante a:

```text
CafeManager/
├── .github/
├── app/
├── CafeManagerWeb/
├── postman/
├── criar_admin.py
├── requirements.txt
└── ...
```

A estrutura exata pode sofrer alterações conforme o desenvolvimento do projeto.

#### Por que utilizar o Git?

O comando `git clone` baixa o repositório remoto e cria uma cópia local do código.

Isso permite:

* acessar o histórico de alterações;
* trabalhar com branches;
* modificar o código localmente;
* executar os testes;
* contribuir com novas alterações;
* sincronizar o projeto com o GitHub.

---

### 2. Configurar o ambiente virtual do Python

A API utiliza Python. Para evitar que as dependências do projeto sejam instaladas diretamente no ambiente global do computador, recomenda-se utilizar um ambiente virtual.

O ambiente virtual mantém as bibliotecas do projeto isoladas de outras aplicações Python instaladas na máquina.

#### 2.1. Criar o ambiente virtual

Na pasta raiz do projeto, execute:

```bash
python -m venv venv
```

Esse comando cria uma pasta chamada `venv`, que armazenará o ambiente virtual do Python.

Estrutura simplificada:

```text
CafeManager/
└── venv/
```

A pasta `venv` normalmente não deve ser versionada no Git, pois cada desenvolvedor pode criar seu próprio ambiente local.

#### 2.2. Ativar o ambiente virtual

No Windows, utilizando o PowerShell:

```powershell
.\venv\Scripts\Activate.ps1
```

No Prompt de Comando (CMD):

```cmd
venv\Scripts\activate
```

Quando o ambiente estiver ativado, o terminal normalmente exibirá algo semelhante a:

```text
(venv) E:\Desenvolvimento\CafeManager>
```

A indicação `(venv)` significa que os comandos Python serão executados dentro do ambiente virtual.

#### 2.3. Atualizar o pip

Com o ambiente virtual ativado:

```bash
python -m pip install --upgrade pip
```

O `pip` é o gerenciador de pacotes utilizado para instalar bibliotecas Python.

---

### 3. Instalar as dependências da API

As dependências da API estão registradas no arquivo:

```text
requirements.txt
```

Com o ambiente virtual ativado, execute na pasta raiz do projeto:

```bash
pip install -r requirements.txt
```

O comando lê o arquivo `requirements.txt` e instala as bibliotecas especificadas nele.

Entre as principais bibliotecas utilizadas estão:

* FastAPI;
* Uvicorn;
* SQLAlchemy;
* Psycopg;
* Pydantic;
* python-dotenv;
* python-jose;
* Passlib;
* bcrypt;
* email-validator.

Para verificar se uma biblioteca foi instalada, é possível utilizar:

```bash
pip show fastapi
```

Também é possível listar as bibliotecas instaladas no ambiente:

```bash
pip list
```

> O arquivo `requirements.txt` deve ser considerado a referência principal para as dependências Python do projeto. Não é necessário instalar individualmente todas as bibliotecas que aparecem nele.

---

### 4. Configurar o PostgreSQL

A API utiliza o PostgreSQL como banco de dados.

Antes de executar a aplicação, é necessário garantir que:

1. O PostgreSQL esteja instalado.
2. O serviço do PostgreSQL esteja em execução.
3. O banco de dados do projeto exista.
4. As informações de conexão estejam configuradas corretamente.

#### 4.1. Criar o banco de dados

O banco utilizado pelo projeto é:

```text
cafemanager
```

A criação pode ser realizada utilizando o pgAdmin, incluído na instalação do PostgreSQL, ou pelo terminal com o comando `psql`.

Exemplo:

```sql
CREATE DATABASE cafemanager;
```

O usuário e a senha utilizados devem corresponder à configuração do PostgreSQL instalado na máquina.

#### 4.2. Verificar a conexão

A conexão da API utiliza uma URL semelhante a:

```text
postgresql+psycopg://USUARIO:SENHA@localhost:5432/cafemanager
```

Cada parte representa:

| Parte                | Finalidade                          |
| -------------------- | ----------------------------------- |
| `postgresql+psycopg` | Tipo de banco e driver utilizado    |
| `USUARIO`            | Usuário do PostgreSQL               |
| `SENHA`              | Senha do usuário                    |
| `localhost`          | Banco executado no computador local |
| `5432`               | Porta padrão do PostgreSQL          |
| `cafemanager`        | Nome do banco de dados              |

A URL deve ser ajustada conforme a configuração local do PostgreSQL.

---

### 5. Configurar as variáveis de ambiente

O projeto utiliza variáveis de ambiente para armazenar configurações que não devem ficar diretamente incorporadas ao código-fonte.

Essas configurações podem incluir:

* URL de conexão com o banco de dados;
* informações específicas do ambiente;
* outras configurações utilizadas pela API.

Na pasta raiz do projeto, crie um arquivo chamado:

```text
.env
```

Exemplo de configuração:

```env
DATABASE_URL=postgresql+psycopg://postgres:postgres@localhost:5432/cafemanager
```

> O usuário e a senha apresentados acima são apenas um exemplo. Utilize as credenciais configuradas no seu ambiente local.

#### Cuidados com o arquivo `.env`

O arquivo `.env` pode conter informações sensíveis, como senhas e tokens.

Por esse motivo:

* não compartilhe suas credenciais;
* não publique senhas reais no GitHub;
* não coloque o arquivo `.env` no controle de versão;
* mantenha um arquivo de exemplo sem informações sensíveis quando necessário.

Exemplo de arquivo de referência:

```text
.env.example
```

Esse arquivo pode documentar quais variáveis são necessárias sem incluir valores reais de credenciais.

---

### 6. Criar as tabelas do banco de dados

Depois de configurar o banco de dados e o arquivo `.env`, as tabelas necessárias para a aplicação precisam ser criadas.

O projeto utiliza o SQLAlchemy para representar as entidades do banco de dados.

A criação das tabelas pode ocorrer durante a inicialização da aplicação, conforme a implementação atual da API.

Também é possível executar o procedimento manualmente utilizando:

```bash
python -c "from app.database import engine; from app.models import Base; Base.metadata.create_all(bind=engine)"
```

Esse comando:

1. importa a conexão com o banco;
2. importa a classe base dos modelos;
3. solicita ao SQLAlchemy a criação das tabelas definidas nos modelos.

O comando não substitui uma ferramenta de migração de banco de dados. Ele é utilizado no projeto para criar as tabelas definidas pela aplicação.

---

### 7. Criar o usuário administrador

O projeto possui um script para criação do usuário administrador:

```text
criar_admin.py
```

Após configurar o banco de dados e criar as tabelas, execute:

```bash
python criar_admin.py
```

Esse procedimento permite preparar um usuário administrador para realizar testes das funcionalidades que exigem privilégios administrativos.

O usuário administrador é utilizado, por exemplo, nos testes relacionados a:

* acesso à área administrativa;
* gerenciamento de usuários;
* validação de permissões;
* navegação específica para usuários administradores.

As credenciais utilizadas nos testes devem corresponder às credenciais configuradas no ambiente local e nos arquivos de teste.

---

### 8. Instalar as dependências do frontend

O frontend está localizado na pasta:

```text
CafeManagerWeb
```

Acesse essa pasta:

```bash
cd CafeManagerWeb
```

Instale as dependências definidas no arquivo `package.json`:

```bash
npm install
```

Esse comando instala as dependências do frontend e as ferramentas de desenvolvimento.

Entre os principais pacotes utilizados estão:

* React;
* React DOM;
* React Router;
* Axios;
* Vite;
* ESLint;
* Playwright.

O npm também pode criar ou atualizar o arquivo:

```text
package-lock.json
```

Esse arquivo registra informações sobre as versões das dependências instaladas.

> O comando `npm install` deve ser executado dentro da pasta `CafeManagerWeb`, onde está localizado o arquivo `package.json`.

---

### 9. Instalar os navegadores do Playwright

O Playwright é utilizado para executar os testes automatizados da interface web.

Após instalar as dependências do frontend, execute:

```bash
npx playwright install
```

Esse comando instala os navegadores necessários para a execução dos testes.

A instalação dos navegadores é necessária porque o Playwright realiza a automação diretamente em navegadores compatíveis.

---

### 10. Configuração geral do ambiente

Após concluir as etapas anteriores, a estrutura local deverá conter os principais componentes necessários para executar o projeto:

```text
CafeManager/
├── venv/
├── app/
├── CafeManagerWeb/
├── postman/
├── .env
├── criar_admin.py
├── requirements.txt
└── ...
```

Dentro da pasta `CafeManagerWeb`, estarão os arquivos relacionados ao frontend e aos testes Playwright.

Antes de executar a aplicação, confirme:

* [ ] Git instalado e repositório clonado.
* [ ] Python instalado.
* [ ] Ambiente virtual criado e ativado.
* [ ] Dependências Python instaladas.
* [ ] PostgreSQL instalado e em execução.
* [ ] Banco `cafemanager` criado.
* [ ] Arquivo `.env` configurado.
* [ ] Tabelas do banco criadas.
* [ ] Usuário administrador criado.
* [ ] Node.js e npm instalados.
* [ ] Dependências do frontend instaladas.
* [ ] Navegadores do Playwright instalados.

Com o ambiente preparado, será possível iniciar a API e o frontend nas etapas seguintes.

---

### Observações sobre ambientes diferentes

O CafeManager pode ser executado em diferentes ambientes, como:

* ambiente local de desenvolvimento;
* ambiente de integração contínua;
* ambiente de testes;
* ambiente de produção, caso seja configurado futuramente.

As configurações podem variar entre esses ambientes.

Por exemplo, no ambiente local, a API pode utilizar um PostgreSQL instalado no próprio computador. Já no GitHub Actions, o workflow configura um serviço PostgreSQL temporário para executar os testes.

Por isso, informações como endereço do banco, credenciais, portas e variáveis de ambiente devem ser analisadas de acordo com o ambiente em que a aplicação está sendo executada.

## Estrutura do projeto

## Como executar a API

## Como executar o Frontend

## Como executar os testes automatizados

## Estratégia de testes

## Pipeline CI/CD

## Git e fluxo de desenvolvimento

## Status do projeto
