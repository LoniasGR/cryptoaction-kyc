import { fetchKYCApplicationById } from "@/api/kyc";
import { useAuth } from "@/auth/authProvider";
import { queryKeys } from "@/config/queryKeys";
import { useQuery } from "@tanstack/react-query";
import { UserApplication } from "./user-application";
import { UserProfile } from "./user-profile";
import { LoadingPage } from "../loading-page";
import { HttpError } from "@/api/base";

export function UserPage() {
    const auth = useAuth();
    const query = useQuery({
        queryKey: queryKeys.kycApplication(auth.userInfo!.sub),
        queryFn: () => fetchKYCApplicationById(auth.userInfo!.sub),
        retry: false,
    });
    if (query.isLoading) {
        return (<LoadingPage />);
    }
    if (query.isError) {
        if (query.error instanceof HttpError) {
            if (query.error?.status === 404) {
                return (
                    <UserApplication />
                );
            }
        }
    }
    return (
        <UserProfile />
    );

}