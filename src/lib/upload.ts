export async function uploadFile(file: File): Promise<{ url: string; name: string; size: number }> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("/api/uploads", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || "File upload failed");
  }

  return res.json();
}