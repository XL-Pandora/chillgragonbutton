// 全局变量记录当前播放的音频
let currentPlayingAudio = null;

function loadAudio(url) {
    return new Promise((resolve, reject) => {
        const audio = new Audio(url);
        audio.preload = 'auto';
        
        audio.addEventListener('canplaythrough', () => resolve(audio), { once: true });
        audio.addEventListener('error', () => reject(new Error(`音频加载失败: ${url}`)), { once: true });
    });
}

function stopCurrentAudio() {
    if (currentPlayingAudio && !currentPlayingAudio.paused) {
        currentPlayingAudio.pause();
        currentPlayingAudio.currentTime = 0;
        document.querySelectorAll('.audio-btn.playing').forEach(btn => {
            btn.classList.remove('playing');
        });
    }
}

function initAudioButtons() {
    document.querySelectorAll('.audio-btn').forEach(button => {
        if (button._audioInitialized) return;
        button._audioInitialized = true;
        
        let audioInstance = null;
        let isLoading = false;
        
        button.addEventListener('click', async function() {
            if (isLoading) return;
            
            const audioUrl = this.dataset.audioUrl;
            
            try {
                // 停止当前播放
                stopCurrentAudio();
                
                // 如果是再次点击同一个按钮且音频已加载
                if (audioInstance && currentPlayingAudio === audioInstance) {
                    currentPlayingAudio = null;
                    return;
                }
                
                isLoading = true;
                this.disabled = true;
                
                // 加载或重用音频实例
                audioInstance = audioInstance || await loadAudio(audioUrl);
                
                // 设置当前播放
                currentPlayingAudio = audioInstance;
                this.classList.add('playing');
                this.disabled = false;
                
                await audioInstance.play();
                
                // 播放结束处理
                const onEnded = () => {
                    this.classList.remove('playing');
                    if (currentPlayingAudio === audioInstance) {
                        currentPlayingAudio = null;
                    }
                    audioInstance.removeEventListener('ended', onEnded);
                };
                audioInstance.addEventListener('ended', onEnded);
                
            } catch (error) {
                console.error('播放失败:', error);
                this.disabled = false;
                if (currentPlayingAudio === audioInstance) {
                    currentPlayingAudio = null;
                }
            } finally {
                isLoading = false;
            }
        });
    });
}

document.addEventListener('DOMContentLoaded', initAudioButtons);