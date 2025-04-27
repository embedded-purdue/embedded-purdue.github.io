// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
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
                  label: 'Start Here',
                  autogenerate: { directory: 'start-here' },
              },
              {
                  label: 'Projects',
                  autogenerate: { directory: 'projects' },
              },
              {
                label: 'Workshops',
                autogenerate: { directory: 'workshops' },
              },
              {
                label: 'Professional Development',
                autogenerate: { directory: 'pro-dev' },
              },
          ],
          logo: {
              src: './src/assets/logo.svg',
              alt: 'Embedded Systems @ Purdue',
          },
      }),
	],

  vite: {
    plugins: [tailwindcss()],
  },
});