import { getBlogPermalink, getPermalink, getAsset } from './utils/permalinks';

export const headerData = {
  links: [
    { text: 'Highlights', href: getPermalink('/highlights') },
    {
      text: 'Blog',
      links: [
        { text: 'All posts', href: getBlogPermalink() },
        { text: 'Tags', href: getPermalink('/tags') },
      ],
    },
    { text: 'About', href: getPermalink('/about') },
  ],
  actions: [],
};

export const footerData = {
  links: [],
  secondaryLinks: [],
  socialLinks: [
    { ariaLabel: 'RSS', icon: 'tabler:rss', href: getAsset('/rss.xml') },
    { ariaLabel: 'GitHub', icon: 'tabler:brand-github', href: 'https://github.com/xianxu' },
    { ariaLabel: 'LinkedIn', icon: 'tabler:brand-linkedin', href: 'https://www.linkedin.com/in/xianxu' },
  ],
  footNote: `
    © 2026 <span class="font-medium">Xian Xu</span> · Personal thoughts on current events, society and technology.
  `,
};
