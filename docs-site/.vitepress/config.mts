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
      { text: "DevOps operating model", link: "/ru/devops-operating-model" },
      { text: "Сводка (1 стр.)", link: "/ru/system-summary" },
      { text: "Архитектура (1 страница)", link: "/ru/architecture" },
    ],
  },
  {
    text: "LEVEL 1 — Как это работает",
    items: [
      { text: "CI/CD pipeline", link: "/ru/cicd-pipeline" },
      { text: "Deployment lifecycle", link: "/ru/deployment-lifecycle" },
      { text: "Стратегия сред", link: "/ru/INFRA-IMPLEMENTATION" },
      { text: "Git workflow", link: "/ru/git-workflow" },
    ],
  },
  {
    text: "LEVEL 2 — Инфраструктура",
    items: [
      { text: "Pulumi и GKE runtime", link: "/ru/pulumi-and-gke-runtime" },
      { text: "Pulumi IaC (детали)", link: "/ru/infra-pulumi-iac" },
      { text: "GKE sandbox", link: "/ru/infra-pulumi-gke-sandbox" },
      { text: "GCP access matrix 11x6", link: "/ru/gcp-saas-access-matrix-11x6" },
    ],
  },
  {
    text: "LEVEL 3 — Операции",
    items: [
      { text: "Observability & incidents", link: "/ru/observability-and-incident" },
      { text: "CLI / console", link: "/ru/cli-console" },
      { text: "Runbook index", link: "/ru/toc" },
    ],
  },
  {
    text: "LEVEL 4 — Governance",
    items: [
      { text: "Governance and controls", link: "/ru/governance-and-controls" },
      { text: "CODEOWNERS matrix", link: "/ru/github-codeowners-matrix" },
      { text: "team 11x6", link: "/ru/team-11x6-organization" },
    ],
  },
  {
    text: "LEVEL 5 — Deep Dive",
    items: [
      { text: "Camunda process flow", link: "/ru/process-flow-camunda" },
      { text: "DMN decision model", link: "/ru/decision-model-dmn" },
      { text: "ML / Data / RAG", link: "/ru/ml-data-rag" },
      { text: "Appendix", link: "/ru/appendix" },
    ],
  },
];

const sidebarEn = [
  {
    text: "LEVEL 0 — Entry",
    items: [
      { text: "DevOps operating model", link: "/en/devops-operating-model" },
      { text: "System summary (1 page)", link: "/en/system-summary" },
      { text: "Architecture (1 page)", link: "/en/architecture" },
    ],
  },
  {
    text: "LEVEL 1 — How It Runs",
    items: [
      { text: "CI/CD pipeline", link: "/en/cicd-pipeline" },
      { text: "Deployment lifecycle", link: "/en/deployment-lifecycle" },
      { text: "Environment strategy", link: "/en/INFRA-IMPLEMENTATION" },
      { text: "Git workflow", link: "/en/git-workflow" },
    ],
  },
  {
    text: "LEVEL 2 — Infrastructure",
    items: [
      { text: "Pulumi and GKE runtime", link: "/en/pulumi-and-gke-runtime" },
      { text: "Pulumi IaC details", link: "/en/infra-pulumi-iac" },
      { text: "GKE sandbox", link: "/en/infra-pulumi-gke-sandbox" },
      { text: "GCP access matrix 11x6", link: "/en/gcp-saas-access-matrix-11x6" },
    ],
  },
  {
    text: "LEVEL 3 — Operations",
    items: [
      { text: "Observability and incidents", link: "/en/observability-and-incident" },
      { text: "CLI / console", link: "/en/cli-console" },
      { text: "Operations index", link: "/en/toc" },
    ],
  },
  {
    text: "LEVEL 4 — Governance",
    items: [
      { text: "Governance and controls", link: "/en/governance-and-controls" },
      { text: "CODEOWNERS matrix", link: "/en/github-codeowners-matrix" },
      { text: "Team 11x6 organization", link: "/en/team-11x6-organization" },
    ],
  },
  {
    text: "LEVEL 5 — Deep Dive",
    items: [
      { text: "Camunda process flow", link: "/en/process-flow-camunda" },
      { text: "DMN decision model", link: "/en/decision-model-dmn" },
      { text: "ML / Data / RAG", link: "/en/ml-data-rag" },
      { text: "Appendix", link: "/en/appendix" },
    ],
  },
];

const sidebarPl = [
  {
    text: "LEVEL 0 — Wejście",
    items: [
      { text: "DevOps operating model", link: "/pl/devops-operating-model" },
      { text: "Podsumowanie (1 str.)", link: "/pl/system-summary" },
      { text: "Architektura (1 strona)", link: "/pl/architecture" },
    ],
  },
  {
    text: "LEVEL 1 — Jak to dziala",
    items: [
      { text: "CI/CD pipeline", link: "/pl/cicd-pipeline" },
      { text: "Deployment lifecycle", link: "/pl/deployment-lifecycle" },
      { text: "Strategia srodowisk", link: "/pl/INFRA-IMPLEMENTATION" },
      { text: "Git workflow", link: "/pl/git-workflow" },
    ],
  },
  {
    text: "LEVEL 2 — Infrastruktura",
    items: [
      { text: "Pulumi and GKE runtime", link: "/pl/pulumi-and-gke-runtime" },
      { text: "Pulumi IaC (detale)", link: "/pl/infra-pulumi-iac" },
      { text: "GKE sandbox", link: "/pl/infra-pulumi-gke-sandbox" },
      { text: "GCP access matrix 11x6", link: "/pl/gcp-saas-access-matrix-11x6" },
    ],
  },
  {
    text: "LEVEL 3 — Operacje",
    items: [
      { text: "Observability and incidents", link: "/pl/observability-and-incident" },
      { text: "CLI / console", link: "/pl/cli-console" },
      { text: "Operations index", link: "/pl/toc" },
    ],
  },
  {
    text: "LEVEL 4 — Governance",
    items: [
      { text: "Governance and controls", link: "/pl/governance-and-controls" },
      { text: "CODEOWNERS matrix", link: "/pl/github-codeowners-matrix" },
      { text: "Team 11x6 organization", link: "/pl/team-11x6-organization" },
    ],
  },
  {
    text: "LEVEL 5 — Deep Dive",
    items: [
      { text: "Camunda process flow", link: "/pl/process-flow-camunda" },
      { text: "DMN decision model", link: "/pl/decision-model-dmn" },
      { text: "ML / Data / RAG", link: "/pl/ml-data-rag" },
      { text: "Dodatek", link: "/pl/appendix" },
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
          { text: "DevOps", link: "/ru/devops-operating-model" },
          { text: "CI/CD", link: "/ru/cicd-pipeline" },
          { text: "Deploy", link: "/ru/deployment-lifecycle" },
          { text: "Ops", link: "/ru/observability-and-incident" },
          { text: "Governance", link: "/ru/governance-and-controls" },
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
          { text: "DevOps", link: "/en/devops-operating-model" },
          { text: "CI/CD", link: "/en/cicd-pipeline" },
          { text: "Deploy", link: "/en/deployment-lifecycle" },
          { text: "Ops", link: "/en/observability-and-incident" },
          { text: "Governance", link: "/en/governance-and-controls" },
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
          { text: "DevOps", link: "/pl/devops-operating-model" },
          { text: "CI/CD", link: "/pl/cicd-pipeline" },
          { text: "Deploy", link: "/pl/deployment-lifecycle" },
          { text: "Ops", link: "/pl/observability-and-incident" },
          { text: "Governance", link: "/pl/governance-and-controls" },
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
