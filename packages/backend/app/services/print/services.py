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
    show_borders: bool = False,
) -> str:
    """Generate and prints a label PDF from the provided data.

    This function takes label data, creates a PDF file for it,
    and then sends it to the printer. It can also be used to just
    generate the PDF without printing.

    Args:
    ----
        label_data (LabelData): The complete label data.
        print_disabled (bool): If True, the print command will be skipped,
            and only the PDF will be generated. Defaults to False.
        show_borders (bool): If True, borders will be shown on the generated
            label for debugging purposes. Defaults to False.

    Returns:
    -------
        str: The file path of the generated PDF label.

    """
    pdf_filename = generate_random_filename()

    pdf_path = create_label_pdf(
        pdf_filename,
        label_data,
        show_borders=show_borders,
    )

    if print_disabled:
        return pdf_path

    print_pdf(pdf_path)

    return pdf_path
