"""Module for creating PDF labels."""

from __future__ import annotations

from pathlib import Path

from fpdf import FPDF

producer_name = "FREEDOMLAC"

DEBUG_BORDER = False


# name (str): Patient name
# lotto (str): Lot number
# scadenza (str): Expiration date
# bc (str): BC value
# dia (str): DIA value
# pwr (str): Power value
# cyl (str): Cylinder value
# ax (str): Axis value
# add (str): Addition value
# sag (str): Sagittal value


def _setup_pdf() -> FPDF:
    """Set up PDF with proper configuration and fonts."""
    pdf = FPDF(orientation="L", unit="mm", format=(30, 50))
    pdf.set_margins(left=1, top=1)
    pdf.set_auto_page_break(auto=False, margin=1)
    pdf.c_margin = 1

    # Load fonts
    current_dir = Path(__file__).parent
    font_dir = current_dir / "fonts"
    pdf.add_font("openSansRegular", "", font_dir / "OpenSans-Regular.ttf")
    pdf.add_font("openSansBold", "", font_dir / "OpenSans-Bold.ttf")
    pdf.add_font(
        "openSansCondensedRegular",
        "",
        font_dir / "OpenSans_Condensed-Regular.ttf",
    )
    pdf.add_font("openSansCondensedBold", "", font_dir / "OpenSans_Condensed-Bold.ttf")

    pdf.add_page()
    pdf.text_columns(text_align="J", ncols=2)

    return pdf


def _add_header_section(pdf: FPDF) -> None:
    """Add producer name and product description header."""
    # Producer name
    pdf.set_font("openSansCondensedBold", "", 11)
    pdf.set_xy(pdf.l_margin, pdf.t_margin)
    pdf.cell(w=23, h=3, text=producer_name, align="C", border=DEBUG_BORDER)

    # Product description
    pdf.set_font("openSansCondensedRegular", "", 8)
    product_description = "MED-04-PRISMA-(BitHD)\n01234567890123456789"
    pdf.c_margin = 0
    pdf.multi_cell(w=25, h=3, text=product_description, align="L", border=DEBUG_BORDER)


def _add_patient_section(pdf: FPDF) -> tuple[float, float]:
    """Add patient information section and return positioning info."""
    # Patient info heading
    pdf.set_x(pdf.l_margin)
    pdf.set_font("openSansCondensedRegular", "", 5)
    patient_info_heading = "Disp. medico su misura per:"
    pdf.cell(
        18,
        2,
        patient_info_heading,
        align="L",
        border=DEBUG_BORDER,
        new_x="LMARGIN",
        new_y="NEXT",
    )

    # Patient info
    pdf.set_font("openSansBold", "", 8)
    patient_info = "Gabriele Cara\n01234567890123"
    patient_info_line_height = 3
    pdf.multi_cell(
        w=23,
        h=patient_info_line_height,
        text=patient_info,
        align="L",
        border=DEBUG_BORDER,
        new_x="RIGHT",
        new_y="TOP",
    )

    patient_info_x_right = pdf.get_x()
    patient_info_y_top = pdf.get_y()
    patient_info_lines_amount = 2

    pdf.set_y(
        patient_info_y_top
        + (patient_info_line_height * patient_info_lines_amount)
        + 0.5,
    )

    return patient_info_x_right, patient_info_y_top


