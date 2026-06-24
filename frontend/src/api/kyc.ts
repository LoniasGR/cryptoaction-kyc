import type { KYCApplication } from '@/types/kyc';
import api from './base';

export async function submitKycApplication(value: KYCApplication) {
    try {
        const response = await api.post<KYCApplication>(`/kyc`, JSON.stringify(value));
        return response.data;
    } catch (error) {
        console.error('Error submitting KYC application:', error);
        throw error;
    }
}

export async function fetchKycApplications() {
    try {
        const response = await api.get<KYCApplication[]>(`/kyc/`);
        return response.data;
    } catch (error) {
        console.error('Error fetching KYC applications:', error);
        throw error;
    }
}