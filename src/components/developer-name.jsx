"use client";

import { useState } from "react";
import Image from "next/image";

export function DeveloperName() {
    const [isHovering, setIsHovering] = useState(false);

    return (
        <span
            className="relative inline-block font-bold cursor-help text-foreground border-b border-primary/30 hover:border-primary transition-colors"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
        >
            Om Nandurkar

            {isHovering && (
                <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 animate-in fade-in zoom-in duration-200">
                    <span className="block h-24 w-24 rounded-full border-4 border-background shadow-xl overflow-hidden bg-muted">
                        <Image
                            src="/Om.jpg"
                            alt="Om Nandurkar"
                            width={96}
                            height={96}
                            className="object-cover w-full h-full"
                        />
                    </span>
                    {/* Tooltip arrow */}
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-background rotate-45 shadow-sm border-r border-b border-border/10"></span>
                </span>
            )}
        </span>
    );
}
