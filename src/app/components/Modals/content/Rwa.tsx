import React from 'react';

export default function Rwa() {
  return (
    <div className="flex flex-col gap-y-4 py-4 text-white max-w-[35rem] text-center items-center">
      <div>
        <img src="/icons/ex-icon.svg" alt="error" className="w-20 h-20" />
      </div>
      <h1 className="text-white text-2xl font-medium">
        Interested in creating your RWA artworks?
      </h1>
      <div className="px-10">
        <p className="text-lg font-medium">
          To create RWA artworks, you must own a curation.
          <br />
          Please start by creating a curation.
          <br />
          If you need any help, feel free to contact us at any time.
        </p>
      </div>
      <div>
        <a
          href="mailto:info@monsterx.io"
          className="text-xl font-medium text-neon"
        >
          info@monsterx.io
        </a>
      </div>
    </div>
  );
}
