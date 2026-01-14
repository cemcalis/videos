import { ThumbsUp, ThumbsDown, Share2, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface VideoActionsProps {
    videoId: string;
    likes: number;
    dislikes: number;
    onLike?: () => void;
    onDislike?: () => void;
    onShare?: () => void;
    className?: string;
    vertical?: boolean;
}

export const VideoActions = ({
    videoId,
    likes,
    dislikes,
    onLike,
    onDislike,
    onShare,
    className,
    vertical = false
}: VideoActionsProps) => {
    return (
        <div className={cn(
            "flex items-center gap-2",
            vertical ? "flex-col" : "flex-row",
            className
        )}>
            <Button
                variant="outline"
                size="sm"
                onClick={onLike}
                className="flex items-center gap-2 rounded-full hover:bg-primary/10"
            >
                <ThumbsUp size={16} />
                <span>{likes}</span>
            </Button>

            <Button
                variant="outline"
                size="sm"
                onClick={onDislike}
                className="flex items-center gap-2 rounded-full hover:bg-primary/10"
            >
                <ThumbsDown size={16} />
                <span>{dislikes}</span>
            </Button>

            <Button
                variant="outline"
                size="sm"
                onClick={onShare}
                className="flex items-center gap-2 rounded-full hover:bg-primary/10"
            >
                <Share2 size={16} />
                <span>Paylaş</span>
            </Button>

            <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-2 rounded-full md:hidden"
            >
                <MessageCircle size={16} />
            </Button>
        </div>
    );
};

export default VideoActions;
