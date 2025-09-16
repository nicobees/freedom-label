"""Module with instances of Abstract classes for Single and Double lens templates."""

from __future__ import annotations

from pathlib import Path
from typing import TYPE_CHECKING, Any, cast

from fpdf.fonts import FontFace

from app.models import LensDataSpecs, TableData, TableDataFontSetting
from app.services.create.models import LabelTemplate, LensSpecType, LensSpecTypeBase

if TYPE_CHECKING:
    from app.models import LabelData

font_settings_mapping: dict[int, TableDataFontSetting] = {
    9: TableDataFontSetting(label=7, value=6),
    10: TableDataFontSetting(label=7, value=5),
    11: TableDataFontSetting(label=7, value=4.5),
}

font_settings_long_int_mapping: dict[int, TableDataFontSetting] = {
    7: TableDataFontSetting(label=6, value=6, align="C"),
    8: TableDataFontSetting(label=6, value=6),
    9: TableDataFontSetting(label=5, value=5),
}


def _select_lens_spec_type(left: bool, right: bool) -> LensSpecType:
    """Select and return the appropriate lens spec type.

    Based on whether one or two lenses are needed.

    Args:
    ----
        left (bool): Whether the left lens is present.
        right (bool): Whether the right lens is present.


    Returns:
    -------
        LensSpecType: The classtype of the selected lens.

    """
    if left and right:
        return LensSpecType.double

    if left:
        return LensSpecType.left

    return LensSpecType.right


