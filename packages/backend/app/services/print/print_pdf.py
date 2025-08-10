"""Module for printing PDF files."""

from __future__ import annotations

import os
from pathlib import Path


def print_label_pdf(
    file_path: str,
    file_name: str | None = None,
) -> bool:
    """Print a PDF file to a specified printer.

    Args:
    ----
        file_path (str): The path to the PDF file to be printed.
        file_name: str | None = None: The filename to be used in case
        of file not found.

    Returns:
    -------
        bool: True if the printing command is constructed (and potentially executed),
        False otherwise.

    """
    pdf_file = Path(f"{file_path}")

    if not pdf_file.exists():
        path_error_message = f" at path {file_name}." if file_name is not None else ""
        custom_error_message = f"File not found{path_error_message}."
        raise FileNotFoundError(custom_error_message)
    print("Inside printing method")
    return True
    command = "lpr"
    printer_name = "-P SN_420B"
    layout_options = "-o PageSize=Custom.50x30mm -o orientation-requested=3"

    command_to_run = f"{command} {printer_name} {layout_options} {file_name}"
    print(command_to_run)  # noqa: T201

    # The following lines are commented out because they interact with the system's
    # printer and are not suitable for environments without a printer.
    printer = os.popen(command_to_run, "w")  # noqa: S605
    printer.close()

    return True
