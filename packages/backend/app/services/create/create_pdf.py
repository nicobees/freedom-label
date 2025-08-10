"""Module for creating PDF labels."""

from __future__ import annotations

from typing import TYPE_CHECKING

from app.services.create.classes import select_template

if TYPE_CHECKING:
    from app.models import LabelData

DEBUG_BORDER = True

PRODUCER_NAME = "occhialeria"


def create_label_pdf(
    output_filename: str,
    label_data: LabelData,
    show_borders: bool = False,
) -> str:
    """Create a FreedomLac PDF label with the specified dimensions and data.

    Args:
    ----
        output_filename (str): Name of the output PDF file.
        label_data (LabelData): The complete label data.
        show_borders (bool, optional): Whether to show debug borders.
            Defaults to False.

    Returns:
    -------
        str: The absolute path to the created PDF file.

    """
    # Select label template
    lens_specs = getattr(label_data, "lens_specs", None)
    if lens_specs is None:
        error_message = "Lens specs are required."
        raise ValueError(error_message)

    (template_class, lens_spec_type) = select_template(
        left=lens_specs.left is not None,
        right=lens_specs.right is not None,
    )

    template_instance = template_class(
        label_data=label_data,
        lens_spec_type=lens_spec_type,
        show_borders=show_borders,
    )

    return template_instance.save_template_as_pdf(output_filename)
