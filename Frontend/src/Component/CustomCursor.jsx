import React, { useEffect, useRef } from 'react';
import './CustomCursor.css';

const CustomCursor = () => {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;

    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;
    let animId;

    const onMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      // Dot follows instantly
      dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
    };

    // Smooth ring follow with lerp
    const animate = () => {
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;
      ring.style.transform = `translate(${ringX}px, ${ringY}px)`;
      animId = requestAnimationFrame(animate);
    };

    // Grow ring on hover over clickable elements
    const onMouseOver = (e) => {
      const tag = e.target.tagName.toLowerCase();
      const isClickable =
        tag === 'a' || tag === 'button' || tag === 'input' ||
        tag === 'select' || tag === 'textarea' ||
        e.target.closest('a') || e.target.closest('button') ||
        e.target.style.cursor === 'pointer' ||
        window.getComputedStyle(e.target).cursor === 'pointer';

      if (isClickable) {
        ring.classList.add('cursor-hover');
        dot.classList.add('cursor-hover');
      }
    };

    const onMouseOut = () => {
      ring.classList.remove('cursor-hover');
      dot.classList.remove('cursor-hover');
    };

    const onMouseDown = () => {
      ring.classList.add('cursor-click');
      dot.classList.add('cursor-click');
    };

    const onMouseUp = () => {
      ring.classList.remove('cursor-click');
      dot.classList.remove('cursor-click');
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseover', onMouseOver);
    window.addEventListener('mouseout', onMouseOut);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    animId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseover', onMouseOver);
      window.removeEventListener('mouseout', onMouseOut);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <>
      {/* Small dot — instant follow */}
      <div ref={dotRef} className="custom-cursor-dot" />
      {/* Ring — smooth lagging follow */}
      <div ref={ringRef} className="custom-cursor-ring" />
    </>
  );
};

export default CustomCursor;
