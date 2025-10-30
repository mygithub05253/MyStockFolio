# market-data-svc/app/main.py

from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict
import logging
from datetime import datetime, timedelta
import yfinance as yf

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Market Data Service",
    description="Provides real-time and historical financial data.",
    version="1.0.0"
)

# CORS 설정 (Spring Boot 및 Frontend에서 호출 가능하도록)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:8080", 
        "http://127.0.0.1:8080",
        "http://localhost:3000",
        "http://127.0.0.1:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
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

class DetailedQuoteResponse(BaseModel):
    ticker: str
    name: str
    current_price: float
    open_price: float
    high_price: float
    low_price: float
    previous_close: float
    volume: int
    market_cap: float = None
    pe_ratio: float = None
    change: float
    change_percent: float
    currency: str
    last_updated: str

# --- 엔드포인트: 실시간 시세 조회 ---
@app.get("/api/market/price", response_model=PriceResponse, status_code=status.HTTP_200_OK)
async def get_current_price(ticker: str):
    """
    단일 자산의 현재 시세를 조회합니다. (Yahoo Finance API 연동)
    """
    logger.info(f"Price request received for ticker: {ticker}")
    
    try:
        # Yahoo Finance에서 데이터 가져오기
        stock = yf.Ticker(ticker)
        info = stock.info
        
        # 현재가 가져오기 (여러 필드 시도)
        current_price = info.get('currentPrice') or info.get('regularMarketPrice') or info.get('previousClose')
        
        if current_price is None:
            logger.warning(f"No price data found for ticker: {ticker}")
            raise HTTPException(status_code=404, detail=f"Price data for '{ticker}' not available.")
        
        # 통화 정보 (기본값: USD)
        currency = info.get('currency', 'USD')
        
        # 마지막 업데이트 시간
        last_updated = datetime.now().isoformat() + "Z"
        
        logger.info(f"Price fetched for {ticker}: {current_price} {currency}")
        
        return PriceResponse(
            ticker=ticker.upper(),
            price=float(current_price),
            currency=currency,
            last_updated=last_updated
        )
        
    except Exception as e:
        logger.error(f"Error fetching price for {ticker}: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch price data for '{ticker}': {str(e)}"
        )

# --- 엔드포인트: 차트 데이터 조회 ---
@app.get("/api/market/chart", response_model=ChartResponse, status_code=status.HTTP_200_OK)
async def get_historical_chart(ticker: str, period: str = "7d"):
    """
    자산의 과거 차트 데이터를 조회합니다.
    period: 1d, 5d, 1mo, 3mo, 6mo, 1y, 2y, 5y, 10y, ytd, max
    """
    logger.info(f"Chart request received for ticker: {ticker}, period: {period}")
    
    try:
        # Yahoo Finance에서 히스토리 데이터 가져오기
        stock = yf.Ticker(ticker)
        hist = stock.history(period=period)
        
        if hist.empty:
            logger.warning(f"No historical data found for ticker: {ticker}")
            raise HTTPException(status_code=404, detail=f"Chart data for '{ticker}' not available.")
        
        # 데이터 가공
        chart_data = []
        for date, row in hist.iterrows():
            chart_data.append(ChartPoint(
                date=date.strftime("%Y-%m-%d"),
                price=float(row['Close'])
            ))
        
        logger.info(f"Chart data fetched for {ticker}: {len(chart_data)} data points")
        
        return ChartResponse(
            ticker=ticker.upper(),
            history=chart_data
        )
        
    except Exception as e:
        logger.error(f"Error fetching chart for {ticker}: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch chart data for '{ticker}': {str(e)}"
        )

# --- 엔드포인트: 상세 시세 정보 조회 (HTS 스타일) ---
@app.get("/api/market/quote", response_model=DetailedQuoteResponse, status_code=status.HTTP_200_OK)
async def get_detailed_quote(ticker: str):
    """
    HTS 스타일의 상세 시세 정보를 조회합니다.
    시가, 고가, 저가, 종가, 거래량, 시가총액 등 포함
    """
    logger.info(f"Detailed quote request received for ticker: {ticker}")
    
    try:
        # Yahoo Finance에서 데이터 가져오기
        stock = yf.Ticker(ticker)
        info = stock.info
        
        # 현재가
        current_price = info.get('currentPrice') or info.get('regularMarketPrice') or info.get('previousClose')
        if current_price is None:
            raise HTTPException(status_code=404, detail=f"Quote data for '{ticker}' not available.")
        
        # 오늘의 시가, 고가, 저가
        open_price = info.get('regularMarketOpen') or info.get('open') or current_price
        high_price = info.get('regularMarketDayHigh') or info.get('dayHigh') or current_price
        low_price = info.get('regularMarketDayLow') or info.get('dayLow') or current_price
        previous_close = info.get('previousClose') or info.get('regularMarketPreviousClose') or current_price
        
        # 거래량
        volume = info.get('volume') or info.get('regularMarketVolume') or 0
        
        # 시가총액
        market_cap = info.get('marketCap')
        
        # PER (주가수익비율)
        pe_ratio = info.get('trailingPE') or info.get('forwardPE')
        
        # 변동폭 및 변동률 계산
        change = current_price - previous_close
        change_percent = (change / previous_close * 100) if previous_close != 0 else 0
        
        # 종목명
        name = info.get('longName') or info.get('shortName') or ticker
        
        # 통화
        currency = info.get('currency', 'USD')
        
        # 마지막 업데이트 시간
        last_updated = datetime.now().isoformat() + "Z"
        
        logger.info(f"Detailed quote fetched for {ticker}: {current_price} {currency}")
        
        return DetailedQuoteResponse(
            ticker=ticker.upper(),
            name=name,
            current_price=float(current_price),
            open_price=float(open_price),
            high_price=float(high_price),
            low_price=float(low_price),
            previous_close=float(previous_close),
            volume=int(volume),
            market_cap=float(market_cap) if market_cap else None,
            pe_ratio=float(pe_ratio) if pe_ratio else None,
            change=float(change),
            change_percent=float(change_percent),
            currency=currency,
            last_updated=last_updated
        )
        
    except Exception as e:
        logger.error(f"Error fetching detailed quote for {ticker}: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch detailed quote for '{ticker}': {str(e)}"
        )

# --- Health Check 엔드포인트 ---
@app.get("/health")
async def health_check():
    """
    서비스 상태 확인
    """
    return {"status": "healthy", "service": "market-data-svc"}
