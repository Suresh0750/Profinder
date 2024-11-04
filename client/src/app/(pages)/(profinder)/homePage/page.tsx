"use client"
import Image from 'next/image';
import Link from 'next/link'
import Navbar from '@/components/Navbar/page'
import SliderSection from '@/components/SliderSection';
import ContractImage from '../../../../../public/images/contractImage.avif'
import Renovation from '../../../../../public/images/RenovationImage.jpg'
import BuildingConstruction from '../../../../../public/images/BuildingConstruction.jpg'
import InnovationOfMetallurgy from '../../../../../public/images/InnovationMetallurgy.jpg'
import IndustrySociety from '../../../../../public/images/IndustrySociety.jpg'
import AboutIndustry from '../../../../../public/images/aboutIndustry.jpg'
import IndustryValue from '../../../../../public/images/IndustryValue.jpg'
import Head from 'next/head'


const Home = () => {
  // 
 
  const expertise = [
    {
      title: "Innovation of Metallurgy",
      description: "Lorem ipsum dolor sit amet consectetur.",
      imageSrc: InnovationOfMetallurgy,
    },
    {
      title: "Industry Society Value",
      description: "Lorem ipsum dolor sit amet consectetur.",
      imageSrc: IndustryValue,
    },
    {
      title: "End Building Fabrications",
      description: "Lorem ipsum dolor sit amet consectetur.",
      imageSrc: IndustrySociety,
    },
  ];


  
  return (
    <>
    <div className='mt-[3em]'>
      {/* Slider Section */}
     <SliderSection />
      {/* Services Section */}
      <section className="py-12 bg-gray-100">
        <div className="container mx-auto">
          <h2 className="text-center text-3xl font-bold mb-6">Modern Elegant Design Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded shadow">
              <Image src={ContractImage} alt="Service 1" width={400} height={300} />
              <h3 className="text-xl font-bold mt-4">Implement General Contract</h3>
              <p className="mt-2">Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
            </div>
            <div className="bg-white p-6 rounded shadow">
              <Image src={Renovation} alt="Service 2" width={400} height={300} />
              <h3 className="text-xl font-bold mt-4">Building Renovation</h3>
              <p className="mt-2">Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
            </div>
            <div className="bg-white p-6 rounded shadow">
              <Image src={BuildingConstruction} alt="Service 3" width={400} height={300} />
              <h3 className="text-xl font-bold mt-4">Building Construction</h3>
              <p className="mt-2">Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
            </div>
          </div>
        </div>
      </section>
    {/* New Missing Section: Explore Our Expertise */}
    <section id="expertise" className="py-16 bg-gray-100 text-center">
            <h2 className="text-3xl font-bold">Explore Our Expertise</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8 mx-6">
            {expertise.map((item, index) => (
                <div key={index} className="bg-white shadow-lg rounded-lg">
                <Image src={item.imageSrc} alt={item.title} width={400} height={300} className="rounded-t-lg object-cover w-full" />
                <div className="p-6">
                    <h3 className="text-xl font-bold mb-4">{item.title}</h3>
                    <p>{item.description}</p>
                </div>
                </div>
            ))}
            </div>
        </section>
      {/* Industry Performance Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-6">
          <div className="md:w-1/2">
            <Image src={AboutIndustry} alt="Performance" width={600} height={400} className="rounded" />
          </div>
          <div className="md:w-1/2">
            <h2 className="text-3xl font-bold mb-4">What About Our Industry Performance</h2>
            <p className="mb-4">Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam voluptate necessitatibus impedit, dignissimos adipisci, debitis nam voluptas vero. Rerum, dolorem.</p>
            <button className="bg-yellow-500 text-black px-4 py-2 rounded">Read More</button>
          </div>
        </div>
      </section>

    </div>
    </>
  );
};

export default Home;
