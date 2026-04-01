'use strict';

/**
 * Music Player Controller
 * Manages audio playback, queue, and player UI
 */
class MusicApp {
    constructor() {
        this.library = window.MUSIC_LIBRARY || [];
        this.currentQueue = [...this.library];
        this.currentIndex = -1;
        this.isPlaying = false;
        this.isShuffle = false;
        this.isRepeat = false;
        this.audio = new Audio();

        this.elements = {
            player: document.getElementById('musicPlayer'),
            title: document.getElementById('playerTitle'),
            artist: document.getElementById('playerArtist'),
            playBtn: document.getElementById('btnPlayPause'),
            playIcon: document.getElementById('playIcon'),
            prevBtn: document.getElementById('btnPrev'),
            nextBtn: document.getElementById('btnNext'),
            shuffleBtn: document.getElementById('btnShuffle'),
            repeatBtn: document.getElementById('btnRepeat'),
            progressBar: document.getElementById('progressBar'),
            timeCurrent: document.getElementById('timeCurrent'),
            timeTotal: document.getElementById('timeTotal'),
            volumeBar: document.getElementById('volumeBar'),
            volumeIcon: document.getElementById('volumeIcon'),
            closeBtn: document.getElementById('btnClosePlayer'),
            content: document.getElementById('content')
        };

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.audio.volume = 1.0;
    }

    setupEventListeners() {
        this.audio.addEventListener('timeupdate', () => this.updateProgress());
        this.audio.addEventListener('ended', () => this.handleSongEnd());
        this.audio.addEventListener('loadedmetadata', () => {
            if (this.elements.timeTotal) {
                this.elements.timeTotal.textContent = this.formatTime(this.audio.duration);
            }
            if (this.elements.progressBar) {
                this.elements.progressBar.max = 100;
            }
        });

        this.elements.playBtn?.addEventListener('click', () => this.togglePlay());
        this.elements.nextBtn?.addEventListener('click', () => this.playNext());
        this.elements.prevBtn?.addEventListener('click', () => this.playPrev());
        this.elements.shuffleBtn?.addEventListener('click', () => this.toggleShuffle());
        this.elements.repeatBtn?.addEventListener('click', () => this.toggleRepeat());
        this.elements.progressBar?.addEventListener('input', (e) => this.seek(e));
        this.elements.volumeBar?.addEventListener('input', (e) => this.setVolume(e));
        this.elements.closeBtn?.addEventListener('click', () => this.closePlayer());

        document.addEventListener('click', (e) => {
            if (window.app && window.app.currentClass !== 'music') return;

            const card = e.target.closest('.music-card');
            if (card) {
                const id = parseInt(card.dataset.id, 10);
                if (!isNaN(id)) {
                    this.playSongById(id);
                }
            }
        });
    }

