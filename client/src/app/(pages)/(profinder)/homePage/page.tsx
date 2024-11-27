"use client"
import {useState,useEffect,useCallback} from 'react'
import Image from 'next/image';
import Link from 'next/link'
import Navbar from '@/components/Navbar/page'
import SliderSection from '@/components/SliderSection';
import {useRouter} from 'next/navigation'
import InnovationOfMetallurgy from '../../../../../public/images/InnovationMetallurgy.jpg'
import IndustrySociety from '../../../../../public/images/IndustrySociety.jpg'
import AboutIndustry from '../../../../../public/images/aboutIndustry.jpg'
import IndustryValue from '../../../../../public/images/IndustryValue.jpg'
import { AiTwotoneEnvironment } from "react-icons/ai"
import {  
  listWorkerData,
} from "@/lib/features/api/customerApiSlice"
import { WorkerDatails } from '@/types/workerTypes';


//listWorkerData
const getCurrentLocation = (): Promise<GeolocationCoordinates> => {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) => resolve(position.coords),
      (error) => reject(error)
    )
  })
}

const Home = () => {
  // 
  const router = useRouter()
  const [location, setLocation] = useState<{latitude: number, longitude: number}>({latitude: 0, longitude: 0})
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


  const [mechanic,setMechannic] = useState<any>([])
  

  
  useEffect(()=>{
    getCurrentLocation().then(
      (coords) => {
        setLocation({latitude: coords.latitude, longitude: coords.longitude})
      },
      (error) => console.error('Error getting location:', error)
    )
  },[])

  useEffect(()=>{
    const fetchWorkerData = async ()=>{
      try{
        if(location?.latitude!=0){
          const res = await listWorkerData(location)
          const mechanic = (res?.result)?.filter((data:any)=>data?.category=="Mechanical")
          setMechannic(res?.result)
        }
      }catch(error:any){
        console.log(error)
      }
    }
    fetchWorkerData()
  },[location])

  const handleRedirectWorkerPage = useCallback((_id: string, worker: WorkerDatails) => {
    // alert('dds')
    console.log('worker',worker)
    if (typeof window !== "undefined" && worker) {
      localStorage.setItem("workerDetails", JSON.stringify({
        _id: worker._id,
        category: worker.category,
        firstName: worker.firstName,  
      }))
    }
    router.push(`/worker-details/${_id}`)
  }, [router])
  
  return (
    <>
    <div className='mt-[3em]'>
      {/* Slider Section */}
     <SliderSection />
      {/* Services Section */}
      {/* <section className="py-12 bg-gray-100">
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
      </section> */}
      {/* Services Section */}
      <section className="py-12 bg-gray-100">
        <div className="container mx-auto">
          <h2 className="text-center text-3xl font-bold mb-6">Modern Elegant Design Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {
            mechanic?.length>0 && (
              <>
              <div className="bg-white p-6 rounded shadow cursor-pointer" onClick={()=>handleRedirectWorkerPage(mechanic?.[0]?._id,mechanic?.[0])}>
              
                  <Image src={mechanic?.[0]?.profile} alt="Service 1" width={400} height={300} />
                  <h3 className="text-xl font-bold mt-4">{mechanic?.[0]?.firstName}</h3>
                  <div className="flex items-center text-gray-500 mt-2">
                        <AiTwotoneEnvironment className="mr-1" />
                        <span>{mechanic?.[0]?.streetAddress}</span>
                  </div>
          
              </div>
              <div className="bg-white p-6 rounded shadow cursor-pointer" onClick={()=>handleRedirectWorkerPage(mechanic?.[1]?._id,mechanic?.[1])}>
                
                  <Image src={mechanic?.[1]?.profile} alt="Service 2" width={400} height={300} />
                  <h3 className="text-xl font-bold mt-4">{mechanic?.[1]?.firstName}</h3>
                  <div className="flex items-center text-gray-500 mt-2">
                        <AiTwotoneEnvironment className="mr-1" />
                        <span>{mechanic?.[1]?.streetAddress}</span>
                  </div>
                
              </div>
              <div className="bg-white p-6 rounded shadow cursor-pointer" onClick={()=>handleRedirectWorkerPage(mechanic?.[2]?._id,mechanic?.[2])}>
               
                  <Image src={mechanic?.[2]?.profile} alt="Service 3" width={400} height={300} />
                  <h3 className="text-xl font-bold mt-4">{mechanic?.[2]?.firstName}</h3>
                  <div className="flex items-center text-gray-500 mt-2">
                        <AiTwotoneEnvironment className="mr-1" />
                        <span>{mechanic?.[2]?.streetAddress}</span>
                  </div>
               
              </div>
              </>
            )
            }
          </div>
        </div>
      </section>
    {/* New Missing Section: Explore Our Expertise */}
    <section id="expertise" className="py-16 bg-gray-100 text-center">
            <h2 className="text-3xl font-bold">Explore Our Expertise</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8 mx-6">
            {expertise.map((item, index) => (
                <Link href={`/service-workerlist`} key={index} >
                  <div className="bg-white shadow-lg rounded-lg">
                  <Image src={item.imageSrc} alt={item.title} width={400} height={300} className="rounded-t-lg object-cover w-full" />
                  <div className="p-6">
                      <h3 className="text-xl font-bold mb-4">{item.title}</h3>
                      <p>{item.description}</p>
                  </div>
                  </div>
                </Link>
            ))}
            </div>
        </section>
      {/* Industry Performance Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-6">
          <div className="md:w-1/2">
            <Image src={AboutIndustry} alt="Performance" width={600} height={400} className="rounded" />
          </div>
          <div className="md:w-1/2 bg-white shadow-lg p-8 rounded-lg border border-gray-200">
            <h2 className="text-4xl font-extrabold mb-4 text-gray-800">
              What About Our Industry Performance
            </h2>
            <p className="text-gray-600 leading-relaxed">
              ProFinder stands out impressively in the blue-collar service industry, transforming how users connect with reliable service professionals. By emphasizing user-friendly design, efficient geolocation-based searches, and a robust categorization system, ProFinder offers a seamless experience for customers in need of quick, quality services from trusted workers.
            </p>
          </div>

        </div>
      </section>

    </div>
    </>
  );
};

export default Home;
