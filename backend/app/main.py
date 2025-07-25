"""Main application file for the FastAPI backend."""

from __future__ import annotations

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from loguru import logger
from prometheus_fastapi_instrumentator import Instrumentator
from pydantic import BaseModel, Field
from typing_extensions import Annotated

from app.print.services import print_label

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Instrumentator().instrument(app).expose(app)


@app.on_event("startup")
async def startup() -> None:
    """Handle application startup events."""
    logger.info("Application started")


@app.on_event("shutdown")
async def shutdown() -> None:
    """Handle application shutdown events."""
    logger.info("Application shutdown")


class LabelRequest(BaseModel):
    """Request model for printing a label."""

    patient_name: Annotated[str, Field(min_length=1, max_length=64)]
    pwr: Annotated[str, Field(min_length=1, max_length=6)]
    due_date: Annotated[str, Field(min_length=1, max_length=7)]


@app.get("/health")
def health_check() -> dict[str, str]:
    """Perform a health check.

    Returns
    -------
        dict[str, str]: A dictionary with the status of the application.

    """
    return {"status": "ok"}


@app.post("/print-label")
async def print_label_endpoint(label_request: LabelRequest) -> dict[str, str]:
    """Endpoint to print a label.

    Args:
    ----
        label_request (LabelRequest): The request body containing label details.

    Returns:
    -------
        dict[str, str]: A dictionary with the status of the print operation.

    """
    await print_label(
        patient_name=label_request.patient_name,
        pwr=label_request.pwr,
        due_date=label_request.due_date,
    )
    return {"status": "ok"}
