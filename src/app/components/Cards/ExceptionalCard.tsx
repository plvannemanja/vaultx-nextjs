import Image from 'next/image';
import Link from 'next/link';

export default function ExceptionalCard({
  logo,
  name,
  id,
}: {
  logo: string;
  name: string;
  id: string;
}) {
  return (
    <div className="bg-dark p-3 w-full h-full lg:w-[48%] max-w-[696px] max-h-[696px]">
      <div className='w-full aspect-square relative'>
        <Link href={`/dashboard/curation/${id}`} target='_blank'>

          <Image
            src={logo}
            layout='fill'
            objectFit='cover'
            alt="curation"
          />
        </Link>
      </div>
      <p className="text-lg text-white text-center mt-2">{name}</p>
    </div>
  );
}
