// app/projects/page.tsx
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import ProjectsGrid from "./projects-grid";
import { projects } from "./_data";

export const dynamic = "force-static";
export const revalidate = false;

export default function ProjectsPage() {
  // 🔧 Drop the `icon` (and anything else non-serializable) before passing to client
  const safeProjects = projects.map(({ icon, ...rest }) => rest);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="mx-auto max-w-7xl px-4 py-12">
        <h1 className="mb-6 text-4xl font-bold">Projects</h1>
        <ProjectsGrid allProjects={safeProjects} />
      </main>
      <Footer />
    </div>
  );
}