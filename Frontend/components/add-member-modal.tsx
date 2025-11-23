"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Loader2 } from "lucide-react"
import axios from "axios"
import { UserSearch } from "@/components/user-search"

interface AddMemberModalProps {
    isOpen: boolean
    onClose: () => void
    roomId: string
    onSuccess: () => void
}

export function AddMemberModal({
    isOpen,
    onClose,
    roomId,
    onSuccess,
}: AddMemberModalProps) {
    const [selectedUsers, setSelectedUsers] = useState<string[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const handleSubmit = async () => {
        if (selectedUsers.length === 0) {
            setError("Please select at least one user")
            return
        }

        setLoading(true)
        setError("")

        try {
            await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/rooms/${roomId}/members`,
                { userIds: selectedUsers },
                { withCredentials: true }
            )
            onSuccess()
            setSelectedUsers([])
            onClose()
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to add members")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Add Members to Group</DialogTitle>
                    <DialogDescription>Search and select users to invite to this group</DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <UserSearch selectedUsers={selectedUsers} onSelect={setSelectedUsers} />

                    {error && <p className="text-sm text-red-500">{error}</p>}

                    <div className="flex gap-2">
                        <Button onClick={handleSubmit} className="flex-1" disabled={loading || selectedUsers.length === 0}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Send Invites ({selectedUsers.length})
                        </Button>
                        <Button variant="outline" onClick={onClose} className="flex-1">
                            Cancel
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
