"use server";

import { createClient } from "@/lib/supabase/server";
import { Resend } from "resend";
import CourseReadyEmail from "@/emails/course-ready-template";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendCourseReadyEmail(
    email: string,
    name: string,
    courseTitle: string,
    message?: string
) {
    const supabase = await createClient();

    // 1. Verify Admin Permissions
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "Not authenticated" };

    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

    if (profile?.role !== 'admin') return { error: "Unauthorized" };

    // 2. Validate Input
    if (!email || !courseTitle) {
        return { error: "Missing required fields" };
    }

    // 3. Send Email
    if (process.env.RESEND_API_KEY) {
        try {
            await resend.emails.send({
                from: 'Corne Labs School <admin@school.cornelabs.com>',
                to: email,
                subject: `Your course is ready — ${courseTitle}`,
                react: CourseReadyEmail({
                    studentName: name,
                    courseTitle: courseTitle,
                    courseUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/courses`,
                    message: message || undefined,
                }),
            });
            console.log(`Course ready email sent to ${email}`);
            return { success: true, message: "Course ready email sent successfully" };
        } catch (emailError: any) {
            console.error("Failed to send course ready email:", emailError);
            return { error: emailError.message || "Failed to send email" };
        }
    } else {
        return { error: "Email service not configured" };
    }
}
