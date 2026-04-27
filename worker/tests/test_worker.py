"""Smoke tests for Zeebe worker constants and core behavior."""

import asyncio

import pytest
from pyzeebe.errors.pyzeebe_errors import BusinessError

from app.main import TASK_TYPE, execute_ai_loan_analysis

def test_ai_loan_analysis_task_type() -> None:
    assert TASK_TYPE == "ai-loan-analysis"


def test_missing_application_raises_business_error() -> None:
    with pytest.raises(BusinessError) as exc:
        asyncio.run(execute_ai_loan_analysis(None))
    assert exc.value.error_code == "MISSING_APPLICATION"
