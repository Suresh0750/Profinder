"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import AddImageModal from "./AddModal";
import { useSelector } from "react-redux";
import {fetchProject } from "@/lib/features/api/workerApiSlice";
import { ImageData } from "@/types/workerTypes";



const ImageGrid = () => {
  const [modalData, setModalData] = useState<ImageData | null>(null); // Stores data fetched for modal
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isViewDetails, setIsViewDetails] = useState<boolean>(false);
  const workerData = useSelector((state: any) => state?.WorkerSignupData?.getWorkerData);
  const [showImage, setShowImage] = useState<any[]>([]);
  const [customerData, setCustomerData] = useState<any>({});
  const [stop,setStop] = useState<boolean>(true)


  async function handleFetchProject(){
      try{
        const res = await fetchProject(customerData?._id)
        console.log(res)
        if(res?.success){
          setShowImage(res?.result?.workerImage); 
        }else{
          setShowImage(workerData.workerImage)
        }
      }catch(error:any){
        console.log(error)
      }
  }

  useEffect(()=>{
    if(customerData?._id){
      handleFetchProject()
    }
  },[customerData?._id])

  useEffect(() => {
    // Only access localStorage in the browser
    if (typeof window !== "undefined") {
      const storedData = localStorage.getItem("customerData");
      if (storedData) {
        try {
          setCustomerData(JSON.parse(storedData));
          setStop(false)
        } catch (error) {
          console.error("Error parsing customerData from localStorage:", error);
          setCustomerData({});
        }
      }
    }
  }, []);
  // Fetching worker projects data
  
  // useEffect(() => {
  //   if (data && data.length > 0) {
  //     setShowImage(data?.result); // Using data fetched from the API
  //   } else if (workerData?.WorkerImage) {
  //     setShowImage(workerData.WorkerImage); // Fallback to redux data if API fails
  //   }
  // }, [data, workerData]);

  const handleButtonClick = async (workerProject: any) => {
    try {
      console.log(JSON.stringify(workerProject))
      setModalData(workerProject);
      setIsViewDetails(true); // Open modal
    } catch (error) {
      console.error("Error fetching image data:", error);
    }
  };

  const closeModal = () => {
    setIsViewDetails(false);
    setModalData(null); // Reset modal data when closed
  };

  return (
    <>
      <div className="w-[80%] flex justify-end">
        <button
          className="p-2 mr-9 bg-green-600 rounded"
          onClick={() => setIsModalOpen(true)}
        >
          Add Image
        </button>
      </div>

      {/* Image grid container */}
      <div className="mt-[75px] w-[70%] mr-[5%] ml-[5%] min-h-96 max-h-[600px] overflow-y-auto overflow-x-hidden bg-[#D9D9D9] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {/* Loop through images */}
        {showImage?.length > 0 &&
          showImage?.map((workerProject: any) => (
            <div
              key={workerProject._id}
              className="relative w-full h-[300px] group overflow-hidden"
            >
              {/* Displaying the Image */}
              <Image
                src={workerProject?.projectImage}
                alt={`${workerProject?.projectName} Image`}
                className="w-full h-full object-cover"
                width={250}
                height={250}
              />

              {/* Button container with hover effect */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded-md transform transition-transform duration-300 hover:scale-110"
                  onClick={() => handleButtonClick(workerProject)}
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
      </div>

      {/* Modal */}
      {isViewDetails && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 mb-4">
          <div className="bg-white p-6 rounded-lg relative w-[80%] max-w-[800px]">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
              onClick={closeModal}
            >
              Close
            </button>
            {/* Modal content */}
            {modalData && (
              <div>
                <Image
                  src={modalData.projectImage}
                  alt={modalData.projectDescription}
                  width={500}
                  height={500}
                  className="object-cover"
                />
                <p>{modalData.projectName}</p>
              </div>
            )}
          </div>
        </div>
      )}

      <AddImageModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        refetch={() => handleFetchProject()}
      />
    </>
  );
};

export default ImageGrid;
