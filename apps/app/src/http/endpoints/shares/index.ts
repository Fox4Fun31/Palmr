import type {
  CreateShareResult,
  UpdateShareResult,
  ListUserSharesResult,
  GetShareResult,
  DeleteShareResult,
  UpdateSharePasswordResult,
  AddFilesResult,
  RemoveFilesResult,
  AddRecipientsResult,
  RemoveRecipientsResult,
  CreateShareAliasResult,
  GetShareByAliasResult,
  NotifyRecipientsResult,
  CreateShareBody,
  UpdateShareBody,
  GetShareParams,
  UpdateSharePasswordBody,
  AddFilesBody,
  RemoveFilesBody,
  AddRecipientsBody,
  RemoveRecipientsBody,
  CreateShareAliasBody,
  GetShareByAliasParams,
  NotifyRecipientsBody,
} from "./types";
import axiosInstance from "@/config/axios";
import type { AxiosRequestConfig } from "axios";

/**
 * Create a new share
 * @summary Create a new share
 */
export const createShare = <TData = CreateShareResult>(
  createShareBody: CreateShareBody,
  options?: AxiosRequestConfig
): Promise<TData> => {
  return axiosInstance.post(`/shares`, createShareBody, options);
};

/**
 * Update a share
 * @summary Update a share
 */
export const updateShare = <TData = UpdateShareResult>(
  updateShareBody: UpdateShareBody,
  options?: AxiosRequestConfig
): Promise<TData> => {
  return axiosInstance.put(`/shares`, updateShareBody, options);
};

/**
 * List all shares created by the authenticated user
 * @summary List all shares created by the authenticated user
 */
export const listUserShares = <TData = ListUserSharesResult>(options?: AxiosRequestConfig): Promise<TData> => {
  return axiosInstance.get(`/shares/me`, options);
};

/**
 * Get a share by ID
 * @summary Get a share by ID
 */
export const getShare = <TData = GetShareResult>(
  shareId: string,
  params?: GetShareParams,
  options?: AxiosRequestConfig
): Promise<TData> => {
  return axiosInstance.get(`/shares/${shareId}`, {
    ...options,
    params: { ...params, ...options?.params },
  });
};

/**
 * Delete a share
 * @summary Delete a share
 */
export const deleteShare = <TData = DeleteShareResult>(id: string, options?: AxiosRequestConfig): Promise<TData> => {
  return axiosInstance.delete(`/shares/${id}`, options);
};

/**
 * @summary Update share password
 */
export const updateSharePassword = <TData = UpdateSharePasswordResult>(
  shareId: string,
  updateSharePasswordBody: UpdateSharePasswordBody,
  options?: AxiosRequestConfig
): Promise<TData> => {
  return axiosInstance.patch(`/shares/${shareId}/password`, updateSharePasswordBody, options);
};

/**
 * @summary Add files to share
 */
export const addFiles = <TData = AddFilesResult>(
  shareId: string,
  addFilesBody: AddFilesBody,
  options?: AxiosRequestConfig
): Promise<TData> => {
  return axiosInstance.post(`/shares/${shareId}/files`, addFilesBody, options);
};

/**
 * @summary Remove files from share
 */
export const removeFiles = <TData = RemoveFilesResult>(
  shareId: string,
  removeFilesBody: RemoveFilesBody,
  options?: AxiosRequestConfig
): Promise<TData> => {
  return axiosInstance.delete(`/shares/${shareId}/files`, {
    data: removeFilesBody,
    ...options,
  });
};

/**
 * @summary Add recipients to a share
 */
export const addRecipients = <TData = AddRecipientsResult>(
  shareId: string,
  addRecipientsBody: AddRecipientsBody,
  options?: AxiosRequestConfig
): Promise<TData> => {
  return axiosInstance.post(`/shares/${shareId}/recipients`, addRecipientsBody, options);
};

/**
 * Remove recipients from a share
 * @summary Remove recipients from a share
 */
export const removeRecipients = <TData = RemoveRecipientsResult>(
  shareId: string,
  removeRecipientsBody: RemoveRecipientsBody,
  options?: AxiosRequestConfig
): Promise<TData> => {
  return axiosInstance.delete(`/shares/${shareId}/recipients`, {
    data: removeRecipientsBody,
    ...options,
  });
};

/**
 * @summary Create or update share alias
 */
export const createShareAlias = <TData = CreateShareAliasResult>(
  shareId: string,
  createShareAliasBody: CreateShareAliasBody,
  options?: AxiosRequestConfig
): Promise<TData> => {
  return axiosInstance.post(`/shares/${shareId}/alias`, createShareAliasBody, options);
};

/**
 * @summary Get share by alias
 */
export const getShareByAlias = <TData = GetShareByAliasResult>(
  alias: string,
  params?: GetShareByAliasParams,
  options?: AxiosRequestConfig
): Promise<TData> => {
  return axiosInstance.get(`/shares/alias/${alias}`, {
    ...options,
    params: { ...params, ...options?.params },
  });
};

/**
 * Send email notification with share link to all recipients
 * @summary Send email notification to share recipients
 */
export const notifyRecipients = <TData = NotifyRecipientsResult>(
  shareId: string,
  notifyRecipientsBody: NotifyRecipientsBody,
  options?: AxiosRequestConfig
): Promise<TData> => {
  return axiosInstance.post(`/shares/${shareId}/notify`, notifyRecipientsBody, options);
};
