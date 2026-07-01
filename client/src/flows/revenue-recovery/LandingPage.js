import React, { useRef, useState, useEffect } from 'react';
import landingImg from './rr-landing.png';

// Image natural: 3244 × 2768
// "Get Started" button center: ~50% x, ~76% y (of full image height)
// Bottom cards start at ~83% — crop there to hide them

const LandingPage = ({ onGetStarted }) => {
  const imgRef = useRef(null);
  const [imgH, setImgH] = useState(0);

  useEffect(() => {
    const el = imgRef.current;
    if (!el) return;
    const update = () => setImgH(el.offsetHeight);
    el.addEventListener('load', update);
    if (el.complete) update();
    window.addEventListener('resize', update);
    return () => { el.removeEventListener('load', update); window.removeEventListener('resize', update); };
  }, []);

  // Crop at 82% of natural image height to hide the bottom cards
  const visibleH = imgH * 0.82;
  // Transparent button covers "Get Started" which sits at ~76% of the full image height
  const btnTop = imgH * 0.76;
  // Approximate button width / height in the image at current scale
  // In the 3244px image, button is ~580px wide and ~100px tall
  // As % of rendered width: 580/3244 ≈ 17.9%, height: 100/3244 ≈ 3.1% of width
  const imgW = imgRef.current?.offsetWidth ?? 0;
  const btnW = imgW * 0.28;
  const btnH = imgW * 0.06;

  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flex: 1, width: '100%',
      background: '#ffffff',
      paddingBottom: '10%',
    }}>
      <div style={{
        position: 'relative',
        width: '100%',
        maxWidth: 640,
        margin: '0 auto',
        height: visibleH || 'auto',
        overflow: 'hidden',
      }}>
        <img
          ref={imgRef}
          src={landingImg}
          alt="Revenue Recovery"
          style={{ width: '100%', height: 'auto', display: 'block' }}
        />

        {/* Transparent clickable overlay on the "Get Started" button in the image */}
        {imgH > 0 && (
          <button
            onClick={onGetStarted}
            style={{
              position: 'absolute',
              top: btnTop,
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: btnW,
              height: btnH,
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              borderRadius: 8,
            }}
            aria-label="Get Started"
          />
        )}
      </div>
    </div>
  );
};

export default LandingPage;
