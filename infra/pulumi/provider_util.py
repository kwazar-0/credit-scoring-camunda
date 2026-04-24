"""GCP provider with optional gcloud user token (local dev only; CI uses Workload Identity / ADC)."""

from __future__ import annotations

import os
import subprocess

import pulumi
import pulumi_gcp as gcp


def gcp_provider_args(project: str, region: str) -> dict:
    args: dict = {"project": project, "region": region, "default_labels": {"managed_by": "pulumi"}}
    if os.environ.get("PULUMI_USE_GCLOUD_USER_TOKEN", "").lower() in ("1", "true", "yes"):
        tok = subprocess.run(
            ["gcloud", "auth", "print-access-token"],
            check=True,
            capture_output=True,
            text=True,
        ).stdout.strip()
        args["access_token"] = pulumi.Output.secret(tok)
    return args
