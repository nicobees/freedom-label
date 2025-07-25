"""Module for printing PDF files."""


def print_pdf(
    file_name: str,
) -> bool:
    """Print a PDF file to a specified printer.

    Args:
    ----
        file_name (str): The path to the PDF file to be printed.

    Returns:
    -------
        bool: True if the printing command is constructed (and potentially executed),
        False otherwise.

    """
    command = "lpr"
    printer_name = "-P SN_420B"
    layout_options = "-o PageSize=Custom.50x30mm -o orientation-requested=3"

    command_to_run = f"{command} {printer_name} {layout_options} {file_name}"
    print(command_to_run)  # noqa: T201

    # The following lines are commented out because they interact with the system's
    # printer and are not suitable for environments without a printer.
    # printer = os.popen(commandToRun, 'w')  # noqa: ERA001
    # printer.close()  # noqa: ERA001

    return True
