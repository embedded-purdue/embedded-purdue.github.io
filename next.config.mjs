// next.config.mjs
import createMDX from "@next/mdx";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";
import remarkGfm from "remark-gfm";

const isProd = process.env.NODE_ENV === "production";
// If deploying to a project path (e.g. username.github.io/repo), set this in repo vars.
const repo = process.env.NEXT_PUBLIC_REPO_NAME || "";

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

  // Uncomment if deploying under a subpath (project pages). Also set NEXT_PUBLIC_REPO_NAME.
  // basePath: isProd && repo ? `/${repo}` : undefined,
  // assetPrefix: isProd && repo ? `/${repo}/` : undefined,

  pageExtensions: ["ts", "tsx", "md", "mdx"],
  experimental: { mdxRs: true },
};

if (isProd) {
  baseConfig.output = "export";             // ← replaces `next export`
  baseConfig.images = { unoptimized: true }; // no Image Optimization on GH Pages
} else {
  baseConfig.images = { unoptimized: false };
}

const nextConfig = withMDX(baseConfig);

export default nextConfig;
