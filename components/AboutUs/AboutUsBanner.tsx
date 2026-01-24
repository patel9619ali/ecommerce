"use client";
import Image from "next/image";
import React,{useState,useMemo} from "react";


export default function AboutUsBanner() {
    return (
        <section className="py-8">
            <div className={`flex relative flex-col items-center lg:gap-2 gap-2 flex-wrap lg:mb-4 mb-4`}>
                <h2 className={`text-[19px] sm:text-[37px] font-bold relative z-[2] bg-gradient-to-r from-[#053E54] to-[#057C72] bg-clip-text text-transparent mb-3 bg-clip-text max-w-2xl lg:text-center text-center lg:leading-[48px] leading-normal`}>Welcome to Zabeel Cars, the trusted gateway to premium fleet-owned vehicles.</h2>
                <p className={`lg:text-[19px] text-[12px] font-[400] to-[#666666] mb-3 max-w-2xl lg:text-center text-center lg:leading-[26px] leading-normal`}>Backed by the decades-long heritage of A.A. Al Moosa Enterprise, we make car trading simple, secure, and accessible for automotive professionals. By offering vehicles directly from our own world-class rental fleets, including Thrifty and Dollar, we ensure a seamless experience that combines transparent ownership with competitive, intermediary-free pricing.</p>
                <div className="flex justify-center w-full">
                    <div className="w-full max-w-[1058px] rounded-[20px] overflow-hidden">
                        <Image src="/assets/images/about-us-image.jpg" alt="About Us Banner" width={1058} height={369} className="w-full h-auto aspect-[1058/369] object-cover rounded-[20px]" unoptimized/>
                    </div>
                </div>

            </div>
        </section>
    );
};              