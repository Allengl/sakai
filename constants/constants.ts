// export const API_BASE_URL = 'http://localhost:8088/portal/r/jd';
export const API_BASE_URL = process.env.NODE_ENV === 'production' ? 'https://yhdev.hep.cn/portal/r/jd' : 'http://localhost:8088/portal/r/jd';


export const ASSETS_BASE_PATH = process.env.NODE_ENV === 'production' ? '/portal/apps/com.awspaas.user.apps.app20231017165850' : '';




