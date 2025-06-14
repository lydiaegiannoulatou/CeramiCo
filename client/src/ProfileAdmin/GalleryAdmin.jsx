import { useEffect, useState } from "react";
import axios from "axios";
import { Upload, Trash2, ImageIcon, Loader2, AlertCircle } from "lucide-react";

function GalleryAdmin() {
  const [imgs, setImgs] = useState([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');
const baseUrl = import.meta.env.VITE_BASE_URL;
  const refresh = async () => {
    try {
      const response = await axios.get(`${baseUrl}/gallery`, {
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      });
      setImgs(response.data);
      setError(null);
    } catch (error) {
      console.error("Failed to fetch gallery images:", error);
      setError("Failed to load gallery images");
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const handleFiles = async (files) => {
    setBusy(true);

    try {
      // 1. Get signed params
      const { data: sig } = await axios.post(`${baseUrl}/gallery/sign`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
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
      setError("Failed to upload images");
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async (publicId) => {
    const confirmed = window.confirm("Are you sure you want to delete this image?");
    if (!confirmed) return;
  
    try {
      await axios.delete(
        `${baseUrl}/gallery/${encodeURIComponent(publicId)}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setImgs(prev => prev.filter(img => img.public_id !== publicId));
    } catch (err) {
      console.error(err);
      setError("Failed to delete image");
    }
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-[#2F4138]/50 mx-auto" />
          <p className="text-[#2F4138] text-lg">{error}</p>
          <button
            onClick={refresh}
            className="px-6 py-2 bg-[#2F4138] text-white rounded-xl hover:bg-[#3A4F44] transition-colors duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Upload Section */}
      <div className="bg-[#2F4138]/5 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-[#2F4138]">Upload Images</h2>
          {busy && (
            <div className="flex items-center text-[#2F4138]">
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Processing...
            </div>
          )}
        </div>

        <label className="block">
          <input
            type="file"
            multiple
            accept="image/*"
            disabled={busy}
            onChange={(e) => handleFiles(Array.from(e.target.files))}
            className="block w-full text-sm text-[#2F4138]
              file:mr-4 file:py-2 file:px-4 file:rounded-xl
              file:border-0 file:text-sm file:font-medium
              file:bg-[#2F4138] file:text-white
              hover:file:bg-[#3A4F44]
              disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </label>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {imgs.map((img) => (
          <div 
            key={img.public_id} 
            className="group relative aspect-square rounded-xl overflow-hidden bg-[#2F4138]/5"
          >
            {/* Image */}
            <img
              src={`${img.secure_url}?w=400&h=400&fit=crop&auto=format`}
              alt=""
              loading="lazy"
              className="w-full h-full object-cover"
            />

            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-[#2F4138]/80 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
              <button
                onClick={() => handleDelete(img.public_id)}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors duration-200"
                title="Delete image"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}

        {/* Empty State */}
        {imgs.length === 0 && !busy && (
          <div className="col-span-full flex flex-col items-center justify-center h-64 text-[#2F4138]/70">
            <ImageIcon className="w-12 h-12 mb-4 opacity-50" />
            <p className="text-lg">No images in the gallery</p>
            <p className="text-sm">Upload some images to get started</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default GalleryAdmin;