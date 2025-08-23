import pickle
import numpy as np
import pandas as pd

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
