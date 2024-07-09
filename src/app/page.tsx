import { ConnectButton } from "thirdweb/react";
import { client } from "./client";
import { BaseHeader } from "./components/Header/BaseHeader";
import BaseFooter from "./components/Footer/BaseFooter";
import { BaseCarousel } from "./components/Carousels/BaseCarousel";

export default function Home() {
  return (
    <div>
      <main className="p-4 pb-10 min-h-[100vh] flex items-center justify-center container max-w-screen-lg mx-auto">
        <div className="py-20">
          <BaseHeader />

          <div className="flex justify-center mb-20">
            <ConnectButton
              client={client}
              appMetadata={{
                name: "Example App",
                url: "https://www.vault-x.io",
              }}
            />
          </div>
        </div>
      </main>
      
      <BaseFooter />
    </div>
  );
}
