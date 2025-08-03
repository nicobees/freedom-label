"""Module for handling printing services."""

from __future__ import annotations

import random
from datetime import datetime

from app.models import LabelData
from app.print.create_pdf import create_freedomlac_pdf
from app.print.print_pdf import print_pdf


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
    timestamp = datetime.now().strftime("%Y%m%d-%H%M%S")
    random_int = random.randint(1000, 9999)
    pdf_filename = f"{timestamp}_{random_int}.pdf"

    pdf_path = create_freedomlac_pdf(
        pdf_filename,
        label_data,
    )

    if print_disabled:
        return True  # Indicate success without printing

    return print_pdf(pdf_path)
