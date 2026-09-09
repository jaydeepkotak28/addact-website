"use client";
import Image from "next/image";
import { Fragment, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/");
    }, 5000);
    return () => clearTimeout(timer);
  }, [router]);
  return (
    <Fragment>
      <style
        dangerouslySetInnerHTML={{
          __html: `footer { display: none !important; }`,
        }}
      />
      <div className="relative flex flex-col items-center justify-center min-h-[100vh] w-full bg-[#0F0F0F] text-white overflow-hidden">
        <div className="absolute inset-0 hidden sm:flex items-center justify-center pointer-events-none top-[-40%] ">
          <Image
            src="/404%20clouds.svg"
            alt="404 Background Pattern"
            fill
            className="object-scale-down lg:object-none"
          />
        </div>
        <div className="absolute inset-0 hidden sm:flex items-center justify-center pointer-events-none bottom-[-50%]">
          <Image
            src="/404%20island.svg"
            alt="404 Background Pattern"
            fill
            className="object-none"
          />
        </div>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none top-[-50%]  sm:hidden">
          <Image
            src="/404%20clouds%20mobile.svg"
            alt="404 Background Pattern"
            fill
            className="object-scale-down lg:object-none"
          />
        </div>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none bottom-[-50%] sm:hidden">
          <Image
            src="/404%20island%20mobile.svg"
            alt="404 Background Pattern"
            fill
            className="object-fill"
          />
        </div>
        <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 md:px-8 space-y-2">
          <span className="font-montserrat font-bold! text-[100px] sm:text-[140px] md:text-[180px] lg:text-[220px]! leading-none tracking-normal text-center uppercase">
            404
          </span>
          <h2 className="font-montserrat font-light! text-[24px] sm:text-[32px] md:text-[40px]! leading-[30px] sm:leading-[38px] md:leading-[45px]! tracking-normal text-center">
            Page Not Found
          </h2>
        </div>
      </div>
    </Fragment>
  );
}
