from settings import *

class User(db.Model):
    __tablename__ = 'user'
    
    uid = db.Column(db.String, primary_key=True, nullable=False)
    industry = db.Column(db.String, nullable=True)
    annual_revenue = db.Column(db.ARRAY(db.Float), nullable=True)
    recurring_expenses = db.Column(db.ARRAY(db.Float), nullable=True)
    monthly_budget = db.Column(db.ARRAY(db.Float), nullable=True)
    savings = db.Column(db.ARRAY(db.Float), nullable=True)
    timestamp = db.Column(db.ARRAY(db.TIMESTAMP(timezone=True)), nullable=True)

    def __init__(self, uid, industry=None, annual_revenue=None, recurring_expenses=None, 
                 monthly_budget=None, savings=None, timestamp=None):
        self.uid = uid
        self.industry = industry
        self.annual_revenue = annual_revenue
        self.recurring_expenses = recurring_expenses
        self.monthly_budget = monthly_budget
        self.savings = savings
        self.timestamp = timestamp
    
    def lastData(self):
        return {
            "annual_revenue":self.annual_revenue[-1],
            "recurring_expenses":self.recurring_expenses[-1],
            "monthly_budget":self.monthly_budget[-1],
            "savings":self.savings[-1],
        }
    
    def fetchData(self):
        json_data=[{"industry":self.industry}]
        for index, time in enumerate(self.timestamp):
            json_data.append({
                "timestamp":time.strftime("%Y-%m-%d %H:%M:%S"),
                "annual_revenue":self.annual_revenue[index],
                "recurring_expenses":self.recurring_expenses[index],
                "monthly_budget":self.monthly_budget[index],
                "savings":self.savings[index],
            })
        return json_data
