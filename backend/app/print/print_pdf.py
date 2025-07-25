import os


def print_pdf(
    file_name,
    amount_of_copies=1,
):
    """Prints a PDF file to a specified printer.

    Args:
        file_name (str): The path to the PDF file to be printed.
        amount_of_copies (int, optional): The number of copies to print. Defaults to 1.
                                          (Note: This parameter is currently not used in the printing command.)

    Returns:
        bool: True if the printing command is constructed (and potentially executed), False otherwise.
    """
    command = "lpr"
    printerName = "-P SN_420B"
    layoutOptions = "-o PageSize=Custom.50x30mm -o orientation-requested=3"

    commandToRun = f"{command} {printerName} {layoutOptions} {file_name}"
    print(commandToRun)
    # printer = os.popen(commandToRun, 'w')
    # printer.close()

    return True
