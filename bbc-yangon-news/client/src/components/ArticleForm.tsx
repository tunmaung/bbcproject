import React, { useEffect, useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const CATEGORIES = ["Myanmar", "World", "Politics", "Business", "Sport", "Culture"] as const;

interface ArticleFormProps {
  editingId?: string | null;
  onCreated?: () => void;
  onUpdated?: () => void;
  onCancel?: () => void;
}

export default function ArticleForm({ editingId, onCreated, onUpdated, onCancel }: ArticleFormProps) {
  const [formData, setFormData] = useState<{
    title: string;
    category: typeof CATEGORIES[number];
    coverImageUrl: string;
    content: string;
    author: string;
    isFeatured: boolean;
    isBreaking: boolean;
  }>({
    title: "",
    category: "Myanmar",
    coverImageUrl: "",
    content: "",
    author: "",
    isFeatured: false,
    isBreaking: false,
  });

  const [imagePreview, setImagePreview] = useState<string>("");
  const [imageMode, setImageMode] = useState<"url" | "file">("url");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { data: editingArticle } = trpc.admin.articles.list.useQuery(undefined, {
    select: (articles) => articles?.find((a) => a.id === editingId),
  });

  const createMutation = trpc.admin.articles.create.useMutation();
  const updateMutation = trpc.admin.articles.update.useMutation();

  useEffect(() => {
    if (editingArticle) {
      setFormData({
        title: editingArticle.title,
        category: editingArticle.category as typeof CATEGORIES[number],
        coverImageUrl: editingArticle.coverImageUrl,
        content: editingArticle.content,
        author: editingArticle.author,
        isFeatured: editingArticle.isFeatured,
        isBreaking: editingArticle.isBreaking,
      });
      setImagePreview(editingArticle.coverImageUrl);
    }
  }, [editingArticle]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  

const handleImageUpload = async (
  e: React.ChangeEvent<HTMLInputElement>
) => {
  const file = e.target.files?.[0];

  if (!file) return;

  if (file.size > 5 * 1024 * 1024) {
    toast.error("File size must be less than 5MB");
    return;
  }

  try {
    const form = new FormData();
    form.append("image", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: form,
    });

    const json = await res.json();

    if (!json.success) {
      throw new Error(json.message);
    }

    setFormData((prev) => ({
      ...prev,
      coverImageUrl: json.url,
    }));

    setImagePreview(json.url);

    toast.success("Image uploaded");
  } catch (err) {
    toast.error("Upload failed");
  }
};
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.coverImageUrl.trim()) newErrors.coverImageUrl = "Image is required";
    if (!formData.content.trim()) newErrors.content = "Content is required";
    if (!formData.author.trim()) newErrors.author = "Author is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      if (editingId) {
        await updateMutation.mutateAsync({
          id: editingId,
          title: formData.title,
          category: formData.category,
          coverImageUrl: formData.coverImageUrl,
          content: formData.content,
          author: formData.author,
          isFeatured: formData.isFeatured,
          isBreaking: formData.isBreaking,
        });
        onUpdated?.();
      } else {
        await createMutation.mutateAsync({
          title: formData.title,
          category: formData.category,
          coverImageUrl: formData.coverImageUrl,
          content: formData.content,
          author: formData.author,
          isFeatured: formData.isFeatured,
          isBreaking: formData.isBreaking,
        });
        onCreated?.();
        setFormData({
          title: "",
          category: "Myanmar",
          coverImageUrl: "",
          content: "",
          author: "",
          isFeatured: false,
          isBreaking: false,
        });
        setImagePreview("");
      }
    } catch (error) {
      toast.error("Failed to save article");
    }
  };

  return (
    <form onSubmit={onSubmit} className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold text-[#1A1A1A] mb-6">
        {editingId ? "Edit Article" : "Create New Article"}
      </h2>

      {/* Title */}
      <div className="mb-4">
        <Label htmlFor="title">Title *</Label>
        <Input
          id="title"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          placeholder="Article title"
          className={errors.title ? "border-red-500" : ""}
        />
        {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
      </div>

      {/* Category */}
      <div className="mb-4">
        <Label htmlFor="category">Category *</Label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleInputChange}
          className="w-full border border-gray-300 rounded px-3 py-2"
        >
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
      </div>

      {/* Image Mode Toggle */}
      <div className="mb-4">
        <Label>Image Source *</Label>
        <div className="flex gap-4 mt-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              value="url"
              checked={imageMode === "url"}
              onChange={(e) => setImageMode(e.target.value as "url" | "file")}
            />
            <span>URL</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              value="file"
              checked={imageMode === "file"}
              onChange={(e) => setImageMode(e.target.value as "url" | "file")}
            />
            <span>Upload File</span>
          </label>
        </div>
      </div>

      {/* Image Input */}
      {imageMode === "url" ? (
        <div className="mb-4">
          <Label htmlFor="coverImageUrl">Image URL *</Label>
          <Input
            id="coverImageUrl"
            name="coverImageUrl"
            value={formData.coverImageUrl}
            onChange={handleInputChange}
            placeholder="https://example.com/image.jpg"
            className={errors.coverImageUrl ? "border-red-500" : ""}
          />
          {errors.coverImageUrl && (
            <p className="text-red-500 text-sm mt-1">{errors.coverImageUrl}</p>
          )}
        </div>
      ) : (
        <div className="mb-4">
          <Label htmlFor="imageFile">Upload Image *</Label>
          <Input
            id="imageFile"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="mb-2"
          />
          <p className="text-xs text-gray-500">Max 5MB</p>
        </div>
      )}

      {/* Image Preview */}
      {imagePreview && (
        <div className="mb-4">
          <img src={imagePreview} alt="Preview" className="w-full h-40 object-cover rounded" />
        </div>
      )}

      {/* Author */}
      <div className="mb-4">
        <Label htmlFor="author">Author *</Label>
        <Input
          id="author"
          name="author"
          value={formData.author}
          onChange={handleInputChange}
          placeholder="Author name"
          className={errors.author ? "border-red-500" : ""}
        />
        {errors.author && <p className="text-red-500 text-sm mt-1">{errors.author}</p>}
      </div>

      {/* Content */}
      <div className="mb-4">
        <Label htmlFor="content">Content *</Label>
        <Textarea
          id="content"
          name="content"
          value={formData.content}
          onChange={handleInputChange}
          placeholder="Article content"
          rows={6}
          className={errors.content ? "border-red-500" : ""}
        />
        {errors.content && <p className="text-red-500 text-sm mt-1">{errors.content}</p>}
      </div>

      {/* Toggles */}
      <div className="mb-6 space-y-3">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            name="isFeatured"
            checked={formData.isFeatured}
            onChange={handleInputChange}
          />
          <span className="text-sm">Featured Story</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            name="isBreaking"
            checked={formData.isBreaking}
            onChange={handleInputChange}
          />
          <span className="text-sm">Breaking News</span>
        </label>
      </div>

      {/* Buttons */}
      <div className="flex gap-2">
        <Button
          type="submit"
          disabled={createMutation.isPending || updateMutation.isPending}
          className="flex-1 bg-[#BB1919] hover:bg-[#8B0000] text-white"
        >
          {(createMutation.isPending || updateMutation.isPending) && (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          )}
          {editingId ? "Update Article" : "Create Article"}
        </Button>
        {editingId && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
