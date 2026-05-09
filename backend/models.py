from sqlalchemy import Column, Integer, String, Float
from database import Base

class PredictionHistory(Base):
    __tablename__ = "prediction_history"

    id = Column(Integer, primary_key=True, index=True)

    text = Column(String)

    prediction = Column(String)

    confidence = Column(Float)

    risk_level = Column(String)