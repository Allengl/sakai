
export interface Invoice {
  DOCUMENT_NUM: string,
  STATUS: string,
  OBJECT_NUM: string,
  DEPT_NAME: string,
  MATERIAL_NUM: string,
  OBJECT_NAME: string,
  BOOK_NAME: string,
  ID: string,
  TYPE: string,
  PLANER_NAME: string
}

export interface Wbs {
  ID: string,
  TOPIC_NUM: string,
  WBS_ELEMENT: string,
  MATERIAL_NUM: string,
  BOOK_NAME: string,
  CHIEF: string,
  PLANER_NUM: string,
  DEPT_NAME: string,
  DEPT_NUM: string,
  PLANER_NAME: string,
  TYPE: string,
}

interface Todo {
  id: string,
  title: string,
  target: string,
  targetRoleId: string,
  activityType: string,
  beginTime: string,
  remindTimes: string,
  processInstId: string,
}
