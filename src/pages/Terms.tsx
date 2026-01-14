import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";

const Terms = () => {
    return (
        <div className="min-h-screen bg-background">
            <Header />

            <main className="pt-24 pb-12">
                <div className="container mx-auto px-4 max-w-4xl">
                    <Card className="border-border/40 bg-background/50 backdrop-blur-sm">
                        <CardHeader className="text-center pb-8 border-b border-border/40">
                            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FileText className="text-primary" size={32} />
                            </div>
                            <CardTitle className="text-3xl font-bold">Kullanım Koşulları</CardTitle>
                            <p className="text-muted-foreground mt-2">Son güncelleme: 14 Ocak 2024</p>
                        </CardHeader>
                        <CardContent className="pt-8 prose prose-invert max-w-none">
                            <section className="mb-8">
                                <h2 className="text-xl font-semibold mb-4 text-primary">1. Hizmet Şartları</h2>
                                <p className="text-muted-foreground leading-relaxed">
                                    HD Yatak Premium Video Hub platformuna erişerek ve kullanarak, bu kullanım koşullarını kabul etmiş
                                    sayılırsınız. Platformun amacı, yetişkin kullanıcılara premium video içeriği sunmaktır.
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-xl font-semibold mb-4 text-primary">2. Üyelik ve Abonelik</h2>
                                <p className="text-muted-foreground leading-relaxed">
                                    Premium içeriklere erişim ücretli abonelik gerektirir. Abonelikler aylık veya yıllık olarak
                                    yenilenir. Kullanıcı istediği zaman aboneliğini iptal edebilir, ancak mevcut dönem için iade
                                    yapılmaz.
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-xl font-semibold mb-4 text-primary">3. Fikri Mülkiyet</h2>
                                <p className="text-muted-foreground leading-relaxed">
                                    Platformdaki tüm videolar, görseller ve yazılımlar HD Yatak'ın mülkiyetindedir. İçeriklerin
                                    kopyalanması, indirilmesi (izin verilenler hariç) veya başka platformlarda paylaşılması kesinlikle
                                    yasaktır.
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-xl font-semibold mb-4 text-primary">4. Kullanıcı Sorumlulukları</h2>
                                <p className="text-muted-foreground leading-relaxed">
                                    Kullanıcılar hesap bilgilerini üçüncü şahıslarla paylaşmamayı taahhüt eder. Platformun
                                    kötüye kullanılması, sistemlere zarar verilmeye çalışılması durumunda hesaplar süresiz olarak
                                    askıya alınır.
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-xl font-semibold mb-4 text-primary">5. Değişiklik Hakları</h2>
                                <p className="text-muted-foreground leading-relaxed">
                                    Platform yönetimi, fiyatlandırma ve kullanım koşullarında önceden haber vererek değişiklik yapma
                                    hakkını saklı tutar.
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

export default Terms;
