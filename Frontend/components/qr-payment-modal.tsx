"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { QRCodeSVG } from "qrcode.react"
import { useState } from "react"
import { Loader2, CheckCircle, XCircle } from "lucide-react"

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

    // Generate UPI payment string
    const upiString = `upi://pay?pa=${receiverUpiId}&pn=${encodeURIComponent(receiverName)}&am=${amount}&cu=INR`

    const handlePaymentClaimed = async () => {
        setLoading(true)
        try {
            // Call the onPaymentConfirmed callback which will handle notification
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
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-center">
                        {paymentClaimed ? "Payment Claimed!" : `Pay ₹${amount} to ${receiverName}`}
                    </DialogTitle>
                    <DialogDescription className="text-center">
                        {paymentClaimed
                            ? "Waiting for receiver confirmation..."
                            : "Scan the QR code with any UPI app to pay"}
                    </DialogDescription>
                </DialogHeader>

                {!paymentClaimed ? (
                    <div className="space-y-6">
                        {/* QR Code */}
                        <div className="flex justify-center p-6 bg-white rounded-lg">
                            <QRCodeSVG value={upiString} size={220} level="H" />
                        </div>

                        {/* Payment Details */}
                        <div className="space-y-2 text-center">
                            <p className="text-sm text-muted-foreground">
                                UPI ID: <span className="font-mono text-foreground">{receiverUpiId}</span>
                            </p>
                            <p className="text-2xl font-bold text-primary">₹{amount}</p>
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-2">
                            <Button
                                onClick={handlePaymentClaimed}
                                className="w-full"
                                size="lg"
                                disabled={loading}
                            >
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                I have paid
                            </Button>
                            <Button onClick={handleClose} variant="outline" className="w-full" size="lg">
                                Cancel
                            </Button>
                        </div>

                        <p className="text-xs text-center text-muted-foreground">
                            Click "I have paid" after completing the payment. The receiver will be notified to confirm.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-6 py-6">
                        <div className="flex justify-center">
                            <CheckCircle className="h-20 w-20 text-green-500" />
                        </div>
                        <div className="text-center space-y-2">
                            <p className="text-lg font-semibold">Payment claim sent!</p>
                            <p className="text-sm text-muted-foreground">
                                {receiverName} has been notified. The settlement will be completed once they confirm receiving the payment.
                            </p>
                        </div>
                        <Button onClick={handleClose} className="w-full" size="lg">
                            Done
                        </Button>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}
