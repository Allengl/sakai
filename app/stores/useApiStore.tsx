import { create } from 'zustand';

interface ApiState {
  cmd: string;
  uid: string;
  sid: string;
  boid: string;
  processInstId: string;
  taskInstId: string;
}

type SetApiState = {
  setCmd: (cmd: ApiState['cmd']) => void;
  setUid: (uid: ApiState['uid']) => void;
  setSid: (sid: ApiState['sid']) => void;
  setBoid: (boid: ApiState['boid']) => void;
  setProcessInstId: (processInstId: ApiState['processInstId']) => void;
  setTaskInstId: (taskInstId: ApiState['taskInstId']) => void;
};

export const useApiStore = create<ApiState & SetApiState>((set) => ({
  cmd: 'com.awspaas.user.apps.app20231017165850',
  uid: '',
  sid: '',
  boid: '',
  processInstId: '',
  taskInstId: '',
  setCmd: (cmd) => set((state) => ({ ...state, cmd })),
  setUid: (uid) => set((state) => ({ ...state, uid })),
  setSid: (sid) => set((state) => ({ ...state, sid })),
  setBoid: (boid) => set((state) => ({ ...state, boid })),
  setProcessInstId: (processInstId) => set((state) => ({ ...state, processInstId })),
  setTaskInstId: (taskInstId) => set((state) => ({ ...state, taskInstId })),
}));


const storedUid = typeof window !== "undefined" ? window.localStorage.getItem('uid') : false
if (storedUid) {
  useApiStore.setState({ uid: storedUid });
}
const storedSid = typeof window !== "undefined" ? window.localStorage.getItem('sid') : false
if (storedSid) {
  useApiStore.setState({ sid: storedSid });
}
const storedBoid = typeof window !== "undefined" ? window.localStorage.getItem('boid') : false
if (storedBoid) {
  useApiStore.setState({ boid: storedBoid });
}
const storedProcessInstId = typeof window !== "undefined" ? window.localStorage.getItem('processInstId') : false
if (storedProcessInstId) {
  useApiStore.setState({ processInstId: storedProcessInstId });
}
const storedTaskInstId = typeof window !== "undefined" ? window.localStorage.getItem('taskInstId') : false
if (storedTaskInstId) {
  useApiStore.setState({ taskInstId: storedTaskInstId });
}


useApiStore.subscribe(
  (state) => {
    localStorage.setItem('uid', state.uid);
  },
);

useApiStore.subscribe(
  (state) => {
    localStorage.setItem('sid', state.sid);
  },
);

useApiStore.subscribe(
  (state) => {
    localStorage.setItem('boid', state.boid);
  },
);
useApiStore.subscribe(
  (state) => {
    localStorage.setItem('processInstId', state.processInstId);
  },
);
useApiStore.subscribe(
  (state) => {
    localStorage.setItem('taskInstId', state.taskInstId);
  },
);
