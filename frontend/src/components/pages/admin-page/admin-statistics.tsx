import { ABI } from "@/config/contract";
import { ETHEREUM_DATA } from "#/config/vars";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { KYCStatus } from "@/types/kyc";
import { useConnection, useReadContract } from "wagmi";

function AdminStatistics() {
    const { address } = useConnection();
    const { data: pendingApplications, isLoading: pendingLoading, isError: pendingError, error: pendingErrorMessage } =
        useReadContract({ abi: ABI, address: ETHEREUM_DATA.contractAddress, functionName: 'getAllKycByStatus', args: [KYCStatus.PENDING], account: address });
    const { data: acceptedApplications, isLoading: acceptedLoading, isError: acceptedError, error: acceptedErrorMessage } =
        useReadContract({ abi: ABI, address: ETHEREUM_DATA.contractAddress, functionName: 'getAllKycByStatus', args: [KYCStatus.APPROVED], account: address });
    const { data: rejectedApplications, isLoading: rejectedLoading, isError: rejectedError, error: rejectedErrorMessage } =
        useReadContract({ abi: ABI, address: ETHEREUM_DATA.contractAddress, functionName: 'getAllKycByStatus', args: [KYCStatus.REJECTED], account: address });

    return (
        <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-4 rounded-2xl bg-background px-4 py-5 sm:grid-cols-2 xl:grid-cols-4">
            {(pendingLoading || acceptedLoading || rejectedLoading) && <p>Loading statistics...</p>}
            {(pendingError || acceptedError || rejectedError) && <p>Error loading statistics: {pendingErrorMessage?.message || acceptedErrorMessage?.message || rejectedErrorMessage?.message}</p>}
            {(pendingApplications || acceptedApplications || rejectedApplications) && (
                <>
                    <Card className="w-full max-h-25 gap-1">
                        <CardHeader>
                            <CardTitle className="text-muted-foreground">Total Applications</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold">{(pendingApplications?.length || 0) + (acceptedApplications?.length || 0) + (rejectedApplications?.length || 0)}</p>
                        </CardContent>
                    </Card>
                    <Card className="w-full max-h-25 gap-1">
                        <CardHeader>
                            <CardTitle className="text-muted-foreground">Approved Applications</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold">{acceptedApplications?.length}</p>
                        </CardContent>
                    </Card>
                    <Card className="w-full max-h-25 gap-1">
                        <CardHeader>
                            <CardTitle className="text-muted-foreground">Rejected Applications</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold">{rejectedApplications?.length}</p>
                        </CardContent>
                    </Card>
                    <Card className="w-full max-h-25 gap-1">
                        <CardHeader>
                            <CardTitle className="text-muted-foreground">Pending Applications</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold">{pendingApplications?.length}</p>
                        </CardContent>
                    </Card>
                </>
            )}
        </div>
    );
}

export default AdminStatistics;