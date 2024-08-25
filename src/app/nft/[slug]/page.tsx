"use client"

import NftServices from "@/services/nftService"
import { useEffect, useState } from "react"
import Image from "next/image";
import { NFTItemType } from "@/types";
import { Label } from "@/components/ui/label";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { getAllNftActivitys } from "@/services/supplier";
import moment from "moment";
import { FavoriteService } from "@/services/FavoriteService";
import BaseButton from "@/app/components/ui/BaseButton";
import { BaseDialog } from "@/app/components/ui/BaseDialog";
import BuyModal from "@/app/components/Modules/nft/BuyModal";
import BidModal from "@/app/components/Modules/nft/BidModal";
import Quotes from "@/app/components/Modules/nft/Quotes";
import { trimString } from "@/utils/helpers";
import { explorer, contractAddress } from "@/utils/config";
import { ArrowTopRightOnSquareIcon, InformationCircleIcon } from "@heroicons/react/20/solid";
import { EyeIcon } from "lucide-react";

// NFT pics modal stuff
import Modal from "@mui/material/Modal"
import Box from '@mui/material/Box';
import SlickCarousel from "@/app/components/Carousels/SlickCarousel";

const style = {
    borderRadius: '10px',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: "100%",
    height: "100%",
    bgcolor: 'rgba(200, 200, 200, 0.5)',
    border: '2px solid #000',
    boxShadow: 24,
};


