import Image from 'next/image';

export default function ExceptionalCard({
  logo,
  name,
}: {
  logo: string;
  name: string;
}) {
  return (
    <div className="bg-dark p-3 w-full h-full lg:w-[48%] aspect-square relative max-w-[696px] max-h-[696px]">
      <Image
        src={logo}
        layout='fill'
        objectFit='cover'
        alt="curation"
      />

      <p className="text-lg text-white text-center mt-2">{name}</p>
    </div>
  );
}
