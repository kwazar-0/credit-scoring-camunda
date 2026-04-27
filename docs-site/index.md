---
layout: page
title: Home
description: Redirect to layered system entry (main)
outline: false
head:
  - - meta
    - http-equiv: refresh
      content: "0;url=en/main"
---

<script setup lang="ts">
import { onMounted } from "vue";

onMounted(() => {
  const base = import.meta.env.BASE_URL || "/";
  const normalized = base.endsWith("/") ? base : `${base}/`;
  const target = `${normalized}en/main`.replace(/([^:]\/)\/+/g, "$1");
  const path = typeof window !== "undefined" ? window.location.pathname : "";
  const alreadyTarget =
    /\/en\/main\/?$/.test(path) || path.includes("/en/main/");
  if (typeof window !== "undefined" && !alreadyTarget) {
    window.location.replace(target);
  }
});
</script>

Start page: [System entry (main)](/en/main) — or [System philosophy and governance](/en/system-philosophy-governance).

Manual links: [EN philosophy](/en/system-philosophy-governance) · [PL](/pl/) · [RU](/ru/) · [EN home](/en/) · [ADR](/adr)
