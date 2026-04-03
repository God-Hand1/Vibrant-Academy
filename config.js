window.CONFIG = {
    SEARCH_DEBOUNCE_MS: 300,
    DEFAULT_CLASS: 11,
    // GitHub repository info for accessing media files
    GITHUB_REPO: 'God-Hand1/Vibrant-Academy',
    GITHUB_BRANCH: 'main',
    // Check if running on GitHub Pages (production)
    IS_PRODUCTION: window.location.hostname.includes('github.io'),
    DOWNLOAD_PATHS: {
        11: 'https://github.com/God-Hand1/Vibrant-Academy/releases/download/V1.0.0/Class.11th.Modules.zip',
        12: 'https://github.com/God-Hand1/Vibrant-Academy/releases/download/V1.0.0/Class.12th.Modules.zip',
        'music': 'https://github.com/God-Hand1/Vibrant-Academy/releases/download/V1.0.0/Songs.zip'
    },
    // Helper function to get correct file URL
    getFileUrl: function(relativePath) {
        if (this.IS_PRODUCTION) {
            // In production (GitHub Pages), access files from raw GitHub content
            return `https://raw.githubusercontent.com/${this.GITHUB_REPO}/${this.GITHUB_BRANCH}/${encodeURI(relativePath)}`;
        }
        // In development (localhost), use relative paths
        return relativePath;
    }
};

window.SUBJECT_CONFIG = {
    Physics: {
        icon: 'P',
        color: 'physics'
    },
    Chemistry: {
        icon: 'C',
        color: 'chemistry'
    },
    Mathematics: {
        icon: 'M',
        color: 'mathematics'
    },
    Resources: {
        icon: 'R',
        color: 'resources'
    },
    Prompts: {
        icon: 'P',
        color: 'resources'
    }
};
