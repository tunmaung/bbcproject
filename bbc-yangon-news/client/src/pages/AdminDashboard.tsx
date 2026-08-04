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
 const [qrCode, setQrCode] = useState("");
const [secret, setSecret] = useState("");
const [verifyCode, setVerifyCode] = useState("");
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
console.log("visitorLocations =", visitorLocations);
const setup2FA = trpc.admin.twoFactorSetup.useMutation();
const verify2FA = trpc.admin.twoFactorVerify.useMutation();
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



const handleEnable2FA = async () => {
  try {
    const result = await setup2FA.mutateAsync();

    setQrCode(result.qrCode);
    setSecret(result.secret);

    toast.success("QR Code generated.");
  } catch (err: any) {
    toast.error(err.message);
  }
};

const handleVerify2FA = async () => {
  try {
    await verify2FA.mutateAsync({
      token: verifyCode,
    });

    toast.success("Google Authenticator Enabled!");

    setQrCode("");
    setSecret("");
    setVerifyCode("");
  } catch (err: any) {
    toast.error(err.message);
  }
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
<div className="bg-white rounded-lg shadow p-6">
  <h2 className="text-xl font-bold mb-4">
    🔒 Google Authenticator
  </h2>

  {!qrCode ? (
    <button
      onClick={handleEnable2FA}
      className="bg-green-600 text-white px-4 py-2 rounded"
    >
      Enable 2FA
    </button>
  ) : (
    <>
      <img
        src={qrCode}
        alt="QR Code"
        className="w-56 h-56"
      />

      <p className="mt-3 font-mono break-all">
        {secret}
      </p>

      <input
        className="border rounded w-full p-2 mt-4"
        placeholder="Enter 6 digit code"
        value={verifyCode}
        onChange={(e) => setVerifyCode(e.target.value)}
      />

      <button
        onClick={handleVerify2FA}
        className="bg-red-700 text-white px-4 py-2 rounded mt-3"
      >
        Verify
      </button>
    </>
  )}
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

Visitor Locations V999 ({visitorLocations?.length || 0})
          </h2>

          <div className="overflow-x-auto">
            <table className="min-w-full">
<thead>
  <tr className="border-b">
    <th className="text-left p-2">📷 Photo</th>
    <th className="text-left p-2">📱 Device</th>
    <th className="text-left p-2">🌐 Browser</th>
    <th className="text-left p-2">💻 OS</th>
    <th className="text-left p-2">🌍 Country</th>
<th className="text-left p-2">🏢 ISP</th>
    <th className="text-left p-2">🏙 City</th>
    <th className="text-left p-2">📍 Location</th>
    <th className="text-left p-2">🌐 IP</th>
    <th className="text-left p-2">🕒 Visited</th>
  </tr>
</thead>

<tbody>
  {visitorLocations?.map((v: any) => {
console.log("visitor photo =", v.photo);
console.log("visitor row =", JSON.stringify(v, null, 2));
    return (
      <tr key={v.id} className="border-b">
        <td className="p-2">
          {v.photo ? (
            <img
              src={v.photo}
              alt="Visitor"
              className="w-14 h-14 rounded object-cover border"
            />
          ) : (
            "-"
          )}
        </td>

        {/* ကျန်တဲ့ td တွေကို အရင်အတိုင်း ဆက်ထားပါ */}
        <td className="p-2">{v.device || "-"}</td>
        <td className="p-2">{v.browser || "-"}</td>
        <td className="p-2">{v.os || "-"}</td>
        <td className="p-2">{v.country || "-"}</td>
<td className="p-2">{v.isp || "-"}</td>        
<td className="p-2">{v.city || "-"}</td>
        <td className="p-2">
          {v.latitude}, {v.longitude}
        </td>
        <td className="p-2">{v.ipAddress || v.publicIp || "-"}</td>
        <td className="p-2">
          {v.createdAt
            ? new Date(v.createdAt).toLocaleString()
            : "-"}
        </td>
      </tr>
    );
  })}
</tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
