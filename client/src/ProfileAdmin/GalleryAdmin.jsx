import { useEffect, useState } from "react";
import axios from "axios";

function GalleryAdmin() {
  const [imgs, setImgs] = useState([]);
  const [busy, setBusy] = useState(false);
  const token = localStorage.getItem('token');
//   const role = localStorage.getItem('role');

  const refresh = async () => {
    try {
      const response = await axios.get("http://localhost:3050/admin/gallery", {
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      });
      setImgs(response.data);
    } catch (error) {
      console.error("Failed to fetch gallery images:", error);
      alert("Failed to load gallery images.");
    }
  };

  useEffect(() => {
    refresh();
    
  }, []);

  /* -------- Upload flow -------- */
  const handleFiles = async (files) => {
    setBusy(true);

    try {
      // 1. Get signed params
      const { data: sig } = await axios.post("http://localhost:3050/admin/gallery/sign", null, {
        headers: {
          Authorization: `Bearer ${token}`, // Adding token here as well
        },
      });

      // 2. Upload each file directly to Cloudinary
      const uploads = files.map((file) => {
        const form = new FormData();
        form.append("file", file);
        form.append("api_key", sig.apiKey);
        form.append("timestamp", sig.timestamp);
        form.append("signature", sig.signature);
        form.append("folder", sig.folder);
        return axios.post(
          `https://api.cloudinary.com/v1_1/${sig.cloudName}/image/upload`,
          form
        );
      });

      await Promise.all(uploads);
      await refresh(); 
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    } finally {
      setBusy(false);
    }
  };

  /* -------- Delete -------- */
  const handleDelete = async (publicId) => {
    if (!window.confirm("Delete image?")) return;
    try {
      await axios.delete(`http://localhost:3050/admin/gallery/${publicId}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Adding token for authentication
        },
      });
      setImgs((prev) => prev.filter((img) => img.public_id !== publicId));
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  return (
    <section className="p-8 max-w-5xl mx-auto">
      <h1 className="font-serif text-3xl mb-6">Gallery Manager</h1>

      {/* Upload control */}
      <input
        type="file"
        multiple
        accept="image/*"
        disabled={busy}
        onChange={(e) => handleFiles(Array.from(e.target.files))}
        className="mb-6"
      />

      {busy && <p className="mb-4">Processing…</p>}

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {imgs.map((img) => (
          <figure key={img.public_id} className="relative group">
            <img
              src={`${img.secure_url}?w=300&h=300&fit=crop&auto=format`}
              alt=""
              className="aspect-square object-cover rounded-md"
            />

            {/* Hover overlay for delete */}
            <button
              onClick={() => handleDelete(img.public_id)}
              className="hidden group-hover:flex absolute inset-0 bg-black/60 text-white items-center justify-center rounded-md"
            >
              Delete
            </button>
          </figure>
        ))}
      </div>
    </section>
  );
}

export default GalleryAdmin;
