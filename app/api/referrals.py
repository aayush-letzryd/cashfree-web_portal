from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
from app.database import get_db
from app.models.app_models import AppReferralLeads, AppDrivers
from app.schemas.app_schemas import SubmitReferralRequest, ReferralResponse

router = APIRouter(prefix="/referrals", tags=["Referrals"])

@router.get("")
def list_referrals(driver_id: int = 1, db: Session = Depends(get_db)):
    referrals = db.query(AppReferralLeads).filter(AppReferralLeads.referred_by_driver_id == driver_id).all()
    return {"driver_id": driver_id, "count": len(referrals), "data": referrals}

@router.post("", response_model=ReferralResponse)
def submit_referral(req: SubmitReferralRequest, db: Session = Depends(get_db)):
    # Look up referral code if not provided
    referral_code = req.referral_code_used
    if not referral_code and req.referred_by_type == 'driver':
        driver = db.query(AppDrivers).filter(AppDrivers.app_driver_id == req.referred_by_id).first()
        if driver:
            referral_code = driver.referral_code
    lead = AppReferralLeads(
        referred_by_type=req.referred_by_type,
        referred_by_driver_id=req.referred_by_id if req.referred_by_type == 'driver' else None,
        referred_by_op_id=req.referred_by_id if req.referred_by_type == 'operator' else None,
        lead_name=req.lead_name,
        lead_phone=req.lead_phone,
        referral_code_used=referral_code,
        status="submitted",
        rides_completed=0,
        reward_amount=1000.00,
        reward_credited=False,
        submitted_at=datetime.utcnow(),
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )
    db.add(lead)
    db.commit()
    db.refresh(lead)
    return ReferralResponse(
        app_referral_id=lead.app_referral_id,
        lead_name=lead.lead_name,
        lead_phone=lead.lead_phone,
        status=lead.status,
        reward_amount=float(lead.reward_amount),
        reward_credited=lead.reward_credited
    )
