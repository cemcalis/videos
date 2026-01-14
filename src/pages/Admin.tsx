import { useState } from "react";
import { 
  Users, Video, Megaphone, Settings, BarChart3, 
  Search, Plus, Edit, Trash2, Eye, Crown, 
  TrendingUp, DollarSign, Globe, Shield, Upload,
  Image, Link as LinkIcon, Clock, MapPin, ToggleLeft, ToggleRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import Logo from "@/components/Logo";
import { mockUsers, mockVideos, mockAds } from "@/data/mockData";
import { Link } from "react-router-dom";

const Admin = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  const stats = [
    { label: "Toplam Kullanıcı", value: "12,458", icon: Users, change: "+12%" },
    { label: "Toplam Video", value: "3,842", icon: Video, change: "+8%" },
    { label: "Aktif Reklam", value: "24", icon: Megaphone, change: "+3%" },
    { label: "Gelir (Bu Ay)", value: "₺45,200", icon: DollarSign, change: "+18%" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-card border-b border-border">
        <div className="flex items-center justify-between px-6 h-16">
          <div className="flex items-center gap-4">
            <Logo size="sm" />
            <div className="h-6 w-px bg-border" />
            <span className="text-sm font-medium text-muted-foreground">Admin Panel</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="outline" size="sm">
                <Eye size={16} className="mr-2" />
                Siteyi Görüntüle
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <span className="text-xs font-bold text-primary-foreground">A</span>
              </div>
              <span className="text-sm font-medium">Admin</span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex pt-16">
        {/* Sidebar */}
        <aside className="fixed left-0 top-16 bottom-0 w-64 bg-card border-r border-border p-4 overflow-y-auto">
          <nav className="space-y-1">
            {[
              { id: "dashboard", label: "Dashboard", icon: BarChart3 },
              { id: "users", label: "Kullanıcı Yönetimi", icon: Users },
              { id: "videos", label: "Video Yönetimi", icon: Video },
              { id: "upload", label: "Video Yükle", icon: Upload },
              { id: "ads", label: "Reklam Yönetimi", icon: Megaphone },
              { id: "seo", label: "SEO Yönetimi", icon: Globe },
              { id: "settings", label: "Ayarlar", icon: Settings },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  activeTab === item.id
                    ? "bg-primary text-primary-foreground hdyatak-glow"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                <item.icon size={20} />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="ml-64 flex-1 p-6">
          {/* Dashboard */}
          {activeTab === "dashboard" && (
            <div className="space-y-6 animate-fade-in">
              <h1 className="text-2xl font-bold">Dashboard</h1>
              
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat) => (
                  <Card key={stat.label} className="hdyatak-card border-border">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">{stat.label}</p>
                          <p className="text-2xl font-bold mt-1">{stat.value}</p>
                          <p className="text-xs text-green-500 mt-1 flex items-center gap-1">
                            <TrendingUp size={12} />
                            {stat.change}
                          </p>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                          <stat.icon size={24} className="text-primary" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="hdyatak-card border-border">
                  <CardHeader>
                    <CardTitle className="text-lg">Son Yüklenen Videolar</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {mockVideos.slice(0, 5).map((video) => (
                        <div key={video.id} className="flex items-center gap-3">
                          <img 
                            src={video.thumbnail} 
                            alt={video.title}
                            className="w-16 h-10 rounded object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{video.title}</p>
                            <p className="text-xs text-muted-foreground">{video.views} görüntüleme</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="hdyatak-card border-border">
                  <CardHeader>
                    <CardTitle className="text-lg">Premium Kullanıcılar</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {mockUsers.filter(u => u.isPremium).map((user) => (
                        <div key={user.id} className="flex items-center gap-3">
                          <img 
                            src={user.avatar} 
                            alt={user.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div className="flex-1">
                            <p className="text-sm font-medium flex items-center gap-2">
                              {user.name}
                              <Crown size={14} className="text-hdyatak-gold" />
                            </p>
                            <p className="text-xs text-muted-foreground">{user.email}</p>
                          </div>
                          <span className="text-xs text-muted-foreground">{user.videosWatched} video</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Users Management */}
          {activeTab === "users" && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Kullanıcı Yönetimi</h1>
                <Button className="bg-primary text-primary-foreground">
                  <Plus size={16} className="mr-2" />
                  Kullanıcı Ekle
                </Button>
              </div>

              <div className="flex gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                  <Input placeholder="Kullanıcı ara..." className="pl-10" />
                </div>
                <Select defaultValue="all">
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filtrele" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tüm Kullanıcılar</SelectItem>
                    <SelectItem value="premium">Premium</SelectItem>
                    <SelectItem value="free">Ücretsiz</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Card className="hdyatak-card border-border">
                <CardContent className="p-0">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">Kullanıcı</th>
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">Email</th>
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">Üyelik</th>
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">Kayıt Tarihi</th>
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">İzlenen Video</th>
                        <th className="text-right p-4 text-sm font-medium text-muted-foreground">İşlemler</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockUsers.map((user) => (
                        <tr key={user.id} className="border-b border-border/50 hover:bg-secondary/50">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full" />
                              <span className="font-medium">{user.name}</span>
                            </div>
                          </td>
                          <td className="p-4 text-sm text-muted-foreground">{user.email}</td>
                          <td className="p-4">
                            {user.isPremium ? (
                              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-hdyatak-gold/10 text-hdyatak-gold text-xs font-medium">
                                <Crown size={12} />
                                Premium
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-1 rounded-full bg-muted text-muted-foreground text-xs font-medium">
                                Ücretsiz
                              </span>
                            )}
                          </td>
                          <td className="p-4 text-sm text-muted-foreground">{user.joinedAt}</td>
                          <td className="p-4 text-sm">{user.videosWatched}</td>
                          <td className="p-4">
                            <div className="flex items-center justify-end gap-2">
                              <Button variant="ghost" size="icon">
                                <Edit size={16} />
                              </Button>
                              <Button variant="ghost" size="icon" className="text-destructive">
                                <Trash2 size={16} />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Videos Management */}
          {activeTab === "videos" && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Video Yönetimi</h1>
                <Button className="bg-primary text-primary-foreground" onClick={() => setActiveTab("upload")}>
                  <Upload size={16} className="mr-2" />
                  Video Yükle
                </Button>
              </div>

              <div className="flex gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                  <Input placeholder="Video ara..." className="pl-10" />
                </div>
                <Select defaultValue="all">
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tüm Kategoriler</SelectItem>
                    <SelectItem value="film">Film</SelectItem>
                    <SelectItem value="music">Müzik</SelectItem>
                    <SelectItem value="gaming">Oyun</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mockVideos.map((video) => (
                  <Card key={video.id} className="hdyatak-card border-border overflow-hidden">
                    <div className="relative aspect-video">
                      <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
                      <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-background/90 text-xs">
                        {video.duration}
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-medium line-clamp-2 mb-2">{video.title}</h3>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>{video.views} görüntüleme</span>
                        <span>{video.uploadedAt}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-4">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Edit size={14} className="mr-1" />
                          Düzenle
                        </Button>
                        <Button variant="outline" size="sm" className="text-destructive">
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Video Upload */}
          {activeTab === "upload" && (
            <div className="space-y-6 animate-fade-in max-w-3xl">
              <h1 className="text-2xl font-bold">Video Yükle</h1>

              <Card className="hdyatak-card border-border">
                <CardContent className="p-6 space-y-6">
                  <div className="border-2 border-dashed border-border rounded-xl p-12 text-center">
                    <Upload size={48} className="mx-auto text-muted-foreground mb-4" />
                    <p className="text-lg font-medium mb-2">Video dosyası seçin veya sürükleyin</p>
                    <p className="text-sm text-muted-foreground mb-4">MP4, WebM, MOV - Max 2GB</p>
                    <Button>Dosya Seç</Button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="title">Video Başlığı</Label>
                      <Input id="title" placeholder="Video başlığını girin" className="mt-2" />
                    </div>

                    <div>
                      <Label htmlFor="description">Açıklama</Label>
                      <Textarea id="description" placeholder="Video açıklaması..." className="mt-2" rows={4} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Kategori</Label>
                        <Select>
                          <SelectTrigger className="mt-2">
                            <SelectValue placeholder="Kategori seçin" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="film">Film</SelectItem>
                            <SelectItem value="music">Müzik</SelectItem>
                            <SelectItem value="gaming">Oyun</SelectItem>
                            <SelectItem value="education">Eğitim</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Görünürlük</Label>
                        <Select>
                          <SelectTrigger className="mt-2">
                            <SelectValue placeholder="Görünürlük" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="public">Herkese Açık</SelectItem>
                            <SelectItem value="unlisted">Liste Dışı</SelectItem>
                            <SelectItem value="private">Özel</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="thumbnail">Küçük Resim</Label>
                      <div className="mt-2 flex items-center gap-4">
                        <div className="w-40 aspect-video rounded-lg bg-secondary flex items-center justify-center">
                          <Image size={24} className="text-muted-foreground" />
                        </div>
                        <Button variant="outline">Resim Yükle</Button>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 pt-4">
                      <Switch id="shorts" />
                      <Label htmlFor="shorts">Bu bir Shorts videosu</Label>
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <Button className="flex-1 bg-primary text-primary-foreground">
                      <Upload size={16} className="mr-2" />
                      Yükle
                    </Button>
                    <Button variant="outline">İptal</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Ads Management */}
          {activeTab === "ads" && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Reklam Yönetimi</h1>
                <Button className="bg-primary text-primary-foreground">
                  <Plus size={16} className="mr-2" />
                  Yeni Reklam
                </Button>
              </div>

              {/* Ad Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="hdyatak-card border-border">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                        <ToggleRight size={24} className="text-green-500" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">12</p>
                        <p className="text-sm text-muted-foreground">Aktif Reklam</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="hdyatak-card border-border">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Eye size={24} className="text-primary" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">1.2M</p>
                        <p className="text-sm text-muted-foreground">Toplam Gösterim</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="hdyatak-card border-border">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                        <TrendingUp size={24} className="text-blue-500" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">2.4%</p>
                        <p className="text-sm text-muted-foreground">Ortalama CTR</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Ads List */}
              <Card className="hdyatak-card border-border">
                <CardHeader>
                  <CardTitle>Tüm Reklamlar</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockAds.map((ad) => (
                      <div key={ad.id} className="flex items-center gap-4 p-4 rounded-lg bg-secondary/50">
                        <img src={ad.imageUrl} alt={ad.name} className="w-24 h-16 rounded object-cover" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{ad.name}</h4>
                            <span className={`px-2 py-0.5 rounded-full text-xs ${
                              ad.isActive ? 'bg-green-500/10 text-green-500' : 'bg-muted text-muted-foreground'
                            }`}>
                              {ad.isActive ? 'Aktif' : 'Pasif'}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <MapPin size={12} />
                              {ad.position === 'top' ? 'Üst' : ad.position === 'sidebar' ? 'Kenar' : 'İçerik'}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock size={12} />
                              {ad.duration}s
                            </span>
                            <span className="flex items-center gap-1">
                              <Eye size={12} />
                              {ad.impressions.toLocaleString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <LinkIcon size={12} />
                              {ad.clicks.toLocaleString()} tık
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch checked={ad.isActive} />
                          <Button variant="ghost" size="icon">
                            <Edit size={16} />
                          </Button>
                          <Button variant="ghost" size="icon" className="text-destructive">
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Ad Form */}
              <Card className="hdyatak-card border-border">
                <CardHeader>
                  <CardTitle>Yeni Reklam Ekle</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Reklam Adı</Label>
                      <Input placeholder="Reklam adı" className="mt-2" />
                    </div>
                    <div>
                      <Label>Konum</Label>
                      <Select>
                        <SelectTrigger className="mt-2">
                          <SelectValue placeholder="Konum seçin" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="top">Üst Banner</SelectItem>
                          <SelectItem value="sidebar">Kenar Çubuğu</SelectItem>
                          <SelectItem value="inline">İçerik Arası</SelectItem>
                          <SelectItem value="bottom">Alt Banner</SelectItem>
                          <SelectItem value="video-pre">Video Öncesi</SelectItem>
                          <SelectItem value="video-mid">Video Ortası</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Görsel URL</Label>
                      <Input placeholder="https://example.com/image.jpg" className="mt-2" />
                    </div>
                    <div>
                      <Label>Hedef URL</Label>
                      <Input placeholder="https://example.com" className="mt-2" />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label>Gösterim Süresi (sn)</Label>
                      <Input type="number" placeholder="30" className="mt-2" />
                    </div>
                    <div>
                      <Label>Başlangıç Tarihi</Label>
                      <Input type="date" className="mt-2" />
                    </div>
                    <div>
                      <Label>Bitiş Tarihi</Label>
                      <Input type="date" className="mt-2" />
                    </div>
                  </div>

                  <div className="flex items-center gap-4 pt-4">
                    <Switch id="ad-active" />
                    <Label htmlFor="ad-active">Reklamı hemen aktif et</Label>
                  </div>

                  <Button className="bg-primary text-primary-foreground">
                    <Plus size={16} className="mr-2" />
                    Reklam Oluştur
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {/* SEO Management */}
          {activeTab === "seo" && (
            <div className="space-y-6 animate-fade-in max-w-3xl">
              <h1 className="text-2xl font-bold">SEO Yönetimi</h1>

              <Card className="hdyatak-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe size={20} />
                    Genel SEO Ayarları
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Site Başlığı</Label>
                    <Input defaultValue="HDYatak - En İyi Video İzleme Platformu" className="mt-2" />
                  </div>
                  <div>
                    <Label>Meta Açıklama</Label>
                    <Textarea 
                      defaultValue="HDYatak ile binlerce video izleyin. Film, müzik, oyun ve daha fazlası. HD kalitede, reklamsız premium deneyim." 
                      className="mt-2" 
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label>Anahtar Kelimeler</Label>
                    <Input 
                      defaultValue="video izle, film izle, dizi izle, hd video, türkçe video" 
                      className="mt-2" 
                    />
                  </div>
                  <div>
                    <Label>Canonical URL</Label>
                    <Input defaultValue="https://hdyatak.com" className="mt-2" />
                  </div>
                </CardContent>
              </Card>

              <Card className="hdyatak-card border-border">
                <CardHeader>
                  <CardTitle>Sosyal Medya Meta Etiketleri</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>OG Başlık</Label>
                    <Input defaultValue="HDYatak - Video İzle" className="mt-2" />
                  </div>
                  <div>
                    <Label>OG Açıklama</Label>
                    <Textarea 
                      defaultValue="Türkiye'nin en iyi video platformu" 
                      className="mt-2" 
                      rows={2}
                    />
                  </div>
                  <div>
                    <Label>OG Görsel URL</Label>
                    <Input placeholder="https://hdyatak.com/og-image.jpg" className="mt-2" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Twitter Card Tipi</Label>
                      <Select defaultValue="summary_large">
                        <SelectTrigger className="mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="summary">Summary</SelectItem>
                          <SelectItem value="summary_large">Summary Large Image</SelectItem>
                          <SelectItem value="player">Player</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Twitter Hesabı</Label>
                      <Input defaultValue="@hdyatak" className="mt-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hdyatak-card border-border">
                <CardHeader>
                  <CardTitle>Robots & Sitemap</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Robots.txt</Label>
                    <Textarea 
                      defaultValue={`User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api\n\nSitemap: https://hdyatak.com/sitemap.xml`}
                      className="mt-2 font-mono text-sm" 
                      rows={6}
                    />
                  </div>
                  <div className="flex items-center gap-4">
                    <Switch id="auto-sitemap" defaultChecked />
                    <Label htmlFor="auto-sitemap">Otomatik sitemap oluştur</Label>
                  </div>
                </CardContent>
              </Card>

              <Button className="bg-primary text-primary-foreground">
                <Shield size={16} className="mr-2" />
                Değişiklikleri Kaydet
              </Button>
            </div>
          )}

          {/* Settings */}
          {activeTab === "settings" && (
            <div className="space-y-6 animate-fade-in max-w-3xl">
              <h1 className="text-2xl font-bold">Genel Ayarlar</h1>

              <Card className="hdyatak-card border-border">
                <CardHeader>
                  <CardTitle>Site Ayarları</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Site Adı</Label>
                    <Input defaultValue="HDYatak" className="mt-2" />
                  </div>
                  <div>
                    <Label>Site URL</Label>
                    <Input defaultValue="https://hdyatak.com" className="mt-2" />
                  </div>
                  <div>
                    <Label>İletişim Email</Label>
                    <Input defaultValue="info@hdyatak.com" className="mt-2" />
                  </div>
                </CardContent>
              </Card>

              <Card className="hdyatak-card border-border">
                <CardHeader>
                  <CardTitle>Premium Ayarları</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Aylık Fiyat (₺)</Label>
                      <Input type="number" defaultValue="49.90" className="mt-2" />
                    </div>
                    <div>
                      <Label>Yıllık Fiyat (₺)</Label>
                      <Input type="number" defaultValue="449.90" className="mt-2" />
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Switch id="premium-enabled" defaultChecked />
                    <Label htmlFor="premium-enabled">Premium üyelik aktif</Label>
                  </div>
                </CardContent>
              </Card>

              <Card className="hdyatak-card border-border">
                <CardHeader>
                  <CardTitle>Video Ayarları</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Maksimum Video Boyutu (MB)</Label>
                      <Input type="number" defaultValue="2048" className="mt-2" />
                    </div>
                    <div>
                      <Label>Desteklenen Formatlar</Label>
                      <Input defaultValue="mp4, webm, mov" className="mt-2" />
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Switch id="auto-quality" defaultChecked />
                    <Label htmlFor="auto-quality">Otomatik kalite ayarı</Label>
                  </div>
                  <div className="flex items-center gap-4">
                    <Switch id="autoplay" />
                    <Label htmlFor="autoplay">Otomatik oynatma (Shorts)</Label>
                  </div>
                </CardContent>
              </Card>

              <Button className="bg-primary text-primary-foreground">
                <Settings size={16} className="mr-2" />
                Ayarları Kaydet
              </Button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Admin;
