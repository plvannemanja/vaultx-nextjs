import { useEffect, useMemo, useState } from 'react';
import { useCreateNFT } from '../../Context/CreateNFTContext';
import { BaseDialog } from '../../ui/BaseDialog';
import UserArtistModal from './UserArtistModal';
import { deleteUserArtist, getUserArtists } from '@/services/supplier';
import { IUserArtist } from '@/types';
import { useToast } from '@/hooks/use-toast';

const UserArtistSetting = () => {
  const { toast } = useToast();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(3); // Default to 3 items per page

  const [edit, setEdit] = useState(false);
  const [editUser, setEditUser] = useState(null);

  const { userArtists: data, setUserArtists: setData } = useCreateNFT();

  const totalPages = useMemo(() => {
    return Math.ceil(data.length / itemsPerPage);
  }, [data]);

  const currentItems = useMemo(
    () =>
      data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage),
    [data, currentPage, itemsPerPage],
  );

  // Handle page change
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const fetchUserArtists = async () => {
    const userArtists = await getUserArtists();
    setData(userArtists);
  };

  useEffect(() => {
    fetchUserArtists();
  }, []);

  // Handle items per page change
  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to page 1 after changing items per page
  };

  const handleDelete = async (item: IUserArtist) => {
    try {
      await deleteUserArtist({
        id: item._id,
      });

      fetchUserArtists();
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to delete artist',
        duration: 2000,
      });
    }
  };

  return (
    <div className="h-auto p-6 bg-dark-700 rounded-2xl flex flex-col justify-start items-start gap-3">
      <BaseDialog
        isOpen={edit}
        onClose={(val) => {
          setEdit(val);
        }}
        className="bg-[#111111] lg:min-w-[1400px] max-h-[80%] w-full overflow-y-auto overflow-x-hidden"
      >
        <UserArtistModal editUser={editUser} />
      </BaseDialog>
      <div className="w-full py-3 flex justify-between items-start gap-5">
        <div className="flex-grow text-white text-xl font-extrabold font-manrope">
          Add Properties Template
        </div>
        <div
          className="flex justify-start items-center gap-3 cursor-pointer"
          onClick={() => {
            setEditUser(null);
            setTimeout(() => {
              setEdit(true);
            }, 200);
          }}
        >
          <img src="/icons/add-new.svg" className="w-6 h-6" />
          <div className="text-white text-xl font-extrabold font-manrope">
            Add New template
          </div>
        </div>
      </div>

      <div className="w-full h-px opacity-10 bg-white"></div>

      <div className="w-full h-auto px-6 pb-6 bg-dark-800 rounded-xl flex flex-col justify-start items-start gap-8">
        <div className="w-full pt-6 flex justify-between items-start gap-3">
          <div className="w-[15%] text-white text-sm font-extrabold font-manrope">
            No.
          </div>
          <div className="w-[50%] text-white text-sm font-extrabold font-manrope">
            Artist Name
          </div>
          <div className="w-[35%] text-white text-sm font-extrabold font-manrope">
            Action
          </div>
        </div>

        <div className="w-full h-px opacity-10 bg-white"></div>

        {/* Table Rows */}
        {currentItems.map((item, index) => (
          <div
            key={itemsPerPage * (currentPage - 1) + index + 1}
            className="w-full flex justify-start items-center gap-3"
          >
            <div className="w-[15%] flex items-center gap-1">
              <div className="text-white text-sm font-normal font-['Azeret Mono'] leading-snug">
                {itemsPerPage * (currentPage - 1) + index + 1}
              </div>
            </div>
            <div className="w-[50%] flex items-center gap-4">
              <div className="text-white text-sm font-semibold font-['Azeret Mono'] leading-snug">
                {item.name}
              </div>
            </div>
            <div className="w-[35%] flex items-center gap-2">
              <div
                className="w-6 h-6 cursor-pointer"
                onClick={() => {
                  setEditUser(item);
                  setTimeout(() => {
                    setEdit(true);
                  }, 200);
                }}
              >
                <img src="/icons/edit.svg" className="w-6 h-6" />
              </div>
            </div>
            <div
              className="w-6 h-6 relative cursor-pointer"
              onClick={() => {
                handleDelete(item);
              }}
            >
              <img src="/icons/trash.svg" className="w-6 h-6" />
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center w-full pt-4 pb-3.5">
        <div className="flex items-center gap-2">
          {/* Dropdown for items per page */}
          <select
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
            className="bg-dark-700 text-white rounded-md p-2"
          >
            <option value="3">3</option>
            <option value="5">5</option>
            <option value="10">10</option>
          </select>
        </div>

        <div className="flex gap-2">
          {/* First and Previous */}
          <button
            onClick={() => handlePageChange(1)}
            className="w-8 h-8 p-2.5 bg-dark-700 border border-white/10 rounded-lg flex justify-center items-center"
          >
            «
          </button>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            className="w-8 h-8 p-2.5 bg-dark-700 border border-white/10 rounded-lg flex justify-center items-center"
          >
            ‹
          </button>

          {/* Current Page Number */}
          <div className="w-8 h-8 p-2.5 bg-gray-600 rounded-lg flex justify-center items-center">
            <div className="text-white text-sm font-semibold">
              {currentPage}
            </div>
          </div>

          {/* Next and Last */}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            className="w-8 h-8 p-2.5 bg-dark-700 border border-white/10 rounded-lg flex justify-center items-center"
          >
            ›
          </button>
          <button
            onClick={() => handlePageChange(totalPages)}
            className="w-8 h-8 p-2.5 bg-dark-700 border border-white/10 rounded-lg flex justify-center items-center"
          >
            »
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserArtistSetting;
