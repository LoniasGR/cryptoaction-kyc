import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/config/queryKeys";
import { getKYCStatistics } from "@/api/kyc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
function AdminStatistics() {
    const { data, isLoading, error } = useQuery({
        queryKey: queryKeys.kycStatistics,
        queryFn: getKYCStatistics,
    });

    return (
        <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-4 rounded-2xl bg-background px-4 py-5 sm:grid-cols-2 xl:grid-cols-4">
            {isLoading && <p>Loading statistics...</p>}
            {error && <p>Error loading statistics: {error.message}</p>}
            {data && (
                <>
                    <Card className="w-full max-h-25 gap-1">
                        <CardHeader>
                            <CardTitle className="text-muted-foreground">Total Applications</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold">{data.total_applications}</p>
                        </CardContent>
                    </Card>
                    <Card className="w-full max-h-25 gap-1">
                        <CardHeader>
                            <CardTitle className="text-muted-foreground">Approved Applications</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold">{data.approved_applications}</p>
                        </CardContent>
                    </Card>
                    <Card className="w-full max-h-25 gap-1">
                        <CardHeader>
                            <CardTitle className="text-muted-foreground">Rejected Applications</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold">{data.rejected_applications}</p>
                        </CardContent>
                    </Card>
                    <Card className="w-full max-h-25 gap-1">
                        <CardHeader>
                            <CardTitle className="text-muted-foreground">Pending Applications</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold">{data.pending_applications}</p>
                        </CardContent>
                    </Card>
                </>
            )}
        </div>
    );
}

export default AdminStatistics;