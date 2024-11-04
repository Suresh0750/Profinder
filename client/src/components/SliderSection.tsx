"use client"

import { useState } from 'react';
import Image from 'next/image';
import Homepage1 from '../../public/images/NewHomepage1.jpeg'
import HomepageImage4 from '../../public/images/Homepage4.jpg'

const SliderSection = () =>{
    const [currentSlide, setCurrentSlide] = useState(0);
    const slides = [
        {
          // src: 'https://source.unsplash.com/1600x900/?construction,work',
          src: Homepage1,
          alt: 'Construction Image 1',
          text: 'Create Art of Transforming Future Lives Better',
        },
        {
          // src: 'https://source.unsplash.com/1600x900/?architecture,building',
          src:HomepageImage4,
          alt: 'Construction Image 2',
          text: 'Building the Future with Excellence',
        },
      ];

      
  const handleNextSlide = () => {
    setCurrentSlide((currentSlide + 1) % slides.length);
  };

  const handlePrevSlide = () => {
    setCurrentSlide((currentSlide - 1 + slides.length) % slides.length);
  };

    return(
        <section className="relative z-0">
        <div className="relative h-[600px] w-full">
          {slides.map((slide, index) => (
            <div key={index} className={`  inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}>
              <Image src={slide.src} alt={slide.alt} layout="fill" objectFit="cover" />
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <h2 className="text-4xl font-bold text-white">{slide.text}</h2>
              </div>
            </div>
          ))}
        </div>
        <button onClick={handlePrevSlide} className="absolute left-5 top-1/2 transform -translate-y-1/2 bg-black text-white p-2">Prev</button>
        <button onClick={handleNextSlide} className="absolute right-5 top-1/2 transform -translate-y-1/2 bg-black text-white p-2">Next</button>
      </section>

    )
}

export default SliderSection