"use client";
import { FiArrowRight, FiInfo } from "react-icons/fi";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import Link from "next/link";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import img1 from "../../assets/img-1.jpg";
import img2 from "../../assets/img-2.jpg";
import img3 from "../../assets/img-3.png";
import img4 from "../../assets/img-4.jpg";
import img5 from "../../assets/img-5.jpg";

const slides = [
  {
    id: 1,
    image: img1,
    title: "Turn Your Startup Ideas Into Reality",
    description:
      "Share innovative startup ideas, connect with creative minds, and build the future together.",
    button: "Explore Ideas",
  },
  {
    id: 2,
    image: img2,
    title: "Discover The Next Big Innovation",
    description:
      "Explore trending startup concepts from developers, entrepreneurs, and innovators.",
    button: "Browse Ideas",
  },
  {
    id: 3,
    image: img3,
    title: "Build, Validate & Grow Together",
    description:
      "Get valuable feedback, improve your ideas, and turn concepts into real startups.",
    button: "Start Sharing",
  },
  {
    id: 4,
    image: img4,
    title: "Join A Creative Startup Community",
    description:
      "Connect with ambitious creators and discover opportunities through collaboration.",
    button: "Join Community",
  },
  {
    id: 5,
    image: img5,
    title: "Empower Your Journey With Mentorship",
    description:
      "Connect with experienced industry experts, gain guidance, and accelerate your growth.",
    button: "Find A Mentor",
  },
];

export default function Banner() {
  return (
    <section className="w-full px-4 sm:px-6 lg:px-8 py-4 bg-light-bg dark:bg-dark-bg transition-colors duration-300">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        navigation={{
          nextEl: ".swiper-button-next-custom",
          prevEl: ".swiper-button-prev-custom",
        }}
        pagination={{
          clickable: true,
          bulletActiveClass: "swiper-pagination-bullet-active-custom",
        }}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        loop={true}
        className="rounded-2xl md:rounded-3xl overflow-hidden relative group"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="relative h-[65vh] sm:h-[70vh] md:h-[80vh] w-full">
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                priority
                className="object-cover object-center"
              />

              <div className="absolute inset-0 bg-linear-to-r from-black/80 via-black/50 to-transparent sm:from-black/75" />

              {/* content */}
              <div className="relative z-10 h-full max-w-7xl mx-auto px-6 sm:px-12 flex items-center">
                <div className="max-w-2xl text-white space-y-4 sm:space-y-6">
                  {/* badge*/}
                  <div>
                    <span className="inline-block px-3 py-1 sm:px-4 sm:py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm font-medium tracking-wide text-accent-cyan">
                      Innovation Starts Here
                    </span>
                  </div>

                  <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight font-heading">
                    {slide.title}
                  </h1>

                  {/* para */}
                  <p className="text-sm sm:text-base md:text-lg text-slate-200 leading-relaxed max-w-lg">
                    {slide.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-2">
                    {/*btn-1*/}
                    <Link
                      href="/ideas"
                      className="bg-linear-to-r from-accent-cyan to-accent-purple text-white text-xs sm:text-sm md:text-base transition-all duration-300 px-5 py-2.5 sm:px-7 sm:py-3 rounded-xl font-semibold shadow-lg shadow-accent-cyan/20 hover:brightness-110 active:scale-95 cursor-pointer flex items-center space-x-2"
                    >
                      <span>{slide.button}</span>
                      <FiArrowRight className="w-4 h-4" />
                    </Link>

                    <Link
                      href="/ideas"
                      className="border border-white/30 bg-white/5 backdrop-blur-sm hover:bg-white hover:text-black text-xs sm:text-sm md:text-base transition-all duration-300 px-5 py-2.5 sm:px-7 sm:py-3 rounded-xl font-semibold active:scale-95 cursor-pointer flex items-center space-x-2"
                    >
                      <FiInfo className="w-4 h-4" />
                      <span>Learn More</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}

        <div className="swiper-button-prev-custom hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 items-center justify-center rounded-full bg-black/30 backdrop-blur-sm border border-white/10 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer hover:bg-white hover:text-black">
          ❮
        </div>
        <div className="swiper-button-next-custom hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 items-center justify-center rounded-full bg-black/30 backdrop-blur-sm border border-white/10 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer hover:bg-white hover:text-black">
          ❯
        </div>
      </Swiper>

      <style>{`
        .swiper-pagination-bullet {
          background: #ffffff !important;
          opacity: 0.4;
        }
        .swiper-pagination-bullet-active {
          background: #00f2fe !important; 
          opacity: 1 !important;
          width: 20px !important;
          border-radius: 4px !important;
          transition: all 0.3s ease;
        }
      `}</style>
    </section>
  );
}
