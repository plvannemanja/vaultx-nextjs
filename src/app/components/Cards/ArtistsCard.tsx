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
    <div className="relative w-full min-h-[661px] col-span-4">
      <a className="w-full" href={subtitle2 ? subtitle2 : ''}>
        <Image
          src={image}
          layout="fill"
          objectFit="cover"
          alt="artist-pic"
          className="rounded"
        />
        <div className="absolute bottom-8 w-[90%] mx-auto ml-4 flex flex-col gap-y-4 text-white font-bold">
          <hr className="h-[0.15rem] bg-gradient-to-r from-blue-500 via-green-400 to-orange-400" />
          <p>{title}</p>
          {subtitle1 && <p>{subtitle1}</p>}
        </div>
      </a>
    </div>
  );
}
