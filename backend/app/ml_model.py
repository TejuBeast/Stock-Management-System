import pandas as pd
from datetime import datetime, timedelta

def get_combined_actual_and_forecasted_trend(usage_history, current_quantity, threshold, forecast_days=10, confidence_margin=0.10):
    data = [{"date": u.timestamp.date(), "used_quantity": u.used_quantity} for u in usage_history]
    df = pd.DataFrame(data)
    
    trend_data = []
    depletion_date = None

    if not df.empty:
        df_grouped = df.groupby('date').sum(numeric_only=True).reset_index()
        df_grouped['moving_avg'] = df_grouped['used_quantity'].rolling(window=3, min_periods=1).mean()
        average_usage = df_grouped['moving_avg'].iloc[-1]

        stock_left = current_quantity
        for _, row in df_grouped.iterrows():
            stock_left -= row['used_quantity']
            stock_left = max(stock_left, 0)
            trend_data.append({
                "date": str(row['date']),
                "available_stock": int(round(stock_left)),
                "lower_bound": int(round(stock_left * (1 - confidence_margin))),
                "upper_bound": int(round(stock_left * (1 + confidence_margin))),
                "type": "actual"
            })

        forecast_stock = stock_left
        today = datetime.now().date()
        for i in range(forecast_days):
            next_date = today + timedelta(days=i + 1)
            forecast_stock -= average_usage
            forecast_stock = max(forecast_stock, 0)

            trend_data.append({
                "date": str(next_date),
                "available_stock": int(round(forecast_stock)),
                "lower_bound": int(round(forecast_stock * (1 - confidence_margin))),
                "upper_bound": int(round(forecast_stock * (1 + confidence_margin))),
                "type": "forecast"
            })

            if depletion_date is None and forecast_stock <= threshold:
                depletion_date = next_date
                break 
    else:
        average_usage = 0  

    return trend_data, depletion_date, average_usage