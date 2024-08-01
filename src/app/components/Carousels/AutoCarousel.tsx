import {
  Carousel,
  CarouselContent,
  CarouselItem
} from '@/components/ui/carousel';
import React from 'react';
import Autoplay from "embla-carousel-autoplay";

interface IBaseCarouselProps {
  data: any[];
}

export function AutoCarousel({ data }: IBaseCarouselProps) {
  return (
    <div className="w-full relative">
      <Carousel
        plugins={[
          Autoplay({
            delay: 2000
          })
        ]}
        className="w-full"
        opts={{
          align: 'center',
        }}
      >
        <CarouselContent>
          {data.length > 0
            ? data.map((item: any, index) => (
              <CarouselItem
                key={index}
              >
                <img src={item.image} alt={item.name} />
              </CarouselItem>
            ))
            : null}
        </CarouselContent>
      </Carousel>

      <div className="h-1/4 bg-gradient-to-b from-transparent via-[#2a2a2a] to-[#181818] absolute bottom-0 left-0 right-0 z-10"></div>
    </div>
  );
}
