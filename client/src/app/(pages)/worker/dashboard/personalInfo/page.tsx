
import React from 'react';

import DashboardPersonalInfo from '@/components/Worker/dashboard/P(personalInfo)';

const PersonalInfo = () => {
  return (
    <div className="w-[80%] max-w-2xl bg-slate-500 m-7 p-8 rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-white text-center mb-6">Personal Information</h2>
        <DashboardPersonalInfo />
    </div>
  );
};

export default PersonalInfo;
