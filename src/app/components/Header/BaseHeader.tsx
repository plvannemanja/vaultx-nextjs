export function BaseHeader() {
  return (
    <header className="flex gap-5 justify-between items-center self-center px-5 w-full max-w-[1340px] max-md:flex-wrap max-md:max-w-full">
      <img
        loading="lazy"
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/3df41f8b967b49557e601759e181abe1e025c27d5de19a18a16f3be9f7e8b5cc?apiKey=139ecc41c5504a1eaf66b57282b4995a&"
        className="shrink-0 self-stretch my-auto max-w-full aspect-[5.56] w-[134px]"
      />
      <div className="flex gap-5 justify-between self-stretch my-auto text-base font-medium text-white max-md:flex-wrap">
        <div className="font-extrabold">Appreciation</div>
        <div>Curation</div>
        <div>Magazine</div>
        <div>How it Works</div>
      </div>
      <div className="flex gap-1.5 self-stretch text-sm max-md:flex-wrap">
        <div className="flex flex-auto gap-5 px-7 py-3.5 rounded-xl bg-neutral-800 leading-[160%] text-white text-opacity-50 max-md:flex-wrap max-md:px-5">
          <div className="flex-1">Search artwork, collection...</div>
          <div className="shrink-0 w-6 h-6" />
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/ab0e863095bc6bef551a641eaea407955d33c77d115438552ad53881bfaf39bd?apiKey=139ecc41c5504a1eaf66b57282b4995a&"
            className="shrink-0 my-auto border-2 border-white border-solid aspect-square stroke-[1.5px] stroke-white w-[18px]"
          />
        </div>
        <div className="flex gap-2.5 justify-center px-5 py-3.5 font-extrabold capitalize bg-yellow-300 rounded-lg text-neutral-900 max-md:px-5">
          <div className="my-auto">Connect Wallet</div>
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/18eb5029ba3df004bdab829bab3654d479c8b31000d1ff4dab00634991263048?apiKey=139ecc41c5504a1eaf66b57282b4995a&"
            className="shrink-0 aspect-square w-[26px]"
          />
        </div>
      </div>
    </header>
  );
}
