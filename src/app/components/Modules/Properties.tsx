import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { upsertProperty } from '@/services/supplier';
import { useState } from 'react';
import BaseButton from '../ui/BaseButton';
import { BaseDialog } from '../ui/BaseDialog';

export default function PropertiesInfo({ close, onTemplateAdd, isOpen }) {
  const { toast } = useToast();
  const [property, setProperty] = useState({
    id: null,
    name: '',
    attributes: [
      { type: 'Length', value: '150cm' },
      { type: 'Height', value: '5cm' },
      { type: 'Width', value: '150cm' },
      { type: 'Weight', value: '5kg' },
    ],
  });

  const handleSave = async () => {
    try {
      const response = await upsertProperty({
        id: property.id,
        name: property.name,
        attributes: property.attributes,
      });

      if (response) {
        toast({
          title: 'Properties Template',
          description: 'Saved successfully',
          duration: 2000,
        });

        onTemplateAdd();

        close();
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save template',
        duration: 2000,
      });
    }
  };

  const handleCancel = () => {
    setProperty({
      id: null,
      name: '',
      attributes: [
        { type: 'Length', value: '150cm' },
        { type: 'Height', value: '5cm' },
        { type: 'Width', value: '150cm' },
        { type: 'Weight', value: '5kg' },
      ],
    });
    close();
  };

  const addNewProp = () => {
    setProperty({
      ...property,
      attributes: [
        ...property.attributes,
        { type: 'New Property', value: 'Enter value' },
      ],
    });
  };

  const updateProp = (index, field, value) => {
    const updatedAttributes = [...property.attributes];
    updatedAttributes[index][field] = value;
    setProperty({ ...property, attributes: updatedAttributes });
  };

  const removeProp = (index) => {
    const updatedAttributes = property.attributes.filter((_, i) => i !== index);
    setProperty({ ...property, attributes: updatedAttributes });
  };

  return (
    <BaseDialog
      isOpen={isOpen}
      onClose={handleCancel}
      className="bg-dark max-h-[80%] overflow-y-auto overflow-x-hidden"
    >
      <div className="flex flex-col gap-y-5">
        <div className="flex flex-col gap-y-4">
          <Label className="text-lg font-medium">
            Properties Template Name
          </Label>
          <Input
            value={property.name}
            onChange={(e) => setProperty({ ...property, name: e.target.value })}
            className="w-full border-none bg-[#161616]"
            type="text"
            placeholder="Enter your properties template name"
          />
        </div>

        <div className="flex flex-col gap-y-4 my-6">
          <p className="text-xl font-medium text-white">Properties value</p>
          <div className="flex gap-4 flex-wrap">
            {property.attributes.map((item, index) => (
              <div
                key={index}
                className="flex justify-center relative py-3 gap-y-1 flex-col w-[10rem] border-2 border-white rounded-md"
              >
                <input
                  type="text"
                  className="text-white text-center w-[65%] rounded-md bg-transparent mx-auto"
                  value={item.type}
                  onChange={(e) => updateProp(index, 'type', e.target.value)}
                />
                <input
                  type="text"
                  className="text-white text-center w-[65%] rounded-md bg-transparent mx-auto"
                  value={item.value}
                  onChange={(e) => updateProp(index, 'value', e.target.value)}
                />
                <div
                  className="absolute top-2 right-2 cursor-pointer"
                  onClick={() => removeProp(index)}
                >
                  <img src="/icons/trash.svg" className="w-4 h-4" />
                </div>
              </div>
            ))}
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
            onClick={handleCancel}
          />
          <BaseButton title="Save" variant="primary" onClick={handleSave} />
        </div>
      </div>
    </BaseDialog>
  );
}
