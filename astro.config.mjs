// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://embedded-purdue.github.io',
  integrations: [
      starlight({
          title: ' ',
          customCss: [
              './src/styles/global.css',
          ],
          social: [
            { icon: 'github', label: 'GitHub', href: 'https://github.com/embedded-purdue' },
            { icon: 'discord', label: 'Discord', href: 'https://discord.gg/EAZpzCr53V' },
            { icon: 'linkedin', label: 'Linkedin', href: 'https://www.linkedin.com/company/embedded-purdue' }
        ],
          sidebar: [
              {
                label: 'Home',
                link: '/'
              },
              {
                  label: 'Projects',
                  autogenerate: { directory: 'projects' },
                  collapsed: true,
              },
              {
                label: 'Workshops',
                autogenerate: { directory: 'workshops' },
                collapsed: true,
              },
              {
                label: 'Sponsor',
                link: '/general/sponsors',

              },
              {
                label: 'Team',
                link: '/general/team',

              },
          ],
          logo: {
              src: './src/assets/logo.svg',
              alt: 'Embedded Systems @ Purdue',
          },
          lastUpdated: true,
          pagination: false,
      }),
	],

  vite: {
    plugins: [tailwindcss()],
  },
});