import React, { useEffect, useState } from 'react';
import { getProperties, upsertProperty } from '@/services/supplier';
import { useCreateNFT } from '../../Context/CreateNFTContext';
import PropertiesInfo from '../Properties';

const defaultAttributes = [
  { type: 'Type', value: 'Write it here' },
  { type: 'Medium', value: 'Write it here' },
  { type: 'Support', value: 'Write it here' },
  { type: 'Dimensions (cm)', value: 'Write it here' },
  { type: 'Signature', value: 'Write it here' },
  { type: 'Authentication', value: 'Write it here' },
];

export default function PropertiesTemplate({ select }) {
  const { advancedDetails, setAdvancedDetails } = useCreateNFT();
  const [data, setData] = useState([]);
  const [isModalOpenTemplate, setIsModalOpenTemplate] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState({
    _id: '',
    name: 'Basic Template',
    attributes: defaultAttributes,
  });
  const [editableProperties, setEditableProperties] =
    useState(defaultAttributes);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    const response = await getProperties();
    if (response.length > 0) {
      setData(response);
    }
  };

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    setEditableProperties(template.attributes);
    setAdvancedDetails({
      ...advancedDetails,
      propertyTemplateId: template._id || null,
      attributes: template.attributes,
    });
    if (select) {
      select(template);
    }
  };

  const handleTemplateAdd = (newTemplate) => {
    setData([...data, newTemplate]);
  };

  const handleTemplateEdit = (editedTemplate) => {
    setData(
      data.map((template) =>
        template._id === editedTemplate._id ? editedTemplate : template,
      ),
    );
    if (selectedTemplate && selectedTemplate._id === editedTemplate._id) {
      handleTemplateSelect(editedTemplate);
    }
  };

  const handlePropertyChange = (index, field, value) => {
    const updatedProperties = editableProperties.map((prop, i) =>
      i === index ? { ...prop, [field]: value } : prop,
    );
    setEditableProperties(updatedProperties);
    setAdvancedDetails({
      ...advancedDetails,
      attributes: updatedProperties,
    });
  };

  const handleAddProperty = () => {
    const newProperty = { type: 'New Property', value: 'Enter value' };
    setEditableProperties([...editableProperties, newProperty]);
    setAdvancedDetails({
      ...advancedDetails,
      attributes: [...editableProperties, newProperty],
    });
  };

  const handleRemoveProperty = (index) => {
    const updatedProperties = editableProperties.filter((_, i) => i !== index);
    setEditableProperties(updatedProperties);
    setAdvancedDetails({
      ...advancedDetails,
      attributes: updatedProperties,
    });
  };

  return (
    <div className="bg-template-gradient p-4 gap-y-2 rounded-lg flex flex-col">
      <p>Properties</p>
      <span className="text-gray-400 azeret-mono-font">
        Textual Traits that show up as rectangle.
      </span>

      <div className="flex flex-col gap-y-3 mt-4">
        <p>Select Properties Template</p>

        <div className="flex flex-wrap gap-5">
          <div
            onClick={() =>
              handleTemplateSelect({
                name: 'Basic Template',
                attributes: defaultAttributes,
              })
            }
            className={`w-[18rem] h-[15rem] bg-[#232323] border-2 flex justify-center items-center rounded-md relative ${
              selectedTemplate.name === 'Basic Template'
                ? 'border-neon'
                : 'border-none'
            }`}
          >
            <p>Basic Template</p>
          </div>

          {data.map((item, index) => (
            <div
              key={index}
              onClick={() => handleTemplateSelect(item)}
              className={`w-[18rem] h-[15rem] bg-[#232323] border-2 flex justify-center items-center rounded-md relative ${
                selectedTemplate._id === item._id
                  ? 'border-neon'
                  : 'border-none'
              }`}
            >
              <p>{item.name}</p>
              <button
                className="absolute bottom-2 right-2 text-[#DDF247] border border-[#ffffff20] px-[10px] rounded py-1 text-[14px]"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsModalOpenTemplate(true);
                }}
              >
                Edit
              </button>
            </div>
          ))}

          <div
            onClick={() => setIsModalOpenTemplate(true)}
            className="w-[18rem] h-[15rem] bg-[#232323] border-2 flex flex-col justify-center items-center rounded-md relative"
          >
            <div className="w-12 h-12 rounded-full bg-[#111] border border-[#ffffff38] flex items-center justify-center">
              <img src="/icons/plus.svg" />
            </div>
            <p className="text-[#828282]">Add new template</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 my-5">
          {editableProperties.map((item, index) => (
            <div
              key={index}
              className="flex justify-center relative py-3 gap-y-1 flex-col w-[10rem] border border-[#ffffff12] rounded-md"
            >
              <input
                type="text"
                className="text-white text-center w-[80%] rounded-md bg-transparent mx-auto"
                value={item.type}
                onChange={(e) =>
                  handlePropertyChange(index, 'type', e.target.value)
                }
              />
              <input
                type="text"
                className="text-[#888] text-center w-[80%] rounded-md bg-transparent mx-auto"
                value={item.value}
                onChange={(e) =>
                  handlePropertyChange(index, 'value', e.target.value)
                }
              />
              <div
                className="absolute top-2 right-2 cursor-pointer w-[26px] h-[26px] flex items-center justify-center rounded-full border border-[#ffffff12]"
                onClick={() => handleRemoveProperty(index)}
              >
                <img src="/icons/trash.svg" className="w-4 h-4" />
              </div>
            </div>
          ))}
          <div
            className="flex cursor-pointer justify-center relative py-3 gap-y-1 items-center w-[10rem] border-2 border-[#DDF247] rounded-md"
            onClick={handleAddProperty}
          >
            <img src="/icons/add-new.svg" className="w-10 h-10" />
            <p className="text-center text-sm text-[#DDF247]">Add New</p>
          </div>
        </div>

        <div className="flex gap-x-3 item-center">
          <img src="/icons/dot.svg" className="w-5 h-5" />
          <span>
            You can freely change properties values by clicking on the title and
            content.
          </span>
        </div>
      </div>

      {isModalOpenTemplate && (
        <PropertiesInfo
          close={() => setIsModalOpenTemplate(false)}
          onTemplateAdd={handleTemplateAdd}
          onTemplateEdit={handleTemplateEdit}
        />
      )}
    </div>
  );
}
