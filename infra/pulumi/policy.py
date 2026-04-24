"""
Policy-style checks (Secure v2 / architecture docs) applied at Pulumi program level.
No public SQL IP, GCS versioning, GKE with Workload Identity, no broad node OAuth.
"""

from __future__ import annotations

from typing import Any

import pulumi_gcp as gcp


def require_gcs_versioning_on_create(kwargs: dict[str, Any]) -> dict[str, Any]:
    """
    Enforce GCS object versioning. Pass Bucket constructor kwargs; mutates/returns
    a copy with versioning enabled.
    """
    v = dict(kwargs)
    v["versioning"] = gcp.storage.BucketVersioningArgs(enabled=True)
    return v


def reject_cloud_platform_oauth_scopes(scopes: list[str] | None) -> None:
    bad = "https://www.googleapis.com/auth/cloud-platform"
    if scopes and any(s == bad for s in scopes):
        raise ValueError("cloud-platform node OAuth scope is not allowed (use narrow scopes or empty list).")
