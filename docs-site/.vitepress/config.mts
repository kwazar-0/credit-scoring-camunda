import { defineConfig } from "vitepress";

const githubRepo = "https://github.com/kwazar-0/credit-scoring-camunda";

/** For GitHub project Pages, set in CI, e.g. VITEPRESS_BASE=/credit-scoring-camunda/ (must end with /). */
function vitepressBase(): string {
  const v = (process.env.VITEPRESS_BASE || "").trim();
  if (!v || v === "/") {
    return "/";
  }
  const withSlashes = v.startsWith("/") ? v : `/${v}`;
  return withSlashes.endsWith("/") ? withSlashes : `${withSlashes}/`;
}

const sidebarRu = [
  {
    text: "Старт",
    items: [
      { text: "Философия системы", link: "/ru/system-philosophy-governance" },
      { text: "Вход: система (main)", link: "/ru/main" },
      { text: "Упрощённые роли", link: "/ru/simplified" },
      { text: "Архитектура (обзор)", link: "/ru/architecture" },
      { text: "План и roadmap", link: "/ru/plan" },
      { text: "Implementation track", link: "/ru/INFRA-IMPLEMENTATION" },
      { text: "Сводка (1 стр.)", link: "/ru/system-summary" },
      { text: "Приложение (индекс)", link: "/ru/appendix" },
      { text: "Pulumi: основной IaC", link: "/ru/infra-pulumi-iac" },
      { text: "CLI / console", link: "/ru/cli-console" },
      { text: "Pulumi: gke-infra (песочница)", link: "/ru/infra-pulumi-gke-sandbox" },
      { text: "Оглавление (все страницы)", link: "/ru/toc" },
    ],
  },
  {
    text: "Продукт",
    items: [
      { text: "prompt (handoff + §9)", link: "/ru/prompt" },
      { text: "ML / Data / RAG", link: "/ru/ml-data-rag" },
      { text: "HBG: стратегия RAG-DOMINANCE", link: "/ru/hbg-rag-dominance" },
      { text: "HBG: роли и вакансии (HR)", link: "/ru/hr-offers-hbg" },
    ],
  },
  {
    text: "Git и GitHub",
    items: [
      { text: "git-workflow", link: "/ru/git-workflow" },
      { text: "branch-notes", link: "/ru/branch-notes" },
      { text: "github-setup", link: "/ru/github-setup" },
      { text: "naming", link: "/ru/naming" },
    ],
  },
  {
    text: "Доступ и governance",
    items: [
      { text: "GCP matrix 11×6", link: "/ru/gcp-saas-access-matrix-11x6" },
      { text: "CODEOWNERS matrix", link: "/ru/github-codeowners-matrix" },
      { text: "accounts", link: "/ru/accounts" },
      { text: "accounts (шаблон local)", link: "/ru/accounts-local-example" },
    ],
  },
  {
    text: "Команда 11×6",
    items: [
      { text: "Организация (концепция)", link: "/ru/team-11x6-organization" },
      { text: "Персона: ok-admin", link: "/ru/team-persona-ok-admin" },
      { text: "Персона: gw-devops", link: "/ru/team-persona-gw-devops" },
      { text: "Персона: ux-dev", link: "/ru/team-persona-ux-dev" },
      { text: "Персона: sh-dev", link: "/ru/team-persona-sh-dev" },
      { text: "Персона: pk-qa", link: "/ru/team-persona-pk-qa" },
      { text: "Персона: ok-audit", link: "/ru/team-persona-ok-audit" },
    ],
  },
];

