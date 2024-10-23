import Image from 'next/image';

export default function ArtistsCard({
  image,
  title,
  subtitle1,
  subtitle2,
}: {
  image: string;
  title: string;
  subtitle1?: string;
  subtitle2?: string;
}) {
  return (
    <div className="relative w-full min-h-[558px] sm:min-h-[400px] md:min-h-[480px] lg:min-h-[558px] 2xl:min-h-[661px] col-span-12 sm:col-span-6 lg:col-span-4">
      <a className="w-full" href={subtitle2 ? subtitle2 : ''}>
        <Image
          src={image}
          layout="fill"
          objectFit="cover"
          alt="artist-pic"
          className="rounded"
        />
        <div className="absolute bottom-8 w-full sm:w-11/12 md:w-10/12 lg:w-9/12 mx-auto ml-4 flex flex-col gap-y-2 text-white font-bold">
          <hr className="h-[2px] mb-2 border-0 bg-gradient-to-r from-[#32CCB8] via-[#32CCB8] to-[#DDF247] " />
          <p className="text-white">{title}</p>
          {subtitle1 && (
            <p className="text-[#D2D2D2] font-normal">{subtitle1}</p>
          )}
        </div>
      </a>
    </div>
  );
}
