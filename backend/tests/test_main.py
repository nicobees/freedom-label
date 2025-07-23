
import pytest
from httpx import AsyncClient
from app.main import app

@pytest.mark.anyio
async def test_health_check():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}

@pytest.mark.anyio
async def test_print_label_success():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.post("/print-label", json={
            "patient_name": "John Doe",
            "pwr": "12345",
            "due_date": "01/01/25"
        })
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}

@pytest.mark.anyio
async def test_print_label_validation_error():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.post("/print-label", json={
            "patient_name": "",
            "pwr": "12345",
            "due_date": "01/01/25"
        })
    assert response.status_code == 422
    assert "patient_name" in response.json()["detail"][0]["loc"]
