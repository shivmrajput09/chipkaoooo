import { createSlice } from '@reduxjs/toolkit';

// ============================================================================
// Sample initial data (agar localStorage khali ho toh user ko category demo dikhe)
// ============================================================================
const samplePastes = [
  {
    _id: 'sample_gym_1',
    title: '5-Day Gym Workout Routine',
    category: 'Gym',
    content: 'Day 1: Chest & Triceps\n- Incline Dumbbell Press 4x10\n- Cable Crossovers 3x12\n\nDay 2: Back & Biceps\n- Lat Pulldown 4x10\n- Barbell Row 3x10\n\nDay 3: Legs & Core\n- Squats 4x8\n- Leg Press 3x12',
    userId: 'guest',
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'sample_food_2',
    title: 'Daily Meal & Protein Plan',
    category: 'Food',
    content: 'Breakfast: 4 boiled eggs + Oatmeal with almonds + Black coffee\nLunch: Brown rice + 200g Grilled Paneer/Chicken + Mixed Veggies\nSnack: Roasted chana + Green Tea\nDinner: Dal tadka + 2 rotis + Salad',
    userId: 'guest',
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'sample_shop_3',
    title: 'Dukaan / Kirana Saman List',
    category: 'Shopping',
    content: '1. Aashirvaad Aata - 10 kg\n2. Fortune Mustard Oil - 2 Litre\n3. Tata Salt - 1 Packet\n4. Red Label Tea - 500g\n5. Surf Excel - 1 kg\n6. Almonds & Dry fruits',
    userId: 'guest',
    createdAt: new Date().toISOString(),
  },
];

const loadPastesFromStorage = () => {
  try {
    const saved = localStorage.getItem('pastes');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error('Failed to parse pastes from localStorage', e);
  }
  return samplePastes;
};

const initialState = {
  pastes: loadPastesFromStorage(),
};

export const pasteSlice = createSlice({
  name: 'paste',
  initialState,
  reducers: {
    // ------------------------------------------------------------------------
    // 1. ADD NEW PASTE
    // ------------------------------------------------------------------------
    // Har paste me:
    // - _id: Unique identifier
    // - title: Paste ka naam (e.g. Gym Routine, Food Diet, Saman List)
    // - category: Category tag (e.g. 'Gym', 'Food', 'Shopping', etc.)
    // - content: Actual text
    // - userId: Kisme create kiya (User based saving ke liye ready!)
    // ------------------------------------------------------------------------
    addToPaste: (state, action) => {
      const paste = action.payload;
      // Naya paste hamesha list ke shuruat (top) me aayega
      state.pastes.unshift(paste);
      localStorage.setItem('pastes', JSON.stringify(state.pastes));
    },

    // ------------------------------------------------------------------------
    // 2. UPDATE EXISTING PASTE
    // ------------------------------------------------------------------------
    updatePaste: (state, action) => {
      const paste = action.payload;
      const index = state.pastes.findIndex(
        (item) => (item._id || item.id) === (paste._id || paste.id)
      );

      if (index >= 0) {
        state.pastes[index] = {
          ...state.pastes[index],
          ...paste,
          updatedAt: new Date().toISOString(),
        };
        localStorage.setItem('pastes', JSON.stringify(state.pastes));
      }
    },

    // ------------------------------------------------------------------------
    // 3. REMOVE PASTE
    // ------------------------------------------------------------------------
    removeFromPastes: (state, action) => {
      const pasteId = action.payload;
      state.pastes = state.pastes.filter(
        (item) => (item._id || item.id) !== pasteId
      );
      localStorage.setItem('pastes', JSON.stringify(state.pastes));
    },

    // ------------------------------------------------------------------------
    // 4. RESET / CLEAR ALL PASTES
    // ------------------------------------------------------------------------
    resetAllPastes: (state) => {
      state.pastes = [];
      localStorage.removeItem('pastes');
    },
  },
});

export const { addToPaste, updatePaste, removeFromPastes, resetAllPastes } =
  pasteSlice.actions;

export default pasteSlice.reducer;