const sidebarEn = [
  {
    text: "Start",
    items: [
      { text: "System philosophy & governance", link: "/en/system-philosophy-governance" },
      { text: "System entry (main)", link: "/en/main" },
      { text: "Simplified model", link: "/en/simplified" },
      { text: "Architecture (overview)", link: "/en/architecture" },
      { text: "Plan & roadmap", link: "/en/plan" },
      { text: "Implementation track", link: "/en/INFRA-IMPLEMENTATION" },
      { text: "System summary (1 page)", link: "/en/system-summary" },
      { text: "Appendix (deep index)", link: "/en/appendix" },
      { text: "Pulumi: main IaC", link: "/en/infra-pulumi-iac" },
      { text: "CLI / console", link: "/en/cli-console" },
      { text: "Pulumi: gke-infra sandbox", link: "/en/infra-pulumi-gke-sandbox" },
      { text: "Table of contents", link: "/en/toc" },
      { text: "Doc reorg report", link: "/REORG-CHANGE-REPORT" },
    ],
  },
  {
    text: "Product",
    items: [
      { text: "prompt (handoff + §9)", link: "/en/prompt" },
      { text: "ML / Data / RAG", link: "/en/ml-data-rag" },
      { text: "HBG: RAG-DOMINANCE strategy", link: "/en/hbg-rag-dominance" },
      { text: "HBG: roles & hiring (HR)", link: "/en/hr-offers-hbg" },
    ],
  },
  {
    text: "Git & GitHub",
    items: [
      { text: "git-workflow", link: "/en/git-workflow" },
      { text: "branch-notes", link: "/en/branch-notes" },
      { text: "github-setup", link: "/en/github-setup" },
      { text: "naming", link: "/en/naming" },
    ],
  },
  {
    text: "Access & governance",
    items: [
      { text: "GCP matrix 11×6", link: "/en/gcp-saas-access-matrix-11x6" },
      { text: "CODEOWNERS matrix", link: "/en/github-codeowners-matrix" },
      { text: "accounts", link: "/en/accounts" },
      { text: "accounts (local template)", link: "/en/accounts-local-example" },
    ],
  },
  {
    text: "Team 11×6",
    items: [
      { text: "Organisation (concept)", link: "/en/team-11x6-organization" },
      { text: "Persona: ok-admin", link: "/en/team-persona-ok-admin" },
      { text: "Persona: gw-devops", link: "/en/team-persona-gw-devops" },
      { text: "Persona: ux-dev", link: "/en/team-persona-ux-dev" },
      { text: "Persona: sh-dev", link: "/en/team-persona-sh-dev" },
      { text: "Persona: pk-qa", link: "/en/team-persona-pk-qa" },
      { text: "Persona: ok-audit", link: "/en/team-persona-ok-audit" },
    ],
  },
];

const sidebarPl = [
  {
    text: "Start",
    items: [
      { text: "Filozofia systemu", link: "/pl/system-philosophy-governance" },
      { text: "Wejście: system (main)", link: "/pl/main" },
      { text: "Uproszczone role", link: "/pl/simplified" },
      { text: "Architektura (przegląd)", link: "/pl/architecture" },
      { text: "Plan i roadmap", link: "/pl/plan" },
      { text: "Implementation track", link: "/pl/INFRA-IMPLEMENTATION" },
      { text: "Podsumowanie (1 str.)", link: "/pl/system-summary" },
      { text: "Dodatek (indeks)", link: "/pl/appendix" },
      { text: "Pulumi: główne IaC", link: "/pl/infra-pulumi-iac" },
      { text: "CLI / console", link: "/pl/cli-console" },
      { text: "Pulumi: piaskownica gke-infra", link: "/pl/infra-pulumi-gke-sandbox" },
      { text: "Spis treści", link: "/pl/toc" },
    ],
  },
  {
    text: "Produkt",
    items: [
      { text: "prompt (handoff + §9)", link: "/pl/prompt" },
      { text: "ML / Data / RAG", link: "/pl/ml-data-rag" },
      { text: "HBG: strategia RAG-DOMINANCE", link: "/pl/hbg-rag-dominance" },
      { text: "HBG: role i rekrutacja (HR)", link: "/pl/hr-offers-hbg" },
    ],
  },
  {
    text: "Git i GitHub",
    items: [
      { text: "git-workflow", link: "/pl/git-workflow" },
      { text: "branch-notes", link: "/pl/branch-notes" },
      { text: "github-setup", link: "/pl/github-setup" },
      { text: "naming", link: "/pl/naming" },
    ],
  },
  {
    text: "Dostęp i governance",
    items: [
      { text: "GCP matrix 11×6", link: "/pl/gcp-saas-access-matrix-11x6" },
      { text: "CODEOWNERS matrix", link: "/pl/github-codeowners-matrix" },
      { text: "accounts", link: "/pl/accounts" },
      { text: "accounts (szablon local)", link: "/pl/accounts-local-example" },
    ],
  },
  {
    text: "Zespół 11×6",
    items: [
      { text: "Organizacja (koncepcja)", link: "/pl/team-11x6-organization" },
      { text: "Persona: ok-admin", link: "/pl/team-persona-ok-admin" },
      { text: "Persona: gw-devops", link: "/pl/team-persona-gw-devops" },
      { text: "Persona: ux-dev", link: "/pl/team-persona-ux-dev" },
      { text: "Persona: sh-dev", link: "/pl/team-persona-sh-dev" },
      { text: "Persona: pk-qa", link: "/pl/team-persona-pk-qa" },
      { text: "Persona: ok-audit", link: "/pl/team-persona-ok-audit" },
    ],
  },
];