def _add_production_info(pdf: FPDF, label_details: dict[str, str]) -> None:
    """Add lot number and expiration date information."""
    # Lot number
    pdf.set_font("openSansCondensedRegular", "", 6)
    pdf.cell(
        w=5,
        h=2.2,
        text="Lotto: ",
        align="L",
        border=DEBUG_BORDER,
        new_x="RIGHT",
        new_y="LAST",
    )

    pdf.set_font("openSansCondensedRegular", "", 7.5)
    pdf.cell(
        w=18,
        h=2.5,
        text=f"{label_details['lotto']}",
        align="L",
        border=DEBUG_BORDER,
        new_x="LMARGIN",
        new_y="NEXT",
    )

    # Expiration date
    pdf.set_font("openSansCondensedRegular", "", 6)
    pdf.cell(
        w=9,
        h=2.2,
        text="Scadenza: ",
        align="L",
        border=DEBUG_BORDER,
        new_x="RIGHT",
        new_y="LAST",
    )

    pdf.set_font("openSansBold", "", 8)
    pdf.cell(
        w=14,
        h=2.5,
        text=f"{label_details['scadenza']}",
        align="L",
        border=DEBUG_BORDER,
        new_x="LMARGIN",
        new_y="NEXT",
    )


def _add_company_info(pdf: FPDF) -> None:
    """Add company information section."""
    pdf.set_font("openSansRegular", "", 4)
    pdf.cell(
        w=23,
        h=2,
        text="Prodotto da:",
        align="L",
        border=DEBUG_BORDER,
        new_x="LMARGIN",
        new_y="NEXT",
    )

    pdf.set_font("openSansRegular", "", 5)
    company_info = (
        "FREEDOM LAC S.r.L.\nViale Sant'Avendrace, 265\n09122 Cagliari - CA - Italy"
    )
    pdf.multi_cell(
        w=23,
        h=2,
        text=company_info,
        align="L",
        border=DEBUG_BORDER,
        new_x="LMARGIN",
        new_y="NEXT",
    )


def _add_eye_specifications(
    pdf: FPDF,
    patient_info_x_right: float,
    patient_info_y_top: float,
) -> None:
    """Add eye designation and specifications table."""
    pdf.set_y(patient_info_y_top)
    pdf.set_x(patient_info_x_right)

    # Eye designation
    pdf.set_font("openSansBold", "", 20)
    left_right = "OS"
    pdf.cell(
        10,
        8,
        left_right,
        align="C",
        border=DEBUG_BORDER,
        new_x="RIGHT",
        new_y="LAST",
    )

    # Specifications table
    table_data = (
        ("BC:", "08,40"),
        ("DIA:", "14,40"),
        ("Pwr:", "+01,50"),
        ("Cyl:", "-03,50"),
        ("AX:", "120"),
        ("ADD:", "+01,50"),
        ("SAG:", "01,50"),
    )

    pdf.set_font("openSansRegular", "", 7)
    table_borders = "NONE" if not DEBUG_BORDER else "ALL"
    pdf.set_x(pdf.get_x() + 1)

    with pdf.table(
        width=14,
        col_widths=(5, 7),
        line_height=2.8,
        align="L",
        first_row_as_headings=False,
        v_align="M",
        text_align="C",
        borders_layout=table_borders,
    ) as table:
        for data_row in table_data:
            row = table.row()
            for datum in data_row:
                row.cell(datum)


def create_freedomlac_pdf(output_filename: str, label_details: dict[str, str]) -> str:
    """Create a FreedomLac PDF label with the specified dimensions and data.

    Args:
    ----
        output_filename (str): Name of the output PDF file
        label_details (dict[str, str]): Dictionary containing label details

    Returns:
    -------
        str: The absolute path to the created PDF file.

    """
    # Set up PDF and fonts
    pdf = _setup_pdf()

    # Add all sections
    _add_header_section(pdf)
    patient_info_x_right, patient_info_y_top = _add_patient_section(pdf)
    _add_production_info(pdf, label_details)
    _add_company_info(pdf)
    _add_eye_specifications(pdf, patient_info_x_right, patient_info_y_top)

    # Save PDF
    current_dir = Path(__file__).parent
    output_local_path = "output"
    output_path = current_dir / output_local_path / output_filename
    pdf.output(output_path)

    print(f"PDF created successfully: {output_filename}")  # noqa: T201
    print(f"{label_details.values()}")  # noqa: T201

    return str(output_path)
