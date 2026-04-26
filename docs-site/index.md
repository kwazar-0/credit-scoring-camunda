---
layout: page
title: HBG
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

**Domyślny język dokumentacji: polski.** Trwa przekierowanie na [/pl/](/pl/).

Jeśli przeglądarka nie przekieruje: [Polski →](/pl/) · [Русский →](/ru/) · [English →](/en/) · [ADR (wielojęzycznie) →](/adr)
