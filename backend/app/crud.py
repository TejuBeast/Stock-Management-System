from sqlalchemy.orm import Session
from app.models import Stock  
from app.models import StockUsageHistory
from fastapi import HTTPException


def get_all_stock(db: Session):
    return db.query(Stock).all()

def get_stock_by_id(db: Session, stock_id: int):
    return db.query(Stock).filter(Stock.id == stock_id).first()

def create_stock(db: Session, stock_id: int, casting_type: str, quantity: int,threshold: int = 0):
    existing = get_stock_by_id(db, stock_id)
    if existing:
        raise HTTPException(status_code=400, detail="Stock ID already exists")
    new_stock = Stock(id=stock_id, casting_type=casting_type, quantity=quantity,threshold=threshold)
    db.add(new_stock)
    db.commit()
    db.refresh(new_stock)
    return new_stock


def update_stock_quantity(db: Session, stock_id: int, quantity: int):
    stock_item = get_stock_by_id(db, stock_id)
    if stock_item:
        stock_item.quantity = quantity
        db.commit()
        db.refresh(stock_item)
    return stock_item

def delete_stock(db: Session, stock_id: int):
    stock_item = get_stock_by_id(db, stock_id)
    if stock_item:
        db.delete(stock_item)
        db.commit()
    return stock_item

def deduct_stock_quantity(db: Session, stock_id: int, used_quantity: int):
    stock_item = get_stock_by_id(db, stock_id)
    if not stock_item:
        return None

    if stock_item.quantity < used_quantity:
        return "insufficient"  
    
    stock_item.quantity -= used_quantity
    db.commit()
    db.refresh(stock_item)
    log_stock_usage(db, stock_id, used_quantity)
    return stock_item

def update_stock_threshold(db: Session, stock_id: int, new_threshold: int):
    stock_item = get_stock_by_id(db, stock_id)
    if not stock_item:
        return None
    stock_item.threshold = new_threshold
    db.commit()
    db.refresh(stock_item)
    return stock_item

def log_stock_usage(db: Session, stock_id: int, used_quantity: int):
    usage = StockUsageHistory(stock_id=stock_id, used_quantity=used_quantity)
    db.add(usage)
    db.commit()
    db.refresh(usage)
    return usage

def get_usage_history_by_stock(db: Session, stock_id: int):
    return db.query(StockUsageHistory).filter(StockUsageHistory.stock_id == stock_id).all()