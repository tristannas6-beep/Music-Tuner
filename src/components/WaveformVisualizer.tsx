import React, { useRef, useEffect } from 'react';

/**
 * WaveformVisualizer - A high-performance canvas-based oscilloscope.
 * Displays the raw audio time-domain signal.
 */

interface Props {
  analyser: AnalyserNode | null;
  isDetecting: boolean;
  color?: string;
}

export const WaveformVisualizer: React.FC<Props> = ({ 
  analyser, 
  isDetecting, 
  color = '#0074D9' 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!canvasRef.current || !analyser || !isDetecting) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bufferLength = analyser.fftSize;
    const dataArray = new Float32Array(bufferLength);

    const draw = () => {
      rafRef.current = requestAnimationFrame(draw);
      analyser.getFloatTimeDomainData(dataArray);

      // Clear canvas with a slight trail effect (optional, here we clear fully for "elite" feel)
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.lineWidth = 2;
      ctx.strokeStyle = color;
      ctx.beginPath();

      const sliceWidth = canvas.width / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        // Map float value (-1 to 1) to canvas height
        const v = dataArray[i] * 50; // Scale amplitude
        const y = (canvas.height / 2) + v;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      ctx.stroke();
    };

    draw();

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [analyser, isDetecting, color]);

  return (
    <div style={{ 
      width: '100%', 
      height: '60px', 
      overflow: 'hidden', 
      opacity: isDetecting ? 0.6 : 0,
      transition: 'opacity 0.5s ease',
      maskImage: 'linear-gradient(to right, transparent, black 20%, black 80%, transparent)',
      WebkitMaskImage: 'linear-gradient(to right, transparent, black 20%, black 80%, transparent)'
    }}>
      <canvas 
        ref={canvasRef} 
        width={300} 
        height={60} 
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
};
