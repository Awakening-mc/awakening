'use client'
import { server_switchMember, server_getMembers, server_deleteMember } from '@/actions/member-actions';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Table, TableBody, TableHead, TableRow, TableCell, TableHeader } from '@/components/ui/table';
import CreateMemberDialog from './create-member-dialog';
import UpdateMemberDialog from './update-member-dialog';
import { toast } from 'sonner';
import useDebounce from '@/hooks/useDebounce';
import SearchBar from '@/components/search-bar';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { User, X } from 'lucide-react';
import ConfirmDialog from '@/components/confirm-dialog';

export default function MembersPage() {
    const router = useRouter()
    const queryClient = useQueryClient()
    const { data: membros, isLoading } = useQuery({
        queryKey: ['membros'],
        queryFn: async () => await server_getMembers()
    })
    const checkMember = useMutation({
        mutationFn: async (id: string) => await server_switchMember(id),
        onSuccess: () => {
            toast.success("Membro atualizado")
            queryClient.invalidateQueries({ queryKey: ['membros'] })
        },
        onError: () => toast.error("Erro ao atualizar membro.")
    })
    const deleteMember = useMutation({
        mutationFn: async (id: string) => await server_deleteMember(id),
        onSuccess: () => {
            toast.success("Membro deletado")
            queryClient.invalidateQueries({ queryKey: ['membros'] })
        },
        onError: () => toast.error("Erro ao deletar membro.")
    })

    const [searchQuery, setSearchQuery] = useState("");
    const debouncedSearchQuery = useDebounce(searchQuery, 300);
    const filteredMembers = membros?.filter(m =>
        m.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
    );

    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const [hideInactives, setHideInactives] = useState(true);

    return (
        <div className="flex flex-col">
            {/* Cabeçalho — coluna no mobile, linha no desktop */}
            <div className="flex flex-col gap-3 pt-4 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
                <h1 className="text-xl font-bold shrink-0">Membros</h1>

                <SearchBar value={searchQuery} onSearch={setSearchQuery} />

                <div className="flex items-center justify-between gap-4 sm:justify-end">
                    <label htmlFor="hideInactives" className="flex items-center gap-2 text-sm cursor-pointer select-none">
                        <input
                            type="checkbox"
                            id="hideInactives"
                            name="hideInactives"
                            className="h-5 w-5"
                            checked={hideInactives}
                            onChange={() => setHideInactives(!hideInactives)}
                        />
                        {hideInactives ? "Mostrar inativos" : "Esconder inativos"}
                    </label>
                    <CreateMemberDialog open={showCreateDialog} setOpen={setShowCreateDialog} />
                </div>
            </div>

            {isLoading ? (
                <p className="mt-4">Loading...</p>
            ) : filteredMembers?.length !== 0 ? (
                <Table className="mt-4 relative h-fit">
                    <TableHeader className="sticky top-0 bg-white z-10">
                        <TableRow>
                            <TableHead>Nome</TableHead>
                            <TableHead>Classe</TableHead>
                            <TableHead>Nível</TableHead>
                            <TableHead>Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredMembers?.map((membro) => {
                            if (hideInactives && !membro.active) return null;
                            return (
                                <TableRow key={membro.id}>
                                    <TableCell>{membro.name}</TableCell>
                                    <TableCell>{membro.class}</TableCell>
                                    <TableCell>{membro.level}</TableCell>
                                    <TableCell className="flex gap-2 items-center">
                                        <input
                                            className="h-6 w-6"
                                            type="checkbox"
                                            checked={membro.active}
                                            onChange={() => checkMember.mutate(membro.id)}
                                        />
                                        <UpdateMemberDialog member={membro} />
                                        <Button className={"rounded-full"} variant={"outline"} size="icon" onClick={() => router.push(`/members/${membro.id}`)}>
                                            <User />
                                        </Button>
                                        <ConfirmDialog
                                            title="Confirmar exclusão"
                                            description={`Tem certeza que deseja excluir o membro ${membro.name}? Esta ação não pode ser desfeita.`}
                                            children={<Button variant={"outline"} size="icon">
                                                <X />
                                            </Button>}
                                            onConfirm={() => deleteMember.mutate(membro.id)}
                                        />
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            ) : (
                <p className="text-center mt-2">Nenhum membro encontrado.</p>
            )}
        </div>
    );
}