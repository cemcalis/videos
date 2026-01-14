import { useState, useEffect } from "react";
import { CreditCard, Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "@/integrations/firebase/client";

interface PaymentSettingsData {
  monthlyPrice: string;
  yearlyPrice: string;
  iban: string;
  accountHolder: string;
  bankName: string;
  paymentInstructions: string;
}

const PaymentSettings = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [settings, setSettings] = useState<PaymentSettingsData>({
    monthlyPrice: "49.90",
    yearlyPrice: "449.90",
    iban: "",
    accountHolder: "",
    bankName: "",
    paymentInstructions: `Ödeme yapmak için aşağıdaki IBAN bilgilerini kullanabilirsiniz:

1. Yukarıdaki tutarı belirtilen IBAN'a havale/EFT yapın
2. Açıklama kısmına "Premium Üyelik - [Ad Soyad]" yazın
3. Ödemeyi yaptıktan sonra destek ekibimize başvurun
4. Ödemeniz onaylandıktan sonra premium üyeliğiniz aktif edilecektir

Not: Ödeme işlemleri 1-2 iş günü içerisinde onaylanır.`,
  });

  useEffect(() => {
    loadPaymentSettings();
  }, []);

  const loadPaymentSettings = async () => {
    setIsLoading(true);
    try {
      const docRef = doc(db, "settings", "payment");
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setSettings({
          monthlyPrice: data.monthlyPrice || "49.90",
          yearlyPrice: data.yearlyPrice || "449.90",
          iban: data.iban || "",
          accountHolder: data.accountHolder || "",
          bankName: data.bankName || "",
          paymentInstructions: data.paymentInstructions || settings.paymentInstructions,
        });
      }
    } catch (error) {
      console.error("Error loading payment settings:", error);
      toast({
        title: "Hata",
        description: "Ödeme ayarları yüklenirken bir hata oluştu.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const savePaymentSettings = async () => {
    // Validation
    if (!settings.monthlyPrice || !settings.yearlyPrice) {
      toast({
        title: "Hata",
        description: "Aylık ve yıllık fiyatlar zorunludur.",
        variant: "destructive",
      });
      return;
    }

    if (!settings.iban || !settings.accountHolder || !settings.bankName) {
      toast({
        title: "Hata",
        description: "IBAN, hesap sahibi adı ve banka adı zorunludur.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      const docRef = doc(db, "settings", "payment");
      await setDoc(docRef, {
        ...settings,
        updatedAt: new Date(),
      });

      toast({
        title: "Başarılı",
        description: "Ödeme ayarları başarıyla kaydedildi.",
      });
    } catch (error) {
      console.error("Error saving payment settings:", error);
      toast({
        title: "Hata",
        description: "Ödeme ayarları kaydedilirken bir hata oluştu.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (field: keyof PaymentSettingsData, value: string) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center py-8">
            <Loader2 size={24} className="animate-spin mr-2" />
            Ödeme ayarları yükleniyor...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard size={24} />
          Ödeme Ayarları
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Pricing Settings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="monthlyPrice">Aylık Fiyat (₺)</Label>
            <Input
              id="monthlyPrice"
              type="number"
              step="0.01"
              value={settings.monthlyPrice}
              onChange={(e) => handleInputChange('monthlyPrice', e.target.value)}
              placeholder="49.90"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="yearlyPrice">Yıllık Fiyat (₺)</Label>
            <Input
              id="yearlyPrice"
              type="number"
              step="0.01"
              value={settings.yearlyPrice}
              onChange={(e) => handleInputChange('yearlyPrice', e.target.value)}
              placeholder="449.90"
            />
          </div>
        </div>

        {/* Bank Account Settings */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Banka Hesap Bilgileri</h3>

          <div className="space-y-2">
            <Label htmlFor="iban">IBAN</Label>
            <Input
              id="iban"
              value={settings.iban}
              onChange={(e) => handleInputChange('iban', e.target.value)}
              placeholder="TR00 0000 0000 0000 0000 0000 00"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="accountHolder">Hesap Sahibi Adı</Label>
            <Input
              id="accountHolder"
              value={settings.accountHolder}
              onChange={(e) => handleInputChange('accountHolder', e.target.value)}
              placeholder="Şirket Adı veya Kişi Adı"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bankName">Banka Adı</Label>
            <Input
              id="bankName"
              value={settings.bankName}
              onChange={(e) => handleInputChange('bankName', e.target.value)}
              placeholder="Banka Adı"
            />
          </div>
        </div>

        {/* Payment Instructions */}
        <div className="space-y-2">
          <Label htmlFor="paymentInstructions">Ödeme Talimatları</Label>
          <Textarea
            id="paymentInstructions"
            value={settings.paymentInstructions}
            onChange={(e) => handleInputChange('paymentInstructions', e.target.value)}
            rows={8}
            placeholder="Kullanıcılara gösterilecek ödeme talimatları..."
          />
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button onClick={savePaymentSettings} disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 size={16} className="mr-2 animate-spin" />
                Kaydediliyor...
              </>
            ) : (
              <>
                <Save size={16} className="mr-2" />
                Kaydet
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentSettings;
