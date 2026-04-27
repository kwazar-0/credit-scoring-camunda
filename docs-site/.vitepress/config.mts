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
    text: "LEVEL 0 — Вход",
    items: [
      { text: "Вход: система (main)", link: "/ru/main" },
      { text: "Упрощённые роли", link: "/ru/simplified" },
      { text: "Сводка (1 стр.)", link: "/ru/system-summary" },
    ],
  },
  {
    text: "LEVEL 1 — Понимание системы",
    items: [
      { text: "Архитектура", link: "/ru/architecture" },
      { text: "Camunda: поток процесса", link: "/ru/process-flow-camunda" },
      { text: "DMN: модель решений", link: "/ru/decision-model-dmn" },
      { text: "План и roadmap", link: "/ru/plan" },
    ],
  },
  {
    text: "LEVEL 2 — Governance",
    items: [
      { text: "Философия системы", link: "/ru/system-philosophy-governance" },
      { text: "GCP matrix 11×6", link: "/ru/gcp-saas-access-matrix-11x6" },
      { text: "git-workflow", link: "/ru/git-workflow" },
      { text: "CODEOWNERS matrix", link: "/ru/github-codeowners-matrix" },
      { text: "branch-notes", link: "/ru/branch-notes" },
      { text: "github-setup", link: "/ru/github-setup" },
    ],
  },
  {
    text: "LEVEL 3 — Инфраструктура",
    items: [
      { text: "Implementation track", link: "/ru/INFRA-IMPLEMENTATION" },
      { text: "Pulumi: основной IaC", link: "/ru/infra-pulumi-iac" },
      { text: "Pulumi: gke-infra (песочница)", link: "/ru/infra-pulumi-gke-sandbox" },
      { text: "accounts", link: "/ru/accounts" },
      { text: "naming", link: "/ru/naming" },
    ],
  },
  {
    text: "LEVEL 4 — Deep Technical",
    items: [
      { text: "ML / Data / RAG", link: "/ru/ml-data-rag" },
      { text: "HBG: стратегия RAG-DOMINANCE", link: "/ru/hbg-rag-dominance" },
      { text: "CLI / console", link: "/ru/cli-console" },
      { text: "prompt (handoff + §9)", link: "/ru/prompt" },
      { text: "HBG: роли и вакансии (HR)", link: "/ru/hr-offers-hbg" },
      { text: "accounts (шаблон local)", link: "/ru/accounts-local-example" },
    ],
  },
  {
    text: "Референсы",
    items: [
      { text: "Организация (концепция)", link: "/ru/team-11x6-organization" },
      { text: "Персона: ok-admin", link: "/ru/team-persona-ok-admin" },
      { text: "Персона: gw-devops", link: "/ru/team-persona-gw-devops" },
      { text: "Персона: ux-dev", link: "/ru/team-persona-ux-dev" },
      { text: "Персона: sh-dev", link: "/ru/team-persona-sh-dev" },
      { text: "Персона: pk-qa", link: "/ru/team-persona-pk-qa" },
      { text: "Персона: ok-audit", link: "/ru/team-persona-ok-audit" },
      { text: "Приложение (индекс)", link: "/ru/appendix" },
      { text: "Оглавление (все страницы)", link: "/ru/toc" },
    ],
  },
];

