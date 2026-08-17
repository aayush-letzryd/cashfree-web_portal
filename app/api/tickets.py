from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import datetime
from app.database import get_db
from app.models.app_models import AppSupportTickets
from app.schemas.app_schemas import CreateTicketRequest, TicketResponse

router = APIRouter(prefix="/tickets", tags=["Support Tickets"])

@router.get("")
def list_tickets(creator_id: int = 1, db: Session = Depends(get_db)):
    tickets = db.query(AppSupportTickets).filter(AppSupportTickets.creator_id == creator_id).order_by(AppSupportTickets.created_at.desc()).all()
    return {"creator_id": creator_id, "count": len(tickets), "data": [_map_ticket(t) for t in tickets]}

@router.post("", response_model=TicketResponse)
def create_ticket(req: CreateTicketRequest, db: Session = Depends(get_db)):
    ticket_no = f"TKT-2026-{datetime.datetime.utcnow().strftime('%H%M%S')}"
    ticket = AppSupportTickets(
        ticket_number=ticket_no,
        creator_type=req.creator_type,
        creator_id=req.creator_id,
        category=req.category,
        subject=req.subject,
        description=req.description,
        priority=req.priority,
        status="open",
        created_at=datetime.datetime.utcnow()
    )
    db.add(ticket)
    db.commit()
    db.refresh(ticket)
    return _map_ticket(ticket)

def _map_ticket(t: AppSupportTickets) -> TicketResponse:
    return TicketResponse(
        app_ticket_id=t.app_ticket_id,
        ticket_number=t.ticket_number or "",
        category=t.category or "",
        subject=t.subject or "",
        description=t.description,
        status=t.status or "open",
        priority=t.priority,
        created_at=t.created_at,
        resolved_at=t.resolved_at,
        resolution_note=t.resolution_note
    )
