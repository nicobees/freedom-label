"""Abstract classes for the pdf template."""

from __future__ import annotations

from abc import ABC, abstractmethod
from enum import Enum
from pathlib import Path
from typing import TYPE_CHECKING, Generic, TypeVar

from fpdf import FPDF
from fpdf.fonts import FontFace
from pydantic import BaseModel

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
        self.smaller_font = FontFace(size_pt=6)

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
