"""Main application file for the FastAPI backend."""

from __future__ import annotations

from typing import TYPE_CHECKING, Annotated

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from loguru import logger
from prometheus_fastapi_instrumentator import Instrumentator

from app.models import LabelData, PathData
from app.service_layer import (
    create_label,
    create_print_label,
    print_label,
    validate_label_data,
)

if TYPE_CHECKING:
    from app.models import LabelData, PathData

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
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
    debug_border: Annotated[int | None, Query()] = None,
) -> dict[str, str]:
    """Endpoint to create a label in pdf.

    Args:
    ----
        label_data (LabelData): The request body containing label details.
        debug_border (int | None, optional): If set to 1, the generated PDF
            will have visible borders for debugging. Defaults to None.

    Returns:
    -------
        dict[str, str]: A dictionary with the status of the print operation.

    """
    try:
        validate_label_data(label_data)
    except ValueError:
        raise HTTPException(
            status_code=400,
            detail="Invalid label data",
            headers={"X-Error-Code": "VALIDATION_ERROR"},
        ) from ValueError

    show_borders = debug_border == 1

    try:
        pdf_path = await create_label(
            label_data,
            show_borders=show_borders,
        )
    except FileNotFoundError as error:
        # TODO(nicobees): log error message as str(error)
        # https://github.com/nicobees/freedom-label/issues/2
        raise HTTPException(
            status_code=404,
            detail=str(error),
            headers={"X-Error-Code": "TEMPLATE_PDF_NOT_FOUND_ERROR"},
        ) from FileNotFoundError

    return {"status": "ok", "pdf_filename": pdf_path}


@app.post("/label/print")
async def print_label_endpoint(body_data: PathData) -> dict[str, str]:
    """Endpoint to print a label by specifying its path.

    Args:
    ----
        body_data (PathData): The request body containing the path to the label file.

    Returns:
    -------
        dict[str, str]: A dictionary with the status of the print operation.

    """
    try:
        pdf_path = await print_label(pdf_path=body_data.pdf_path)
    except FileNotFoundError as error:
        # TODO(nicobees): log error message as str(error)
        # https://github.com/nicobees/freedom-label/issues/2
        raise HTTPException(
            status_code=404,
            detail=str(error),
            headers={"X-Error-Code": "TEMPLATE_PDF_NOT_FOUND_ERROR"},
        ) from FileNotFoundError

    return {"status": "ok", "pdf_filename": pdf_path}


@app.post("/label/create-print")
async def create_print_label_endpoint(
    label_data: LabelData,
    debug: Annotated[str | None, Query()] = None,
    debug_border: Annotated[int | None, Query()] = None,
) -> dict[str, str]:
    """Endpoint to create and optionally print a label.

    Args:
    ----
        label_data (LabelData): The request body containing label details.
        debug (str | None, optional): If set to "no-print", the printing step
            will be skipped. Defaults to None.
        debug_border (int | None, optional): If set to 1, the generated PDF
            will have visible borders for debugging. Defaults to None.

    Raises:
    ------
        HTTPException: If the provided label data is invalid.

    Returns:
    -------
        dict[str, str]: A dictionary with the status of the operation and the
            path to the generated PDF file.

    """
    try:
        validate_label_data(label_data)
    except ValueError:
        raise HTTPException(
            status_code=400,
            detail="Invalid label data",
            headers={"X-Error-Code": "VALIDATION_ERROR"},
        ) from ValueError

    print_disabled = debug == "no-print"
    show_borders = debug_border == 1

    try:
        pdf_path = await create_print_label(
            label_data,
            print_disabled=print_disabled,
            show_borders=show_borders,
        )
    except FileNotFoundError as error:
        # TODO(nicobees): log error message as str(error)
        # https://github.com/nicobees/freedom-label/issues/2
        raise HTTPException(
            status_code=404,
            detail=str(error),
            headers={"X-Error-Code": "TEMPLATE_PDF_NOT_FOUND_ERROR"},
        ) from FileNotFoundError

    return {"status": "ok", "pdf_filename": pdf_path}
