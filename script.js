/**
 * Cinematic Temporal Engine (CTE) - Final Controller with Outro
 */

const libraries = bakedLibraries;

let currentIndex = 0;
let filteredLibraries = [];
let currentSceneLayer = null;
let isPaused = false;
let currentSceneId = 0;
const audio = document.getElementById('bg-music');

const STATE_DURATIONS = {
    1: 4500, 2: 5500, 3: 6000, 4: 6500, 6: 7700, 7: 8700, 11: 10200
};

let totalDuration = 0;
let libraryMarkers = [];

function calculateTimeline() {
    let elapsed = 0;
    libraryMarkers = libraries.map((lib, i) => {
        const dur = STATE_DURATIONS[lib.count] || 5000;
        const marker = { start: elapsed, end: elapsed + dur, index: i };
        elapsed += dur;
        return marker;
    });
    totalDuration = elapsed;
}

function updateTimelineUI(currentTime) {
    const progress = Math.min(100, (currentTime / totalDuration) * 100);
    document.getElementById('timeline-fill').style.width = `${progress}%`;
    document.getElementById('time-display').innerText = `${formatTime(currentTime)} / ${formatTime(totalDuration)}`;
}

function formatTime(ms) {
    const totalSec = Math.floor(ms / 1000);
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

async function playEngine() {
    if (currentIndex >= filteredLibraries.length) {
        showOutro();
        return;
    }

    if (isPaused) return;

    const sceneId = ++currentSceneId;
    const lib = filteredLibraries[currentIndex];
    const marker = libraryMarkers[currentIndex];
    const container = document.getElementById('scene-canvas');

    const nextLayer = document.createElement('div');
    nextLayer.className = 'scene-layer';
    container.appendChild(nextLayer);

    const oldLayer = currentSceneLayer;
    currentSceneLayer = nextLayer;
    if (oldLayer) {
        oldLayer.classList.add('fading-out');
        setTimeout(() => oldLayer.remove(), 2000);
    }

    const startTime = Date.now();
    const playbackInt = setInterval(() => {
        if (sceneId !== currentSceneId || isPaused) {
            clearInterval(playbackInt);
            return;
        }
        updateTimelineUI(marker.start + (Date.now() - startTime));
    }, 100);

    const renderPromise = (async () => {
        try {
            const count = lib.count;
            if (count === 1) await window.renderState1(nextLayer, lib);
            else if (count === 2) await window.renderState2(nextLayer, lib);
            else if (count === 3) await window.renderState3(nextLayer, lib);
            else if (count === 4) await window.renderState4(nextLayer, lib);
            else if (count === 6) await window.renderState6(nextLayer, lib);
            else if (count === 7) await window.renderState7(nextLayer, lib);
            else if (count === 11) await window.renderState11(nextLayer, lib);
            else await window.renderState1(nextLayer, lib);
        } catch(e) { console.error(e); }
    })();

    await renderPromise;
    clearInterval(playbackInt);
    if (sceneId !== currentSceneId) return;

    if (!isPaused) {
        currentIndex++;
        playEngine(); 
    }
}

function showOutro() {
    document.getElementById('movie').classList.remove('active');
    document.getElementById('outro').classList.add('active');
    // Keep audio playing for a bit or fade out
    setTimeout(() => {
        audio.pause();
    }, 5000);
}

function seek(e) {
    const track = document.getElementById('timeline-track');
    const rect = track.getBoundingClientRect();
    const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
    const pct = Math.max(0, Math.min(1, x / rect.width));
    const seekTime = pct * totalDuration;

    const marker = libraryMarkers.find(m => seekTime >= m.start && seekTime <= m.end);
    if (marker) {
        currentIndex = marker.index;
        if (audio.duration) audio.currentTime = pct * audio.duration;
        updateTimelineUI(seekTime);
        playEngine();
    }
}

function init() {
    filteredLibraries = libraries;
    calculateTimeline();
    
    document.getElementById('play-pause-btn').addEventListener('click', () => {
        isPaused = !isPaused;
        const btn = document.getElementById('play-pause-btn');
        btn.innerText = isPaused ? "▶ נגני" : "❚❚ השהה";
        if (isPaused) audio.pause();
        else { audio.play(); playEngine(); }
    });
    
    document.getElementById('fs-btn').addEventListener('click', () => {
        document.getElementById('movie').classList.toggle('hide-ui');
        if (!document.fullscreenElement) document.documentElement.requestFullscreen().catch(e => {});
        else document.exitFullscreen().catch(e => {});
    });

    document.getElementById('timeline-track').addEventListener('click', seek);
    document.getElementById('timeline-track').addEventListener('touchstart', seek);

    document.getElementById('replay-btn').addEventListener('click', () => {
        document.getElementById('outro').classList.remove('active');
        document.getElementById('movie').classList.add('active');
        currentIndex = 0;
        audio.currentTime = 0;
        audio.play();
        playEngine();
    });

    setTimeout(() => {
        document.getElementById('loader').style.opacity = '0';
        setTimeout(() => document.getElementById('loader').style.display = 'none', 1000);
    }, 500);
}

document.getElementById('start-btn').addEventListener('click', () => {
    document.getElementById('intro').classList.remove('active');
    document.getElementById('movie').classList.add('active');
    currentIndex = 0;
    audio.play();
    playEngine();
});

document.addEventListener('DOMContentLoaded', init);
