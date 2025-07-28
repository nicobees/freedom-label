"""Module for handling printing services."""

from app.models import LabelData
from app.print.create_pdf import create_freedomlac_pdf
from app.print.print_pdf import print_pdf


async def print_label(label_data: LabelData) -> bool:
    """Print a label with the given label data.

    Args:
    ----
        label_data (LabelData): The complete label data.

    Returns:
    -------
        bool: True if the label printing process is successful, False otherwise.

    """
    pdf_path = create_freedomlac_pdf(
        output_filename="temp.pdf",
        lotto=label_data.batch,
        scadenza=label_data.due_date,
        pwr=label_data.lens_specs.left.pwr,
    )

    return print_pdf(pdf_path)
