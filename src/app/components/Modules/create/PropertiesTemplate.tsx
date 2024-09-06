'use client';

import React, { useEffect, useState } from 'react';
import { getProperties, upsertProperty } from '@/services/supplier';

const defaultAttributes = [
  {
    type: 'Type',
    value: 'Write it here',
  },
  {
    type: 'Medium',
    value: 'Write it here',
  },
  {
    type: 'Support',
    value: 'Write it here',
  },
  {
    type: 'Dimensions (cm)',
    value: 'Write it here',
  },
  {
    type: 'Signature',
    value: 'Write it here',
  },
  {
    type: 'Authentication',
    value: 'Write it here',
  },
];

export default function PropertiesTemplate({ select }: { select?: any }) {
  const [selectedProperty, setSelectedProperty] = useState<any | null>(null);
  const [data, setData] = useState([]);
  const [propMod, setPropMod] = useState<any>({
    by: null,
    index: null,
    type: false,
    value: false,
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
        item['key'] = idx;
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

  const makeUpdates = async () => {
    if (selectedProperty !== null && selectedProperty !== property) {
      await upsertProperty({
        id: selectedProperty._id,
        name: selectedProperty.name,
        attributes: selectedProperty.attributes,
      });
    }
  };

  useEffect(() => {
    if (selectedProperty !== null) {
      if (select) {
        console.log('selectedProperty', selectedProperty);
        select(selectedProperty);
      }
      makeUpdates();
    } else {
      if (select) {
        select(null);
      }
    }
  }, [selectedProperty]);

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
    <div className="bg-dark p-4 gap-y-2 rounded-lg flex flex-col">
      <p>Properties</p>
      <span className="text-gray-400">
        Textual Traits that show up as rectangle.
      </span>

      <div className="flex flex-col gap-y-3 mt-4">
        <p>Select Properties Template</p>

        <div className="flex flex-wrap gap-5">
          <div
            onClick={() => setSelectedProperty(null)}
            className={`w-[18rem] h-[15rem] bg-[#232323] border-2 flex justify-center items-center rounded-md relative ${selectedProperty == null ? 'border-neon' : 'border-gray-400'}`}
          >
            <p>Basic Template</p>
          </div>
          {data && data.length > 0
            ? data.map((item: any, index: number) => {
                return (
                  <div
                    key={index}
                    onClick={() => setSelectedProperty(item)}
                    className={`w-[18rem] h-[15rem] bg-[#232323] border-2 flex justify-center items-center rounded-md relative ${selectedProperty == item ? 'border-neon' : 'border-gray-400'}`}
                  >
                    <p>{item.name}</p>
                  </div>
                );
              })
            : null}
        </div>

        <div className="flex flex-wrap gap-3 my-5">
          {selectedProperty === null
            ? defaultAttributes.map((item, index) => {
                return (
                  <div
                    className="flex justify-center relative py-3 gap-y-1 flex-col w-[10rem] border-2 border-white rounded-md"
                    key={index}
                  >
                    {propMod.type &&
                    propMod.index === index &&
                    propMod.by === 'default' ? (
                      <input
                        type="text"
                        className="text-white text-center w-[65%] rounded-md bg-transparent mx-auto"
                        onChange={(e) => {
                          modifyProp(index, 'type', e.target.value);
                        }}
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
                        onChange={(e) => {
                          modifyProp(index, 'value', e.target.value);
                          e.target.value = e.target.value;
                        }}
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
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M14 4L4 14"
                          stroke="#DDF247"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </div>
                );
              })
            : selectedProperty.attributes &&
                selectedProperty.attributes.length > 0
              ? selectedProperty.attributes.map((item: any, index: number) => {
                  return (
                    <div
                      className="flex justify-center relative py-3 gap-y-1 flex-col w-[10rem] border-2 border-white rounded-md"
                      key={index}
                    >
                      {propMod.type &&
                      propMod.index === index &&
                      propMod.by === 'default' ? (
                        <input
                          type="text"
                          className="text-white text-center w-[65%] rounded-md bg-transparent mx-auto"
                          onChange={(e) => {
                            modifyProp(index, 'type', e.target.value);
                          }}
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
                          onChange={(e) => {
                            modifyProp(index, 'value', e.target.value);
                            e.target.value = e.target.value;
                          }}
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
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M14 4L4 14"
                            stroke="#DDF247"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    </div>
                  );
                })
              : null}
          <div
            className="flex cursor-pointer justify-center relative py-3 gap-y-1 items-center w-[10rem] border-2 border-[#DDF247] rounded-md"
            onClick={addNewProp}
          >
            <img src="icons/add-new.svg" className="w-10 h-10" />
            <p className="text-center text-sm text-[#DDF247]">Add New</p>
          </div>
        </div>
        <div className="flex gap-x-3 item-center">
          <img src="icons/dot.svg" className="w-5 h-5" />
          <span>
            You can freely change properties values ​​by clicking on the title
            and content.
          </span>
        </div>
      </div>
    </div>
  );
}
