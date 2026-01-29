"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, Loader2, BookOpen } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface ReadingContentProps {
    lesson: {
        id: string;
        title: string;
        content?: string | null;
    };
    isCompleted: boolean;
    onComplete?: () => void;
}

export function ReadingContent({ lesson, isCompleted, onComplete }: ReadingContentProps) {
    const router = useRouter();
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

    if (!lesson.content) {
        return (
            <div className="bg-card border-b border-border/50 py-16">
                <div className="max-w-3xl mx-auto px-4 md:px-6 text-center">
                    <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground mb-6">Reading content coming soon</p>
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
        <div className="bg-card border-b border-border/50">
            <div className="max-w-3xl mx-auto px-4 md:px-6 py-8">
                {/* Reading Content */}
                <article className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
                    <div
                        dangerouslySetInnerHTML={{ __html: lesson.content }}
                        className="leading-relaxed"
                    />
                </article>

                {/* Mark Complete Button */}
                {!isCompleted && (
                    <div className="mt-8 pt-6 border-t border-border/50 flex justify-center">
                        <Button onClick={handleMarkComplete} disabled={isMarking} size="lg">
                            {isMarking ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <Check className="mr-2 h-4 w-4" />
                            )}
                            Mark as Complete
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
