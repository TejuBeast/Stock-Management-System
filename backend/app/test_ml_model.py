from datetime import datetime, timedelta
from app import ml_model 

class DummyUsage:
    def __init__(self, used_quantity, timestamp):
        self.used_quantity = used_quantity
        self.timestamp = timestamp


usage_history = [
    DummyUsage(800, datetime.now() - timedelta(days=6)),
    DummyUsage(850, datetime.now() - timedelta(days=5)),
    DummyUsage(900, datetime.now() - timedelta(days=4)),
    DummyUsage(950, datetime.now() - timedelta(days=3)),
    DummyUsage(1000, datetime.now() - timedelta(days=2)),
    DummyUsage(1050, datetime.now() - timedelta(days=1)),
    DummyUsage(1100, datetime.now()),
]

current_quantity = 5000

forecast, depletion_date, average_usage = ml_model.predict_usage_trend_and_depletion(
    current_quantity,
    usage_history
)

print("Forecast:", forecast)
print("Predicted Depletion Date:", depletion_date)
print("Average Daily Usage:", average_usage)