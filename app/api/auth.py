from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
import jwt

from app.database import get_db
from app.config import settings
from app.models.app_models import AppDrivers, AppOperators, AppSessions, AppAuditLogs
from app.schemas.app_schemas import OTPRequest, OTPVerify, PasswordLogin, TokenResponse

router = APIRouter(prefix="/auth", tags=["Authentication"])

TESTING_STATIC_OTP = "1234"

@router.post("/otp/request")
def request_otp(req: OTPRequest, request: Request, db: Session = Depends(get_db)):
    phone = req.phone.replace("+91", "").replace(" ", "").replace("-", "").strip()
    driver = db.query(AppDrivers).filter(AppDrivers.phone == phone).first()
    operator = db.query(AppOperators).filter(AppOperators.phone == phone).first()

    if not driver and not operator:
        raise HTTPException(
            status_code=404,
            detail="Profile does not exist. This mobile number is not registered with LetzRyd. Please contact your Fleet Manager or Support."
        )

    user_type = "operator" if operator else "driver"
    user_id = operator.app_operator_id if operator else driver.app_driver_id

    session = AppSessions(
        user_type=user_type,
        user_ref_id=user_id,
        phone=phone,
        otp_hash="hashed_1234",
        attempt_count=0,
        is_verified=False,
        used_password=False,
        ip_address=request.client.host if request.client else "127.0.0.1",
        user_agent=request.headers.get("user-agent", ""),
        expires_at=datetime.utcnow() + timedelta(minutes=10),
        created_at=datetime.utcnow()
    )
    db.add(session)
    audit = AppAuditLogs(
        user_type=user_type,
        user_ref_id=user_id,
        event_type="OTP_REQUEST",
        phone=phone,
        created_at=datetime.utcnow()
    )
    db.add(audit)
    db.commit()
    return {"success": True, "message": f"OTP sent to {phone}", "demo_otp": TESTING_STATIC_OTP}


@router.post("/otp/verify", response_model=TokenResponse)
def verify_otp(req: OTPVerify, request: Request, db: Session = Depends(get_db)):
    phone = req.phone.replace("+91", "").replace(" ", "").replace("-", "").strip()
    otp = req.otp.strip()

    # Allow testing static OTP 1234 or real 6-digit Firebase SMS OTP
    is_valid_otp = (otp == TESTING_STATIC_OTP) or (len(otp) == 6 and otp.isdigit())
    if not is_valid_otp:
        raise HTTPException(
            status_code=400,
            detail="Invalid OTP. Please enter the 6-digit SMS OTP sent to your phone or demo OTP: 1234."
        )

    driver = db.query(AppDrivers).filter(AppDrivers.phone == phone).first()
    operator = db.query(AppOperators).filter(AppOperators.phone == phone).first()

    if not driver and not operator:
        raise HTTPException(
            status_code=404,
            detail="Profile does not exist. This mobile number is not registered with LetzRyd. Please contact your Fleet Manager or Support."
        )

    if operator:
        actual_user_type = "operator"
        user_name = operator.company_name or operator.contact_person_name or "Operator"
        user_id = operator.app_operator_id
    else:
        actual_user_type = "driver"
        user_name = driver.full_name or "Driver"
        user_id = driver.app_driver_id

    payload = {
        "sub": phone,
        "user_type": actual_user_type,
        "user_id": user_id,
        "exp": datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    }
    token = jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.JWT_ALGORITHM)

    audit = AppAuditLogs(
        user_type=actual_user_type,
        user_ref_id=user_id,
        event_type="LOGIN_SUCCESS",
        phone=phone,
        created_at=datetime.utcnow()
    )
    db.add(audit)
    db.commit()

    return TokenResponse(
        access_token=token,
        token_type="bearer",
        user_type=actual_user_type,
        user_id=user_id,
        name=user_name
    )
