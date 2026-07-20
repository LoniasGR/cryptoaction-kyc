import { fetchKYCApplications } from "@/api/kyc";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { queryKeys } from "@/config/queryKeys";
import { type KYCApplication } from "@/types/kyc";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { useMemo } from "react";

function AdminTable() {
    const query = useQuery({
        queryKey: queryKeys.kycApplications,
        queryFn: fetchKYCApplications,
    });
    const columnHelper = createColumnHelper<KYCApplication>();

    const defaultColumns = useMemo(
        () => [
            columnHelper.accessor("id", {
                header: "ID",
                cell: (info) => info.getValue() ?? "-",
                footer: (info) => info.column.id,
            }),
            columnHelper.accessor("fullName", {
                header: "Full Name",
                cell: (info) => info.getValue() ?? "-",
                footer: (info) => info.column.id,
            }),
            columnHelper.accessor("status", {
                header: "Status",
                cell: (info) => <Badge>{info.getValue() ?? "-"}</Badge>,
                footer: (info) => info.column.id,
            }),
            columnHelper.accessor("submittedAt", {
                header: "Submitted At",
                cell: (props) => {
                    const submittedAt = props.getValue();
                    return <span>{new Date(submittedAt).toLocaleDateString()} {new Date(submittedAt).toLocaleTimeString()}</span>;
                },
                footer: (info) => info.column.id,
            }),
            columnHelper.display({
                id: "actions",
                header: "Actions",
                cell: (info) =>
                    <Button variant="link">
                        <Link
                            to="/admin/$applicationId"
                            params={{
                                applicationId: info.row.original.id,
                            }}>
                            {info.row.original.status === "pending" ? "Review" : "View"}
                        </Link>
                    </Button>
            }),
        ],
        [columnHelper],
    );

    const table = useReactTable({
        columns: defaultColumns,
        data: query.data ?? [],
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    return (
        <div className="overflow-x-auto rounded-md border bg-background">
            <Table className="min-w-3xl w-full">
                <TableCaption>
                    {query.isLoading
                        ? "Loading KYC applications..."
                        : query.isError
                            ? "Failed to load KYC applications."
                            : ""}
                </TableCaption>
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <TableHead key={header.id}>
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(
                                            header.column.columnDef.header,
                                            header.getContext(),
                                        )}
                                </TableHead>
                            ))}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {query.isLoading ? (
                        <TableRow>
                            <TableCell colSpan={4}>Loading...</TableCell>
                        </TableRow>
                    ) : query.isError ? (
                        <TableRow>
                            <TableCell colSpan={4}>
                                Failed to load KYC applications.
                            </TableCell>
                        </TableRow>
                    ) : (
                        table.getRowModel().rows.map((row) => (
                            <TableRow key={row.id}>
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    )}
                </TableBody>
                {/* <TableFooter>
                    {table.getFooterGroups().map((footerGroup) => (
                        <TableRow key={footerGroup.id}>
                            {footerGroup.headers.map((header) => (
                                <TableHead key={header.id}>
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(
                                            header.column.columnDef.footer,
                                            header.getContext(),
                                        )}
                                </TableHead>
                            ))}
                        </TableRow>
                    ))}
                </TableFooter> */}
            </Table>
            <div className="flex items-center justify-end space-x-2 py-4">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    Previous
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    Next
                </Button>
            </div>
        </div>
    );
}

export default AdminTable;   