def select_template(
    left: bool,
    right: bool,
) -> tuple[type[LabelTemplate[Any]], LensSpecType]:
    """Select and return the appropriate template class.

    Based on whether one or two lenses are needed

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
    lens_spec_type = _select_lens_spec_type(left=left, right=right)
    template_class = TEMPLATE_MAP[lens_spec_type]

    if not issubclass(template_class, LabelTemplate):
        raise TypeError
    return (template_class, lens_spec_type)


def _map_to_table_data(
    data: LensDataSpecs,
) -> list[tuple[str, str]]:
    """Create the table data for the lens specifications.

    Args:
    ----
        data (LensDataSpecs): The lens data specifications.

    Returns:
    -------
        list[tuple[str, str]]: The table data.

    """
    if data is None:
        return []

    has_bc_toric = data.bc_toric is not None

    bc_value = f"{data.bc}\n{data.bc_toric}(T)" if has_bc_toric else f"{data.bc}"

    return [
        ("BC:", bc_value),
        ("DIA:", data.dia),
        ("Pwr:", data.pwr),
        ("Cyl:", data.cyl),
        ("AX:", data.ax),
        ("ADD:", data.add),
        ("SAG:", data.sag),
    ]


def _get_two_column_data(
    data: LensDataSpecs,
    left_or_right: LensSpecTypeBase,
) -> list[tuple[TableData, TableData]]:
    """Create the table data for the lens specifications with borders.

    Args:
    ----
        data (LensDataSpecs): The lens data specifications.
        left_or_right (LensSpecTypeBase): The side of the lens ("left" or "right").

    Returns:
    -------
        list[tuple[TableData, TableData]]: The table data with borders.

    """
    if data is None:
        return []

    return [
        (
            TableData(
                value="BC:",
                border=1 | 4 if left_or_right.value == "left" else 4,
            ),
            TableData(
                value=data.bc,
                border=4 if left_or_right.value == "left" else 2 | 4,
            ),
        ),
        (
            TableData(value="DIA:", border=1 if left_or_right.value == "left" else 0),
            TableData(
                value=data.dia,
                border=0 if left_or_right.value == "left" else 2,
            ),
        ),
        (
            TableData(value="Pwr:", border=1 if left_or_right.value == "left" else 0),
            TableData(
                value=data.pwr,
                border=0 if left_or_right.value == "left" else 2,
            ),
        ),
        (
            TableData(value="Cyl:", border=1),
            TableData(value=data.cyl, border=2),
        ),
        (
            TableData(value="AX:", border=1),
            TableData(value=data.ax, border=2),
        ),
        (
            TableData(value="ADD:", border=1),
            TableData(value=data.add, border=2),
        ),
        (
            TableData(value="SAG:", border=1 | 8),
            TableData(value=data.sag, border=2 | 8),
        ),
    ]


def _get_row_data(
    value: str,
    label: str,
    borders: list[int | None],
    toric_value: str | None = None,
    font_size_mapping: dict[int, TableDataFontSetting] = font_settings_mapping,
) -> tuple[TableData, TableData, TableData]:
    """Create the table data for the row, with different result for toric lenses.

    Returns
    -------
        tuple[TableData, TableData, TableData]: The table data for the table data row.

    """
    if toric_value is not None:
        value = f"{value}/{toric_value}"
        value_length = len(value)

        font_size_default = TableDataFontSetting(label=7, value=7, align="L")
        smaller_font_size_mapping = font_size_mapping.get(
            value_length,
            font_size_default,
        )
        smaller_font_size_label = smaller_font_size_mapping.label
        smaller_font_size_value = smaller_font_size_mapping.value
        smaller_font_size_align = smaller_font_size_mapping.align
        smaller_font_label = FontFace(size_pt=smaller_font_size_label)  # type: ignore[arg-type]
        smaller_font_value = FontFace(size_pt=smaller_font_size_value)  # type: ignore[arg-type]

        return (
            TableData(
                value=f"{label}:",
                border=borders[0],
                align="C",
                colspan=1,
                style=smaller_font_label,
            ),
            TableData(
                value=value,
                border=borders[1],
                align=smaller_font_size_align,
                colspan=2,
                style=smaller_font_value,
            ),
            TableData(
                value=toric_value,
                skip=True,
            ),
        )

    return (
        TableData(
            value=f"{label}:",
            border=borders[0],
            colspan=2,
        ),
        TableData(
            value=value,
            skip=True,
        ),
        TableData(
            value=value,
            border=borders[2],
        ),
    )


def _get_column_data(
    data: LensDataSpecs,
    left_or_right: LensSpecTypeBase,
) -> list[tuple[TableData, TableData, TableData]]:
    """Create the table data for the lens specifications with borders.

    Args:
    ----
        data (LensDataSpecs): The lens data specifications.
        left_or_right (LensSpecTypeBase): The side of the lens ("left" or "right").

    Returns:
    -------
        list[tuple[TableData, TableData]]: The table data with borders.

    """
    if data is None:
        return []

    return [
        _get_row_data(
            value=data.bc,
            toric_value=data.bc_toric,
            label="BC",
            borders=[
                1 | 4 if left_or_right.value == "left" else 4,
                4 if left_or_right.value == "left" else 2 | 4,
                4 if left_or_right.value == "left" else 2 | 4,
            ],
        ),
        _get_row_data(
            value=data.dia,
            label="DIA",
            borders=[
                1 if left_or_right.value == "left" else 0,
                0 if left_or_right.value == "left" else 2,
                0 if left_or_right.value == "left" else 2,
            ],
        ),
        _get_row_data(
            value=data.pwr,
            label="Pwr",
            borders=[
                1 if left_or_right.value == "left" else 0,
                0 if left_or_right.value == "left" else 2,
                0 if left_or_right.value == "left" else 2,
            ],
        ),
        _get_row_data(
            value=data.cyl,
            label="Cyl",
            borders=[
                1,
                2,
                2,
            ],
        ),
        _get_row_data(
            value=data.ax,
            label="AX",
            borders=[
                1,
                2,
                2,
            ],
        ),
        _get_row_data(
            value=data.add,
            label="ADD",
            borders=[
                1,
                2,
                2,
            ],
        ),
        _get_row_data(
            value=data.sag,
            toric_value=data.sag_toric,
            label="SAG",
            borders=[
                1 | 8,
                2 | 8,
                2 | 8,
            ],
            font_size_mapping=font_settings_long_int_mapping,
        ),
    ]


def _map_to_table_data_with_borders(
    data: LensDataSpecs,
    left_or_right: LensSpecTypeBase,
) -> tuple[
    int,
    list[tuple[TableData, TableData, TableData]] | list[tuple[TableData, TableData]],
]:
    """Create the table data for the lens specifications with borders.

    Args:
    ----
        data (LensDataSpecs): The lens data specifications.
        left_or_right (LensSpecTypeBase): The side of the lens ("left" or "right").

    Returns:
    -------
        list[tuple[TableData, TableData]]: The table data with borders.

    """
    if data is None:
        return 3, []

    column_table_data = _get_column_data(data, left_or_right)
    return 3, column_table_data


class SingleLensTemplate(LabelTemplate[None]):
    """Concrete implementation of Template for single lens labels."""

    def add_patient_section(
        self,
        lower_margin: float = 2,
    ) -> tuple[float, float] | None:
        """Add the patient information section to the PDF.

        Args:
        ----
            lower_margin (float, optional): The lower margin. Defaults to 2.

        Returns:
        -------
            tuple[float, float] | None: A tuple containing the x and y coordinates of
                the bottom-right corner of the patient section.

        """
        current_y = self.pdf.get_y()
        top_margin = 1

        self.pdf.set_y(
            current_y + top_margin,
        )

        # Patient info heading
        self.pdf.set_x(self.pdf.l_margin)
        patient_info_y_top = self.pdf.get_y()
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
        patient_info_y = self.pdf.get_y()
        patient_info_lines_amount = 2

        self.pdf.set_y(
            patient_info_y
            + (patient_info_line_height * patient_info_lines_amount)
            + lower_margin,
        )

        return patient_info_x_right, patient_info_y_top

    def add_production_info(
        self,
        _left_margin: float | None = None,
        _top_margin: float | None = None,
    ) -> None:
        """Add the production information section to the PDF.

        Args:
        ----
            _left_margin (float | None, optional): The left margin. Defaults to None.
            _top_margin (float | None, optional): The top margin. Defaults to None.

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

        self.pdf.set_font("openSansCondensedRegular", "", 7.5)  # type: ignore[arg-type]
        self.pdf.cell(
            w=18,
            h=2.5,
            text=self.label_data.batch,
            align="L",
            border=self.show_borders,
            new_x="LMARGIN",
            new_y="NEXT",
        )

        lot_number_lower_margin = 1

        # Production date
        production_date_initial_x = self.pdf.get_x()
        production_date_initial_y = self.pdf.get_y() + lot_number_lower_margin
        self.pdf.set_xy(production_date_initial_x, production_date_initial_y)

        current_dir = Path(__file__).parent
        img_dir = current_dir / "img"

        img_width = 2.5
        img_height = 2.5
        self.pdf.image(img_dir / "factory.svg", w=img_width, h=img_height, type="SVG")
        self.pdf.c_margin = 0
        self.pdf.set_xy(
            production_date_initial_x + img_width,
            production_date_initial_y,
        )

        self.pdf.set_font("openSansCondensedRegular", "", 6)
        self.pdf.cell(
            w=7.5,
            h=2.2,
            text="(prod. il)",
            align="L",
            border=self.show_borders,
            new_x="RIGHT",
            new_y="LAST",
        )

        self.pdf.set_font("openSansRegular", "", 8)
        self.pdf.cell(
            w=15,
            h=2.5,
            text=self.label_data.production_date,
            align="L",
            border=self.show_borders,
            new_x="LMARGIN",
            new_y="NEXT",
        )

        production_date_lower_margin = 1

        # Expiration date
        expiration_date_initial_x = self.pdf.get_x()
        expiration_date_initial_y = self.pdf.get_y() + production_date_lower_margin
        self.pdf.set_xy(expiration_date_initial_x, expiration_date_initial_y)

        current_dir = Path(__file__).parent
        img_dir = current_dir / "img"

        expiration_date_img_width = 2.5
        expiration_date_img_height = 2.5
        self.pdf.image(
            img_dir / "hourglass.svg",
            w=expiration_date_img_width,
            h=expiration_date_img_height,
            type="SVG",
        )
        self.pdf.c_margin = 0
        self.pdf.set_xy(
            expiration_date_initial_x + expiration_date_img_width,
            expiration_date_initial_y,
        )

        self.pdf.set_font("openSansCondensedRegular", "", 6)
        self.pdf.cell(
            w=7.5,
            h=2.2,
            text="(scade il)",
            align="L",
            border=self.show_borders,
            new_x="RIGHT",
            new_y="LAST",
        )

        self.pdf.set_font("openSansBold", "", 8)
        self.pdf.cell(
            w=15,
            h=2.5,
            text=self.label_data.due_date,
            align="L",
            border=self.show_borders,
            new_x="LMARGIN",
            new_y="NEXT",
        )

    def add_company_info(self) -> None:
        """Add the company information section to the PDF."""
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

    def _get_lens_spec_type_label(self) -> str:
        """Get the specification for the left or right eye.

        Returns
        -------
            str: The side label ("OS" or "OD").

        """
        return "OS" if self.lens_spec_type == LensSpecType.left else "OD"

    def add_lens_specifications(
        self,
        lens_spec_type: LensSpecType,  # noqa: ARG002
        left_margin: float | None = None,
        top_margin: float | None = None,
    ) -> None:
        """Add the eye specifications section to the PDF.

        Args:
        ----
            lens_spec_type (LensSpecType): The type of LensSpec.
            left_margin (float | None, optional): The x-coordinate of the left edge of
                the current section. Defaults to None.
            top_margin (float | None, optional): The y-coordinate of the top edge of the
                current section. Defaults to None.

        """
        if top_margin is not None:
            self.pdf.set_y(top_margin)
        if left_margin is not None:
            self.pdf.set_x(left_margin)

        # Right-Left spec
        self.pdf.set_font("openSansBold", "", 20)
        label = self._get_lens_spec_type_label()
        self.pdf.cell(
            10,
            8,
            label,
            align="C",
            border=self.show_borders,
            new_x="RIGHT",
            new_y="LAST",
        )

        lens_spec_data = cast(
            LensDataSpecs,
            getattr(self.label_data.lens_specs, self.lens_spec_type.value, None) or {},
        )

        table_data = _map_to_table_data(data=lens_spec_data)

        self.pdf.set_font("openSansRegular", "", 7)
        table_borders: str = "NONE" if not self.show_borders else "ALL"
        self.pdf.set_x(self.pdf.get_x())

        with self.pdf.table(
            width=15,
            col_widths=(5, 7),
            line_height=2.8,  # type: ignore[arg-type]
            align="L",
            first_row_as_headings=False,
            v_align="M",
            text_align="C",
            borders_layout=table_borders,
        ) as table:
            for data_row in table_data:
                row = table.row()
                for datum in data_row:
                    row.cell(str(datum))

    def page_build(self) -> None:
        """Build the entire PDF page by calling the section methods."""
        self.page_setup(columns_amount=2)
        self.load_fonts()
        self.add_header_section()
        patient_section_coords = self.add_patient_section()
        if patient_section_coords is None:
            return
        patient_info_x_right, patient_info_y_top = patient_section_coords
        self.add_production_info()

        production_info_y_lower = self.pdf.get_y()
        lower_margin = 2
        self.pdf.set_y(
            production_info_y_lower + lower_margin,
        )

        self.add_company_info()
        self.add_lens_specifications(
            self.lens_spec_type,
            patient_info_x_right,
            patient_info_y_top,
        )


