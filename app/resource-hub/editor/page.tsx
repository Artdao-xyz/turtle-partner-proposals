import Link from "next/link";
import { getAllResources } from "@/resource-hub/lib/getResource";

export const dynamic = "force-dynamic";

export default async function ResourceHubEditorListPage() {
  const resources = await getAllResources();

  return (
    <main
      className="w-full min-h-screen"
      style={{ backgroundColor: "var(--black-turtle)" }}
    >
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 md:px-10 pt-28 pb-12 sm:pt-32 sm:pb-20">
        <div className="mb-8 space-y-2">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-wise-white mb-1">
                Resource Hub Editor
              </h1>
              <p className="text-wise-white/70 text-sm">
                Select an article to edit its metadata and body.
              </p>
            </div>
            <Link
              href="/resource-hub"
              className="text-sm text-wise-white/70 hover:text-wise-white"
            >
              ← Back to hub
            </Link>
          </div>
          <p className="text-xs text-wise-white/50">
            Internal editor – not exposed in navigation. Do not share this URL publicly.
          </p>
        </div>

        <div className="overflow-x-auto rounded-xl border border-white/10 bg-white/5">
          <table className="min-w-full text-sm text-left text-wise-white/80">
            <thead className="bg-white/5 text-xs uppercase tracking-wide text-wise-white/60">
              <tr>
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="px-4 py-3 font-medium">Slug</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Published</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {resources.map((r) => (
                <tr
                  key={r.slug}
                  className="border-t border-white/5 hover:bg-white/5 transition-colors"
                >
                  <td className="px-4 py-2 align-top max-w-xs">
                    <div className="font-medium text-wise-white line-clamp-2">
                      {r.title}
                    </div>
                    {r.subtitle && (
                      <div className="text-xs text-wise-white/60 line-clamp-2 mt-0.5">
                        {r.subtitle}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-2 align-top text-xs text-wise-white/60">
                    {r.slug}
                  </td>
                  <td className="px-4 py-2 align-top text-xs">
                    {r.category}
                  </td>
                  <td className="px-4 py-2 align-top text-xs text-wise-white/60">
                    {r.publishedDate ?? "—"}
                  </td>
                  <td className="px-4 py-2 align-top text-right">
                    <Link
                      href={`/resource-hub/editor/${r.slug}`}
                      className="inline-flex items-center px-3 py-1.5 rounded-lg bg-green-turtle/20 border border-green-turtle/40 text-green-turtle text-xs font-medium hover:bg-green-turtle/30"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
              {resources.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-6 text-center text-wise-white/50 text-sm"
                  >
                    No articles found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
