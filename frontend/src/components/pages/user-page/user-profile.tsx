import { Badge } from "@/components/ui/badge";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "#/components/ui/card";
import { generateFileUrl } from "@/api/file";
import { fetchKYCApplicationById } from "@/api/kyc";
import { useAuth } from "@/auth/authProvider";
import { Button } from "@/components/ui/button";
import { queryKeys } from "@/config/queryKeys";
import { useQuery } from "@tanstack/react-query";


export function UserProfile() {
    const auth = useAuth();
    const { data } = useQuery({
        queryKey: queryKeys.kycApplication(auth.userInfo!.sub),
        queryFn: () => fetchKYCApplicationById(auth.userInfo!.sub),
    });
    return (
        <div className="bg-muted h-[94vh] flex items-start justify-center">
            <div className="pt-10 justify-center flex sm:flex-col md:flex-row gap-4">
                <Card className="min-w-xs max-w-md lg:min-w-lg sm:min-w-sm">
                    <CardAction className="pl-5 pt-2">
                        <Badge>{data?.status}</Badge>
                    </CardAction>
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl">My Application</CardTitle>
                        <p><span className="text-balance">Application ID:</span> {data?.id}</p>
                        <CardDescription className="text-base mt-5 text-foreground">
                            <p><span className="font-semibold">Name:</span> {data!.fullName}</p>
                            <p><span className="font-semibold">Email:</span> {data!.email}</p>
                            <p><span className="font-semibold">Submitted on:</span> {new Date(data!.submittedAt).toLocaleDateString()} {new Date(data!.submittedAt).toLocaleTimeString()}</p>
                            {data?.status === "approved" && (
                                <p><span className="font-semibold">Expiring at:</span> {new Date(data!.expiringAt).toLocaleDateString()} {new Date(data!.expiringAt).toLocaleTimeString()}</p>
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