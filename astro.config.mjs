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
            { icon: 'discord', label: 'Discord', href: 'https://discord.gg/9mRXKDxaru' },
            { icon: 'linkedin', label: 'Linkedin', href: 'https://www.linkedin.com/company/embedded-purdue' }
        ],
          sidebar: [
              {
                label: '🏡 Home',
                link: '/'
              },
              {
                label: 'ℹ️  About',
                autogenerate: { directory: 'about' },
              },
              {
                  label: '🛠️ Projects',
                  autogenerate: { directory: 'projects' },
                  collapsed: true,
              },
              {
                label: '🧑‍🏫 Workshops',
                autogenerate: { directory: 'workshops' },
                collapsed: true,
              },
              {
                label: '📚 Resources',
                autogenerate: { directory: 'resources' },
                collapsed: true,
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
