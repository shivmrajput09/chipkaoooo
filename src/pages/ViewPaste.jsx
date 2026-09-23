import React from 'react'; // React library ko import kar rahe hain components banane ke liye
import { useSelector } from 'react-redux'; // Redux store se data (pastes ki list) nikalne ke liye hook import kiya
import { useParams, useNavigate } from 'react-router-dom'; // URL se ID padhne (useParams) aur page redirect karne (useNavigate) ke liye

function ViewPaste() {
  const { id } = useParams(); // URL ke path se dynamic 'id' parameter ko nikal rahe hain (jaise /pastes/123 se '123')
  const navigate = useNavigate(); // Doosre page par jane ke liye navigate function ko call kiya
  const allPastes = useSelector((state) => state.paste.pastes); // Redux store se saare pastes ki array ko fetch kar rahe hain

  // Saare pastes mein se us paste ko dhoondh rahe hain jiski ID URL wali ID se match kare
  const paste = allPastes.find((p) => (p._id || p.id) === id);

  return (
    // Outer container jo pure page par centering aur padding dega
    <div className="max-w-3xl mx-auto px-4 py-8 flex flex-col gap-6">
      
      {/* Back button jo click hone par user ko wapas /pastes page par bhej dega */}
      <button 
        onClick={() => navigate('/pastes')}
        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition text-sm self-start cursor-pointer"
      >
        ← Back to Pastes
      </button>

      {/* Main Box/Card Container jiske andar title aur content rahenge */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-md flex flex-col gap-4">
        
        {/* Title display karne ke liye input field, 'disabled' rakha hai taaki user edit na kar sake */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-600">Title</label>
          <input 
            type="text"
            value={paste?.title || ""} // Agar paste mil gaya toh uska title dikhao, warna khali string
            disabled
            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-800 font-medium cursor-not-allowed"
          />
        </div>

        {/* Content display karne ke liye textarea, 'disabled' rakha hai read-only format ke liye */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-600">Content</label>
          <textarea 
            value={paste?.content || ""} // Agar paste mil gaya toh uska content dikhao, warna khali string
            disabled
            rows={12}
            className="w-full p-4 border border-gray-300 rounded-lg bg-gray-50 text-gray-800 cursor-not-allowed resize-none"
          />
        </div>

      </div>
    </div>
  );
}

export default ViewPaste; // Is component ko export kar rahe hain taaki App.jsx mein import kiya ja sake