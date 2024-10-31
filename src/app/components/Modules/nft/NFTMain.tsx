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
import { cn, formatNumberWithCommas } from '@/lib/utils';
import { CreateSellService } from '@/services/createSellService';
import { FavoriteService } from '@/services/FavoriteService';
import NftServices from '@/services/nftService';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { EyeIcon, Heart, Share2, SquareArrowOutUpRight } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useActiveAccount, useActiveWalletChain } from 'thirdweb/react';
import { useDebounce } from 'use-debounce';
import { useGlobalContext } from '../../Context/GlobalContext';
import { useNFTDetail } from '../../Context/NFTDetailContext';
import MenuOption from '../../Icons/nft/menu-option';
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
  const [buyStep, setBuyStep] = useState(1);
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
  const activeChain = useActiveWalletChain();
  const { user } = useGlobalContext();
  const [step, setStep] = useState(1); // Step state in the parent
  const [error, setError] = useState(null);

  const nftService = new NftServices();
  const createSellService = new CreateSellService();
  const favoriteService = new FavoriteService();
  const handleLike = async () => {
    try {
      setLiked(!liked);
      if (!liked === true) setLikes(likes + 1);
      else if (!liked === false) setLikes(likes - 1);
    } catch (error) {
      console.log(error);
    }
  };

  const [debouncedLiked] = useDebounce(liked, 1000);

  const setMyLike = async () => {
    try {
      await favoriteService.handleLikeNfts({ nftId });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (debouncedLiked) {
      setMyLike();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedLiked]);

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
                quality={100}
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
          <div className="w-full relative lg:col-span-6 col-span-12 max-h-[620px] lg:min-h-[683px] aspect-square">
            <Image
              quality={100}
              onClick={() => setModal(true)}
              src={mainImage ? mainImage : data.cloudinaryUrl}
              // height={683}
              // width={620}
              // quality={100}
              layout="fill"
              objectFit="cover"
              alt="hero"
              className="cursor-zoom-in rounded-[20px] object-cover "
            />
            <div
              onClick={() => handleLike()}
              className="absolute top-4 right-4 flex md:px-5 px-4 py-1 md:py-3 backdrop-blur-sm h-12 rounded-full gap-x-1 md:gap-x-3 items-center bg-black/20 cursor-pointer"
            >
              <span className="font-medium">{likes}</span>
              <div className="checkmark">
                <Heart
                  className={cn(
                    'w-4 md:w-5 h-4 md:h-5',
                    liked ? 'fill-white' : 'stroke-white',
                  )}
                />
              </div>
            </div>
            <Image
              quality={100}
              alt="rwa"
              src="/images/rwa-logo.svg"
              height={100}
              width={100}
              className="w-20 h-16 absolute bottom-3 right-4"
            />
          </div>
          <div className="text-white w-full lg:col-span-6 col-span-12 px-3">
            <div className="w-full flex flex-col gap-y-5">
              <div className="flex flex-col gap-y-[30px]">
                <div className="flex flex-col gap-y-[9px]">
                  <div className="flex justify-end">
                    <div className="flex gap-x-4">
                      <Share2 className="w-6 h-6 text-[#919191]" />
                      {user?.wallet == data.owner?.wallet && (
                        <div className="flex items-center cursor-pointer">
                          <Menu>
                            <MenuButton>
                              <MenuOption />
                            </MenuButton>
                            <MenuItems
                              anchor="bottom"
                              className={
                                'border border-[#40 px-34xl:244] py-3 xl:py-[15px] px-[6px] gap-[6px] bg-[#141618] w-[214px] rounded-[8px]'
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
                            modal={true}
                          >
                            <EditNFTModal
                              onClose={() => {
                                setModalStatus({
                                  ...modalStatus,
                                  nftEdit: false,
                                });
                              }}
                              fetchNftData={fetchNftData}
                            />
                          </BaseDialog>
                          <BaseDialog
                            isOpen={modalStatus.nftTransfer}
                            onClose={(val) => {
                              setModalStatus({
                                ...modalStatus,
                                nftTransfer: val,
                              });
                            }}
                            className="bg-[#161616] max-h-[80%] overflow-y-auto overflow-x-hidden"
                            modal={true}
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
                            modal={true}
                          >
                            <BurnModal
                              onClose={() => {
                                setModalStatus({
                                  ...modalStatus,
                                  nftBurn: false,
                                });
                              }}
                            />
                          </BaseDialog>
                        </div>
                      )}
                    </div>
                  </div>
                  <p
                    className="text-[32px] font-extrabold truncate"
                    title={data?.name}
                  >
                    {data.name}
                  </p>
                  <div className="flex justify-between">
                    <div className="flex gap-x-[10px] items-center">
                      <Image
                        quality={100}
                        width={32}
                        height={32}
                        src={data?.owner?.avatar?.url || '/default-logo.png'}
                        alt="avatar"
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="flex flex-col gap-y-1 text-sm">
                        <p className="text-[12px] text-white/30 azeret-mono-font">
                          Owned by:
                        </p>
                        <p className="text-[12px] azeret-mono-font text-[#fff]">
                          {data?.owner?.username}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-x-[10px] items-center">
                      <Image
                        quality={100}
                        width={32}
                        height={32}
                        src={data?.mintedBy?.avatar?.url || '/default-logo.png'}
                        alt="avatar"
                        className="w-10 h-10 rounded-full object-cover"
                      />

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
                </div>
                <div className="flex gap-x-3">
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
                  {(type === 'bid' || type === 'buy' || type === 'remove') && (
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
                        modal={true}
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
                    {(type === 'NotForSale' || type === 'resell') && (
                      <p className="text-[32px] font-extrabold">Not For Sale</p>
                    )}
                    {(type === 'remove' || type === 'buy') && (
                      <p className="text-[32px] font-extrabold">
                        $ {formatNumberWithCommas(data.price)}
                      </p>
                    )}
                    {(type === 'inEscrow' ||
                      type === 'anyoneRelease' ||
                      type === 'release' ||
                      type === 'cancelRequested') && (
                      <p className="text-[32px] font-extrabold">
                        {formatNumberWithCommas(data.lastPrice)}{' '}
                        {activeChain.nativeCurrency?.symbol}
                      </p>
                    )}
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
                          modal={true}
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
                          className={cn(
                            'bg-[#161616] max-h-[80%] overflow-y-auto overflow-x-hidden',
                            buyStep !== 5 && buyStep !== 1
                              ? 'max-w-[550px]'
                              : '',
                            // buyStep === 5 ? 'max-w-[750px]' : '',
                          )}
                          isOpen={modalStatus.buy}
                          onClose={(val) => {
                            setBuyStep(1);
                            setModalStatus({ ...modalStatus, buy: val });
                          }}
                          modal={true}
                        >
                          <BuyModal
                            onClose={() => {
                              setBuyStep(1);
                              setModalStatus({ ...modalStatus, buy: false });
                            }}
                            fetchNftData={fetchNftData}
                            step={buyStep}
                            setStep={setBuyStep}
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
                          modal={true}
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
                          modal={true}
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
                        ${step === 1 ? 'w-[80rem]' : 'w-[38rem]'} 
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
                            setStep(1);
                          }}
                          modal={true}
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
                          modal={true}
                        >
                          <BasicLoadingModal message="Please wait while we put a request for cancellation." />
                        </BaseDialog>
                      </div>
                    )}

                    {(type === 'NotForSale' || type === 'bid') && (
                      <div className="flex flex-col gap-x-2 items-center">
                        <BaseDialog
                          isOpen={modalStatus.bid}
                          onClose={(val) => {
                            setModalStatus({ ...modalStatus, bid: val });
                          }}
                          trigger={
                            <BaseButton
                              title="Place a Bid"
                              variant="secondaryOutline"
                              onClick={() => {
                                setModalStatus({ ...modalStatus, bid: true });
                              }}
                            />
                          }
                          className="bg-black max-h-[80%] w-full overflow-y-auto overflow-x-hidden"
                          modal={true}
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
                        modal={true}
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
                          modal={true}
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
              <div className="w-full flex flex-col gap-y-4 bg-[#232323] p-6 rounded-[20px] ">
                <p className="font-extrabold text-sm ">Overview</p>
                <hr className="border-white/[8%]" />
                <div className="grid grid-cols-12 gap-y-3 sm:gap-y-0 w-full gap-x-3 justify-between">
                  <div className="flex flex-col col-span-12 sm:col-span-7 gap-y-[10px]">
                    <div className="flex px-4 py-[15px] lg:px-3 xl:px-4 lg:py-3 xl:py-[15px] rounded-md justify-between  items-center border-[#404040] border-2 bg-gradient-to-bl from-[rgba(255,255,255,0.06)] to-[rgba(255,255,255,0.03)]">
                      <span className="font-extrabold text-white text-sm font-manrope">
                        Artist
                      </span>
                      <span className="text-white/60 font-AzeretMono text-sm justify-self-end">
                        {data.artist}
                      </span>
                    </div>
                    <div className="flex px-4 py-[15px] lg:px-3 xl:px-4 lg:py-3 xl:py-[15px] rounded-md justify-between  items-center border-[#404040] border-2 bg-gradient-to-bl from-[rgba(255,255,255,0.06)] to-[rgba(255,255,255,0.03)]">
                      <span className="font-extrabold text-white text-sm font-manrope">
                        Shipping Country
                      </span>
                      <span className="text-white/60 font-AzeretMono text-sm justify-self-end">
                        {data.saleId
                          ? data.saleId.sellerShippingId.country
                          : ''}
                      </span>
                    </div>
                    <div className="flex px-4 py-[15px] lg:px-3 xl:px-4 lg:py-3 xl:py-[15px] rounded-md justify-between  items-center border-[#404040] border-2 bg-gradient-to-bl from-[rgba(255,255,255,0.06)] to-[rgba(255,255,255,0.03)]">
                      <span className="font-extrabold text-white text-sm font-manrope">
                        Royalties
                      </span>
                      <span className="text-white/60 font-AzeretMono text-sm justify-self-end">
                        {data.royalty}%
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col col-span-12 xs:col-span-8 xss:col-span-8  sm:col-span-5 gap-y-3">
                    <div className="flex flex-col gap-y-[11px] px-4 py-2 rounded-md justify-between border-[#404040] border-2 bg-gradient-to-bl from-[rgba(255,255,255,0.06)] to-[rgba(255,255,255,0.03)]">
                      <p className="font-extrabold text-sm">Size</p>
                      <div className="mt-2 text-sm font-AzeretMono text-white/60">
                        <p className="flex mb-[11px]">
                          <span className="inline-block w-[60px]">Length</span>
                          <span className="text-center w-[30px] inline-block">
                            :
                          </span>
                          <span className="flex-1">
                            {data?.shippingInformation?.lengths}cm
                          </span>
                        </p>
                        <p className="flex mb-[11px]">
                          <span className="inline-block w-[60px]">Height</span>
                          <span className="text-center w-[30px] inline-block">
                            :
                          </span>
                          <span className="flex-1">
                            {data?.shippingInformation?.height}cm
                          </span>
                        </p>
                        <p className="flex mb-[11px]">
                          <span className="inline-block w-[60px]">Width</span>
                          <span className="text-center w-[30px] inline-block ">
                            :
                          </span>
                          <span className="flex-1">
                            {data?.shippingInformation?.width}cm
                          </span>
                        </p>
                        <p className="flex mb-[11px]">
                          <span className="inline-block w-[60px]">Weight</span>{' '}
                          <span className="text-center w-[30px] inline-block ">
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
