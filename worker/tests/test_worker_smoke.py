"""Smoke tests for worker HTTP error mapping."""

from __future__ import annotations

import asyncio

import httpx
import pytest
from pyzeebe.errors.pyzeebe_errors import BusinessError

from app import main


class _FakeResponse:
    def __init__(self, status_code: int, body: dict | None = None, text: str = "") -> None:
        self.status_code = status_code
        self._body = body or {}
        self.text = text

    def json(self) -> dict:
        return self._body


class _FakeAsyncClient:
    def __init__(self, *args, **kwargs) -> None:  # noqa: ANN002, ANN003
        self._response = kwargs.pop("_response", None)
        self._exception = kwargs.pop("_exception", None)

    async def __aenter__(self):
        return self

    async def __aexit__(self, exc_type, exc, tb):  # noqa: ANN001
        return False

    async def post(self, url: str, json: dict) -> _FakeResponse:  # noqa: A003
        if self._exception is not None:
            raise self._exception
        return self._response


def test_http_500_maps_to_backend_error(monkeypatch: pytest.MonkeyPatch) -> None:
    def _factory(*args, **kwargs):  # noqa: ANN002, ANN003
        return _FakeAsyncClient(_response=_FakeResponse(status_code=500))

    monkeypatch.setattr(main.httpx, "AsyncClient", _factory)

    with pytest.raises(BusinessError) as exc:
        asyncio.run(
            main.execute_ai_loan_analysis({"income": 1000}, backend_url="http://backend:8000")
        )
    assert exc.value.error_code == "AI_BACKEND_ERROR"


def test_http_timeout_maps_to_timeout_business_error(monkeypatch: pytest.MonkeyPatch) -> None:
    request = httpx.Request("POST", "http://backend:8000/analyze")

    def _factory(*args, **kwargs):  # noqa: ANN002, ANN003
        return _FakeAsyncClient(
            _exception=httpx.TimeoutException("timeout", request=request),
        )

    monkeypatch.setattr(main.httpx, "AsyncClient", _factory)

    with pytest.raises(BusinessError) as exc:
        asyncio.run(
            main.execute_ai_loan_analysis({"income": 1000}, backend_url="http://backend:8000")
        )
    assert exc.value.error_code == "AI_SERVICE_TIMEOUT"
