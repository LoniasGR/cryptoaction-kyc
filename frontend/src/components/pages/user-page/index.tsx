import { Button } from "#/components/ui/button";
import { HttpError } from "@/api/base";
import { fetchMyApplication } from "@/api/kyc";
import { useAuth } from "@/auth/authProvider";
import { Card } from "@/components/ui/card";
import { ABI } from "@/config/contract";
import { queryKeys } from "@/config/queryKeys";
import { ETHEREUM_DATA } from "@/config/vars";
import { useQuery } from "@tanstack/react-query";
import { useConnection, useReadContract } from "wagmi";
import { LoadingPage } from "../loading-page";
import { UserApplication } from "./user-application";
import { UserProfile } from "./user-profile";

export function UserPage() {
    const auth = useAuth();
    const { address } = useConnection();

    const { data: hasKYCApplication, isLoading: kycLoading, isError: isKycError, error: kycErrorMessage } =
        useReadContract({ abi: ABI, address: ETHEREUM_DATA.contractAddress, functionName: 'haveApplied', account: address });

    const query = useQuery({
        queryKey: queryKeys.kycApplication(auth.userInfo!.sub),
        queryFn: () => fetchMyApplication(),
        retry: false,
    });
    if (query.isLoading || kycLoading) {
        return (<LoadingPage />);
    }
    if (query.isError && query.error instanceof HttpError && query.error?.status === 404 && !hasKYCApplication) {
        return (
            <UserApplication />
        );
    }
    if (query.isError || isKycError) {
        return (
            <div className="flex items-center justify-center align-center">
                <Card className="p-4 mt-10 w-sm">
                    <p>An error occurred while fetching your KYC application.</p>
                    {query.isError && `Error fetching your application data: ${query.error?.message}`}
                    {isKycError && `Error fetching the on-chain KYC application: ${JSON.stringify(kycErrorMessage)}`}
                    <Button onClick={() => window.location.reload()}>Retry</Button>
                </Card>
            </div>
        );
    }
    if ((!hasKYCApplication && query.data) || (hasKYCApplication && !query.data)) {
        return (
            <>
                <p>Data inconsistency detected between on-chain and off-chain KYC application.</p>
                <p>{`On-chain hasKYCApplication: ${hasKYCApplication}, Off-chain query data: ${JSON.stringify(query.data)}`}</p>
            </>
        );
    }
    return (
        <UserProfile />
    );
}