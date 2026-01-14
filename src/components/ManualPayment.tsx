import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Copy, Check, CreditCard } from "lucide-react";
import { toast } from "sonner";

export const ManualPayment = () => {
    const [copied, setCopied] = useState(false);
    const iban = "TR00 0000 0000 0000 0000 0000 00";

    const handleCopy = () => {
        navigator.clipboard.writeText(iban.replace(/\s/g, ""));
        setCopied(true);
        toast.success("IBAN kopyalandı");
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" className="w-full flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    IBAN / EFT ile Öde
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Havale / EFT Bilgileri</DialogTitle>
                    <DialogDescription>
                        Aşağıdaki hesap bilgilerine ödeme yaptıktan sonra üyeliğiniz 24 saat içerisinde onaylanacaktır.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                    <div className="p-4 bg-muted/50 rounded-lg space-y-3">
                        <div>
                            <p className="text-xs font-semibold uppercase text-muted-foreground">Banka</p>
                            <p className="text-sm font-medium">Ziraat Bankası</p>
                        </div>
                        <div>
                            <p className="text-xs font-semibold uppercase text-muted-foreground">Alıcı</p>
                            <p className="text-sm font-medium">Cem ÖZDEMİR</p>
                        </div>
                        <div>
                            <p className="text-xs font-semibold uppercase text-muted-foreground">IBAN</p>
                            <div className="flex items-center gap-2 mt-1">
                                <code className="bg-background px-2 py-1.5 rounded border flex-1 text-sm font-mono tracking-tighter">
                                    {iban}
                                </code>
                                <Button size="icon" variant="outline" className="h-8 w-8" onClick={handleCopy}>
                                    {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
                                </Button>
                            </div>
                        </div>
                    </div>
                    <div className="bg-primary/10 p-3 rounded-lg border border-primary/20">
                        <p className="text-xs text-primary leading-relaxed">
                            <strong>Önemli:</strong> Lütfen havale açıklama kısmına <strong>isim-soyisim</strong> ve <strong>kayıtlı e-posta adresinizi</strong> yazmayı unutmayın.
                        </p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ManualPayment;
