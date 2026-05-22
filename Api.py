from flask import Flask, request, jsonify
from flask_cors import CORS
from google import genai
import os
from dotenv import load_dotenv
from pathlib import Path

# Explicit path to .env
env_path = Path(__file__).parent / ".env"
load_dotenv(dotenv_path=env_path)

appi = os.getenv("API_TOKEN")

print("KEY:", appi)

app = Flask(__name__)
CORS(app)

client = genai.Client(api_key=appi)

@app.route("/generate", methods=["POST"])
def generate():
    data = request.json
    prompt = data["prompt"]

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt
    )

    return jsonify({"result": response.text})

@app.route("/")
def home():
    return "Backend is running"

if __name__ == "__main__":
    app.run(debug=True)