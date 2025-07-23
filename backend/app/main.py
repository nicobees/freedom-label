

from fastapi import FastAPI, Depends
from pydantic import BaseModel, Field
from typing_extensions import Annotated
from loguru import logger
from prometheus_fastapi_instrumentator import Instrumentator

from app.print.services import print_label


app = FastAPI()

@app.on_event("startup")
async def startup():
    Instrumentator().instrument(app).expose(app)
    logger.info("Application started")

@app.on_event("shutdown")
async def shutdown():
    logger.info("Application shutdown")

class LabelRequest(BaseModel):
    patient_name: Annotated[str, Field(min_length=1, max_length=64)]
    pwr: Annotated[str, Field(min_length=1, max_length=6)]
    due_date: Annotated[str, Field(min_length=1, max_length=7)]

@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.post("/print-label")
async def print_label_endpoint(label_request: LabelRequest):
    await print_label(
        patient_name=label_request.patient_name,
        pwr=label_request.pwr,
        due_date=label_request.due_date,
    )
    return {"status": "ok"}
