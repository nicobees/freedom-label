"""Concrete classes for the pdf template."""

from __future__ import annotations

from typing import TYPE_CHECKING

from app.services.create.models import LabelTemplate

if TYPE_CHECKING:
    from app.models import LabelData

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
    left: bool,
    right: bool,
) -> type[LabelTemplate]:
    """Select and return the appropriate template class.

    Based on whether one or two lenses are needed.

    Args:
    ----
        left (bool): Whether the left lens is present.
        right (bool): Whether the right lens is present.


    Raises:
    ------
        TypeError: If the selected template is not a subclass of LabelTemplate.

    Returns:
    -------
        type[LabelTemplate]: The class of the selected template.

    """
    template_class = _select_class(left=left, right=right)

    if not issubclass(template_class, LabelTemplate):
        raise TypeError
    return template_class


class SingleLensTemplate(LabelTemplate):
    """Concrete implementation of Template for single lens labels."""

    def add_patient_section(self, lower_margin: float = 2) -> tuple[float, float]:
        """Add the patient information section to the PDF.

        This method should be implemented by subclasses to add patient-specific
        details to the label.

        Returns
        -------
            tuple[float, float]: A tuple containing the x and y coordinates of
                the bottom-right corner of the patient section.

        """
        current_y = self.pdf.get_y()
        top_margin = 1

        self.pdf.set_y(
            current_y + top_margin,
        )

        # Patient info heading
        self.pdf.set_x(self.pdf.l_margin)
        self.pdf.set_font("openSansCondensedRegular", "", 5)
        patient_info_heading = "Disp. medico su misura per:"
        self.pdf.cell(
            18,
            2,
            patient_info_heading,
            align="L",
            border=self.show_borders,
            new_x="LMARGIN",
            new_y="NEXT",
        )

        # Patient info
        self.pdf.set_font("openSansBold", "", 8)
        patient_info_name = self.label_data.patient_info.name.capitalize()
        patient_info_surname = self.label_data.patient_info.surname.capitalize()
        patient_info_line_height = 3
        self.pdf.multi_cell(
            w=23,
            h=patient_info_line_height,
            text=f"{patient_info_name}\n{patient_info_surname}",
            align="L",
            border=self.show_borders,
            new_x="RIGHT",
            new_y="TOP",
        )

        patient_info_x_right = self.pdf.get_x()
        patient_info_y_top = self.pdf.get_y()
        patient_info_lines_amount = 2

        self.pdf.set_y(
            patient_info_y_top
            + (patient_info_line_height * patient_info_lines_amount)
            + lower_margin,
        )

        return patient_info_x_right, patient_info_y_top

    def add_production_info(self, lower_margin: float = 4) -> None:
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
            border=self.show_borders,
            new_x="RIGHT",
            new_y="LAST",
        )

        self.pdf.set_font("openSansCondensedRegular", "", 7.5)
        self.pdf.cell(
            w=18,
            h=2.5,
            text=self.label_data.batch,
            align="L",
            border=self.show_borders,
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
            border=self.show_borders,
            new_x="RIGHT",
            new_y="LAST",
        )

        self.pdf.set_font("openSansBold", "", 8)
        self.pdf.cell(
            w=14,
            h=2.5,
            text=self.label_data.due_date,
            align="L",
            border=self.show_borders,
            new_x="LMARGIN",
            new_y="NEXT",
        )

        production_info_y_lower = self.pdf.get_y()

        self.pdf.set_y(
            production_info_y_lower + lower_margin,
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
            border=self.show_borders,
            new_x="RIGHT",
            new_y="LAST",
        )

        self.pdf.set_font("openSansRegular", "", 5)
        self.pdf.cell(
            w=13,
            h=2.5,
            text=f"{company_name}",
            align="L",
            border=self.show_borders,
            new_x="LMARGIN",
            new_y="NEXT",
        )

    def _get_left_right_spec(self) -> tuple[str, str]:
        """Get the specification for the left or right eye.

        Returns
        -------
            tuple[str, str]: A tuple containing the side ("left" or "right")
                and the corresponding label ("OS" or "OD").

        """
        label = "OS" if self.label_data.lens_specs.left is not None else "OD"
        left_right = "left" if self.label_data.lens_specs.left is not None else "right"
        return (left_right, label)

    def add_lens_specifications(
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

        # Right-Left spec
        self.pdf.set_font("openSansBold", "", 20)
        (left_or_right, label) = self._get_left_right_spec()
        self.pdf.cell(
            10,
            8,
            label,
            align="C",
            border=self.show_borders,
            new_x="RIGHT",
            new_y="LAST",
        )

        lens_spec_data = getattr(self.label_data.lens_specs, left_or_right, None) or {}

        table_data = (
            ("BC:", getattr(lens_spec_data, "bc", "")),
            ("DIA:", getattr(lens_spec_data, "dia", "")),
            ("Pwr:", getattr(lens_spec_data, "pwr", "")),
            ("Cyl:", getattr(lens_spec_data, "cyl", "")),
            ("AX:", getattr(lens_spec_data, "ax", "")),
            ("ADD:", getattr(lens_spec_data, "add", "")),
            ("SAG:", getattr(lens_spec_data, "sag", "")),
        )

        self.pdf.set_font("openSansRegular", "", 7)
        table_borders = "NONE" if not self.show_borders else "ALL"
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

    def __init__(
        self,
        label_data: LabelData,
        show_borders: bool = True,
    ) -> None:
        """Initialise the DoubleLensTemplate.

        Args:
        ----
            label_data (LabelData): The data for the label.
            show_borders (bool, optional): Whether to show borders. Defaults to True.

        """
        super().__init__(label_data=label_data, show_borders=show_borders)
        self._page_width = 48
        self._lens_spec_width = 14
        self._patient_info_anagraphic_max_length = 18

    def _compute_patient_info_anagraphic(self, name: str, surname: str) -> str:
        """Compute the patient's anagraphic information.

        If the name and surname are too long, it will be truncated.

        Args:
        ----
            name (str): The patient's name.
            surname (str): The patient's surname.

        Returns:
        -------
            str: The computed anagraphic information.

        """
        patient_info_anagraphic = f"{name} {surname}"
        if len(patient_info_anagraphic) <= self._patient_info_anagraphic_max_length:
            return patient_info_anagraphic

        short_name = name.split(" ", maxsplit=1)[0]
        short_name_value = f"{short_name} {surname}"
        if len(short_name_value) <= self._patient_info_anagraphic_max_length:
            return short_name_value

        only_first_char_name_value = f"{short_name[0]}. {surname}"

        if len(only_first_char_name_value) <= self._patient_info_anagraphic_max_length:
            return only_first_char_name_value

        # this is result of:
        # 1 (first char of name)
        # + 1 (".", dot after first char of name)
        # + 1 (" ", space between name and surname)
        # + 1 ("." at the end of the trimmed surname)
        chars_to_remove = 4
        surname_max_length = self._patient_info_anagraphic_max_length - chars_to_remove

        return f"{only_first_char_name_value[0]}. {surname[:surname_max_length]}."

    def add_patient_section(
        self,
    ) -> None:
        """Add the patient information section to the PDF.

        This method should be implemented by subclasses to add patient-specific
        details to the label.

        Returns
        -------
            tuple[float, float]: A tuple containing the x and y coordinates of
                the bottom-right corner of the patient section.

        """
        current_y = self.pdf.get_y()
        top_margin = 0.5

        self.pdf.set_y(
            current_y + top_margin,
        )

        # Patient info heading
        self.pdf.set_x(self.pdf.l_margin)
        self.pdf.set_font("openSansCondensedRegular", "", 5)
        patient_info_heading = "Disp. medico su misura per:"
        self.pdf.cell(
            18,
            2,
            patient_info_heading,
            align="L",
            border=self.show_borders,
            new_x="RIGHT",
            new_y="LAST",
        )

        # Patient info
        self.pdf.set_font("openSansBold", "", 8)
        patient_info_name = self.label_data.patient_info.name.capitalize()
        patient_info_surname = self.label_data.patient_info.surname.capitalize()
        patient_info_anagraphic = self._compute_patient_info_anagraphic(
            name=patient_info_name,
            surname=patient_info_surname,
        )
        patient_info_line_height = 2
        self.pdf.cell(
            w=30,
            h=patient_info_line_height,
            text=patient_info_anagraphic,
            align="L",
            border=self.show_borders,
            new_x="LMARGIN",
            new_y="NEXT",
        )

    def _create_table_data(self, left_or_right: str) -> list[tuple[str, str]]:
        """Create the table data for the lens specifications.

        Args:
        ----
            left_or_right (str): The side of the lens ("left" or "right").

        Returns:
        -------
            list[tuple[str, str]]: The table data.

        """
        data = getattr(self.label_data.lens_specs, left_or_right, None) or {}

        return (
            (
                {"value": "BC:", "border": 1 | 4 if left_or_right == "left" else 4},
                {"value": data.bc, "border": 4 if left_or_right == "left" else 2 | 4},
            ),
            (
                {"value": "DIA:", "border": 1 if left_or_right == "left" else 0},
                {"value": data.dia, "border": 0 if left_or_right == "left" else 2},
            ),
            (
                {"value": "Pwr:", "border": 1 if left_or_right == "left" else 0},
                {"value": data.pwr, "border": 0 if left_or_right == "left" else 2},
            ),
            (
                {"value": "Cyl:", "border": 1},
                {"value": data.cyl, "border": 2},
            ),
            (
                {"value": "AX:", "border": 1},
                {"value": data.ax, "border": 2},
            ),
            (
                {"value": "ADD:", "border": 1},
                {"value": data.add, "border": 2},
            ),
            (
                {"value": "SAG:", "border": 1 | 8},
                {"value": data.sag, "border": 2 | 8},
            ),
        )

    def add_left_lens(self, lower_margin: float = 0.5) -> tuple[float, float] | None:
        """Add the left lens specifications section to the PDF."""
        self.pdf.set_font("openSansBold", "", 20)
        self.pdf.set_y(self.pdf.get_y() + lower_margin)

        table_data = self._create_table_data(left_or_right="left")

        self.pdf.set_font("openSansRegular", "", 7)
        table_borders = "NONE" if not self.show_borders else "ALL"

        left_lens_spec_x_left = self.pdf.get_x()
        left_lens_spec_x_right = left_lens_spec_x_left + self._lens_spec_width
        left_lens_spec_y_top = self.pdf.get_y()

        with self.pdf.table(
            width=self._lens_spec_width,
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
                    row.cell(datum["value"], border=datum["border"])

        return left_lens_spec_x_right, left_lens_spec_y_top

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
            border=self.show_borders,
            new_x="RIGHT",
            new_y="LAST",
        )

        self.pdf.set_font("openSansRegular", "", 5)
        self.pdf.cell(
            w=13,
            h=2.5,
            text=f"{company_name}",
            align="L",
            border=self.show_borders,
            new_x="LMARGIN",
            new_y="NEXT",
        )

    def add_lens_left_right(
        self,
        left_margin: float,
        top_margin: float,
    ) -> tuple[float, float] | None:
        """Add the left and right lens designation to the PDF.

        Args:
        ----
            left_margin (float): The left margin.
            top_margin (float): The top margin.

        Returns:
        -------
            tuple[float, float] | None: The x and y coordinates of the bottom-right
                corner of the section.

        """
        self.pdf.set_xy(left_margin, top_margin)

        # Eye designation
        self.pdf.set_font("openSansBold", "", 19)

        self.pdf.cell(
            w=10,
            h=8,
            text="OS",
            align="C",
            border="T,R,B",  # self.show_borders,
            new_x="RIGHT",
            new_y="LAST",
        )

        self.pdf.cell(
            w=10,
            h=8,
            text="OD",
            align="C",
            border="L,T,B",  # self.show_borders,
            new_x="RIGHT",
            new_y="NEXT",
        )

        return self.pdf.get_x(), self.pdf.get_y()

    def add_right_lens(
        self,
        left_margin: float,
        top_margin: float,
    ) -> None:
        """Add the right lens specifications section to the PDF."""
        self.pdf.set_font("openSansBold", "", 20)
        self.pdf.set_xy(left_margin, top_margin)

        table_data = self._create_table_data(left_or_right="right")

        self.pdf.set_font("openSansRegular", "", 7)
        table_borders = "NONE" if not self.show_borders else "ALL"

        with self.pdf.table(
            width=self._lens_spec_width,
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
                    row.cell(datum["value"], border=datum["border"])

    def add_production_info(self, left_margin: float, top_margin: float) -> None:
        """Add the production information section to the PDF.

        This method should be implemented by subclasses to add production
        details such as serial numbers, dates, etc.
        """
        additional_top_margin = 2
        additional_left_margin = 1

        current_left_margin = left_margin + additional_left_margin
        self.pdf.set_xy(
            current_left_margin,
            top_margin + additional_top_margin,
        )

        # Lot number
        self.pdf.set_font("openSansCondensedRegular", "", 6)
        self.pdf.cell(
            w=5,
            h=2.2,
            text="Lotto: ",
            align="L",
            border=self.show_borders,
            new_x="RIGHT",
            new_y="LAST",
        )

        self.pdf.set_font("openSansCondensedRegular", "", 7.5)
        self.pdf.cell(
            w=14,
            h=2.5,
            text=self.label_data.batch,
            align="L",
            border=self.show_borders,
            new_x="START",
            new_y="NEXT",
        )

        self.pdf.set_xy(current_left_margin, self.pdf.get_y() + additional_top_margin)

        # Expiration date
        self.pdf.set_font("openSansCondensedRegular", "", 6)
        self.pdf.cell(
            w=7.5,
            h=2.2,
            text="Scadenza: ",
            align="L",
            border=self.show_borders,
            new_x="RIGHT",
            new_y="LAST",
        )

        self.pdf.set_font("openSansBold", "", 8)
        self.pdf.cell(
            w=11.5,
            h=2.5,
            text=self.label_data.due_date,
            align="L",
            border=self.show_borders,
            new_x="START",
            new_y="NEXT",
        )

    def _get_left_right_spec(self) -> tuple[str, str]:
        """Get the specification for the left or right eye.

        Returns
        -------
            tuple[str, str]: A tuple containing the side ("left" or "right")
                and the corresponding label ("OS" or "OD").

        """
        label = "OS" if self.label_data.lens_specs.left is not None else "OD"
        left_right = "left" if self.label_data.lens_specs.left is not None else "right"
        return (left_right, label)

    def page_build(self) -> None:
        """Build the entire PDF page by calling the section methods.

        This method orchestrates the creation of the PDF by calling the
        various 'add' methods in the correct order.
        """
        self.page_setup(columns_amount=2)
        self.load_fonts()
        self.add_header_section()
        self.add_patient_section()
        left_spec_x_right, left_spec_y_top = self.add_left_lens()
        self.add_company_info()
        left_right_x_right, left_right_y_bottom = self.add_lens_left_right(
            left_spec_x_right,
            left_spec_y_top,
        )
        self.add_right_lens(left_right_x_right, left_spec_y_top)
        self.add_production_info(left_spec_x_right, left_right_y_bottom)


TEMPLATE_MAP = {
    "SingleLensTemplate": SingleLensTemplate,
    "DoubleLensTemplate": DoubleLensTemplate,
}
