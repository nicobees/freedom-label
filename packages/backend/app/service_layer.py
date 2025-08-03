"""Module for handling printing services."""

from __future__ import annotations

from pathlib import Path
from typing import TYPE_CHECKING

from .services.create.create_pdf import create_label_pdf
from .services.print.print_pdf import print_label_pdf
from .utils.filename import generate_random_filename

if TYPE_CHECKING:
    from .models import LabelData


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


async def create_label(
    label_data: LabelData,
    show_borders: bool = False,
) -> str:
    """Generate a label PDF from the provided data.

    This function takes label data, creates a PDF file for it.

    Args:
    ----
        label_data (LabelData): The complete label data.
        show_borders (bool): If True, borders will be shown on the generated
            label for debugging purposes. Defaults to False.

    Returns:
    -------
        str: The file path of the generated PDF label.

    """
    pdf_filename = generate_random_filename()

    return create_label_pdf(
        pdf_filename,
        label_data,
        show_borders=show_borders,
    )


async def print_label(
    pdf_path: str,
) -> str:
    """Print a label from a given PDF file path.

    Args:
    ----
        pdf_path (str): The path to the PDF file to be printed.


    Returns:
    -------
        str: The path of the printed PDF file.

    """
    current_dir = Path(__file__).parent
    output_local_path = "services/pdf_output"
    full_path = current_dir / output_local_path / pdf_path

    print_label_pdf(file_path=full_path, file_name=pdf_path)

    return pdf_path


async def create_print_label(
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

    print_label_pdf(file_path=pdf_path, file_name=pdf_filename)

    return pdf_path
