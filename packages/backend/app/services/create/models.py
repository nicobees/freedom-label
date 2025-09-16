"""Abstract classes for the pdf template."""

from __future__ import annotations

from abc import ABC, abstractmethod
from enum import Enum
from pathlib import Path
from typing import TYPE_CHECKING, Any, Generic, TypeVar

from fpdf import FPDF, FontFace
from pydantic import BaseModel

from app.models import LensDataSpecs, TableData, TableDataFontSetting

if TYPE_CHECKING:
    from app.models import LabelData


T = TypeVar("T")


class OrientationValues(str, Enum):
    """Enum for page orientation values."""

    portrait = "P"
    landscape = "L"


class UnitValues(str, Enum):
    """Enum for measurement unit values."""

    mm = "mm"
    inches = "in"
    cm = "cm"


class LensSpecTypeBase(str, Enum):
    """Base Enum for the LensSpec type."""

    left = "left"
    right = "right"


class LensSpecType(str, Enum):
    """Enum for the LensSpec type."""

    left = "left"
    right = "right"
    double = "double"


class PageSetupProperties(BaseModel):
    """Main data structure for page setup properties."""

    orientation: OrientationValues = OrientationValues.landscape
    unit: UnitValues = UnitValues.mm
    size: tuple[int, int] = (30, 50)


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


