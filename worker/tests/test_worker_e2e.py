"""E2E-style test for worker task output mapping."""

from __future__ import annotations

import asyncio

import pytest

from app import main


class _FakeResponse:
    def __init__(self, payload: dict) -> None:
        self.status_code = 200
        self._payload = payload
        self.text = ""

    def json(self) -> dict:
        return self._payload


class _FakeAsyncClient:
    def __init__(self, *args, **kwargs) -> None:  # noqa: ANN002, ANN003
        self.last_url: str | None = None
        self.last_payload: dict | None = None

    async def __aenter__(self):
        return self

    async def __aexit__(self, exc_type, exc, tb):  # noqa: ANN001
        return False

    async def post(self, url: str, json: dict) -> _FakeResponse:  # noqa: A003
        self.last_url = url
        self.last_payload = json
        return _FakeResponse(
            {
                "risk_score": 83,
                "final_decision": "APPROVE",
                "justification_pl": "Dochod wystarczajacy.",
                "chain_of_thought_pl": "mock",
                "retrieved_chunks": [{"id": "r1"}],
                "dmn": {"riskTier": "LOW"},
                "bik": {"score": 88},
                "llm_reasoning_pl": "mock-llm",
                "reflection_pl": "mock-reflection",
            }
        )


def test_e2e_worker_maps_backend_payload(monkeypatch: pytest.MonkeyPatch) -> None:
    fake_client = _FakeAsyncClient()

    def _factory(*args, **kwargs):  # noqa: ANN002, ANN003
        return fake_client

    monkeypatch.setattr(main.httpx, "AsyncClient", _factory)

    application = {"income": 8000, "debt": 1000}
    out = asyncio.run(
        main.execute_ai_loan_analysis(
            application,
            backend_url="http://127.0.0.1:8000",
            job_key=123,
        )
    )

    assert fake_client.last_url == "http://127.0.0.1:8000/analyze"
    assert fake_client.last_payload == {"application": application}
    assert out["risk_score"] == 83
    assert out["final_decision"] == "APPROVE"
    assert out["dmn_snapshot"]["riskTier"] == "LOW"
    assert out["bik_snapshot"]["score"] == 88
