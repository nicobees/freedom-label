"""Main application file for the FastAPI backend."""

from __future__ import annotations

from typing import TYPE_CHECKING, Annotated

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from loguru import logger
from prometheus_fastapi_instrumentator import Instrumentator

from app.models import LabelData
from app.services.create.create_pdf import create_label_pdf
from app.services.print.print_pdf import print_pdf
from app.services.print.services import print_label, validate_label_data
from app.utils.filename import generate_random_filename

if TYPE_CHECKING:
    from backend.app.models import LabelData

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
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


@app.post("/label/create")
async def create_label_endpoint(
    label_data: LabelData,
) -> dict[str, str]:
    """Endpoint to create a label in pdf.

    Args:
    ----
        label_data (LabelData): The request body containing label details.

    Returns:
    -------
        dict[str, str]: A dictionary with the status of the print operation.

    """
    pdf_filename = generate_random_filename()

    await create_label_pdf(
        pdf_filename,
        label_data,
    )
    return {"status": "ok"}


@app.post("/label/print")
async def print_label_endpoint(
    path: str,
) -> dict[str, str]:
    """Endpoint to print a label specifying its location path.

    Args:
    ----
        path (str): The path to the label file.

    Returns:
    -------
        dict[str, str]: A dictionary with the status of the print operation.

    """
    await print_pdf(
        path,
    )
    return {"status": "ok"}


@app.post("/label/create-print")
async def create_print_label_endpoint(
    label_data: LabelData,
    debug: Annotated[str | None, Query()] = None,
) -> dict[str, str]:
    """Endpoint to print a label.

    Args:
    ----
        label_data (LabelData): The request body containing label details.
        debug (str | None): Debug flag. If "no-print", the print command will be
            skipped.

    Returns:
    -------
        dict[str, str]: A dictionary with the status of the print operation.

    """
    print_disabled = debug == "no-print"

    try:
        validate_label_data(label_data)
    except ValueError:
        raise HTTPException(
            status_code=400,
            detail="Invalid label data",
            headers={"X-Error-Code": "VALIDATION_ERROR"},
        ) from ValueError

    pdf_path = await print_label(
        label_data,
        print_disabled=print_disabled,
    )

    return {"status": "ok", "pdf_filename": pdf_path}
