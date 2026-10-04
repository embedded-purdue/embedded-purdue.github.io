import { fieldClass, labelClass } from "./editor-styles";
import type { PublishMode } from "@/lib/cms/editor-types";

type CmsHeaderProps = {
  baseBranch: string;
  baseCommitSha: string | null;
  mode: PublishMode;
  message: string;
  publishing: boolean;
  status: string;
  pendingUploadCount: number;
  changedCount: number;
  deploy: { state: string; url?: string } | null;
  onModeChange: (mode: PublishMode) => void;
  onMessageChange: (message: string) => void;
  onPublish: () => void;
};

export function CmsHeader({
  baseBranch,
  baseCommitSha,
  mode,
  message,
  publishing,
  status,
  pendingUploadCount,
  changedCount,
  deploy,
  onModeChange,
  onMessageChange,
  onPublish,
}: CmsHeaderProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-black/90 px-5 py-4 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-[#daa000]">
            ES@P CMS
          </p>
          <h1 className="text-2xl font-medium tracking-[-0.05em]">
            GitHub-backed content editor
          </h1>
          <p className="mt-1 text-xs text-[#8d867b]">
            Base: {baseBranch}
            {baseCommitSha ? ` @ ${baseCommitSha.slice(0, 7)}` : ""}
          </p>
        </div>
        <div className="flex flex-wrap items-end gap-3">
          <label className={labelClass}>
            Publish mode
            <select
              className={fieldClass}
              value={mode}
              onChange={(event) =>
                onModeChange(event.target.value as PublishMode)
              }
            >
              <option value="pr">Open PR</option>
              <option value="direct">Direct push</option>
            </select>
          </label>
          <label className={labelClass}>
            Commit message
            <input
              className={fieldClass}
              value={message}
              onChange={(event) => onMessageChange(event.target.value)}
            />
          </label>
          <button
            disabled={publishing}
            onClick={onPublish}
            className="bg-[#daa000] px-5 py-3 font-mono text-[0.62rem] font-bold uppercase tracking-[0.16em] text-black disabled:opacity-50"
          >
            {publishing ? "Publishing…" : mode === "pr" ? "Open PR" : "Publish"}
          </button>
        </div>
      </div>
      {(status || deploy || pendingUploadCount > 0 || changedCount > 0) && (
        <div className="mx-auto mt-3 flex max-w-7xl flex-wrap gap-3 text-xs text-[#aaa398]">
          {status && <span>{status}</span>}
          {pendingUploadCount > 0 && (
            <span>
              {pendingUploadCount} pending upload
              {pendingUploadCount === 1 ? "" : "s"}
            </span>
          )}
          {changedCount > 0 && (
            <span>
              {changedCount} tracked change{changedCount === 1 ? "" : "s"}
            </span>
          )}
          {deploy && (
            <span>
              Deploy: {deploy.state}
              {deploy.url ? ` · ${deploy.url}` : ""}
            </span>
          )}
        </div>
      )}
    </header>
  );
}