class DoubleLensTemplate(LabelTemplate[tuple[float, float]]):
    """Concrete implementation of Template for double lens labels."""

    def __init__(
        self,
        label_data: LabelData,
        lens_spec_type: LensSpecType,
        show_borders: bool = True,
    ) -> None:
        """Initialise the DoubleLensTemplate.

        Args:
        ----
            label_data (LabelData): The data for the label.
            lens_spec_type (LensSpecType): The type of LensSpec.
            show_borders (bool, optional): Whether to show borders. Defaults to True.

        """
        super().__init__(
            label_data=label_data,
            lens_spec_type=lens_spec_type,
            show_borders=show_borders,
        )
        self._page_width = 48
        self._lens_spec_width = 14
        self._patient_info_anagraphic_max_length = 18

    def _compute_patient_info_anagraphic(self, name: str, surname: str) -> str:
        """Compute the patient's anagraphic information, truncating if it is too long.

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

    def _set_xy_custom(self, x: float | None, y: float | None) -> None:
        """Set the x and y coordinates of the PDF.

        Args:
        ----
            x (float | None): The x coordinate.
            y (float | None): The y coordinate.

        """
        if x and y:
            self.pdf.set_xy(x, y)
            return

        if x:
            self.pdf.set_x(x)
            return

        if y:
            self.pdf.set_y(y)
            return

    def _create_table_data(
        self,
        left_or_right: LensSpecTypeBase,
    ) -> list[tuple[TableData, TableData, TableData]]:
        """Create the table data for the lens specifications.

        Args:
        ----
            left_or_right (LensSpecTypeBase): The side of the lens ("left" or "right").

        Returns:
        -------
            list[tuple[TableData, TableData]]: The table data.

        """
        data = getattr(self.label_data.lens_specs, left_or_right.value, None)
        if data is None:
            return []

        return _get_column_data(data=data, left_or_right=left_or_right)

    def add_patient_section(self) -> None:
        """Add the patient information section to the PDF."""
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

    def columns_layout(
        self,
        table: Any,  # noqa: ANN401
        table_data: list[tuple[TableData, TableData, TableData]],
    ) -> None:
        """Layout the PDF lens specification table when three data columns are needed.

        Args:
        ----
            table (Any): The table context/handler used to create rows and cells in
                the PDF.
            table_data (list[tuple[TableData, TableData, TableData]]): The sequence
                of table rows (label, value left, value right)
                already enriched with border information.

        Returns:
        -------
            None

        """
        for data_row in table_data:
            row = table.row()
            for datum in data_row:
                if datum.skip:
                    continue

                row.cell(
                    datum.value,
                    border=datum.border,
                    align=datum.align,
                    colspan=datum.colspan,
                    style=datum.style,
                )

    def two_columns_layout(
        self,
        table: Any,  # noqa: ANN401
        table_data: list[tuple[TableData, TableData]],
    ) -> None:
        """Layout the PDF lens specification table when two data columns are needed.

        Args:
        ----
            table (Any): The table context/handler used to create rows and cells in
                the PDF.
            table_data (list[tuple[TableData, TableData]]): The sequence of table
                rows (label cell, value cell)
                already enriched with border information.

        Returns:
        -------
            None

        """
        for data_row in table_data:
            row = table.row()
            for datum in data_row:
                row.cell(datum.value, border=datum.border)

    def add_left_lens(
        self,
        _left_margin: float | None,
        top_margin: float | None,
    ) -> tuple[float, float]:
        """Add the left lens specifications section to the PDF.

        Args:
        ----
            _left_margin (float | None): The left margin.
            top_margin (float | None): The top margin.

        Returns:
        -------
            tuple[float, float]: The x and y coordinates of the bottom-right corner of
            the section.

        """
        self.pdf.set_font("openSansBold", "", 20)
        if top_margin is not None:
            self.pdf.set_y(top_margin)

        table_data = self._create_table_data(
            left_or_right=LensSpecTypeBase.left,
        )

        self.pdf.set_font("openSansRegular", "", 7)
        table_borders: str = "NONE" if not self.show_borders else "ALL"

        left_lens_spec_x_left = self.pdf.get_x()
        left_lens_spec_x_right = left_lens_spec_x_left + self._lens_spec_width
        left_lens_spec_y_top = self.pdf.get_y()

        with self.pdf.table(
            width=self._lens_spec_width,
            col_widths=(4, 1, 7),
            line_height=2.8,  # type: ignore[arg-type]
            align="L",
            first_row_as_headings=False,
            v_align="M",
            text_align="C",
            borders_layout=table_borders,
        ) as table:
            self.columns_layout(table, table_data)

        return left_lens_spec_x_right, left_lens_spec_y_top

    def add_company_info(self) -> None:
        """Add the company information section to the PDF."""
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

    def add_lens_spec_type(
        self,
        left_margin: float,
        top_margin: float,
    ) -> tuple[float, float]:
        """Add the left and right lens designation to the PDF.

        Args:
        ----
            left_margin (float): The left margin.
            top_margin (float): The top margin.

        Returns:
        -------
            tuple[float, float]: The x and y coordinates of the bottom-right
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
        _left_margin: float | None,
        top_margin: float | None,
    ) -> tuple[float, float]:
        """Add the right lens specifications section to the PDF.

        Args:
        ----
            _left_margin (float | None): The left margin.
            top_margin (float | None): The top margin.

        Returns:
        -------
            tuple[float, float]: The x and y coordinates of the bottom-right corner of
            the section.

        """
        self.pdf.set_font("openSansBold", "", 20)
        self._set_xy_custom(_left_margin, top_margin)

        table_data = self._create_table_data(
            left_or_right=LensSpecTypeBase.right,
        )

        self.pdf.set_font("openSansRegular", "", 7)
        table_borders: str = "NONE" if not self.show_borders else "ALL"

        with self.pdf.table(
            width=self._lens_spec_width,
            col_widths=(4, 1, 7),
            line_height=2.8,  # type: ignore[arg-type]
            align="L",
            first_row_as_headings=False,
            v_align="M",
            text_align="C",
            borders_layout=table_borders,
        ) as table:
            self.columns_layout(table, table_data)

        return self.pdf.get_x(), self.pdf.get_y()

    def add_production_info(
        self,
        _left_margin: float | None = None,
        _top_margin: float | None = None,
    ) -> None:
        """Add the production information section to the PDF.

        Args:
        ----
            _left_margin (float | None, optional): The left margin. Defaults to None.
            _top_margin (float | None, optional): The top margin. Defaults to None.

        """
        additional_top_margin = 1
        additional_left_margin = 1

        current_left_margin = (
            _left_margin + additional_left_margin
            if _left_margin is not None
            else _left_margin
        )

        if current_left_margin is not None and _top_margin is not None:
            self.pdf.set_xy(
                current_left_margin,
                _top_margin + additional_top_margin,
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

        self.pdf.set_font("openSansCondensedRegular", "", 7.5)  # type: ignore[arg-type]
        self.pdf.cell(
            w=14,
            h=2.5,
            text=self.label_data.batch,
            align="L",
            border=self.show_borders,
            new_x="START",
            new_y="NEXT",
        )

        # Production date
        if current_left_margin is not None:
            self.pdf.set_xy(
                current_left_margin,
                self.pdf.get_y() + additional_top_margin,
            )

        production_date_initial_x = self.pdf.get_x()
        production_date_initial_y = self.pdf.get_y()

        current_dir = Path(__file__).parent
        img_dir = current_dir / "img"

        production_img_width = 2.5
        production_img_height = 2.5
        self.pdf.image(
            img_dir / "factory.svg",
            w=production_img_width,
            h=production_img_height,
            type="SVG",
        )
        self.pdf.c_margin = 0
        self.pdf.set_xy(
            production_date_initial_x + production_img_width,
            production_date_initial_y,
        )

        self.pdf.set_font("openSansRegular", "", 8)
        self.pdf.cell(
            w=15,
            h=2.5,
            text=self.label_data.production_date,
            align="L",
            border=self.show_borders,
            new_x="START",
            new_y="NEXT",
        )

        # Expiration date
        if current_left_margin is not None:
            self.pdf.set_xy(
                current_left_margin,
                self.pdf.get_y() + additional_top_margin,
            )

        expiration_date_initial_x = self.pdf.get_x()
        expiration_date_initial_y = self.pdf.get_y()

        current_dir = Path(__file__).parent

        expiration_img_width = 2.5
        expiration_img_height = 2.5
        self.pdf.image(
            img_dir / "hourglass.svg",
            w=expiration_img_width,
            h=expiration_img_height,
            type="SVG",
        )
        self.pdf.c_margin = 0
        self.pdf.set_xy(
            expiration_date_initial_x + expiration_img_width,
            expiration_date_initial_y,
        )

        self.pdf.set_font("openSansBold", "", 8)
        self.pdf.cell(
            w=15,
            h=2.5,
            text=self.label_data.due_date,
            align="L",
            border=self.show_borders,
            new_x="START",
            new_y="NEXT",
        )

    def add_lens_specifications(
        self,
        lens_spec_type: LensSpecType,
        left_margin: float | None = None,
        top_margin: float | None = None,
    ) -> tuple[float, float]:
        """Add the eye specifications section to the PDF.

        Args:
        ----
            lens_spec_type (LensSpecType): The type of LensSpec.
            left_margin (float | None, optional): The x-coordinate of the left edge of
                the current section. Defaults to None.
            top_margin (float | None, optional): The y-coordinate of the top edge of the
                current section. Defaults to None.

        Returns:
        -------
            tuple[float, float]: The x and y coordinates of the bottom-right corner of
            the section.

        """
        method_to_call = (
            self.add_left_lens
            if lens_spec_type == LensSpecType.left
            else self.add_right_lens
        )

        return method_to_call(_left_margin=left_margin, top_margin=top_margin)

    def page_build(self) -> None:
        """Build the entire PDF page by calling the section methods."""
        self.page_setup(columns_amount=2)
        self.load_fonts()
        self.add_header_section()
        self.add_patient_section()

        # set separator margin between patient section and lens_spec section
        margin_separator_before_lens_spec_section = 0.5
        top_margin = self.pdf.get_y() + margin_separator_before_lens_spec_section

        # add OS lens spec section
        left_spec_x_right, left_spec_y_top = self.add_lens_specifications(
            lens_spec_type=LensSpecType.left,
            top_margin=top_margin,
        )

        self.add_company_info()

        # add lens spec type section
        left_right_x_right, left_right_y_bottom = self.add_lens_spec_type(
            left_spec_x_right,
            left_spec_y_top,
        )

        # add OD lens spec section
        self.add_lens_specifications(
            lens_spec_type=LensSpecType.right,
            left_margin=left_right_x_right,
            top_margin=left_spec_y_top,
        )

        self.add_production_info(
            _left_margin=left_spec_x_right,
            _top_margin=left_right_y_bottom,
        )


TEMPLATE_MAP = {
    LensSpecType.left: SingleLensTemplate,
    LensSpecType.right: SingleLensTemplate,
    LensSpecType.double: DoubleLensTemplate,
}
