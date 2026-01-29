"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, Loader2, Play } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { extractYouTubeId, getYouTubeEmbedUrl, getYouTubeThumbnail } from "@/lib/youtube";

interface YouTubePlayerProps {
    lesson: {
        id: string;
        title: string;
        youtube_url?: string | null;
    };
    isCompleted: boolean;
    onComplete?: () => void;
}

export function YouTubePlayer({ lesson, isCompleted, onComplete }: YouTubePlayerProps) {
    const router = useRouter();
    const [isMarking, setIsMarking] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);

    const videoId = lesson.youtube_url ? extractYouTubeId(lesson.youtube_url) : null;

    const handleMarkComplete = async () => {
        setIsMarking(true);
        const supabase = createClient();

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            toast.error("Not authenticated");
            setIsMarking(false);
            return;
        }

        const { error } = await supabase
            .from("progress")
            .upsert({
                user_id: user.id,
                lesson_id: lesson.id,
                completed: true,
                last_watched_at: new Date().toISOString(),
            }, {
                onConflict: "user_id,lesson_id",
            });

        if (error) {
            toast.error("Failed to mark as complete");
        } else {
            toast.success("Lesson marked as complete!");
            onComplete?.();
            router.refresh();
        }
        setIsMarking(false);
    };

    if (!videoId) {
        return (
            <div className="bg-[#171717] aspect-video relative flex items-center justify-center">
                <div className="text-center text-white">
                    <Button
                        size="lg"
                        variant="secondary"
                        className="rounded-full h-16 w-16 mb-4"
                        disabled
                    >
                        <Play className="h-6 w-6 ml-1" />
                    </Button>
                    <p className="text-sm text-gray-400 mb-4">YouTube video coming soon</p>
                    {!isCompleted && (
                        <Button onClick={handleMarkComplete} disabled={isMarking}>
                            {isMarking ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <Check className="mr-2 h-4 w-4" />
                            )}
                            Mark as Complete
                        </Button>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#171717] aspect-video relative">
            {!isPlaying ? (
                // Thumbnail with play button
                <div
                    className="absolute inset-0 cursor-pointer group"
                    onClick={() => setIsPlaying(true)}
                >
                    <img
                        src={getYouTubeThumbnail(videoId, 'maxres')}
                        alt={lesson.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            // Fallback to high quality if maxres doesn't exist
                            (e.target as HTMLImageElement).src = getYouTubeThumbnail(videoId, 'high');
                        }}
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/40 transition-colors">
                        <Button
                            size="lg"
                            variant="secondary"
                            className="rounded-full h-16 w-16"
                        >
                            <Play className="h-6 w-6 ml-1" />
                        </Button>
                    </div>
                </div>
            ) : (
                // YouTube iframe
                <iframe
                    src={`${getYouTubeEmbedUrl(videoId)}?autoplay=1&rel=0`}
                    title={lesson.title}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                />
            )}

            {/* Mark Complete Button (floating) */}
            {!isCompleted && isPlaying && (
                <div className="absolute bottom-4 right-4">
                    <Button
                        size="sm"
                        onClick={handleMarkComplete}
                        disabled={isMarking}
                        className="shadow-lg"
                    >
                        {isMarking ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <Check className="mr-2 h-4 w-4" />
                        )}
                        Mark Complete
                    </Button>
                </div>
            )}
        </div>
    );
}
