'use client';

import { useEffect, useState } from 'react';
import { collectionServices } from '@/services/supplier';
import CreateCuration from '@/app/components/Modules/CreateCuration';
import { useRouter } from 'next/navigation';

export default function Page({ params }: { params: { slug: string } }) {
  const router = useRouter();

  const [formData, setFormData] = useState(null);

  const fetchData = async () => {
    const collection =
      await collectionServices.getCollectionById(params.slug);

    if (collection.data.collection) {
      if (collection.data.collection._id === '') {
        router.push('/');
        return;
      }

      setFormData(collection.data.collection);
    }
  };

  useEffect(() => {
    if (!formData) {
      fetchData();
    }
  }, [params.slug]);
  return (
    <div>
      <CreateCuration editMode={formData} />
    </div>
  );
}
