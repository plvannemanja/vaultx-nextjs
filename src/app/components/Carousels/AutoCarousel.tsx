import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import React from 'react';
import Autoplay from 'embla-carousel-autoplay';
import { ensureValidUrl } from '@/utils/helpers';
import Image from 'next/image';
interface IBaseCarouselProps {
  data: any[];
}

export function AutoCarousel({ data }: IBaseCarouselProps) {
  return (
    <div className="w-full relative">
      {/* <Carousel
        plugins={[
          Autoplay({
            delay: 2000
          })
        ]}
        className="w-full"
        opts={{
          align: 'center',
        }}
      > */}
      <Carousel
        plugins={[
          Autoplay({ delay: 2000 }), // Type assertion to prevent type errors
        ]}
        className="w-full"
        opts={{
          align: 'center',
        }}
      >
        <CarouselContent>
          {data.length > 0
            ? data.map((item: any, index) => (
                <CarouselItem key={index}>
                  <a href={ensureValidUrl(item.link)} target="_blank">
                    <div className="w-full sm:w-[640px] md:w-[768px] lg:w-[1024px] xl:w-[1320px] h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] xl:h-[658px] mx-auto relative">
                      <Image
                        src={item.image}
                        alt={item.name}
                        layout="fill"
                        objectFit="cover"
                        className="rounded-3xl"
                      ></Image>
                    </div>
                  </a>
                </CarouselItem>
              ))
            : null}
        </CarouselContent>
      </Carousel>

      <div className="h-1/4 bg-gradient-to-b from-transparent via-[#2a2a2a] to-[#181818] absolute bottom-0 left-0 right-0 z-10"></div>
    </div>
  );
}
