'use client'
import { server_switchMember, server_getMembers } from '@/actions/member-actions';
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
export default function MembersPage() {
    const router = useRouter()
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
    const [searchQuery, setSearchQuery] = useState("");
    const debouncedSearchQuery = useDebounce(searchQuery, 300);
    const filteredMembers = membros?.filter(m => m.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase()));

    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const [hideInactives, setHideInactives] = useState(true);
    return (
        <div className="flex flex-col">
            <div className='flex justify-between w-full pt-4 gap-8'>
                <h1>Membros</h1>
                <SearchBar value={searchQuery} onSearch={setSearchQuery} />
                <div className='flex gap-4 items-center grow'>
                    <div className='flex items-center'>
                        <label htmlFor="hideInactives" className='mr-1 text-sm'>{!hideInactives ? "Esconder inativos" : "Mostrar inativos"}</label>
                        <input type="checkbox" id="hideInactives" name="hideInactives" className='h-8 w-8' checked={hideInactives} onChange={() => setHideInactives(!hideInactives)} />
                    </div>
                    <CreateMemberDialog open={showCreateDialog} setOpen={setShowCreateDialog} />
                </div>
            </div>

            {isLoading ? (
                <p>Loading...</p>
            ) : (
                filteredMembers?.length !== 0 ?
                    <Table className='mt-4 relative h-fit'>
                        <TableHeader className='sticky top-0 bg-white z-10'>
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
                                        <TableCell className='flex gap-2 items-center'>
                                            <input className='h-6 w-6' type="checkbox" checked={membro.active} onChange={() => {
                                                checkMember.mutate(membro.id)
                                            }} />
                                            <UpdateMemberDialog member={membro} />
                                            <Button size={"sm"} onClick={() => router.push(`/members/${membro.id}`)}>Abrir</Button>
                                        </TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                    :
                    <p className='text-center mt-2'>Nenhum membro encontrado.</p>
            )}
        </div>
    );
}
