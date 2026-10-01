import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "#/components/ui/card";
import { ABI } from "#/config/contract";
import { ETHEREUM_DATA } from "#/config/vars";
import { KYCStatus } from "#/types/kyc";
import { generateFileUrl } from "@/api/file";
import { fetchMyApplication } from "@/api/kyc";
import { useAuth } from "@/auth/authProvider";
import { ApplicationStatusBadge } from "@/components/application-status-badge";
import { Button } from "@/components/ui/button";
import { queryKeys } from "@/config/queryKeys";
import { useQuery } from "@tanstack/react-query";
import { useConnection, useReadContract } from "wagmi";


export function UserProfile() {
    const auth = useAuth();
    const { address } = useConnection();


    const { data } = useQuery({
        queryKey: queryKeys.kycApplication(auth.userInfo!.sub),
        queryFn: () => fetchMyApplication(),
    });
    const { data: kycApplication, isLoading: kycLoading, isError: isKycError, error: kycErrorMessage } =
        useReadContract({ abi: ABI, address: ETHEREUM_DATA.contractAddress, functionName: 'getKYCApplication', args: [address!], account: address! });

    if (isKycError) {
        console.error(kycErrorMessage);
        return (
            <Card className="min-w-xs max-w-md lg:min-w-lg sm:min-w-sm">
                <CardContent>
                    <p className="text-center text-red-500">Error loading KYC application: {kycErrorMessage?.message}</p>
                </CardContent>
            </Card>
        );
    }

    if (kycLoading) {
        return (
            <Card className="min-w-xs max-w-md lg:min-w-lg sm:min-w-sm">
                <CardContent>
                    <p className="text-center text-blue-500">Loading KYC application...</p>
                </CardContent>
            </Card>
        );
    }

    if (kycApplication?.digest !== `0x${data?.digest}`) {
        console.warn("KYC application digest does not match local data digest.");
        return (
            <div className="bg-muted h-[94vh] flex items-start justify-center">
                <div className="pt-10 justify-center flex sm:flex-col md:flex-row gap-4">
                    <Card className="min-w-xs max-w-md lg:min-w-lg sm:min-w-sm">
                        <CardHeader>
                            <CardTitle className="text-center text-yellow-500">KYC application digest does not match local data digest.</CardTitle>
                        </CardHeader>
                        <CardContent>
                            This means your data has been modified!
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }
    return (
        <div className="bg-muted h-[94vh] flex items-start justify-center">
            <div className="pt-10 justify-center flex sm:flex-col md:flex-row gap-4">
                <Card className="min-w-xs max-w-md lg:min-w-lg sm:min-w-sm">
                    <CardAction className="pl-5 pt-2">
                        <ApplicationStatusBadge status={kycApplication?.status} />
                    </CardAction>
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl">My Application</CardTitle>
                        <p><span className="text-balance">Application ID:</span> {data?.id}</p>
                        <CardDescription className="text-base mt-5 text-foreground">
                            <p><span className="font-semibold">Name:</span> {data!.fullName}</p>
                            <p><span className="font-semibold">Email:</span> {data!.email}</p>
                            <p><span className="font-semibold">Submitted on:</span> {new Date(data!.submittedAt).toLocaleDateString()} {new Date(data!.submittedAt).toLocaleTimeString()}</p>
                            {data?.status === KYCStatus.APPROVED && (
                                <p><span className="font-semibold">Expiring at:</span> {data!.expiringAt && new Date(data!.expiringAt).toLocaleDateString()} {data!.expiringAt && new Date(data!.expiringAt).toLocaleTimeString()}</p>
                            )}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="mt-5 flex flex-col gap-2">
                        <p className="font-heading text-base font-medium pb-2">Documents</p>
                        <Button variant="default" className="w-full"
                            onClick={() => window.open(generateFileUrl(data!.idFileHash), '_blank')}>View ID File</Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}