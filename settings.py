import os
import re
import requests
from groq import Groq
from io import BytesIO
from dotenv import load_dotenv
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Table, Spacer
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from flask_mail import Mail, Message
from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, timezone

load_dotenv()

client = Groq()

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DB_URI')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

app.config['MAIL_SERVER'] = os.getenv('FLASK_MAIL_SERVER')
app.config['MAIL_PORT'] = os.getenv('FLASK_MAIL_PORT')
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = os.getenv('FLASK_MAIL_ID')
app.config['MAIL_PASSWORD'] = os.getenv('FLASK_MAIL_PWD')
app.config['MAIL_DEFAULT_SENDER'] = "ArthaShastra"
mail = Mail(app)

db = SQLAlchemy(app)
CORS(app)
