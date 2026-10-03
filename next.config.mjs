// next.config.mjs
import createMDX from "@next/mdx";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";
import remarkGfm from "remark-gfm";

const shouldStaticExport = process.env.STATIC_EXPORT === "1" || process.env.GITHUB_PAGES === "1";

const withMDX = createMDX({
  options: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      rehypeSlug,
      [rehypeAutolinkHeadings, { behavior: "append" }],
      [rehypePrettyCode, { theme: "github-dark", keepBackground: false }],
    ],
  },
});

/** @type {import('next').NextConfig} */
const baseConfig = {
  trailingSlash: true,

  // Uncomment if deploying under a subpath (project pages).
  // basePath / assetPrefix can be reintroduced for repo-scoped static hosts.

  pageExtensions: ["ts", "tsx", "md", "mdx"],
  experimental: { mdxRs: true },
  outputFileTracingExcludes: {
    "/api/cms/*": [".next/cache/**/*", "public/**/*", ".git/**/*"],
  },
};

if (shouldStaticExport) {
  baseConfig.output = "export";              // GitHub Pages/static artifact builds only.
  baseConfig.images = { unoptimized: true }; // no Image Optimization on static hosts
} else {
  baseConfig.images = { unoptimized: false };
}

const nextConfig = withMDX(baseConfig);

export default nextConfig;
