import { Badge } from "@/components/ui/badge";
import type { KYCStatus } from "@/types/kyc";

function ApplicationStatusBadge({ status, className }: { status: KYCStatus | undefined, className?: string }) {
    let variant: "default" | "destructive" | "success" | "secondary" | undefined = "default";

    switch (status) {
        case "APPROVED":
            variant = "success";
            break;
        case "REJECTED":
            variant = "destructive";
            break;
        case "PENDING":
            variant = "secondary";
            break;
        default:
            variant = "default";
            break;
    }

    return <Badge variant={variant} className={className}>{status}</Badge>;
}

export { ApplicationStatusBadge };