/** @namespace LAB.sound*/
LAB.sound = LAB.sound || {};

LAB.sound.Context 	= LAB.sound.Context || new webkitAudioContext();
LAB.sound.Panner 	= LAB.sound.Context.createPanner();
LAB.sound.Panner.setPosition(0, 0, 0.0);