    formatTime(seconds) {
        if (isNaN(seconds) || !isFinite(seconds)) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    updateProgress() {
        if (this.audio.duration && isFinite(this.audio.duration)) {
            const percent = (this.audio.currentTime / this.audio.duration) * 100;
            if (this.elements.progressBar) {
                this.elements.progressBar.value = percent;
            }
            if (this.elements.timeCurrent) {
                this.elements.timeCurrent.textContent = this.formatTime(this.audio.currentTime);
            }
        }
    }

    seek(e) {
        if (this.audio.duration && isFinite(this.audio.duration)) {
            const percent = parseFloat(e.target.value);
            this.audio.currentTime = (percent / 100) * this.audio.duration;
        }
    }

    setVolume(e) {
        const vol = parseFloat(e.target.value) / 100;
        this.audio.volume = Math.max(0, Math.min(1, vol));
        if (this.elements.volumeIcon) {
            if (vol === 0) {
                this.elements.volumeIcon.innerHTML = '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line>';
            } else if (vol < 0.5) {
                this.elements.volumeIcon.innerHTML = '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>';
            } else {
                this.elements.volumeIcon.innerHTML = '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>';
            }
        }
    }

    closePlayer() {
        this.audio.pause();
        this.isPlaying = false;
        this.currentIndex = -1;
        this.updatePlayIcon();
        this.updatePlayingStateInGrid();
        if (this.elements.player) {
            this.elements.player.classList.add('hidden');
        }
    }

    togglePlay() {
        if (this.currentIndex === -1) {
            if (this.currentQueue.length > 0) {
                this.playSong(0);
            }
            return;
        }

        if (this.isPlaying) {
            this.audio.pause();
            this.isPlaying = false;
        } else {
            this.audio.play().catch(() => {
                if (window.app) window.app.showNotification('Playback requires interaction', 'warning');
            });
            this.isPlaying = true;
        }
        this.updatePlayIcon();
        this.updatePlayingStateInGrid();
    }

    updatePlayIcon() {
        if (!this.elements.playIcon) return;
        if (this.isPlaying) {
            this.elements.playIcon.innerHTML = '<rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect>';
        } else {
            this.elements.playIcon.innerHTML = '<polygon points="5 3 19 12 5 21 5 3"></polygon>';
        }
    }

    playSongById(id) {
        const index = this.currentQueue.findIndex(s => s.id === id);
        if (index !== -1) {
            this.playSong(index);
        } else {
            const libIndex = this.library.findIndex(s => s.id === id);
            if (libIndex !== -1) {
                if (!this.isShuffle) this.currentQueue = [...this.library];
                const newIndex = this.currentQueue.findIndex(s => s.id === id);
                this.playSong(newIndex);
            }
        }
    }

    playSong(index) {
        if (index < 0 || index >= this.currentQueue.length) return;

        this.currentIndex = index;
        const song = this.currentQueue[this.currentIndex];

        this.audio.src = song.src;
        this.audio.play()
            .then(() => {
                this.isPlaying = true;
                this.updatePlayIcon();
                this.updatePlayerUI(song);
                this.updatePlayingStateInGrid();
            })
            .catch(() => {
                if (window.app) window.app.showNotification('Could not play song', 'error');
            });

        this.elements.player?.classList.remove('hidden');
    }

    playNext() {
        if (this.currentQueue.length === 0) return;

        let nextIndex = this.currentIndex + 1;
        if (nextIndex >= this.currentQueue.length) {
            nextIndex = 0;
        }
        this.playSong(nextIndex);
    }

    playPrev() {
        if (this.currentQueue.length === 0) return;

        if (this.audio.currentTime > 3) {
            this.audio.currentTime = 0;
            return;
        }

        let prevIndex = this.currentIndex - 1;
        if (prevIndex < 0) {
            prevIndex = this.currentQueue.length - 1;
        }
        this.playSong(prevIndex);
    }

    handleSongEnd() {
        if (this.isRepeat) {
            this.audio.currentTime = 0;
            this.audio.play().catch(() => {
                // Repeat playback blocked by browser; silently stop
                this.isPlaying = false;
                this.updatePlayIcon();
            });
        } else {
            this.playNext();
        }
    }

    toggleShuffle() {
        this.isShuffle = !this.isShuffle;
        if (this.elements.shuffleBtn) {
            this.elements.shuffleBtn.classList.toggle('active', this.isShuffle);
        }

        const currentSong = this.currentIndex !== -1 ? this.currentQueue[this.currentIndex] : null;

        if (this.isShuffle) {
            this.currentQueue = [...this.library].sort(() => Math.random() - 0.5);
        } else {
            this.currentQueue = [...this.library];
        }

        if (currentSong) {
            this.currentIndex = this.currentQueue.findIndex(s => s.id === currentSong.id);
        }
    }

    toggleRepeat() {
        this.isRepeat = !this.isRepeat;
        if (this.elements.repeatBtn) {
            this.elements.repeatBtn.classList.toggle('active', this.isRepeat);
        }
    }

    updatePlayerUI(song) {
        if (this.elements.title) this.elements.title.textContent = song.title;
        if (this.elements.artist) this.elements.artist.textContent = song.artist || song.folder;
    }

    updatePlayingStateInGrid() {
        document.querySelectorAll('.music-card').forEach(card => card.classList.remove('playing'));
        if (this.isPlaying && this.currentIndex !== -1) {
            const currentSong = this.currentQueue[this.currentIndex];
            if (currentSong) {
                const playingCard = document.querySelector('.music-card[data-id="' + String(currentSong.id) + '"]');
                if (playingCard) {
                    playingCard.classList.add('playing');
                }
            }
        }
    }

    sanitizeHTML(str) {
        if (!str) return '';
        const temp = document.createElement('div');
        temp.textContent = str;
        return temp.innerHTML;
    }

    render() {
        if (!this.elements.content) return;

        let displayList = this.library;

        if (window.app && window.app.searchTerm) {
            const term = window.app.searchTerm.toLowerCase();
            displayList = displayList.filter(s =>
                s.title.toLowerCase().includes(term) ||
                (s.artist && s.artist.toLowerCase().includes(term)) ||
                (s.folder && s.folder.toLowerCase().includes(term))
            );
        }

        if (displayList.length === 0) {
            this.elements.content.innerHTML = '<div class="empty">No songs found.</div>';
            return;
        }

        let html = '<div class="music-grid">';

        displayList.forEach(song => {
            const isCurrentlyPlaying = (this.currentIndex !== -1 && this.currentQueue[this.currentIndex].id === song.id && this.isPlaying);
            const playingClass = isCurrentlyPlaying ? 'playing' : '';

            html += `
                <div class="music-card ${playingClass}" data-id="${song.id}">
                    <div class="music-cover">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="5.5" cy="17.5" r="2.5"></circle>
                            <circle cx="17.5" cy="15.5" r="2.5"></circle>
                            <path d="M8 17V5l12-2v12"></path>
                            <path d="M8 9l12-2"></path>
                        </svg>
                    </div>
                    <div class="music-title" title="${this.sanitizeHTML(song.title)}">${this.sanitizeHTML(song.title)}</div>
                    <div class="music-artist">${this.sanitizeHTML(song.artist || song.folder)}</div>
                </div>
            `;
        });

        html += '</div>';

        this.elements.content.innerHTML = html;
        this.updatePlayingStateInGrid();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.musicApp = new MusicApp();
});
