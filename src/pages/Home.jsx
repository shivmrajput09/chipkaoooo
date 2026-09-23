import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addToPaste, updatePaste } from '../redux/pasteSlice';
import { useSearchParams } from 'react-router-dom';

function Home() {
  const [title, setTitle] = useState('');
  const [value, setValue] = useState('');
  
  const [searchParams, setSearchParams] = useSearchParams();
  const pasteId = searchParams.get('pasteId');
  
  const dispatch = useDispatch();
  const allPastes = useSelector((state) => state.paste.pastes);

  useEffect(() => {
    if (pasteId) {
      const paste = allPastes.find((p) => (p._id || p.id) === pasteId);
      if (paste) {
        setTitle(paste.title);
        setValue(paste.content);
      }
    }
  }, [pasteId, allPastes]);

  function createPaste(e) {
    const paste = {
      title: title,
      content: value,
      _id: pasteId || Date.now().toString(36),
      createdAt: new Date().toISOString(),
    };

    if (pasteId) {
      dispatch(updatePaste(paste));
    } else {
      dispatch(addToPaste(paste));
    }
    
    setTitle('');
    setValue('');
    setSearchParams({});
  }

  return (
    <div style={{ padding: '21px', maxWidth: '600px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '15px' }}> 
      <input 
        type="text"
        placeholder="Enter title here..."
        value={title} 
        onChange={(e) => setTitle(e.target.value)}
        style={{ padding: '8px', fontSize: '16px' }}
      />

      <textarea 
        placeholder="Enter content here..."
        value={value} 
        onChange={(e) => setValue(e.target.value)}
        rows={8}
        style={{ padding: '8px', fontSize: '16px' }}
      />

      <button 
        onClick={createPaste}
        style={{ padding: '10px', backgroundColor: '#4f46e5', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px' }}
      >
        {pasteId ? "Update Paste" : "Save Paste"}
      </button> 
    </div>
  );
}

export default Home;