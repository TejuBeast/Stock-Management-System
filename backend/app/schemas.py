from pydantic import BaseModel, Field
from datetime import datetime
from typing import List,Optional


class StockCreate(BaseModel):
    stock_id: int = Field(..., example=101)
    casting_type: str = Field(..., example="Type A")
    quantity: int = Field(..., gt=0, example=50)
    threshold: int = Field(0, ge=0, example=10)

class StockUpdateThreshold(BaseModel):
    threshold: int = Field(..., ge=0, example=10)

class StockDeduct(BaseModel):
    used_quantity: int = Field(..., gt=0, example=5)

class StockResponse(BaseModel):
    id: int
    casting_type: str
    quantity: int
    threshold: int
    last_updated: datetime

    class Config:
        orm_mode = True


class AvailabilityTrendPoint(BaseModel):
    date: str
    available_stock: int
    lower_bound: int
    upper_bound: int
    type: str  

class StockDepletionPredictionResponse(BaseModel):
    stock_id: int
    current_quantity: int
    average_daily_usage: float
    predicted_depletion_date: Optional[str]
    usage_trend: List[AvailabilityTrendPoint]