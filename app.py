from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import requests
from dotenv import load_dotenv

load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

app = Flask(__name__)
CORS(app) 

PROMPTS = {
    "market_research": """
    Conduct comprehensive market research on the following startup idea: "{}"
    
    Please provide:
    1. Target Audience Analysis
    2. Market Size and Potential
    3. Competitor Analysis (at least 3-5 competitors)
    4. Market Trends and Opportunities
    5. Pricing Strategy Suggestions
    6. Go-to-Market Strategy
    7. Potential Challenges and Risks
    
    Format the response in a structured, professional manner.
    """,
    
    "idea_validator": """
    Validate the following startup idea: "{}"
    
    Please analyze:
    1. Problem-Solution Fit
    2. Market Demand and Feasibility
    3. Technical Feasibility
    4. Business Model Viability
    5. Potential Risks and Challenges
    6. Competitive Advantages
    7. Scalability Potential
    8. Resource Requirements
    9. Success Probability (1-10 scale with reasoning)
    10. Actionable Next Steps
    
    Provide honest, constructive feedback with specific recommendations.
    """,
    
    "improved_product": """
    Suggest comprehensive improvements for the following product or idea: "{}"
    
    Please provide:
    1. User Experience (UX) Enhancements
    2. Feature Additions and Improvements
    3. Technology Stack Recommendations
    4. Design and Interface Improvements
    5. Performance Optimizations
    6. Accessibility Improvements
    7. Monetization Opportunities
    8. Marketing and Growth Strategies
    9. Innovation Opportunities
    10. Implementation Roadmap
    
    Focus on practical, actionable suggestions that add real value.
    """
}

def call_gemini_api(prompt):
    """
    Call the Gemini API with the given prompt
    """
    if not GEMINI_API_KEY:
        return {"error": "Gemini API key not configured"}
    
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={GEMINI_API_KEY}"
    
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

@app.route("/", methods=["GET"])
def home():
    """
    Health check endpoint
    """
    return jsonify({
        "status": "success",
        "message": "Build Backend API is running!",
        "endpoints": {
            "/api/build": "POST - Main build functionality endpoint"
        }
    })

@app.route("/api/build", methods=["POST"])
def build_api():
    """
    Main endpoint for build functionalities
    """
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({"error": "No JSON data provided"}), 400
        
        req_type = data.get("type")
        user_input = data.get("input")
        
        if not req_type:
            return jsonify({"error": "Missing 'type' field"}), 400
        
        if not user_input:
            return jsonify({"error": "Missing 'input' field"}), 400
        
        if req_type not in PROMPTS:
            return jsonify({
                "error": "Invalid type. Valid types are: market_research, idea_validator, improved_product"
            }), 400
        
        prompt = PROMPTS[req_type].format(user_input.strip())
        
        result = call_gemini_api(prompt)
        
        if "error" in result:
            return jsonify({"error": result["error"]}), 500

        try:
            output_text = result["candidates"][0]["content"]["parts"][0]["text"]
        except (KeyError, IndexError) as e:
            return jsonify({"error": "Failed to parse API response"}), 500
        
        return jsonify({
            "status": "success",
            "type": req_type,
            "result": output_text,
            "input": user_input
        })
    
    except Exception as e:
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500

@app.route("/api/test", methods=["GET"])
def test_api():
    """
    Test endpoint to check API connectivity
    """
    if not GEMINI_API_KEY:
        return jsonify({
            "status": "error",
            "message": "Gemini API key not configured"
        }), 500
    
    return jsonify({
        "status": "success",
        "message": "API is configured and ready to use",
        "api_key_configured": bool(GEMINI_API_KEY)
    })

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)