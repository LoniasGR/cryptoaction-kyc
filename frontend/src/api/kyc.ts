import type { KYCApplication, KYCApplicationSubmit, KYCStatistics } from "@/types/kyc";
import api from "./base";

export async function submitKYCApplication(value: KYCApplicationSubmit) {
  const response = await api.post<KYCApplicationSubmit>(
    "/kyc",
    value,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return response.data;
}

export async function fetchKYCApplications() {
  const response = await api.get<KYCApplication[]>(`/kyc`);
  return response.data;
}

export async function fetchKYCApplicationById(id: string) {
  const response = await api.get<KYCApplication>(`/kyc/${id}`);
  return response.data;
}

export async function decideKYC(id: string, decision: 'approve' | 'reject') {
  const response = await api.put<KYCApplication>(`/kyc/${id}/${decision}`);
  return response.data;
}

export async function getKYCStatistics() {
  const response = await api.get<KYCStatistics>(`/kyc/statistics`);
  return response.data as KYCStatistics;
}