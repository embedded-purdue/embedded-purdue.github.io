import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://embedded-purdue.github.io',
  integrations: [
    starlight({
      title: 'Embedded Systems at Purdue',
      logo: {
        src: './src/assets/logo.svg',
        replacesTitle: true,
      },
      customCss: [
        './src/styles/custom.css',
      ],
      social: {
        github: 'https://github.com/embedded-purdue',
        discord: 'https://discord.gg/MkPv9s9cj3',
      },
      sidebar: [
        {
          label: 'About',
          items: [
            { label: 'About Us', link: '/about/' },
            { label: 'Sponsors', link: '/about/sponsors/' },
          ],
        },
        {
          label: 'Projects',
          items: [
            { label: 'All Projects', link: '/projects/projects/' },
          ],
        },
        {
          label: 'Workshops',
          items: [
            { label: 'All Workshops', link: '/workshops/' },
          ],
        },
        {
          label: 'Blog',
          items: [
            { label: 'All Posts', link: '/blog/' },
          ],
        },
      ],
      components: {
        Header: './src/components/Header.astro',
        Hero: './src/components/Hero.astro',
      },
    }),
    tailwind({
      applyBaseStyles: false,
    }),
  ],
});
