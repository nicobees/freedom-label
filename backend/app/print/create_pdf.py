import sys
import os
from fpdf import FPDF

producer_name = "FREEDOMLAC"

DEBUG_BORDER = False


def create_freedomlac_pdf(
    output_filename, name, lotto, scadenza, bc, dia, pwr, cyl, ax, add, sag
):
    """
    Create a FreedomLac PDF label with the specified dimensions and data.

    Args:
        output_filename (str): Name of the output PDF file
        name (str): Patient name
        lotto (str): Lot number
        scadenza (str): Expiration date
        bc (str): BC value
        dia (str): DIA value
        pwr (str): Power value
        cyl (str): Cylinder value
        ax (str): Axis value
        add (str): Addition value
        sag (str): Sagittal value
    """
    # Create PDF with landscape orientation, 50mm x 30mm
    # Format is (height, width) = (30, 50)
    pdf = FPDF(orientation="L", unit="mm", format=(30, 50))
    pdf.set_margins(left=1, top=1)  # seems is not taking any effect with small values

    # Disable automatic page breaks for small labels
    pdf.set_auto_page_break(auto=False, margin=1)

    pdf.c_margin = 1

    # Get the absolute path to the fonts directory
    current_dir = os.path.dirname(__file__)
    font_dir = os.path.join(current_dir, "fonts")

    pdf.add_font("openSansRegular", "", os.path.join(font_dir, "OpenSans-Regular.ttf"))
    pdf.add_font("openSansBold", "", os.path.join(font_dir, "OpenSans-Bold.ttf"))
    pdf.add_font(
        "openSansCondensedRegular",
        "",
        os.path.join(font_dir, "OpenSans_Condensed-Regular.ttf"),
    )
    pdf.add_font(
        "openSansCondensedBold",
        "",
        os.path.join(font_dir, "OpenSans_Condensed-Bold.ttf"),
    )
    # pdf.set_char_spacing(-0.5)
    pdf.add_page()

    # pdf.rect(pdf.l_margin, pdf.t_margin, pdf.w - pdf.l_margin - pdf.r_margin, pdf.h - pdf.t_margin - pdf.b_margin)

    # cell horizontal padding

    cols = pdf.text_columns(text_align="J", ncols=2)

    # Header - FREEDOM LAC title (top left, reduced left margin)
    pdf.set_font("openSansCondensedBold", "", 11)
    pdf.set_xy(pdf.l_margin, pdf.t_margin)
    pdf.cell(w=23, h=3, text=producer_name, align="C", border=DEBUG_BORDER)

    # Header - Product code (top right, smaller font to prevent overflow)
    pdf.set_font("openSansCondensedRegular", "", 8)
    # pdf.set_xy(25, 1.5)
    product_description = "MED-04-PRISMA-(BitHD)\n01234567890123456789"
    pdf.c_margin = 0
    pdf.multi_cell(w=25, h=3, text=product_description, align="L", border=DEBUG_BORDER)

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
    # pdf.multi_cell(w=23, h=3, text=patient_info, align='L', border=DEBUG_BORDER, new_x="LMARGIN", new_y="NEXT")
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
        + 0.5
    )

    # Production number info
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
        text=f"{lotto}",
        align="L",
        border=DEBUG_BORDER,
        new_x="LMARGIN",
        new_y="NEXT",
    )

    # Due date
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
        text=f"{scadenza}",
        align="L",
        border=DEBUG_BORDER,
        new_x="LMARGIN",
        new_y="NEXT",
    )

    # Company information
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

    pdf.set_y(patient_info_y_top)
    pdf.set_x(patient_info_x_right)

    # Left-Right
    pdf.set_font("openSansBold", "", 20)
    left_right = "OS"
    pdf.cell(
        10, 8, left_right, align="C", border=DEBUG_BORDER, new_x="RIGHT", new_y="LAST"
    )

    TABLE_DATA = (
        ("BC:", "08,40"),
        ("DIA:", "14,40"),
        ("Pwr:", "+01,50"),
        ("Cyl:", "-03,50"),
        ("AX:", "120"),
        ("ADD:", "+01,50"),
        ("SAG:", "01,50"),
    )

    pdf.set_font("openSansRegular", "", 7)

    table_borders = "NONE" if DEBUG_BORDER == False else "ALL"

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
        for data_row in TABLE_DATA:
            row = table.row()
            for datum in data_row:
                row.cell(datum)

    # Save the PDF
    output_local_path = "output"
    output_path = os.path.join(current_dir, output_local_path, output_filename)
    pdf.output(output_path)
    print(f"PDF created successfully: {output_filename}")

    return output_path