const sidebarEn = [
  {
    text: "LEVEL 0 — Entry",
    items: [
      { text: "System entry (main)", link: "/en/main" },
      { text: "Simplified model", link: "/en/simplified" },
      { text: "System summary (1 page)", link: "/en/system-summary" },
    ],
  },
  {
    text: "LEVEL 1 — System Understanding",
    items: [
      { text: "Architecture", link: "/en/architecture" },
      { text: "Camunda Process Flow", link: "/en/process-flow-camunda" },
      { text: "DMN Decision Model", link: "/en/decision-model-dmn" },
      { text: "Plan & roadmap", link: "/en/plan" },
    ],
  },
  {
    text: "LEVEL 2 — Governance",
    items: [
      { text: "System philosophy & governance", link: "/en/system-philosophy-governance" },
      { text: "GCP matrix 11×6", link: "/en/gcp-saas-access-matrix-11x6" },
      { text: "git-workflow", link: "/en/git-workflow" },
      { text: "CODEOWNERS matrix", link: "/en/github-codeowners-matrix" },
      { text: "branch-notes", link: "/en/branch-notes" },
      { text: "github-setup", link: "/en/github-setup" },
    ],
  },
  {
    text: "LEVEL 3 — Infrastructure",
    items: [
      { text: "Implementation track", link: "/en/INFRA-IMPLEMENTATION" },
      { text: "Pulumi: main IaC", link: "/en/infra-pulumi-iac" },
      { text: "Pulumi: gke-infra sandbox", link: "/en/infra-pulumi-gke-sandbox" },
      { text: "accounts", link: "/en/accounts" },
      { text: "naming", link: "/en/naming" },
    ],
  },
  {
    text: "LEVEL 4 — Deep Technical",
    items: [
      { text: "ML / Data / RAG", link: "/en/ml-data-rag" },
      { text: "HBG: RAG-DOMINANCE strategy", link: "/en/hbg-rag-dominance" },
      { text: "CLI / console", link: "/en/cli-console" },
      { text: "prompt (handoff + §9)", link: "/en/prompt" },
      { text: "HBG: roles & hiring (HR)", link: "/en/hr-offers-hbg" },
      { text: "accounts (local template)", link: "/en/accounts-local-example" },
    ],
  },
  {
    text: "References",
    items: [
      { text: "Organisation (concept)", link: "/en/team-11x6-organization" },
      { text: "Persona: ok-admin", link: "/en/team-persona-ok-admin" },
      { text: "Persona: gw-devops", link: "/en/team-persona-gw-devops" },
      { text: "Persona: ux-dev", link: "/en/team-persona-ux-dev" },
      { text: "Persona: sh-dev", link: "/en/team-persona-sh-dev" },
      { text: "Persona: pk-qa", link: "/en/team-persona-pk-qa" },
      { text: "Persona: ok-audit", link: "/en/team-persona-ok-audit" },
      { text: "Appendix (deep index)", link: "/en/appendix" },
      { text: "Table of contents", link: "/en/toc" },
      { text: "Doc reorg report", link: "/REORG-CHANGE-REPORT" },
    ],
  },
];

const sidebarPl = [
  {
    text: "LEVEL 0 — Wejście",
    items: [
      { text: "Wejście: system (main)", link: "/pl/main" },
      { text: "Uproszczone role", link: "/pl/simplified" },
      { text: "Podsumowanie (1 str.)", link: "/pl/system-summary" },
    ],
  },
  {
    text: "LEVEL 1 — Zrozumienie systemu",
    items: [
      { text: "Architektura", link: "/pl/architecture" },
      { text: "Camunda: przepływ procesu", link: "/pl/process-flow-camunda" },
      { text: "DMN: model decyzji", link: "/pl/decision-model-dmn" },
      { text: "Plan i roadmap", link: "/pl/plan" },
    ],
  },
  {
    text: "LEVEL 2 — Governance",
    items: [
      { text: "Filozofia systemu", link: "/pl/system-philosophy-governance" },
      { text: "GCP matrix 11×6", link: "/pl/gcp-saas-access-matrix-11x6" },
      { text: "git-workflow", link: "/pl/git-workflow" },
      { text: "CODEOWNERS matrix", link: "/pl/github-codeowners-matrix" },
      { text: "branch-notes", link: "/pl/branch-notes" },
      { text: "github-setup", link: "/pl/github-setup" },
    ],
  },
  {
    text: "LEVEL 3 — Infrastruktura",
    items: [
      { text: "Implementation track", link: "/pl/INFRA-IMPLEMENTATION" },
      { text: "Pulumi: główne IaC", link: "/pl/infra-pulumi-iac" },
      { text: "Pulumi: piaskownica gke-infra", link: "/pl/infra-pulumi-gke-sandbox" },
      { text: "accounts", link: "/pl/accounts" },
      { text: "naming", link: "/pl/naming" },
    ],
  },
  {
    text: "LEVEL 4 — Deep Technical",
    items: [
      { text: "ML / Data / RAG", link: "/pl/ml-data-rag" },
      { text: "HBG: strategia RAG-DOMINANCE", link: "/pl/hbg-rag-dominance" },
      { text: "CLI / console", link: "/pl/cli-console" },
      { text: "prompt (handoff + §9)", link: "/pl/prompt" },
      { text: "HBG: role i rekrutacja (HR)", link: "/pl/hr-offers-hbg" },
      { text: "accounts (szablon local)", link: "/pl/accounts-local-example" },
    ],
  },
  {
    text: "Referencje",
    items: [
      { text: "Organizacja (koncepcja)", link: "/pl/team-11x6-organization" },
      { text: "Persona: ok-admin", link: "/pl/team-persona-ok-admin" },
      { text: "Persona: gw-devops", link: "/pl/team-persona-gw-devops" },
      { text: "Persona: ux-dev", link: "/pl/team-persona-ux-dev" },
      { text: "Persona: sh-dev", link: "/pl/team-persona-sh-dev" },
      { text: "Persona: pk-qa", link: "/pl/team-persona-pk-qa" },
      { text: "Persona: ok-audit", link: "/pl/team-persona-ok-audit" },
      { text: "Dodatek (indeks)", link: "/pl/appendix" },
      { text: "Spis treści", link: "/pl/toc" },
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
