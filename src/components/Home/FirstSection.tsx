"use client";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import Image from "next/image";
import { cn } from "@/lib/utils";
import Link from "next/link";

const sections = [
  {
    title: "Kepuasan Martabak dalam Setiap Gigitan.",
    imageSrc: "/images/martelor1.jpeg",
  },
  {
    title: "Nikmatnya Martabak Setiap Waktu, Setiap Hari!",
    imageSrc: "/images/martabak1.jpeg",
  },
  {
    title: "Rasa Kesenangan yang Menggugah Selera!",
    imageSrc: "/images/martelor4.jpeg",
  },
  {
    title: "Jelajahi Kelezatan Martabak Tanpa Batas!",
    imageSrc: "/images/martelor3.jpeg",
  },
];

const FirstSection = () => {
  const [currentSlide, setCurrentSlide] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(
      () =>
        setCurrentSlide((prev) =>
          prev === sections.length - 1 ? 0 : prev + 1
        ),
      4000
    );

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div
      className={cn(
        "flex  min-h-screen h-full",
        currentSlide % 2 == 0
          ? "flex-col md:flex-row"
          : "flex-col-reverse md:flex-row-reverse"
      )}
    >
      <div className="left flex flex-1 flex-col gap-10 justify-center items-center px-10 sm:px-16">
        <h1 className="text-4xl sm:text-6xl text-green-600 font-semibold text-center">
          {sections[currentSlide].title}
        </h1>
        <Button>
          <Link href={"/menu"}>Order Now</Link>
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
