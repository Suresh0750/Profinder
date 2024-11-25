"use client";

import { uploadProject } from "@/lib/features/api/workerApiSlice";
import { useState, ChangeEvent, FormEvent,useEffect } from "react";
import {toast,Toaster} from 'sonner'
import Image from "next/image"

// Define types for props

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  refetch : ()=>void;
}


const UploadModal: React.FC<UploadModalProps> = ({ isOpen, onClose,refetch }) => {
  const [image, setImage] = useState<File | null>(null); // To store uploaded image
  const [projectName, setProjectName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [customerData, setCustomerData] = useState<any>({});
  const [isLoading,setIsLoading] = useState<boolean>(false)



  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file && file.type.startsWith("image/")) {
      setImage(file);
      setError(""); // Clear error if a valid file is selected
    } else {
      setError("Please upload a valid image file");
    }
  };

  const validateForm = (): boolean => {
    // Trim values and ensure none are empty or filled with spaces
    if (!image) {
      setError("Image is required");
      return false;
    }
    if (projectName.trim() === "") {
      setError("Project name is required and cannot contain only spaces");
      return false;
    }
    if (description.trim() === "") {
      setError("Description is required and cannot contain only spaces");
      return false;
    }
    return true;
  };
  useEffect(() => {
    // Only access localStorage in the browser
    if (typeof window !== "undefined") {
      const storedData = localStorage.getItem("customerData");
      if (storedData) {
        try {
          setCustomerData(JSON.parse(storedData));
        } catch (error) {
          console.error("Error parsing customerData from localStorage:", error);
          setCustomerData({});
        }
      }
    }
  }, []);
 
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(""); // Reset error before validation
  
    if (!validateForm() || isLoading) return;
    
    setIsLoading(true)
  
    const formData = new FormData();
    if(customerData?._id) formData.append("_id", customerData?._id);
    
    formData.append("image", image as Blob);
    formData.append("projectName", projectName.trim());
    formData.append("projectDescription", description.trim());
  
    try {
      const response = await uploadProject(formData);
      if (response?.success) {
        toast.success(response.message);
        refetch();  
        
        onClose(); // Close modal on successful submission
      }
    } catch (error: any) {
      setError(error?.message);
      toast.error(error?.message)
      
    } finally{
      setIsLoading(false)
    }
  };
  
  if (!isOpen) return null; // Return null if modal is closed

  return (
    <div className="fixed inset-0 flex items-center justify-center  bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg z-20 w-full max-w-md relative">
        {/* Close button */}
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
          onClick={onClose}
        >
          &times;
        </button>

        <h2 className="text-2xl font-semibold mb-4">Upload Project</h2>

        <form onSubmit={handleSubmit}>
          {/* Image Upload */}
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Upload Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full text-gray-500"
            />
            {image && (
              <Image
                src={URL.createObjectURL(image)}
                alt="Preview"
                className="mt-2 w-full h-48 object-cover rounded-md"
                width={250}
                height={250}
              />
            )}
          </div>

          {/* Project Name */}
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Project Name
            </label>
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Description */}
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              rows={4}
            ></textarea>
          </div>

          {/* Error Message */}
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-700 transition-transform duration-300"
          >
            Submit
          </button>
        </form>
      </div>
      <Toaster richColors position="top-center" />
      
    </div>
  );
};

export default UploadModal;
