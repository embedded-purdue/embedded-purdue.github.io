import * as React from "react"

// Plain headings — no extra <a> wrappers.
// This avoids <h2><a><a>…</a></a></h2> when rehype-autolink is also enabled.
export const mdxComponents = {
  h1: (props: React.HTMLAttributes<HTMLHeadingElement>) => <h1 {...props} />,
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => <h2 {...props} />,
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => <h3 {...props} />,
  h4: (props: React.HTMLAttributes<HTMLHeadingElement>) => <h4 {...props} />,
  h5: (props: React.HTMLAttributes<HTMLHeadingElement>) => <h5 {...props} />,
  h6: (props: React.HTMLAttributes<HTMLHeadingElement>) => <h6 {...props} />,
}
