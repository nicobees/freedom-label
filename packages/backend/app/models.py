"""Main models file for the FastAPI backend."""

from __future__ import annotations

from typing import Annotated, Any

from pydantic import BaseModel, Field


class PatientInfo(BaseModel):
    """Represents patient's name and surname."""

    name: Annotated[str, Field(min_length=2, max_length=30)]
    surname: Annotated[str, Field(min_length=2, max_length=30)]


class LensDataSpecs(BaseModel):
    """Represents lens specifications for left or right eye."""

    bc: Annotated[str, Field(pattern=r"^(\d{1,2}\.\d{2})?$")]
    bc_toric: Annotated[str, Field(pattern=r"^(\d{1,2}\.\d{2})?$")] | None = None
    dia: Annotated[str, Field(pattern=r"^(\d{1,2}\.\d{2})?$")]
    pwr: Annotated[str, Field(pattern=r"^([+-]?\d{1,2}\.\d{2})?$")]
    cyl: Annotated[str, Field(pattern=r"^([+-]?\d{1,2}\.\d{2})?$")]
    ax: Annotated[str, Field(pattern=r"^(\d{1,3})?$")]
    add: Annotated[str, Field(pattern=r"^([+-]?\d{1,2}\.\d{2})?$")]
    sag: Annotated[str, Field(pattern=r"^(\d{1,4})?$")]
    sag_toric: Annotated[str, Field(pattern=r"^(\d{1,4})?$")] | None = None


class LensSpecs(BaseModel):
    """Represents lens specifications for both left and right eyes."""

    left: LensDataSpecs | None = None
    right: LensDataSpecs | None = None


class LabelData(BaseModel):
    """Main data structure for label information."""

    patient_info: PatientInfo
    description: Annotated[str, Field(min_length=0, max_length=24)]
    batch: Annotated[str, Field(pattern=r"^\d{2}-\d{4}$")]
    due_date: Annotated[str, Field(pattern=r"^(\d{2}/\d{2}/\d{4})?$")]
    production_date: Annotated[str, Field(pattern=r"^(\d{2}/\d{2}/\d{4})?$")]
    lens_specs: LensSpecs


class PathData(BaseModel):
    """Represents the path data for the existing label file."""

    pdf_path: Annotated[str, Field()]


class TableData(BaseModel):
    """Represents the table data for the lens specifications."""

    align: Annotated[str, Field()] | None = None
    border: Annotated[int, Field()] | None = None
    colspan: Annotated[int, Field()] | None = 1
    skip: Annotated[bool, Field()] | None = False
    style: Any | None = None
    value: str


class TableDataFontSetting(BaseModel):
    """Represents the table data font sizes for the lens specifications."""

    label: Annotated[int | float, Field()]
    value: Annotated[int | float, Field()]
    align: Annotated[str, Field()] | None = "L"
