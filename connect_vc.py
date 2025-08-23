from flask import Blueprint, request, jsonify
import json
import os
from datetime import datetime, timedelta

# Create blueprint
connect_vc_bp = Blueprint('connect_vc', __name__)

def load_vc_data():
    """Load VC data from JSON file"""
    try:
        with open('vc_data.json', 'r', encoding='utf-8') as file:
            return json.load(file)
    except FileNotFoundError:
        return {"error": "VC data file not found"}
    except json.JSONDecodeError:
        return {"error": "Invalid JSON in VC data file"}

@connect_vc_bp.route("/connect_vc", methods=["GET"])
def get_all_vcs():
    """Get all VCs with their basic information"""
    try:
        vc_data = load_vc_data()
        
        if "error" in vc_data:
            return jsonify(vc_data), 500
        
        # Return basic info without detailed schedules
        basic_info = []
        for vc in vc_data.get("venture_capitalists", []):
            basic_info.append({
                "id": vc["id"],
                "name": vc["name"],
                "photo": vc["photo"],
                "domain": vc["domain"],
                "experience": vc["experience"],
                "bio": vc["bio"],
                "company": vc["company"]
            })
        
        return jsonify({
            "status": "success",
            "total_vcs": len(basic_info),
            "venture_capitalists": basic_info
        })
    
    except Exception as e:
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500

@connect_vc_bp.route("/connect_vc/<int:vc_id>", methods=["GET"])
def get_vc_details(vc_id):
    """Get detailed information about a specific VC including schedule"""
    try:
        vc_data = load_vc_data()
        
        if "error" in vc_data:
            return jsonify(vc_data), 500
        
        # Find the specific VC
        target_vc = None
        for vc in vc_data.get("venture_capitalists", []):
            if vc["id"] == vc_id:
                target_vc = vc
                break
        
        if not target_vc:
            return jsonify({"error": "VC not found"}), 404
        
        return jsonify({
            "status": "success",
            "venture_capitalist": target_vc
        })
    
    except Exception as e:
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500

@connect_vc_bp.route("/connect_vc/<int:vc_id>/schedule", methods=["POST"])
def schedule_meeting(vc_id):
    """Schedule a meeting with a VC"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({"error": "No JSON data provided"}), 400
        
        vc_data = load_vc_data()
        
        if "error" in vc_data:
            return jsonify(vc_data), 500
        
        # Find the specific VC
        target_vc = None
        for vc in vc_data.get("venture_capitalists", []):
            if vc["id"] == vc_id:
                target_vc = vc
                break
        
        if not target_vc:
            return jsonify({"error": "VC not found"}), 404
        
        # Validate required fields
        required_fields = ["date", "time_slot", "startup_name", "founder_name", "email", "pitch_summary"]
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Missing required field: {field}"}), 400
        
        requested_date = data["date"]
        requested_time = data["time_slot"]
        
        # Check if the requested time slot is available
        schedule = target_vc.get("schedule", {})
        date_schedule = schedule.get(requested_date, {})
        time_availability = date_schedule.get(requested_time, False)
        
        if not time_availability:
            return jsonify({
                "error": "Selected time slot is not available",
                "available_slots": {k: v for k, v in date_schedule.items() if v}
            }), 400
        
        # Simulate booking (in a real app, you'd update the database)
        meeting_id = f"MTG_{vc_id}_{requested_date.replace('-', '')}_{requested_time.replace(':', '')}"
        
        return jsonify({
            "status": "success",
            "message": "Meeting scheduled successfully",
            "meeting_details": {
                "meeting_id": meeting_id,
                "vc_name": target_vc["name"],
                "date": requested_date,
                "time_slot": requested_time,
                "startup_name": data["startup_name"],
                "founder_name": data["founder_name"],
                "email": data["email"],
                "pitch_summary": data["pitch_summary"]
            }
        })
    
    except Exception as e:
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500

@connect_vc_bp.route("/connect_vc/<int:vc_id>/availability", methods=["GET"])
def get_vc_availability(vc_id):
    """Get availability for a specific VC"""
    try:
        vc_data = load_vc_data()
        
        if "error" in vc_data:
            return jsonify(vc_data), 500
        
        # Find the specific VC
        target_vc = None
        for vc in vc_data.get("venture_capitalists", []):
            if vc["id"] == vc_id:
                target_vc = vc
                break
        
        if not target_vc:
            return jsonify({"error": "VC not found"}), 404
        
        return jsonify({
            "status": "success",
            "vc_name": target_vc["name"],
            "schedule": target_vc.get("schedule", {})
        })
    
    except Exception as e:
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500