import { useState, useRef } from "react";
import { Upload, X, FileVideo, Image, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useVideos } from "@/hooks/useVideos";
import { useAuthContext } from "@/contexts/AuthContext";
import type { Video } from "@/integrations/firebase/types";

interface VideoUploadProps {
  onUploadComplete?: (video: Video) => void;
  onClose?: () => void;
}

const VideoUpload = ({ onUploadComplete, onClose }: VideoUploadProps) => {
  const { user, profile } = useAuthContext();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    tags: "",
    isPremium: false,
    isShort: false,
  });

  const [files, setFiles] = useState({
    video: null as File | null,
    thumbnail: null as File | null,
  });

  const [previews, setPreviews] = useState({
    video: "",
    thumbnail: "",
  });

  const [uploadProgress, setUploadProgress] = useState({
    video: 0,
    thumbnail: 0,
  });

  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const videoInputRef = useRef<HTMLInputElement>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);

  const categories = [
    "Film", "Müzik", "Oyun", "Spor", "Eğlence", "Eğitim",
    "Teknoloji", "Seyahat", "Yemek", "Moda", "Haberler"
  ];

  const handleFileSelect = (type: 'video' | 'thumbnail', file: File | null) => {
    if (!file) return;

    // Validate file types
    if (type === 'video' && !file.type.startsWith('video/')) {
      toast({
        title: "Hata",
        description: "Lütfen geçerli bir video dosyası seçin.",
        variant: "destructive",
      });
      return;
    }

    if (type === 'thumbnail' && !file.type.startsWith('image/')) {
      toast({
        title: "Hata",
        description: "Lütfen geçerli bir resim dosyası seçin.",
        variant: "destructive",
      });
      return;
    }

    // Validate file sizes
    const maxVideoSize = 2048 * 1024 * 1024; // 2GB
    const maxThumbnailSize = 5 * 1024 * 1024; // 5MB

    if (type === 'video' && file.size > maxVideoSize) {
      toast({
        title: "Hata",
        description: "Video dosyası 2GB'dan büyük olamaz.",
        variant: "destructive",
      });
      return;
    }

    if (type === 'thumbnail' && file.size > maxThumbnailSize) {
      toast({
        title: "Hata",
        description: "Küçük resim dosyası 5MB'dan büyük olamaz.",
        variant: "destructive",
      });
      return;
    }

    setFiles(prev => ({ ...prev, [type]: file }));

    // Create preview URLs
    if (type === 'thumbnail') {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviews(prev => ({ ...prev, thumbnail: e.target?.result as string }));
      };
      reader.readAsDataURL(file);
    } else {
      setPreviews(prev => ({ ...prev, video: URL.createObjectURL(file) }));
    }
  };

  const removeFile = (type: 'video' | 'thumbnail') => {
    setFiles(prev => ({ ...prev, [type]: null }));
    setPreviews(prev => ({ ...prev, [type]: "" }));
    setUploadProgress(prev => ({ ...prev, [type]: 0 }));

    if (type === 'video' && videoInputRef.current) {
      videoInputRef.current.value = "";
    }
    if (type === 'thumbnail' && thumbnailInputRef.current) {
      thumbnailInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast({
        title: "Hata",
        description: "Oturum açmanız gerekiyor.",
        variant: "destructive",
      });
      return;
    }

    if (!files.video) {
      toast({
        title: "Hata",
        description: "Lütfen bir video dosyası seçin.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.title.trim()) {
      toast({
        title: "Hata",
        description: "Video başlığı zorunludur.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.category) {
      toast({
        title: "Hata",
        description: "Lütfen bir kategori seçin.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    setIsProcessing(true);

    try {
      // Upload video file
      const videoPath = `videos/${user.id}/${Date.now()}_${files.video.name}`;
      const videoUrl = await storageService.uploadFile(files.video, videoPath);
      setUploadProgress(prev => ({ ...prev, video: 100 }));

      // Upload thumbnail if provided
      let thumbnailUrl = "";
      if (files.thumbnail) {
        const thumbnailPath = `thumbnails/${user.id}/${Date.now()}_${files.thumbnail.name}`;
        thumbnailUrl = await storageService.uploadFile(files.thumbnail, thumbnailPath);
        setUploadProgress(prev => ({ ...prev, thumbnail: 100 }));
      }

      // Create video record in Firestore
      const tags = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);

      const videoData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        videoUrl,
        thumbnailUrl: thumbnailUrl || "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80",
        duration: "00:00", // This would be calculated from the video file
        views: 0,
        likes: 0,
        dislikes: 0,
        category: formData.category,
        tags,
        uploaderId: user.id,
        uploaderName: user.user_metadata?.full_name || user.email || "Anonim",
        uploaderAvatar: user.user_metadata?.avatar_url || "",
        isPremium: formData.isPremium,
        isShort: formData.isShort,
      };

      const videoId = await videoService.createVideo(videoData);

      const newVideo: Video = {
        id: videoId,
        ...videoData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      toast({
        title: "Başarılı",
        description: "Video başarıyla yüklendi!",
      });

      onUploadComplete?.(newVideo);
      onClose?.();

    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Hata",
        description: "Video yüklenirken bir hata oluştu. Lütfen tekrar deneyin.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      setIsProcessing(false);
    }
  };

  const isFormValid = formData.title.trim() && formData.category && files.video;

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload size={24} />
          Video Yükle
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Video File Upload */}
          <div className="space-y-2">
            <Label htmlFor="video">Video Dosyası *</Label>
            <div className="border-2 border-dashed border-border rounded-lg p-6">
              {files.video ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileVideo size={24} className="text-primary" />
                    <div>
                      <p className="font-medium">{files.video.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {(files.video.size / (1024 * 1024)).toFixed(1)} MB
                      </p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile('video')}
                    disabled={isUploading}
                  >
                    <X size={16} />
                  </Button>
                </div>
              ) : (
                <div className="text-center">
                  <FileVideo size={48} className="mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground mb-4">
                    MP4, WebM veya MOV formatında bir video dosyası seçin
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => videoInputRef.current?.click()}
                  >
                    Video Seç
                  </Button>
                </div>
              )}
              <input
                ref={videoInputRef}
                type="file"
                id="video"
                accept="video/*"
                onChange={(e) => handleFileSelect('video', e.target.files?.[0] || null)}
                className="hidden"
              />
            </div>
            {uploadProgress.video > 0 && uploadProgress.video < 100 && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Video yükleniyor...</span>
                  <span>{uploadProgress.video}%</span>
                </div>
                <Progress value={uploadProgress.video} />
              </div>
            )}
          </div>

          {/* Thumbnail Upload */}
          <div className="space-y-2">
            <Label htmlFor="thumbnail">Küçük Resim (Opsiyonel)</Label>
            <div className="border-2 border-dashed border-border rounded-lg p-6">
              {files.thumbnail ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={previews.thumbnail}
                      alt="Thumbnail preview"
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div>
                      <p className="font-medium">{files.thumbnail.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {(files.thumbnail.size / (1024 * 1024)).toFixed(1)} MB
                      </p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile('thumbnail')}
                    disabled={isUploading}
                  >
                    <X size={16} />
                  </Button>
                </div>
              ) : (
                <div className="text-center">
                  <Image size={48} className="mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground mb-4">
                    JPG, PNG veya WebP formatında bir resim dosyası seçin
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => thumbnailInputRef.current?.click()}
                  >
                    Küçük Resim Seç
                  </Button>
                </div>
              )}
              <input
                ref={thumbnailInputRef}
                type="file"
                id="thumbnail"
                accept="image/*"
                onChange={(e) => handleFileSelect('thumbnail', e.target.files?.[0] || null)}
                className="hidden"
              />
            </div>
            {uploadProgress.thumbnail > 0 && uploadProgress.thumbnail < 100 && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Küçük resim yükleniyor...</span>
                  <span>{uploadProgress.thumbnail}%</span>
                </div>
                <Progress value={uploadProgress.thumbnail} />
              </div>
            )}
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Başlık *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Video başlığını girin"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Açıklama</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Video açıklamasını girin"
              rows={3}
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">Kategori *</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Kategori seçin" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label htmlFor="tags">Etiketler</Label>
            <Input
              id="tags"
              value={formData.tags}
              onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
              placeholder="etiket1, etiket2, etiket3"
            />
            <p className="text-sm text-muted-foreground">
              Virgülle ayırarak birden fazla etiket ekleyebilirsiniz
            </p>
          </div>

          {/* Options */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Switch
                id="isPremium"
                checked={formData.isPremium}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isPremium: checked }))}
              />
              <Label htmlFor="isPremium">Premium Video</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                id="isShort"
                checked={formData.isShort}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isShort: checked }))}
              />
              <Label htmlFor="isShort">Shorts Videosu</Label>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <Button
              type="submit"
              disabled={!isFormValid || isUploading}
              className="flex-1"
            >
              {isUploading ? (
                <>
                  <Loader2 size={16} className="mr-2 animate-spin" />
                  {isProcessing ? "İşleniyor..." : "Yükleniyor..."}
                </>
              ) : (
                "Video Yükle"
              )}
            </Button>
            {onClose && (
              <Button type="button" variant="outline" onClick={onClose}>
                İptal
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default VideoUpload;
