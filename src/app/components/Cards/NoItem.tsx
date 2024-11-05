const NoItem = () => {
  return (
    <div className="min-h-screen flex justify-center items-center w-full bg-[url(/images/no-item-bg.svg)] bg-center bg-no-repeat bg-cover">
      {/* <Image src="" alt="no-item" fill className="object-over" quality={100} /> */}
      <div className="flex flex-col items-center gap-y-5 justify-center text-center">
        <h1 className="text-[40px] font-extrabold">No items to display</h1>
        <span className="z-10 azeret-mono-font text-sm text-white/[53%]">
          No items to display
        </span>
      </div>
    </div>
  );
};

export default NoItem;
