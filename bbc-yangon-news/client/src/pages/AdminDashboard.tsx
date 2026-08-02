import React, { useState } from "react";
import { Link } from "wouter";
import DashboardLayout from "@/components/DashboardLayout";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import ArticleForm from "@/components/ArticleForm";
import ArticleTable from "@/components/ArticleTable";
import VisitorMap from "@/components/VisitorMap";
export default function AdminDashboard() {
  const [loading] = useState(false);

  const user = {
    role: "admin",
  };

  const [editingId, setEditingId] = useState<string | null>(null);

  const {
    data: articles,
    isLoading: articlesLoading,
    refetch: refetchArticles,
  } = trpc.admin.articles.list.useQuery(undefined, {
    enabled: !!user,
  });

  const { data: stats } = trpc.admin.stats.useQuery(undefined, {
    enabled: !!user,
  });

  const { data: visitorStats } =
    trpc.admin.visitorStats.useQuery(undefined, {
      enabled: !!user,
    });

  const { data: visitorLocations } =
    trpc.admin.visitorLocations.useQuery(undefined, {
      enabled: !!user,
    });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-6">
            You must be an admin to access this page.
          </p>
<Link
  href="/"
  className="text-[#BB1919] hover:underline"
>
  Back to Home
</Link>
        </div>
      </div>
    );
  }

  const handleArticleCreated = () => {
    refetchArticles();
    setEditingId(null);
    toast.success("Article created successfully!");
  };

  const handleArticleUpdated = () => {
    refetchArticles();
    setEditingId(null);
    toast.success("Article updated successfully!");
  };

  const handleArticleDeleted = () => {
    refetchArticles();
    toast.success("Article deleted successfully!");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-[#1A1A1A]">
            Article Management
          </h1>
<Link
  href="/"
  className="text-[#BB1919] hover:underline"
>
  View Site
</Link>
        </div>
        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg shadow">
              <p className="text-gray-600 text-sm">Total Articles</p>
              <p className="text-3xl font-bold text-[#BB1919]">
                {stats.total}
              </p>
            </div>

            {Object.entries(stats.byCategory).map(([category, count]) => (
              <div
                key={category}
                className="bg-white p-4 rounded-lg shadow"
              >
                <p className="text-gray-600 text-sm">{category}</p>
                <p className="text-3xl font-bold text-[#1A1A1A]">
                  {count}
                </p>
              </div>
            ))}

            {visitorStats && (
              <div className="bg-white p-4 rounded-lg shadow md:col-span-4">
                <h2 className="text-lg font-semibold mb-3">
                  Visitor Statistics
                </h2>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-gray-500 text-sm">Today</p>
                    <p className="text-2xl font-bold">
                      {visitorStats.today}
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-500 text-sm">This Week</p>
                    <p className="text-2xl font-bold">
                      {visitorStats.week}
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-500 text-sm">This Month</p>
                    <p className="text-2xl font-bold">
                      {visitorStats.month}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Form + Table */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <ArticleForm
              editingId={editingId}
              onCreated={handleArticleCreated}
              onUpdated={handleArticleUpdated}
              onCancel={() => setEditingId(null)}
            />
          </div>

          <div className="lg:col-span-2">
            <ArticleTable
              articles={articles || []}
              isLoading={articlesLoading}
              onEdit={setEditingId}
              onDeleted={handleArticleDeleted}
            />
<div className="mt-6">
  <VisitorMap />
</div>
          </div>
        </div>

        {/* Visitor Locations */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">
            Visitor Locations ({visitorLocations?.length || 0})
          </h2>

          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">IP Address</th>
                  <th className="text-left p-2">Latitude</th>
                  <th className="text-left p-2">Longitude</th>
                  <th className="text-left p-2">Visited</th>
                </tr>
              </thead>

              <tbody>
                {visitorLocations?.map((v: any) => (
                  <tr key={v.id} className="border-b">
                    <td className="p-2">{v.ipAddress}</td>
                    <td className="p-2">{v.latitude}</td>
                    <td className="p-2">{v.longitude}</td>
                    <td className="p-2">
                      {v.createdAt
                        ? new Date(v.createdAt).toLocaleString()
                        : "-"}
                    </td>
                  </tr>
                ))}

                {!visitorLocations?.length && (
                  <tr>
                    <td
                      colSpan={4}
                      className="p-4 text-center text-gray-500"
                    >
                      No visitor locations found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
