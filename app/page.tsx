'use client'
import React, { useState, useEffect, useCallback } from 'react';
import * as fal from "@fal-ai/serverless-client";
import Image from 'next/image';
import P5Block from './p5block';

fal.config({
  proxyUrl: "/api/fal/proxy",
});

const seed = Math.floor(Math.random() * 100000);

export default function Home() {
  // const [input, setInput] = useState('glow, pulsating, eye, crystals hyper-realistic, ferroliquid, 3D, black and white, silver, dramatic light, huge complexity floating organic growth tendrils, tubes, and wires glowing transparent cells robotic exo-skeleton, many brains slime mold neuronal blood bones glass diatom vectors genital vortex architectures of water, light, oil, smoke and internal light and no gravity');
  const [input, setInput] = useState('3d morphing tubular bubble circular forms of smoke,slinky made f light  and oil, time travel technology, time warp, folding time, tech fot shooting light');
  const [strength, setStrength] = useState(0.75);
  const [image1, setImage1] = useState(null); // Only one image state now
  const [isClient, setIsClient] = useState(false);
  const [audioSrc, setAudioSrc] = useState('/neuro4.wav');

  useEffect(() => { setIsClient(true); }, []);

  const { send } = fal.realtime.connect('110602490-sdxl-turbo-realtime', {
    connectionKey: 'fal-ai/fast-lightning-sdxl',
    onResult(result) {
      if (result.error) return;
      setImage1(result.images?.[0]?.url ?? null); // Only setting image1
    }
  });

  const captureAndSendImage = useCallback(() => {
    const canvas = document.querySelector('canvas');
    if (canvas) {
      const image_url = canvas.toDataURL();
      send({
        sync_mode: true,
        strength,
        seed,
        prompt: input,
        image_url
      });
    }
  }, [strength, input, send]);

  useEffect(() => {
    if (isClient) {
      const interval = setInterval(captureAndSendImage, 200);
      return () => clearInterval(interval);
    }
  }, [isClient, captureAndSendImage]);

  return (
    <main className="bg-black text-white flex flex-col justify-between min-h-screen">
      <div className="flex-grow">
        <div className="flex flex-col md:flex-row justify-center items-center p-6">
        
          <div className='w-full h-full'>
            {isClient && <P5Block />}
          </div>
          <div className='w-full h-full flex justify-center'>
            {/* Only displaying image1 */}
            {image1 && <Image src={image1} width={600} height={600} alt='Generated Image' />}
          </div>
        </div>
      </div>

      {/* Audio Player and Text Content */}
      <div className="mt-auto">
        <div className="flex flex-col items-center justify-center mb-4">
          <div className="audio-player my-4">
            <audio controls src={audioSrc} loop>
              Your browser does not support the audio element.
            </audio>
          </div>
          <div className="text-center">
            <p className="text-xl mb-2">blackbox hyper-objects 03</p>
            <p className="text-xl mb-2">Play sound and move the sliders to move the object in the left canvas and interact with the generative design and AI model. Concept, generative design, programming, and music by <a href="https://linktr.ee/marlonbarriososolano" target="_blank" rel="noopener noreferrer">Marlon Barrios Solano</a>.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
