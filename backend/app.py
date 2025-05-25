from flask import Flask, request, jsonify
from flask_cors import CORS
import pymongo
from datetime import datetime, timedelta
from dotenv import load_dotenv
from pathlib import Path
from chatbot_logic import analyze_message
import json
load_dotenv(dotenv_path=Path(__file__).resolve().parent / ".env")

app = Flask(__name__)
CORS(app)

client = pymongo.MongoClient("mongodb://localhost:27017/")
db = client['mental_health_bot']
moods_collection = db['moods']

rate_limit = {}

WINDOW = timedelta(hours=1)
@app.route('/api/quick_replies', methods=['GET'])
def get_quick_replies():
    try:
        queue_number = int(request.args.get("queue", 1))  # default ke 1 jika tidak diberikan
        dataset_path = Path(__file__).resolve().parent / "data/dataset.json"

        with open(dataset_path, encoding="utf-8") as f:
            data = json.load(f)

        # Filter intents dengan queue tertentu
        filtered = [i for i in data.get("intents", []) if i.get("queue") == queue_number]

        # Ambil semua patterns dari intents yang cocok
        quick_replies = []
        for intent in filtered:
            quick_replies.extend(intent.get("patterns", []))

        return jsonify({"quick_replies": quick_replies})
    except Exception as e:
        return jsonify({"error": str(e)}), 500



@app.route('/api/message', methods=['POST'])
def handle_message():
    ip = request.remote_addr
    now = datetime.now()

    if ip not in rate_limit:
        rate_limit[ip] = []

    rate_limit[ip] = [t for t in rate_limit[ip] if now - t < WINDOW]
    rate_limit[ip].append(now)
    data = request.get_json()
    user_message = data.get('message')
    timestamp = data.get('timestamp')

    if not user_message:
        return jsonify({"error": "Message cannot be empty."}), 400

    try:
        bot_response, mood = analyze_message(user_message)
    except Exception as e:
        return jsonify({"error": f"Chatbot error: {str(e)}"}), 500

    moods_collection.insert_one({
        "user_message": user_message,
        "bot_response": bot_response,
        "mood": mood,
        "timestamp": timestamp or datetime.now().isoformat()
    })

    return jsonify({
        "bot_response": bot_response,
        "mood": mood
    })

@app.route('/')
def home():
    return "Mental Health Chatbot API is running. Use POST /api/message"

# ✅ FIX: nama '__main__' yang benar
if __name__ == '__main__':
    app.run(debug=True)
