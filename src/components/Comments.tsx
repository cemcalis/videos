import { useState, useEffect } from "react";
import { useAuthContext } from "@/contexts/AuthContext";
import { db } from "@/integrations/firebase/client";
import {
    collection,
    addDoc,
    query,
    where,
    orderBy,
    onSnapshot,
    serverTimestamp,
    Timestamp
} from "firebase/firestore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { toast } from "sonner";

interface Comment {
    id: string;
    text: string;
    userId: string;
    userName: string;
    userAvatar: string;
    createdAt: any;
}

interface CommentsProps {
    videoId: string;
}

export const Comments = ({ videoId }: CommentsProps) => {
    const { user, profile } = useAuthContext();
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!videoId) return;

        const q = query(
            collection(db, "comments"),
            where("videoId", "==", videoId),
            orderBy("createdAt", "desc")
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const commentsData: Comment[] = [];
            snapshot.forEach((doc) => {
                commentsData.push({ id: doc.id, ...doc.data() } as Comment);
            });
            setComments(commentsData);
        });

        return () => unsubscribe();
    }, [videoId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !newComment.trim()) return;

        setIsSubmitting(true);
        try {
            await addDoc(collection(db, "comments"), {
                videoId,
                text: newComment.trim(),
                userId: user.uid,
                userName: profile?.name || user.email || "Anonim",
                userAvatar: profile?.avatar || "",
                createdAt: serverTimestamp(),
            });
            setNewComment("");
            toast.success("Yorumunuz eklendi");
        } catch (error) {
            console.error("Error adding comment:", error);
            toast.error("Yorum eklenirken bir hata oluştu");
        } finally {
            setIsSubmitting(false);
        }
    };

    const formatDate = (at: any) => {
        if (!at) return "Az önce";
        const date = at instanceof Timestamp ? at.toDate() : new Date(at);
        return formatDistanceToNow(date, { addSuffix: true, locale: tr });
    };

    return (
        <div className="space-y-6">
            {/* Add Comment Form */}
            {user ? (
                <form onSubmit={handleSubmit} className="space-y-3">
                    <div className="flex gap-3">
                        <Avatar className="h-8 w-8">
                            <AvatarImage src={profile?.avatar || ""} />
                            <AvatarFallback>{(profile?.name || user.email || "U")[0].toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-2">
                            <Textarea
                                placeholder="Yorumunuzu yazın..."
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                className="min-h-[80px] resize-none"
                            />
                            <div className="flex justify-end">
                                <Button
                                    type="submit"
                                    disabled={isSubmitting || !newComment.trim()}
                                    size="sm"
                                >
                                    Yorum Yap
                                </Button>
                            </div>
                        </div>
                    </div>
                </form>
            ) : (
                <div className="p-4 bg-muted rounded-lg text-center">
                    <p className="text-sm text-muted-foreground">
                        Yorum yapabilmek için giriş yapmalısınız.
                    </p>
                </div>
            )}

            {/* List Comments */}
            <div className="space-y-5">
                {comments.length > 0 ? (
                    comments.map((comment) => (
                        <div key={comment.id} className="flex gap-3">
                            <Avatar className="h-8 w-8">
                                <AvatarImage src={comment.userAvatar} />
                                <AvatarFallback>{comment.userName[0].toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-sm font-semibold">{comment.userName}</span>
                                    <span className="text-xs text-muted-foreground">
                                        {formatDate(comment.createdAt)}
                                    </span>
                                </div>
                                <p className="text-sm text-foreground/90 leading-relaxed">
                                    {comment.text}
                                </p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-sm text-muted-foreground py-4">
                        Henüz yorum yapılmamış. İlk yorumu siz yapın!
                    </p>
                )}
            </div>
        </div>
    );
};

export default Comments;
