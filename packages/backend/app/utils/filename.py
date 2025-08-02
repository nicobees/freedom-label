"""Filename generator."""

from datetime import datetime
from random import random


def generate_random_filename() -> str:
    """Generate random filename.

    Returns
    -------
        str: random filename

    """
    timestamp = datetime.now().strftime("%Y%m%d-%H%M%S")
    random_int = random.randint(1000, 9999)
    return f"{timestamp}_{random_int}.pdf"
