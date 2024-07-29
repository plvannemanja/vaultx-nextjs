import Image from 'next/image';

export default function ExceptionalCard({
  logo,
  name,
}: {
  logo: string;
  name: string;
}) {
  return (
    <div className="bg-dark p-3 w-full h-full lg:w-[48%] aspect-square">
      <Image
        src={logo}
        width={100}
        height={100}
        className="w-full h-full object-cover"
        alt="curation"
      />

      <p className="text-lg text-white text-center mt-2">{name}</p>
    </div>
  );
}
