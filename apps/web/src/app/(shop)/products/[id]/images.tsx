"use client";

import { getCDNUrl } from "@/utils";
import { MenuImage } from "@hackathon-qrmenu/type";
import Image from "next/image";
import { useState } from "react";
import { Swiper, SwiperSlide, SwiperClass } from "swiper/react";
import "swiper/css";

export const ImageSlider = ({ images }: { images: MenuImage[] }) => {
  const [swiper, setSwper] = useState<SwiperClass | null>(null);
  const [index, setIndex] = useState(0);

  return (
    <div className="relative w-full h-[240px] flex items-center justify-center bg-black">
      {swiper?.allowSlidePrev && (
        <button
          className="absolute left-0 w-10 h-10 flex z-10"
          type="button"
          onClick={() => {
            swiper.slidePrev();
          }}
        >
          <Image
            className="m-auto"
            src="/chervon-left.png"
            alt="Cherovon"
            width={15}
            height={15}
          />
        </button>
      )}

      <Swiper
        className="w-full h-full"
        spaceBetween={0}
        slidesPerView={1}
        onSwiper={setSwper}
        onSlideChange={(s) => {
          setIndex(s.realIndex);
        }}
      >
        {images.map((x, i) => (
          <SwiperSlide key={i}>
            <Image
              src={getCDNUrl(x.image.key)}
              alt="Test"
              fill
              objectFit="cover"
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {swiper?.allowSlideNext && (
        <button
          className="absolute right-0 w-10 h-10 flex z-10"
          type="button"
          onClick={() => {
            swiper.slideNext();
          }}
        >
          <Image
            className="m-auto"
            src="/chervon-right.png"
            alt="Cherovon"
            width={15}
            height={15}
          />
        </button>
      )}

      <div className="rounded-xl bg-[rgba(0,0,0,0.5)] absolute z-10 bottom-2.5 text-white py-1 px-3 font-bold text-[12px]">
        {index + 1}/{images.length}
      </div>
    </div>
  );
};
