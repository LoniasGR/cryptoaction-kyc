export const queryKeys = {
  kycApplications: ['kycApplications'] as const,
  kycStatistics: ['kycStatistics'] as const,
  kycApplication: (applicationId: string) => ['kycApplication', applicationId] as const,
};