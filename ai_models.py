import pickle
import numpy as np
import pandas as pd
import joblib

def predict_revenue(industry, last_revenue, target_year):
    model_filename = f"./revenuePredictors/{industry}_sarima_model.pkl"

    try:
        with open(model_filename, 'rb') as file:
            loaded_model = pickle.load(file)
        print(f"✅ Model loaded for: {industry}")
        last_observed_year = 2009

        if target_year <= last_observed_year:
            print("⚠ Please enter a future year!")
            return None

        future_steps = target_year - last_observed_year
        future_forecast = loaded_model.forecast(steps=future_steps)
        predicted_value = future_forecast[-1] * last_revenue
        print(f"📊 Predicted Revenue for {industry} in {target_year}: {predicted_value:.2f}")
        return predicted_value
    except FileNotFoundError:
        print(f"⚠ Model file not found for {industry}.")
        return None

def predict_profitability(category, revenue, savings):
    model = joblib.load("./profitMarginPredictor/net_profit_margin_model.pkl")
    scaler = joblib.load("./profitMarginPredictor/scaler.pkl")
    label_encoders = joblib.load("./profitMarginPredictor/label_encoders.pkl")
    selected_features = ['Category', 'Revenue', 'Cash Flow from Operating']
    categorical_cols = ['Category']
    
    user_data = {
        'Category': category,
        'Revenue': revenue,
        'Cash Flow from Operating': savings
    }
    
    user_df = pd.DataFrame([user_data], columns=selected_features)    
    for col in categorical_cols:
        if user_df[col].iloc[0] not in label_encoders[col].classes_:
            label_encoders[col].classes_ = np.append(label_encoders[col].classes_, user_df[col].iloc[0])
        user_df[col] = label_encoders[col].transform(user_df[col].astype(str))
    
    user_scaled = scaler.transform(user_df)
    prediction = model.predict(user_scaled)[0]
    
    return prediction
