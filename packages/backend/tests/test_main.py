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
async def test_create_label_success() -> None:
    """Test the create label endpoint with valid data."""
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.post(
            "/label/create",
            json={
                "patient_info": {"name": "John", "surname": "Doe"},
                "description": "Test Description",
                "batch": "12-1234",
                "due_date": "12/2025",
                "lens_specs": {
                    "left": {
                        "bc": "8.60",
                        "dia": "14.20",
                        "pwr": "-1.00",
                        "cyl": "-0.75",
                        "ax": "180",
                        "add": "+2.00",
                        "sag": "1.00",
                    },
                },
            },
        )
    assert response.status_code == HTTP_STATUS_OK
    assert response.json()["status"] == "ok"
    assert "pdf_filename" in response.json()


@pytest.mark.anyio()
async def test_create_label_validation_error() -> None:
    """Test the create label endpoint with invalid data."""
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.post(
            "/label/create",
            json={
                "patient_info": {"name": "", "surname": "Doe"},
                "description": "Test Description",
                "batch": "12-1234",
                "due_date": "12/2025",
                "lens_specs": {
                    "left": {
                        "bc": "8.60",
                        "dia": "14.20",
                        "pwr": "-1.00",
                        "cyl": "-0.75",
                        "ax": "180",
                        "add": "+2.00",
                        "sag": "1.00",
                    },
                },
            },
        )
    assert response.status_code == HTTP_STATUS_ERROR
