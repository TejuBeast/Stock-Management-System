from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db, engine
from app.models import Base, AlertHistory
import app.crud as crud
from app.schemas import StockCreate, StockResponse, StockUpdateThreshold, StockDeduct,StockDepletionPredictionResponse, ContactConfigUpdate#added
from app import ml_model
from fastapi.middleware.cors import CORSMiddleware
from app import alertservice
from datetime import date
app = FastAPI()
from pydantic import BaseModel

class QuantityUpdate(BaseModel):
    quantity: int
class UsedUpdate(BaseModel):
    used: int
Base.metadata.create_all(bind=engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # React frontend origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/stock", response_model=StockResponse)
def add_stock(stock_data: StockCreate, db: Session = Depends(get_db)):
    return crud.create_stock(db, stock_data.stock_id, stock_data.casting_type, stock_data.quantity, stock_data.threshold)


@app.get("/stock", response_model=list[StockResponse])
def get_all_stock(db: Session = Depends(get_db)):
    return crud.get_all_stock(db)


@app.put("/stock/{stock_id}", response_model=StockResponse)
def update_stock(stock_id: int, data: QuantityUpdate, db: Session = Depends(get_db)):
    stock_item = crud.update_stock_quantity(db, stock_id, data.quantity)
    if not stock_item:
        raise HTTPException(status_code=404, detail="Stock not found")
    alertservice.trigger_alert(db, stock_item)#added
    return stock_item


@app.delete("/stock/{stock_id}")
def delete_stock_endpoint(stock_id: int, db: Session = Depends(get_db)):
    result = crud.delete_stock(db, stock_id)
    if result is None:
        raise HTTPException(status_code=404, detail="Stock not found")
    return result



@app.put("/stock/{stock_id}/deduct", response_model=StockResponse)
def deduct_stock(stock_id: int, data: UsedUpdate, db: Session = Depends(get_db)):
    result = crud.deduct_stock_quantity(db, stock_id, data.used)
    if result is None:
        raise HTTPException(status_code=404, detail="Stock not found")
    if result == "insufficient":
        raise HTTPException(status_code=400, detail="Not enough stock available")
    alertservice.trigger_alert(db, result)#added
    return result

@app.put("/stock/{stock_id}/threshold")
def update_stock_threshold_endpoint(stock_id: int, data: StockUpdateThreshold, db: Session = Depends(get_db)):
    stock_item = crud.update_stock_threshold(db, stock_id, data.threshold)
    if not stock_item:
        raise HTTPException(status_code=404, detail="Stock not found")
    return {
        "message": "Threshold updated successfully",
        "stock_id": stock_id,
        "new_threshold": data.threshold
    }


@app.get("/stock/{stock_id}/predict", response_model=StockDepletionPredictionResponse)
def predict_stock_depletion(stock_id: int, db: Session = Depends(get_db)):
    stock = crud.get_stock_by_id(db, stock_id)
    if not stock:
        raise HTTPException(status_code=404, detail="Stock not found")
    
    usage_history = crud.get_usage_history_by_stock(db, stock_id)
    trend_data, depletion_date, avg_usage = ml_model.get_combined_actual_and_forecasted_trend(
        usage_history, stock.quantity, stock.threshold
    )
    if not trend_data:
        raise HTTPException(status_code=404, detail="Not enough data to predict usage trend")
    
    return {
        "stock_id": stock_id,
        "current_quantity": stock.quantity,
        "average_daily_usage": avg_usage,
        "predicted_depletion_date": str(depletion_date) if depletion_date else None,
        "usage_trend": trend_data
    }
@app.get("/alerts")
def get_all_alerts(db: Session = Depends(get_db)):
    return db.query(AlertHistory).all()

@app.put("/config/contact")
def update_contact_config_endpoint(data: ContactConfigUpdate, db: Session = Depends(get_db)):
    config = crud.set_contact_config(db, data.email, data.sms_number)
    return {"message": "Contact configuration updated", "config": config}
@app.get("/high_risk_stocks")
def get_high_risk_stocks(db: Session = Depends(get_db)):
    stocks = crud.get_all_stock(db)
    risk_list = []

    for stock in stocks:
        usage = crud.get_usage_history_by_stock(db, stock.id)
        trend_data, depletion_date, avg_usage = ml_model.get_combined_actual_and_forecasted_trend(
            usage, stock.quantity, stock.threshold
        )

        if depletion_date:
            days_left = (depletion_date - date.today()).days
            risk_list.append({
                "casting_type": stock.casting_type,
                "depletion_date": str(depletion_date),
                "days_left": days_left,
                "avg_usage": round(avg_usage, 2) if avg_usage else 0,
                "current_stock": stock.quantity
            })

    sorted_risk = sorted(risk_list, key=lambda x: x["days_left"])
    return sorted_risk
