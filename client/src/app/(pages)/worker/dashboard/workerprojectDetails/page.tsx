
import Images from '../../../../../../public/images/worker/mechanic/Akill_Mech.webp'

import React from 'react'
import Image from 'next/image'
import ShowImage from '@/components/Admin/workerProject/workerProjectImage'



const page = () => {
  return (
    <div className="min-h-[100%] fixed min-w-full bg-gray-200">

      <h2 className='text-3xl font-bold text-center pt-3 w-[80%]'>Worker Project Page</h2>
        <ShowImage />
    </div>

  ) 
}


function add(){
  return(
    <div className="mt-[75px] w-[70%] mr-[5%] ml-[5%] min-h-96 max-h-[600px] overflow-y-auto bg-[#D9D9D9] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
    <div className='w-[500px] h-[500px]'>
      <Image src={Images} alt={''} />
    </div>        
    {/* Add multiple child divs */}
    <div className="child-content w-[500px] h-[500px] bg-blue-200">
      <p>Additional Content 1</p>
    </div>
    <div className="child-content w-[500px] h-[500px] bg-green-200">
      <p>Additional Content 2</p>
    </div>
    
    {/* Button with hover transition */}
    <div className="flex justify-center mt-4">
      <button className="relative px-6 py-3 text-white bg-blue-500 rounded-md transition-transform duration-300 hover:bg-blue-700">
        {/* Button text */}
        <span className="hover-text hidden absolute top-[-30px] text-gray-700 bg-white p-2 rounded-md shadow-md">
          View Details
        </span>
        View
      </button>
    </div>
   
  </div>
  )
}
export default page
