import { create } from 'zustand'
import { Invoice } from '../../types/data'

interface DataState {
  invoiceData: Invoice[],
  setInvoiceData: (invoiceData: DataState['invoiceData']) => void
}

export const useDataStore = create<DataState>()((set) => ({
  invoiceData: [],
  setInvoiceData: (invoiceData) => set({ invoiceData }),
}))
