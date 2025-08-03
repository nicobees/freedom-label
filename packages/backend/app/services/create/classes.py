"""Concrete classes for the pdf template."""

from __future__ import annotations

from app.models import LabelData
from app.services.create.models import LabelTemplate

# Defined at the module level, after the class definitions


def _select_class(left: bool, right: bool) -> type[LabelTemplate]:
    """Select the template class based on whether one or two lenses are needed.

    Args:
    ----
        left (bool): Whether the left lens is present.
        right (bool): Whether the right lens is present.

    Returns:
    -------
        type[LabelTemplate]: The selected template class.

    """
    class_name = "DoubleLensTemplate" if left and right else "SingleLensTemplate"
    return TEMPLATE_MAP[class_name]


def select_template(
    label_data: LabelData,
    left: bool,
    right: bool,
) -> LabelTemplate:
    """Select and instantiate the appropriate template.

    Based on whether one or two lenses are needed.

    Args:
    ----
        label_data (LabelData): The data for the label.
        left (bool): Whether the left lens is present.
        right (bool): Whether the right lens is present.

    Raises:
    ------
        TypeError: If the selected template is not a subclass of LabelTemplate.

    Returns:
    -------
        LabelTemplate: An instance of the selected template.

    """
    template_class = _select_class(left=left, right=right)

    if not issubclass(template_class, LabelTemplate):
        raise TypeError
    return template_class(label_data=label_data)


