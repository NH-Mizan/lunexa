'use client';
import { useState } from 'react';
import {
  FaXmark,
  FaPhone,
  FaWhatsapp,
  FaFacebookMessenger,
} from 'react-icons/fa6';
import { MdOutlineMessage } from "react-icons/md";

const contact = {
  hotline: '8801846494272',
  whatsapp: '8801846494272',
  facebook_link: 'https://m.me/websolutionit',
};

export default function SocialIcons() {
  const [showIcons, setShowIcons] = useState(false);

  return (
    <div className="fixed fixed_right_section bottom-14 right-4 z-50">
      {/* Social Buttons */}
      <div
        className={`flex flex-col items-end gap-3 transition-all duration-500 ease-in-out ${
          showIcons ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5 pointer-events-none'
        }`}
      >
        <a
          href={`tel:${contact.hotline}`}
          className="w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center shadow-md hover:scale-110 transition"
          title="Call"
        >
          <FaPhone className="w-5 h-5" />
        </a>

        <a
          href={`https://api.whatsapp.com/send?phone=${contact.whatsapp}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-12 h-12 rounded-full bg-green-600 text-white flex items-center justify-center shadow-md hover:scale-110 transition"
          title="WhatsApp"
        >
          <FaWhatsapp className="w-5 h-5" />
        </a>

        <a
          href={contact.facebook_link}
          target="_blank"
          rel="noopener noreferrer"
          className="w-12 h-12 rounded-full bg-indigo-500 text-white flex items-center justify-center shadow-md hover:scale-110 transition"
          title="Messenger"
        >
          <FaFacebookMessenger className="w-5 h-5" />
        </a>
      </div>

      {/* Toggle Button - Always visible at bottom */}
      <button
        onClick={() => setShowIcons((prev) => !prev)}
        className={`mt-3 w-12 h-12 rounded-full flex items-center justify-center shadow-md transition-all duration-300 ${
          showIcons
            ? 'bg-red-500 text-white hover:rotate-90'
            : 'bg-blue-500 hover:scale-105'
        }`}
        title={showIcons ? 'Hide' : 'Contact Us'}
      >
        {showIcons ? (
          <FaXmark className="w-5 h-5" />
        ) : (
          <MdOutlineMessage className='w-6 h-6 text-wt'/>
        )}
      </button>
    </div>
  );
}