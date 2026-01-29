/**
 * YouTube URL parsing and embed utilities
 */

/**
 * Extracts the YouTube video ID from various URL formats
 * Supports: youtube.com/watch?v=, youtu.be/, youtube.com/embed/, etc.
 */
export function extractYouTubeId(url: string): string | null {
    if (!url) return null;

    // Match various YouTube URL patterns
    const patterns = [
        /(?:youtube\.com\/watch\?v=|youtube\.com\/embed\/|youtu\.be\/|youtube\.com\/v\/)([a-zA-Z0-9_-]{11})/,
        /^([a-zA-Z0-9_-]{11})$/, // Just the video ID itself
    ];

    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match && match[1]) {
            return match[1];
        }
    }

    return null;
}

/**
 * Gets the thumbnail URL for a YouTube video
 * Uses the high quality thumbnail by default
 */
export function getYouTubeThumbnail(videoId: string, quality: 'default' | 'medium' | 'high' | 'maxres' = 'high'): string {
    const qualityMap = {
        default: 'default',
        medium: 'mqdefault',
        high: 'hqdefault',
        maxres: 'maxresdefault',
    };
    return `https://img.youtube.com/vi/${videoId}/${qualityMap[quality]}.jpg`;
}

/**
 * Gets the embed URL for a YouTube video
 */
export function getYouTubeEmbedUrl(videoId: string): string {
    return `https://www.youtube.com/embed/${videoId}`;
}

/**
 * Validates if a string is a valid YouTube URL
 */
export function isValidYouTubeUrl(url: string): boolean {
    return extractYouTubeId(url) !== null;
}
