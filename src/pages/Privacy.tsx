import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield } from "lucide-react";

const Privacy = () => {
    return (
        <div className="min-h-screen bg-background">
            <Header />

            <main className="pt-24 pb-12">
                <div className="container mx-auto px-4 max-w-4xl">
                    <Card className="border-border/40 bg-background/50 backdrop-blur-sm">
                        <CardHeader className="text-center pb-8 border-b border-border/40">
                            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Shield className="text-primary" size={32} />
                            </div>
                            <CardTitle className="text-3xl font-bold">Gizlilik Politikası</CardTitle>
                            <p className="text-muted-foreground mt-2">Son güncelleme: 14 Ocak 2024</p>
                        </CardHeader>
                        <CardContent className="pt-8 prose prose-invert max-w-none">
                            <section className="mb-8">
                                <h2 className="text-xl font-semibold mb-4 text-primary">1. Veri Toplama</h2>
                                <p className="text-muted-foreground leading-relaxed">
                                    HD Yatak Premium Video Hub olarak, sizlere daha iyi hizmet verebilmek adına hesap oluşturma sırasında
                                    e-posta adresi, profil ismi gibi temel bilgileri topluyoruz. Ayrıca platform kullanım alışkanlıklarınız,
                                    izleme geçmişiniz gibi veriler deneyiminizi kişiselleştirmek için kullanılır.
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-xl font-semibold mb-4 text-primary">2. Verilerin Kullanımı</h2>
                                <p className="text-muted-foreground leading-relaxed">
                                    Toplanan veriler aşağıdaki amaçlar için kullanılır:
                                </p>
                                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                                    <li>Hesap yönetimi ve kimlik doğrulama</li>
                                    <li>İzleme geçmişine dayalı video önerileri</li>
                                    <li>Premium üyelik işlemlerinin yönetilmesi</li>
                                    <li>Sistem güncellemeleri ve teknik destek iletişimi</li>
                                </ul>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-xl font-semibold mb-4 text-primary">3. Veri Güvenliği</h2>
                                <p className="text-muted-foreground leading-relaxed">
                                    Verileriniz Firebase (Google Cloud) altyapısında, endüstri standardı şifreleme yöntemleri ile
                                    korunmaktadır. Ödeme bilgileriniz doğrudan Stripe altyapısı üzerinden işlenir ve sunucularımızda
                                    asla saklanmaz.
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-xl font-semibold mb-4 text-primary">4. Çerezler (Cookies)</h2>
                                <p className="text-muted-foreground leading-relaxed">
                                    Oturumunuzu açık tutmak ve tercihlerinizi hatırlamak için zorunlu çerezler kullanıyoruz.
                                    Üçüncü taraf analiz araçları (Google Analytics gibi) anonimleştirilmiş kullanım verileri toplayabilir.
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-xl font-semibold mb-4 text-primary">5. İletişim</h2>
                                <p className="text-muted-foreground leading-relaxed">
                                    Gizlilik politikamız hakkındaki sorularınız için <span className="text-primary font-medium">destek@hdyatak.com</span> adresinden
                                    bizimle iletişime geçebilirsiniz.
                                </p>
                            </section>
                        </CardContent>
                    </Card>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Privacy;
