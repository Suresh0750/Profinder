'use client'

import React, { useState } from 'react';

const ProfessionalInfoForm: React.FC = () => {
  // State to hold the form data
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    profession: '',
    experience: '',
    skills: '',
    services: '',
    image: null as File | null, // Store the uploaded file
  });

  // State to handle form submission status
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData({
      ...formData,
      image: file,
    });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // You can handle the form submission logic here (e.g., API call)
    console.log('Form Data:', formData);

    // Reset form after submission
    setFormData({
      name: '',
      email: '',
      phone: '',
      profession: '',
      experience: '',
      skills: '',
      services: '',
      image: null,
    });
    
    // Indicate that the form has been submitted
    setFormSubmitted(true);
  };

  return (
    <div className="max-w-md mx-auto p-4 border border-gray-300 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Professional Information Form</h2>
      
      {formSubmitted && (
        <div className="bg-green-100 text-green-700 p-2 mb-4 rounded">
          Your information has been submitted successfully!
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1" htmlFor="name">Name</label>
          <input
            type="text"
            name="name"
            id="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded p-2 w-full"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1" htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded p-2 w-full"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1" htmlFor="phone">Phone</label>
          <input
            type="tel"
            name="phone"
            id="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded p-2 w-full"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1" htmlFor="profession">Profession</label>
          <input
            type="text"
            name="profession"
            id="profession"
            value={formData.profession}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded p-2 w-full"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1" htmlFor="experience">Experience (in years)</label>
          <input
            type="number"
            name="experience"
            id="experience"
            value={formData.experience}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded p-2 w-full"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1" htmlFor="skills">Skills</label>
          <textarea
            name="skills"
            id="skills"
            value={formData.skills}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded p-2 w-full"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1" htmlFor="services">Services Offered</label>
          <textarea
            name="services"
            id="services"
            value={formData.services}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded p-2 w-full"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1" htmlFor="image">Upload Profile Image</label>
          <input
            type="file"
            name="image"
            id="image"
            onChange={handleFileChange}
            accept="image/*"
            className="border border-gray-300 rounded p-2 w-full"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white font-bold py-2 px-4 rounded"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default ProfessionalInfoForm;
