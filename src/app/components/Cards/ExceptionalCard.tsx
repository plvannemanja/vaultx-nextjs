import Image from "next/image"

export default function ExceptionalCard({logo, name}: {logo: string, name: string}) {
  return (
    <div className="bg-dark p-3 w-full">
        <Image src={logo} width={100} height={100} className="w-full" alt="curation" />
        
        <p className="text-lg text-white text-center">
            {name}
        </p>
    </div>
  )
}
