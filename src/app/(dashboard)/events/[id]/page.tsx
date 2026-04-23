'use client'
import { useParams } from "next/navigation";
import { Table, TableBody, TableHead, TableRow, TableCell, TableHeader } from '@/components/ui/table';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { server_getEventById } from "@/actions/event-actions";
import { server_getActiveMembers } from "@/actions/member-actions";
import { server_getAttendancesForEvent, server_updateAttendance } from "@/actions/attendance-actions";
import useDebounce from "@/hooks/useDebounce";
import { useState } from "react";
import SearchBar from "@/components/search-bar";
export default function Page() {
    const queryClient = useQueryClient();
    const { id } = useParams();
    const { data: event, isLoading } = useQuery({
        queryKey: ["event", id],
        queryFn: async () => {
            return await server_getEventById(id as string)

        }
    })
    const {data: members} = useQuery({
        queryKey: ["active_members"],
        queryFn: async () => {
            return await server_getActiveMembers();
        }
    });
    const {data: attendances} = useQuery({
        queryKey: ["attendances", id],
        queryFn: async () => {
            return await server_getAttendancesForEvent(id as string);
        }
    })
    const [searchQuery, setSearchQuery] = useState("");
    const debouncedSearchQuery = useDebounce(searchQuery, 300);
     const filteredMembers = members?.filter(m => m.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase()));

    const updateAttendance = useMutation({
        mutationFn: async (data: {memberId: string, present: boolean, justified: boolean}) => {
            await server_updateAttendance(data.memberId, id as string, data.present, data.justified)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["attendances", id] })
        }
    })
    return (
        <div className="flex flex-col h-dvh">
            <div className="flex justify-between pt-4">
                <h1 className="text-2xl font-bold mb-4">Detalhes do Evento</h1>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center w-full gap-8 justify-between">
                <p className="font-bold text-lg w-1/2">{event?.name} - {event?.date.toLocaleDateString()}</p>
                <SearchBar value={searchQuery} onSearch={setSearchQuery}/>
            </div>
                {filteredMembers?.length !== 0 ?
                    <Table className="mt-4 relative">
                        <TableHeader className="sticky top-0 bg-white z-10">
                            <TableRow>
                                <TableHead>Nome</TableHead>
                                <TableHead>Presente</TableHead>
                                <TableHead>Justificou</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredMembers?.map((membro) => {
                                const at = attendances?.find(a => a.memberId === membro.id);
                                return (
                                <TableRow key={membro.id}>
                                    <TableCell>{membro.name}</TableCell>
                                    <TableCell>
                                        <input className="ml-4 h-6 w-6" type="checkbox" checked={at?.attended ?? false} onChange={(e) => {
                                            updateAttendance.mutate({ memberId: membro.id, present: e.target.checked ?? false, justified: at?.justified ?? false });
                                        }} />
                                    </TableCell>
                                    <TableCell>
                                        <input className="ml-4 h-6 w-6" type="checkbox" checked={at?.justified ?? false} onChange={(e) => {
                                            updateAttendance.mutate({ memberId: membro.id, present: at?.attended ?? false, justified: e.target.checked ?? false });
                                        }} />
                                    </TableCell>

                                </TableRow>
                            )})}
                        </TableBody>
                    </Table> : <p>nenhum membro</p>}
        </div>
    );
}