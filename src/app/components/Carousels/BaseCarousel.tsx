import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Label } from '@/components/ui/label';
import { ArrowRight } from 'lucide-react';
import React from 'react';
import NftCard from '../Cards/NftCard';

interface IBaseCarouselProps {
  heading: React.ReactNode;
  data: any[];
}

export function BaseCarousel({ heading, data }: IBaseCarouselProps) {
  return (
    <div className="w-full px-10 lg:px-20">
      <div className="flex justify-between items-center my-10 text-white flex-wrap">
        {heading}
        <div className="flex items-center gap-x-3 text-lg font-medium cursor-pointer">
          <Label className="text-sm md:text-lg font-extrabold">
            Discover More
          </Label>
          <div className="w-6 h-6 rounded-full border flex justify-center items-center border-white/10 bg-[#2d2d2d]">
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </div>
      <Carousel
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
                  className="md:basis-1/2 lg:basis-1/3 xl:basis-1/4"
                >
                  <NftCard data={item} />
                </CarouselItem>
              ))
            : null}
        </CarouselContent>

        {data.length > 0 ? (
          <div className="w-[20rem] mx-auto flex justify-center gap-x-4 items-center my-8 relative">
            <CarouselPrevious className="absolute left-8" />
            <div className="flex items-center gap-x-1 font-medium text-dark">
              {Array.from({ length: 5 }).map((_, index) => (
                <span
                  key={index}
                  className={index === 2 ? 'text-neon' : 'text-dark'}
                >
                  +
                </span>
              ))}
            </div>
            <CarouselNext className="absolute right-8" />
          </div>
        ) : null}
      </Carousel>
    </div>
  );
}
