"use client"
import React,{Suspense} from 'react'
import Navbar from '@/components/Navbar/page';
import {Triangle} from 'react-loader-spinner'
import Footer from '@/components/Footer';
import '../../globals.css';

export default function ProfinderLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Navbar />
            <main className="min-h-screen">
                <Suspense
                fallback={
                        <Triangle
                            visible={true}
                            height="100"
                            width="100"
                            color="#0f1729"
                            ariaLabel="triangle-loading"
                            wrapperStyle={{}}
                            wrapperClass=""
                        />
                    }
                    >
                    {children}
                </Suspense>
            </main> 
            <Footer />
        </>
    );
}
