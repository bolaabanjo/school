import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    BookOpen,
    GraduationCap,
    Play,
    ArrowRight,
    Clock,
    Award,
    LayoutDashboard,
    LogOut
} from "lucide-react";
import { getCurrentUser, getUserEnrollments, getUserProgress } from "@/lib/supabase/queries";
import { createClient } from "@/lib/supabase/server";
import { LogoutButton } from "@/components/logout-button";

export default async function DashboardPage() {
    const user = await getCurrentUser();

    if (!user) {
        redirect('/login');
    }

    const enrollments = await getUserEnrollments(user.id);

    // Calculate stats
    const enrolledCount = enrollments.length;
    const completedCount = enrollments.filter(e => e.status === 'completed').length;

    // Get progress for all enrolled courses
    const enrollmentsWithProgress = await Promise.all(
        enrollments.map(async (enrollment) => {
            const progress = await getUserProgress(user.id, enrollment.course_id);
            const completedLessons = progress.filter(p => p.completed).length;
            const totalLessons = progress.length || 1;
            const progressPercent = Math.round((completedLessons / totalLessons) * 100);

            return {
                ...enrollment,
                completedLessons,
                totalLessons: progress.length,
                progressPercent: isNaN(progressPercent) ? 0 : progressPercent,
            };
        })
    );

    const stats = [
        { label: "Courses Enrolled", value: enrolledCount.toString(), icon: BookOpen },
        { label: "Completed", value: completedCount.toString(), icon: Award },
        { label: "In Progress", value: (enrolledCount - completedCount).toString(), icon: Play },
    ];

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
                <div className="container mx-auto flex h-16 items-center justify-between px-4">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                            <GraduationCap className="h-5 w-5 text-primary-foreground" />
                        </div>
                        <span className="text-xl font-bold">School</span>
                    </Link>
                    <nav className="flex items-center gap-4">
                        <Link href="/dashboard" className="flex items-center gap-2 text-sm font-medium">
                            <LayoutDashboard className="h-4 w-4" />
                            Dashboard
                        </Link>
                        <Link href="/courses" className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground">
                            <BookOpen className="h-4 w-4" />
                            Courses
                        </Link>
                    </nav>
                    <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                            <AvatarImage src={user.avatar_url || ''} />
                            <AvatarFallback>
                                {user.full_name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                            </AvatarFallback>
                        </Avatar>
                        <LogoutButton />
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8">
                {/* Welcome Section */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">Welcome back, {user.full_name?.split(' ')[0] || 'Student'}!</h1>
                    <p className="text-muted-foreground">Continue your AI learning journey.</p>
                </div>

                {/* Stats Grid */}
                <div className="grid gap-4 md:grid-cols-3 mb-8">
                    {stats.map((stat, index) => (
                        <Card key={index}>
                            <CardContent className="flex items-center gap-4 p-6">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                                    <stat.icon className="h-6 w-6 text-primary" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold">{stat.value}</p>
                                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Enrolled Courses */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold">My Courses</h2>
                        <Button variant="ghost" size="sm" asChild>
                            <Link href="/courses">
                                Browse More
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </div>

                    {enrollmentsWithProgress.length === 0 ? (
                        <Card className="text-center py-12">
                            <CardContent>
                                <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                                <h3 className="text-lg font-semibold mb-2">No courses yet</h3>
                                <p className="text-muted-foreground mb-4">Start your learning journey by enrolling in a course.</p>
                                <Button asChild>
                                    <Link href="/courses">
                                        Browse Courses
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2">
                            {enrollmentsWithProgress.map((enrollment) => (
                                <Card key={enrollment.id}>
                                    <CardContent className="p-6">
                                        <div className="flex gap-4">
                                            <div className="h-24 w-32 rounded-lg bg-muted flex items-center justify-center shrink-0">
                                                {enrollment.course?.thumbnail_url ? (
                                                    <img
                                                        src={enrollment.course.thumbnail_url}
                                                        alt={enrollment.course.title}
                                                        className="w-full h-full object-cover rounded-lg"
                                                    />
                                                ) : (
                                                    <BookOpen className="h-8 w-8 text-muted-foreground" />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-2 mb-2">
                                                    <div>
                                                        <h3 className="font-semibold">{enrollment.course?.title}</h3>
                                                        <p className="text-sm text-muted-foreground line-clamp-1">
                                                            {enrollment.course?.description}
                                                        </p>
                                                    </div>
                                                    <Badge variant="secondary">{enrollment.progressPercent}%</Badge>
                                                </div>
                                                <div className="mb-3">
                                                    <div className="flex items-center justify-between text-sm mb-1">
                                                        <span className="text-muted-foreground">
                                                            {enrollment.completedLessons} of {enrollment.totalLessons} lessons
                                                        </span>
                                                    </div>
                                                    <Progress value={enrollment.progressPercent} className="h-2" />
                                                </div>
                                                <Button size="sm" asChild>
                                                    <Link href={`/learn/${enrollment.course_id}`}>
                                                        <Play className="mr-2 h-3 w-3" />
                                                        Continue
                                                    </Link>
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
