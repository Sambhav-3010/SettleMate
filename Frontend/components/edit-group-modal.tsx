"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"
import axios from "axios"

interface EditGroupModalProps {
  isOpen: boolean
  onClose: () => void
  roomId: string
  currentName: string
  currentDescription?: string
  onSuccess: () => void
}

export function EditGroupModal({ isOpen, onClose, roomId, currentName, currentDescription, onSuccess }: EditGroupModalProps) {
  const [name, setName] = useState(currentName)
  const [description, setDescription] = useState(currentDescription || "")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    setName(currentName)
    setDescription(currentDescription || "")
  }, [currentName, currentDescription, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/rooms/${roomId}`, { name, description }, { withCredentials: true })
      onSuccess()
      onClose()
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update group")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[560px]">
        <DialogHeader>
          <DialogTitle>Edit Group Details</DialogTitle>
          <DialogDescription>Update room metadata and keep everyone aligned.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Group Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Input id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <div className="grid grid-cols-2 gap-2">
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
