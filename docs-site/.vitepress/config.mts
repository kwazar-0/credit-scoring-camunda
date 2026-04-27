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
      { text: "Вход в систему (main)", link: "/ru/main" },
      { text: "Сводка (1 стр.)", link: "/ru/system-summary" },
      { text: "Архитектура (1 страница)", link: "/ru/architecture" },
    ],
  },
  {
    text: "LEVEL 1 — Система (как работает)",
    items: [
      { text: "Camunda process flow", link: "/ru/process-flow-camunda" },
      { text: "DMN decision model", link: "/ru/decision-model-dmn" },
      { text: "Системная философия", link: "/ru/system-philosophy-governance" },
    ],
  },
  {
    text: "LEVEL 2 — Governance (кто)",
    items: [
      { text: "GCP access matrix 11x6", link: "/ru/gcp-saas-access-matrix-11x6" },
      { text: "CODEOWNERS matrix", link: "/ru/github-codeowners-matrix" },
      { text: "team 11x6", link: "/ru/team-11x6-organization" },
      { text: "Git workflow", link: "/ru/git-workflow" },
    ],
  },
  {
    text: "LEVEL 3 — Инфраструктура (где работает)",
    items: [
      { text: "Pulumi и GKE runtime", link: "/ru/pulumi-and-gke-runtime" },
      { text: "Pulumi IaC (детали)", link: "/ru/infra-pulumi-iac" },
      { text: "GKE sandbox", link: "/ru/infra-pulumi-gke-sandbox" },
      { text: "Implementation track", link: "/ru/INFRA-IMPLEMENTATION" },
    ],
  },
  {
    text: "LEVEL 4 — Operations (DevOps)",
    items: [
      { text: "Deployment", link: "/ru/ops/deployment" },
      { text: "CI/CD", link: "/ru/ops/cicd" },
      { text: "Observability", link: "/ru/ops/observability" },
      { text: "Incidents", link: "/ru/ops/incidents" },
      {
        text: "Camunda GKE + Modeler",
        link: "/ru/camunda-gke-deploy-modeler",
      },
    ],
  },
  {
    text: "Референсы",
    items: [
      { text: "CLI / console", link: "/ru/cli-console" },
      { text: "Appendix", link: "/ru/appendix" },
    ],
  },
];

const sidebarEn = [
  {
    text: "LEVEL 0 — Entry",
    items: [
      { text: "System entry (main)", link: "/en/main" },
      { text: "System summary (1 page)", link: "/en/system-summary" },
      { text: "Architecture (1 page)", link: "/en/architecture" },
    ],
  },
  {
    text: "LEVEL 1 — System (how it works)",
    items: [
      { text: "Camunda process flow", link: "/en/process-flow-camunda" },
      { text: "DMN decision model", link: "/en/decision-model-dmn" },
      { text: "System philosophy", link: "/en/system-philosophy-governance" },
    ],
  },
  {
    text: "LEVEL 2 — Governance (who)",
    items: [
      { text: "GCP access matrix 11x6", link: "/en/gcp-saas-access-matrix-11x6" },
      { text: "CODEOWNERS matrix", link: "/en/github-codeowners-matrix" },
      { text: "Team 11x6 organization", link: "/en/team-11x6-organization" },
      { text: "Git workflow", link: "/en/git-workflow" },
    ],
  },
  {
    text: "LEVEL 3 — Infrastructure (where it runs)",
    items: [
      { text: "Pulumi and GKE runtime", link: "/en/pulumi-and-gke-runtime" },
      { text: "Pulumi IaC details", link: "/en/infra-pulumi-iac" },
      { text: "GKE sandbox", link: "/en/infra-pulumi-gke-sandbox" },
      { text: "Implementation track", link: "/en/INFRA-IMPLEMENTATION" },
    ],
  },
  {
    text: "LEVEL 4 — Operations (DevOps)",
    items: [
      { text: "Deployment", link: "/en/ops/deployment" },
      { text: "CI/CD", link: "/en/ops/cicd" },
      { text: "Observability", link: "/en/ops/observability" },
      { text: "Incidents", link: "/en/ops/incidents" },
      {
        text: "Camunda GKE + Modeler",
        link: "/en/camunda-gke-deploy-modeler",
      },
    ],
  },
  {
    text: "References",
    items: [
      { text: "CLI / console", link: "/en/cli-console" },
      { text: "Appendix", link: "/en/appendix" },
    ],
  },
];

