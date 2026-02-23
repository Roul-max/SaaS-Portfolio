from fastapi import APIRouter
from .models import ChatRequest
from .services import get_ai_response
from .database import chat_collection, db
from datetime import datetime

router = APIRouter()

# ---------------- CHAT ROUTE ----------------
@router.post("/chat")
def chat(request: ChatRequest):

    ai_reply = get_ai_response(request.message)

    chat_collection.insert_one({
        "user_message": request.message,
        "ai_response": ai_reply,
        "timestamp": datetime.utcnow()
    })

    return {"response": ai_reply}


# ---------------- NAVLINKS ROUTE ----------------
@router.get("/navlinks")
def get_navlinks():
    return list(db.navlinks.find({}, {"_id": 0}))


# ---------------- PROJECTS ROUTE ----------------
@router.get("/projects")
def get_projects():
    return list(db.projects.find({}, {"_id": 0}))


# ---------------- SOCIALS ROUTE ----------------
@router.get("/socials")
def get_socials():
    return list(db.socials.find({}, {"_id": 0}))


# ---------------- SKILLS ROUTE ----------------
@router.get("/skills")
def get_skills():
    return list(db.skills.find({}, {"_id": 0}))


# ---------------- EXPERIENCE ROUTE ----------------
@router.get("/experience")
def get_experience():
    return list(db.experience.find({}, {"_id": 0}))


# ---------------- INTERESTS ROUTE ----------------
@router.get("/interests")
def get_interests():
    return list(db.interests.find({}, {"_id": 0}))