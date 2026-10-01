import { Badge } from "@/components/ui/badge";
import { KYCStatus, type KYCStatusType } from "@/types/kyc";

function ApplicationStatusBadge({ status, className }: { status: KYCStatusType | string | undefined, className?: string }) {
    let variant: "default" | "destructive" | "success" | "secondary" | undefined = "default";
    let message: string = "";
    switch (status) {
        case KYCStatus.APPROVED:
        case Object.keys(KYCStatus)[KYCStatus.APPROVED]:
            variant = "success";
            message = "Approved";
            break;
        case KYCStatus.REJECTED:
        case Object.keys(KYCStatus)[KYCStatus.REJECTED]:
            variant = "destructive";
            message = "Rejected";
            break;
        case KYCStatus.PENDING:
        case Object.keys(KYCStatus)[KYCStatus.PENDING]:
            variant = "secondary";
            message = "Pending";
            break;
        default:
            variant = "default";
            break;
    }

    return <Badge variant={variant} className={className}>{message || status}</Badge>;
}

export { ApplicationStatusBadge };