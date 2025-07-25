"""Module for handling printing services."""

from app.print.create_pdf import create_freedomlac_pdf
from app.print.print_pdf import print_pdf


async def print_label(patient_name: str, pwr: str, due_date: str) -> bool:
    """Print a label with the given product information.

    Args:
    ----
        patient_name (str): The patient name
        pwr (str): The power value.
        due_date (str): The due date.

    Returns:
    -------
        bool: True if the label printing process is successful, False otherwise.

    """
    label_details: dict[str, str] = {
        "name": patient_name,
        "lotto": "AS183420-12345",
        "scadenza": due_date,
        "bc": "08,40",
        "dia": "14,40",
        "pwr": pwr,
        "cyl": "-03,50",
        "ax": "118",
        "add": "+01,50",
        "sag": "01,50",
    }

    pdf_path = create_freedomlac_pdf(
        output_filename="temp.pdf",
        label_details=label_details,
    )

    print(f"Printing label for {patient_name}, {pwr}, {due_date}")  # noqa: T201
    print(f"Pdf path: {pdf_path}")  # noqa: T201

    return print_pdf(pdf_path)
