
import Images from '../../../../../../public/images/worker/mechanic/Akill_Mech.webp'

import React from 'react'
import Image from 'next/image'
import ShowImage from '@/components/Admin/WorkerProject/WorkerProjectImage'



const page = () => {
  return (
    <div className="min-h-[100%] fixed min-w-full bg-gray-200">

      <h2 className='text-3xl font-bold text-center pt-3 w-[80%]'>Worker Project Page</h2>
        <ShowImage />
    </div>

  ) 
}


export default page
