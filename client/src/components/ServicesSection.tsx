import React from 'react';
import Image from "next/image"

const services = [
  {
    title: 'Implement General Contract',
    description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
    image: '/service-1.jpg',
  },
  {
    title: 'Building Renovation',
    description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
    image: '/service-2.jpg',
  },
  {
    title: 'Building Construction',
    description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
    image: '/service-3.jpg',
  },
];

const ServicesSection: React.FC = () => {
  return (
    <section className="bg-gray-100 py-16">
      <div className="container mx-auto text-center">
        <h2 className="text-4xl font-bold">Modern Elegant Design Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {services.map((service, index) => (
            <div key={index} className="bg-white p-8 shadow-lg">
              <Image src={service.image} alt={service.title} className="w-full h-48 object-cover" />
              <h3 className="text-2xl font-bold mt-4">{service.title}</h3>
              <p className="mt-2">{service.description}</p>
              <button className="mt-4 bg-yellow-500 px-4 py-2 rounded text-black">
                Read More
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
