"""Main models file for the FastAPI backend."""

from pydantic import BaseModel, Field
from typing_extensions import Annotated


class PatientInfo(BaseModel):
    """Represents patient's name and surname."""

    name: Annotated[str, Field(min_length=2, max_length=14)]
    surname: Annotated[str, Field(min_length=2, max_length=14)]


class LeftRightSpecs(BaseModel):
    """Represents lens specifications for left or right eye."""

    bc: Annotated[str, Field(pattern=r"^\d{1,2}\.\d{2}$")]
    dia: Annotated[str, Field(pattern=r"^\d{1,2}\.\d{2}$")]
    pwr: Annotated[str, Field(pattern=r"^[+-]?\d{1,2}\.\d{2}$")]
    cyl: Annotated[str, Field(pattern=r"^[+-]?\d{1,2}\.\d{2}$")]
    ax: Annotated[str, Field(pattern=r"^\d{3}$")]
    add: Annotated[str, Field(pattern=r"^[+-]?\d{1,2}\.\d{2}$")]
    sag: Annotated[str, Field(pattern=r"^\d{1,2}\.\d{2}$")]


class LensSpecs(BaseModel):
    """Represents lens specifications for both left and right eyes."""

    left: LeftRightSpecs
    right: LeftRightSpecs


class LabelData(BaseModel):
    """Main data structure for label information."""

    patient_info: PatientInfo
    description: Annotated[str, Field(min_length=0, max_length=24)]
    batch: Annotated[str, Field(pattern=r"^\d{2}-\d{4}$")]
    due_date: Annotated[str, Field(pattern=r"^\d{2}/\d{4}$")]
    lens_specs: LensSpecs
