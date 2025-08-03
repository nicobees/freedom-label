"""Module for creating PDF labels."""

from __future__ import annotations

from pathlib import Path
from typing import TYPE_CHECKING

from fpdf import FPDF

from app.services.create.classes import select_template

if TYPE_CHECKING:
    from app.main import LabelData

DEBUG_BORDER = True

PRODUCER_NAME = "occhialeria"


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


def _add_header_section(
    pdf: FPDF,
    label_data: LabelData,
    producer_name: str = PRODUCER_NAME,
) -> None:
    """Add producer name and product description header."""
    # Producer name
    pdf.set_font("openSansCondensedBold", "", 11)
    pdf.set_xy(pdf.l_margin, pdf.t_margin)

    current_dir = Path(__file__).parent
    img_dir = current_dir / "img"

    img_width = 4
    img_height = 4
    pdf.image(img_dir / "logo.png", w=img_width, h=img_height, type="PNG")
    pdf.c_margin = 0
    pdf.set_xy(pdf.l_margin + img_width, pdf.t_margin)
    pdf.cell(w=20, h=3, text=producer_name.upper(), align="L", border=DEBUG_BORDER)

    # Product description
    pdf.set_font("openSansCondensedRegular", "", 8)

    pdf.c_margin = 0
    pdf.multi_cell(
        w=25,
        h=3,
        text=label_data.description,
        align="R",
        border=DEBUG_BORDER,
    )

    header_y_next = pdf.get_y()
    header_bottom_margin = 1

    pdf.set_y(
        header_y_next + header_bottom_margin,
    )


def _add_patient_section(
    pdf: FPDF,
    label_data: LabelData,
) -> tuple[float, float]:
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
    patient_info_name = label_data.patient_info.name
    patient_info_surname = label_data.patient_info.surname
    patient_info_line_height = 3
    pdf.multi_cell(
        w=23,
        h=patient_info_line_height,
        text=f"{patient_info_name}\n{patient_info_surname}",
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


def _add_production_info(pdf: FPDF, label_data: LabelData) -> None:
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
        text=label_data.batch,
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
        text=label_data.due_date,
        align="L",
        border=DEBUG_BORDER,
        new_x="LMARGIN",
        new_y="NEXT",
    )


def _add_company_info(pdf: FPDF) -> None:
    """Add company information section."""
    pdf.set_font("openSansRegular", "", 4)
    company_name = PRODUCER_NAME.capitalize()
    pdf.cell(
        w=10,
        h=2.5,
        text="Prodotto da:",
        align="L",
        border=DEBUG_BORDER,
        new_x="RIGHT",
        new_y="LAST",
    )

    pdf.set_font("openSansRegular", "", 5)
    pdf.cell(
        w=13,
        h=2.5,
        text=f"{company_name}",
        align="L",
        border=DEBUG_BORDER,
        new_x="LMARGIN",
        new_y="NEXT",
    )


def _add_eye_specifications(
    pdf: FPDF,
    patient_info_x_right: float,
    patient_info_y_top: float,
    label_data: LabelData,
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

    table_data = (
        ("BC:", label_data.lens_specs.left.bc),
        ("DIA:", label_data.lens_specs.left.dia),
        ("Pwr:", label_data.lens_specs.left.pwr),
        ("Cyl:", label_data.lens_specs.left.cyl),
        ("AX:", label_data.lens_specs.left.ax),
        ("ADD:", label_data.lens_specs.left.add),
        ("SAG:", label_data.lens_specs.left.sag),
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


def create_label_pdf(output_filename: str, label_data: LabelData) -> str:
    """Create a FreedomLac PDF label with the specified dimensions and data.

    Args:
    ----
        output_filename (str): Name of the output PDF file
        label_data (LabelData): The complete label data.

    Returns:
    -------
        str: The absolute path to the created PDF file.

    """
    # Select label template
    template_instance = select_template(
        label_data=label_data,
        left=label_data.lens_specs.left is not None,
        right=label_data.lens_specs.right is not None,
    )

    return template_instance.save_template_as_pdf(output_filename)
