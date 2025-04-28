# Embedded Purdue GitHub Documentation

[![Built with Starlight](https://astro.badg.es/v2/built-with-starlight/tiny.svg)](https://starlight.astro.build)

## 🚀 Project Overview

This project is built using Astro and the Starlight starter kit. It serves as documentation for the Embedded Purdue GitHub organization.

### Key Features
- **Markdown-based Documentation**: Write content in `.md` or `.mdx` files located in `src/content/docs/`.
- **Static Assets**: Store images and other assets in `src/assets/`.
- **Public Directory**: Place static files like favicons in the `public/` directory.

## 📂 Project Structure

```
.
├── public/               # Static files accessible in the root URL
├── src/
│   ├── assets/           # Images and other media assets
│   ├── content/          # Documentation content
│   │   ├── docs/         # Markdown files for documentation
│   └── content.config.ts # Content configuration
├── astro.config.mjs      # Astro configuration file
├── package.json          # Project dependencies and scripts
├── tsconfig.json         # TypeScript configuration
```

## 🛠️ Commands

Run the following commands from the root of the project:

| Command                   | Description                                      |
|---------------------------|--------------------------------------------------|
| `npm install`             | Install project dependencies                     |
| `npm run dev`             | Start the development server at `localhost:4321`|
| `npm run build`           | Build the project for production                |
| `npm run preview`         | Preview the production build locally            |
| `npm run astro ...`       | Run Astro CLI commands                          |
| `npm run astro -- --help` | Get help for Astro CLI commands                 |

## 🌐 Resources

- [Starlight Documentation](https://starlight.astro.build/)
- [Astro Documentation](https://docs.astro.build/)
- [Astro Discord Community](https://astro.build/chat)
