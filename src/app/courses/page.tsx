import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
    BookOpen,
    GraduationCap,
    Clock,
    ArrowRight,
    Search,
} from "lucide-react";
import { getPublishedCourses } from "@/lib/supabase/queries";

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

function formatDifficulty(difficulty: string) {
    return difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
}

export default async function CoursesPage() {
    const courses = await getPublishedCourses();

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
                        <Link href="/courses" className="text-sm font-medium">
                            Courses
                        </Link>
                        <Link href="/about" className="text-sm font-medium text-muted-foreground hover:text-foreground">
                            About
                        </Link>
                    </nav>
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" asChild>
                            <Link href="/login">Sign In</Link>
                        </Button>
                        <Button asChild>
                            <Link href="/signup">Get Started</Link>
                        </Button>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8">
                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">All Courses</h1>
                    <p className="text-muted-foreground">
                        Explore our comprehensive collection of AI courses
                    </p>
                </div>

                {/* Search */}
                <div className="flex flex-col gap-4 mb-8 md:flex-row md:items-center">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Search courses..." className="pl-10" />
                    </div>
                </div>

                {/* Courses Grid */}
                {courses.length === 0 ? (
                    <Card className="text-center py-12">
                        <CardContent>
                            <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                            <h3 className="text-lg font-semibold mb-2">No courses available yet</h3>
                            <p className="text-muted-foreground">Check back soon for new courses!</p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {courses.map((course) => (
                            <Card key={course.id} className="flex flex-col overflow-hidden">
                                {/* Course Thumbnail */}
                                <div className="h-40 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                                    {course.thumbnail_url ? (
                                        <img
                                            src={course.thumbnail_url}
                                            alt={course.title}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <BookOpen className="h-12 w-12 text-primary/50" />
                                    )}
                                </div>
                                <CardHeader className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        {course.category && (
                                            <Badge variant="outline" className="text-xs">{course.category}</Badge>
                                        )}
                                        <Badge className={`text-xs ${getDifficultyColor(course.difficulty)}`}>
                                            {formatDifficulty(course.difficulty)}
                                        </Badge>
                                    </div>
                                    <CardTitle className="text-lg">{course.title}</CardTitle>
                                    <CardDescription className="line-clamp-2">
                                        {course.description}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                                        <span className="flex items-center gap-1">
                                            <BookOpen className="h-4 w-4" />
                                            {course.lesson_count || 0} lessons
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Clock className="h-4 w-4" />
                                            {course.duration_minutes ? `${Math.round(course.duration_minutes / 60)}h` : 'TBD'}
                                        </span>
                                    </div>
                                    <Button className="w-full" asChild>
                                        <Link href={`/courses/${course.id}`}>
                                            View Course
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
