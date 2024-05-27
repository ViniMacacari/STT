# Soccer Touchline Tactician
## O que é o STT?
- O STT é um jogo de simulação de futebol onde você é o técnico e possui a missão de controlar seu time rumo a vitória!
- O STT possui vários times e jogadores para você contratar!
- Sem fins lucrativos (Fangame)
- OpenSource -> Todos os desenvolvedores tem acesso ao código fonte (execeto a conexão com o banco de dados principal)

## Como instalar?
- O site do STT estará disponível em breve com as demos para você baixar
- Inicialmente funcionará APENAS para Windows, sendo instalado em um executável

# Configuração (para Devs):
## Gere o .exe com
- npm install -g electron-builder
- electron-builder

## Bibliotecas utilizadas (Node.js):
- myqsl
- fs
- path
- iconv-lite
- play-sound
- sqlite3
- sqlite
- dotenv
- node-audio
- electron-packager
- express
- os

# Ajudas no entendimento do sistema:

### Como funciona a dinâmica do funcionamento das criações de elencos?
- Um elenco é criado somente quando na pasta de documentos do cliente, o arquivo elencos.json não existe ou referencia uma pasta existente no diretório;
- Caso os elencos sejam criados, o código fará uma consulta no banco de dados principal e capturará as informações de campos e valores existentes em cada tabela;
- Após a consulta, esses campos e valores são replicados para um banco de dados móvel (electron) -> Parecido com o que é feito hoje no FIFA.

### Outras dúvidas entrar em contato comigo em:
- E-mail: macacarivinicius@gmail.com
- LinkedIn: https://www.linkedin.com/in/vinicius-macacari-de-almeida-bb7855243/