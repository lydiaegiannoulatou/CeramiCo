import { useEffect, useState } from "react";
import axios from "axios";

export default function Gallery() {
  const [imgs, setImgs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:3050/admin/gallery")        // public GET
      .then((res) => setImgs(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="py-12 text-center">Loading gallery…</p>;

  return (
    <section className="py-12 bg-[#f7f4ea]">
      <h2 className="font-serif text-3xl text-center mb-10">Gallery</h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 px-4">
        {imgs.map((img) => (
          <img
            key={img.public_id}
            src={`${img.secure_url}?w=400&h=400&fit=crop&auto=format`}
            alt=""
            loading="lazy"
            className="aspect-square object-cover rounded-xl shadow"
          />
        ))}
      </div>
    </section>
  );
}
