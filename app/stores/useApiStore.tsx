import { create } from 'zustand'

interface ApiState {
  cmd: string
  uid: string
  sid: string
  setCmd: (cmd: ApiState['cmd']) => void
  setUid: (uid: ApiState['uid']) => void
  setSid: (sid: ApiState['sid']) => void
}

export const useApiStore = create<ApiState>()((set) => ({
  cmd: 'com.awspaas.user.apps.app20231017165850',
  uid: '',
  sid: '',
  setCmd: (cmd) => set({ cmd }),
  setUid: (uid) => set({ uid }),
  setSid: (sid) => set({ sid }),
}))
