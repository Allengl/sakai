import { create } from 'zustand'
import { Invoice, Todo, Wbs } from '../../types/data'

interface DataState {
  invoiceData: Invoice[],
  wbsData: Wbs[],
  todoData: Todo[],
  setInvoiceData: (invoiceData: DataState['invoiceData']) => void
  setWbsData: (wbsData: DataState['wbsData']) => void
  setTodoData: (todoData: DataState['todoData']) => void
}

export const useDataStore = create<DataState>()((set) => ({
  invoiceData: [],
  wbsData: [],
  todoData: [],
  setInvoiceData: (invoiceData) => set({ invoiceData }),
  setWbsData: (wbsData) => set({ wbsData }),
  setTodoData: (todoData) => set({ todoData })

}))
