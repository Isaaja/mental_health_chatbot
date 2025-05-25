# Mental Health Chatbot (Free Tier Optimized)

## How to Run

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
python app.py
```

### Frontend
- Open `frontend/index.html` in a browser.

Make sure MongoDB is running at `mongodb://localhost:27017`
Also, replace `your_openai_api_key_here` in `.env` with your actual OpenAI API key.

### Free Tier Optimizations:
- Uses `gpt-3.5-turbo` instead of `gpt-4`
- Limits bot responses to **200 tokens**
- Users can send **only 5 messages per hour** (rate limit)
- Messages **longer than 200 characters** are blocked
