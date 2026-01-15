import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
    BookOpen,
    GraduationCap,
    Clock,
    Play,
    Check,
    Users,
} from "lucide-react";
import { getCourseWithContent, getCurrentUser, isEnrolled } from "@/lib/supabase/queries";
import { EnrollButton } from "@/components/enroll-button";

interface CourseDetailPageProps {
    params: Promise<{ id: string }>;
}

function getDifficultyColor(difficulty: string) {
    switch (difficulty) {
        case "beginner":
            return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
        case "intermediate":
            return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
        case "advanced":
            return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
        default:
            return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
    }
}

export default async function CourseDetailPage({ params }: CourseDetailPageProps) {
    const { id } = await params;

    const course = await getCourseWithContent(id);
    if (!course) {
        notFound();
    }

    const user = await getCurrentUser();
    const enrolled = user ? await isEnrolled(id) : false;

    const totalLessons = course.modules.reduce((acc, m) => acc + m.lessons.length, 0);
    const totalDuration = course.modules.reduce((acc, m) =>
        acc + m.lessons.reduce((lacc, l) => lacc + (l.duration_seconds || 0), 0), 0
    );

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
                    <nav className="hidden items-center gap-6 md:flex">
                        <Link href="/courses" className="text-sm font-medium text-muted-foreground hover:text-foreground">
                            Courses
                        </Link>
                    </nav>
                    <div className="flex items-center gap-3">
                        {user ? (
                            <Button asChild>
                                <Link href="/dashboard">Dashboard</Link>
                            </Button>
                        ) : (
                            <>
                                <Button variant="ghost" asChild>
                                    <Link href="/login">Sign In</Link>
                                </Button>
                                <Button asChild>
                                    <Link href="/signup">Get Started</Link>
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8">
                <div className="grid gap-8 lg:grid-cols-3">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        {/* Course Header */}
                        <div className="mb-8">
                            <div className="flex items-center gap-2 mb-4">
                                {course.category && (
                                    <Badge variant="outline">{course.category}</Badge>
                                )}
                                <Badge className={getDifficultyColor(course.difficulty)}>
                                    {course.difficulty.charAt(0).toUpperCase() + course.difficulty.slice(1)}
                                </Badge>
                            </div>
                            <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
                            <p className="text-muted-foreground text-lg">{course.description}</p>
                        </div>

                        {/* Course Stats */}
                        <div className="flex items-center gap-6 mb-8 text-sm">
                            <div className="flex items-center gap-2">
                                <BookOpen className="h-5 w-5 text-muted-foreground" />
                                <span>{totalLessons} lessons</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="h-5 w-5 text-muted-foreground" />
                                <span>
                                    {totalDuration > 0
                                        ? `${Math.floor(totalDuration / 3600)}h ${Math.floor((totalDuration % 3600) / 60)}m`
                                        : 'Duration TBD'
                                    }
                                </span>
                            </div>
                        </div>

                        <Separator className="my-8" />

                        {/* Curriculum */}
                        <div>
                            <h2 className="text-2xl font-bold mb-6">Curriculum</h2>
                            <div className="space-y-4">
                                {course.modules.map((module, moduleIndex) => (
                                    <Card key={module.id}>
                                        <CardHeader className="pb-3">
                                            <CardTitle className="text-lg">
                                                {moduleIndex + 1}. {module.title}
                                            </CardTitle>
                                            <CardDescription>
                                                {module.lessons.length} lessons
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="pt-0">
                                            <div className="space-y-2">
                                                {module.lessons.map((lesson, lessonIndex) => (
                                                    <div
                                                        key={lesson.id}
                                                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted"
                                                    >
                                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted shrink-0">
                                                            <Play className="h-3 w-3" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-medium">{lesson.title}</p>
                                                        </div>
                                                        <span className="text-xs text-muted-foreground">
                                                            {lesson.duration_seconds
                                                                ? `${Math.floor(lesson.duration_seconds / 60)}:${(lesson.duration_seconds % 60).toString().padStart(2, '0')}`
                                                                : '--:--'
                                                            }
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <Card className="sticky top-24">
                            {/* Thumbnail */}
                            <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center rounded-t-lg">
                                {course.thumbnail_url ? (
                                    <img
                                        src={course.thumbnail_url}
                                        alt={course.title}
                                        className="w-full h-full object-cover rounded-t-lg"
                                    />
                                ) : (
                                    <BookOpen className="h-16 w-16 text-primary/30" />
                                )}
                            </div>
                            <CardContent className="p-6">
                                {enrolled ? (
                                    <Button className="w-full" size="lg" asChild>
                                        <Link href={`/learn/${course.id}`}>
                                            <Play className="mr-2 h-4 w-4" />
                                            Continue Learning
                                        </Link>
                                    </Button>
                                ) : user ? (
                                    <EnrollButton courseId={course.id} />
                                ) : (
                                    <Button className="w-full" size="lg" asChild>
                                        <Link href={`/login?redirect=/courses/${course.id}`}>
                                            Sign in to Enroll
                                        </Link>
                                    </Button>
                                )}

                                <Separator className="my-6" />

                                <div className="space-y-4 text-sm">
                                    <div className="flex items-center justify-between">
                                        <span className="text-muted-foreground">Lessons</span>
                                        <span className="font-medium">{totalLessons}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-muted-foreground">Modules</span>
                                        <span className="font-medium">{course.modules.length}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-muted-foreground">Difficulty</span>
                                        <span className="font-medium capitalize">{course.difficulty}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
}