class SingleLensTemplate(LabelTemplate):
    """Concrete implementation of Template for single lens labels."""

    def add_patient_section(self) -> tuple[float, float]:
        """Add the patient information section to the PDF.

        This method should be implemented by subclasses to add patient-specific
        details to the label.

        Returns
        -------
            tuple[float, float]: A tuple containing the x and y coordinates of
                the bottom-right corner of the patient section.

        """
        # Patient info heading
        self.pdf.set_x(self.pdf.l_margin)
        self.pdf.set_font("openSansCondensedRegular", "", 5)
        patient_info_heading = "Disp. medico su misura per:"
        self.pdf.cell(
            18,
            2,
            patient_info_heading,
            align="L",
            border=self.debug_border,
            new_x="LMARGIN",
            new_y="NEXT",
        )

        # Patient info
        self.pdf.set_font("openSansBold", "", 8)
        patient_info_name = self.label_data.patient_info.name
        patient_info_surname = self.label_data.patient_info.surname
        patient_info_line_height = 3
        self.pdf.multi_cell(
            w=23,
            h=patient_info_line_height,
            text=f"{patient_info_name}\n{patient_info_surname}",
            align="L",
            border=self.debug_border,
            new_x="RIGHT",
            new_y="TOP",
        )

        patient_info_x_right = self.pdf.get_x()
        patient_info_y_top = self.pdf.get_y()
        patient_info_lines_amount = 2

        self.pdf.set_y(
            patient_info_y_top
            + (patient_info_line_height * patient_info_lines_amount)
            + 0.5,
        )

        return patient_info_x_right, patient_info_y_top

    def add_production_info(self) -> None:
        """Add the production information section to the PDF.

        This method should be implemented by subclasses to add production
        details such as serial numbers, dates, etc.
        """
        # Lot number
        self.pdf.set_font("openSansCondensedRegular", "", 6)
        self.pdf.cell(
            w=5,
            h=2.2,
            text="Lotto: ",
            align="L",
            border=self.debug_border,
            new_x="RIGHT",
            new_y="LAST",
        )

        self.pdf.set_font("openSansCondensedRegular", "", 7.5)
        self.pdf.cell(
            w=18,
            h=2.5,
            text=self.label_data.batch,
            align="L",
            border=self.debug_border,
            new_x="LMARGIN",
            new_y="NEXT",
        )

        # Expiration date
        self.pdf.set_font("openSansCondensedRegular", "", 6)
        self.pdf.cell(
            w=9,
            h=2.2,
            text="Scadenza: ",
            align="L",
            border=self.debug_border,
            new_x="RIGHT",
            new_y="LAST",
        )

        self.pdf.set_font("openSansBold", "", 8)
        self.pdf.cell(
            w=14,
            h=2.5,
            text=self.label_data.due_date,
            align="L",
            border=self.debug_border,
            new_x="LMARGIN",
            new_y="NEXT",
        )

    def add_company_info(self) -> None:
        """Add the company information section to the PDF.

        This method should be implemented by subclasses to add company-specific
        details such as address, contact information, etc.
        """
        self.pdf.set_font("openSansRegular", "", 4)
        company_name = self.producer_name.capitalize()
        self.pdf.cell(
            w=10,
            h=2.5,
            text="Prodotto da:",
            align="L",
            border=self.debug_border,
            new_x="RIGHT",
            new_y="LAST",
        )

        self.pdf.set_font("openSansRegular", "", 5)
        self.pdf.cell(
            w=13,
            h=2.5,
            text=f"{company_name}",
            align="L",
            border=self.debug_border,
            new_x="LMARGIN",
            new_y="NEXT",
        )

    def add_eye_specifications(
        self,
        patient_info_x_right: float,
        patient_info_y_top: float,
    ) -> None:
        """Add the eye specifications section to the PDF.

        This method should be implemented by subclasses to add detailed eye
        prescription information.

        Args:
        ----
            patient_info_x_right (float): The x-coordinate of the right edge of
                the patient information section.
            patient_info_y_top (float): The y-coordinate of the top edge of the
                patient information section.

        """
        self.pdf.set_y(patient_info_y_top)
        self.pdf.set_x(patient_info_x_right)

        # Eye designation
        self.pdf.set_font("openSansBold", "", 20)
        left_right = "OS"
        self.pdf.cell(
            10,
            8,
            left_right,
            align="C",
            border=self.debug_border,
            new_x="RIGHT",
            new_y="LAST",
        )

        table_data = (
            ("BC:", self.label_data.lens_specs.left.bc),
            ("DIA:", self.label_data.lens_specs.left.dia),
            ("Pwr:", self.label_data.lens_specs.left.pwr),
            ("Cyl:", self.label_data.lens_specs.left.cyl),
            ("AX:", self.label_data.lens_specs.left.ax),
            ("ADD:", self.label_data.lens_specs.left.add),
            ("SAG:", self.label_data.lens_specs.left.sag),
        )

        self.pdf.set_font("openSansRegular", "", 7)
        table_borders = "NONE" if not self.debug_border else "ALL"
        self.pdf.set_x(self.pdf.get_x() + 1)

        with self.pdf.table(
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


class DoubleLensTemplate(LabelTemplate):
    """Concrete implementation of Template for double lens labels."""

    def add_patient_section(self) -> tuple[float, float]:
        """Add the patient information section to the PDF.

        This method should be implemented by subclasses to add patient-specific
        details to the label.

        Returns
        -------
            tuple[float, float]: A tuple containing the x and y coordinates of
                the bottom-right corner of the patient section.

        """
        # Patient info heading
        self.pdf.set_x(self.pdf.l_margin)
        self.pdf.set_font("openSansCondensedRegular", "", 5)
        patient_info_heading = "Disp. medico su misura per:"
        self.pdf.cell(
            18,
            2,
            patient_info_heading,
            align="L",
            border=self.debug_border,
            new_x="LMARGIN",
            new_y="NEXT",
        )

        # Patient info
        self.pdf.set_font("openSansBold", "", 8)
        patient_info_name = self.label_data.patient_info.name
        patient_info_surname = self.label_data.patient_info.surname
        patient_info_line_height = 3
        self.pdf.multi_cell(
            w=23,
            h=patient_info_line_height,
            text=f"{patient_info_name}\n{patient_info_surname}",
            align="L",
            border=self.debug_border,
            new_x="RIGHT",
            new_y="TOP",
        )

        patient_info_x_right = self.pdf.get_x()
        patient_info_y_top = self.pdf.get_y()
        patient_info_lines_amount = 2

        self.pdf.set_y(
            patient_info_y_top
            + (patient_info_line_height * patient_info_lines_amount)
            + 0.5,
        )

        return patient_info_x_right, patient_info_y_top

    def add_production_info(self) -> None:
        """Add the production information section to the PDF.

        This method should be implemented by subclasses to add production
        details such as serial numbers, dates, etc.
        """
        # Lot number
        self.pdf.set_font("openSansCondensedRegular", "", 6)
        self.pdf.cell(
            w=5,
            h=2.2,
            text="Lotto: ",
            align="L",
            border=self.debug_border,
            new_x="RIGHT",
            new_y="LAST",
        )

        self.pdf.set_font("openSansCondensedRegular", "", 7.5)
        self.pdf.cell(
            w=18,
            h=2.5,
            text=self.label_data.batch,
            align="L",
            border=self.debug_border,
            new_x="LMARGIN",
            new_y="NEXT",
        )

        # Expiration date
        self.pdf.set_font("openSansCondensedRegular", "", 6)
        self.pdf.cell(
            w=9,
            h=2.2,
            text="Scadenza: ",
            align="L",
            border=self.debug_border,
            new_x="RIGHT",
            new_y="LAST",
        )

        self.pdf.set_font("openSansBold", "", 8)
        self.pdf.cell(
            w=14,
            h=2.5,
            text=self.label_data.due_date,
            align="L",
            border=self.debug_border,
            new_x="LMARGIN",
            new_y="NEXT",
        )

    def add_company_info(self) -> None:
        """Add the company information section to the PDF.

        This method should be implemented by subclasses to add company-specific
        details such as address, contact information, etc.
        """
        self.pdf.set_font("openSansRegular", "", 4)
        company_name = self.producer_name.capitalize()
        self.pdf.cell(
            w=10,
            h=2.5,
            text="Prodotto da:",
            align="L",
            border=self.debug_border,
            new_x="RIGHT",
            new_y="LAST",
        )

        self.pdf.set_font("openSansRegular", "", 5)
        self.pdf.cell(
            w=13,
            h=2.5,
            text=f"{company_name}",
            align="L",
            border=self.debug_border,
            new_x="LMARGIN",
            new_y="NEXT",
        )

    def add_eye_specifications(
        self,
        patient_info_x_right: float,
        patient_info_y_top: float,
    ) -> None:
        """Add the eye specifications section to the PDF.

        This method should be implemented by subclasses to add detailed eye
        prescription information.

        Args:
        ----
            patient_info_x_right (float): The x-coordinate of the right edge of
                the patient information section.
            patient_info_y_top (float): The y-coordinate of the top edge of the
                patient information section.

        """
        self.pdf.set_y(patient_info_y_top)
        self.pdf.set_x(patient_info_x_right)

        # Eye designation
        self.pdf.set_font("openSansBold", "", 20)
        left_right = "OS"
        self.pdf.cell(
            10,
            8,
            left_right,
            align="C",
            border=self.debug_border,
            new_x="RIGHT",
            new_y="LAST",
        )

        table_data = (
            ("BC:", self.label_data.lens_specs.left.bc),
            ("DIA:", self.label_data.lens_specs.left.dia),
            ("Pwr:", self.label_data.lens_specs.left.pwr),
            ("Cyl:", self.label_data.lens_specs.left.cyl),
            ("AX:", self.label_data.lens_specs.left.ax),
            ("ADD:", self.label_data.lens_specs.left.add),
            ("SAG:", self.label_data.lens_specs.left.sag),
        )

        self.pdf.set_font("openSansRegular", "", 7)
        table_borders = "NONE" if not self.debug_border else "ALL"
        self.pdf.set_x(self.pdf.get_x() + 1)

        with self.pdf.table(
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


TEMPLATE_MAP = {
    "SingleLensTemplate": SingleLensTemplate,
    "DoubleLensTemplate": DoubleLensTemplate,
}
