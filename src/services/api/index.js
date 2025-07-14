import * as authApi from "./auth";
import * as coaApi from "./coa";
import * as customerApi from "./customer";
import * as planningApi from "./planning";
import * as printApi from "./print";
import * as productApi from "./product";
import * as productStandardApi from "./productStandard";
import * as userApi from "./user";
import * as trendApi from "./trend";
import * as rolesApi from "./roles";
import * as dashboardApi from "./dashboard";
import * as reportApi from "./report";
import {
  putAccessToken,
  getAccessToken,
  putRefreshToken,
  getRefreshToken,
  clearAccessToken,
} from "./client";

const api = {
  ...authApi,
  ...coaApi,
  ...customerApi,
  ...planningApi,
  ...printApi,
  ...productApi,
  ...productStandardApi,
  ...userApi,
  ...trendApi,
  ...rolesApi,
  ...dashboardApi,
  ...reportApi,
  putAccessToken,
  getAccessToken,
  putRefreshToken,
  getRefreshToken,
  clearAccessToken,
};

export default api;
