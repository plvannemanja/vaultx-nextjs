/* eslint-disable @next/next/no-img-element */
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
    <div className="bg-dark pt-3 pb-5 px-3 col-span-12 lg:col-span-6">
      <div className="w-full h-full">
        <Link href={`/dashboard/curation/${id}`} target="_blank">
          <img
            src={logo}
            className="exceptinal_curation__image w-full aspect-square object-cover"
            alt="curation"
          />
        </Link>
      </div>
      <p className="text-[30px] font-semibold text-white text-center mt-5">
        {name}
      </p>
    </div>
  );
}
