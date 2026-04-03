/**
 * Application Configuration
 * @constant {Object} CONFIG - Main application configuration
 */
window.CONFIG = Object.freeze({
    SEARCH_DEBOUNCE_MS: 300,
    DEFAULT_CLASS: 11,
    VERSION: '1.9.0',
    CACHE_POLICY: 'no-cache',
    DOWNLOAD_PATHS: Object.freeze({
        11: 'https://github.com/God-Hand1/Vibrant-Academy/releases/download/V1.0.0/Class.11th.Modules.zip',
        12: 'https://github.com/God-Hand1/Vibrant-Academy/releases/download/V1.0.0/Class.12th.Modules.zip',
        'music': 'https://github.com/God-Hand1/Vibrant-Academy/releases/download/V1.0.0/Songs.zip'
    })
});

/**
 * Subject Configuration
 * @constant {Object} SUBJECT_CONFIG - Subject-specific display configuration
 */
window.SUBJECT_CONFIG = Object.freeze({
    Physics: Object.freeze({
        icon: 'P',
        color: 'physics'
    }),
    Chemistry: Object.freeze({
        icon: 'C',
        color: 'chemistry'
    }),
    Mathematics: Object.freeze({
        icon: 'M',
        color: 'mathematics'
    }),
    Resources: Object.freeze({
        icon: 'R',
        color: 'resources'
    }),
    Prompts: Object.freeze({
        icon: 'P',
        color: 'resources'
    })
});