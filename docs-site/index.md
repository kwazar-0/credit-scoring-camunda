---
layout: page
title: Home
description: Przekierowanie na dokumentację (PL)
outline: false
head:
  - - meta
    - http-equiv: refresh
      content: "0;url=pl/"
---

<script setup lang="ts">
import { onMounted } from "vue";

onMounted(() => {
  const base = import.meta.env.BASE_URL || "/";
  const normalized = base.endsWith("/") ? base : `${base}/`;
  const target = `${normalized}pl/`.replace(/([^:]\/)\/+/g, "$1");
  const path = typeof window !== "undefined" ? window.location.pathname : "";
  const alreadyPl = /\/pl\/?$/.test(path) || path.includes("/pl/");
  if (typeof window !== "undefined" && !alreadyPl) {
    window.location.replace(target);
  }
});
</script>

Dokumentacja techniczna (domyślnie język polski) — [przejdź do /pl/](/pl/).

Ręcznie: [PL](/pl/) · [EN](/en/) · [RU](/ru/) · [ADR](/adr)
