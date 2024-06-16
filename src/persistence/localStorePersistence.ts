import { Persistence, View } from '..';

export const localStoragePersistence = (id: string): Persistence => {
  const viewNames = (): string[] => {
    const viewsNames = window.localStorage.getItem(`${id}:VIEWS`);
    return viewsNames?.split(',') ?? [];
  };

  return {
    availableViews: () =>
      viewNames()
        .map((vn) => {
          const viewString = window.localStorage.getItem(`${id}:VIEW:${vn}`);
          return viewString != null ? (JSON.parse(viewString) as View) : null;
        })
        .filter((v) => v != null) as View[],
    getActiveView: () => window.localStorage.getItem(`${id}:ACTIVE`),
    setActiveView: (view: View) =>
      window.localStorage.setItem(`${id}:ACTIVE`, view.id),
    persist: (view: View) => {
      window.localStorage.setItem(
        `${id}:VIEW:${view.id}`,
        JSON.stringify(view),
      );
      const views = viewNames();
      if (!views.includes(view.id)) {
        window.localStorage.setItem(
          `${id}:VIEWS`,
          [...viewNames(), view.id].join(','),
        );
      }
    },
    delete: (view: View) => {
      window.localStorage.removeItem(`${id}:VIEW:${view.id}`);
      window.localStorage.setItem(
        `${id}:VIEWS`,
        viewNames()
          .filter((vm) => vm !== view.id)
          .join(','),
      );
    },
  };
};
