import os 
from flask import Flask, request
from flask_socketio import SocketIO, emit
from langchain_openai import ChatOpenAI
from dotenv import load_dotenv

load_dotenv()
OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins='*')

chat_model = ChatOpenAI(temperature=0)

@socketio.on('message')
def handle_message(m):
  print(m)
  a = chat_model.invoke(m)
  emit("answer", {"answer": a.content})

if __name__ == "__main__":
  socketio.run(app, debug=True)