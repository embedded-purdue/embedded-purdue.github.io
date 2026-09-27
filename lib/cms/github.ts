type GitHubFile = { path: string; content: string; encoding?: "utf-8" | "base64" };
type GitHubConfig = { token: string; owner: string; repo: string; branch: string; workflowFile: string };
type PublishResult = { mode: "pr" | "direct"; branch: string; commitSha: string; branchUrl?: string; pullRequestUrl?: string; warning?: string };

const API = "https://api.github.com";

export function getGitHubConfig(): GitHubConfig {
  const token = process.env.GITHUB_TOKEN || process.env.GITHUB_PAT;
  const owner = process.env.GITHUB_OWNER || process.env.VERCEL_GIT_REPO_OWNER;
  const repo = process.env.GITHUB_REPO || process.env.VERCEL_GIT_REPO_SLUG;
  const branch = process.env.GITHUB_BASE_BRANCH || process.env.GITHUB_BRANCH || "main";
  const workflowFile = process.env.GITHUB_DEPLOY_WORKFLOW || "build.yaml";
  if (!token || !owner || !repo) throw new Error("Missing GitHub env vars: GITHUB_TOKEN/GITHUB_PAT, GITHUB_OWNER, GITHUB_REPO.");
  return { token, owner, repo, branch, workflowFile };
}

async function githubFetch<T>(config: GitHubConfig, path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    ...init,
    headers: {
      accept: "application/vnd.github+json",
      authorization: `Bearer ${config.token}`,
      "x-github-api-version": "2022-11-28",
      ...(init?.body ? { "content-type": "application/json" } : {}),
      ...(init?.headers || {}),
    },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`GitHub ${res.status}: ${await res.text().catch(() => res.statusText)}`);
  return (await res.json()) as T;
}

function safeBranchSegment(input: string) {
  return input.toLowerCase().replace(/[^a-z0-9._-]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 48) || "update";
}

export async function getBaseRef(config = getGitHubConfig()) {
  const ref = await githubFetch<{ object: { sha: string } }>(config, `/repos/${config.owner}/${config.repo}/git/ref/heads/${encodeURIComponent(config.branch)}`);
  return ref.object.sha;
}

export async function publishCmsFiles(args: { mode: "pr" | "direct"; message: string; expectedBaseSha?: string | null; files: GitHubFile[] }): Promise<PublishResult> {
  const config = getGitHubConfig();
  const baseCommitSha = await getBaseRef(config);
  if (args.expectedBaseSha && args.expectedBaseSha !== baseCommitSha) throw new Error("Base branch changed while you were editing. Reload the CMS and re-apply your changes.");
  const baseCommit = await githubFetch<{ tree: { sha: string } }>(config, `/repos/${config.owner}/${config.repo}/git/commits/${baseCommitSha}`);

  const treeEntries = await Promise.all(args.files.map(async (file) => {
    if (file.encoding !== "base64") return { path: file.path, mode: "100644", type: "blob", content: file.content };
    const blob = await githubFetch<{ sha: string }>(config, `/repos/${config.owner}/${config.repo}/git/blobs`, { method: "POST", body: JSON.stringify({ content: file.content, encoding: "base64" }) });
    return { path: file.path, mode: "100644", type: "blob", sha: blob.sha };
  }));
  const tree = await githubFetch<{ sha: string }>(config, `/repos/${config.owner}/${config.repo}/git/trees`, { method: "POST", body: JSON.stringify({ base_tree: baseCommit.tree.sha, tree: treeEntries }) });
  const commit = await githubFetch<{ sha: string }>(config, `/repos/${config.owner}/${config.repo}/git/commits`, { method: "POST", body: JSON.stringify({ message: args.message, tree: tree.sha, parents: [baseCommitSha] }) });

  if (args.mode === "direct") {
    await githubFetch(config, `/repos/${config.owner}/${config.repo}/git/refs/heads/${encodeURIComponent(config.branch)}`, { method: "PATCH", body: JSON.stringify({ sha: commit.sha, force: false }) });
    return { mode: "direct", branch: config.branch, commitSha: commit.sha, branchUrl: `https://github.com/${config.owner}/${config.repo}/tree/${config.branch}` };
  }

  const branch = `cms/${safeBranchSegment(args.message)}-${Date.now().toString(36)}`;
  await githubFetch(config, `/repos/${config.owner}/${config.repo}/git/refs`, { method: "POST", body: JSON.stringify({ ref: `refs/heads/${branch}`, sha: commit.sha }) });
  const branchUrl = `https://github.com/${config.owner}/${config.repo}/tree/${branch}`;
  try {
    const pr = await githubFetch<{ html_url: string }>(config, `/repos/${config.owner}/${config.repo}/pulls`, { method: "POST", body: JSON.stringify({ title: args.message, head: branch, base: config.branch, body: `Created by the ES@P CMS.\n\nCommit: ${commit.sha}` }) });
    return { mode: "pr", branch, commitSha: commit.sha, branchUrl, pullRequestUrl: pr.html_url };
  } catch (err) {
    return { mode: "pr", branch, commitSha: commit.sha, branchUrl, warning: err instanceof Error ? err.message : "Pull request creation failed." };
  }
}

export async function getDeployStatus() {
  const config = getGitHubConfig();
  const data = await githubFetch<{ workflow_runs?: Array<{ html_url: string; status: string; conclusion: string | null; head_sha: string; created_at: string }> }>(config, `/repos/${config.owner}/${config.repo}/actions/workflows/${encodeURIComponent(config.workflowFile)}/runs?branch=${encodeURIComponent(config.branch)}&per_page=1`);
  const run = data.workflow_runs?.[0];
  if (!run) return { state: "NONE" as const };
  return { state: run.status === "completed" ? (run.conclusion === "success" ? "READY" : "ERROR") : "BUILDING", url: run.html_url, headSha: run.head_sha, createdAt: run.created_at };
}
