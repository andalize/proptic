import { IUnknown } from '@/interface/unknown';
import { UnknownFunction } from '@/interface/unknown-fuction';
import { isEmpty } from 'lodash';
import { create } from 'zustand';

interface defaultMeta {
  method: string;
  path: string;
}

export interface fullMetaType extends defaultMeta {
  total: number;
  lastPage: string;
  currentPage: string;
  perPage: string;
  page: string;
  prev: number | null;
  next: number | null;
}

interface MetaStore {
  meta: fullMetaType | IUnknown;
  setData: (data: fullMetaType) => void;
  reset: () => void;
  fetchNewMeta?: (callback: UnknownFunction) => void;
}

export const useMetaStore = create<MetaStore>((set) => ({
  meta: {},
  setData: (data: fullMetaType) => {
    if (!isEmpty(data)) set({ meta: data });
  },
  reset: () => {
    set({ meta: {} });
  },
  fetchNewMeta: (callback) => {
    callback?.();
  },
}));
