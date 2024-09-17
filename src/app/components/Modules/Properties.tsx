'use client';

import { getProperties, upsertProperty } from '@/services/supplier';
import { useEffect, useState } from 'react';
import { BaseDialog } from '../ui/BaseDialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import BaseButton from '../ui/BaseButton';
import { useToast } from '@/hooks/use-toast';

export default function PropertiesInfo({close}) {
  const { toast } = useToast();

  const [data, setData] = useState<null | any[]>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [propMod, setPropMod] = useState<{
    by: string | null;
    type: boolean;
    value: boolean;
    index: null | number;
  }>({
    by: null,
    type: false,
    value: false,
    index: null,
  });
  const [property, setProperty] = useState({
    id: null,
    name: '',
    attributes: [
      {
        type: 'Length',
        value: '150cm',
      },
      {
        type: 'Height',
        value: '5cm',
      },
      {
        type: 'Width',
        value: '150cm',
      },
      {
        type: 'Weight',
        value: '5kg',
      },
    ],
  });

  const modifyProp = (index: number, forType: string, value: string) => {
    const newArr = property.attributes.map((item: any, idx) => {
      if (idx === index) {
        item[`${forType}`] = value;
        return item;
      }
      return item;
    });
    setProperty({
      ...property,
      attributes: newArr,
    });
  };

  const removeProp = (index: number) => {
    if (property.attributes.length === 1) {
      return;
    }

    setPropMod({
      by: null,
      index: null,
      type: false,
      value: false,
    });
    const newArr = property.attributes.filter((item, idx) => idx !== index);
    setProperty({
      ...property,
      attributes: newArr,
    });
  };

  const addNewProp = () => {
    setPropMod({
      by: null,
      index: null,
      type: false,
      value: false,
    });
    const newProp = {
      type: 'Title Here',
      value: 'Write it here',
    };

    setProperty({
      ...property,
      attributes: [...property.attributes, newProp],
    });
  };

  const update = async (id?: string) => {
    toast({
      title: 'Properties Template',
      duration: 2000,
    });

    let response = null;
    if (id) {
      response = await upsertProperty({
        id: id,
        name: property.name,
        attributes: property.attributes,
      });
    } else {
      response = await upsertProperty({
        id: property.id,
        name: property.name,
        attributes: property.attributes,
      });
    }

    if (response) {
      if (data) {
        toast({
          title: 'Properties Template',
          description: 'Saved successfully',
          duration: 2000,
        });
      }
    }
    close();
  };

  const cancelChanges = () => {
    setProperty({
      ...property,
      name: '',
      attributes: [
        {
          type: 'Length',
          value: '150cm',
        },
        {
          type: 'Height',
          value: '5cm',
        },
        {
          type: 'Width',
          value: '150cm',
        },
        {
          type: 'Weight',
          value: '5kg',
        },
      ],
    });
  };

  const resetState = () => {
    setProperty({
      id: null,
      name: '',
      attributes: [
        {
          type: 'Length',
          value: '150cm',
        },
        {
          type: 'Height',
          value: '5cm',
        },
        {
          type: 'Width',
          value: '150cm',
        },
        {
          type: 'Weight',
          value: '5kg',
        },
      ],
    });
  };

  const preserveState = (value: any) => {
    setProperty({
      id: value.id,
      name: value.name,
      attributes: value.attributes,
    });
  };

  useEffect(() => {
    const fetchProperties = async () => {
      const response = await getProperties();

      if (response.length > 0) {
        setData(response);
      }
    };

    fetchProperties();
  }, []);

  return (
    <div className="flex flex-col gap-y-5">
      <p className="text-lg font-medium">Add Properties Template</p>
      <div className="flex flex-wrap gap-5">
        {data && data.length > 0
          ? data.map((item: any, index: number) => (
              <div
                key={index}
                className="w-[18rem] h-[15rem] bg-[#232323] flex justify-center items-center rounded-md relative"
              >
                <p>{item.name}</p>
                <div className="absolute bottom-5 right-5">
                  <BaseDialog
                  isOpen
                  onClose={() => {
                    
                  }}
                    
                    className="bg-dark max-h-[80%] overflow-y-auto overflow-x-hidden"
                  >
                    <div className="flex flex-col gap-y-5">
                      <div className="flex flex-col gap-y-4">
                        <Label className="text-lg font-medium">
                          Properties Template Name
                        </Label>
                        <Input
                          value={property.name}
                          onChange={(e) =>
                            setProperty({ ...property, name: e.target.value })
                          }
                          className="w-full border-none bg-[#161616]"
                          type="text"
                          placeholder="Enter your properties template name"
                        />
                      </div>

                      <div className="flex flex-col gap-y-4 my-6">
                        <p className="text-xl font-medium text-white">
                          Properties value
                        </p>
                        <div className="flex gap-4 flex-wrap">
                          {property?.attributes.length > 0
                            ? property.attributes.map((item, index: number) => (
                                <div
                                  key={index}
                                  className="flex justify-center relative py-3 gap-y-1 flex-col w-[10rem] border-2 border-white rounded-md"
                                >
                                  {propMod.type &&
                                  propMod.index === index &&
                                  propMod.by === 'default' ? (
                                    <input
                                      type="text"
                                      className="text-white text-center w-[65%] rounded-md bg-transparent mx-auto"
                                      onChange={(e) =>
                                        modifyProp(
                                          index,
                                          'type',
                                          e.target.value,
                                        )
                                      }
                                    />
                                  ) : (
                                    <p
                                      className="text-white text-center text-sm"
                                      onClick={() =>
                                        setPropMod({
                                          ...propMod,
                                          type: true,
                                          index: index,
                                          by: 'default',
                                        })
                                      }
                                    >
                                      {item.type}
                                    </p>
                                  )}
                                  {propMod.value &&
                                  propMod.index === index &&
                                  propMod.by === 'default' ? (
                                    <input
                                      type="text"
                                      className="text-white text-center w-[65%] rounded-md bg-transparent mx-auto"
                                      onChange={(e) =>
                                        modifyProp(
                                          index,
                                          'value',
                                          e.target.value,
                                        )
                                      }
                                    />
                                  ) : (
                                    <p
                                      className="text-gray-400 text-center"
                                      onClick={() =>
                                        setPropMod({
                                          ...propMod,
                                          value: true,
                                          index: index,
                                          by: 'default',
                                        })
                                      }
                                    >
                                      {item.value}
                                    </p>
                                  )}
                                  <div
                                    className="absolute top-2 right-2 cursor-pointer"
                                    onClick={() => removeProp(index)}
                                  >
                                    <svg
                                      width="18"
                                      height="19"
                                      viewBox="0 0 18 19"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M4 4L14 14"
                                        stroke="#DDF247"
                                        stroke-width="1.5"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                      />
                                      <path
                                        d="M14 4L4 14"
                                        stroke="#DDF247"
                                        stroke-width="1.5"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                      />
                                    </svg>
                                  </div>
                                </div>
                              ))
                            : null}
                          <div
                            className="flex cursor-pointer justify-center relative py-3 gap-y-1 items-center w-[10rem] border-2 border-[#DDF247] rounded-md"
                            onClick={addNewProp}
                          >
                            <img
                              src="/icons/add-new.svg"
                              className="w-10 h-10"
                            />
                            <p className="text-center text-sm text-[#DDF247]">
                              Add New
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-x-4 justify-center my-3">
                        <BaseButton
                          title="Cancel"
                          variant="secondary"
                          onClick={cancelChanges}
                        />
                        <BaseButton
                          title="Save"
                          variant="primary"
                          onClick={async () => await update(item._id)}
                        />
                      </div>
                    </div>
                  </BaseDialog>
                </div>
              </div>
            ))
          : null}

        <BaseDialog
          trigger={
            <div
              className="w-[18rem] h-[15rem] bg-[#232323] flex flex-col relative justify-center cursor-pointer items-center rounded-md"
              onClick={resetState}
            >
              <div className="flex flex-col gap-y-6 items-center">
                <div className="w-16 h-16 rounded-full bg-[#111111] border-2 border-[#FFFFFF4D] flex justify-center items-center">
                  <img
                    src="/icons/plus.svg"
                    className="w-5 h-5"
                    width={100}
                    height={100}
                  />
                </div>
                <p className="text-[#828282]">Add New Template</p>
              </div>
            </div>
          }
          className="bg-dark max-h-[80%] overflow-y-auto overflow-x-hidden"
        >
          <div className="flex flex-col gap-y-5">
            <div className="flex flex-col gap-y-4">
              <Label className="text-lg font-medium">
                Properties Template Name
              </Label>
              <Input
                onChange={(e) =>
                  setProperty({ ...property, name: e.target.value })
                }
                className="w-full border-none bg-[#161616]"
                type="text"
                placeholder="Enter your properties template name"
              />
            </div>

            <div className="flex flex-col gap-y-4 my-6">
              <p className="text-xl font-medium text-white">Properties value</p>
              <div className="flex gap-4 flex-wrap">
                {property?.attributes.length > 0
                  ? property.attributes.map((item, index: number) => (
                      <div
                        key={index}
                        className="flex justify-center relative py-3 gap-y-1 flex-col w-[10rem] border-2 border-white rounded-md"
                      >
                        {propMod.type &&
                        propMod.index === index &&
                        propMod.by === 'default' ? (
                          <input
                            type="text"
                            className="text-white text-center w-[65%] rounded-md bg-transparent mx-auto"
                            onChange={(e) =>
                              modifyProp(index, 'type', e.target.value)
                            }
                          />
                        ) : (
                          <p
                            className="text-white text-center text-sm"
                            onClick={() =>
                              setPropMod({
                                ...propMod,
                                type: true,
                                index: index,
                                by: 'default',
                              })
                            }
                          >
                            {item.type}
                          </p>
                        )}
                        {propMod.value &&
                        propMod.index === index &&
                        propMod.by === 'default' ? (
                          <input
                            type="text"
                            className="text-white text-center w-[65%] rounded-md bg-transparent mx-auto"
                            onChange={(e) =>
                              modifyProp(index, 'value', e.target.value)
                            }
                          />
                        ) : (
                          <p
                            className="text-gray-400 text-center"
                            onClick={() =>
                              setPropMod({
                                ...propMod,
                                value: true,
                                index: index,
                                by: 'default',
                              })
                            }
                          >
                            {item.value}
                          </p>
                        )}
                        <div
                          className="absolute top-2 right-2 cursor-pointer"
                          onClick={() => removeProp(index)}
                        >
                          <svg
                            width="18"
                            height="19"
                            viewBox="0 0 18 19"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M4 4L14 14"
                              stroke="#DDF247"
                              stroke-width="1.5"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                            <path
                              d="M14 4L4 14"
                              stroke="#DDF247"
                              stroke-width="1.5"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                          </svg>
                        </div>
                      </div>
                    ))
                  : null}
                <div
                  className="flex cursor-pointer justify-center relative py-3 gap-y-1 items-center w-[10rem] border-2 border-[#DDF247] rounded-md"
                  onClick={addNewProp}
                >
                  <img src="/icons/add-new.svg" className="w-10 h-10" />
                  <p className="text-center text-sm text-[#DDF247]">Add New</p>
                </div>
              </div>
            </div>

            <div className="flex gap-x-4 justify-center my-3">
              <BaseButton
                title="Cancel"
                variant="secondary"
                onClick={()=>{cancelChanges();close()}}
              />
              <BaseButton
                title="Save"
                variant="primary"
                onClick={async () => await update()}
              />
            </div>
          </div>
        </BaseDialog>
      </div>
    </div>
  );
}
