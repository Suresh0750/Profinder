


// * Admin Login page

import AdminLoginForm from "@/components/Admin/AdminLogin";
const AdminLogin = () => {

  return (
    <div className="flex justify-center items-center w-full h-screen bg-gray-900 text-white">
      <div className="bg-gray-800 bg-opacity-90 text-white w-[90%] md:w-[30%] rounded shadow-lg">
        <div className="p-6 mt-5">
          <h2 className="text-center text-2xl font-bold">Admin Login</h2>
          <AdminLoginForm />
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