export default defineConfig({
  base: vitepressBase(),
  cleanUrls: true,
  locales: {
    root: {
      label: "",
      lang: "en-US",
      title: "HBG",
      description:
        "Camunda 8 + AI credit scoring — documentation (default: PL → /pl/)",
      themeConfig: {
        logo: { src: "/images/hbg-bf1.png", alt: "Handlowy Bank Galicyjski" },
        nav: [
          { text: "English", link: "/en/" },
          { text: "Русский", link: "/ru/" },
          { text: "Polski", link: "/pl/" },
          { text: "ADR", link: "/adr" },
        ],
        sidebar: false,
        search: { provider: "local" },
        socialLinks: [{ icon: "github", link: githubRepo }],
        footer: {
          message: "Sources in the repository; GitHub for code and infra/.",
        },
      },
    },
    ru: {
      label: "Русский",
      lang: "ru-RU",
      link: "/ru/",
      title: "HBG",
      description:
        "Handlowy Bank Galicyjski (HBG) — Camunda 8 + AI credit scoring — документация (вымысел)",
      themeConfig: {
        logo: { src: "/images/hbg-bf1.png", alt: "Handlowy Bank Galicyjski" },
        nav: [
          { text: "Главная", link: "/ru/" },
          { text: "Философия", link: "/ru/system-philosophy-governance" },
          { text: "Main", link: "/ru/main" },
          { text: "Архитектура", link: "/ru/architecture" },
          { text: "План", link: "/ru/plan" },
          { text: "Оглавление", link: "/ru/toc" },
          { text: "Внедрение", link: "/ru/INFRA-IMPLEMENTATION" },
          { text: "ADR", link: "/adr" },
        ],
        sidebar: sidebarRu,
        search: { provider: "local" },
        socialLinks: [{ icon: "github", link: githubRepo }],
        footer: {
          message:
            "Исходники — в репозитории; GitHub для кода и infra/.",
        },
      },
    },
    en: {
      label: "English",
      lang: "en-US",
      link: "/en/",
      title: "HBG",
      description: "Camunda 8 + AI credit scoring — documentation",
      themeConfig: {
        siteTitle: false,
        nav: [
          { text: "Home", link: "/en/" },
          { text: "Philosophy", link: "/en/system-philosophy-governance" },
          { text: "Main", link: "/en/main" },
          { text: "Architecture", link: "/en/architecture" },
          { text: "Plan", link: "/en/plan" },
          { text: "Contents", link: "/en/toc" },
          { text: "Implementation", link: "/en/INFRA-IMPLEMENTATION" },
          { text: "ADR", link: "/adr" },
        ],
        sidebar: sidebarEn,
        search: { provider: "local" },
        socialLinks: [{ icon: "github", link: githubRepo }],
        footer: {
          message: "Sources in the repository; GitHub for code and infra/.",
        },
      },
    },
    pl: {
      label: "Polski",
      lang: "pl-PL",
      link: "/pl/",
      title: "HBG",
      description:
        "Handlowy Bank Galicyjski (HBG) — Camunda 8 + AI (przykład fikcyjny) — dokumentacja",
      themeConfig: {
        logo: { src: "/images/hbg-bf1.png", alt: "Handlowy Bank Galicyjski" },
        nav: [
          { text: "Strona główna", link: "/pl/" },
          { text: "Filozofia", link: "/pl/system-philosophy-governance" },
          { text: "Main", link: "/pl/main" },
          { text: "Architektura", link: "/pl/architecture" },
          { text: "Plan", link: "/pl/plan" },
          { text: "Spis treści", link: "/pl/toc" },
          { text: "Wdrożenie", link: "/pl/INFRA-IMPLEMENTATION" },
          { text: "ADR", link: "/adr" },
        ],
        sidebar: sidebarPl,
        search: { provider: "local" },
        socialLinks: [{ icon: "github", link: githubRepo }],
        footer: {
          message: "Źródła w repozytorium; GitHub pod kod i infra/.",
        },
      },
    },
  },
});