export default function Page({ params }: { params: { slug: string } }) {
    const nftService = new NftServices();
    const favoriteService = new FavoriteService();

    const [data, setData] = useState<null | NFTItemType>(null)
    const [likes, setLikes] = useState(0);
    const [liked, setLiked] = useState(false);
    const [views, setViews] = useState(0);
    const [list, setList] = useState([]);
    const [mainImage, setMainImage] = useState<string | null>(null)
    const [modal, setModal] = useState(false)

    const handleLike = async () => {
        try {
            setLiked(!liked)
            if (!liked === true) setLikes(likes + 1)
            else if (!liked === false) setLikes(likes - 1)
        } catch (error) {
            console.log(error)
        }
    }

    const getAllNftActivity = async (id: string) => {
        try {
            const {
                data: { data },
            } = await getAllNftActivitys({ nftId: id })
            setList(data)
        } catch (error) {
            console.log(error)
        }
    }

    const getArtitsLikes = async () => {
        try {
            const {
                data: { totalLikedNfts },
            } = await favoriteService.getNftTotalLikes({ nftId: data?._id })
            const {
                data: { favorite },
            } = await favoriteService.getUserReactionToNft({ nftId: data?._id })
            setLikes(totalLikedNfts)
            setLiked(favorite)
        } catch (error) {
            console.log(error)
        }
    }

    const handleView = async () => {
        try {
            const previosIpAddress = localStorage.getItem("ipAddress")
            const {
                data: { views, ipAddress },
            } = await nftService.addView({ nftId: params.slug, ip: previosIpAddress })
            localStorage.setItem("ipAddress", ipAddress)
            setViews(views)
        } catch (error) {
            console.log({ error })
        }
    }

    const userReaction = async () => {
        try {
            const response = await favoriteService.getUserReactionToNft({
                nftId: params.slug,
            })

            if (response.data) {
                setLiked(response.data.favorite)
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        const fetchNftData = async () => {
            try {
                const response = await nftService.getNftById(params.slug)

                if (list.length == 0) {
                    await getAllNftActivity(params.slug)
                    await getArtitsLikes()
                    await handleView()
                    await userReaction()
                }

                setData(response.data.nft)
            } catch (error) {
                console.log(error)
                setData(null)
            }
        }

        fetchNftData()
    }, [params.slug])
    return (
        <div className="flex flex-col gap-y-4 py-20 w-full px-10 lg:px-20">
            {
                data && (
                    <>
                        <Modal
                            open={modal}
                            onClose={() => setModal(false)}
                            aria-labelledby="modal-modal-title"
                            aria-describedby="modal-modal-description"
                        >
                            <Box sx={style}>
                                <div style={{
                                    position: "absolute",
                                    top: "20px",
                                    right: "20px",
                                    backgroundColor: "white",
                                    padding: "10px",
                                    cursor: "pointer",
                                    borderRadius: "100%",
                                    zIndex: 100
                                }}
                                    onClick={() => setModal(false)}
                                >
                                    <Image src="/icons/delete_icon.svg" alt="" width={50} height={50} className="w-6 h-6 fill-black" />
                                </div>
                                <SlickCarousel images={[data?.cloudinaryUrl, ...(data?.attachments ? data.attachments : [])]} />
                            </Box>
                        </Modal>

                        <div className="flex flex-col gap-y-3 items-center lg:flex-row lg:justify-between lg:items-start">
                            <div className="w-full relative lg:w-[55%]">
                                <Image
                                    onClick={() => setModal(true)}
                                    src={mainImage ? mainImage : data.cloudinaryUrl} height={100} width={100} quality={100} alt="hero" className="cursor-zoom-in rounded-xl object-cover aspect-square w-full" />

                                <div className="absolute top-4 right-4 flex w-[80px] pl-[15px] rounded-[30px] gap-x-3 p-3 items-center bg-gray-700/60 cursor-pointer">
                                    <span className="font-medium">{likes ? likes : (liked ? 1 : 0)}</span>
                                    <div
                                        onClick={() => handleLike()}
                                    >
                                        <input
                                            title="like"
                                            type="checkbox"
                                            className="sr-only"
                                            checked={liked}
                                        />
                                        <div className="checkmark">
                                            {
                                                liked ?
                                                    <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="#fff" strokeWidth="1.5"><path fillRule="evenodd" clipRule="evenodd" d="M11.9999 3.94228C13.1757 2.85872 14.7069 2.25 16.3053 2.25C18.0313 2.25 19.679 2.95977 20.8854 4.21074C22.0832 5.45181 22.75 7.1248 22.75 8.86222C22.75 10.5997 22.0831 12.2728 20.8854 13.5137C20.089 14.3393 19.2938 15.1836 18.4945 16.0323C16.871 17.7562 15.2301 19.4985 13.5256 21.14L13.5216 21.1438C12.6426 21.9779 11.2505 21.9476 10.409 21.0754L3.11399 13.5136C0.62867 10.9374 0.62867 6.78707 3.11399 4.21085C5.54605 1.68984 9.46239 1.60032 11.9999 3.94228Z" fill="#fff"></path></svg>
                                                    :
                                                    <svg width="24px" height="24px" strokeWidth="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="#fff"><path d="M22 8.86222C22 10.4087 21.4062 11.8941 20.3458 12.9929C17.9049 15.523 15.5374 18.1613 13.0053 20.5997C12.4249 21.1505 11.5042 21.1304 10.9488 20.5547L3.65376 12.9929C1.44875 10.7072 1.44875 7.01723 3.65376 4.73157C5.88044 2.42345 9.50794 2.42345 11.7346 4.73157L11.9998 5.00642L12.2648 4.73173C13.3324 3.6245 14.7864 3 16.3053 3C17.8242 3 19.2781 3.62444 20.3458 4.73157C21.4063 5.83045 22 7.31577 22 8.86222Z" stroke="#fff" strokeWidth="1.5" strokeLinejoin="round"></path></svg>
                                            }
                                        </div>
                                    </div>
                                </div>

                                <Image alt="rwa" src="/images/rwa-logo.svg" height={100} width={100} quality={100} className="w-20 h-16 absolute bottom-3 right-4" />
                            </div>

                            <div className="flex flex-col gap-y-3 justify-center text-white w-full lg:w-[43%]">
                                <div className="w-full flex flex-col gap-y-6">
                                    <p className="text-lg font-medium">{data.name}</p>
                                    <div className="flex justify-between">
                                        <div className="flex gap-2 items-center">
                                            {
                                                data?.owner?.avatar?.url ?
                                                    <img src={data?.owner?.avatar?.url} alt="avatar" className="w-8 h-8 rounded-full" />
                                                    : null
                                            }
                                            <div className="flex flex-col gap-y-1 text-sm">
                                                <p className="text-gray-400">Owned by:</p>
                                                <p className="font-medium">{data?.owner?.username}</p>
                                            </div>
                                        </div>

                                        <div className="flex gap-2 items-center">
                                            {
                                                data?.mintedBy?.avatar?.url ?
                                                    <img src={data?.mintedBy?.avatar?.url} alt="avatar" className="w-8 h-8 rounded-full" />
                                                    : null
                                            }
                                            <div className="flex flex-col gap-y-1 text-sm">
                                                <p className="text-gray-400">Created by:</p>
                                                <p className="font-medium">{data?.mintedBy?.username}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-x-3">
                                        <div className="flex gap-x-2 items-center border-2 border-gray-400 px-3 py-2 rounded-xl">
                                            <EyeIcon width={20} height={20} />
                                            {views ? views : 1} view
                                        </div>
                                        <div className="flex gap-x-2 items-center border-2 border-gray-400 px-3 py-2 rounded-xl">
                                            {data.category ? data.category.name : 'N/A'}
                                        </div>
                                    </div>
                                </div>
                                <div className="w-full flex flex-col gap-y-3 bg-dark p-6 rounded-lg">
                                    <p className="text-sm text-gray-400">Current Price</p>
                                    <div className="flex justify-between">
                                        <div className="flex flex-col gap-y-2">
                                            <p className="text-lg font-medium">${data.price}</p>

                                            <BaseDialog
                                                trigger={
                                                    <BaseButton title="Buy Now" variant="primary" onClick={() => { }} />
                                                }
                                                children={<BuyModal price={data.price} />}
                                                className="bg-dark max-h-[80%] overflow-y-auto overflow-x-hidden"
                                            />

                                            <BaseDialog
                                                trigger={
                                                    <BaseButton title="Bid" variant="primary" onClick={() => { }} />
                                                }
                                                children={<BidModal title={data.name} />}
                                                className="bg-black max-h-[80%] w-[26rem] overflow-y-auto overflow-x-hidden"
                                            />
                                        </div>
                                        <div>
                                            <BaseDialog
                                                trigger={
                                                    <span className="cursor-pointer px-3 py-2 rounded-xl border-2 border-white">Check Matic Quotes</span>
                                                }
                                                children={<Quotes nft={data} fee={10} contractInfo={{
                                                    address: '44932KJKLJ12'
                                                }} />}
                                                className="bg-black max-h-[80%] mx-auto overflow-y-auto overflow-x-hidden"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="w-full flex flex-col gap-y-3 bg-dark p-6 rounded-lg">
                                    <p className="text-lg font-medium">Overview</p>
                                    <hr />
                                    <div className="flex px-4 py-2 rounded-md justify-between items-center border-2 border-gray-500 bg-gradient-to-br from-[#ffffff0f] to-[#32282808]">
                                        <span className="font-medium">Artist</span>
                                        <span className="text-gray-400">{data.name}</span>
                                    </div>
                                    <div className="flex px-4 py-2 rounded-md justify-between items-center border-2 border-gray-500 bg-gradient-to-br from-[#ffffff0f] to-[#32282808]">
                                        <span className="font-medium">Shipping Country</span>
                                        <span className="text-gray-400">{data.saleId ? data.saleId.sellerShippingId.country : ''}</span>
                                    </div>
                                    <div className="flex px-4 py-2 rounded-md justify-between items-center border-2 border-gray-500 bg-gradient-to-br from-[#ffffff0f] to-[#32282808]">
                                        <span className="font-medium">Royalties</span>
                                        <span className="text-gray-400">{data.royalty}%</span>
                                    </div>
                                    <div className="flex px-4 py-2 flex-col rounded-md border-2 gap-y-2 border-gray-500 bg-gradient-to-br from-[#ffffff0f] to-[#32282808]">
                                        <p className="font-medium">Size</p>
                                        <div className="mt-2 flex flex-col gap-y-2">
                                            <p>Length: {data?.shippingInformation?.lengths}cm</p>
                                            <p>Height: {data?.shippingInformation?.height}cm</p>
                                            <p>Width: {data?.shippingInformation?.width}cm</p>
                                            <p>Weight: {data?.shippingInformation?.weight}cm</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="w-full flex gap-5 flex-wrap">
                            {
                                [data.cloudinaryUrl, ...data.attachments].map((item, index) => {
                                    return (
                                        <img onClick={() => {
                                            setMainImage(item)
                                        }} src={item} className="w-[16rem] opacity-60 hover:opacity-100 tra rounded aspect-square object-cover" />
                                    )
                                })
                            }
                        </div>

                        <div className="w-full flex flex-col gap-y-5 mt-5">
                            <div className="w-full rounded-md px-4 py-3 bg-dark flex flex-col gap-y-2">
                                <Label className="text-lg font-medium">Properties</Label>
                                <hr className="bg-white" />
                                <div className="flex gap-4 flex-wrap">
                                    {
                                        data.attributes.map((attr, index) => {
                                            return (
                                                <div className="w-[18rem] py-4 rounded-lg flex justify-center flex-col gap-y-2 border-2 border-gray-400">
                                                    <p className="text-lg font-medium text-center">{attr.type}</p>
                                                    <p className="font-medium text-center">{attr.value}</p>
                                                </div>
                                            )
                                        })
                                    }
                                    {
                                        data.attributes.length === 0 &&
                                        <p>No properties available</p>
                                    }
                                </div>
                            </div>
                        </div>

                        <div className="w-full flex flex-col gap-y-5 mt-5">
                            <div className="w-full rounded-md px-4 py-3 bg-dark flex flex-col gap-y-2">
                                <Label className="text-lg font-medium">Description</Label>
                                <hr className="bg-white" />
                                <p className="text-gray-500">{data.description}</p>
                            </div>
                        </div>

                        <div className="w-full flex flex-col gap-y-5 mt-5">
                            <div className="w-full rounded-md px-4 py-3 bg-dark flex flex-col gap-y-2">
                                <Label className="text-lg font-medium">Item activity</Label>
                                <hr className="bg-white" />
                                <Table>
                                    <TableCaption>A list of your item activity.</TableCaption>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-[100px]">Event</TableHead>
                                            <TableHead>Price</TableHead>
                                            <TableHead>From</TableHead>
                                            <TableHead>To</TableHead>
                                            <TableHead>Date</TableHead>
                                            <TableHead className="text-right">Time</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {list.length > 0 && list.map((item: any, index: number) => {
                                            const fromAddress = item?.from?.wallet
                                                ? item.from.wallet
                                                : item?.fromWallet
                                                    ? item?.fromWallet
                                                    : ""
                                            const toAddress = item?.to?.wallet
                                                ? item.to.wallet
                                                : item?.toWallet
                                                    ? item?.toWallet
                                                    : ""

                                            return (
                                                <TableRow key={index}>
                                                    <TableCell className="font-medium w-[14rem]">
                                                        <div className="flex gap-x-2 items-center">
                                                            {item.state}
                                                            <ArrowTopRightOnSquareIcon width={20} height={20} />
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>{item.price ? item.price : '-/-'}</TableCell>
                                                    <TableCell>
                                                        <div className="flex gap-x-2 items-center text-neon">
                                                            {item.from ? trimString(item.from.wallet) : "-/-"}
                                                            {
                                                                fromAddress && (
                                                                    <a target="_blank" href={`${explorer}/address/${fromAddress}`}>
                                                                        <ArrowTopRightOnSquareIcon width={20} height={20} />
                                                                    </a>
                                                                )
                                                            }
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex gap-x-2 items-center text-neon">
                                                            {item.to ? trimString(item.to.wallet) : "-/-"}
                                                            {
                                                                toAddress && (
                                                                    <a target="_blank" href={`${explorer}/address/${toAddress}`}>
                                                                        <ArrowTopRightOnSquareIcon width={20} height={20} />
                                                                    </a>
                                                                )
                                                            }
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>{moment(item.createdAt).format('DD MMM, YY')}</TableCell>
                                                    <TableCell className="text-right">{moment(item.createdAt).format('hh:mm A')}</TableCell>
                                                </TableRow>
                                            )
                                        })}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>

                        <div className="flex flex-col gap-y-2 bg-dark rounded-md py-4">
                            <div className="w-full flex flex-col gap-y-5">
                                <div className="w-full px-6 py-2 flex gap-x-2 items-center">
                                    <InformationCircleIcon width={20} height={20} />
                                    <Label className="font-medium">Details</Label>
                                </div>
                            </div>
                            <div className="w-full flex flex-col gap-y-5">
                                <div className="w-full px-6 py-2 flex gap-x-2 items-center">
                                    <img src="/icons/ether.svg" alt="matic" className="w-[1.2rem] h-8 fill-white" />
                                    <Label className="font-medium">Erc721</Label>
                                </div>
                            </div>
                            <div className="w-full flex flex-col gap-y-5">
                                <div className="w-full px-6 py-2 flex gap-x-2 items-center text-neon">
                                    <img src="/icons/ether.svg" alt="matic" className="w-[1.2rem] h-8 fill-neon" />
                                    <Label className="font-medium">View on Polygon Scan</Label>
                                    <a href={
                                        `${explorer}/token/${contractAddress}` +
                                        (data?.minted ? "?a=" : "")
                                    }>
                                        <ArrowTopRightOnSquareIcon width={20} height={20} className="fill-neon" />
                                    </a>
                                </div>
                            </div>
                            <div className="w-full flex flex-col gap-y-5">
                                <div className="w-full px-6 py-2 flex gap-x-2 items-center text-neon">
                                    <EyeIcon width={20} height={20} />
                                    <Label className="font-medium">Open Original On IPFS</Label>
                                    <a target="_blank" href={data.uri}>
                                        <ArrowTopRightOnSquareIcon width={20} height={20} className="fill-neon" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </>
                )
            }
        </div>
    )
}