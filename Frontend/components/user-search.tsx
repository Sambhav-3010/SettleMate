"use client"

import { useState, useEffect } from "react"
import { Check, ChevronsUpDown, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import axios from "axios"

interface User {
    id: string
    username: string
    name: string
    email: string
}

interface UserSearchProps {
    onSelect: (users: string[]) => void
    selectedUsers: string[]
}

export function UserSearch({ onSelect, selectedUsers }: UserSearchProps) {
    const [open, setOpen] = useState(false)
    const [query, setQuery] = useState("")
    const [users, setUsers] = useState<User[]>([])
    const [selectedUserObjects, setSelectedUserObjects] = useState<User[]>([])

    useEffect(() => {
        const searchUsers = async () => {
            if (query.length < 2) {
                setUsers([])
                return
            }

            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users/search?query=${query}`, {
                    withCredentials: true
                })
                setUsers(response.data)
            } catch (error) {
                console.error("Failed to search users:", error)
            }
        }

        const timeoutId = setTimeout(searchUsers, 300)
        return () => clearTimeout(timeoutId)
    }, [query])

    const handleSelect = (user: User) => {
        if (selectedUsers.includes(user.id)) return

        const newSelectedIds = [...selectedUsers, user.id]
        const newSelectedObjects = [...selectedUserObjects, user]

        onSelect(newSelectedIds)
        setSelectedUserObjects(newSelectedObjects)
        setOpen(false)
        setQuery("")
    }

    const handleRemove = (userId: string) => {
        const newSelectedIds = selectedUsers.filter(id => id !== userId)
        const newSelectedObjects = selectedUserObjects.filter(user => user.id !== userId)

        onSelect(newSelectedIds)
        setSelectedUserObjects(newSelectedObjects)
    }

    return (
        <div className="space-y-4">
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-full justify-between"
                    >
                        Search users...
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[400px] p-0">
                    <Command shouldFilter={false}>
                        <CommandInput
                            placeholder="Search by username or email..."
                            value={query}
                            onValueChange={setQuery}
                        />
                        <CommandList>
                            <CommandEmpty>No users found.</CommandEmpty>
                            <CommandGroup>
                                {users.map((user) => (
                                    <CommandItem
                                        key={user.id}
                                        value={user.username}
                                        onSelect={() => handleSelect(user)}
                                    >
                                        <Check
                                            className={cn(
                                                "mr-2 h-4 w-4",
                                                selectedUsers.includes(user.id) ? "opacity-100" : "opacity-0"
                                            )}
                                        />
                                        <div className="flex flex-col">
                                            <span>{user.username}</span>
                                            <span className="text-xs text-muted-foreground">{user.email}</span>
                                        </div>
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>

            <div className="flex flex-wrap gap-2">
                {selectedUserObjects.map((user) => (
                    <Badge key={user.id} variant="secondary" className="pl-2 pr-1 py-1">
                        {user.username}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-4 w-4 ml-2 hover:bg-transparent"
                            onClick={() => handleRemove(user.id)}
                        >
                            <X className="h-3 w-3" />
                        </Button>
                    </Badge>
                ))}
            </div>
        </div>
    )
}
