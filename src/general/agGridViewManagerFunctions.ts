import { Persistence, View } from "@/types"

export const fetchViews = (persistence: Persistence): View[] => {
  try {
    return persistence.availableViews();
  } catch (e) {
    console.log(e);
    return [];
  }
}

export const fetchActiveView = (persistence: Persistence): string | null => {
  try {
    return persistence.getActiveView();
  } catch (e) {
    console.log(e);
    return null;
  }
}

export const updateActiveView = (persistence: Persistence, view: View) => {
  try {
    persistence.setActiveView(view);
  } catch (e) {
    console.log(e);
    return null;
  }
}

export const persistView = (persistence: Persistence, view: View) => {
  try {
    persistence.persist(view);
  } catch (e) {
    console.log(e);
    return null;
  }
}


export const deleteView = (persistence: Persistence, view: View) => {
  try {
    persistence.delete(view);
  } catch (e) {
    console.log(e);
    return null;
  }
}