import { Label } from "@/components/ui/label";

export default function Settings() {
  return (
    <div className="flex flex-col gap-y-4 px-4">
        <div className="w-full justify-center items-center">
            <p className="text-center text-xl font-medium">Edit Profile</p>
        </div>

        <div className="w-full flex flex-col gap-y-5 mt-5">
            <div className="w-full rounded-md px-4 py-3 bg-dark flex flex-col gap-y-2">
                <Label className="text-lg font-medium">Edit your avatar</Label>
                <hr className="bg-white" />
            </div>
        </div>
    </div>
  )
}
