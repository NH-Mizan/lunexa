import Image from "next/image";
import { FaFacebookF, FaInstagram, FaYoutube, FaWhatsapp, FaFacebookMessenger } from "react-icons/fa";

export default function Footer() {
  return (
    <div className="bg-black text-white">
      <footer className="container py-10 flex flex-col sm:flex-row sm:justify-between gap-10 sm:gap-0">
        <div className="flex flex-col gap-2">
          <Image src="/images/logo.png" alt="SellPixser" width={144} height={81} className="w-36 h-auto" />
          <p className="text-white">
            Dinajpur City Collage Road, Sadar <br />
            Dinajpur <br />
            01752108781 <br />
            info@sellpixer.com
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <h6 className="text-lg font-semibold">USEFUL LINK</h6>
          <a href="#" className="link link-hover">Refund & Return Policy</a>
          <a href="#" className="link link-hover">Terms & Conditions</a>
          <a href="#" className="link link-hover">Privacy Policy</a>
          <a href="#" className="link link-hover">How To order</a>
          <a href="#" className="link link-hover">About Us</a>
        </div>

        <div className="flex flex-col gap-2">
          <h6 className="text-lg font-semibold">CUSTOMER LINK</h6>
          <a href="#" className="link link-hover">Register</a>
          <a href="#" className="link link-hover">Login</a>
          <a href="#" className="link link-hover">Forgot Password?</a>
          <a href="#" className="link link-hover">Contact</a>
        </div>

        <div className="flex flex-col gap-4">
          <h6 className="text-lg font-semibold">FOLLOW US</h6>
          <div className="flex gap-2">
            <a href="#" className="bg-blue-600 p-2 rounded text-white" aria-label="Facebook"><FaFacebookF /></a>
            <a href="#" className="bg-pink-600 p-2 rounded text-white" aria-label="Instagram"><FaInstagram /></a>
            <a href="#" className="bg-red-600 p-2 rounded text-white" aria-label="YouTube"><FaYoutube /></a>
            <a href="#" className="bg-green-600 p-2 rounded text-white" aria-label="WhatsApp"><FaWhatsapp /></a>
            <a href="#" className="bg-blue-500 p-2 rounded text-white" aria-label="Messenger"><FaFacebookMessenger /></a>
          </div>

          <h6 className="text-lg font-semibold">DELIVERY PARTNER</h6>
          <div className="flex gap-2">
            <Image src="/images/delivery-partner.png" alt="SteadFast" width={120} height={48} className="h-12 w-auto bg-white p-1 rounded-lg object-contain" />
          </div>
        </div>
      </footer>

      <div className="bg-black py-2 mt-2 border-t border-gray-800">
        <p className="text-center text-sm text-gray-400">
          Copyright 2026 Sell Pixer. All rights reserved. Developed By
          <a href="https://websolutionit.com/" target="_blank" rel="noreferrer" className="text-red-500 ml-1">Websolution IT</a>
        </p>
      </div>
    </div>
  );
}
