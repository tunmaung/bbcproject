import React, { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { Trash2, Edit2 } from "lucide-react";

interface Article {
  id: string;
  title: string;
  category: string;
  coverImageUrl: string;
  content: string;
  author: string;
  isFeatured: boolean;
  isBreaking: boolean;
  publishedAt: Date;
  updatedAt: Date;
}

interface ArticleTableProps {
  articles: Article[];
  isLoading: boolean;
  onEdit: (id: string) => void;
  onDeleted: () => void;
}

export default function ArticleTable({ articles, isLoading, onEdit, onDeleted }: ArticleTableProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const deleteMutation = trpc.admin.articles.delete.useMutation();

  const handleDelete = async (id: string) => {
    if (deletingId !== id) {
      setDeletingId(id);
      return;
    }

    try {
      await deleteMutation.mutateAsync({ id });
      onDeleted();
      setDeletingId(null);
    } catch (error) {
      toast.error("Failed to delete article");
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading articles...</div>;
  }

  if (articles.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow text-center">
        <p className="text-gray-600">No articles yet. Create your first article!</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Title</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Category</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Author</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Published</th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Status</th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {articles.map((article) => (
              <tr key={article.id} className="border-b hover:bg-gray-50 transition">
                <td className="px-4 py-3 text-sm text-gray-900 max-w-xs truncate">{article.title}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{article.category}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{article.author}</td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true })}
                </td>
                <td className="px-4 py-3 text-center text-sm">
                  <div className="flex justify-center gap-2">
                    {article.isFeatured && (
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-semibold">
                        Featured
                      </span>
                    )}
                    {article.isBreaking && (
                      <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-semibold">
                        Breaking
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 text-center text-sm">
                  <div className="flex justify-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onEdit(article.id)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(article.id)}
                      disabled={deleteMutation.isPending}
                      className={`text-red-600 hover:text-red-800 ${
                        deletingId === article.id ? "bg-red-50" : ""
                      }`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  {deletingId === article.id && (
                    <p className="text-xs text-red-600 mt-2">Click again to confirm</p>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
