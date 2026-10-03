import type { ChangeSummary } from "@/lib/cms/editor-types";

const kindLabels: Record<ChangeSummary["kind"], string> = {
  added: "Added",
  updated: "Updated",
  removed: "Removed",
  uploaded: "Uploaded",
};

type ChangeTrackerProps = {
  changes: ChangeSummary[];
  visibleLimit?: number;
};

export function ChangeTracker({
  changes,
  visibleLimit = 6,
}: ChangeTrackerProps) {
  const visibleChanges = changes.slice(0, visibleLimit);
  const hiddenCount = Math.max(0, changes.length - visibleChanges.length);

  return (
    <section className="border-b border-white/10 bg-[#15110a] px-5 py-3">
      <div className="mx-auto grid max-w-7xl gap-3 lg:grid-cols-[220px_1fr] lg:items-start">
        <div>
          <p className="font-mono text-[0.58rem] uppercase tracking-[0.18em] text-[#daa000]">
            PR change tracker
          </p>
          <p className="mt-1 text-sm text-[#f3efe6]">
            {changes.length === 0
              ? "No draft changes yet."
              : `${changes.length} item-level change${changes.length === 1 ? "" : "s"} ready for publish`}
          </p>
        </div>
        {visibleChanges.length > 0 && (
          <div className="flex flex-wrap gap-2 text-xs text-[#aaa398]">
            {visibleChanges.map((change) => (
              <article
                key={`${change.path}:${change.label}`}
                className="max-w-full border border-[#daa000]/25 bg-black/30 px-3 py-2"
                title={change.path}
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-[0.55rem] uppercase tracking-[0.14em] text-[#daa000]">
                    {kindLabels[change.kind]}
                  </span>
                  <span className="truncate text-[#f3efe6]">{change.item}</span>
                </div>
                {change.beforeLabel && change.afterLabel && (
                  <p className="mt-1 text-[#8d867b]">
                    {change.beforeLabel} → {change.afterLabel}
                  </p>
                )}
                {change.fields && change.fields.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {change.fields.map((field) => (
                      <span
                        key={field}
                        className="border border-white/10 bg-[#0c0c0b] px-1.5 py-0.5 font-mono text-[0.55rem] uppercase tracking-[0.12em] text-[#aaa398]"
                      >
                        {field}
                      </span>
                    ))}
                  </div>
                )}
                <p className="mt-2 truncate font-mono text-[0.55rem] uppercase tracking-[0.12em] text-[#6f675c]">
                  {change.path}
                </p>
              </article>
            ))}
            {hiddenCount > 0 && (
              <span className="self-start border border-white/10 px-2 py-1 font-mono">
                +{hiddenCount} more
              </span>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
