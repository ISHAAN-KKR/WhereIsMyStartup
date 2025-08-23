from flask import Flask
from flask_cors import CORS
import os
from dotenv import load_dotenv

# Import blueprints
from market_research import market_research_bp
from connect_vc import connect_vc_bp

# Load environment variables
load_dotenv()

def create_app():
    app = Flask(__name__)
    CORS(app)
    
    # Register blueprints
    app.register_blueprint(market_research_bp, url_prefix='/api')
    app.register_blueprint(connect_vc_bp, url_prefix='/api')
    
    @app.route("/", methods=["GET"])
    def home():
        return {
            "status": "success",
            "message": "Build Backend API is running!",
            "endpoints": {
                "/api/market_research": "POST - Market research functionality endpoint",
                "/api/connect_vc": "GET - Get all VCs",
                "/api/connect_vc/<id>": "GET - Get specific VC details",
                "/api/connect_vc/<id>/schedule": "POST - Schedule meeting with VC",
                "/api/connect_vc/<id>/availability": "GET - Get VC availability"
            }
        }
    
    @app.route("/api/test", methods=["GET"])
    def test_api():
        gemini_api_key = os.getenv("GEMINI_API_KEY")
        if not gemini_api_key:
            return {
                "status": "error",
                "message": "Gemini API key not configured"
            }, 500
        
        return {
            "status": "success",
            "message": "API is configured and ready to use",
            "api_key_configured": bool(gemini_api_key)
        }
    
    return app

if __name__ == "__main__":
    app = create_app()
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)