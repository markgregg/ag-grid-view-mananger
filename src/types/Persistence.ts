import { View } from ".";

export interface Persistence {
  availableViews: () => View[];
  getActiveView: () => string | null;
  setActiveView: (view: View) => void;
  persist: (view: View) => void;
  delete: (view: View) => void;
}
