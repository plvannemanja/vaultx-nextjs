"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import BaseButton from "../ui/BaseButton"
import Image from "next/image"
import { collectionServices } from "@/services/supplier"
import { z } from "zod"
import BasicDetails from "./create/BasicDetails"
import AdvanceDetails from "./create/AdvanceDetails"

// 1GB file size
const maxFileSize = 1 * 1024 * 1024 * 1024; // 1GB in bytes
const acceptedFormats = ['.png', '.gif', '.webp', '.mp4', '.mp3'];

const basicDetailsSchema = z.object({
    productName: z.string(),
    productDescription: z.string(),
    price: z.number().gt(0),
    curation: z.string(),
    file: z.string(),
});

export default function CreateNft() {
    return (
        <div className="flex flex-col gap-y-4 px-4">
            <p className="text-xl font-medium">Create New NFT</p>

            <AdvanceDetails />
            {/* <BasicDetails /> */}
        </div>
    )
}
