"use client"
import { server_getEvents } from "@/actions/event-actions";
import { Table, TableBody, TableHead, TableRow, TableCell, TableHeader } from '@/components/ui/table';
import { useQuery } from "@tanstack/react-query";
import {useState} from "react";
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
        <div className="flex flex-col h-screen">
            <div className="flex justify-between pt-4">
            <h1>Eventos</h1>
            <div>
                <CreateEventDialog open={showCreateDialog} setOpen={setShowCreateDialog} />
            </div>
            </div>
            {isLoading ? (
                <p>Loading...</p>
            ) : (events?.length === 0) ? (
                <p>Nenhum evento encontrado.</p>
            ) : (
                <Table>
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
                                <TableCell className="flex items-center">
                                    <Button onClick={() => router.push(`/events/${event.id}`)} variant="outline">Abrir</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
        </div>
    );
}