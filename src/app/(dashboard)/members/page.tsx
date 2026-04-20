'use client'
import { server_switchMember, server_getMembers } from '@/actions/member-actions';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Table, TableBody, TableHead, TableRow, TableCell, TableHeader } from '@/components/ui/table';
import CreateMemberDialog from './create-member-dialog';
import UpdateMemberDialog from './update-member-dialog';
import { toast } from 'sonner';
export default function MembersPage() {
    const queryClient = useQueryClient()
    const { data: membros, isLoading } = useQuery({
        queryKey: ['membros'],
        queryFn: async () => {
            return await server_getMembers()
        }
    })
    const checkMember = useMutation({
        mutationFn: async (id: string) => {

            return await server_switchMember(id)

        },
        onSuccess: () => {
            toast.success("Membro atualizado")
            queryClient.invalidateQueries({ queryKey: ['membros'] })
        },
        onError: (erro: any) => {
            toast.error("Erro ao atualizar membro.")
        }
    })
    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const [hideInactives, setHideInactives] = useState(true);
    return (
        <div className="flex flex-col h-screen">
            <div className='flex justify-between w-full'>
                <h1>Membros</h1>
                <div className='flex gap-4 items-center'>
                    <div className='flex gap-1 items-center'>
                        <label htmlFor="hideInactives" className='mr-4'>{!hideInactives ? "Esconder inativos" : "Mostrar inativos"}</label>
                        <input type="checkbox" id="hideInactives" name="hideInactives" checked={hideInactives} onChange={() => setHideInactives(!hideInactives)} />
                    </div>
                    <CreateMemberDialog open={showCreateDialog} setOpen={setShowCreateDialog} />
                </div>
            </div>

            {isLoading ? (
                <p>Loading...</p>
            ) : (
                membros?.length !== 0 ?
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nome</TableHead>
                                <TableHead>Classe</TableHead>
                                <TableHead>Nível</TableHead>
                                <TableHead>Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {membros?.map((membro) => {
                                if(hideInactives && !membro.active) return null;
                                return (
                                <TableRow key={membro.id}>
                                    <TableCell>{membro.name}</TableCell>
                                    <TableCell>{membro.class}</TableCell>
                                    <TableCell>{membro.level}</TableCell>
                                    <TableCell className='flex gap-2 items-center'>
                                        <input className='h-6 w-6' type="checkbox" checked={membro.active} onChange={() => {
                                            checkMember.mutate(membro.id)
                                        }} />
                                        {membro &&
                                            <UpdateMemberDialog member={membro} />
                                        }
                                    </TableCell>

                                </TableRow>
                            )})}
                        </TableBody>
                    </Table>
                    :
                    <p className='text-center mt-2'>Nenhum membro encontrado.</p>
            )}
        </div>
    );
}
