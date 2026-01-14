"use client"

import 'katex/dist/katex.min.css';
import Latex from 'react-latex-next';

// Wrapper component to render text with LaTeX support
// We use react-latex-next which is a modern wrapper around KaTeX
// It automatically detects $...$ and $$...$$
export function MathText({ text, className }) {
    if (!text) return null;

    return (
        <span className={className}>
            <Latex>{text}</Latex>
        </span>
    );
}
