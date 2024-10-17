'use client';

import SlickCarousel from '@/app/components/Carousels/SlickCarousel';
import BidModal from '@/app/components/Modules/nft/BidModal';
import BuyModal from '@/app/components/Modules/nft/BuyModal';
import CancelOrderModal from '@/app/components/Modules/nft/CancelOrderModal';
import EscrowModal from '@/app/components/Modules/nft/EscrowModal';
import EscrowRequestModal from '@/app/components/Modules/nft/EscrowRequestModal';
import PutSaleModal from '@/app/components/Modules/nft/PutSaleModal';
import Quotes from '@/app/components/Modules/nft/Quotes';
import BaseButton from '@/app/components/ui/BaseButton';
import { BaseDialog } from '@/app/components/ui/BaseDialog';
import { unlistAsset } from '@/lib/helper';
import { formatNumberWithCommas } from '@/lib/utils';
import { CreateSellService } from '@/services/createSellService';
import NftServices from '@/services/nftService';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { EyeIcon, SquareArrowOutUpRight } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useActiveAccount } from 'thirdweb/react';
import { useGlobalContext } from '../../Context/GlobalContext';
import { useNFTDetail } from '../../Context/NFTDetailContext';
import ErrorModal from '../create/ErrorModal';
import BasicLoadingModal from './BasicLoadingModal';
import BurnModal from './BurnModal';
import EditNFTModal from './EditNFTModal';
import TransferModal from './TransferModal';

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
  nftEdit: boolean;
  nftTransfer: boolean;
  nftBurn: boolean;
  bid: boolean;
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
  console.log({ type });
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
    nftEdit: false,
    nftTransfer: false,
    nftBurn: false,
    bid: false,
  });
  const activeAccount = useActiveAccount();
  const { user } = useGlobalContext();
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nftId]);

  useEffect(() => {
    if (error) {
      setModalStatus({ ...modalStatus, errorModal: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        <div className="grid grid-cols-12 gap-4">
          <div className="w-full relative lg:col-span-6 col-span-12">
            <Image
              onClick={() => setModal(true)}
              src={mainImage ? mainImage : data.cloudinaryUrl}
              height={683}
              width={620}
              quality={100}
              alt="hero"
              className="cursor-zoom-in rounded-[20px] object-cover aspect-square w-full max-h-[620px] lg:min-h-[683px]"
            />
            <div className="absolute top-4 right-4 flex w-[80px] pl-[15px] rounded-[30px] gap-x-3 p-3 items-center bg-gray-700/60 cursor-pointer">
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
            <Image
              alt="rwa"
              src="/images/rwa-logo.svg"
              height={100}
              width={100}
              quality={100}
              className="w-20 h-16 absolute bottom-3 right-4"
            />
          </div>
          <div className="text-white w-full lg:col-span-6 col-span-12 px-3">
            <div className="flex justify-end">
              <div className="flex">
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
                {user?.wallet == data.owner?.wallet && (
                  <div className="flex items-center cursor-pointer">
                    <Menu>
                      <MenuButton>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            d="M12 9C11.4067 9 10.8266 9.17595 10.3333 9.50559C9.83994 9.83524 9.45543 10.3038 9.22836 10.8519C9.0013 11.4001 8.94189 12.0033 9.05765 12.5853C9.1734 13.1672 9.45912 13.7018 9.87868 14.1213C10.2982 14.5409 10.8328 14.8266 11.4147 14.9424C11.9967 15.0581 12.5999 14.9987 13.1481 14.7716C13.6962 14.5446 14.1648 14.1601 14.4944 13.6667C14.8241 13.1734 15 12.5933 15 12C15 11.2044 14.6839 10.4413 14.1213 9.87868C13.5587 9.31607 12.7957 9 12 9ZM12 13.5C11.7033 13.5 11.4133 13.412 11.1666 13.2472C10.92 13.0824 10.7277 12.8481 10.6142 12.574C10.5007 12.2999 10.4709 11.9983 10.5288 11.7074C10.5867 11.4164 10.7296 11.1491 10.9393 10.9393C11.1491 10.7296 11.4164 10.5867 11.7074 10.5288C11.9983 10.4709 12.2999 10.5006 12.574 10.6142C12.8481 10.7277 13.0824 10.92 13.2472 11.1666C13.412 11.4133 13.5 11.7033 13.5 12C13.5 12.3978 13.342 12.7794 13.0607 13.0607C12.7794 13.342 12.3978 13.5 12 13.5ZM4.5 9C3.90666 9 3.32664 9.17595 2.83329 9.50559C2.33994 9.83524 1.95543 10.3038 1.72836 10.8519C1.5013 11.4001 1.44189 12.0033 1.55765 12.5853C1.6734 13.1672 1.95912 13.7018 2.37868 14.1213C2.79824 14.5409 3.33279 14.8266 3.91473 14.9424C4.49667 15.0581 5.09987 14.9987 5.64805 14.7716C6.19623 14.5446 6.66477 14.1601 6.99441 13.6667C7.32405 13.1734 7.5 12.5933 7.5 12C7.5 11.2044 7.18393 10.4413 6.62132 9.87868C6.05871 9.31607 5.29565 9 4.5 9ZM4.5 13.5C4.20333 13.5 3.91332 13.412 3.66665 13.2472C3.41997 13.0824 3.22771 12.8481 3.11418 12.574C3.00065 12.2999 2.97095 11.9983 3.02882 11.7074C3.0867 11.4164 3.22956 11.1491 3.43934 10.9393C3.64912 10.7296 3.91639 10.5867 4.20737 10.5288C4.49834 10.4709 4.79994 10.5006 5.07403 10.6142C5.34812 10.7277 5.58238 10.92 5.74721 11.1666C5.91203 11.4133 6 11.7033 6 12C6 12.3978 5.84197 12.7794 5.56066 13.0607C5.27936 13.342 4.89783 13.5 4.5 13.5ZM19.5 9C18.9067 9 18.3266 9.17595 17.8333 9.50559C17.3399 9.83524 16.9554 10.3038 16.7284 10.8519C16.5013 11.4001 16.4419 12.0033 16.5576 12.5853C16.6734 13.1672 16.9591 13.7018 17.3787 14.1213C17.7982 14.5409 18.3328 14.8266 18.9147 14.9424C19.4967 15.0581 20.0999 14.9987 20.6481 14.7716C21.1962 14.5446 21.6648 14.1601 21.9944 13.6667C22.3241 13.1734 22.5 12.5933 22.5 12C22.5 11.2044 22.1839 10.4413 21.6213 9.87868C21.0587 9.31607 20.2957 9 19.5 9ZM19.5 13.5C19.2033 13.5 18.9133 13.412 18.6666 13.2472C18.42 13.0824 18.2277 12.8481 18.1142 12.574C18.0007 12.2999 17.9709 11.9983 18.0288 11.7074C18.0867 11.4164 18.2296 11.1491 18.4393 10.9393C18.6491 10.7296 18.9164 10.5867 19.2074 10.5288C19.4983 10.4709 19.7999 10.5006 20.074 10.6142C20.3481 10.7277 20.5824 10.92 20.7472 11.1666C20.912 11.4133 21 11.7033 21 12C21 12.3978 20.842 12.7794 20.5607 13.0607C20.2794 13.342 19.8978 13.5 19.5 13.5Z"
                            fill="#919191"
                          />
                        </svg>
                      </MenuButton>
                      <MenuItems
                        anchor="bottom"
                        className={
                          'border border-[#404244] py-[15px] px-[6px] gap-[6px] bg-[#141618] w-[214px] rounded-[8px]'
                        }
                      >
                        <MenuItem>
                          <div
                            className={
                              'py-[6px] px-[10px] text-[#fff] text-[14px] cursor-pointer'
                            }
                            onClick={() => {
                              setModalStatus({
                                ...modalStatus,
                                nftEdit: true,
                              });
                            }}
                          >
                            Edit RWA
                          </div>
                        </MenuItem>
                        <MenuItem>
                          <div
                            className={
                              'py-[6px] px-[10px] text-[#fff] text-[14px] cursor-pointer'
                            }
                            onClick={() => {
                              setModalStatus({
                                ...modalStatus,
                                nftTransfer: true,
                              });
                            }}
                          >
                            Transfer RWA
                          </div>
                        </MenuItem>
                        <MenuItem>
                          <div
                            className={
                              'py-[6px] px-[10px] text-[#fff] text-[14px] cursor-pointer'
                            }
                            onClick={() => {
                              setModalStatus({
                                ...modalStatus,
                                nftBurn: true,
                              });
                            }}
                          >
                            Burn RWA
                          </div>
                        </MenuItem>
                      </MenuItems>
                    </Menu>
                    <BaseDialog
                      className="bg-[#161616] max-h-[80%] overflow-y-auto overflow-x-hidden"
                      isOpen={modalStatus.nftEdit}
                      onClose={(val) => {
                        setModalStatus({ ...modalStatus, nftEdit: val });
                      }}
                    >
                      <EditNFTModal
                        onClose={() => {
                          setModalStatus({ ...modalStatus, nftEdit: false });
                        }}
                        fetchNftData={fetchNftData}
                      />
                    </BaseDialog>
                    <BaseDialog
                      isOpen={modalStatus.nftTransfer}
                      onClose={(val) => {
                        setModalStatus({ ...modalStatus, nftTransfer: val });
                      }}
                      className="bg-[#161616] max-h-[80%] overflow-y-auto overflow-x-hidden"
                    >
                      <TransferModal
                        onClose={() => {
                          setModalStatus({
                            ...modalStatus,
                            nftTransfer: false,
                          });
                        }}
                        fetchNftData={fetchNftData}
                      />
                    </BaseDialog>
                    <BaseDialog
                      isOpen={modalStatus.nftBurn}
                      onClose={(val) => {
                        setModalStatus({ ...modalStatus, nftBurn: val });
                      }}
                      className="bg-[#161616] max-h-[80%] overflow-y-auto overflow-x-hidden"
                    >
                      <BurnModal
                        onClose={() => {
                          setModalStatus({ ...modalStatus, nftBurn: false });
                        }}
                      />
                    </BaseDialog>
                  </div>
                )}
              </div>
            </div>
            <div className="w-full flex flex-col gap-y-5">
              <div className="flex flex-col gap-y-3">
                <p className="text-[32px] font-extrabold">{data.name}</p>
                <div className="flex justify-between">
                  <div className="flex gap-2 items-center">
                    {data?.owner?.avatar?.url ? (
                      <Image
                        width={32}
                        height={32}
                        src={data?.owner?.avatar?.url}
                        alt="avatar"
                        className="w-8 h-8 rounded-full"
                      />
                    ) : null}
                    <div className="flex flex-col gap-y-1 text-sm">
                      <p className="text-[12px] text-white/30 azeret-mono-font">
                        Owned by:
                      </p>
                      <p className="text-[12px] azeret-mono-font text-[#fff]">
                        {data?.owner?.username}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 items-center">
                    {data?.mintedBy?.avatar?.url ? (
                      <Image
                        width={32}
                        height={32}
                        src={data?.mintedBy?.avatar?.url}
                        alt="avatar"
                        className="w-8 h-8 rounded-full"
                      />
                    ) : null}
                    <div className="flex flex-col gap-y-1 text-sm">
                      <p className="text-[12px] text-white/30 azeret-mono-font">
                        Created by:
                      </p>
                      <p className="text-[12px] azeret-mono-font text-[#fff]">
                        {data?.mintedBy?.username}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-x-3 my-3">
                  <div className="flex gap-x-1 items-center border font-extrabold border-white border-opacity-[12%] text-white px-3 py-2 rounded-xl">
                    <EyeIcon className="w-5 h-5" />
                    <span className="text-white text-sm">
                      {views ? views : 1} View
                    </span>
                  </div>
                  <div className="flex gap-x-1 items-center border font-extrabold border-white border-opacity-[12%] text-white px-3 py-2 rounded-xl">
                    <svg
                      width="18"
                      height="19"
                      viewBox="0 0 18 19"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M9.63075 11.825L9 10.25L8.36925 11.825L6.75 11.969L7.98 13.0858L7.6095 14.75L9 13.8657L10.3905 14.75L10.02 13.0858L11.25 11.969L9.63075 11.825ZM4.5 2H13.5V3.5H4.5V2ZM3 5H15V6.5H3V5Z"
                        fill="white"
                      />
                      <path
                        d="M15 9.5V15.5H3V9.5H15ZM15 8H3C2.60218 8 2.22064 8.15804 1.93934 8.43934C1.65804 8.72064 1.5 9.10218 1.5 9.5V15.5C1.5 15.8978 1.65804 16.2794 1.93934 16.5607C2.22064 16.842 2.60218 17 3 17H15C15.3978 17 15.7794 16.842 16.0607 16.5607C16.342 16.2794 16.5 15.8978 16.5 15.5V9.5C16.5 9.10218 16.342 8.72064 16.0607 8.43934C15.7794 8.15804 15.3978 8 15 8Z"
                        fill="white"
                      />
                    </svg>
                    <span className="text-white text-sm">
                      {data.category ? data.category.name : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="w-full flex flex-col gap-y-1 bg-[#232323] p-6 rounded-[20px]">
                <div className="items-center grid grid-cols-12 justify-between">
                  <p className="text-xs text-white/60 col-span-8 azeret-mono-font">
                    {'Current Price'}
                  </p>
                  {type === 'resell' && (
                    <div className="col-span-4">
                      <BaseDialog
                        trigger={
                          <div
                            className="cursor-pointer flex items-center gap-x-2 h-8 px-3 font-bold py-2 rounded-lg border text-sm border-[#a3a3a3]"
                            onClick={() => {
                              setModalStatus({ ...modalStatus, quote: true });
                            }}
                          >
                            <SquareArrowOutUpRight className="w-4 h-4" />
                            <span>Check Eth Quotes</span>
                          </div>
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
                    </div>
                  )}
                </div>
                <div className="flex flex-col justify-between w-full">
                  <div className="flex justify-between items-center gap-y-2 w-full mt-2">
                    {type === 'NotForSale' ? (
                      <p className="text-[32px] font-extrabold">Not For Sale</p>
                    ) : (
                      <p className="text-[32px] font-extrabold">
                        ${formatNumberWithCommas(data.price)}
                      </p>
                    )}
                    <div>
                      <BaseDialog
                        trigger={
                          <div
                            className="cursor-pointer flex items-center gap-x-1 px-3 font-bold py-2 rounded-lg border text-sm border-[#a3a3a3]"
                            onClick={() => {
                              setModalStatus({ ...modalStatus, quote: true });
                            }}
                          >
                            <SquareArrowOutUpRight className="w-4 h-4" />
                            <span>Check Eth Quotes</span>
                          </div>
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
                    </div>
                  </div>
                  <div className="flex justify-between items-center gap-y-2 w-full mt-2">
                    {type === 'buy' ? (
                      <div className="flex gap-y-2 gap-2 items-center w-full">
                        <BaseDialog
                          isOpen={modalStatus.bid}
                          onClose={(val) => {
                            setModalStatus({ ...modalStatus, bid: val });
                          }}
                          trigger={
                            <BaseButton
                              title="Place a Bid"
                              variant="secondaryOutline"
                              className={
                                '!rounded-[14px] w-full bg-[#DDF24733] !border-0'
                              }
                              onClick={() => {
                                setModalStatus({ ...modalStatus, bid: true });
                              }}
                            />
                          }
                          className="bg-black max-h-[80%] w-full overflow-y-auto overflow-x-hidden"
                        >
                          <BidModal
                            title={data.name}
                            update={() => {}}
                            onClose={() => {
                              setModalStatus({ ...modalStatus, bid: false });
                            }}
                            fetchNftData={fetchNftData}
                          />
                        </BaseDialog>
                        <BaseDialog
                          trigger={
                            <BaseButton
                              title="Buy Now"
                              className={'!rounded-[14px] w-full'}
                              variant="primary"
                              onClick={() => {}}
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
                      </div>
                    ) : null}
                    {type === 'release' ? (
                      <div className="flex  gap-y-2 gap-2 items-center w-full">
                        <BaseDialog
                          className="bg-black max-h-[80%] w-[38rem] mx-auto overflow-y-auto overflow-x-hidden"
                          trigger={
                            <BaseButton
                              title="Release Escrow"
                              variant="primary"
                              className={'!rounded-[14px] w-full'}
                              onClick={() => {}}
                            />
                          }
                          isOpen={modalStatus.release}
                          onClose={(val) => {
                            setModalStatus({ ...modalStatus, release: val });
                          }}
                        >
                          <EscrowModal
                            onClose={() => {
                              setModalStatus({
                                ...modalStatus,
                                release: false,
                              });
                            }}
                            fetchNftData={fetchNftData}
                          />
                        </BaseDialog>
                        <BaseDialog
                          className="bg-black max-h-[80%] mx-auto overflow-y-auto overflow-x-hidden"
                          trigger={
                            <BaseButton
                              title="Cancel Order"
                              variant="secondaryOutline"
                              className={'!rounded-[14px] w-full'}
                              onClick={() => {}}
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
                              onClick={() => {}}
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
                          onClick={() => {}}
                          className={'!rounded-[14px]'}
                        />
                      </div>
                    ) : null}

                    {type === 'anyoneRelease' && (
                      <BaseDialog
                        className="bg-black max-h-[80%] w-[38rem] mx-auto overflow-y-auto overflow-x-hidden"
                        trigger={
                          <BaseButton
                            title="Release Escrow"
                            variant="primary"
                            className={'rounded-[14px]'}
                            onClick={() => {}}
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
                    )}
                    {type === 'inEscrow' ? (
                      <div className="flex flex-col gap-x-2 items-center">
                        <BaseDialog
                          trigger={
                            <BaseButton
                              title="Escrow Release Request"
                              variant="primary"
                              className={'!rounded-[14px]'}
                              onClick={() => {}}
                            />
                          }
                          isOpen={modalStatus.escrowRelease}
                          onClose={(val) => {
                            setModalStatus({
                              ...modalStatus,
                              escrowRelease: val,
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
                    {type === 'dispute' && (
                      <div className="flex flex-col gap-x-2 items-center">
                        <BaseButton
                          title="Release Requested"
                          variant="primary"
                          onClick={() => {}}
                          className={'!rounded-[14px]'}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="w-full flex flex-col gap-y-3 bg-[#232323] p-6 rounded-[20px] ">
                <p className="font-extrabold text-sm ">Overview</p>
                <hr className="border-white border-opacity-[8%]" />
                <div className="grid grid-cols-12 w-full gap-5 justify-between ">
                  <div className="flex flex-col col-span-7 gap-y-[16px]">
                    <div className="flex px-4 py-4 rounded-md justify-between  items-center border-[#404040] border-2 bg-gradient-to-bl from-[rgba(255,255,255,0.06)] to-[rgba(255,255,255,0.03)]">
                      <span className="font-extrabold text-white text-sm font-manrope">
                        Artist
                      </span>
                      <span className="text-white/60 font-AzeretMono text-sm">
                        {data.artist}
                      </span>
                    </div>
                    <div className="flex px-4 py-4 rounded-md justify-between  items-center border-[#404040] border-2 bg-gradient-to-bl from-[rgba(255,255,255,0.06)] to-[rgba(255,255,255,0.03)]">
                      <span className="font-extrabold text-white text-sm font-manrope">
                        Shipping Country
                      </span>
                      <span className="text-white/60 font-AzeretMono text-sm">
                        {data.saleId
                          ? data.saleId.sellerShippingId.country
                          : ''}
                      </span>
                    </div>
                    <div className="flex px-4 py-4 rounded-md justify-between  items-center border-[#404040] border-2 bg-gradient-to-bl from-[rgba(255,255,255,0.06)] to-[rgba(255,255,255,0.03)]">
                      <span className="font-extrabold text-white text-sm font-manrope">
                        Royalties
                      </span>
                      <span className="text-white/60 font-AzeretMono text-sm">
                        {data.royalty}%
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col col-span-5 gap-y-3">
                    <div className="flex flex-col gap-y-2 px-4 py-4 rounded-md justify-between border-[#404040] border-2 bg-gradient-to-bl from-[rgba(255,255,255,0.06)] to-[rgba(255,255,255,0.03)]">
                      <p className="font-extrabold text-sm mb-[6px]">Size</p>
                      <div className="mt-2 text-sm font-AzeretMono text-white/60">
                        <p className="flex mb-[11px]">
                          <span className="inline-block flex-1">Length</span>
                          <span className="text-center w-[20px] inline-block">
                            :
                          </span>
                          <span className="flex-1">
                            {data?.shippingInformation?.lengths}cm
                          </span>
                        </p>
                        <p className="flex mb-[11px]">
                          <span className="inline-block flex-1">Height</span>
                          <span className="text-center w-[20px] inline-block">
                            :
                          </span>
                          <span className="flex-1">
                            {data?.shippingInformation?.height}cm
                          </span>
                        </p>
                        <p className="flex mb-[11px]">
                          <span className="inline-block flex-1">Width</span>
                          <span className="text-center w-[20px] inline-block ">
                            :
                          </span>
                          <span className="flex-1">
                            {data?.shippingInformation?.width}cm
                          </span>
                        </p>
                        <p className="flex mb-[11px]">
                          <span className="inline-block flex-1">Weight</span>{' '}
                          <span className="text-center w-[20px] inline-block ">
                            :
                          </span>
                          <span className="flex-1">
                            {data?.shippingInformation?.weight}cm
                          </span>
                        </p>
                      </div>
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
