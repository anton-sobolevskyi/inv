import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type ModalState = { kind: 'deleteOrder'; orderId: string; title: string };

export interface UiState {
  search: string;
  selectedOrderId: string | null;
  productType: string | null;
  modal: ModalState | null;
}

export interface PersistedUi {
  productType: string | null;
}

const initialState: UiState = { search: '', selectedOrderId: null, productType: null, modal: null };

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setSearch(state, action: PayloadAction<string>) {
      state.search = action.payload;
    },
    selectOrder(state, action: PayloadAction<string | null>) {
      state.selectedOrderId = action.payload;
    },
    setProductType(state, action: PayloadAction<string | null>) {
      state.productType = action.payload;
    },
    openModal(state, action: PayloadAction<ModalState>) {
      state.modal = action.payload;
    },
    closeModal(state) {
      state.modal = null;
    },
    hydrateUi(state, action: PayloadAction<Partial<PersistedUi>>) {
      if (action.payload.productType !== undefined) state.productType = action.payload.productType;
    },
  },
});

export const { setSearch, selectOrder, setProductType, openModal, closeModal, hydrateUi } =
  uiSlice.actions;