const sidebarPl = [
  {
    text: "LEVEL 0 — Wejście",
    items: [
      { text: "Wejście do systemu (main)", link: "/pl/main" },
      { text: "Podsumowanie (1 str.)", link: "/pl/system-summary" },
      { text: "Architektura (1 strona)", link: "/pl/architecture" },
    ],
  },
  {
    text: "LEVEL 1 — System (jak dziala)",
    items: [
      { text: "Camunda process flow", link: "/pl/process-flow-camunda" },
      { text: "DMN decision model", link: "/pl/decision-model-dmn" },
      { text: "Filozofia systemu", link: "/pl/system-philosophy-governance" },
    ],
  },
  {
    text: "LEVEL 2 — Governance (kto)",
    items: [
      { text: "GCP access matrix 11x6", link: "/pl/gcp-saas-access-matrix-11x6" },
      { text: "CODEOWNERS matrix", link: "/pl/github-codeowners-matrix" },
      { text: "Team 11x6 organization", link: "/pl/team-11x6-organization" },
      { text: "Git workflow", link: "/pl/git-workflow" },
    ],
  },
  {
    text: "LEVEL 3 — Infrastruktura (gdzie dziala)",
    items: [
      { text: "Pulumi and GKE runtime", link: "/pl/pulumi-and-gke-runtime" },
      { text: "Pulumi IaC (detale)", link: "/pl/infra-pulumi-iac" },
      { text: "GKE sandbox", link: "/pl/infra-pulumi-gke-sandbox" },
      { text: "Implementation track", link: "/pl/INFRA-IMPLEMENTATION" },
    ],
  },
  {
    text: "LEVEL 4 — Operations (DevOps)",
    items: [
      { text: "Deployment", link: "/pl/ops/deployment" },
      { text: "CI/CD", link: "/pl/ops/cicd" },
      { text: "Observability", link: "/pl/ops/observability" },
      { text: "Incidents", link: "/pl/ops/incidents" },
      {
        text: "Camunda GKE + Modeler",
        link: "/pl/camunda-gke-deploy-modeler",
      },
    ],
  },
  {
    text: "Referencje",
    items: [
      { text: "CLI / console", link: "/pl/cli-console" },
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
        "Camunda 8 credit scoring — documentation (default: PL → /pl/)",
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
        "Handlowy Bank Galicyjski (HBG) — Camunda 8 credit scoring — документация (вымысел)",
      themeConfig: {
        logo: { src: "/images/hbg-bf1.png", alt: "Handlowy Bank Galicyjski" },
        nav: [
          { text: "Главная", link: "/ru/" },
          { text: "System", link: "/ru/main" },
          { text: "Operations (DevOps)", link: "/ru/ops/deployment" },
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
      description: "Camunda 8 credit scoring — documentation",
      themeConfig: {
        siteTitle: false,
        nav: [
          { text: "Home", link: "/en/" },
          { text: "System", link: "/en/main" },
          { text: "Operations (DevOps)", link: "/en/ops/deployment" },
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
        "Handlowy Bank Galicyjski (HBG) — Camunda 8 (przykład fikcyjny) — dokumentacja",
      themeConfig: {
        logo: { src: "/images/hbg-bf1.png", alt: "Handlowy Bank Galicyjski" },
        nav: [
          { text: "Strona główna", link: "/pl/" },
          { text: "System", link: "/pl/main" },
          { text: "Operations (DevOps)", link: "/pl/ops/deployment" },
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
