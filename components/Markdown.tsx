"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";

// react-markdown renderer types
type CodeProps = {
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
} & React.HTMLAttributes<HTMLElement>;

export default function Markdown({
  children,
  className = "prose prose-neutral max-w-none break-words",
  imageBase,
}: {
  children: string;
  className?: string;
  imageBase?: string;
}) {
  // Extend sanitize schema: allow minimal raw HTML and common attributes
  const schema: any = {
    ...defaultSchema,
    tagNames: [...(defaultSchema.tagNames || []), "section", "iframe"],
    attributes: {
      ...(defaultSchema.attributes || {}),
      "*": [
        ...(defaultSchema.attributes?.["*"] || []),
        "class",
        "className",
        "style",
      ],
      iframe: [
        "src",
        "width",
        "height",
        "loading",
        "referrerpolicy",
        "allow",
        "allowfullscreen",
        "frameborder",
        "title",
      ],
      section: ["style", "class", "className"],
    },
  };

  return (
    <div className={className}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[
          rehypeRaw,
          [rehypeSanitize, schema],
        ]}
        components={{
          // ---------- IMAGES ----------
          img({ src, alt, ...props }) {
            let finalSrc = src || "";
            if (finalSrc && !finalSrc.startsWith("http") && !finalSrc.startsWith("/")) {
              finalSrc = (imageBase ? `${imageBase.replace(/\/$/, "")}/` : "") + finalSrc;
            }
            return (
              <img
                src={finalSrc}
                alt={alt as string}
                loading="lazy"
                draggable={false}
                className="my-4 rounded-lg border bg-muted/20 max-w-full h-auto"
                {...props}
              />
            );
          },

          // ---------- IFRAME WRAP ----------
          iframe(props: React.IframeHTMLAttributes<HTMLIFrameElement>) {
            return (
              <div className="my-6 overflow-hidden rounded-lg border bg-muted/10">
                {/* eslint-disable-next-line jsx-a11y/iframe-has-title */}
                <iframe {...props} className={`w-full aspect-video ${props.className || ""}`} />
              </div>
            );
          },

          // ---------- CODE BLOCKS / INLINE CODE ----------
          code({ inline, className, children, ...props }: CodeProps) {
            const lang = /language-(\w+)/.exec(className || "")?.[1];
            if (!inline) {
              return (
                <div className="relative my-6 group not-prose">
                  {lang && (
                    <div className="absolute top-3 right-3 text-xs text-muted-foreground bg-background/90 backdrop-blur-sm px-3 py-1.5 rounded-md border font-mono uppercase tracking-wide shadow-sm">
                      {lang}
                    </div>
                  )}
                  <pre className="bg-muted/50 border rounded-xl p-4 overflow-hidden shadow-sm group-hover:shadow-md transition-all duration-200 whitespace-pre-wrap break-words">
                    <code className="text-sm font-mono leading-relaxed" {...props}>
                      {children}
                    </code>
                  </pre>
                </div>
              );
            }
            return (
              <code
                className="bg-muted/70 px-1.5 py-0.5 rounded-md text-sm font-mono border inline-block max-w-full overflow-x-auto whitespace-nowrap align-middle"
                {...props}
              >
                {children}
              </code>
            );
          },

          // ---------- BLOCKQUOTE / TABLE / LISTS / HEADINGS ----------
          blockquote({ children, ...props }) {
            return (
              <blockquote
                className="border-l-4 border-primary bg-muted/30 py-4 px-6 rounded-r-lg my-6 italic relative shadow-sm"
                {...props}
              >
                <div className="absolute top-2 left-2 text-primary/20 text-4xl font-serif leading-none">
                  "
                </div>
                <div className="relative z-10 pl-6 break-words">{children}</div>
              </blockquote>
            );
          },
          table({ children, ...props }) {
            return (
              <div className="my-6 overflow-x-auto rounded-lg border shadow-sm">
                <table className="w-full border-collapse text-sm" {...props}>
                  {children}
                </table>
              </div>
            );
          },
          thead(p) {
            return <thead className="bg-muted/50" {...p} />;
          },
          tr(p) {
            return (
              <tr
                className="border-b border-border hover:bg-muted/30 transition-colors duration-150"
                {...p}
              />
            );
          },
          th(p) {
            return (
              <th
                className="px-4 py-3 text-left font-semibold text-foreground border-r border-border last:border-r-0"
                {...p}
              />
            );
          },
          td(p) {
            return (
              <td
                className="px-4 py-3 border-r border-border last:border-r-0 align-top break-words"
                {...p}
              />
            );
          },
          ul(p) {
            return <ul className="my-6 ml-6 space-y-2 list-disc" {...p} />;
          },

          h1(p) {
            return (
              <h1
                className="text-4xl lg:text-5xl font-bold tracking-tight border-b border-border pb-4 mb-8 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent"
                {...p}
              />
            );
          },
          h2(p) {
            return (
              <h2
                className="text-3xl font-semibold tracking-tight border-b border-border pb-3 mt-12 mb-6 text-foreground"
                {...p}
              />
            );
          },
          h3(p) {
            return (
              <h3
                className="text-2xl font-semibold tracking-tight mt-8 mb-4 text-foreground"
                {...p}
              />
            );
          },
          a(p) {
            return (
              <a
                className="text-primary font-medium underline decoration-2 underline-offset-2 hover:decoration-primary/50 hover:text-primary/80 transition-colors duration-150 break-words"
                {...p}
              />
            );
          },

          // Also ensure paragraphs wrap nicely
          p(p) {
            return <p className="my-4 leading-7 break-words" {...p} />;
          },
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}