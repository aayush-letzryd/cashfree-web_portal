from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from datetime import datetime, timezone
from typing import Optional
import uuid

from app.database import get_db
from app.models.app_models import AppPayments, AppDrivers
from app.schemas.app_schemas import InitiatePaymentRequest, PaymentResponse, CreateOrderRequest, CreateOrderResponse
from app.services.helpers import clean_phone_number, resolve_driver

router = APIRouter(prefix="/payments", tags=["Payments & Cashfree"])

@router.post("/initiate", response_model=PaymentResponse)
def initiate_payment(req: InitiatePaymentRequest, db: Session = Depends(get_db)):
    cf_order_id = f"ORDER_LR_{uuid.uuid4().hex[:10].upper()}"
    now = datetime.now(timezone.utc)
    
    payment = AppPayments(
        payment_type="collection",
        payer_type=req.payer_type,
        payer_id=req.payer_id,
        payee_type="letzryd",
        app_hisaab_id=req.app_hisaab_id,
        amount=req.amount,
        payment_mode=req.payment_mode,
        status="INITIATED",
        cf_order_id=cf_order_id,
        initiated_at=now
    )
    db.add(payment)
    db.commit()
    db.refresh(payment)
    
    return PaymentResponse(
        app_payment_id=payment.app_payment_id,
        amount=float(payment.amount),
        payment_mode=payment.payment_mode,
        status=payment.status,
        cf_order_id=payment.cf_order_id
    )

@router.post("/create-order", response_model=CreateOrderResponse)
def create_cashfree_order(req: CreateOrderRequest, db: Session = Depends(get_db)):
    """Handles frontend Cashfree checkout order creation."""
    try:
        amt = float(req.amount)
    except (ValueError, TypeError):
        amt = 0.0

    order_id = f"ORDER_LR_{uuid.uuid4().hex[:10].upper()}"
    session_id = f"session_lr_{uuid.uuid4().hex}"
    now = datetime.now(timezone.utc)

    # Resolve driver ID if possible
    clean_phone = clean_phone_number(req.driverPhone or "")
    driver = resolve_driver(clean_phone, db) if clean_phone else None
    payer_id = driver.app_driver_id if driver else (int(req.driverId) if str(req.driverId).isdigit() else 1)

    payment = AppPayments(
        payment_type="collection",
        payer_type="driver",
        payer_id=payer_id,
        payee_type="letzryd",
        amount=amt,
        payment_mode="cashfree_checkout",
        status="INITIATED",
        cf_order_id=order_id,
        raw_response={"weekRange": req.weekRange, "driverName": req.driverName, "driverPhone": req.driverPhone},
        initiated_at=now
    )
    db.add(payment)
    db.commit()

    return CreateOrderResponse(
        payment_session_id=session_id,
        order_id=order_id,
        order_amount=amt,
        order_currency="INR",
        order_status="ACTIVE"
    )

@router.get("/history")
def get_payment_history(payer_id: Optional[int] = None, payer_type: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(AppPayments)
    if payer_id is not None:
        query = query.filter(AppPayments.payer_id == payer_id)
    if payer_type is not None:
        query = query.filter(AppPayments.payer_type == payer_type)
    
    payments = query.order_by(AppPayments.initiated_at.desc()).all()
    return {"count": len(payments), "data": payments}

@router.post("/webhook/cashfree")
async def cashfree_webhook(request: Request, db: Session = Depends(get_db)):
    payload = await request.json()
    order_id = payload.get("order", {}).get("order_id")
    
    if order_id:
        payment = db.query(AppPayments).filter(AppPayments.cf_order_id == order_id).first()
        if payment:
            payment.status = "SUCCESS"
            payment.completed_at = datetime.now(timezone.utc)
            payment.raw_response = payload
            db.commit()
            
    return {"status": "OK"}

