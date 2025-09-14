// components/mdx/Callout.tsx
export function Callout({ type = "note", title, children }: {type?: "tip"|"note"|"warning"|"info", title?: string, children: React.ReactNode}) {
    const styles: Record<string, string> = {
      tip: "border-emerald-500/60 bg-emerald-500/5",
      note: "border-primary/60 bg-primary/5",
      warning: "border-amber-500/60 bg-amber-500/5",
      info: "border-sky-500/60 bg-sky-500/5",
    }
    return (
      <div className={`my-4 rounded-xl border p-4 ${styles[type] ?? styles.note}`}>
        {title && <p className="mb-2 font-medium">{title}</p>}
        <div className="[&_p]:m-0 [&_p+ul]:mt-2 [&_p+ol]:mt-2">{children}</div>
      </div>
    )
  }
  