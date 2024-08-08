import React from "react";

export default function Curation() {
    return (
        <div className="flex flex-col gap-y-4 py-4 text-white max-w-[35rem] text-center items-center">
            <div>
                <img
                    src="/icons/ex-icon.svg"
                    alt="error"
                    className="w-20 h-20"
                />
            </div>
            <h1 className="text-white text-2xl font-medium">
                Interested in creating your own curation?
            </h1>
            <div className="px-10">
                <p className="text-lg font-medium">
                    At present, only artists who have received creation permissions from
                    the administrator can create curations.
                    <br />
                    If you'd like to learn more about obtaining creation permissions,
                    please feel free to contact us at anytime.
                </p>
            </div>
            <div>
                <a href="mailto:info@monsterx.io" className="text-xl font-medium text-neon">
                    info@monsterx.io
                </a>
            </div>
        </div>
    );
}
