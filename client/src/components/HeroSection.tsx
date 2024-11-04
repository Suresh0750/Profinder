import React from 'react';

const HeroSection: React.FC = () => {
  return (
    <section
      className="relative bg-cover bg-center h-screen text-white flex items-center justify-center"
      style={{ backgroundImage: "url('/construction-bg.jpg')" }} // Add your image path here
    >
      <div className="text-center">
        <h1 className="text-5xl font-bold">
          Create Art Of Transforming Future Lives Better
        </h1>
        <p className="mt-4 text-lg">
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
        </p>
        <button className="mt-8 bg-yellow-500 px-6 py-3 rounded-lg text-black">
          Read More
        </button>
      </div>
    </section>
  );
};

export default HeroSection;
