"""Main application file for the FastAPI backend."""

from __future__ import annotations

from typing import TYPE_CHECKING

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from loguru import logger
from prometheus_fastapi_instrumentator import Instrumentator

from app.print.services import print_label

if TYPE_CHECKING:
    from backend.app.models import LabelData

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


@app.get("/health")
def health_check() -> dict[str, str]:
    """Perform a health check.

    Returns
    -------
        dict[str, str]: A dictionary with the status of the application.

    """
    return {"status": "ok"}


@app.post("/print-label")
async def print_label_endpoint(label_data: LabelData) -> dict[str, str]:
    """Endpoint to print a label.

    Args:
    ----
        label_data (LabelData): The request body containing label details.

    Returns:
    -------
        dict[str, str]: A dictionary with the status of the print operation.

    """
    await print_label(
        patient_name=label_data.patient_info.name,
        pwr=label_data.lens_specs.left.pwr,
        due_date=label_data.due_date,
    )
    return {"status": "ok"}
