"use client"

import { getSellerInfo, upsertSellerInfo } from "@/services/supplier";
import { useEffect, useState } from "react";
import { BaseDialog } from "../ui/BaseDialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import BaseButton from "../ui/BaseButton";
import PhoneInput from "react-phone-input-2";
import { City, Country, State } from "country-state-city";

export default function ShippingInfo({ handler } : { handler?: (data: any) => void }) {
    const [data, setData] = useState<null | any[]>(null);
    const [sellerInfo, setSellerInfo] = useState({
        id: null,
        type: "",
        name: "",
        email: "",
        shippingAddr: "",
        country: "",
        address1: "",
        address2: "",
        state: "",
        city: "",
        postalCode: "",
        phoneNumber: "",
    });
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);
    const [countryCode, setCountryCode] = useState("");
    const countries = Country.getAllCountries();
    const [selectedShipping, setSelectedShipping] = useState<any>(null);

    const update = async (id?: string) => {
        let response = null;

        if (id) {
            response = await upsertSellerInfo({
                id,
                type: sellerInfo.type,
                name: sellerInfo.name,
                email: sellerInfo.email,
                country: (sellerInfo.country as any).name ? (sellerInfo.country as any).name : sellerInfo.country,
                shippingAddr: sellerInfo.shippingAddr,
                address: {
                    line1: sellerInfo.address1,
                    line2: sellerInfo.address2,
                    state: (sellerInfo.state as any).name ? (sellerInfo.state as any).name : sellerInfo.state,
                    city: (sellerInfo.city as any).name ? (sellerInfo.city as any).name : sellerInfo.city,
                    postalCode: sellerInfo.postalCode,
                },
                phoneNumber: sellerInfo.phoneNumber,
            });
        } else {
            response = await upsertSellerInfo({
                id: sellerInfo.id,
                type: sellerInfo.type,
                name: sellerInfo.name,
                email: sellerInfo.email,
                country: (sellerInfo.country as any).name ? (sellerInfo.country as any).name : sellerInfo.country,
                shippingAddr: sellerInfo.shippingAddr,
                address: {
                    line1: sellerInfo.address1,
                    line2: sellerInfo.address2,
                    state: (sellerInfo.state as any).name ? (sellerInfo.state as any).name : sellerInfo.state,
                    city: (sellerInfo.city as any).name ? (sellerInfo.city as any).name : sellerInfo.city,
                    postalCode: sellerInfo.postalCode,
                },
                phoneNumber: sellerInfo.phoneNumber,
            })
        }

        if (response) {
            if (data) {
                setData([...data, response]);
            }
        }
    }

    const handleUpdateSeller = (e: any) => {
        const { name, value } = e.target;
        if (name === "country") {
            const parsedVal = JSON.parse(value);
            const countryStates = State.getStatesOfCountry(parsedVal.isoCode);

            // @ts-ignore
            setStates(countryStates);
            setCountryCode(parsedVal.isoCode);
            setSellerInfo({
                ...sellerInfo,
                [name]: parsedVal,
            })
            return null
        } else if (name === "state") {
            const parsedVal = JSON.parse(value);
            const stateCities = City.getCitiesOfState(countryCode, parsedVal.isoCode);

            // @ts-ignore
            setCities(stateCities);
            setSellerInfo({
                ...sellerInfo,
                [name]: parsedVal,
            })
            return null
        } else if (name === 'city') {
            const parsedVal = JSON.parse(value);
            setSellerInfo({
                ...sellerInfo,
                [name]: parsedVal,
            })
            return null
        }
        setSellerInfo({
            ...sellerInfo,
            [name]: value,
        });
    }

    const cancelChanges = () => {
        setSellerInfo({
            id: null,
            type: "",
            name: "",
            email: "",
            shippingAddr: "",
            country: "",
            address1: "",
            address2: "",
            state: "",
            city: "",
            postalCode: "",
            phoneNumber: "",
        })
    }

    const resetState = () => {
        setStates([]);
        setCities([]);
        setCountryCode("");
    }

    const preserveState = (value: any) => {
        const countryJSON = Country.getAllCountries().find((item) => item.name === value.country)
        if (!countryJSON?.isoCode) {
            return null
        }
        const stateJSON = State.getStatesOfCountry(countryJSON.isoCode).find((item) => item.name === value.address.state)
        if (!stateJSON?.isoCode) {
            return null
        }
        const cityJSON = City.getCitiesOfState(countryJSON.isoCode, stateJSON.isoCode).find((item) => item.name === value.address.city)

        const states = State.getStatesOfCountry(countryJSON.isoCode);
        const cities = City.getCitiesOfState(countryJSON.isoCode, stateJSON.isoCode)

        setSellerInfo({
            ...sellerInfo,
            id: value._id,
            type: value.shippingAddr,
            name: value.name,
            email: value.email,
            shippingAddr: value.shippingAddr,
            phoneNumber: value.phoneNumber,
            city: cityJSON ? cityJSON : value.address.city,
            country: countryJSON ? countryJSON : value.country,
            state: stateJSON ? stateJSON : value.address.state,
        })
        setStates(states as any);
        setCities(cities as any);
    }

    const fetchDropDowns = (hasData: boolean, value: any) => {
        if (hasData) {
            // @ts-ignore
            const countryJSON = Country.getAllCountries().find((item) => item.name === value.country)
            if (!countryJSON?.isoCode) {
                return null
            }
            const stateJSON = State.getStatesOfCountry(countryJSON.isoCode).find((item) => item.name === value.address.state)
            if (!stateJSON?.isoCode) {
                return null
            }
            const cityJSON = City.getCitiesOfState(countryJSON.isoCode, stateJSON.isoCode).find((item) => item.name === value.address.city)

            const states = State.getStatesOfCountry(countryJSON.isoCode);
            const cities = City.getCitiesOfState(countryJSON.isoCode, stateJSON.isoCode);

            return {
                country: countryJSON,
                state: stateJSON,
                city: cityJSON,
                states,
                cities,
            }
        }

        return null
    }


    useEffect(() => {
        if (handler) {
            handler(selectedShipping);
        }
    }, [selectedShipping]);

    useEffect(() => {
        const fetchSellers = async () => {
            const response = await getSellerInfo();

            if (response.length > 0) {
                setData(response);
            }
        }

        fetchSellers();
    }, []);

    return (
        <div className="flex flex-col gap-y-5">
            <p className="text-lg font-medium">Shipping Information</p>
            <div className="flex flex-wrap gap-5">
                {data && data.length > 0 ? (
                    data.map((item: any, index: number) => {
                        return (
                            <div key={index} 
                            onClick={() => setSelectedShipping(item)}
                            className="w-[18rem] h-[15rem] bg-[#232323] flex flex-col justify-between p-4 rounded-md">
                                <div className="flex justify-between">
                                    <div className="flex flex-col gap-y-2">
                                        <span>{item.name}</span>
                                        <span className="text-[#A6A6A6]">{item.phoneNumber}</span>
                                    </div>
                                    <div className="text-[#A6A6A6]">{item.shippingAddr}</div>
                                </div>
                                <div>
                                    {
                                        item.address && item.country ?
                                            <p className="text-[#A6A6A6]">{`${item.address.line1 + item.address.line2 + item.address.state + item.address.city + item.country}`.length > 150 ?
                                                `${item.address.line1 + " " + item.address.line2 + " " + item.address.state + item.address.city + " " + item.country}`.slice(0, 150) + "..." :
                                                `${item.address.line1 + " " + item.address.line2 + " " + item.address.state + " " + item.address.city + " " + item.country}`
                                            } </p> : null
                                    }
                                </div>
                                <div className="flex justify-end">
                                    <BaseDialog
                                        trigger={<span onClick={() => preserveState(item)} className="text-[#DDF247] cursor-pointer px-2 py-1 rounded-md border-2 border-gray-400">Edit</span>}
                                        children={
                                            <div className="flex flex-col gap-y-5 w-full">
                                                <div className="w-full rounded-md px-4 py-3 bg-dark flex flex-col gap-y-6">
                                                    <div className="flex flex-col gap-y-3">
                                                        <Label className="text-lg font-medium">Shipping Address Name</Label>
                                                        <Input value={sellerInfo.type ? sellerInfo.type : item.shippingAddr} onChange={(e) => setSellerInfo({ ...sellerInfo, type: e.target.value })} className="w-full border-none bg-[#161616]" type="text" placeholder="Enter Shipping Address Name (Home, Gallery, Studio etc)" />
                                                    </div>

                                                    <div className="flex flex-col gap-y-3">
                                                        <Label className="text-lg font-medium">Seller Information</Label>
                                                        <hr />
                                                        <div className="flex flex-wrap gap-2">
                                                            <div className="flex flex-col gap-y-2 lg:w-[32%]">
                                                                <Label className="text-lg font-medium">Name*</Label>
                                                                <Input value={sellerInfo.name ? sellerInfo.name : item.name} onChange={(e) => setSellerInfo({ ...sellerInfo, name: e.target.value })} className="w-full border-none bg-[#161616]" type="text" placeholder="Enter name" />
                                                            </div>
                                                            <div className="flex flex-col gap-y-2 lg:w-[32%]">
                                                                <Label className="text-lg font-medium">E-mail*</Label>
                                                                <Input value={sellerInfo.email ? sellerInfo.email : item.email} onChange={(e) => setSellerInfo({ ...sellerInfo, email: e.target.value })} className="w-full border-none bg-[#161616]" type="text" placeholder="Enter email" />
                                                            </div>
                                                            <div className="flex flex-col gap-y-2 lg:w-[32%]">
                                                                <Label className="text-lg font-medium">Country*</Label>
                                                                <select
                                                                    aria-label="select curation"
                                                                    className="h-10 rounded-md px-2"
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

                                                <div className="w-full rounded-md px-4 py-3 bg-dark flex flex-col gap-y-6">
                                                    <div className="flex flex-col gap-y-3">
                                                        <Label className="text-lg font-medium">Shipping Address</Label>
                                                        <hr />
                                                        <div className="flex flex-wrap justify-between">
                                                            <div className="flex flex-col gap-y-2 lg:w-[48%]">
                                                                <Label className="text-lg font-medium">Address 1*</Label>
                                                                <Input value={sellerInfo.address1 ? sellerInfo.address1 : (item.address ? item.address.line1 : '')} onChange={(e) => setSellerInfo({ ...sellerInfo, address1: e.target.value })} className="w-full border-none bg-[#161616]" type="text" placeholder="Enter name" />
                                                            </div>
                                                            <div className="flex flex-col gap-y-2 lg:w-[48%]">
                                                                <Label className="text-lg font-medium">Address 2*</Label>
                                                                <Input value={sellerInfo.address2 ? sellerInfo.address2 : (item.address ? item.address.line2 : '')} onChange={(e) => setSellerInfo({ ...sellerInfo, address2: e.target.value })} className="w-full border-none bg-[#161616]" type="text" placeholder="Enter email" />
                                                            </div>
                                                        </div>
                                                        <div className="flex flex-wrap justify-between">
                                                            <div className="flex flex-col gap-y-2 lg:w-[32%]">
                                                                <Label className="text-lg font-medium">State*</Label>
                                                                <select
                                                                    aria-label="select curation"
                                                                    className="h-10 rounded-md px-2"
                                                                    name="state"
                                                                    value={sellerInfo.state ? JSON.stringify(sellerInfo.state) : ""}
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
                                                                <Label className="text-lg font-medium">City*</Label>
                                                                <select
                                                                    aria-label="select curation"
                                                                    className="h-10 rounded-md px-2"
                                                                    name="city"
                                                                    value={sellerInfo.city ? JSON.stringify(sellerInfo.city) : ""}
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
                                                                <Label className="text-lg font-medium">Postal Code*</Label>
                                                                <Input value={sellerInfo.postalCode ? sellerInfo.postalCode : (item.address ? item.address.postalCode : '')} onChange={(e) => setSellerInfo({ ...sellerInfo, postalCode: e.target.value })} className="w-full border-none bg-[#161616]" type="text" placeholder="Enter postcode" />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-col gap-y-3 mt-6">
                                                        <PhoneInput
                                                            enableLongNumbers={true}
                                                            containerClass="phone-container"
                                                            buttonClass="phone-dropdown"
                                                            inputClass="phone-control"
                                                            country={"us"}
                                                            value={sellerInfo.phoneNumber ? sellerInfo.phoneNumber : item.phoneNumber}
                                                            inputStyle={{
                                                                width: "100%",
                                                                height: "2.5rem",
                                                                borderRadius: "0.375rem",
                                                                padding: "0.5rem",
                                                                marginTop: "0.5rem",
                                                            }}
                                                            onChange={(e) => setSellerInfo({ ...sellerInfo, phoneNumber: e })}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="flex gap-x-4 justify-center my-3 px-4">
                                                    <BaseButton title="Cancel" variant="secondary" onClick={cancelChanges} />
                                                    <BaseButton title="Save" variant="primary" onClick={async () => await update(item._id)} />
                                                </div>
                                            </div>
                                        }
                                        className="bg-dark max-h-[80%] overflow-y-auto overflow-x-hidden"
                                        />
                                </div>
                            </div>
                        )
                    })
                ) : null}

                <BaseDialog
                    trigger={
                        <div className="w-[18rem] h-[15rem] bg-[#232323] flex flex-col relative justify-center cursor-pointer items-center rounded-md" onClick={resetState}>
                            <div className="flex flex-col gap-y-6 items-center">
                                <div className="w-16 h-16 rounded-full bg-[#111111] border-2 border-[#FFFFFF4D] flex justify-center items-center">
                                    <img src="icons/plus.svg" className="w-5 h-5" />
                                </div>
                                <p className="text-[#828282]">Add New Address</p>
                            </div>
                        </div>
                    }
                    children={
                        <div className="flex flex-col gap-y-5">
                            <div className="rounded-md px-4 py-3 bg-dark flex flex-col gap-y-6">
                                <div className="flex flex-col gap-y-3">
                                    <Label className="text-lg font-medium">Shipping Address Name</Label>
                                    <Input onChange={(e) => setSellerInfo({ ...sellerInfo, type: e.target.value })} className="w-full border-none bg-[#161616]" type="text" placeholder="Enter Shipping Address Name (Home, Gallery, Studio etc)" />
                                </div>

                                <div className="flex flex-col gap-y-3">
                                    <Label className="text-lg font-medium">Seller Information</Label>
                                    <hr />
                                    <div className="flex flex-wrap gap-2">
                                        <div className="flex flex-col gap-y-2 lg:w-[32%]">
                                            <Label className="text-lg font-medium">Name*</Label>
                                            <Input onChange={(e) => setSellerInfo({ ...sellerInfo, name: e.target.value })} className="w-full border-none bg-[#161616]" type="text" placeholder="Enter name" />
                                        </div>
                                        <div className="flex flex-col gap-y-2 lg:w-[32%]">
                                            <Label className="text-lg font-medium">E-mail*</Label>
                                            <Input onChange={(e) => setSellerInfo({ ...sellerInfo, email: e.target.value })} className="w-full border-none bg-[#161616]" type="text" placeholder="Enter email" />
                                        </div>
                                        <div className="flex flex-col gap-y-2 lg:w-[32%]">
                                            <Label className="text-lg font-medium">Country*</Label>
                                            <select
                                                aria-label="select curation"
                                                className="h-10 rounded-md px-2"
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

                            <div className="rounded-md px-4 py-3 bg-dark flex flex-col gap-y-6">
                                <div className="flex flex-col gap-y-3">
                                    <Label className="text-lg font-medium">Shipping Address</Label>
                                    <hr />
                                    <div className="flex flex-wrap justify-between">
                                        <div className="flex flex-col gap-y-2 lg:w-[48%]">
                                            <Label className="text-lg font-medium">Address 1*</Label>
                                            <Input onChange={(e) => setSellerInfo({ ...sellerInfo, address1: e.target.value })} className="w-full border-none bg-[#161616]" type="text" placeholder="Enter name" />
                                        </div>
                                        <div className="flex flex-col gap-y-2 lg:w-[48%]">
                                            <Label className="text-lg font-medium">Address 2*</Label>
                                            <Input onChange={(e) => setSellerInfo({ ...sellerInfo, address2: e.target.value })} className="w-full border-none bg-[#161616]" type="text" placeholder="Enter email" />
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap justify-between">
                                        <div className="flex flex-col gap-y-2 lg:w-[32%]">
                                            <Label className="text-lg font-medium">State*</Label>
                                            <select
                                                aria-label="select curation"
                                                className="h-10 rounded-md px-2"
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
                                            <Label className="text-lg font-medium">City*</Label>
                                            <select
                                                aria-label="select curation"
                                                className="h-10 rounded-md px-2"
                                                name="city"
                                                value={sellerInfo.city ? JSON.stringify(sellerInfo.city) : ""}
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
                                            <Label className="text-lg font-medium">Postal Code*</Label>
                                            <Input onChange={(e) => setSellerInfo({ ...sellerInfo, postalCode: e.target.value })} className="w-full border-none bg-[#161616]" type="text" placeholder="Enter email" />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-y-3 mt-6">
                                    <PhoneInput
                                        enableLongNumbers={true}
                                        containerClass="phone-container"
                                        buttonClass="phone-dropdown"
                                        inputClass="phone-control"
                                        country={"us"}
                                        value={sellerInfo.phoneNumber}
                                        inputStyle={{
                                            width: "100%",
                                            height: "2.5rem",
                                            borderRadius: "0.375rem",
                                            padding: "0.5rem",
                                            marginTop: "0.5rem",
                                        }}
                                        onChange={(e) => setSellerInfo({ ...sellerInfo, phoneNumber: e })}
                                    />
                                </div>
                            </div>

                            <div className="flex gap-x-4 justify-center my-3 px-4">
                                <BaseButton title="Cancel" variant="secondary" onClick={cancelChanges} />
                                <BaseButton title="Save" variant="primary" onClick={update} />
                            </div>
                        </div>
                    }
                    className="bg-dark max-h-[80%] overflow-y-auto overflow-x-hidden"
                />
            </div>
        </div>
    );
}