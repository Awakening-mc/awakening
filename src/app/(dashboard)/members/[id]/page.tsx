'use client'
import { server_getAttendancesByMember } from '@/actions/attendance-actions';
import { server_getMemberById } from '@/actions/member-actions';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';

export default function MemberPage() {
    const { id } = useParams()
    const { data: member, isLoading } = useQuery({
        queryKey: ['member', id],
        queryFn: async () => {
            if(!id) return null
            return await server_getMemberById(id as string);
        }
    })
const {data: memberAttendances} = useQuery({
    queryKey: ['member-attendances', id],
    queryFn: async () => {
        if(!id) return null
        return await server_getAttendancesByMember(id as string);
    }
})
    return(
        <div className='h-full flex flex-col gap-2'>
            {isLoading || !member ? (
                <p>Carregando membro...</p>
            ) : (
                <>
                    <h1>{member.name} - {member.class}</h1>
                    <p>Nível: {member.level}</p>
                    <div className='mt-2 w-[90%] mx-auto rounded-xl border p-4'>
                        <h2 className='text-lg font-semibold mb-4'>Presenças</h2>
                        {memberAttendances?.length === 0 ? (
                            <p>Sem presenças registradas.</p>
                        ) : (
                            <ul className='flex flex-col gap-2'>
                                {memberAttendances?.map(attendance => (
                                    <li key={attendance.event_attendance.eventId} className='flex justify-between items-center border rounded-md p-2'>
                                        <span>Evento: {attendance.events.name} - {attendance.events.date.toLocaleDateString()}</span>
                                        <span>{attendance.event_attendance.attended ? "Presente" : "Ausente"}</span>
                                        {!attendance.event_attendance.attended && 
                                        <span>{attendance.event_attendance.justified ? "Justificado" : "Não Justificado"}</span>
                                        }
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </>
            )}
        </div>
    )
}
