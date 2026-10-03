import { panelClass } from "./editor-styles";
import type { CmsDirectoryItem, Tab } from "@/lib/cms/editor-types";

type CmsDirectoryProps = {
  activeTab: Tab;
  items: CmsDirectoryItem[];
  onTabChange: (tab: Tab) => void;
  onJumpToEntry: (kind: "project" | "team" | "workshop", index: number) => void;
};

const tabs: Tab[] = ["projects", "team", "workshops", "preview", "assets"];

export function CmsDirectory({
  activeTab,
  items,
  onTabChange,
  onJumpToEntry,
}: CmsDirectoryProps) {
  return (
    <nav className={`${panelClass} h-fit space-y-5 lg:sticky lg:top-28`}>
      <div className="space-y-2">
        {tabs.map((item) => (
          <button
            key={item}
            onClick={() => onTabChange(item)}
            className={`block w-full px-3 py-2 text-left font-mono text-[0.62rem] uppercase tracking-[0.14em] ${
              activeTab === item
                ? "bg-[#daa000] text-black"
                : "text-[#aaa398] hover:bg-white/5"
            }`}
          >
            {item}
          </button>
        ))}
      </div>
      <div className="border-t border-white/10 pt-4">
        <div className="flex items-center justify-between gap-3">
          <p className="font-mono text-[0.58rem] uppercase tracking-[0.18em] text-[#daa000]">
            Directory
          </p>
          <span className="font-mono text-[0.58rem] uppercase tracking-[0.14em] text-[#8d867b]">
            {items.length}
          </span>
        </div>
        {items.length > 0 ? (
          <div className="cms-directory-scroll mt-3 max-h-[52vh] space-y-2 overflow-y-auto pr-2">
            {items.map((entry, index) => (
              <button
                key={`${entry.label}-${index}`}
                className="group block w-full border border-white/10 bg-black/20 px-3 py-2 text-left transition hover:border-[#daa000]/60 hover:bg-[#15110a] focus:border-[#daa000] focus:outline-none"
                onClick={() => {
                  if (entry.target)
                    onJumpToEntry(entry.target.kind, entry.target.index);
                  else if (entry.tabTarget) onTabChange(entry.tabTarget);
                }}
              >
                <span className="block truncate text-sm font-medium text-[#f3efe6]">
                  {entry.label}
                </span>
                <span className="mt-1 block truncate text-xs text-[#8d867b]">
                  {entry.detail}
                </span>
                {entry.badge && (
                  <span className="mt-2 inline-flex border border-[#daa000]/25 px-2 py-0.5 font-mono text-[0.55rem] uppercase tracking-[0.14em] text-[#daa000]">
                    {entry.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        ) : (
          <p className="mt-3 text-xs leading-5 text-[#8d867b]">
            No entries in this tab yet.
          </p>
        )}
      </div>
    </nav>
  );
}
