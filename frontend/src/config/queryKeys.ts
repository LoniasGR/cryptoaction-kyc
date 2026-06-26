export const queryKeys = {
  kycApplications: ['kycApplications'] as const,
  kycStatistics: ['kycStatistics'] as const,
  kycApplication: (applicationId: number) => ['kycApplication', applicationId] as const,
};