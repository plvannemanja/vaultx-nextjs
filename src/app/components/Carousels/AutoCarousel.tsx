import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import { ensureValidUrl } from '@/utils/helpers';
import Autoplay from 'embla-carousel-autoplay';
interface IBaseCarouselProps {
  data: any[];
}

export function AutoCarousel({ data }: IBaseCarouselProps) {
  return (
    <div className="w-full relative pb-6 sm:pb-10 md:pb-12">
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
                    <div className="hero__content__blk md:p-20 p-8 h-full relative min-h-[500px] md:min-h-[600px] lg:min-h-[700px]">
                      <img
                        src={item.image}
                        alt={item.name}
                        // layout="fill"
                        // objectFit="cover"
                        className="rounded-3xl absolute z-0 left-0 right-0 top-0 bottom-0 object-cover w-full h-full"
                      />
                      <div className="h-1/4 bg-gradient-to-b from-transparent to-[#181818] absolute bottom-0 left-0 right-0 z-10"></div>
                    </div>
                  </a>
                </CarouselItem>
              ))
            : null}
        </CarouselContent>
      </Carousel>
      {/* <div className="h-1/4 bg-gradient-to-b from-[#BCBCBC]/0 to-[#181818] absolute bottom-0 left-0 right-0 z-10"></div> */}
    </div>
  );
}
