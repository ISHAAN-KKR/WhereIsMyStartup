#app.py
import json
from settings import *
from model import User
from helpers import generate_pdf
from ai_models import predict_revenue, predict_profitability
# # Add this import at the top of your app.py (after your existing imports)
# import sys
# import os
# sys.path.append(os.path.join(os.path.dirname(__file__), 'grow_industry_analysis'))
# from main import analyze_industry


@app.route('/', methods=['POST','GET'])
@cross_origin()
def demo():
    return jsonify({"message":"Welcome User"}),201

@app.route('/login', methods=['POST','GET'])
@cross_origin()
def login():
    if request.method=='GET':
        uid = request.args.get('uid')
        if uid:
            user = User.query.filter_by(uid=uid).first()
            if user:
                return jsonify({"message":user.lastData()}), 201
            
            return jsonify({'message': "User not found."}),400

        return jsonify({'message': "Pass required fields."}),400

    else:
        data=request.json
        print("Data received:", data)
        if not all(field in data for field in [
            'uid','industry','annual_revenue', 'recurring_expenses', 'monthly_budget', 'savings'
        ]):
            return jsonify({"message":"Provide all fields."}), 400
        
        try:
            existing_user = User.query.filter_by(uid=data.get('uid')).first()
            if existing_user:
                existing_user.annual_revenue=existing_user.annual_revenue+[data.get('annual_revenue')]
                existing_user.recurring_expenses=existing_user.recurring_expenses+[data.get('recurring_expenses')]
                existing_user.monthly_budget=existing_user.monthly_budget+[data.get('monthly_budget')]
                existing_user.savings=existing_user.savings+[data.get('savings')]
                existing_user.timestamp=existing_user.timestamp+[datetime.now(timezone.utc)]
            else:
                new_user = User(
                    uid=data.get('uid'),
                    industry=data.get('industry'),
                    annual_revenue=[data.get('annual_revenue')],
                    recurring_expenses=[data.get('recurring_expenses')],
                    monthly_budget=[data.get('monthly_budget')],
                    savings=[data.get('savings')],
                    timestamp=[datetime.now(timezone.utc)]
                )
                db.session.add(new_user)

            db.session.commit()
            return jsonify({"message":"Successfully registered in the database."}),201
        except Exception as e:
            return jsonify({"message":f"Error occured:{str(e)}"}), 500

@app.route('/userData', methods=['POST'])
@cross_origin()
def userData():
    data=request.json
    print(data)
    if "uid" not in data:
        return jsonify({"message":"Provide required fields."}), 400
    
    user = User.query.filter_by(uid=data.get('uid')).first()
    if user:
        return jsonify({"message":user.fetchData()}), 201
    else:
        return jsonify({"message":"User not found"}), 500

@app.route('/predictRevenue', methods=['POST'])
@cross_origin()
def predictRevenue():
    data=request.json
    if "uid" not in data:
        return jsonify({"message":"Provide required fields."}), 400
    
    user = User.query.filter_by(uid=data.get('uid')).first()
    if user:
        json_data={}
        for year in range(2025,2031):
            predicted_revenue = predict_revenue(user.industry, user.annual_revenue[-1], year)
            json_data[year]=predicted_revenue
        
        predicted_profit = predict_profitability(
            user.industry, user.annual_revenue[-1], user.savings[-1]
        )

        return jsonify({"revenue":json_data, "profit_margin":predicted_profit}), 201
    else:
        return jsonify({"message":"User not found"}), 500
# @app.route('/industryAnalysis', methods=['POST'])
# @cross_origin()
# def industry_analysis():
#     """
#     Endpoint for industry analysis using RAG.
#     """
#     data = request.json
    
#     # Validate required fields
#     if not all(field in data for field in ['query', 'industry']):
#         return jsonify({"message": "Provide required fields: query, industry"}), 400
    
#     query = data.get('query')
#     industry = data.get('industry')
    
#     try:
#         # Get analysis using main.py function
#         result = analyze_industry(query, industry)
        
