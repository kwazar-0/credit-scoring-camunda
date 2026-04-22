import { defineConfig } from "vitepress";

export default defineConfig({
  title: "Millennium Credit",
  description: "Camunda 8 + AI credit scoring — docs",
  lang: "ru-RU",
  cleanUrls: true,
  themeConfig: {
    search: { provider: "local" },
    nav: [
      { text: "Главная", link: "/" },
      { text: "Infra track", link: "/INFRA-IMPLEMENTATION" },
      { text: "Оглавление", link: "/toc" },
    ],
    sidebar: [
      {
        text: "Старт",
        items: [
          { text: "Оглавление (все страницы)", link: "/toc" },
          { text: "Implementation track", link: "/INFRA-IMPLEMENTATION" },
          { text: "CLI / console", link: "/cli-console" },
        ],
      },
      {
        text: "Продукт",
        items: [
          { text: "prompt (handoff + §9)", link: "/prompt" },
          { text: "ML / Data / RAG", link: "/ml-data-rag" },
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
    ],
    socialLinks: [
      {
        icon: "github",
        link: "https://github.com/OlehKondratow/credit-scoring-camunda",
      },
    ],
    footer: {
      message: "Исходники — в репозитории; GitHub для кода и infra/.",
    },
  },
});
