class VideoPlayerCustom {

    constructor(settings) {
        this._settings = settings;
        this._videoContainer = null;
        this._video = null;
        this._toggleBtn = null;
        this._progress = null;
        this._progressContainer = null;
    }

    /**
     * @description function to initiate 
     */
    init() {
        if(!this._settings.videoUrl) {
            return console.error("Need video URL!!!!");
        }
        if (!this._settings.playerContainer) {
            return console.error("Need player container!!!!")
        }
        this._addTemplate();
        this._setElements();
        this._setEvents();
    }

    /**
     * @description adds template to DOM
     */
    _addTemplate() {
        const template = this._createTemplate();
        const container = document.querySelector(this._settings.playerContainer);
        container && container.insertAdjacentHTML("afterbegin", template);
    }

    /**
     * @description set UI elements
     */
    _setElements() {
        this._videoContainer = document.querySelector(this._settings.playerContainer);
        this._video = this._videoContainer.querySelector("video");
        this._toggleBtn =  this._videoContainer.querySelector(".toggle");
        this._progress = this._videoContainer.querySelector(".progress_filled");
        this._progressContainer = this._videoContainer.querySelector(".progress");
        this._volumeRange = this._videoContainer.querySelector("input[name='volume']");
        this._rateRange = this._videoContainer.querySelector("input[name='playbackRate']");
        this._stepForward = this._videoContainer.querySelector("#stepForward");
        this._stepBackward = this._videoContainer.querySelector("#stepBackward");
    }

    /**
     * @description set events on UI elements
     */
    _setEvents() {
        this._video.addEventListener("click", ()=> this._toggle());
        this._toggleBtn.addEventListener("click", ()=> this._toggle());
        this._video.addEventListener("timeupdate", () => this._handleProgress());
        this._video.addEventListener("ended", () => this._endVideo());
        this._progressContainer.addEventListener("click", (e) => this._rewind(e));
        this._progressContainer.addEventListener("mousemove", (e) => this._mousedown && this._rewind(e));
        this._progressContainer.addEventListener("mousedown", e => this._mousedown = true);
        this._progressContainer.addEventListener("mouseup", e=> this._mousedown = false);
        this._volumeRange.addEventListener("input", e => this._setVolume(e));
        this._rateRange.addEventListener("change", e=> this._setRate(e)); // change чтобы скорость не менялась, пока не отпустишь мышь
        this._stepForward.addEventListener("click", e=> this._rewindSeconds(e));
        this._stepBackward.addEventListener("click", e=> this._rewindSeconds(e));
        this._video.addEventListener("dblclick", e => this._rewindSeconds(e));
    }

    /**
     * @description generate template
     */
    _createTemplate() {
        return `
            <div class="player">
                <video class="player_video viewer" src="${this._settings.videoUrl}"></video>
                <div class="player_controls">
                    <div class="progress">
                        <div class="progress_filled"></div>
                    </div>
                    <button class="player-button toggle" title="Toggle play">►</button>
                    <input type="range" name="volume" min="0" max="1" step="${this._settings.volumeStep}">
                    <input type="range" name="playbackRate" min="0" max="5" value="1" step="${this._settings.rateStep}">
                    <button class="player-button seconds" id="stepBackward"><<${this._settings.rewindStep}s</button>
                    <button class="player-button seconds" id="stepForward">${this._settings.rewindStep}s>></button>
                </div>
            </div>
        `
    }

    /**
     * @description function to play/pause video
     */
    _toggle() {
        const method = this._video.paused ? "play" : "pause";
        this._toggleBtn.textContent = this._video.paused ? '❚❚' : "►"
        this._video[method]();
    }

    /**
     * @description function to represent current progress of video
     */
    _handleProgress() {
        const percent = (this._video.currentTime / this._video.duration) * 100;
        this._progress.style.width = `${percent}%`;
    }

    /**
     * @description function to set the progress bar to 0 when the video ends
     */
    _endVideo() {
        this._progress.style.width = 0;
    }

    /**
     * 
     * @param {Object} e event to start rewinding the video
     * @description rewinds the video
     */
    _rewind(e) {
        this._video.currentTime = (e.offsetX/this._progressContainer.offsetWidth) * this._video.duration;
    }

    /**
     * 
     * @param {Object} e event to chang the volume
     * @description sets the volume
     */
    _setVolume(e){
        this._video.volume = e.target.value;
    }
    
    /**
     * 
     * @param {Object} e event to change the rate
     * @description sets the playback rate of the video
     */
    _setRate(e) {
        this._video.playbackRate = e.target.value;
    }
    
    /**
     * 
     * @param {Object} e event to step forward or backward in current video time
     * @description rewinds video forward or backward depending on the target
     */
    _rewindSeconds(e) {
        switch(e.target) {
            case this._stepForward : {
                this._video.currentTime += this._settings.rewindStep;
                break;
            }
            case this._stepBackward : {
                this._video.currentTime -= this._settings.rewindStep;
                break;
            }
            case this._video : { 
                if (e.offsetX < 20) {                    
                    this._video.currentTime -= this._settings.rewindStep;
                } else if (e.offsetX > e.target.offsetWidth - 20) {
                    this._video.currentTime += this._settings.rewindStep;
                }
                break;
            }
            default: break;
        }   
    }
}

let player = new VideoPlayerCustom( {
    videoUrl: "video/mov_bbb.mp4",
    playerContainer: "body",
    volumeStep: 0.05,
    rateStep: 0.5,
    rewindStep: 2
} );
player.init();