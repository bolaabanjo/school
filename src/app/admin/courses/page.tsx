import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    BookOpen,
    Plus,
    Eye,
    Edit,
    Trash2,
    Search,
} from "lucide-react";
import { getCurrentUser, getAllCourses } from "@/lib/supabase/queries";
import { AdminSidebar } from "@/components/admin-sidebar";
import { DeleteCourseButton } from "@/components/delete-course-button";

export default async function AdminCoursesPage() {
    const user = await getCurrentUser();

    if (!user || user.role !== 'admin') {
        redirect('/dashboard');
    }

    const courses = await getAllCourses();

    return (
        <div className="min-h-screen bg-muted/30">
            <AdminSidebar user={user} activePage="courses" />

            {/* Main Content */}
            <main className="ml-64 p-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold">Courses</h1>
                        <p className="text-muted-foreground">Manage your course content</p>
                    </div>
                    <Button asChild>
                        <Link href="/admin/courses/new">
                            <Plus className="mr-2 h-4 w-4" />
                            New Course
                        </Link>
                    </Button>
                </div>

                {/* Search */}
                <Card className="mb-6">
                    <CardContent className="p-4">
                        <div className="relative max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Search courses..." className="pl-10" />
                        </div>
                    </CardContent>
                </Card>

                {/* Courses Table */}
                <Card>
                    <CardContent className="p-0">
                        {courses.length === 0 ? (
                            <div className="text-center py-12">
                                <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                                <h3 className="text-lg font-semibold mb-2">No courses yet</h3>
                                <p className="text-muted-foreground mb-4">Create your first course to get started.</p>
                                <Button asChild>
                                    <Link href="/admin/courses/new">
                                        <Plus className="mr-2 h-4 w-4" />
                                        New Course
                                    </Link>
                                </Button>
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[300px]">Course</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Difficulty</TableHead>
                                        <TableHead>Students</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {courses.map((course) => (
                                        <TableRow key={course.id}>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-14 rounded bg-muted flex items-center justify-center shrink-0">
                                                        {course.thumbnail_url ? (
                                                            <img
                                                                src={course.thumbnail_url}
                                                                alt={course.title}
                                                                className="w-full h-full object-cover rounded"
                                                            />
                                                        ) : (
                                                            <BookOpen className="h-5 w-5 text-muted-foreground" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium">{course.title}</p>
                                                        <p className="text-xs text-muted-foreground">
                                                            {course.category || 'Uncategorized'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={course.status === "published" ? "default" : "secondary"}>
                                                    {course.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="capitalize">
                                                    {course.difficulty}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>{course.student_count}</TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex items-center justify-end gap-1">
                                                    <Button variant="ghost" size="icon" asChild>
                                                        <Link href={`/admin/courses/${course.id}`}>
                                                            <Edit className="h-4 w-4" />
                                                        </Link>
                                                    </Button>
                                                    <Button variant="ghost" size="icon" asChild>
                                                        <Link href={`/courses/${course.id}`}>
                                                            <Eye className="h-4 w-4" />
                                                        </Link>
                                                    </Button>
                                                    <DeleteCourseButton courseId={course.id} courseTitle={course.title} />
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}
