'use client';
import { useEffect, useState } from 'react';
import { FaAngleUp } from 'react-icons/fa';

export default function ScrollToTopButton() {
  const [show, setShow] = useState(false);

  // Show button after scrolling 300px
  useEffect(() => {
    const handleScroll = () => {
      setShow(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    show && (
      <button
        onClick={scrollToTop}
        className="fixed fixed_right_section bottom-1 right-4 z-50 w-12 h-12 bg-color hover:bg-green-600 text-white rounded-full flex items-center justify-center shadow-lg transition"
        title="Scroll to top"
      >
        <FaAngleUp  />
      </button>
    )
  );
}