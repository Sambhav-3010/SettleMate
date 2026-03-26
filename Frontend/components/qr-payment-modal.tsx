"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { QRCodeSVG } from "qrcode.react"
import { useState } from "react"
import { Loader2, CheckCircle } from "lucide-react"

interface QRPaymentModalProps {
  isOpen: boolean
  onClose: () => void
  amount: number
  receiverName: string
  receiverUpiId: string
  onPaymentConfirmed: () => void
}

export function QRPaymentModal({
  isOpen,
  onClose,
  amount,
  receiverName,
  receiverUpiId,
  onPaymentConfirmed,
}: QRPaymentModalProps) {
  const [paymentClaimed, setPaymentClaimed] = useState(false)
  const [loading, setLoading] = useState(false)

  const upiString = `upi://pay?pa=${receiverUpiId}&pn=${encodeURIComponent(receiverName)}&am=${amount}&cu=INR`

  const handlePaymentClaimed = async () => {
    setLoading(true)
    try {
      await onPaymentConfirmed()
      setPaymentClaimed(true)
    } catch (error) {
      console.error("Failed to claim payment:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setPaymentClaimed(false)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle className="text-center">
            {paymentClaimed ? "Payment Claimed" : `Pay ₹${amount} to ${receiverName}`}
          </DialogTitle>
          <DialogDescription className="text-center">
            {paymentClaimed ? "Waiting for receiver confirmation..." : "Scan QR with any UPI app."}
          </DialogDescription>
        </DialogHeader>

        {!paymentClaimed ? (
          <div className="space-y-5">
            <div className="flex justify-center border border-border bg-white p-5">
              <QRCodeSVG value={upiString} size={210} level="H" />
            </div>

            <div className="space-y-1 text-center">
              <p className="text-sm text-muted-foreground">
                UPI ID: <span className="font-mono text-foreground">{receiverUpiId}</span>
              </p>
              <p className="text-3xl font-semibold tracking-[-0.02em]">₹{amount}</p>
            </div>

            <div className="grid gap-2">
              <Button onClick={handlePaymentClaimed} disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                I Have Paid
              </Button>
              <Button onClick={handleClose} variant="outline">Cancel</Button>
            </div>

            <p className="text-center text-xs text-muted-foreground">
              Confirm after transfer; receiver gets a chat notification for validation.
            </p>
          </div>
        ) : (
          <div className="space-y-5 py-4">
            <div className="flex justify-center">
              <CheckCircle className="h-16 w-16 text-green-400" />
            </div>
            <div className="space-y-1 text-center">
              <p className="text-lg font-semibold">Payment claim sent</p>
              <p className="text-sm text-muted-foreground">
                {receiverName} has been notified. Settlement completes after their confirmation.
              </p>
            </div>
            <Button onClick={handleClose} className="w-full">Done</Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
