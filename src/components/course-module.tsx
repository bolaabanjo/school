"use client";

import { useState } from "react";
import { ChevronDown, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { ModuleWithLessons } from "@/types/database";

interface CourseModuleProps {
    module: ModuleWithLessons;
    index: number;
}

export function CourseModule({ module, index }: CourseModuleProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="rounded-xl border border-border/50 bg-card overflow-hidden">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-muted/30 transition-colors"
            >
                <div>
                    <h3 className="text-sm font-semibold">
                        {index + 1}. {module.title}
                    </h3>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                        {module.lessons.length} lessons
                    </p>
                </div>
                <ChevronDown
                    className={cn(
                        "h-4 w-4 text-muted-foreground transition-transform duration-200",
                        isOpen && "transform rotate-180"
                    )}
                />
            </button>

            {isOpen && (
                <div className="px-5 pb-5 pt-0 space-y-1.5 animate-in slide-in-from-top-2 duration-200">
                    {module.lessons.map((lesson) => (
                        <div
                            key={lesson.id}
                            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted/50 transition-colors"
                        >
                            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-muted/50 shrink-0">
                                <Play className="h-3 w-3" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-medium">{lesson.title}</p>
                            </div>
                            <span className="text-[10px] text-muted-foreground">
                                {lesson.duration_seconds
                                    ? `${Math.floor(lesson.duration_seconds / 60)}:${(lesson.duration_seconds % 60).toString().padStart(2, '0')}`
                                    : '--:--'
                                }
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
