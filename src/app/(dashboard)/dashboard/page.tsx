"use client"
import { server_getMembersRankedByAttendance } from "@/actions/member-actions";
import { Table, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
export default function DashboardPage() {    
    const { data: members } = useQuery({
        queryKey: ['members_at'],
        queryFn: async () => {
            return await server_getMembersRankedByAttendance();
        }
    })
    return (
        <div className="flex flex-col overflow-y-auto">
            <h1 className="mb-2 text-2xl font-bold">Dashboard</h1>
            <div className="flex h-screen mx-4 rounded-2xl border py-2 px-4 border-gray-200">
                <h2 className="text-xl font-bold mb-2">Membros</h2>
                <Table className="mt-4 relative">
                    <TableHeader  className="sticky top-0 bg-white z-10">
                        <TableRow>
                            <TableHead>Nome</TableHead>
                            <TableHead>Presenças</TableHead>
                        </TableRow>
                    </TableHeader>
                    {members?.map((m) => (
                        <TableRow key={m.id}>
                            <TableCell>{m.name}</TableCell>
                            <TableCell>{m.attendedCount}</TableCell>
                        </TableRow>
                    ))}
                </Table>
            </div>
        </div>
    );
}