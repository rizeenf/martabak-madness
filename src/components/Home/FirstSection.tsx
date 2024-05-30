"use client";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import Image from "next/image";
import { cn } from "@/lib/utils";
import Link from "next/link";

const sections = [
  {
    title: "Kepuasan dalam Setiap Gigitan.",
    imageSrc: "/images/makanan/ayam-tepung.jpeg",
  },
  {
    title: "Nikmatnya Makan Setiap Waktu, Setiap Hari!",
    imageSrc: "/images/makanan/ikan-gurame.jpeg",
  },
  {
    title: "Rasa Kesenangan yang Menggugah Selera!",
    imageSrc: "/images/minuman/es-teh.jpeg",
  },
  {
    title: "Jelajahi Kelezatan Cemilan Tanpa Batas!",
    imageSrc: "/images/cemilan/kebab.jpeg",
  },
];

const FirstSection = () => {
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [fade, setFade] = useState<boolean>(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrentSlide((prev) => (prev === sections.length - 1 ? 0 : prev + 1));
        setFade(true);
      }, 500);
    }, 6000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div
      className={cn(
        "flex min-h-screen h-full",
        currentSlide % 2 === 0
          ? "flex-col md:flex-row"
          : "flex-col-reverse md:flex-row-reverse",
        fade
          ? "opacity-100 transform translate-x-0 transition-all duration-500 ease-in-out overflow-x-hidden"
          : "opacity-0 transform translate-x-full transition-all duration-200 ease-in-out overflow-x-hidden"
      )}
    >
      <div className="left flex flex-1 flex-col gap-10 justify-center items-center px-10 sm:px-16">
        <h1 className="text-4xl sm:text-6xl text-green-600 font-semibold text-center">
          {sections[currentSlide].title}
        </h1>
        <Button>
          <Link href={"/menu"}>Pesan Sekarang</Link>
        </Button>
      </div>
      <div className="right flex flex-1 justify-center items-center relative px-10 sm:px-16">
        <Image
          fill
          alt="Martabak"
          src={sections[currentSlide].imageSrc}
          className="object-cover"
        />
      </div>
    </div>
  );
};

export default FirstSection;
