from sqlalchemy.orm import declarative_base
from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime, timezone, timedelta
from sqlalchemy import ForeignKey
from sqlalchemy.orm import relationship

Base = declarative_base()
IST = timezone(timedelta(hours=5, minutes=30))

class Stock(Base):
    __tablename__ = 'stock'

    id = Column(Integer, primary_key=True, index=True, autoincrement=False)
    casting_type = Column(String(100), unique=True, nullable=False)
    quantity = Column(Integer, nullable=False)
    threshold = Column(Integer, nullable=False, default=0)
    last_updated = Column(DateTime, default=lambda: datetime.now(IST))
    usage_history = relationship("StockUsageHistory", back_populates="stock")


class StockUsageHistory(Base):
    __tablename__ = "stock_usage_history"

    Sno = Column(Integer, primary_key=True, index=True)
    stock_id = Column(Integer, ForeignKey("stock.id"), nullable=False)
    used_quantity = Column(Integer, nullable=False)
    timestamp = Column(DateTime, default=lambda: datetime.now(IST))
    stock = relationship("Stock", back_populates="usage_history")