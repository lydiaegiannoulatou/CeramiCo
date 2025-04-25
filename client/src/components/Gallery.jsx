import { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ImageIcon, Loader2 } from 'lucide-react';

export default function Gallery() {
  const [imgs, setImgs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get("http://localhost:3050/admin/gallery");
        setImgs(response.data);
      } catch (error) {
        console.error(error);
        toast.error('Failed to load gallery images. Please try again later.', {
          position: "top-right",
          autoClose: 5000
        });
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center bg-[#F5F2EB]">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="w-12 h-12 text-[#2F4138] animate-spin" />
          <p className="text-[#2F4138] text-lg font-medium">Loading gallery...</p>
        </div>
      </div>
    );
  }

  if (!imgs.length) {
    return (
      <div className="min-h-[400px] flex items-center justify-center bg-[#F5F2EB]">
        <div className="flex flex-col items-center space-y-4 text-[#2F4138]">
          <ImageIcon className="w-16 h-16" />
          <p className="text-lg font-medium">No images available</p>
        </div>
      </div>
    );
  }

  return (
    <section className="py-16 bg-[#F5F2EB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-center text-[#2F4138] mb-12">Our Gallery</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {imgs.map((img) => (
            <div 
              key={img.public_id}
              className="group relative overflow-hidden rounded-xl shadow-lg transition-transform duration-300 hover:scale-105"
            >
              <img
                src={`${img.secure_url}?w=400&h=400&fit=crop&auto=format`}
                alt=""
                loading="lazy"
                className="aspect-square object-cover w-full transform transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-[#2F4138]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          ))}
        </div>
      </div>
      <ToastContainer />
    </section>
  );
}