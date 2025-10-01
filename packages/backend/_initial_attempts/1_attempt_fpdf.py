from pathlib import Path

from fpdf import FPDF, Align

pdf = FPDF(orientation="portrait", format=(50, 30), unit="mm")
pdf.add_page()
pdf.set_margins(left=2, top=1)
pdf.set_auto_page_break(True, 1)
pdf.set_font("helvetica", size=8)
pdf.image("logo.png", w=12, h=12)
pdf.image("logo_text.png", w=25, h=8, x=15, y=1)
pdf.write(text="pdf header\n")
pdf.set_font("helvetica", size=4)

x: float = 0
y: float = 0

cols = pdf.text_columns(text_align="J", ncols=2)

cols.write(text="This is a test\n")
cols.write(text="And second test\n")
cols.new_column()
cols.render()

x = pdf.get_x()
y = pdf.get_y()

with pdf.rotation(90, x=28, y=0):
    cols.write(text="After the logo image")
    cols.render()

pdf.output("output_pdf/2_16.pdf")
