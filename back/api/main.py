import os
from flask import Flask, request
from flask_cors import CORS
from flask_socketio import SocketIO, emit
from langchain_openai import ChatOpenAI
from dotenv import load_dotenv

db_mock = {
  '250': "127.0.0.1"
}

load_dotenv()
OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins='*')

chat_model = ChatOpenAI(temperature=0)

@socketio.on('message')
def handle_message(m):
  print(m)
  a = chat_model.invoke(m)
  emit("answer", {"answer": a.content})

@app.get('/validate_domain')
def validate_domain():
  id_char = request.args.get("id_char")
  domain = request.args.get("domain")

  print(f"id_char: {id_char}, domain: {domain}")
  valid_domain = db_mock[id_char] == domain

  return { 'valid_domain': valid_domain}, 200

@app.post('/new_token')
def new_token():
  fprint = request.args.get("fprint")
  id_char = request.args.get("id_char")

  print(fprint)
  print(id_char)

  generated_token = fprint + id_char

  return { 'user_tkn': generated_token}, 200


if __name__ == "__main__":
  socketio.run(app, debug=True)