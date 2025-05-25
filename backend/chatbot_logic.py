import json
from pathlib import Path
import random
import re
from collections import deque
import openai
import os

# Load dataset.json
with open(Path("data/dataset.json"), encoding="utf-8") as f:
    data = json.load(f)
    # Sort intents based on queue value if exists, otherwise put at end
    intents = sorted(data["intents"], key=lambda x: x.get('queue', float('inf')))

# Struktur data untuk pencocokan
compiled_patterns = []
responses_by_tag = {}
message_history = deque(maxlen=1000000)  # Batasi riwayat ke 5 pesan

for intent in intents:
    # Ambil tag dan respossnses
    tag = intent["tag"]
    responses_by_tag[tag] = intent["responses"]

    # Compile semua pattern ke regex
    for pattern in intent["patterns"]:
        regex = re.compile(pattern, re.IGNORECASE)
        compiled_patterns.append((regex, tag))

# Fallback tag kalau tidak cocok
DEFAULT_TAG = "default"

# Load API key dari .env
openai.api_key = os.getenv("OPENAI_API_KEY")

def analyze_message(message):
    message_history.append(message)
    
    matched_tag = DEFAULT_TAG
    for pattern, tag in compiled_patterns:
        if pattern.search(message):
            matched_tag = tag
            break

    response_list = responses_by_tag.get(matched_tag)

    # Fallback respons ke GPT jika hanya default
    if matched_tag == DEFAULT_TAG and response_list:
        try:
            gpt_response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are a helpful and empathetic mental health chatbot. Always respond with warmth, empathy, and encouragement."},
                    {"role": "user", "content": message}
                ],
                max_tokens=200,
                temperature=0.7
            )
            response_text = gpt_response['choices'][0]['message']['content'].strip()
            return response_text, "gpt-fallback"
        except Exception as e:
            # Jika GPT gagal, pakai fallback hardcoded
            return random.choice(response_list), DEFAULT_TAG
    else:
        return random.choice(response_list), matched_tag

def get_message_history():
    return list(message_history)