#         if result['success']:
#             return jsonify({
#                 "success": True,
#                 "message": "Analysis completed successfully",
#                 "analysis": result['analysis'],
#                 "industry": industry,
#                 "query": query
#             }), 201
#         else:
#             return jsonify({
#                 "success": False,
#                 "message": result['message']
#             }), 400
            
#     except Exception as e:
#         return jsonify({
#             "success": False,
#             "message": f"Error occurred: {str(e)}"
#         }), 500
@app.route('/chatBot2', methods=['POST'])
@cross_origin()
def chatBot2():
    data=request.json
    if "chat_history" not in data:
        return jsonify({"message":"Provide required fields."}), 400
    
    init_data=data.get('chat_history')
    try:
        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=init_data
        )
        # final_data = init_data.append({"role": "assistant", "content": response.choices[0].message.content})
        # final_data = {"role": "assistant", "content": response.choices[0].message.content}
        print(response.choices[0].message.content)
        return jsonify({"message":response.choices[0].message.content}), 201
    except Exception as e:
        return jsonify({"message":f"Error occured:{str(e)}"}), 500

@app.route('/chatBot', methods=['POST'])
@cross_origin()
def chatBot():
    data = request.json
    if "chat_history" not in data:
        return jsonify({"message": "Provide required fields."}), 400

    init_data = data.get("chat_history")
    try:
        # Collect only user messages (you can also include system/assistant if needed)
        # messages = [msg["content"] for msg in init_data if msg["role"] == "user"]
        # prompt = "\n".join(messages)

        # Prepare request body
        payload = {
            "contents": [
                {
                    "parts": [
                        {"text": json.dumps(init_data)}
                    ]
                }
            ]
        }

        # Make request to Gemini API
        response = requests.post(
            f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={os.getenv('GOOGLE_API_KEY')}",
            headers={"Content-Type": "application/json"},
            json=payload
        )

        if response.status_code != 200:
            print(response.text)
            return jsonify({"message": f"Error from Gemini API: {response.text}"}), 500

        result = response.json()
        print("################\n", result)
        reply_text = result["candidates"][0]["content"]["parts"][0]["text"]

        return jsonify({"message": reply_text}), 201

    except Exception as e:
        print(str(e))
        return jsonify({"message": f"Error occurred: {str(e)}"}), 500

@app.route('/pdfGenerator', methods=['POST'])
@cross_origin()
def send_pdf_email():
    data = request.json
    print(data)
    if not all(key in data for key in ["mail", "prompt","uname"]):
        return jsonify({"message":"Provide required fields."}), 400
    
    try:
        response=requests.post(
            'http://localhost:5000/chatBot2',
            json={"chat_history":data.get('prompt')}
        )
        if response.status_code == 201:
            result = response.json()
            pdf_text=result.get('message')
        else:
            return jsonify({"message":response.text}), 400

        pdf_buffer = generate_pdf(pdf_text)
        msg = Message(
            subject="🚀 Your Custom Business Plan is Here!",
            recipients=[data.get('mail')],
            body=f"""
Dear {data.get('uname')},

We are excited to share your personalized business plan, crafted with insights from ArthaShastra’s AI-driven advisor. This plan is tailored to your financial details and business vision, helping you make informed decisions and scale strategically.

📄 Attached is your business plan: CostPlanner_ArthaShastra.pdf

Here’s what you’ll find inside:
✅ Financial Forecasts 📊
✅ Expense & Budget Analysis 💰
✅ Growth Strategies 🚀
✅ Custom AI Insights for Your Business 🧠

We hope this report empowers your business journey! Let us know if you have any questions or need further assistance.

Best Regards,
The ArthaShastra Team 🏆
            """
        )
        msg.attach("CostPlanner_ArthaShastra.pdf", "application/pdf", pdf_buffer.getvalue())

        mail.send(msg)

        return jsonify({"message":"Email sent successfully!"}), 201

    except Exception as e:
        print(str(e))
        return jsonify({"message":f"Error: {str(e)}"}), 500
    
if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=True)


