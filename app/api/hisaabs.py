from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models.app_models import AppHisaabs, AppDrivers
from app.schemas.app_schemas import HisaabBreakdownResponse
from app.services.platform_aggregator import aggregate_raw_platform_data

router = APIRouter(prefix="/hisaabs", tags=["Hisaabs Ledger"])

@router.get("/driver/by-phone/{phone}")
def get_hisaabs_by_driver_phone(phone: str, db: Session = Depends(get_db)):
    driver = db.query(AppDrivers).filter(AppDrivers.phone == phone).first()
    if not driver:
        raise HTTPException(status_code=404, detail=f"No driver with phone {phone}")
    hisaabs = db.query(AppHisaabs).filter(AppHisaabs.app_driver_id == driver.app_driver_id).order_by(AppHisaabs.week_number.desc()).all()
    return {"driver_id": driver.app_driver_id, "count": len(hisaabs), "data": [_map_hisaab(h) for h in hisaabs]}

@router.get("/driver/{driver_id}")
def get_driver_hisaabs(driver_id: int, db: Session = Depends(get_db)):
    hisaabs = db.query(AppHisaabs).filter(AppHisaabs.app_driver_id == driver_id).order_by(AppHisaabs.week_number.desc()).all()
    return {"driver_id": driver_id, "count": len(hisaabs), "data": [_map_hisaab(h) for h in hisaabs]}

@router.get("/operator/{operator_id}")
def get_operator_hisaabs(operator_id: int, db: Session = Depends(get_db)):
    hisaabs = db.query(AppHisaabs).filter(AppHisaabs.app_operator_id == operator_id).order_by(AppHisaabs.week_number.desc()).all()
    return {"operator_id": operator_id, "count": len(hisaabs), "data": [_map_hisaab(h) for h in hisaabs]}

@router.get("/{hisaab_id}", response_model=HisaabBreakdownResponse)
def get_hisaab_by_id(hisaab_id: int, db: Session = Depends(get_db)):
    hisaab = db.query(AppHisaabs).filter(AppHisaabs.app_hisaab_id == hisaab_id).first()
    if not hisaab:
        raise HTTPException(status_code=404, detail="Hisaab record not found")
    return _map_hisaab(hisaab)

@router.post("/recalculate")
def trigger_raw_recalculation(week_number: int = 30, db: Session = Depends(get_db)):
    processed = aggregate_raw_platform_data(db, week_number)
    return {"success": True, "message": f"Processed raw platform data for {processed} vehicles"}

def _map_hisaab(h: AppHisaabs) -> HisaabBreakdownResponse:
    return HisaabBreakdownResponse(
        app_hisaab_id=h.app_hisaab_id,
        app_driver_id=h.app_driver_id,
        hisaab_number=h.hisaab_number or "",
        week_number=h.week_number or 0,
        period_start=h.period_start,
        period_end=h.period_end,
        days_count=h.days_count or 0,
        status=h.status or "in_progress",
        is_locked=h.is_locked or False,
        growth_pct=float(h.growth_pct or 0),
        uber_trips=h.uber_trips or 0,
        uber_revenue=float(h.uber_revenue or 0),
        uber_cash=float(h.uber_cash or 0),
        uber_toll=float(h.uber_toll or 0),
        uber_incentive=float(h.uber_incentive or 0),
        uber_subscription=float(h.uber_subscription or 0),
        uber_km=float(h.uber_km or 0),
        ola_trips=h.ola_trips or 0,
        ola_revenue=float(h.ola_revenue or 0),
        ola_cash=float(h.ola_cash or 0),
        ola_toll=float(h.ola_toll or 0),
        ola_incentive=float(h.ola_incentive or 0),
        ola_subscription=float(h.ola_subscription or 0),
        ola_km=float(h.ola_km or 0),
        rapido_trips=h.rapido_trips or 0,
        rapido_revenue=float(h.rapido_revenue or 0),
        rapido_cash=float(h.rapido_cash or 0),
        rapido_toll=float(h.rapido_toll or 0),
        rapido_incentive=float(h.rapido_incentive or 0),
        rapido_subscription=float(h.rapido_subscription or 0),
        rapido_km=float(h.rapido_km or 0),
        vehicle_daily_rate=float(h.vehicle_daily_rate or 1000),
        vehicle_rent=float(h.vehicle_rent or 0),
        maintenance_charge=float(h.maintenance_charge or 0),
        tds_amount=float(h.tds_amount or 0),
        challan_amount=float(h.challan_amount or 0),
        accident_charge=float(h.accident_charge or 0),
        other_adjustment=float(h.other_adjustment or 0),
        previous_outstanding=float(h.previous_outstanding or 0),
        gps_total_km=float(h.gps_total_km or 0),
        gps_ideal_km=float(h.gps_ideal_km or 0),
        gps_dead_km=float(h.gps_dead_km or 0),
        gps_dead_pct=float(h.gps_dead_pct or 0),
        gps_dead_penalty=float(h.gps_dead_penalty or 0),
        gps_free_dead_pct=float(h.gps_free_dead_pct or 20),
        gps_penalty_rate=float(h.gps_penalty_rate or 5),
        completed_trips=h.completed_trips or 0,
        total_km=float(h.total_km or 0),
        total_gross_earnings=float(h.total_gross_earnings or 0),
        total_deductions=float(h.total_deductions or 0),
        total_penalties=float(h.total_penalties or 0),
        current_period_os=float(h.current_period_os or 0),
        to_collect=float(h.to_collect or 0),
        to_pay=float(h.to_pay or 0),
        letzryd_earning=float(h.letzryd_earning or 0),
        notes=h.notes or "",
        last_refreshed_at=str(h.last_refreshed_at) if h.last_refreshed_at else None
    )
