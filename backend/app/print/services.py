from app.print.create_pdf import create_freedomlac_pdf
from app.print.print_pdf import print_pdf


async def print_label(patient_name: str, pwr: str, due_date: str):

    pdf_path = create_freedomlac_pdf(
        output_filename=f"temp.pdf",
        name=patient_name,
        lotto="AS183420-12345",
        scadenza=due_date,
        bc="08,40",
        dia="14,40",
        pwr=pwr,
        cyl="-03,50",
        ax="118",
        add="+01,50",
        sag="01,50",
    )

    print(f"Printing label for {patient_name}, {pwr}, {due_date}")
    print(f"Pdf path: {pdf_path}")

    print_result = print_pdf(pdf_path)

    return print_result
