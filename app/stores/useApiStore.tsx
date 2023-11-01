import { create } from 'zustand'

interface ApiState {
  cmd: string
  uid: string | null
  sid: string | null
  boid: string
  processInstId: string
  taskInstId: string
  setCmd: (cmd: ApiState['cmd']) => void
  setUid: (uid: ApiState['uid']) => void
  setSid: (sid: ApiState['sid']) => void
  setBoid: (boid: ApiState['boid']) => void
  setProcessInstId: (processInstId: ApiState['processInstId']) => void
  setTaskInstId: (taskInstId: ApiState['taskInstId']) => void
}

export const useApiStore = create<ApiState>()((set) => ({
  cmd: 'com.awspaas.user.apps.app20231017165850',
  uid: localStorage.getItem('uid'),
  sid: localStorage.getItem('sid'),
  boid: '',
  processInstId: '',
  taskInstId: '',
  setCmd: (cmd) => set({ cmd }),
  setUid: (uid) => set({ uid }),
  setSid: (sid) => set({ sid }),
  setBoid: (boid) => set({ boid }),
  setProcessInstId: (processInstId) => set({ processInstId }),
  setTaskInstId: (taskInstId) => set({ taskInstId })
}))
