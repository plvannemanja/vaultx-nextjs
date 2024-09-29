'use client';

import Image from 'next/image';
import { useNFTDetail } from '../../Context/NFTDetailContext';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import SlickCarousel from '@/app/components/Carousels/SlickCarousel';
import { EyeIcon } from 'lucide-react';
import NftServices from '@/services/nftService';
import BaseButton from '@/app/components/ui/BaseButton';
import { BaseDialog } from '@/app/components/ui/BaseDialog';
import BuyModal from '@/app/components/Modules/nft/BuyModal';
import BidModal from '@/app/components/Modules/nft/BidModal';
import Quotes from '@/app/components/Modules/nft/Quotes';
import AcceptBidModal from '@/app/components/Modules/nft/AcceptBidModal';
import EscrowModal from '@/app/components/Modules/nft/EscrowModal';
import EscrowRequestModal from '@/app/components/Modules/nft/EscrowRequestModal';
import CancelOrderModal from '@/app/components/Modules/nft/CancelOrderModal';
import PutSaleModal from '@/app/components/Modules/nft/PutSaleModal';
import BasicLoadingModal from './BasicLoadingModal';
import { unlistAsset } from '@/lib/helper';
import { useActiveAccount } from 'thirdweb/react';
import { CreateSellService } from '@/services/createSellService';
import ErrorModal from '../create/ErrorModal';
import { Menu, Transition } from '@headlessui/react'
import { Fragment, useEffect, useRef, useState } from 'react'
import {  MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import EditNFTModal from './EditNFTModal';
import { dividerClasses } from '@mui/material';

const style = {
  borderRadius: '10px',
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '100%',
  height: '100%',
  bgcolor: 'rgba(200, 200, 200, 0.5)',
  border: '2px solid #000',
  boxShadow: 24,
};

interface IModalStatus {
  quote: boolean;
  remove: boolean;
  resell: boolean;
  buy: boolean;
  release: boolean;
  cancel: boolean;
  escrowRelease: boolean;
  errorModal: boolean;
  nftedit: boolean
}

export default function NFTMain({
  fetchNftData,
}: {
  fetchNftData: () => void;
}) {
  const {
    nftId,
    mainImage,
    NFTDetail: data,
    likes,
    setLikes,
    liked,
    setLiked,
    type,
  } = useNFTDetail();
  const [modal, setModal] = useState(false);
  const [views, setViews] = useState(0);
  const [modalStatus, setModalStatus] = useState<IModalStatus>({
    quote: false,
    remove: false,
    resell: false,
    buy: false,
    release: false,
    cancel: false,
    escrowRelease: false,
    errorModal: false,
    nftedit: false
  });
  const activeAccount = useActiveAccount();
  const [step, setStep] = useState(1); // Step state in the parent
  const [error, setError] = useState(null);

  const nftService = new NftServices();
  const createSellService = new CreateSellService();
  const handleLike = async () => {
    try {
      setLiked(!liked);
      if (!liked === true) setLikes(likes + 1);
      else if (!liked === false) setLikes(likes - 1);
    } catch (error) {
      console.log(error);
    }
  };

  const handleView = async () => {
    try {
      const previosIpAddress = localStorage.getItem('ipAddress');
      const {
        data: { views, ipAddress },
      } = await nftService.addView({
        nftId,
        ip: previosIpAddress,
      });
      localStorage.setItem('ipAddress', ipAddress);
      setViews(views);
    } catch (error) {
      console.log({ error });
    }
  };

  const handleRemove = async () => {
    try {
      setModalStatus({ ...modalStatus, remove: true });
      let transactionHash;
      if (data?.minted)
        transactionHash = await unlistAsset(data.tokenId, activeAccount);

      await createSellService.endSale({
        nftId: data._id,
        endSaleHash: transactionHash,
      });
      await fetchNftData();
      setModalStatus({ ...modalStatus, remove: false });
    } catch (error) {
      setModalStatus({ ...modalStatus, errorModal: true });
      setError(JSON.stringify(error));
      console.log(error);
    }
  };

  useEffect(() => {
    handleView();
  }, [nftId]);

  useEffect(() => {
    if (error) {
      setModalStatus({ ...modalStatus, errorModal: true });
    }
  }, [error]);

  return (
    <>
      {error && (
        <>
          <BaseDialog
            className="bg-[#161616] max-h-[80%] overflow-y-auto overflow-x-hidden"
            isOpen={modalStatus.errorModal}
            onClose={(val) => {
              setModalStatus({ ...modalStatus, errorModal: val });
            }}
          >
            <ErrorModal
              title="Error"
              data={error}
              close={() => {
                setModalStatus({ ...modalStatus, errorModal: false });
              }}
            />
          </BaseDialog>
        </>
      )}

      <>
        <Modal
          open={modal}
          onClose={() => setModal(false)}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <div
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                backgroundColor: 'white',
                padding: '10px',
                cursor: 'pointer',
                borderRadius: '100%',
                zIndex: 100,
              }}
              onClick={() => setModal(false)}
            >
              <Image
                src="/icons/delete_icon.svg"
                alt=""
                width={50}
                height={50}
                className="w-6 h-6 fill-black"
              />
            </div>
            <SlickCarousel
              images={[
                data?.cloudinaryUrl,
                ...(data?.attachments ? data.attachments : []),
              ]}
            />
          </Box>
        </Modal>
        <div className="grid grid-cols-12 flex-col gap-y-3 gap-[30px] items-center lg:flex-row lg:justify-between lg:items-start ">
          <div className=" col-span-6 w-full relative "> 
            <Image
              onClick={() => setModal(true)}
              src={mainImage ? mainImage : data.cloudinaryUrl}
              height={100}
              width={100}
              quality={100}
              alt="hero"
              className="cursor-zoom-in rounded-xl object-cover aspect-square w-full max-h-[620px] lg:min-h-[683px]"
            />

            <div className="absolute top-4 right-4 flex w-[80px] h-[38px] pl-[15px] rounded-[30px] gap-x-3 p-3 items-center bg-[#00000033] cursor-pointer">
              <span className="font-bold tex-[14px] text-[#fff]">
                {likes ? likes : liked ? 1 : 0}
              </span>

              <div>
                <input
                  title="like"
                  type="checkbox"
                  className="sr-only"
                  checked={liked}
                  onChange={() => handleLike()}
                />
                <div className="checkmark">
                  {liked ? (
                    <svg
                      width="24px"
                      height="24px"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      color="#fff"
                      strokeWidth="1.5"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M11.9999 3.94228C13.1757 2.85872 14.7069 2.25 16.3053 2.25C18.0313 2.25 19.679 2.95977 20.8854 4.21074C22.0832 5.45181 22.75 7.1248 22.75 8.86222C22.75 10.5997 22.0831 12.2728 20.8854 13.5137C20.089 14.3393 19.2938 15.1836 18.4945 16.0323C16.871 17.7562 15.2301 19.4985 13.5256 21.14L13.5216 21.1438C12.6426 21.9779 11.2505 21.9476 10.409 21.0754L3.11399 13.5136C0.62867 10.9374 0.62867 6.78707 3.11399 4.21085C5.54605 1.68984 9.46239 1.60032 11.9999 3.94228Z"
                        fill="#fff"
                      ></path>
                    </svg>
                  ) : (
                    <svg
                      width="24px"
                      height="24px"
                      strokeWidth="1.5"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      color="#fff"
                    >
                      <path
                        d="M22 8.86222C22 10.4087 21.4062 11.8941 20.3458 12.9929C17.9049 15.523 15.5374 18.1613 13.0053 20.5997C12.4249 21.1505 11.5042 21.1304 10.9488 20.5547L3.65376 12.9929C1.44875 10.7072 1.44875 7.01723 3.65376 4.73157C5.88044 2.42345 9.50794 2.42345 11.7346 4.73157L11.9998 5.00642L12.2648 4.73173C13.3324 3.6245 14.7864 3 16.3053 3C17.8242 3 19.2781 3.62444 20.3458 4.73157C21.4063 5.83045 22 7.31577 22 8.86222Z"
                        stroke="#fff"
                        strokeWidth="1.5"
                        strokeLinejoin="round"
                      ></path>
                    </svg>
                  )}
                </div>
              </div>
            </div>


            <div className="absolute top-4 right-[110px] flex w-[38px] h-[38px] justify-center rounded-[30px] gap-x-3 items-center bg-[#00000033] cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M9.98255 20C15.515 20 20 15.5228 20 10C20 4.47714 15.515 0 9.98255 0C4.73366 0 0.427651 4.02992 0 9.15941H13.2408V10.8406H7.19141e-08C0.427651 15.9701 4.73366 20 9.98255 20Z" fill="white"/>
            </svg>
            </div>


            <Image
              alt="rwa"
              src="/images/rwa-logo.svg"
              height={100}
              width={100}
              quality={100}
              className="w-20 h-16 absolute bottom-3 right-4"
            />
          </div>

          <div className=" col-span-6 flex flex-col gap-y-[20px] justify-center text-white w-full ">
            <div className="w-full flex flex-col gap-y-[20px] ">
              <div className="ms-auto gap-[8px] flex items-center">           
                <div className="flex  items-center cursor-pointer">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M16.4992 14.9991C15.9989 14.9989 15.5037 15.0992 15.0428 15.2939C14.5819 15.4885 14.1648 15.7737 13.8161 16.1325L9.49425 13.3547C9.83421 12.4829 9.83421 11.5153 9.49425 10.6435L13.8161 7.86566C14.4653 8.53065 15.3383 8.9309 16.2658 8.98881C17.1933 9.04672 18.1093 8.75818 18.8361 8.17911C19.563 7.60004 20.0489 6.77171 20.1998 5.85471C20.3506 4.93771 20.1555 3.99737 19.6525 3.21601C19.1494 2.43464 18.3741 1.86792 17.4768 1.6257C16.5796 1.38349 15.6245 1.48306 14.7965 1.90509C13.9685 2.32712 13.3268 3.04155 12.9956 3.90987C12.6645 4.77819 12.6676 5.73854 13.0042 6.60472L8.68237 9.38253C8.16194 8.84823 7.49399 8.48126 6.76391 8.32854C6.03383 8.17582 5.2748 8.24429 4.58384 8.52519C3.89287 8.80609 3.30137 9.28666 2.88495 9.90547C2.46852 10.5243 2.24609 11.2532 2.24609 11.9991C2.24609 12.745 2.46852 13.4739 2.88495 14.0927C3.30137 14.7115 3.89287 15.1921 4.58384 15.473C5.2748 15.7539 6.03383 15.8224 6.76391 15.6696C7.49399 15.5169 8.16194 15.15 8.68237 14.6157L13.0042 17.3935C12.7147 18.1402 12.6719 18.96 12.882 19.7329C13.0921 20.5058 13.5441 21.191 14.1719 21.6884C14.7997 22.1858 15.5702 22.4691 16.3706 22.4968C17.171 22.5246 17.9593 22.2954 18.6201 21.8427C19.2808 21.3901 19.7792 20.7378 20.0424 19.9813C20.3056 19.2249 20.3197 18.4041 20.0826 17.6391C19.8455 16.8741 19.3697 16.205 18.7249 15.73C18.0801 15.2549 17.3002 14.9988 16.4992 14.9991ZM16.4992 2.9991C16.9443 2.9991 17.3793 3.13106 17.7493 3.37829C18.1193 3.62552 18.4077 3.97693 18.578 4.38806C18.7483 4.79919 18.7928 5.25159 18.706 5.68805C18.6192 6.12451 18.4049 6.52542 18.0902 6.84009C17.7756 7.15476 17.3747 7.36905 16.9382 7.45586C16.5017 7.54268 16.0493 7.49812 15.6382 7.32783C15.2271 7.15753 14.8757 6.86914 14.6284 6.49913C14.3812 6.12912 14.2492 5.6941 14.2492 5.2491C14.2492 4.65236 14.4863 4.08006 14.9083 3.65811C15.3302 3.23615 15.9025 2.9991 16.4992 2.9991ZM5.99925 14.2491C5.55424 14.2491 5.11923 14.1171 4.74922 13.8699C4.37921 13.6227 4.09082 13.2713 3.92052 12.8601C3.75022 12.449 3.70567 11.9966 3.79248 11.5601C3.8793 11.1237 4.09359 10.7228 4.40826 10.4081C4.72293 10.0934 5.12384 9.87915 5.5603 9.79233C5.99675 9.70551 6.44915 9.75007 6.86029 9.92037C7.27142 10.0907 7.62282 10.3791 7.87006 10.7491C8.11729 11.1191 8.24925 11.5541 8.24925 11.9991C8.24925 12.5958 8.0122 13.1681 7.59024 13.5901C7.16828 14.012 6.59599 14.2491 5.99925 14.2491ZM16.4992 20.9991C16.0542 20.9991 15.6192 20.8671 15.2492 20.6199C14.8792 20.3727 14.5908 20.0213 14.4205 19.6101C14.2502 19.199 14.2057 18.7466 14.2925 18.3101C14.3793 17.8737 14.5936 17.4728 14.9083 17.1581C15.2229 16.8434 15.6238 16.6291 16.0603 16.5423C16.4968 16.4555 16.9492 16.5001 17.3603 16.6704C17.7714 16.8407 18.1228 17.1291 18.3701 17.4991C18.6173 17.8691 18.7492 18.3041 18.7492 18.7491C18.7492 19.3458 18.5122 19.9181 18.0902 20.3401C17.6683 20.762 17.096 20.9991 16.4992 20.9991Z"
                        fill="#919191"
                      />
                    </svg>
                </div>
                <div className="flex  items-center cursor-pointer">
                <BaseDialog
                        trigger={
                           <BaseButton
                            title="Buy Now"
                            className={'!rounded-[14px] w-full'}
                            variant="primary"
                            onClick={() => {}}
                          />
                        //   <div>
                        // Edit RWA
                        // </div>
                        }
                        className="bg-[#161616] max-h-[80%] overflow-y-auto overflow-x-hidden"
                        isOpen={true}
                        onClose={(val) => {
                          setModalStatus({ ...modalStatus, nftedit: val });
                        }}
                      >
                        <EditNFTModal
                          onClose={() => {
                            setModalStatus({ ...modalStatus, nftedit: false });
                          }}
                          fetchNftData={fetchNftData}
                        />
                      </BaseDialog>
                  <Menu>
                      <MenuButton> 
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M12 9C11.4067 9 10.8266 9.17595 10.3333 9.50559C9.83994 9.83524 9.45543 10.3038 9.22836 10.8519C9.0013 11.4001 8.94189 12.0033 9.05765 12.5853C9.1734 13.1672 9.45912 13.7018 9.87868 14.1213C10.2982 14.5409 10.8328 14.8266 11.4147 14.9424C11.9967 15.0581 12.5999 14.9987 13.1481 14.7716C13.6962 14.5446 14.1648 14.1601 14.4944 13.6667C14.8241 13.1734 15 12.5933 15 12C15 11.2044 14.6839 10.4413 14.1213 9.87868C13.5587 9.31607 12.7957 9 12 9ZM12 13.5C11.7033 13.5 11.4133 13.412 11.1666 13.2472C10.92 13.0824 10.7277 12.8481 10.6142 12.574C10.5007 12.2999 10.4709 11.9983 10.5288 11.7074C10.5867 11.4164 10.7296 11.1491 10.9393 10.9393C11.1491 10.7296 11.4164 10.5867 11.7074 10.5288C11.9983 10.4709 12.2999 10.5006 12.574 10.6142C12.8481 10.7277 13.0824 10.92 13.2472 11.1666C13.412 11.4133 13.5 11.7033 13.5 12C13.5 12.3978 13.342 12.7794 13.0607 13.0607C12.7794 13.342 12.3978 13.5 12 13.5ZM4.5 9C3.90666 9 3.32664 9.17595 2.83329 9.50559C2.33994 9.83524 1.95543 10.3038 1.72836 10.8519C1.5013 11.4001 1.44189 12.0033 1.55765 12.5853C1.6734 13.1672 1.95912 13.7018 2.37868 14.1213C2.79824 14.5409 3.33279 14.8266 3.91473 14.9424C4.49667 15.0581 5.09987 14.9987 5.64805 14.7716C6.19623 14.5446 6.66477 14.1601 6.99441 13.6667C7.32405 13.1734 7.5 12.5933 7.5 12C7.5 11.2044 7.18393 10.4413 6.62132 9.87868C6.05871 9.31607 5.29565 9 4.5 9ZM4.5 13.5C4.20333 13.5 3.91332 13.412 3.66665 13.2472C3.41997 13.0824 3.22771 12.8481 3.11418 12.574C3.00065 12.2999 2.97095 11.9983 3.02882 11.7074C3.0867 11.4164 3.22956 11.1491 3.43934 10.9393C3.64912 10.7296 3.91639 10.5867 4.20737 10.5288C4.49834 10.4709 4.79994 10.5006 5.07403 10.6142C5.34812 10.7277 5.58238 10.92 5.74721 11.1666C5.91203 11.4133 6 11.7033 6 12C6 12.3978 5.84197 12.7794 5.56066 13.0607C5.27936 13.342 4.89783 13.5 4.5 13.5ZM19.5 9C18.9067 9 18.3266 9.17595 17.8333 9.50559C17.3399 9.83524 16.9554 10.3038 16.7284 10.8519C16.5013 11.4001 16.4419 12.0033 16.5576 12.5853C16.6734 13.1672 16.9591 13.7018 17.3787 14.1213C17.7982 14.5409 18.3328 14.8266 18.9147 14.9424C19.4967 15.0581 20.0999 14.9987 20.6481 14.7716C21.1962 14.5446 21.6648 14.1601 21.9944 13.6667C22.3241 13.1734 22.5 12.5933 22.5 12C22.5 11.2044 22.1839 10.4413 21.6213 9.87868C21.0587 9.31607 20.2957 9 19.5 9ZM19.5 13.5C19.2033 13.5 18.9133 13.412 18.6666 13.2472C18.42 13.0824 18.2277 12.8481 18.1142 12.574C18.0007 12.2999 17.9709 11.9983 18.0288 11.7074C18.0867 11.4164 18.2296 11.1491 18.4393 10.9393C18.6491 10.7296 18.9164 10.5867 19.2074 10.5288C19.4983 10.4709 19.7999 10.5006 20.074 10.6142C20.3481 10.7277 20.5824 10.92 20.7472 11.1666C20.912 11.4133 21 11.7033 21 12C21 12.3978 20.842 12.7794 20.5607 13.0607C20.2794 13.342 19.8978 13.5 19.5 13.5Z" fill="#919191"/>
                        </svg>
                        </MenuButton>
                      <MenuItems anchor="bottom" className={'border border-[#404244] py-[15px] px-[6px] gap-[6px] bg-[#141618] w-[214px] rounded-[8px]'}>
                        <MenuItem className={"py-[6px] px-[10px] text-[#fff] text-[14px]"}>
                        
                        <BaseDialog
                        trigger={
                           <BaseButton
                            title="Buy Now"
                            className={'!rounded-[14px] w-full'}
                            variant="primary"
                            onClick={() => {}}
                          />
                        //   <div>
                        // Edit RWA
                        // </div>
                        }
                        className="bg-[#161616] max-h-[80%] overflow-y-auto overflow-x-hidden"
                        isOpen={true}
                        onClose={(val) => {
                          // setModalStatus({ ...modalStatus, nftedit: val });
                        }}
                      >
                        <EditNFTModal
                          onClose={() => {
                            // setModalStatus({ ...modalStatus, nftedit: false });
                          }}
                          fetchNftData={fetchNftData}
                        />
                      </BaseDialog>
                      
                        
                           
                        </MenuItem>
                        <MenuItem className="py-[6px] px-[10px] text-[#fff] text-[14px]">
                        <div>
                        Transfer RWA
                        </div>
                       
                       
                          
                        </MenuItem>
                        <MenuItem className="py-[6px] px-[10px] text-[#fff] text-[14px]">
                       <div>
                       Burn RWA
                       </div>
                        
                    
                           
                        </MenuItem>
                      </MenuItems>
                    </Menu>
                </div>
               
              </div>
              <p className="text-[24px] font-extrabold leading-[24px]">
                {data.name}
              </p>
              <div className="flex justify-between mb-[10px]">
                <div className="flex gap-2 items-center">
                  {data?.owner?.avatar?.url ? (
                    <img
                      src={data?.owner?.avatar?.url}
                      alt="avatar"
                      className="w-8 h-8 rounded-full"
                    />
                  ) : null}
                  <div className="flex flex-col gap-y-1 text-sm">
                    <p className="text-[12px] text-gray-400 azeret-mono-font mb-[4px]">
                      Owned by:
                    </p>
                    <p className="text-[12px] azeret-mono-font text-[#fff]">
                      {data?.owner?.username}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2 items-center">
                  {data?.mintedBy?.avatar?.url ? (
                    <img
                      src={data?.mintedBy?.avatar?.url}
                      alt="avatar"
                      className="w-8 h-8 rounded-full"
                    />
                  ) : null}
                  <div className="flex flex-col gap-y-1 text-sm">
                    <p className="text-[12px] text-gray-400 azeret-mono-font mb-[4px]">
                      Created by:
                    </p>
                    <p className="text-[12px] azeret-mono-font text-[#fff]">
                      {data?.mintedBy?.username}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex gap-x-3">
                <div className="flex gap-x-2 items-center border border-[#FFFFFF1F] px-3 py-2 rounded-xl font-extrabold min-w-[109px]">
                  <EyeIcon width={20} height={20} />
                  {views ? views : 1} view
                </div>
                <div className="flex gap-x-2 items-center border border-[#FFFFFF1F] px-3 py-2 rounded-xl font-extrabold min-w-[109px]">
                <svg xmlns="http://www.w3.org/2000/svg" width="19" height="18" viewBox="0 0 19 18" fill="none">
                  <path d="M9.71278 11.325L9.08203 9.75L8.45128 11.325L6.83203 11.469L8.06203 12.5858L7.69153 14.25L9.08203 13.3657L10.4725 14.25L10.102 12.5858L11.332 11.469L9.71278 11.325ZM4.58203 1.5H13.582V3H4.58203V1.5ZM3.08203 4.5H15.082V6H3.08203V4.5Z" fill="white"/>
                  <path d="M15.082 9V15H3.08203V9H15.082ZM15.082 7.5H3.08203C2.68421 7.5 2.30268 7.65804 2.02137 7.93934C1.74007 8.22064 1.58203 8.60218 1.58203 9V15C1.58203 15.3978 1.74007 15.7794 2.02137 16.0607C2.30268 16.342 2.68421 16.5 3.08203 16.5H15.082C15.4799 16.5 15.8614 16.342 16.1427 16.0607C16.424 15.7794 16.582 15.3978 16.582 15V9C16.582 8.60218 16.424 8.22064 16.1427 7.93934C15.8614 7.65804 15.4799 7.5 15.082 7.5Z" fill="white"/>
                </svg>
                  {data.category ? data.category.name : 'N/A'}
                </div>
              </div>
            </div>
            <div className="w-full flex flex-col gap-y-3 bg-[#232323] p-[20px] rounded-[20px]">
              <div className="flex w-full justify-between items-center">
                <div className="flex flex-col">
                  <p className="text-sm text-gray-400 azeret-mono-font mb-[4px]">
                    {type === 'NotForSale' ? 'Not For Sale' : 'Current Price'}
                  </p>
                  <div className="flex justify-between items-center gap-y-2 w-full">
                    {type === 'NotForSale' ? null : (
                      <p className="text-[32px] font-extrabold">${data.price}</p>
                    )}
                  </div>
                </div>
               
                <div>
                    <BaseDialog
                      trigger={
                        <span
                          className="cursor-pointer px-3 py-2 rounded-xl border-2 border-[#ffffff12] min-w-[192px] inline-flex items-center"
                          onClick={() => {
                            setModalStatus({ ...modalStatus, quote: true });
                          }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="19" height="18" viewBox="0 0 19 18" fill="none" className='mx-2'>
                            <path d="M10.6875 7.875L16.625 2.25M16.625 2.25H12.6667M16.625 2.25V6M16.625 10.5V14.25C16.625 14.6478 16.4582 15.0294 16.1613 15.3107C15.8643 15.592 15.4616 15.75 15.0417 15.75H3.95833C3.53841 15.75 3.13568 15.592 2.83875 15.3107C2.54181 15.0294 2.375 14.6478 2.375 14.25V3.75C2.375 3.35218 2.54181 2.97064 2.83875 2.68934C3.13568 2.40804 3.53841 2.25 3.95833 2.25H7.91667" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                          </svg>
                          Check Eth Quotes
                        </span>
                      }
                      className="bg-black max-h-[80%] mx-auto overflow-y-auto overflow-x-hidden"
                      isOpen={modalStatus.quote}
                      onClose={(val) => {
                        setModalStatus({ ...modalStatus, quote: val });
                      }}
                    >
                      <Quotes
                        gasFee={0.0001}
                        onClose={() => {
                          setModalStatus({ ...modalStatus, quote: false });
                        }}
                      />
                    </BaseDialog>
                    <div className="flex flex-col justify-between mt-[10px] w-full">
                
                <div className="flex flex-col justify-between f items-center gap-y-2 w-full ">
                  {type === 'buy' ? (
                    <div className="flex flex-col  gap-y-2 gap-2 items-center w-full">
                      <BaseDialog
                        trigger={
                         
                          <BaseButton
                            title="Buy Now"
                            className={'!rounded-[14px] w-full'}
                            variant="primary"
                            onClick={() => { }}
                          />
                        }
                        className="bg-[#161616] max-h-[80%] overflow-y-auto overflow-x-hidden"
                        isOpen={modalStatus.buy}
                        onClose={(val) => {
                          setModalStatus({ ...modalStatus, buy: val });
                        }}
                      >
                        <BuyModal
                          onClose={() => {
                            setModalStatus({ ...modalStatus, buy: false });
                          }}
                          fetchNftData={fetchNftData}
                        />
                      </BaseDialog>

                      <BaseDialog
                        trigger={
                          <BaseButton
                            title="Place a Bid"
                            variant="secondaryOutline"
                            className={'!rounded-[14px] w-full'}
                            onClick={() => { }}
                          />
                        }
                        className="bg-black max-h-[80%] w-[28rem] overflow-y-auto overflow-x-hidden"
                      >
                        <BidModal title={data.name} update={() => { }} />
                      </BaseDialog>
                    </div>
                  ) : null}

                  {type === 'release' ? (
                    <div className="flex flex-col gap-y-2 items-center">
                      <BaseDialog
                        className="bg-black max-h-[80%] w-[38rem] mx-auto overflow-y-auto overflow-x-hidden"
                        trigger={
                          <BaseButton
                            title="Release Escrow"
                            variant="primary"
                            className={'rounded-[14px]'}
                            onClick={() => { }}
                          />
                        }
                        isOpen={modalStatus.release}
                        onClose={(val) => {
                          setModalStatus({ ...modalStatus, release: val });
                        }}
                      >
                        <EscrowModal
                          onClose={() => {
                            setModalStatus({ ...modalStatus, release: false });
                          }}
                          fetchNftData={fetchNftData}
                        />
                      </BaseDialog>
                      <BaseDialog
                        className="bg-black max-h-[80%] w-[38rem] mx-auto overflow-y-auto overflow-x-hidden"
                        trigger={
                          <BaseButton
                            title="Cancel Order"
                            variant="primary"
                            onClick={() => { }}
                          />
                        }
                        isOpen={modalStatus.cancel}
                        onClose={(val) => {
                          setModalStatus({ ...modalStatus, cancel: val });
                        }}
                      >
                        <CancelOrderModal
                          onClose={() => {
                            setModalStatus({ ...modalStatus, cancel: false });
                          }}
                          fetchNftData={fetchNftData}
                        />
                      </BaseDialog>
                    </div>
                  ) : null}

                  {type === 'resell' ? (
                    <div className="flex flex-col gap-x-2 items-center">
                      <BaseDialog
                        className={`bg-black max-h-[80%] mx-auto overflow-y-auto overflow-x-hidden 
                        ${step === 2 ? 'w-[50rem]' : 'w-[38rem]'} 
                        lg:max-w-[100%]`}
                        trigger={
                          <BaseButton
                            title="Put On Sale"
                            variant="primary"
                            className={'rounded-[14px]'}
                            onClick={() => { }}
                          />
                        }
                        isOpen={modalStatus.resell}
                        onClose={(val) => {
                          setModalStatus({ ...modalStatus, resell: val });
                        }}
                      >
                        <PutSaleModal
                          onClose={() => {
                            setModalStatus({ ...modalStatus, resell: false });
                          }}
                          fetchNftData={fetchNftData}
                          parentStep={step} // Pass step value here
                          parentSetStep={setStep}
                        />
                      </BaseDialog>
                    </div>
                  ) : null}

                  {type === 'remove' && (
                    <div className="flex flex-col gap-x-2 items-center">
                      <BaseDialog
                        className="bg-black max-h-[80%] w-[38rem] mx-auto overflow-y-auto overflow-x-hidden"
                        trigger={
                          <BaseButton
                            title="Remove From Sale"
                            variant="primary"
                            onClick={() => {
                              handleRemove();
                            }}
                            className={'!rounded-[14px]'}
                          />
                        }
                        isOpen={modalStatus.remove}
                        onClose={(val) => {
                          setModalStatus({ ...modalStatus, remove: val });
                        }}
                      >
                        <BasicLoadingModal message="Please wait while we put a request for cancellation." />
                      </BaseDialog>
                    </div>
                  )}

                  {type === 'CancelRequested' ? (
                    <div className="flex flex-col gap-x-2 items-center">
                      <BaseButton
                        title="Cancel Requested"
                        variant="primary"
                        onClick={() => { }}
                        className={'!rounded-[14px]'}
                      />
                    </div>
                  ) : null}

                  {
                    type === 'anyoneRelease' && (
                      <BaseDialog
                        className="bg-black max-h-[80%] w-[38rem] mx-auto overflow-y-auto overflow-x-hidden"
                        trigger={
                          <BaseButton
                            title="Release Escrow"
                            variant="primary"
                            className={'rounded-[14px]'}
                            onClick={() => { }}
                          />
                        }
                        isOpen={modalStatus.release}
                        onClose={(val) => {
                          setModalStatus({ ...modalStatus, release: val });
                        }}
                      >
                        <EscrowModal
                          onClose={() => {
                            setModalStatus({ ...modalStatus, release: false });
                          }}
                          fetchNftData={fetchNftData}
                        />
                      </BaseDialog>
                    )
                  }
                  {type === 'inEscrow' ? (
                    <div className="flex flex-col gap-x-2 items-center">
                      <BaseDialog
                        trigger={
                          <BaseButton
                            title="Escrow Release Request"
                            variant="primary"
                            className={'!rounded-[14px]'}
                            onClick={() => { }}
                          />
                        }
                        onClose={() => {
                          setModalStatus({
                            ...modalStatus,
                            escrowRelease: false,
                          });
                        }}
                        className="bg-[#161616] max-h-[80%] mx-auto overflow-y-auto overflow-x-hidden"
                      >
                        <EscrowRequestModal
                          onClose={() => {
                            setModalStatus({
                              ...modalStatus,
                              escrowRelease: false,
                            });
                          }}
                          fetchNftData={fetchNftData}
                        />
                      </BaseDialog>
                    </div>
                  ) : null}
                  {
                    type === 'dispute' && (
                      <div className="flex flex-col gap-x-2 items-center">
                        <BaseButton
                          title="Release Requested"
                          variant="primary"
                          onClick={() => { }}
                          className={'!rounded-[14px]'}
                        />
                      </div>
                    )
                  }
                </div>
              </div>
                  </div>
              </div>

             
            </div>
            <div className="w-full flex flex-col gap-y-3 bg-[#232323] p-6 rounded-[20px]">
              <p className="text-[14px] font-medium text-[#fff]">Overview</p>

              <div className="w-full h-[1px]  bg-[#ffffff08]"></div>
              <div className="grid grid-cols-12 w-full gap-5 justify-between relative">
                <div className="flex flex-col col-span-8 gap-y-[10px]">
                  <div className="flex px-4 py-4 rounded-md justify-between  items-center border border-[#ffffff14] bg-gradient-to-br from-[#ffffff0f] to-[#32282808]">
                    <span className="font-extrabold text-[14px]">
                      Artist</span>
                      <span className="text-[14px] text-[#ffffff60] azeret-mono-font">
                      {data.name}
                    </span>
                  </div>
                  <div className="flex px-4 py-4 rounded-md justify-between  items-center border border-[#ffffff14] bg-gradient-to-br from-[#ffffff0f] to-[#32282808]">
                  <span className="font-extrabold text-[14px]">
                  Shipping Country</span>
                    <span className="text-[14px] text-[#ffffff60] azeret-mono-font">
                      {data.saleId ? data.saleId.sellerShippingId.country : ''}
                    </span>
                  </div>
                  <div className="flex px-4 py-4 rounded-md justify-between  items-center border border-[#ffffff14] bg-gradient-to-br from-[#ffffff0f] to-[#32282808]">
                  <span className="font-extrabold text-[14px]">
                  Royalties</span>
                  <span className="text-[14px] text-[#ffffff60] azeret-mono-font">
                  {data.royalty}%
                    </span>
                  </div>
                 
                </div>
                <div className="flex flex-col col-span-4 gap-y-3">
                  <div className="flex flex-col px-4 py-4 rounded-md justify-between border border-[#ffffff52] bg-gradient-to-br from-[#ffffff0f] to-[#32282808]">
                    <p className="font-medium">Size</p>
                    <div className="mt-2 flex flex-col gap-y-3 ">
                      <p className="text-[#ffffff60] azeret-mono-font">
                        <span className="w-[58px] inline-block">Length</span>
                        <span className="text-center w-[20px] inline-block">
                          :
                        </span>
                        {data?.shippingInformation?.lengths}cm
                      </p>
                      <p className="text-[#ffffff60] azeret-mono-font">
                        <span className="w-[58px] inline-block">Height</span>
                        <span className="text-center w-[20px] inline-block ">
                          :
                        </span>{' '}
                        {data?.shippingInformation?.height}cm
                        </p>
                        <p className="text-[#ffffff60] azeret-mono-font">
                        {' '}
                        <span className="w-[58px] inline-block">Width</span>
                        <span className="text-center w-[20px] inline-block ">
                          :
                        </span>
                        {data?.shippingInformation?.width}cm
                      </p>
                      <p className="text-[#ffffff60] azeret-mono-font">
                        <span className="w-[58px] inline-block">Weight</span>{' '}
                        <span className="text-center w-[20px] inline-block ">
                          :
                        </span>
                        {data?.shippingInformation?.weight}cm
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    </>
  );
}
