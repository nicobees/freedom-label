"""Filename generator."""

import secrets
from datetime import datetime, timezone


def generate_random_filename() -> str:
    """Generate random filename.

    Returns
    -------
        str: random filename

    """
    timestamp = datetime.now(timezone.utc).strftime("%Y%m%d-%H%M%S")
    random_int = secrets.randbelow(9000) + 1000
    return f"{timestamp}_{random_int}.pdf"
