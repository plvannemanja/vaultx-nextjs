export default function BasicLoadingModal({ message }: { message: string }) {
  return (
    <div className="flex flex-col gap-y-9 items-center text-center">
      <img src="/icons/refresh.svg" className="w-20 mx-auto" />
      <p className="text-[30px] font-extrabold font-medium">{message}</p>
    </div>
  );
}
