<h1 align="center">
  Widget Integration
</h1>
<p align="center">Este projeto consiste em um exemplo simples de integração de um sistema de chat em websites por meio de um bloco de código. </p>

Configurações iniciais
=================
## Backend
#### 1 - Instalar Dependencias - ```pip install -r requirements.txt```
#### 2 - Renomear arquivo ```.env.example``` para ```.env```
#### 3 - Adicionar sua API_KEY no arquivo ```.env```
```
OPENAI_API_KEY=
```
#### 4 - Rodar Server - ```python main.py```

## Frontend
#### 1 - Instalar Dependencias - ```npm install```
#### 2 - Rodar Server - ```npm run dev```

## Integração
#### 1 - Adicionar código abaixo dentro da tag ```<body>``` do site que deseja integrar

##### Necesário
```
<script>
      const Findor = {
        AgentURL: "http://127.0.0.1:3000/embed/chat/1234",
      };
</script>
<script src="../widget-loader.js"></script>

```

##### Opcional
lib que fornece os icons que estou utilizando no botão flutuante
```
<script src="https://kit.fontawesome.com/9665055b16.js" crossorigin="anonymous"></script>

```
