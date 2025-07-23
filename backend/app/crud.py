from sqlalchemy.orm import Session
from app import models, alertservice
from app.models import Stock, StockUsageHistory, AlertHistory
from fastapi import HTTPException
from datetime import datetime
import logging

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

def get_all_stock(db: Session):
    return db.query(Stock).all()

def get_stock_by_id(db: Session, stock_id: int):
    return db.query(Stock).filter(Stock.id == stock_id).first()

def create_stock(db: Session, stock_id: int, casting_type: str, quantity: int, threshold: int = 0):
    existing = get_stock_by_id(db, stock_id)
    if existing:
        raise HTTPException(status_code=400, detail="Stock ID already exists")
    new_stock = Stock(id=stock_id, casting_type=casting_type, quantity=quantity, threshold=threshold)
    db.add(new_stock)
    db.commit()
    db.refresh(new_stock)
    logging.info(f"[STOCK CREATED] ID: {stock_id}, Type: {casting_type}, Qty: {quantity}, Threshold: {threshold}")
    return new_stock

def update_stock_quantity(db: Session, stock_id: int, quantity: int):
    stock_item = get_stock_by_id(db, stock_id)
    if stock_item:
        stock_item.quantity = quantity
        db.commit()
        db.refresh(stock_item)
        logging.info(f"[STOCK UPDATED] ID: {stock_id}, New Qty: {quantity}")
    return stock_item

def delete_stock(db: Session, stock_id: int):
    stock_item = get_stock_by_id(db, stock_id)
    if not stock_item:
        return None

    # First, delete the usage history entries
    db.query(StockUsageHistory).filter(StockUsageHistory.stock_id == stock_id).delete()

    db.delete(stock_item)
    db.commit()
    logging.info(f"[STOCK DELETED] ID: {stock_id}")
    return {"message": "Deleted successfully"}

def deduct_stock_quantity(db: Session, stock_id: int, used_quantity: int):
    stock_item = get_stock_by_id(db, stock_id)
    if not stock_item:
        return None
    if stock_item.quantity < used_quantity:
        return "insufficient"
    
    stock_item.quantity -= used_quantity
    stock_item.last_updated = datetime.now()
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
    logging.info(f"[THRESHOLD UPDATED] ID: {stock_id}, New Threshold: {new_threshold}")
    return stock_item

def log_stock_usage(db: Session, stock_id: int, used_quantity: int):
    usage = StockUsageHistory(stock_id=stock_id, used_quantity=used_quantity)
    db.add(usage)
    db.commit()
    db.refresh(usage)
    logging.info(f"[USAGE LOGGED] Stock ID: {stock_id}, Used Qty: {used_quantity}")
    return usage

def get_usage_history_by_stock(db: Session, stock_id: int):
    return db.query(StockUsageHistory).filter(StockUsageHistory.stock_id == stock_id).all()
def save_alert_history(db: Session, casting_type: str, threshold: int):
    alert = AlertHistory(
        casting_type=casting_type,
        threshold=threshold
    )
    db.add(alert)
    db.commit()
    db.refresh(alert)
    return alert


def get_contact_config(db: Session):
    return db.query(models.ContactConfig).first()

def set_contact_config(db: Session, email: str, sms_number: str):
    config = get_contact_config(db)
    if config:
        config.email = email
        config.sms_number = sms_number
        config.updated_at = datetime.now()
        logging.info("[CONTACT CONFIG UPDATED]")
    else:
        config = models.ContactConfig(
            email=email,
            sms_number=sms_number
        )
        db.add(config)
        logging.info("[CONTACT CONFIG CREATED]")
    db.commit()
    db.refresh(config)
    return config

def check_and_trigger_alert(db: Session, stock: models.Stock):
    if stock.quantity <= stock.threshold:
        save_alert_history(db, stock.casting_type, stock.threshold)
        contact = get_contact_config(db)
        if not contact:
            logging.warning("⚠️ No contact configured for alerts.")
            return

        message = (
            f"⚠️ Stock Alert!\n"
            f"Stock: {stock.casting_type}\n"
            f"Qty: {stock.quantity} (Threshold: {stock.threshold})\n"
            f"⚡ Action Required!"
        )

        alertservice.send_email(contact.email, f"Stock Alert: {stock.casting_type}", message)
        alertservice.send_sms(contact.sms_number, message)
        logging.info(f"[ALERT SENT] Stock: {stock.casting_type}")