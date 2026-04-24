import { defineConfig } from "vitepress";

const githubRepo = "https://github.com/OlehKondratow/credit-scoring-camunda";

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
      { text: "Оглавление (все страницы)", link: "/toc" },
      { text: "Архитектура (обзор)", link: "/architecture" },
      { text: "Implementation track", link: "/INFRA-IMPLEMENTATION" },
      { text: "Pulumi: основной IaC", link: "/infra-pulumi-iac" },
      { text: "CLI / console", link: "/cli-console" },
      { text: "Pulumi: gke-infra (песочница)", link: "/infra-pulumi-gke-sandbox" },
    ],
  },
  {
    text: "Продукт",
    items: [
      { text: "prompt (handoff + §9)", link: "/prompt" },
      { text: "ML / Data / RAG", link: "/ml-data-rag" },
      { text: "HBG: стратегия RAG-DOMINANCE", link: "/hbg-rag-dominance" },
      { text: "HBG: роли и вакансии (HR)", link: "/hr-offers-hbg" },
    ],
  },
  {
    text: "Git и GitHub",
    items: [
      { text: "git-workflow", link: "/git-workflow" },
      { text: "branch-notes", link: "/branch-notes" },
      { text: "github-setup", link: "/github-setup" },
      { text: "naming", link: "/naming" },
    ],
  },
  {
    text: "Доступ и governance",
    items: [
      { text: "GCP matrix 11×6", link: "/gcp-saas-access-matrix-11x6" },
      { text: "CODEOWNERS matrix", link: "/github-codeowners-matrix" },
      { text: "accounts", link: "/accounts" },
      { text: "accounts (шаблон local)", link: "/accounts-local-example" },
    ],
  },
];

const sidebarEn = [
  {
    text: "Start",
    items: [
      { text: "Table of contents", link: "/en/toc" },
      { text: "Architecture (overview)", link: "/en/architecture" },
      { text: "Implementation track", link: "/en/INFRA-IMPLEMENTATION" },
      { text: "Pulumi: main IaC", link: "/en/infra-pulumi-iac" },
      { text: "CLI / console", link: "/en/cli-console" },
      { text: "Pulumi: gke-infra sandbox", link: "/en/infra-pulumi-gke-sandbox" },
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
];

const sidebarPl = [
  {
    text: "Start",
    items: [
      { text: "Spis treści", link: "/pl/toc" },
      { text: "Architektura (przegląd)", link: "/pl/architecture" },
      { text: "Implementation track", link: "/pl/INFRA-IMPLEMENTATION" },
      { text: "Pulumi: główne IaC", link: "/pl/infra-pulumi-iac" },
      { text: "CLI / console", link: "/pl/cli-console" },
      { text: "Pulumi: piaskownica gke-infra", link: "/pl/infra-pulumi-gke-sandbox" },
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
];

export default defineConfig({
  base: vitepressBase(),
  cleanUrls: true,
  locales: {
    root: {
      label: "Русский",
      lang: "ru-RU",
      title: "HBG",
      description:
        "Handlowy Bank Galicyjski (HBG) — Camunda 8 + AI credit scoring — документация (вымысел)",
      themeConfig: {
        logo: { src: "/images/hbg-bf1.png", alt: "Handlowy Bank Galicyjski" },
        nav: [
          { text: "Главная", link: "/" },
          { text: "Архитектура", link: "/architecture" },
          { text: "Infra track", link: "/INFRA-IMPLEMENTATION" },
          { text: "Оглавление", link: "/toc" },
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
          { text: "Architecture", link: "/en/architecture" },
          { text: "Infra track", link: "/en/INFRA-IMPLEMENTATION" },
          { text: "Contents", link: "/en/toc" },
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
          { text: "Architektura", link: "/pl/architecture" },
          { text: "Infra track", link: "/pl/INFRA-IMPLEMENTATION" },
          { text: "Spis treści", link: "/pl/toc" },
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
