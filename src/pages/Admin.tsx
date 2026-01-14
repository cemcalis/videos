import { useState } from "react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Video, Settings, BarChart3, Shield } from "lucide-react";
import AdminGuard from "@/components/AdminGuard";

const Admin = () => {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <AdminGuard>
      <div className="min-h-screen bg-background">
        <Header />

        <main className="pt-20 pb-8">
          <div className="container mx-auto px-4">
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="h-8 w-8 text-primary" />
                <h1 className="text-3xl font-bold">Admin Paneli</h1>
              </div>
              <p className="text-muted-foreground">Sistem yönetimi ve istatistikler</p>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Genel Bakış</TabsTrigger>
                <TabsTrigger value="users">Kullanıcılar</TabsTrigger>
                <TabsTrigger value="videos">Videolar</TabsTrigger>
                <TabsTrigger value="settings">Ayarlar</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Toplam Kullanıcı</CardTitle>
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">1,234</div>
                      <p className="text-xs text-muted-foreground">+12% geçen aydan</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Toplam Video</CardTitle>
                      <Video className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">5,678</div>
                      <p className="text-xs text-muted-foreground">+8% geçen aydan</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Premium Kullanıcı</CardTitle>
                      <BarChart3 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">456</div>
                      <p className="text-xs text-muted-foreground">+15% geçen aydan</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Aktif Oturum</CardTitle>
                      <Settings className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">89</div>
                      <p className="text-xs text-muted-foreground">Şu anda aktif</p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="users">
                <Card>
                  <CardHeader>
                    <CardTitle>Kullanıcı Yönetimi</CardTitle>
                    <CardDescription>Tüm kullanıcıları görüntüleyin ve yönetin</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">Kullanıcı listesi burada görüntülenecek.</p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="videos">
                <Card>
                  <CardHeader>
                    <CardTitle>Video Yönetimi</CardTitle>
                    <CardDescription>Videoları yükleyin ve yönetin</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">Video yönetim araçları burada olacak.</p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="settings">
                <Card>
                  <CardHeader>
                    <CardTitle>Sistem Ayarları</CardTitle>
                    <CardDescription>Uygulama ayarlarını yapılandırın</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">Sistem ayarları burada yönetilecek.</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </AdminGuard>
  );
};

export default Admin;
