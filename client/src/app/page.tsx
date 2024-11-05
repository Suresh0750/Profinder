"use client"
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const RedirectHome = () => {
  const router = useRouter();

  useEffect(() => {
    router.push('/homePage');
  });

  return null;
};

export default RedirectHome;
