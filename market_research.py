#market_research.py
from flask import Blueprint, request, jsonify
import os
import requests
from dotenv import load_dotenv

load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

# Create blueprint
market_research_bp = Blueprint('market_research', __name__)

MARKET_RESEARCH_PROMPT = """
Conduct comprehensive market research on the following startup idea: "{}".

Please provide the results in the following structured JSON format:

json-syntax = [
  {
    "text": "analysis or insight text",
    "graph-data": [numeric_values_showing_industry_trend_or_relevant_data]
  }
]

example = [
  {
    "text": "Competitor analysis: XYZ and ABC dominate the market with strong brand presence...",
    "graph-data": [10, 20, 30, 40, 10, 5, 1.2]
  }
]

Your analysis should cover:
1. Target Audience Analysis
2. Market Size and Potential
3. Competitor Analysis (3-5 competitors minimum)
4. Market Trends and Opportunities
5. Pricing Strategy Suggestions
6. Go-to-Market Strategy
7. Potential Challenges and Risks

Output rules:
- Return only valid JSON following the specified syntax.
- Ensure the JSON array contains multiple objects for different sections.
- "graph-data" should always be a numeric array, even if approximate.
"""


def call_gemini_api(prompt, model="gemini-2.0-flash"):
    """
    Call the Gemini API with the given prompt and model
    """
    if not GEMINI_API_KEY:
        return {"error": "Gemini API key not configured"}
    
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={GEMINI_API_KEY}"
    
    payload = {
        "contents": [
            {
                "parts": [
                    {
                        "text": prompt
                    }
                ]
            }
        ],
        "generationConfig": {
            "temperature": 0.7,
            "topK": 40,
            "topP": 0.95,
            "maxOutputTokens": 2048,
        },
        "safetySettings": [
            {
                "category": "HARM_CATEGORY_HARASSMENT",
                "threshold": "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
                "category": "HARM_CATEGORY_HATE_SPEECH",
                "threshold": "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
                "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                "threshold": "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
                "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
                "threshold": "BLOCK_MEDIUM_AND_ABOVE"
            }
        ]
    }
    
    try:
        response = requests.post(url, json=payload, timeout=60)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        return {"error": f"API request failed: {str(e)}"}

@market_research_bp.route("/market_research", methods=["POST"])
def market_research():
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({"error": "No JSON data provided"}), 400
        
        user_input = data.get("input")
        model = "gemini-2.0-flash"  # Fixed model - not configurable via API
        
        if not user_input:
            return jsonify({"error": "Missing 'input' field"}), 400
        
        prompt = MARKET_RESEARCH_PROMPT.format(user_input.strip())
        
        result = call_gemini_api(prompt, model=model)
        
        print("\n### Gemini API Raw Response ###")
        print(result)
        print("###############################\n")
        
        if "error" in result:
            return jsonify({"error": result["error"]}), 500

        # Flexible parsing for all Gemini versions
        output_text = None
        try:
            candidates = result.get("candidates", [])
            if candidates:
                content = candidates[0].get("content", {})
                parts = content.get("parts", [])
                if parts and "text" in parts[0]:
                    output_text = parts[0]["text"]
                else:
                    # Some Gemini versions return 'text' at a different level
                    output_text = candidates[0].get("text", "No text found in response")
            else:
                output_text = "No candidates found in response"
        except Exception as e:
            return jsonify({"error": f"Failed to parse API response: {str(e)}"}), 500
        
        return jsonify({
            "status": "success",
            "type": "market_research",
            "model_used": model,
            "result": output_text,
            "input": user_input
        })
    
    except Exception as e:
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500
