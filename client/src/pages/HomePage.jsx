

const HomePage =() => {
    return (
        <>
        <div className="relative h-[350px]">
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://res.cloudinary.com/drszm8sem/image/upload/v1744978827/monochromatic-still-life-composition-with-tableware_oc2kfe.jpg')",
            }}
          />
    
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
    
          {/* Text Content */}
          <div className="relative z-10 flex items-end h-full p-6 text-white">
            <div>
              <h1 className="text-4xl font-bold">Welcome to CeramiCo</h1>
              <p className="mt-2 text-lg">
              Where clay meets soul.
              Explore handcrafted pottery made with intention, and join our workshops to shape your own story—one spin at a time.
              </p>
            </div>
          </div>
        </div>
        <div>
            <h2 className="text-2xl font-bold">Gallery</h2>
        </div>
        </>
      );
    };

export default HomePage