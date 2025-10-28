# market-data-svc/app/main.py

from fastapi import FastAPI, HTTPException, status
from pydantic import BaseModel
from typing import List, Dict
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Market Data Service",
    description="Provides real-time and historical financial data.",
    version="1.0.0"
)

# --- Pydantic 데이터 모델 (DTO 역할) ---
class PriceResponse(BaseModel):
    ticker: str
    price: float
    currency: str = "USD"
    last_updated: str # ISO 형식 문자열

class ChartPoint(BaseModel):
    date: str
    price: float

class ChartResponse(BaseModel):
    ticker: str
    history: List[ChartPoint]

# --- 엔드포인트: 실시간 시세 조회 ---
@app.get("/api/market/price", response_model=PriceResponse, status_code=status.HTTP_200_OK)
async def get_current_price(ticker: str):
    """
    단일 자산의 현재 시세를 조회합니다. (외부 API 연동 예정)
    """
    logger.info(f"Price request received for ticker: {ticker}")
    
    # [TODO: 외부 API (예: Yahoo Finance) 호출 로직 추가]
    # 현재는 더미 데이터 반환
    if ticker.upper() == "AAPL":
        return PriceResponse(ticker="AAPL", price=180.50, currency="USD", last_updated="2025-10-28T10:00:00Z")
    elif ticker.upper() == "BTC-USD":
        return PriceResponse(ticker="BTC-USD", price=75000.00, currency="USD", last_updated="2025-10-28T10:00:00Z")
    else:
        # DB에 자산 정보가 없는 경우 404 반환
        raise HTTPException(status_code=404, detail=f"Ticker '{ticker}' not found in external market data.")

# --- 엔드포인트: 차트 데이터 조회 ---
@app.get("/api/market/chart", response_model=ChartResponse, status_code=status.HTTP_200_OK)
async def get_historical_chart(ticker: str, period: str = "7d"):
    """
    자산의 과거 차트 데이터를 조회합니다.
    """
    # [TODO: 외부 API (예: Yahoo Finance) 호출 및 데이터 가공 로직 추가]
    
    # 현재는 더미 데이터 반환
    if ticker.upper() == "AAPL":
        dummy_data = [
            ChartPoint(date="2025-10-21", price=170.0),
            ChartPoint(date="2025-10-28", price=180.50),
        ]
        return ChartResponse(ticker="AAPL", history=dummy_data)
    
    raise HTTPException(status_code=404, detail=f"Chart data for '{ticker}' not available.")