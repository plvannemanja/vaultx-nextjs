'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import {
  deleteSellerInfo,
  getSellerInfo,
  upsertSellerInfo,
} from '@/services/supplier';
import { City, Country, State } from 'country-state-city';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import PhoneInput from 'react-phone-input-2';
import { useCreateNFT } from '../Context/CreateNFTContext';
import BaseButton from '../ui/BaseButton';
import { BaseDialog } from '../ui/BaseDialog';

export default function ShippingInfo({ isSetting }: any) {
  const nftContext = useCreateNFT();
  const { toast } = useToast();
  const [data, setData] = useState<null | any[]>(null);
  const [sellerInfo, setSellerInfo] = useState({
    id: null,
    type: '',
    name: '',
    email: '',
    shippingAddr: '',
    country: '',
    line1: '',
    line2: '',
    state: '',
    city: '',
    postalCode: '',
    phoneNumber: '',
  });
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [countryCode, setCountryCode] = useState('');
  const countries = Country.getAllCountries();
  const [selectedShipping, setSelectedShipping] = useState<any>(
    nftContext.sellerInfo.shipping,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  const update = async (id) => {
    let response = null;

    try {
      if (id) {
        response = await upsertSellerInfo({
          id,
          type: sellerInfo.type,
          name: sellerInfo.name,
          email: sellerInfo.email,
          country: (sellerInfo.country as any).name
            ? (sellerInfo.country as any).name
            : sellerInfo.country,
          shippingAddr: sellerInfo.shippingAddr,
          address: {
            line1: sellerInfo.line1,
            line2: sellerInfo.line2,
            state: (sellerInfo.state as any).name
              ? (sellerInfo.state as any).name
              : sellerInfo.state,
            city: (sellerInfo.city as any).name
              ? (sellerInfo.city as any).name
              : sellerInfo.city,
            postalCode: sellerInfo.postalCode,
          },
          phoneNumber: sellerInfo.phoneNumber,
        });
      } else {
        response = await upsertSellerInfo({
          id: '',
          type: sellerInfo.type,
          name: sellerInfo.name,
          email: sellerInfo.email,
          country: (sellerInfo.country as any).name
            ? (sellerInfo.country as any).name
            : sellerInfo.country,
          shippingAddr: sellerInfo.shippingAddr,
          address: {
            line1: sellerInfo.line1,
            line2: sellerInfo.line2,
            state: (sellerInfo.state as any).name
              ? (sellerInfo.state as any).name
              : sellerInfo.state,
            city: (sellerInfo.city as any).name
              ? (sellerInfo.city as any).name
              : sellerInfo.city,
            postalCode: sellerInfo.postalCode,
          },
          phoneNumber: sellerInfo.phoneNumber,
        });
      }
      // console.log('response:', response);

      if (response) {
        await fetchSellers();
      }
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to update shipping information',
        duration: 2000,
      });
    }
  };

  const handleUpdateSeller = (e: any) => {
    const { name, value } = e.target;
    if (name === 'country') {
      const parsedVal = JSON.parse(value);
      const countryStates = State.getStatesOfCountry(parsedVal.isoCode);

      // @ts-ignore
      setStates(countryStates);
      setCountryCode(parsedVal.isoCode);
      setSellerInfo({
        ...sellerInfo,
        [name]: parsedVal,
      });
      return null;
    } else if (name === 'state') {
      const parsedVal = JSON.parse(value);
      const stateCities = City.getCitiesOfState(countryCode, parsedVal.isoCode);

      // @ts-ignore
      setCities(stateCities);
      setSellerInfo({
        ...sellerInfo,
        [name]: parsedVal,
      });
      return null;
    } else if (name === 'city') {
      const parsedVal = JSON.parse(value);
      setSellerInfo({
        ...sellerInfo,
        [name]: parsedVal,
      });
      return null;
    }
    setSellerInfo({
      ...sellerInfo,
      [name]: value,
    });
  };

  const handleDeleteSeller = async (item: any) => {
    try {
      const response = await deleteSellerInfo({
        id: item._id,
      });

      if (response) {
        toast({
          title: 'Properties Template',
          description: 'Delete shipping information successfully',
          duration: 2000,
        });
      }
      await fetchSellers();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete shipping information',
        duration: 2000,
      });
    }
  };

  const cancelChanges = () => {
    setSellerInfo({
      id: null,
      type: '',
      name: '',
      email: '',
      shippingAddr: '',
      country: '',
      line1: '',
      line2: '',
      state: '',
      city: '',
      postalCode: '',
      phoneNumber: '',
    });
    setIsModalOpen(false);
    setIsUpdateModalOpen(false);
  };

  const resetState = () => {
    setStates([]);
    setCities([]);
    setCountryCode('');
    setSellerInfo({
      id: null,
      type: '',
      name: '',
      email: '',
      shippingAddr: '',
      country: '',
      line1: '',
      line2: '',
      state: '',
      city: '',
      postalCode: '',
      phoneNumber: '',
    });
    setIsModalOpen(true);
    console.log('sellerInfo', sellerInfo);
  };

  const preserveState = (value: any) => {
    const countryJSON = Country.getAllCountries().find(
      (item) => item.name === value.country,
    );
    if (!countryJSON?.isoCode) {
      return null;
    }
    const stateJSON = State.getStatesOfCountry(countryJSON.isoCode).find(
      (item) => item.name === value.address.state,
    );
    if (!stateJSON?.isoCode) {
      return null;
    }
    const cityJSON = City.getCitiesOfState(
      countryJSON.isoCode,
      stateJSON.isoCode,
    ).find((item) => item.name === value.address.city);

    const states = State.getStatesOfCountry(countryJSON.isoCode);
    const cities = City.getCitiesOfState(
      countryJSON.isoCode,
      stateJSON.isoCode,
    );

    setSellerInfo({
      ...sellerInfo,
      id: value._id,
      type: value.type,
      name: value.name,
      email: value.email,
      shippingAddr: value.shippingAddr,
      phoneNumber: value.phoneNumber,
      line1: value.address?.line1,
      line2: value.address?.line2,
      city: cityJSON ? cityJSON : value.address.city,
      country: countryJSON ? countryJSON : value.country,
      state: stateJSON ? stateJSON : value.address.state,
      postalCode: value.address?.postalCode,
    });
    setStates(states as any);
    setCities(cities as any);
  };

  const fetchDropDowns = (hasData: boolean, value: any) => {
    if (hasData) {
      // @ts-ignore
      const countryJSON = Country.getAllCountries().find(
        (item) => item.name === value.country,
      );
      if (!countryJSON?.isoCode) {
        return null;
      }
      const stateJSON = State.getStatesOfCountry(countryJSON.isoCode).find(
        (item) => item.name === value.address.state,
      );
      if (!stateJSON?.isoCode) {
        return null;
      }
      const cityJSON = City.getCitiesOfState(
        countryJSON.isoCode,
        stateJSON.isoCode,
      ).find((item) => item.name === value.address.city);

      const states = State.getStatesOfCountry(countryJSON.isoCode);
      const cities = City.getCitiesOfState(
        countryJSON.isoCode,
        stateJSON.isoCode,
      );

      return {
        country: countryJSON,
        state: stateJSON,
        city: cityJSON,
        states,
        cities,
      };
    }

    return null;
  };

  const isSelected = useMemo(
    () => (item: any) => {
      const id = nftContext.sellerInfo.shippingId;
      if (id !== null && item !== null) {
        return id === item._id;
      }
      if (selectedShipping !== null && item !== null) {
        return selectedShipping._id === item._id;
      }
      return false;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedShipping, nftContext.sellerInfo.shipping],
  );

  useEffect(() => {
    nftContext.setSellerInfo({
      ...nftContext.sellerInfo,
      shippingId: selectedShipping?._id,
      shipping: selectedShipping,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedShipping]);

  useEffect(() => {
    fetchSellers();
  }, []);
  const fetchSellers = async () => {
    const response = await getSellerInfo();
    setData(response);
  };

  return (
    <div className="flex flex-col gap-y-5">
      {isSetting ? null : (
        <p className="text-lg font-semibold text-white font-manrope">
          Shipping Information
        </p>
      )}
      <div className="flex flex-wrap gap-5">
        {data && data.length > 0
          ? data?.map((item: any, index: number) => {
              return (
                <div
                  key={index}
                  className={cn(
                    `w-[18rem] cursor-pointer h-[15rem] bg-[#232323] relative flex flex-col justify-between p-4 rounded-md ${isSelected(item) ? 'border-2 border-[#DDF247]' : ''}`,
                    isSetting ? ' bg-[#161616]' : '',
                  )}
                  onClick={() => {
                    setSelectedShipping(item);
                  }}
                >
                  <div className="flex justify-between">
                    <div className="flex flex-col gap-y-2">
                      <span className="text-xl font-semibold">{item.name}</span>
                      <span className="text-[#A6A6A6]">{item.phoneNumber}</span>
                    </div>
                    <div className="text-[#A6A6A6]">{item.shippingAddr}</div>
                  </div>
                  <div>
                    {item.address && item.country ? (
                      <p className="text-[#A6A6A6] azeret-mono-font text-[12px]">
                        {`${item.address.line1 + item.address.line2 + item.address.state + item.address.city + item.country}`
                          .length > 150
                          ? `${item.address.line1 + ' ' + item.address.line2 + ' ' + item.address.state + item.address.city + ' ' + item.country}`.slice(
                              0,
                              150,
                            ) + '...'
                          : `${item.address.line1 + ' ' + item.address.line2 + ' ' + item.address.state + ' ' + item.address.city + ' ' + item.country}`}{' '}
                      </p>
                    ) : null}
                    <div className="absolute bottom-2 right-2 flex items-center gap-1">
                      <div
                        className="text-[#DDF247] text-xs h-full cursor-pointer px-2 py-1 rounded-md border-2 border-[#ffffff12]  text-[14px]"
                        onClick={() => {
                          preserveState(item);
                          setIsUpdateModalOpen(true);
                        }}
                      >
                        Edit
                      </div>
                      <span
                        onClick={() => handleDeleteSeller(item)}
                        className="text-[#DDF247] cursor-pointer px-2 py-1 rounded-md border-2 border-[#ffffff12] text-[14px]"
                      >
                        <Image
                          width={16}
                          height={16}
                          alt="delete"
                          src="/icons/trash.svg"
                          className="w-4 h-4"
                        />
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-end ">
                    <BaseDialog
                      isOpen={isUpdateModalOpen}
                      onClose={() => setIsUpdateModalOpen(false)}
                      className="bg-dark max-h-[80%] overflow-y-auto overflow-x-hidden"
                    >
                      <div className="flex flex-col gap-y-5">
                        <div className="rounded-md px-4 py-3 bg-dark flex flex-col gap-y-6">
                          <div className="flex flex-col gap-y-3">
                            <Label className="text-lg font-semibold">
                              Shipping Address Name
                            </Label>
                            <Input
                              onChange={(e) => {
                                setSellerInfo({
                                  ...sellerInfo,
                                  type: e.target.value,
                                });
                              }}
                              className="w-full border-none bg-[#161616] placeholder:text-xs font-AzeretMono"
                              type="text"
                              value={sellerInfo.type}
                              placeholder="Enter Shipping Address Name (Home, Gallery, Studio etc)"
                            />
                          </div>

                          <div className="flex flex-col gap-y-3">
                            <Label className="text-lg font-semibold">
                              Seller Information
                            </Label>
                            <hr />
                            <div className="flex flex-wrap gap-2">
                              <div className="flex flex-col gap-y-2 lg:w-[32%]">
                                <Label className="text-lg font-semibold">
                                  Name*
                                </Label>
                                <Input
                                  onChange={(e) =>
                                    setSellerInfo({
                                      ...sellerInfo,
                                      name: e.target.value,
                                    })
                                  }
                                  className="w-full border-none bg-[#161616] placeholder:text-xs font-AzeretMono"
                                  type="text"
                                  value={sellerInfo.name ?? ''}
                                  placeholder="Enter name"
                                />
                              </div>
                              <div className="flex flex-col gap-y-2 lg:w-[32%]">
                                <Label className="text-lg font-semibold">
                                  E-mail*
                                </Label>
                                <Input
                                  onChange={(e) =>
                                    setSellerInfo({
                                      ...sellerInfo,
                                      email: e.target.value,
                                    })
                                  }
                                  className="w-full border-none bg-[#161616] placeholder:text-xs font-AzeretMono"
                                  type="text"
                                  value={sellerInfo.email ?? ''}
                                  placeholder="Enter email"
                                />
                              </div>
                              <div className="flex flex-col gap-y-2 lg:w-[32%]">
                                <Label className="text-lg font-semibold">
                                  Country*
                                </Label>
                                <div className="rounded-md bg-[#161616]">
                                  <select
                                    aria-label="select curation"
                                    className="h-10 rounded-md px-2 bg-[#161616] text-xs font-AzeretMono focus-visible:border-none focus-visible:outline-none focus-visible:shadow-none"
                                    name="country"
                                    value={JSON.stringify(sellerInfo.country)}
                                    onChange={handleUpdateSeller}
                                  >
                                    <option value="">Select</option>
                                    {countries.map((item: any) => (
                                      <option
                                        key={item.isoCode}
                                        value={JSON.stringify(item)}
                                      >
                                        {item.name}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="rounded-md px-4 py-3 bg-dark flex flex-col gap-y-6">
                          <div className="flex flex-col gap-y-3">
                            <Label className="text-lg font-semibold">
                              Shipping Address
                            </Label>
                            <hr />
                            <div className="flex flex-wrap justify-between">
                              <div className="flex flex-col gap-y-2 lg:w-[48%]">
                                <Label className="text-lg font-semibold">
                                  Address 1*
                                </Label>
                                <Input
                                  onChange={(e) =>
                                    setSellerInfo({
                                      ...sellerInfo,
                                      line1: e.target.value,
                                    })
                                  }
                                  className="w-full border-none bg-[#161616] placeholder:text-xs font-AzeretMono"
                                  type="text"
                                  value={sellerInfo.line1 ?? ''}
                                  placeholder="Enter Address 1"
                                />
                              </div>
                              <div className="flex flex-col gap-y-2 lg:w-[48%]">
                                <Label className="text-lg font-semibold">
                                  Address 2*
                                </Label>
                                <Input
                                  onChange={(e) =>
                                    setSellerInfo({
                                      ...sellerInfo,
                                      line2: e.target.value,
                                    })
                                  }
                                  value={sellerInfo.line2 ?? ''}
                                  className="w-full border-none bg-[#161616] placeholder:text-xs font-AzeretMono"
                                  type="text"
                                  placeholder="Enter Address 2"
                                />
                              </div>
                            </div>
                            <div className="flex flex-wrap justify-between">
                              <div className="flex flex-col gap-y-2 lg:w-[32%]">
                                <Label className="text-lg font-semibold">
                                  State*
                                </Label>
                                <select
                                  aria-label="select curation"
                                  className="h-10 rounded-md px-2 focus-visible:border-none focus-visible:outline-none focus-visible:shadow-none"
                                  name="state"
                                  value={JSON.stringify(sellerInfo.state)}
                                  onChange={handleUpdateSeller}
                                >
                                  <option value="">Select</option>
                                  {states.map((item: any) => (
                                    <option
                                      key={item.isoCode}
                                      value={JSON.stringify(item)}
                                    >
                                      {item.name}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              <div className="flex flex-col gap-y-2 lg:w-[32%]">
                                <Label className="text-lg font-semibold">
                                  City*
                                </Label>
                                <select
                                  aria-label="select curation"
                                  className="h-10 rounded-md px-2 focus-visible:border-none focus-visible:outline-none focus-visible:shadow-none"
                                  name="city"
                                  value={
                                    sellerInfo.city
                                      ? JSON.stringify(sellerInfo.city)
                                      : ''
                                  }
                                  onChange={handleUpdateSeller}
                                >
                                  <option value="">Select</option>
                                  {cities.map((item: any) => (
                                    <option
                                      key={item.isoCode}
                                      value={JSON.stringify(item)}
                                    >
                                      {item.name}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              <div className="flex flex-col gap-y-2 lg:w-[32%]">
                                <Label className="text-lg font-semibold">
                                  Postal Code*
                                </Label>
                                <Input
                                  onChange={(e) =>
                                    setSellerInfo({
                                      ...sellerInfo,
                                      postalCode: e.target.value,
                                    })
                                  }
                                  value={sellerInfo.postalCode ?? ''}
                                  className="w-full border-none bg-[#161616] placeholder:text-xs font-AzeretMono"
                                  type="text"
                                  placeholder="Enter Zip Code"
                                />
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-col gap-y-3 mt-6">
                            <PhoneInput
                              enableLongNumbers={true}
                              containerClass="phone-container"
                              buttonClass="phone-dropdown"
                              inputClass="phone-control"
                              country={'us'}
                              value={sellerInfo.phoneNumber}
                              inputStyle={{
                                width: '100%',
                                height: '2.5rem',
                                borderRadius: '0.375rem',
                                padding: '0.5rem',
                                marginTop: '0.5rem',
                              }}
                              onChange={(e) =>
                                setSellerInfo({ ...sellerInfo, phoneNumber: e })
                              }
                            />
                          </div>
                        </div>

                        <div className="flex gap-x-4 justify-center my-3 px-4">
                          <BaseButton
                            title="Cancel"
                            variant="secondary"
                            onClick={cancelChanges}
                          />
                          <BaseButton
                            title="Save"
                            variant="primary"
                            onClick={async () => {
                              await update(item._id);
                              setIsUpdateModalOpen(false);
                            }}
                          />
                        </div>
                      </div>
                    </BaseDialog>
                  </div>
                </div>
              );
            })
          : null}

        <div
          className={cn(
            'w-[18rem] h-[15rem] bg-[#232323] flex flex-col gap-y-2 justify-center items-center rounded-md relative',
            isSetting ? ' bg-[#161616]' : '',
          )}
          onClick={resetState}
        >
          <div className="flex flex-col gap-y-6 items-center">
            <div className="w-14 h-14 rounded-full bg-[#111] border border-white/[30%] flex items-center justify-center">
              <Image
                src="/icons/plus.svg"
                className="w-5 h-5"
                alt="plus"
                width={20}
                height={20}
              />
            </div>
            <p
              className={cn(
                'text-[#828282] font-medium text-lg',
                isSetting ? 'text-[#7C8282]' : '',
              )}
            >
              Add New Address
            </p>
          </div>
        </div>

        <BaseDialog
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          className="bg-dark max-h-[80%] overflow-y-auto overflow-x-hidden"
        >
          <div className="flex flex-col gap-y-5">
            <div className="rounded-md px-4 py-3 bg-dark flex flex-col gap-y-6">
              <div className="flex flex-col gap-y-3">
                <Label className="text-lg font-semibold">
                  Shipping Address Name
                </Label>
                <Input
                  onChange={(e) =>
                    setSellerInfo({ ...sellerInfo, type: e.target.value })
                  }
                  className="w-full border-none bg-[#161616] placeholder:text-xs font-AzeretMono"
                  type="text"
                  placeholder="Enter Shipping Address Name (Home, Gallery, Studio etc)"
                />
              </div>

              <div className="flex flex-col gap-y-3">
                <Label className="text-lg font-semibold">
                  Seller Information
                </Label>
                <hr />
                <div className="flex flex-wrap gap-2">
                  <div className="flex flex-col gap-y-2 lg:w-[32%]">
                    <Label className="text-lg font-semibold">Name*</Label>
                    <Input
                      onChange={(e) =>
                        setSellerInfo({ ...sellerInfo, name: e.target.value })
                      }
                      className="w-full border-none bg-[#161616] placeholder:text-xs font-AzeretMono"
                      type="text"
                      placeholder="Enter name"
                    />
                  </div>
                  <div className="flex flex-col gap-y-2 lg:w-[32%]">
                    <Label className="text-lg font-semibold">E-mail*</Label>
                    <Input
                      onChange={(e) =>
                        setSellerInfo({ ...sellerInfo, email: e.target.value })
                      }
                      className="w-full border-none bg-[#161616] placeholder:text-xs font-AzeretMono"
                      type="text"
                      placeholder="Enter email"
                    />
                  </div>
                  <div className="flex flex-col gap-y-2 lg:w-[32%]">
                    <Label className="text-lg font-semibold">Country*</Label>
                    <select
                      aria-label="select curation"
                      className="h-10 rounded-md px-2"
                      name="country"
                      value={JSON.stringify(sellerInfo.country)}
                      onChange={handleUpdateSeller}
                    >
                      <option value="">Select</option>
                      {countries.map((item: any) => (
                        <option key={item.isoCode} value={JSON.stringify(item)}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-md px-4 py-3 bg-dark flex flex-col gap-y-6">
              <div className="flex flex-col gap-y-3">
                <Label className="text-lg font-semibold">
                  Shipping Address
                </Label>
                <hr />
                <div className="flex flex-wrap justify-between">
                  <div className="flex flex-col gap-y-2 lg:w-[48%]">
                    <Label className="text-lg font-semibold">Address 1*</Label>
                    <Input
                      onChange={(e) =>
                        setSellerInfo({
                          ...sellerInfo,
                          line1: e.target.value,
                        })
                      }
                      className="w-full border-none bg-[#161616] placeholder:text-xs font-AzeretMono"
                      type="text"
                      placeholder="Enter name"
                    />
                  </div>
                  <div className="flex flex-col gap-y-2 lg:w-[48%]">
                    <Label className="text-lg font-semibold">Address 2*</Label>
                    <Input
                      onChange={(e) =>
                        setSellerInfo({
                          ...sellerInfo,
                          line2: e.target.value,
                        })
                      }
                      className="w-full border-none bg-[#161616] placeholder:text-xs font-AzeretMono"
                      type="text"
                      placeholder="Enter email"
                    />
                  </div>
                </div>
                <div className="flex flex-wrap justify-between">
                  <div className="flex flex-col gap-y-2 lg:w-[32%]">
                    <Label className="text-lg font-semibold">State*</Label>
                    <select
                      aria-label="select curation"
                      className="h-10 rounded-md px-2"
                      name="state"
                      value={JSON.stringify(sellerInfo.state)}
                      onChange={handleUpdateSeller}
                    >
                      <option value="">Select</option>
                      {states.map((item: any) => (
                        <option key={item.isoCode} value={JSON.stringify(item)}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col gap-y-2 lg:w-[32%]">
                    <Label className="text-lg font-semibold">City*</Label>
                    <select
                      aria-label="select curation"
                      className="h-10 rounded-md px-2"
                      name="city"
                      value={
                        sellerInfo.city ? JSON.stringify(sellerInfo.city) : ''
                      }
                      onChange={handleUpdateSeller}
                    >
                      <option value="">Select</option>
                      {cities.map((item: any) => (
                        <option key={item.isoCode} value={JSON.stringify(item)}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col gap-y-2 lg:w-[32%]">
                    <Label className="text-lg font-semibold">
                      Postal Code*
                    </Label>
                    <Input
                      onChange={(e) =>
                        setSellerInfo({
                          ...sellerInfo,
                          postalCode: e.target.value,
                        })
                      }
                      className="w-full border-none bg-[#161616] placeholder:text-xs font-AzeretMono"
                      type="text"
                      placeholder="Enter email"
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-y-3 mt-6">
                <PhoneInput
                  enableLongNumbers={true}
                  containerClass="phone-container"
                  buttonClass="phone-dropdown"
                  inputClass="phone-control"
                  country={'us'}
                  value={sellerInfo.phoneNumber}
                  inputStyle={{
                    width: '100%',
                    height: '2.5rem',
                    borderRadius: '0.375rem',
                    padding: '0.5rem',
                    marginTop: '0.5rem',
                  }}
                  onChange={(e) =>
                    setSellerInfo({ ...sellerInfo, phoneNumber: e })
                  }
                />
              </div>
            </div>

            <div className="flex gap-x-4 justify-center my-3 px-4">
              <BaseButton
                title="Cancel"
                variant="secondary"
                onClick={cancelChanges}
              />
              <BaseButton
                title="Save"
                variant="primary"
                onClick={async () => {
                  await update('');
                  setIsModalOpen(false);
                }}
              />
            </div>
          </div>
        </BaseDialog>
      </div>
    </div>
  );
}
