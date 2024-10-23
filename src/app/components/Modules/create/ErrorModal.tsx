import Image from 'next/image';
import BaseButton from '../../ui/BaseButton';

export default function ErrorModal({
  data,
  close,
  title,
}: {
  data: Array<any> | string;
  close: any;
  title: string;
}) {
  return (
    <div className="flex flex-col gap-y-6 items-center content-center w-[100%] p-3">
      <div className="flex gap-x-3 items-center">
        <Image
          src="/icons/info.svg"
          className="w-10"
          width={40}
          height={40}
          alt="icon"
        />
        <p className="text-[28px] font-extrabold">{title}</p>
      </div>
      <div className="flex flex-col gap-y-2 mb-[56px]">
        {Array.isArray(data) ? (
          data.map((item: any, index: number) => {
            return (
              <div key={index}>
                <p className="text-white/[53%] azeret-mono-font text-lg">
                  {index + 1}.{' '}
                  {item.path[0].slice(0, 1).toUpperCase() +
                    item.path[0].slice(1)}{' '}
                  is invalid
                </p>
              </div>
            );
          })
        ) : (
          <p className="text-white/[53%] azeret-mono-font text-lg">{data}</p>
        )}
      </div>
      <BaseButton
        title="I Agree"
        variant="primary"
        onClick={close}
        className="max-w-[210px]"
      />
    </div>
  );
}
