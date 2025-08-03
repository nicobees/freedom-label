"""Module for handling printing services."""

from __future__ import annotations

from typing import TYPE_CHECKING

from app.services.create.create_pdf import create_label_pdf
from app.services.print.print_pdf import print_pdf
from app.utils.filename import generate_random_filename

if TYPE_CHECKING:
    from app.models import LabelData


def validate_label_data(label_data: LabelData) -> None:
    """Validate label data.

    Args:
    ----
        label_data (LabelData): The complete label data.

    Raises:
    ------
        ValueError: If the label data is invalid.

    """
    if label_data.lens_specs.left is None and label_data.lens_specs.right is None:
        raise ValueError


async def print_label(
    label_data: LabelData,
    print_disabled: bool = False,
) -> str:
    """Print a label with the given label data.

    Args:
    ----
        label_data (LabelData): The complete label data.
        print_disabled (bool): Print disabled flag. If True, the print command will be
        skipped

    Returns:
    -------
        bool: True if the label printing process is successful, False otherwise.

    """
    pdf_filename = generate_random_filename()

    pdf_path = create_label_pdf(
        pdf_filename,
        label_data,
    )

    if print_disabled:
        return pdf_path

    print_pdf(pdf_path)

    return pdf_path
