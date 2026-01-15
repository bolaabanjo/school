"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2, Play } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

interface EnrollButtonProps {
    courseId: string;
}

export function EnrollButton({ courseId }: EnrollButtonProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleEnroll = async () => {
        setIsLoading(true);
        const supabase = createClient();

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            toast.error("Please sign in to enroll");
            router.push(`/login?redirect=/courses/${courseId}`);
            return;
        }

        const { error } = await supabase
            .from('enrollments')
            .insert({
                user_id: user.id,
                course_id: courseId,
            });

        if (error) {
            if (error.code === '23505') {
                // Already enrolled
                router.push(`/learn/${courseId}`);
            } else {
                toast.error("Failed to enroll");
            }
        } else {
            toast.success("Enrolled successfully!");
            router.push(`/learn/${courseId}`);
        }

        setIsLoading(false);
    };

    return (
        <Button className="w-full" size="lg" onClick={handleEnroll} disabled={isLoading}>
            {isLoading ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enrolling...
                </>
            ) : (
                <>
                    <Play className="mr-2 h-4 w-4" />
                    Enroll Now
                </>
            )}
        </Button>
    );
}