def _get_row_data(
    value: str,
    label: str,
    borders: list[int],
    toric_value: str | None = None,
    font_size_mapping: dict[int, TableDataFontSetting] | None = font_settings_mapping,
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
        smaller_font_size_mapping = (
            font_size_mapping.get(
                value_length,
                font_size_default,
            )
            if font_size_mapping is not None
            else font_size_default
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

    value_length = len(value) if font_size_mapping is not None else 0

    font_size_default = TableDataFontSetting(label=7, value=7, align="L")
    smaller_font_size_mapping = (
        font_size_mapping.get(
            value_length,
            font_size_default,
        )
        if font_size_mapping is not None
        else font_size_default
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
            colspan=2,
            style=smaller_font_label,
        ),
        TableData(
            value=value,
            skip=True,
        ),
        TableData(
            value=value,
            border=borders[2],
            style=smaller_font_value,
        ),
    )


def _get_borders(show_borders: bool, borders: list[int]) -> list[int]:
    """Get the border settings based on whether borders should be shown.

    Args:
    ----
        show_borders (bool): Whether to show borders.
        borders (list[int | None]): The original border settings to apply when
            show_borders is True.

    Returns:
    -------
        list[int | None]: The border settings.

    """
    return borders if show_borders else [0, 0, 0]


def _get_column_data(
    data: LensDataSpecs,
    left_or_right: LensSpecTypeBase | LensSpecType,
    show_borders: bool = True,
) -> list[tuple[TableData, TableData, TableData]]:
    """Create the table data for the lens specifications with borders.

    Args:
    ----
        data (LensDataSpecs): The lens data specifications.
        left_or_right (LensSpecTypeBase): The side of the lens ("left" or "right").
        show_borders (bool): Whether to include cell borders in the generated table.

    Returns:
    -------
        list[tuple[TableData, TableData, TableData]]: The table data with borders
            (or without if show_borders is False).

    """
    if data is None:
        return []

    middle_border: list[int] = [
        1,
        2,
        2,
    ]
    last_border: list[int] = [
        1 | 8,
        2 | 8,
        2 | 8,
    ]
    one_to_last_field_borders: list[int] = (
        last_border if data.batch is None else middle_border
    )

    column_data = [
        _get_row_data(
            value=data.bc,
            toric_value=data.bc_toric,
            label="BC",
            borders=_get_borders(
                show_borders=show_borders,
                borders=[
                    1 | 4 if left_or_right.value == "left" else 4,
                    4 if left_or_right.value == "left" else 2 | 4,
                    4 if left_or_right.value == "left" else 2 | 4,
                ],
            ),
        ),
        _get_row_data(
            value=data.dia,
            label="DIA",
            borders=_get_borders(
                show_borders=show_borders,
                borders=[
                    1 if left_or_right.value == "left" else 0,
                    0 if left_or_right.value == "left" else 2,
                    0 if left_or_right.value == "left" else 2,
                ],
            ),
            font_size_mapping=None,
        ),
        _get_row_data(
            value=data.pwr,
            label="Pwr",
            borders=_get_borders(
                show_borders=show_borders,
                borders=[
                    1 if left_or_right.value == "left" else 0,
                    0 if left_or_right.value == "left" else 2,
                    0 if left_or_right.value == "left" else 2,
                ],
            ),
            font_size_mapping=None,
        ),
        _get_row_data(
            value=data.cyl,
            label="Cyl",
            borders=_get_borders(
                show_borders=show_borders,
                borders=[
                    1,
                    2,
                    2,
                ],
            ),
            font_size_mapping=None,
        ),
        _get_row_data(
            value=data.ax,
            label="AX",
            borders=_get_borders(
                show_borders=show_borders,
                borders=[
                    1,
                    2,
                    2,
                ],
            ),
            font_size_mapping=None,
        ),
        _get_row_data(
            value=data.add,
            label="ADD",
            borders=_get_borders(
                show_borders=show_borders,
                borders=[
                    1,
                    2,
                    2,
                ],
            ),
            font_size_mapping=None,
        ),
        _get_row_data(
            value=data.sag,
            toric_value=data.sag_toric,
            label="SAG",
            borders=_get_borders(
                show_borders=show_borders,
                borders=one_to_last_field_borders,
            ),
            font_size_mapping=font_settings_long_int_mapping,
        ),
    ]

    if data.batch is not None:
        column_data.append(
            (
                _get_row_data(
                    value=data.batch,
                    label="Lot",
                    borders=_get_borders(
                        show_borders=show_borders,
                        borders=last_border,
                    ),
                    font_size_mapping=font_settings_long_int_mapping,
                )
            ),
        )

    return column_data


class LabelTemplate(Generic[T], ABC):
    """Abstract base class for creating PDF labels.

    This class provides a template for generating PDF labels with a specific
    layout and structure. It includes methods for setting up the page,
    loading fonts, and adding various sections to the label.

    Attributes
    ----------
        pdf (FPDF): An instance of the FPDF class used to generate the PDF.
        label_data (LabelData): An object containing the data for the label.
        producer_name (str): The name of the producer to be displayed on the label.
        debug_border (bool): A flag to enable or disable debug borders in the PDF.

    """

    def __init__(
        self,
        label_data: LabelData,
        lens_spec_type: LensSpecType,
        producer_name: str = "occhialeria",
        page_setup_properties: PageSetupProperties | None = None,
        show_borders: bool = True,
    ) -> None:
        """Initialize the Template.

        Args:
        ----
            label_data (LabelData): The data to be included in the label.
            lens_spec_type (LensSpecType): The type of LensSpec.
            producer_name (str, optional): The name of the producer.
                Defaults to "occhialeria".
            page_setup_properties (PageSetupProperties | None, optional):
                The page setup properties. If None, default values are used.
                Defaults to None.
            show_borders (bool, optional): Whether to show debug borders.
                Defaults to True.

        """
        if page_setup_properties is None:
            page_setup_properties = PageSetupProperties()

        self.pdf = FPDF(
            orientation=page_setup_properties.orientation.value,
            unit=page_setup_properties.unit.value,
            format=page_setup_properties.size,
        )
        self.label_data = label_data
        self.lens_spec_type = lens_spec_type
        self.producer_name = producer_name
        self.show_borders = show_borders

    def page_setup(self, columns_amount: int | None) -> None:
        """Set up the page margins, auto page break, and add a new page.

        Args:
        ----
            columns_amount (int | None): The number of columns to be used for
                text layout. If None, no columns are set up.

        """
        self.pdf.set_margins(left=1, top=1)
        self.pdf.set_auto_page_break(auto=False, margin=1)
        self.pdf.c_margin = 1

        self.pdf.add_page()
        if columns_amount is not None:
            self.pdf.text_columns(text_align="J", ncols=columns_amount)

    def load_fonts(self) -> None:
        """Load the fonts required for the PDF document.

        This method loads the Open Sans font in regular, bold, and condensed
        styles from the 'fonts' directory.
        """
        current_dir = Path(__file__).parent
        font_dir = current_dir / "fonts"
        self.pdf.add_font("openSansRegular", "", font_dir / "OpenSans-Regular.ttf")
        self.pdf.add_font("openSansBold", "", font_dir / "OpenSans-Bold.ttf")
        self.pdf.add_font(
            "openSansCondensedRegular",
            "",
            font_dir / "OpenSans_Condensed-Regular.ttf",
        )
        self.pdf.add_font(
            "openSansCondensedBold",
            "",
            font_dir / "OpenSans_Condensed-Bold.ttf",
        )

    def add_header_section(self) -> None:
        """Add the header section to the PDF.

        This includes the producer's logo and name, as well as the product
        description.
        """
        # Producer name
        self.pdf.set_font("openSansCondensedBold", "", 10.5)  # type: ignore[arg-type]
        self.pdf.set_xy(self.pdf.l_margin, self.pdf.t_margin)

        current_dir = Path(__file__).parent
        img_dir = current_dir / "img"

        img_width = 3.5
        img_height = 3.5
        self.pdf.image(img_dir / "logo.png", w=img_width, h=img_height, type="PNG")
        self.pdf.c_margin = 0
        self.pdf.set_xy(self.pdf.l_margin + img_width, self.pdf.t_margin)
        self.pdf.cell(
            w=20,
            h=3,
            text=self.producer_name.upper(),
            align="L",
            border=self.show_borders,
        )

        # Product description
        self.pdf.set_font("openSansCondensedRegular", "", 8)

        self.pdf.c_margin = 0
        self.pdf.multi_cell(
            w=24.5,
            h=3,
            text=self.label_data.description,
            align="C",
            border=self.show_borders,
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

    def _create_table_data(
        self,
        left_or_right: LensSpecTypeBase | LensSpecType,
        show_borders: bool = True,
    ) -> list[tuple[TableData, TableData, TableData]]:
        """Create the table data for the lens specifications.

        Args:
        ----
            left_or_right (LensSpecTypeBase): The side of the lens ("left" or "right").
            show_borders (bool): Whether to include cell borders in the generated table.

        Returns:
        -------
            list[tuple[TableData, TableData]]: The table data.

        """
        data = getattr(self.label_data.lens_specs, left_or_right.value, None)
        if data is None:
            return []

        return _get_column_data(
            data=data,
            left_or_right=left_or_right,
            show_borders=show_borders,
        )

    @abstractmethod
    def add_patient_section(self) -> tuple[float, float] | None:
        """Add the patient information section to the PDF.

        This method should be implemented by subclasses to add patient-specific
        details to the label.

        Returns
        -------
            tuple[float, float]: A tuple containing the x and y coordinates of
                the bottom-right corner of the patient section.

        """

    @abstractmethod
    def add_production_info(
        self,
        _left_margin: float | None,
        _top_margin: float | None = None,
    ) -> None:
        """Add the production information section to the PDF.

        This method should be implemented by subclasses to add production
        details such as serial numbers, dates, etc.
        """

    @abstractmethod
    def add_company_info(self) -> None:
        """Add the company information section to the PDF.

        This method should be implemented by subclasses to add company-specific
        details such as address, contact information, etc.
        """

    @abstractmethod
    def add_lens_specifications(
        self,
        lens_spec_type: LensSpecType,
        left_margin: float | None = None,
        top_margin: float | None = None,
    ) -> T:
        """Add the eye specifications section to the PDF.

        This method should be implemented by subclasses to add detailed eye
        prescription information.

        Args:
        ----
            lens_spec_type (LensSpecType): The type of LensSpec.
            left_margin (float): The x-coordinate of the right edge of
                the current section.
            top_margin (float): The y-coordinate of the top edge of the
                current section.

        """

    @abstractmethod
    def page_build(self) -> None:
        """Build the entire PDF page by calling the section methods.

        This method orchestrates the creation of the PDF by calling the
        various 'add' methods in the correct order.
        """

    def save_template_as_pdf(self, output_filename: str) -> str:
        """Save the generated PDF to a file.

        Args:
        ----
            output_filename (str): The name of the output PDF file.

        Returns:
        -------
            str: The absolute path to the saved PDF file.

        """
        self.page_build()

        # Save PDF
        current_dir = Path(__file__).parent.parent
        output_local_path = "pdf_output"
        output_path = current_dir / output_local_path / output_filename
        self.pdf.output(str(output_path))

        return str(output_path)
