import { useState } from "react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Crown, Zap } from "lucide-react";
import { useAuthContext } from "@/contexts/AuthContext";

const Premium = () => {
  const { user, isPremium } = useAuthContext();

  const premiumFeatures = [
    "Reklamsız izleme deneyimi",
    "HD ve 4K video kalitesi",
    "Öncelikli video yükleme",
    "Premium destek",
    "İndirme özelliği",
    "Çevrimdışı izleme",
    "Özel içeriklere erişim"
  ];

  const plans = [
    {
      name: "Aylık",
      price: "₺29.99",
      period: "/ay",
      features: ["Tüm premium özellikler", "İstediğiniz zaman iptal"],
      popular: false
    },
    {
      name: "Yıllık",
      price: "₺299.99",
      period: "/yıl",
      features: ["Tüm premium özellikler", "2 ay ücretsiz", "Öncelikli destek"],
      popular: true
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-20 pb-8">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Crown className="h-8 w-8 text-yellow-500" />
              <h1 className="text-4xl font-bold">Premium Üyelik</h1>
            </div>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Reklamsız, yüksek kaliteli video deneyimi için premium üyeliğe geçin
            </p>
          </div>

          {isPremium ? (
            /* Premium User Section */
            <Card className="max-w-2xl mx-auto">
              <CardHeader className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Crown className="h-6 w-6 text-yellow-500" />
                  <CardTitle className="text-2xl">Premium Üye</CardTitle>
                </div>
                <CardDescription>
                  Premium üyeliğiniz aktif. Tüm özelliklerden faydalanabilirsiniz.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {premiumFeatures.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-green-500" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
                <div className="text-center pt-4">
                  <p className="text-sm text-muted-foreground">
                    Üyeliğiniz otomatik olarak yenilenir. İptal etmek için ayarlara gidin.
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            /* Non-Premium User Section */
            <div className="space-y-8">
              {/* Features Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {premiumFeatures.map((feature, index) => (
                  <Card key={index} className="text-center">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-center mb-4">
                        <Zap className="h-8 w-8 text-primary" />
                      </div>
                      <p className="font-medium">{feature}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Pricing Plans */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                {plans.map((plan, index) => (
                  <Card key={index} className={`relative ${plan.popular ? 'border-primary' : ''}`}>
                    {plan.popular && (
                      <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-primary">
                        En Popüler
                      </Badge>
                    )}
                    <CardHeader className="text-center">
                      <CardTitle className="text-2xl">{plan.name}</CardTitle>
                      <div className="text-3xl font-bold text-primary">
                        {plan.price}
                        <span className="text-lg font-normal text-muted-foreground">{plan.period}</span>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <ul className="space-y-2">
                        {plan.features.map((feature, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-green-500" />
                            <span className="text-sm">{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <Button className="w-full" size="lg">
                        {plan.name} Aboneliği Başlat
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Premium;
