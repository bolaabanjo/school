"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, Volume2, Maximize, Settings, Check, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface VideoPlayerProps {
    lesson: {
        id: string;
        title: string;
        video_url?: string | null;
        duration_seconds: number;
    };
    isCompleted: boolean;
}

export function VideoPlayer({ lesson, isCompleted }: VideoPlayerProps) {
    const router = useRouter();
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [isMarking, setIsMarking] = useState(false);

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
            .from('progress')
            .upsert({
                user_id: user.id,
                lesson_id: lesson.id,
                completed: true,
                last_watched_at: new Date().toISOString(),
            }, {
                onConflict: 'user_id,lesson_id',
            });

        if (error) {
            toast.error("Failed to mark as complete");
        } else {
            toast.success("Lesson marked as complete!");
            router.refresh();
        }
        setIsMarking(false);
    };

    return (
        <div className="bg-black aspect-video relative">
            {lesson.video_url ? (
                <video
                    src={lesson.video_url}
                    className="w-full h-full"
                    controls
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                />
            ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white">
                        <Button
                            size="lg"
                            variant="secondary"
                            className="rounded-full h-16 w-16"
                            onClick={() => setIsPlaying(!isPlaying)}
                        >
                            {isPlaying ? (
                                <Pause className="h-6 w-6" />
                            ) : (
                                <Play className="h-6 w-6 ml-1" />
                            )}
                        </Button>
                        <p className="mt-4 text-sm text-gray-400">Video coming soon</p>

                        {!isCompleted && (
                            <Button
                                className="mt-4"
                                onClick={handleMarkComplete}
                                disabled={isMarking}
                            >
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
            )}

            {/* Video Controls Overlay (for when video exists) */}
            {lesson.video_url && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 pointer-events-none">
                    <div className="flex items-center justify-between text-white">
                        <div className="flex items-center gap-3">
                            <span className="text-sm">
                                {lesson.duration_seconds
                                    ? `${Math.floor(lesson.duration_seconds / 60)}:${(lesson.duration_seconds % 60).toString().padStart(2, '0')}`
                                    : '0:00'
                                }
                            </span>
                        </div>
                        {!isCompleted && (
                            <Button
                                size="sm"
                                variant="secondary"
                                className="pointer-events-auto"
                                onClick={handleMarkComplete}
                                disabled={isMarking}
                            >
                                {isMarking ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <Check className="mr-2 h-4 w-4" />
                                )}
                                Mark Complete
                            </Button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
