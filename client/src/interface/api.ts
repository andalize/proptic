import { ReactNode } from 'react';

import { IUnknown } from './unknown';

export interface baseApiType {
  queryKey: string;
  endpoint: string;
  Entity?: string;
  showToast?: boolean;
  showErrorToast?: boolean;
  onError?: (error: IUnknown) => void;
}

export interface FetchQueryType extends baseApiType {
  search?: string;
  filter?: {
    key: string;
    value: string;
  };
}
export interface updateApiType extends baseApiType {
  skipIdPrefix?: boolean;
  isPut?: boolean;
}

export interface createPayloadType {
  data: IUnknown;
  onSuccess?: {
    callback?: (data?: IUnknown) => void;
    message?: string | ReactNode;
  };
  onError?: {
    callback?: (data?: IUnknown) => void;
  };
}
export interface deletePayloadType {
  id: string;
  onSuccess?: {
    callback?: () => void;
    message?: string | ReactNode;
  };
}

export interface updatePayloadType extends createPayloadType {
  id?: string;
}

export interface deleteMutationType extends baseApiType {
  id: string;
}
