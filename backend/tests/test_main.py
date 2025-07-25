"""Test cases for the main application endpoints."""

import pytest
from httpx import AsyncClient

from app.main import app

HTTP_STATUS_OK = 200
HTTP_STATUS_ERROR = 422


@pytest.mark.anyio()
async def test_health_check() -> None:
    """Test the health check endpoint."""
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.get("/health")
    assert response.status_code == HTTP_STATUS_OK
    assert response.json() == {"status": "ok"}


@pytest.mark.anyio()
async def test_print_label_success() -> None:
    """Test the print label endpoint with valid data."""
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.post(
            "/print-label",
            json={"patient_name": "John Doe", "pwr": "12345", "due_date": "01/01/25"},
        )
    assert response.status_code == HTTP_STATUS_OK
    assert response.json() == {"status": "ok"}


@pytest.mark.anyio()
async def test_print_label_validation_error() -> None:
    """Test the print label endpoint with invalid data."""
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.post(
            "/print-label",
            json={"patient_name": "", "pwr": "12345", "due_date": "01/01/25"},
        )
    assert response.status_code == HTTP_STATUS_ERROR
    assert "patient_name" in response.json()["detail"][0]["loc"]
