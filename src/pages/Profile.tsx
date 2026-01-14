import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Camera, Edit, Save, X, User, Mail, Calendar, Eye, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/Header";
import { useAuthContext } from "@/contexts/AuthContext";
import { toast } from "sonner";

const Profile = () => {
  const navigate = useNavigate();
  const { user, profile, isPremium } = useAuthContext();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    full_name: profile?.full_name || "",
    username: profile?.username || "",
  });

  const handleSave = async () => {
    setLoading(true);
    try {
      // TODO: Implement Firebase update
      toast.success("Profil güncellendi");
      setIsEditing(false);
    } catch (error) {
      toast.error("Profil güncellenirken hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      full_name: profile?.full_name || "",
      username: profile?.username || "",
    });
    setIsEditing(false);
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
          {/* Profile Header */}
          <Card className="hdyatak-card border-border mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                <div className="relative">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src={profile?.avatar_url} />
                    <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                      {user.email?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    size="icon"
                    variant="secondary"
                    className="absolute -bottom-2 -right-2 rounded-full w-8 h-8"
                  >
                    <Camera size={16} />
                  </Button>
                </div>

                <div className="flex-1 text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                    <h1 className="text-2xl font-bold">{profile?.full_name || user.email}</h1>
                    {isPremium && (
                      <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-hdyatak-gold/10 border border-hdyatak-gold/30">
                        <Crown size={14} className="text-hdyatak-gold" />
                        <span className="text-xs font-semibold hdyatak-premium-text">Premium</span>
                      </div>
                    )}
                  </div>
                  <p className="text-muted-foreground mb-4">{user.email}</p>

                  <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar size={16} />
                      <span>Katılma: {profile?.created_at ? new Date(profile.created_at).toLocaleDateString('tr-TR') : 'Bilinmiyor'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye size={16} />
                      <span>{profile?.videos_watched || 0} video izlendi</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  {!isEditing ? (
                    <Button onClick={() => setIsEditing(true)} variant="outline">
                      <Edit size={16} className="mr-2" />
                      Düzenle
                    </Button>
                  ) : (
                    <>
                      <Button onClick={handleSave} disabled={loading}>
                        <Save size={16} className="mr-2" />
                        {loading ? "Kaydediliyor..." : "Kaydet"}
                      </Button>
                      <Button onClick={handleCancel} variant="outline">
                        <X size={16} className="mr-2" />
                        İptal
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Profile Content */}
          <Tabs defaultValue="info" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="info">Bilgiler</TabsTrigger>
              <TabsTrigger value="activity">Aktivite</TabsTrigger>
              <TabsTrigger value="settings">Ayarlar</TabsTrigger>
            </TabsList>

            <TabsContent value="info">
              <Card className="hdyatak-card border-border">
                <CardHeader>
                  <CardTitle>Kişisel Bilgiler</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="full_name">Ad Soyad</Label>
                      <Input
                        id="full_name"
                        value={formData.full_name}
                        onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                        disabled={!isEditing}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="username">Kullanıcı Adı</Label>
                      <Input
                        id="username"
                        value={formData.username}
                        onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                        disabled={!isEditing}
                        className="mt-2"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">E-posta</Label>
                    <Input
                      id="email"
                      value={user.email || ""}
                      disabled
                      className="mt-2"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      E-posta adresi değiştirilemez
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activity">
              <Card className="hdyatak-card border-border">
                <CardHeader>
                  <CardTitle>İzleme Geçmişi</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    <Eye size={48} className="mx-auto mb-4 opacity-50" />
                    <p>Henüz izleme geçmişiniz bulunmuyor</p>
                    <p className="text-sm">Videoları izlemeye başlayın!</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings">
              <Card className="hdyatak-card border-border">
                <CardHeader>
                  <CardTitle>Hesap Ayarları</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div>
                      <h4 className="font-medium">Şifre Değiştir</h4>
                      <p className="text-sm text-muted-foreground">Hesap güvenliğiniz için şifrenizi değiştirin</p>
                    </div>
                    <Button variant="outline">Değiştir</Button>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div>
                      <h4 className="font-medium">Bildirimler</h4>
                      <p className="text-sm text-muted-foreground">E-posta ve push bildirim tercihleri</p>
                    </div>
                    <Button variant="outline">Ayarla</Button>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-destructive/20 rounded-lg">
                    <div>
                      <h4 className="font-medium text-destructive">Hesabı Sil</h4>
                      <p className="text-sm text-muted-foreground">Bu işlem geri alınamaz</p>
                    </div>
                    <Button variant="destructive">Hesabı Sil</Button>
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

export default Profile;
