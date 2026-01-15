import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  GraduationCap,
  Shield,
  Sparkles,
  Play,
  ArrowRight,
  Brain,
  Users,
  Award
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI Fundamentals",
    description: "Learn the core concepts of artificial intelligence from the ground up.",
  },
  {
    icon: Sparkles,
    title: "Practical Skills",
    description: "Hands-on training with the latest AI tools and technologies.",
  },
  {
    icon: Shield,
    title: "AI Ethics",
    description: "Understand responsible AI development and ethical considerations.",
  },
];

const courses = [
  {
    title: "Introduction to AI",
    description: "Perfect for beginners. Learn what AI is and how it's changing the world.",
    difficulty: "Beginner",
    duration: "4 hours",
  },
  {
    title: "Mastering ChatGPT",
    description: "Become a power user of AI assistants and boost your productivity.",
    difficulty: "Intermediate",
    duration: "6 hours",
  },
  {
    title: "AI Ethics & Responsibility",
    description: "Explore the ethical implications and responsible use of AI technology.",
    difficulty: "All Levels",
    duration: "3 hours",
  },
];

const stats = [
  { icon: Users, value: "500+", label: "Students" },
  { icon: BookOpen, value: "12", label: "Courses" },
  { icon: Award, value: "98%", label: "Satisfaction" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <GraduationCap className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">School</span>
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            <Link href="/courses" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Courses
            </Link>
            <Link href="/about" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
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

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(45%_40%_at_50%_60%,rgba(120,119,198,0.1),transparent)]" />
        <div className="container mx-auto px-4 py-24 md:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="secondary" className="mb-4">
              <Sparkles className="mr-1.5 h-3 w-3" />
              New courses available
            </Badge>
            <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-6xl">
              Master AI with
              <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent"> Expert-Led </span>
              Courses
            </h1>
            <p className="mb-8 text-lg text-muted-foreground md:text-xl">
              Learn AI fundamentals, practical skills, and ethics with our comprehensive courses.
              Start your AI journey today and unlock new possibilities.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" asChild>
                <Link href="/courses">
                  <Play className="mr-2 h-4 w-4" />
                  Browse Courses
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/signup">
                  Create Free Account
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y bg-muted/50">
        <div className="container mx-auto px-4 py-12">
          <div className="grid gap-8 md:grid-cols-3">
            {stats.map((stat, index) => (
              <div key={index} className="flex flex-col items-center text-center">
                <stat.icon className="mb-3 h-8 w-8 text-primary" />
                <span className="text-3xl font-bold">{stat.value}</span>
                <span className="text-sm text-muted-foreground">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-24">
        <div className="mx-auto max-w-2xl text-center mb-12">
          <h2 className="mb-4 text-3xl font-bold">Why Learn With Us?</h2>
          <p className="text-muted-foreground">
            Our courses are designed by industry experts to give you the skills you need.
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {features.map((feature, index) => (
            <Card key={index} className="text-center">
              <CardHeader>
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                  <feature.icon className="h-7 w-7 text-primary" />
                </div>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Courses Preview Section */}
      <section className="border-t bg-muted/30">
        <div className="container mx-auto px-4 py-24">
          <div className="mx-auto max-w-2xl text-center mb-12">
            <h2 className="mb-4 text-3xl font-bold">Featured Courses</h2>
            <p className="text-muted-foreground">
              Start learning today with our most popular courses.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {courses.map((course, index) => (
              <Card key={index} className="flex flex-col">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline">{course.difficulty}</Badge>
                    <span className="text-sm text-muted-foreground">{course.duration}</span>
                  </div>
                  <CardTitle className="text-lg">{course.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-1">
                  <CardDescription>{course.description}</CardDescription>
                </CardContent>
                <div className="p-6 pt-0">
                  <Button className="w-full" variant="outline" asChild>
                    <Link href="/courses">
                      View Course
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Button size="lg" asChild>
              <Link href="/courses">
                View All Courses
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t">
        <div className="container mx-auto px-4 py-24">
          <Card className="bg-primary text-primary-foreground">
            <CardContent className="p-12 text-center">
              <h2 className="mb-4 text-3xl font-bold">Ready to Start Learning?</h2>
              <p className="mb-8 text-primary-foreground/80 max-w-xl mx-auto">
                Join thousands of students mastering AI skills. Create your free account and start your learning journey today.
              </p>
              <Button size="lg" variant="secondary" asChild>
                <Link href="/signup">
                  Get Started for Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <GraduationCap className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-semibold">School</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2026 School. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
