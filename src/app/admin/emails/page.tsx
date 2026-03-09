"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AdminSidebar } from "@/components/admin-sidebar";
import { Mail, Send, Loader2, RefreshCw, BookOpen } from "lucide-react";
import { toast } from "sonner";
import { sendManualInvite } from "@/app/actions/send-custom-email";
import { sendCourseReadyEmail } from "@/app/actions/send-course-ready";
import { createClient } from "@/lib/supabase/client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

type EmailTab = "invite" | "course-ready";

export default function AdminEmailsPage() {
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [generatedPassword, setGeneratedPassword] = useState("");
    const [activeTab, setActiveTab] = useState<EmailTab>("course-ready");
    const router = useRouter();

    useEffect(() => {
        const getUser = async () => {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push('/login');
                return;
            }
            // Check admin role
            const { data: profile } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', user.id)
                .single();

            if (profile?.role !== 'admin') {
                router.push('/dashboard');
                return;
            }
            setUser(user);
        };
        getUser();
        generateParams();
    }, [router]);

    const generateParams = () => {
        const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        let retVal = "";
        for (let i = 0, n = charset.length; i < 12; ++i) {
            retVal += charset.charAt(Math.floor(Math.random() * n));
        }
        setGeneratedPassword(retVal);
    };

    const handleInviteSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const email = formData.get("email") as string;
        const name = formData.get("name") as string;
        const courseTitle = formData.get("courseTitle") as string;
        const password = formData.get("password") as string;

        try {
            const result = await sendManualInvite(email, name, courseTitle, password);
            if (result.success) {
                toast.success("Invite email sent successfully!");
                (e.target as HTMLFormElement).reset();
                generateParams();
            } else {
                toast.error(result.error || "Failed to send email");
            }
        } catch (error) {
            toast.error("An unexpected error occurred");
        } finally {
            setLoading(false);
        }
    };

    const handleCourseReadySubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const email = formData.get("email") as string;
        const name = formData.get("name") as string;
        const courseTitle = formData.get("courseTitle") as string;
        const message = formData.get("message") as string;

        try {
            const result = await sendCourseReadyEmail(email, name, courseTitle, message || undefined);
            if (result.success) {
                toast.success("Course ready email sent!");
                (e.target as HTMLFormElement).reset();
            } else {
                toast.error(result.error || "Failed to send email");
            }
        } catch (error) {
            toast.error("An unexpected error occurred");
        } finally {
            setLoading(false);
        }
    };

    if (!user) return null;

    return (
        <div className="min-h-screen bg-background">
            <AdminSidebar user={user} activePage="emails" />

            <main className="lg:ml-56 pt-14 lg:pt-0 min-h-screen flex justify-center">
                <div className="w-full max-w-2xl px-4 md:px-6 py-8 space-y-6">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <Mail className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold">Send Emails</h1>
                            <p className="text-sm text-muted-foreground">Send course notifications and invitations to students.</p>
                        </div>
                    </div>

                    {/* Tab Switcher */}
                    <div className="flex gap-2 p-1 rounded-lg bg-muted/50 border border-border/50">
                        <button
                            onClick={() => setActiveTab("course-ready")}
                            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === "course-ready"
                                    ? "bg-background text-foreground shadow-sm"
                                    : "text-muted-foreground hover:text-foreground"
                                }`}
                        >
                            <BookOpen className="h-4 w-4" />
                            Course Ready
                        </button>
                        <button
                            onClick={() => setActiveTab("invite")}
                            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === "invite"
                                    ? "bg-background text-foreground shadow-sm"
                                    : "text-muted-foreground hover:text-foreground"
                                }`}
                        >
                            <Mail className="h-4 w-4" />
                            Send Invite
                        </button>
                    </div>

                    {/* Course Ready Form */}
                    {activeTab === "course-ready" && (
                        <div className="rounded-xl border border-border/50 bg-card p-6 shadow-sm">
                            <div className="mb-4">
                                <h2 className="text-lg font-semibold">Course Ready Notification</h2>
                                <p className="text-sm text-muted-foreground">Notify a student that their course is live and ready to access.</p>
                            </div>
                            <form onSubmit={handleCourseReadySubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="cr-name">Student Name</Label>
                                        <Input
                                            id="cr-name"
                                            name="name"
                                            placeholder="John Doe"
                                            required
                                            className="bg-background"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="cr-email">Student Email</Label>
                                        <Input
                                            id="cr-email"
                                            name="email"
                                            type="email"
                                            placeholder="student@example.com"
                                            required
                                            className="bg-background"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="cr-courseTitle">Course Title</Label>
                                    <Input
                                        id="cr-courseTitle"
                                        name="courseTitle"
                                        placeholder="AI Essentials for Banking"
                                        required
                                        className="bg-background"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="cr-message">Personal Message <span className="text-muted-foreground font-normal">(optional)</span></Label>
                                    <Textarea
                                        id="cr-message"
                                        name="message"
                                        placeholder="e.g. We've added new video content and quizzes for you to explore..."
                                        className="bg-background resize-none"
                                        rows={3}
                                    />
                                    <p className="text-[10px] text-muted-foreground">This will appear as a highlighted note in the email.</p>
                                </div>

                                <Button type="submit" className="w-full" disabled={loading}>
                                    {loading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Sending...
                                        </>
                                    ) : (
                                        <>
                                            <Send className="mr-2 h-4 w-4" />
                                            Send Course Ready Email
                                        </>
                                    )}
                                </Button>
                            </form>
                        </div>
                    )}

                    {/* Invite Form (existing) */}
                    {activeTab === "invite" && (
                        <div className="rounded-xl border border-border/50 bg-card p-6 shadow-sm">
                            <div className="mb-4">
                                <h2 className="text-lg font-semibold">Send Invitation</h2>
                                <p className="text-sm text-muted-foreground">Send an invitation email with login credentials to a new student.</p>
                            </div>
                            <form onSubmit={handleInviteSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Recipient Name</Label>
                                        <Input
                                            id="name"
                                            name="name"
                                            placeholder="John Doe"
                                            required
                                            className="bg-background"
                                        />
                                        <p className="text-[10px] text-muted-foreground">Used for "Hello [Name]"</p>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Recipient Email</Label>
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            placeholder="student@example.com"
                                            required
                                            className="bg-background"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="courseTitle">Course Title</Label>
                                    <Input
                                        id="courseTitle"
                                        name="courseTitle"
                                        placeholder="AI Essentials for Banking"
                                        required
                                        className="bg-background"
                                    />
                                    <p className="text-[10px] text-muted-foreground">Used for "Welcome to... [Title]"</p>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="password">Temporary Password</Label>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="h-6 text-[10px]"
                                            onClick={generateParams}
                                        >
                                            <RefreshCw className="mr-1 h-3 w-3" />
                                            Generate New
                                        </Button>
                                    </div>
                                    <Input
                                        id="password"
                                        name="password"
                                        value={generatedPassword}
                                        onChange={(e) => setGeneratedPassword(e.target.value)}
                                        required
                                        className="bg-background font-mono"
                                    />
                                    <p className="text-[10px] text-muted-foreground">This password will be displayed in the email's credential box.</p>
                                </div>

                                <Button type="submit" className="w-full" disabled={loading}>
                                    {loading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Sending Invite...
                                        </>
                                    ) : (
                                        <>
                                            <Send className="mr-2 h-4 w-4" />
                                            Send Invitation
                                        </>
                                    )}
                                </Button>
                            </form>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
