import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Save, Bell, Shield, Palette, Globe, Monitor, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/Header";
import { useAuthContext } from "@/contexts/AuthContext";
import { toast } from "sonner";

const Settings = () => {
  const navigate = useNavigate();
  const { user } = useAuthContext();

  const [settings, setSettings] = useState({
    // Notifications
    emailNotifications: true,
    pushNotifications: true,
    videoRecommendations: true,
    newVideoAlerts: false,

    // Privacy
    profileVisibility: "public",
    watchHistory: true,
    searchHistory: true,

    // Appearance
    theme: "dark",
    language: "tr",

    // Playback
    autoplay: false,
    defaultQuality: "auto",
    captions: false,
  });

  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      // TODO: Save settings to Firebase
      toast.success("Ayarlar kaydedildi");
    } catch (error) {
      toast.error("Ayarlar kaydedilirken hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    navigate("/auth");
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-20 pb-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold">Ayarlar</h1>
            <Button onClick={handleSave} disabled={loading}>
              <Save size={16} className="mr-2" />
              {loading ? "Kaydediliyor..." : "Kaydet"}
            </Button>
          </div>

          <Tabs defaultValue="notifications" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="notifications">Bildirimler</TabsTrigger>
              <TabsTrigger value="privacy">Gizlilik</TabsTrigger>
              <TabsTrigger value="appearance">Görünüm</TabsTrigger>
              <TabsTrigger value="playback">Oynatma</TabsTrigger>
            </TabsList>

            <TabsContent value="notifications">
              <Card className="hdyatak-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell size={20} />
                    Bildirim Tercihleri
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="email-notifications" className="text-base font-medium">
                        E-posta Bildirimleri
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Önemli güncellemeler ve haberler için e-posta alın
                      </p>
                    </div>
                    <Switch
                      id="email-notifications"
                      checked={settings.emailNotifications}
                      onCheckedChange={(checked) =>
                        setSettings(prev => ({ ...prev, emailNotifications: checked }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="push-notifications" className="text-base font-medium">
                        Push Bildirimleri
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Tarayıcı üzerinden bildirim alın
                      </p>
                    </div>
                    <Switch
                      id="push-notifications"
                      checked={settings.pushNotifications}
                      onCheckedChange={(checked) =>
                        setSettings(prev => ({ ...prev, pushNotifications: checked }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="video-recommendations" className="text-base font-medium">
                        Video Önerileri
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        İlgi alanlarınıza göre video önerileri alın
                      </p>
                    </div>
                    <Switch
                      id="video-recommendations"
                      checked={settings.videoRecommendations}
                      onCheckedChange={(checked) =>
                        setSettings(prev => ({ ...prev, videoRecommendations: checked }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="new-video-alerts" className="text-base font-medium">
                        Yeni Video Uyarıları
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Takip ettiğiniz kanallardan yeni video bildirimleri
                      </p>
                    </div>
                    <Switch
                      id="new-video-alerts"
                      checked={settings.newVideoAlerts}
                      onCheckedChange={(checked) =>
                        setSettings(prev => ({ ...prev, newVideoAlerts: checked }))
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="privacy">
              <Card className="hdyatak-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield size={20} />
                    Gizlilik Ayarları
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label className="text-base font-medium">Profil Görünürlüğü</Label>
                    <Select
                      value={settings.profileVisibility}
                      onValueChange={(value) =>
                        setSettings(prev => ({ ...prev, profileVisibility: value }))
                      }
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="public">Herkese Açık</SelectItem>
                        <SelectItem value="friends">Sadece Arkadaşlar</SelectItem>
                        <SelectItem value="private">Gizli</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="watch-history" className="text-base font-medium">
                        İzleme Geçmişini Kaydet
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        İzleme geçmişiniz kişiselleştirilmiş öneriler için kullanılır
                      </p>
                    </div>
                    <Switch
                      id="watch-history"
                      checked={settings.watchHistory}
                      onCheckedChange={(checked) =>
                        setSettings(prev => ({ ...prev, watchHistory: checked }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="search-history" className="text-base font-medium">
                        Arama Geçmişini Kaydet
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Arama geçmişiniz daha iyi öneriler için kullanılır
                      </p>
                    </div>
                    <Switch
                      id="search-history"
                      checked={settings.searchHistory}
                      onCheckedChange={(checked) =>
                        setSettings(prev => ({ ...prev, searchHistory: checked }))
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="appearance">
              <Card className="hdyatak-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette size={20} />
                    Görünüm Ayarları
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label className="text-base font-medium">Tema</Label>
                    <Select
                      value={settings.theme}
                      onValueChange={(value) =>
                        setSettings(prev => ({ ...prev, theme: value }))
                      }
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Açık</SelectItem>
                        <SelectItem value="dark">Koyu</SelectItem>
                        <SelectItem value="auto">Otomatik</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-base font-medium">Dil</Label>
                    <Select
                      value={settings.language}
                      onValueChange={(value) =>
                        setSettings(prev => ({ ...prev, language: value }))
                      }
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tr">Türkçe</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="playback">
              <Card className="hdyatak-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Monitor size={20} />
                    Oynatma Ayarları
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="autoplay" className="text-base font-medium">
                        Otomatik Oynatma
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Videolar otomatik olarak oynatılır
                      </p>
                    </div>
                    <Switch
                      id="autoplay"
                      checked={settings.autoplay}
                      onCheckedChange={(checked) =>
                        setSettings(prev => ({ ...prev, autoplay: checked }))
                      }
                    />
                  </div>

                  <div>
                    <Label className="text-base font-medium">Varsayılan Kalite</Label>
                    <Select
                      value={settings.defaultQuality}
                      onValueChange={(value) =>
                        setSettings(prev => ({ ...prev, defaultQuality: value }))
                      }
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="auto">Otomatik</SelectItem>
                        <SelectItem value="144p">144p</SelectItem>
                        <SelectItem value="240p">240p</SelectItem>
                        <SelectItem value="360p">360p</SelectItem>
                        <SelectItem value="480p">480p</SelectItem>
                        <SelectItem value="720p">720p</SelectItem>
                        <SelectItem value="1080p">1080p</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="captions" className="text-base font-medium">
                        Altyazılar
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Varsayılan olarak altyazıları göster
                      </p>
                    </div>
                    <Switch
                      id="captions"
                      checked={settings.captions}
                      onCheckedChange={(checked) =>
                        setSettings(prev => ({ ...prev, captions: checked }))
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Settings;
