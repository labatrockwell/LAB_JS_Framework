/** @namespace LAB.sound*/
LAB.sound = LAB.sound || {};

if (typeof AudioContext == "function") {
    LAB.sound.Context 	= LAB.sound.Context || new AudioContext();
} else if (typeof webkitAudioContext == "function") {
    LAB.sound.Context 	= LAB.sound.Context || new webkitAudioContext();
}