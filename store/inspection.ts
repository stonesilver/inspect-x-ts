import {defineStore} from "pinia";

export const useInspection = defineStore({
    id: 'inspection',
    state: () => {
        return {
            request_info: [
                {
                    icon: '/images/icons/camera.svg',
                    title: 'Device camera',
                    desc: 'Allow system to access camera',
                },
                {
                    icon: '/images/icons/location.svg',
                    title: 'Device location',
                    desc: 'Allow system to access device location',
                },
            ],
            stages: [
                {
                    text: "Start",
                    tag: "welcome-screen",
                    url: "/images/inspection/start.webp",
                    desc: "",
                },
                {
                    text: "",
                    tag: "front_image",
                    url: "/images/inspection/front.webp",
                    desc: "front view",
                },
                {
                    text: "",
                    tag: "right_image",
                    url: "/images/inspection/right.webp",
                    desc: "right view",
                },
                {
                    text: "",
                    tag: "back_image",
                    url: "/images/inspection/back.webp",
                    desc: "back view",
                },
                {
                    text: "",
                    tag: "left_image",
                    url: "/images/inspection/left.webp",
                    desc: "left view",
                },
                {
                    text: "",
                    tag: "dashboard_image",
                    url: "/images/inspection/dashboard.webp",
                    desc: "dashboard",
                },
                {
                    text: 'Finish',
                    tag: 'interior_back',
                    url: '/images/inspection/car-interior.webp',
                    desc: 'interior back'
                },
            ],
            activeStep: {
                title: "info-modal",
                step: 0,
            },
            lat: 0,
            long: 0,
            width: 0,
            height: 0,
            video: null as null | any,
            photo: null as any,
            canvas: null as any,
            isStreaming: false,
            stream: null as any,
            startInspection: false,
            activeIndex: 0,
            interval: null as any,
            timer: 90000,
            images: [] as {
                title: string,
                blob: any,
                imgPreview: any
            }[],
            deniedLocation: false,
            deniedCamera: false,
            deviceNotSupported: false,
            deviceError: {
                title: '',
                desc: '',
                cta: 0
            },
            cameraViewHeight: 0,
            mediaRecorder: null,
            videoChunks: [],
            videoBlob: null,
            videoFile: null,
            navigator: null as any,
        }
    },
    actions: {
        changeStep(step: any) {
            this.activeStep = step
        },
        setCameraView() {
            this.width = window.innerWidth;
            this.height = window.innerHeight;
        },
        getGeoLocation() {
            return new Promise((resolve, reject) => {
                try {
                    if ("geolocation" in navigator) {
                        this.navigator = navigator.geolocation.watchPosition(
                            (cord) => this.setGeoLocation(cord, resolve),
                            () => this.catchGeoLocationError(reject)
                        );
                    } else {
                        console.error("GPS not available on device");
                        this.deviceNotSupported = true
                    }
                } catch (e) {
                    console.error(e);
                    this.deviceNotSupported = true
                }
            });
        },
        setGeoLocation(position: any, resolve: any) {
            this.lat = position.coords.latitude;
            this.long = position.coords.longitude;
            resolve("Permission allowed 😁");
        },
        catchGeoLocationError(reject: any) {
            reject("user denied permission 🤨");
        },
        initMedia() {
            const video = document.getElementById("video");
            this.video = video;
            const constraints = {
                audio: false,
                video: {
                    width: {ideal: 1280},
                    height: {ideal: 720},
                    // facingMode: {exact: "environment"},
                },
            };
            try {
                navigator.mediaDevices
                    .getUserMedia(constraints)
                    .then((stream) => {
                        this.stream = stream;
                        this.startVideo(stream, video);
                        // this.recordVideo(stream);
                    })
                    .catch((err) => {
                        console.error(err, "Please enable camera ☹️");
                        this.deviceError = {
                            title: err.constraint === 'facingMode' ? 'Back Camera not detected' : 'Camera disabled',
                            desc: err.constraint === 'facingMode' ? 'We’re sorry we do not currently support this device.' : 'Please enable camera and try again.',
                            cta: err.constraint === 'facingMode' ? 1 : 2
                        }
                        this.deniedCamera = true;
                    });
            } catch (error) {
                this.deviceError = {
                    title: 'Device Not Supported',
                    desc: 'We’re sorry we do not currently support this device.',
                    cta: 1
                }
                this.deviceNotSupported = true
                console.log("Device not supported 😡");
                this.deviceError = {
                    title: 'Device Not Supported',
                    desc: 'We’re sorry we do not currently support this device.',
                    cta: 1
                }
            }
        },
        startVideo(stream: any, video: any) {
            this.canvas = document.getElementById("canvas");
            video.srcObject = stream;
            video.play();

            this.video.addEventListener("canplay", () => {
                    if (!this.isStreaming) {
                        this.isStreaming = true;
                    }
                },
                false
            );
        },
        takePicture() {
            // First click on snap btn to start the inspection process
            if (!this.startInspection) {
                ++this.activeIndex;
                this.startInspection = true;
                this.startTimer();
                // this.mediaRecorder?.start();
                return null;
            }
            // Logic to place a canvas on the video, draw the current image and save the image in an array
            if (this.activeIndex < 7) {
                this.canvas = document.getElementById("canvas");
                const video = document.querySelector("#video");

                const context = this.canvas.getContext("2d");
                if (this.width && this.height) {
                    this.canvas.width = this.width;
                    this.canvas.height = this.height;
                    context.drawImage(video, 0, 0, this.width, this.height);
                    const data = this.canvas.toDataURL("image/jpeg", 0.5);
                    fetch(data)
                        .then((res) => res.blob())
                        .then((blob) => {
                            this.images.push({
                                title: this.stages[this.activeIndex].tag,
                                blob: blob,
                                imgPreview: data,
                            });
                            ++this.activeIndex;
                        })
                        .catch((err) => console.log(err, "error"));
                } else {
                    this.clearPhoto();
                }
            } else {
                // Inspection completed; Move to next step
                this.clearInterval();
                this.stopRecording()
                this.changeStep({title: 'inspection-modal', step: 1})
                this.isStreaming = false
                // this.mediaRecorder?.stop();
            }
        },
        clearPhoto() {
            this.photo = document.getElementById("photo");
            const context = this.canvas.getContext("2d");

            context.fillStyle = "#AAA";
            context.fillRect(0, 0, this.canvas.width, this.canvas.height);

            const data = this.canvas.toDataURL("image/png");
            this.photo.setAttribute("src", data);
        },
        stopRecording() {
            // method to stop the camera
            this.stream && this.stream.getTracks().forEach((track: MediaStreamTrack) => track.stop());
        },
        startTimer() {
            this.interval = setInterval(() => {
                this.timer = this.timer - 1000;
            }, 1000);
        },
        clearInterval() {
            clearInterval(this.interval);
        },
        startInspectionEngine() {
            this.deniedCamera = false
            this.deniedLocation = false
            this.deviceNotSupported = false

            this.setCameraView();

            if (this.long > 0 && this.lat > 0) {
                setTimeout(() => {
                    this.initMedia()
                }, 1000)
            } else {
                this.getGeoLocation()
                    .then(() => {
                        this.initMedia()
                    })
                    .catch((err) => {
                        console.error(err, "user denied");
                        this.deviceError = {
                            title: 'Location disabled',
                            desc: 'Please enable location and try again.',
                            cta: 2
                        }
                        this.deniedLocation = true
                    });
            }
        },
        reset() {
            this.changeStep({title: 'inspection-modal', step: 0})
            this.startInspection = false;
            this.activeIndex = 0;
            this.interval = null;
            this.timer = 90000;
            this.images = [];
            setTimeout(() => {
                this.initMedia();
                this.setCameraView();
            }, 1000);
        },
        submit() {
            // this.$emit('done', this.images)
            navigator.geolocation.clearWatch(this.navigator);
        },
        tryAgain() {
            this.timer = 90000
            this.activeIndex = 0
            this.startInspection = false
            this.images = []
        }
    }
})