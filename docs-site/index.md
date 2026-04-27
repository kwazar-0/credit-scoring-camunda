---
layout: page
title: Home
description: Redirect to system philosophy page
outline: false
head:
  - - meta
    - http-equiv: refresh
      content: "0;url=en/system-philosophy-governance"
---

<script setup lang="ts">
import { onMounted } from "vue";

onMounted(() => {
  const base = import.meta.env.BASE_URL || "/";
  const normalized = base.endsWith("/") ? base : `${base}/`;
  const target = `${normalized}en/system-philosophy-governance`.replace(/([^:]\/)\/+/g, "$1");
  const path = typeof window !== "undefined" ? window.location.pathname : "";
  const alreadyTarget =
    /\/en\/system-philosophy-governance\/?$/.test(path) ||
    path.includes("/en/system-philosophy-governance/");
  if (typeof window !== "undefined" && !alreadyTarget) {
    window.location.replace(target);
  }
});
</script>

Start page: [System Philosophy and Governance](/en/system-philosophy-governance).

Manual links: [EN philosophy](/en/system-philosophy-governance) · [PL](/pl/) · [RU](/ru/) · [EN home](/en/) · [ADR](/adr)
