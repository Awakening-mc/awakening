"use client"
import { Input } from "@/components/ui/input";

export default function SearchBar({value, onSearch }: { value: string, onSearch: (query: string) => void }) {
    return (
        <div className="flex items-center space-x-2 w-full">
            <Input
                className="h-10 w-auto border flex-1 border-[#000C] rounded-full py-2 px-4 outline-none"
                placeholder="Buscar..."
                value={value}
                onChange={(e) => onSearch(e.target.value)}
            />
        </div>
    );
}
