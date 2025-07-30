"""Main application file for the FastAPI backend."""

from __future__ import annotations

from typing import TYPE_CHECKING

from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from loguru import logger
from prometheus_fastapi_instrumentator import Instrumentator

from app.models import LabelData
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
async def print_label_endpoint(
    label_data: LabelData,
    debug: str | None = Query(None),
) -> dict[str, str]:
    """Endpoint to print a label.

    Args:
    ----
        label_data (LabelData): The request body containing label details.
        debug (str | None): Debug flag. If "no-print", the print command will be skipped.

    Returns:
    -------
        dict[str, str]: A dictionary with the status of the print operation.

    """
    print_disabled = debug == "no-print"

    await print_label(
        label_data,
        print_disabled=print_disabled,
    )
    return {"status": "ok"}
