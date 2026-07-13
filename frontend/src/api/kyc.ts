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
  try {
    const response = await api.get<KYCApplication[]>(`/kyc`);
    return response.data;
  } catch (error) {
    console.error("Error fetching KYC applications:", error);
    throw error;
  }
}

export async function fetchKYCApplicationById(id: string) {
  try {
    const response = await api.get<KYCApplication>(`/kyc/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching KYC application with ID ${id}:`, error);
    throw error;
  }
}

export async function decideKYC(id: string, decision: 'approve' | 'reject') {
  try {
    const response = await api.put<KYCApplication>(`/kyc/${id}/${decision}`);
    return response.data;
  } catch (error) {
    console.error(`Error ${decision}ing KYC application with ID ${id}:`, error);
    throw error;
  }
}

export async function getKYCStatistics() {
  try {
    const response = await api.get<KYCStatistics>(`/kyc/statistics`);
    return response.data as KYCStatistics;
  } catch (error) {
    console.error("Error fetching KYC statistics:", error);
    throw error;
  }
}