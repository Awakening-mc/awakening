"use client"
import { server_getEvents } from "@/actions/event-actions";
import { Table, TableBody, TableHead, TableRow, TableCell, TableHeader } from '@/components/ui/table';
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import CreateEventDialog from "./create-event-dialog";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function EventsPage() {
    const router = useRouter()
    const { data: events, isLoading } = useQuery({
        queryKey: ["events"],
        queryFn: server_getEvents
    });
    const [showCreateDialog, setShowCreateDialog] = useState(false);

    return (
        <div className="flex flex-col">
            {/* Cabeçalho — coluna no mobile, linha no desktop */}
            <div className="flex flex-col gap-3 pt-4 sm:flex-row sm:items-center sm:justify-between">
                <h1 className="text-xl font-bold">Eventos</h1>
                <CreateEventDialog open={showCreateDialog} setOpen={setShowCreateDialog} />
            </div>

            {isLoading ? (
                <p className="mt-4">Loading...</p>
            ) : events?.length === 0 ? (
                <p className="text-center mt-2">Nenhum evento encontrado.</p>
            ) : (
                <Table className="mt-4">
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nome</TableHead>
                            <TableHead>Data</TableHead>
                            <TableHead>Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {events?.map((event) => (
                            <TableRow key={event.id}>
                                <TableCell>{event.name}</TableCell>
                                <TableCell>{event.date.toLocaleDateString()}</TableCell>
                                <TableCell>
                                    <Button
                                        onClick={() => router.push(`/events/${event.id}`)}
                                        variant="outline"
                                        size="sm"
                                    >
                                        Abrir
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
        </div>
    );
}