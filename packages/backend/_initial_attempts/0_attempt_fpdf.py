from fpdf import FPDF

# simple example
# pdf = FPDF()
# pdf.add_page()
# pdf.set_font("helvetica", style="B", size=16)
# pdf.cell(40, 10, "Hello World!")
# pdf.output("output_pdf/1.pdf")

# example with custom size
pdf = FPDF(orientation="portrait", format=(50, 30), unit="mm")
pdf.add_page()
# pdf.set_margin(1)
pdf.set_margins(left=2, top=1)
pdf.set_auto_page_break(True, 1)
pdf.set_font("helvetica", size=8)
pdf.image("logo.png", w=12, h=12)
pdf.image("logo_text.png", w=25, h=8, x=15, y=1)
pdf.write(text="pdf header\n")
pdf.set_font("helvetica", size=4)
# pdf.write(text="This is a test from command line\n")
# pdf.write(text="And second test\n")
# pdf.write(text="And third test\n")
# pdf.write(text="And forth test")
x: float = 0
y: float = 0

cols = pdf.text_columns(text_align="J", ncols=2)

cols.write(text="This is a test\n")
cols.write(text="And second test\n")
# cols.write(text="And third test\n")
# cols.write(text="And forth test\n")
cols.new_column()
# cols.write(text="This is a test in new column\n")
cols.render()

x = pdf.get_x()
y = pdf.get_y()

with pdf.rotation(90, x=28, y=0):
    # pdf.text(text='After the logo image', x=x, y=y)
    cols.write(text="After the logo image")
    cols.render()


# with cols:
# cols.write(text="This is a test\n")
# cols.write(text="And second test\n")
# cols.write(text="And third test\n")
# cols.write(text="And forth test\n")

# cols.render()

# with pdf.rotation(90, x=28, y=0):
#     pdf.write(text='After the logo image')
# cols.render()
#     # with cols.paragraph(
#     #     text_align="J",
#     #     bottom_margin=5
#     # ) as paragraph:
#     #     paragraph.write(text="This is a test from command line\n")
#     #     paragraph.write(text="And second test\n")
#     #     paragraph.write(text="And third test\n")
#     #     paragraph.write(text="And forth test")


# with cols:
#     cols.write(text='After the logo image')

# pdf.write(text="pdf\nThis is a test from command line\nAnd second test\nAnd third test\nAnd forth test\n")
pdf.output("output_pdf/2_16.pdf")
