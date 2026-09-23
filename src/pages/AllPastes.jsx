import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromPastes } from '../redux/pasteSlice';
import { useNavigate } from 'react-router-dom';

function AllPastes() {
  const pastes = useSelector((state) => state.paste.pastes);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const filterData = pastes.filter((paste) => {
    return paste.title.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      <input 
        type="text"
        placeholder="Search Here...."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-700"
      />

      <div className="flex flex-col gap-4 mt-6">  
        {filterData.length > 0 ? (
          filterData.map((paste) => {
            const pasteId = paste?._id || paste?.id;
            return (
              <div key={pasteId} className="bg-white border border-gray-200 rounded-xl p-6 shadow-md hover:shadow-lg transition flex flex-col gap-3 relative"> 
                <h3 className="text-xl font-bold">{paste?.title}</h3>
                <p className="text-gray-600">{paste?.content}</p>

                <div className="flex gap-2 items-center">
                  <button
                    onClick={() => navigate(`/?pasteId=${pasteId}`)}
                    className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => dispatch(removeFromPastes(pasteId))}
                    className="px-3 py-1.5 bg-red-500 text-white rounded-lg text-xs"
                  >
                    Delete
                  </button>

                  <button
                    onClick={() => navigate(`/pastes/${pasteId}`)}
                    className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded-lg text-xs"
                  >
                    View
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-center text-gray-500 text-lg py-10">No Paste Found!</p>
        )}
      </div>
    </div>
  );
}

export default AllPastes;