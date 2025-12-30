import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

export const workshopStore = create(
  devtools(
    persist(
      (set) => ({
        workshop: null,
        setWorkshop: (workshopData) => set({ workshop: workshopData }),
        clearWorkshop: () => set({ workshop: null }),
      }),
      {
        name: "workShopStore", // ✅ YAHI HONA CHAHIYE
      }
    )
  )
);
