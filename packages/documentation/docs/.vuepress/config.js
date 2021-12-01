const { description } = require('../../package.json');

module.exports = {
  /**
   * Ref：https://v1.vuepress.vuejs.org/config/#title
   */
  title: 'Social Media Archiver',
  /**
   * Ref：https://v1.vuepress.vuejs.org/config/#description
   */
  description: description,

  /**
   * Extra tags to be injected to the page HTML `<head>`
   *
   * ref：https://v1.vuepress.vuejs.org/config/#head
   */
  head: [
    ['meta', { name: 'theme-color', content: '#3eaf7c' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    [
      'meta',
      { name: 'apple-mobile-web-app-status-bar-style', content: 'black' },
    ],
  ],

  /**
   * Theme configuration, here is the default theme configuration for VuePress.
   *
   * ref：https://v1.vuepress.vuejs.org/theme/default-theme-config.html
   */
  themeConfig: {
    repo: '',
    editLinks: false,
    docsDir: '',
    editLinkText: '',
    lastUpdated: false,

    locales: {
      '/': {
        // text for the language dropdown
        selectText: 'Languages',
        // label for this locale in the language dropdown
        label: 'English',
        // Aria Label for locale in the dropdown
        ariaLabel: 'Languages',
        // text for the edit-on-github link
        editLinkText: 'Edit this page on GitHub',
        // config for Service Worker
        serviceWorker: {
          updatePopup: {
            message: 'New content is available.',
            buttonText: 'Refresh',
          },
        },
        // algolia docsearch options for current locale
        algolia: {},
        nav: [
          {
            text: 'Guide',
            link: '/guide/',
          },
          {
            text: 'Config',
            link: '/config/',
          },
          {
            text: 'Github',
            link: 'https://github.com/Combo819/social-media-archiver',
          },
        ],
        sidebar: {
          '/guide/': getGuideSidebar(
            'Guide',
            'Component',
            'Release',
            'Disclaimer',
          ),
        },
      },
      '/zh/': {
        selectText: '选择语言',
        label: '简体中文',
        editLinkText: '在 GitHub 上编辑此页',
        serviceWorker: {
          updatePopup: {
            message: '发现新内容可用.',
            buttonText: '刷新',
          },
        },
        nav: [
          {
            text: '指导',
            link: '/zh/guide/',
          },
          {
            text: '配置',
            link: '/zh/config/',
          },
          {
            text: 'Github',
            link: 'https://github.com/Combo819/social-media-archiver',
          },
        ],
        algolia: {},
        sidebar: {},
      },
    },
  },

  /**
   * Apply plugins，ref：https://v1.vuepress.vuejs.org/zh/plugin/
   */
  plugins: ['@vuepress/plugin-back-to-top', '@vuepress/plugin-medium-zoom'],
  locales: {
    // The key is the path for the locale to be nested under.
    // As a special case, the default locale can use '/' as its path.
    '/': {
      lang: 'English', // this will be set as the lang attribute on <html>
      title: 'Social Media Archiver',
      description:
        'Social Media Archiver is a Node.js template to be implemented to archive post from any social media.',
    },
    '/zh/': {
      lang: '简体中文',
      title: 'Social Media Archiver',
      description:
        'Social Media Archiver， 一个Node.js模板，用于搭建归档社交媒体帖子的工具',
    },
  },
};

function getGuideSidebar(groupA, groupB, groupC, groupD) {
  return [
    {
      title: groupA,
      collapsable: true,
      children: ['', 'get-start'],
    },
    {
      title: groupB,
      collapsable: true,
      children: [
        'post',
        'user',
        'comment',
        'repost-comment',
        'subcomment',
        'account',
        "video",
      ],
    },
    {
      title: groupC,
      collapsable: true,
      children: ['build', 'publish'],
    },
    {
      title: groupD,
      collapsable: true,
      children: ['disclaimer'],
    },
  ];
}
