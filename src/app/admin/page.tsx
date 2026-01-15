import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    GraduationCap,
    BookOpen,
    Users,
    TrendingUp,
    Plus,
    Settings,
    LayoutDashboard,
    Video,
    Eye,
    Edit
} from "lucide-react";
import { getCurrentUser, getAdminStats, getAllCourses, getRecentStudents } from "@/lib/supabase/queries";
import { AdminSidebar } from "@/components/admin-sidebar";

export default async function AdminDashboard() {
    const user = await getCurrentUser();

    if (!user || user.role !== 'admin') {
        redirect('/dashboard');
    }

    const [stats, courses, recentStudents] = await Promise.all([
        getAdminStats(),
        getAllCourses(),
        getRecentStudents(5),
    ]);

    const statCards = [
        { label: "Total Students", value: stats.totalStudents.toString(), icon: Users, change: "" },
        { label: "Active Courses", value: stats.activeCourses.toString(), icon: BookOpen, change: "" },
        { label: "Enrollments", value: stats.totalEnrollments.toString(), icon: GraduationCap, change: "" },
        { label: "Total Courses", value: stats.totalCourses.toString(), icon: TrendingUp, change: "" },
    ];

    return (
        <div className="min-h-screen bg-muted/30">
            <AdminSidebar user={user} activePage="dashboard" />

            {/* Main Content */}
            <main className="ml-64 p-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold">Dashboard</h1>
                        <p className="text-muted-foreground">Welcome back, {user.full_name || 'Admin'}</p>
                    </div>
                    <Button asChild>
                        <Link href="/admin/courses/new">
                            <Plus className="mr-2 h-4 w-4" />
                            New Course
                        </Link>
                    </Button>
                </div>

                {/* Stats Grid */}
                <div className="grid gap-4 md:grid-cols-4 mb-8">
                    {statCards.map((stat, index) => (
                        <Card key={index}>
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                                        <stat.icon className="h-5 w-5 text-primary" />
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <p className="text-2xl font-bold">{stat.value}</p>
                                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Tables */}
                <div className="grid gap-8 lg:grid-cols-2">
                    {/* Recent Courses */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Recent Courses</CardTitle>
                                <CardDescription>Manage your course content</CardDescription>
                            </div>
                            <Button variant="outline" size="sm" asChild>
                                <Link href="/admin/courses">View All</Link>
                            </Button>
                        </CardHeader>
                        <CardContent>
                            {courses.length === 0 ? (
                                <div className="text-center py-8 text-muted-foreground">
                                    <BookOpen className="h-8 w-8 mx-auto mb-2" />
                                    <p>No courses yet</p>
                                </div>
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Course</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="text-right">Students</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {courses.slice(0, 4).map((course) => (
                                            <TableRow key={course.id}>
                                                <TableCell>
                                                    <div>
                                                        <p className="font-medium">{course.title}</p>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant={course.status === "published" ? "default" : "secondary"}>
                                                        {course.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">{course.student_count}</TableCell>
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
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                        </CardContent>
                    </Card>

                    {/* Recent Students */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Recent Students</CardTitle>
                                <CardDescription>New enrollments</CardDescription>
                            </div>
                            <Button variant="outline" size="sm" asChild>
                                <Link href="/admin/users">View All</Link>
                            </Button>
                        </CardHeader>
                        <CardContent>
                            {recentStudents.length === 0 ? (
                                <div className="text-center py-8 text-muted-foreground">
                                    <Users className="h-8 w-8 mx-auto mb-2" />
                                    <p>No students yet</p>
                                </div>
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Student</TableHead>
                                            <TableHead>Courses</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {recentStudents.map((student) => (
                                            <TableRow key={student.id}>
                                                <TableCell>
                                                    <div className="flex items-center gap-3">
                                                        <Avatar className="h-8 w-8">
                                                            <AvatarFallback>
                                                                {student.full_name?.split(' ').map((n: string) => n[0]).join('') || 'U'}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div>
                                                            <p className="font-medium">{student.full_name}</p>
                                                            <p className="text-xs text-muted-foreground">{student.email}</p>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>{student.enrolled_count}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}
