import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Label } from '@/components/ui/label';
import NftCard from '../Cards/NftCard';
import React from 'react';

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
          <Label className="text-sm md:text-lg">Discover More</Label>
          <svg
            width="24px"
            height="24px"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            color="#000000"
            strokeWidth="1.5"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M12 1.25C6.06294 1.25 1.25 6.06294 1.25 12C1.25 17.9371 6.06294 22.75 12 22.75C17.9371 22.75 22.75 17.9371 22.75 12C22.75 6.06294 17.9371 1.25 12 1.25ZM13.0303 7.96967L16.5303 11.4697C16.8232 11.7626 16.8232 12.2374 16.5303 12.5303L13.0303 16.0303C12.7374 16.3232 12.2626 16.3232 11.9697 16.0303C11.6768 15.7374 11.6768 15.2626 11.9697 14.9697L14.1893 12.75H8C7.58579 12.75 7.25 12.4142 7.25 12C7.25 11.5858 7.58579 11.25 8 11.25H14.1893L11.9697 9.03033C11.6768 8.73744 11.6768 8.26256 11.9697 7.96967C12.2626 7.67678 12.7374 7.67678 13.0303 7.96967Z"
              fill="#fff"
            ></path>
          </svg>
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
      </Carousel>
    </div>
  );
}
