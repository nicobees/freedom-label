"""Module for handling printing services."""

from __future__ import annotations

from app.models import LabelData
from app.services.create.create_pdf import create_label_pdf
from app.services.print.print_pdf import print_pdf
from app.utils.filename import generate_random_filename


async def print_label(
    label_data: LabelData,
    print_disabled: bool = False,  # noqa: FBT001, FBT002
) -> bool:
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
        return True  # Indicate success without printing

    return print_pdf(pdf_path)
