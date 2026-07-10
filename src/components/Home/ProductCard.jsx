'use client';

import useShopStore from '@/context/cardStore';
import { getAssetUrl } from '@/lib/asset-url';
import { getProductPath, getProductSlug } from '@/lib/product-routing';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { FaHeart, FaShoppingCart } from 'react-icons/fa';
import { GoHeart } from 'react-icons/go';
import { toast, Bounce } from 'react-toastify';
import Swal from 'sweetalert2';

function ProductCard({ product }) {
  const router = useRouter();
  const [isHydrated, setIsHydrated] = useState(false);
  const wishlist = useShopStore((state) => state.wishlist);
  const addToCart = useShopStore((state) => state.addToCart);
  const addToWishlist = useShopStore((state) => state.addToWishlist);
  const removeFromWishlist = useShopStore((state) => state.removeFromWishlist);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const imageUrl = getAssetUrl(product.image?.image);
  const productSlug = getProductSlug(product);
  const productPath = getProductPath(product);
  const isWishlisted =
    isHydrated && wishlist.some((item) => item.id === product.id);
  const discount = useMemo(() => {
    if (!product.old_price) return 0;
    return Math.round(((product.old_price - product.new_price) / product.old_price) * 100);
  }, [product.new_price, product.old_price]);

  const handleWishlist = useCallback(() => {
    if (isWishlisted) {
      removeFromWishlist(product.id);
      toast.error('Removed from Wishlist!', {
        position: 'bottom-right',
        autoClose: 3000,
        theme: 'colored',
        transition: Bounce,
      });
      return;
    }

    addToWishlist(product);
    toast.success(`Product added to Wishlist!`, {
      position: 'bottom-right',
      autoClose: 3000,
      theme: 'colored',
      transition: Bounce,
    });
  }, [addToWishlist, isWishlisted, product, removeFromWishlist]);

  const handleAddToCart = useCallback(() => {
    addToCart(product);
    toast.success(`Product added to cart!`, {
      position: 'bottom-right',
      autoClose: 3000,
   
      transition: Bounce,
    });
  }, [addToCart, product]);

  const handleOrderNow = useCallback(() => {
    let quantity = 1;

    Swal.fire({
      title: '',
      html: `
        <div style="display:flex; align-items:center; gap:15px;">
          <img src="${imageUrl}" alt="${product.name}" style="width:100%; max-height:220px; object-fit:contain; border-radius:12px; margin-bottom:15px;" />
          <div>
            <h2 style="font-size:18px; font-weight:600; margin-bottom:5px; color:#1f2937;">${product.name}</h2>
            <p style="font-size:16px; font-weight:700; color:#dc2626; margin-bottom:10px;">
              Tk ${product.new_price}
              ${product.old_price ? `<span style="color:#9ca3af; text-decoration:line-through; font-size:14px; margin-left:6px;">Tk ${product.old_price}</span>` : ''}
            </p>
            <div style="margin-top:10px; display:flex; justify-content:center; align-items:center; gap:15px;">
              <button id="decreaseQty" style="padding:6px 12px; background:#ef4444; color:white; border:none; border-radius:6px; cursor:pointer; font-size:18px;">-</button>
              <span id="qtyValue" style="font-size:16px; font-weight:600;">${quantity}</span>
              <button id="increaseQty" style="padding:6px 12px; background:#10b981; color:white; border:none; border-radius:6px; cursor:pointer; font-size:18px;">+</button>
            </div>
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Purchase',
      cancelButtonText: 'Cancel',
      focusConfirm: false,
      customClass: {
        popup: 'rounded-2xl shadow-lg',
        confirmButton: 'bg-pry hover-bg-sec text-white font-semibold px-6 py-2 rounded-lg',
        cancelButton: 'bg-gray-300 hover:bg-gray-400 text-black font-medium px-6 py-2 rounded-lg ml-2',
      },
      didOpen: () => {
        const container = Swal.getHtmlContainer();
        const qtyValue = container.querySelector('#qtyValue');
        container.querySelector('#increaseQty').onclick = () => {
          quantity += 1;
          qtyValue.innerText = quantity;
        };
        container.querySelector('#decreaseQty').onclick = () => {
          if (quantity > 1) {
            quantity -= 1;
            qtyValue.innerText = quantity;
          }
        };
      },
      preConfirm: () => quantity,
    }).then((result) => {
      if (!result.isConfirmed) return;

      for (let i = 0; i < result.value; i += 1) {
        addToCart(product);
      }

      toast.success(`${result.value} x ${product.name} added!`, {
        position: 'bottom-right',
        autoClose: 3000,
        theme: 'light',
      });
      router.push('/checkout');
    });
  }, [addToCart, imageUrl, product, router]);

  return (
    <div className="relative border border-gray-300 bg-transparent rounded-md shadow overflow-hidden transform group-hover:scale-105 transition">
      {discount > 0 && (
        <span className="absolute top-2 left-2 bg-pry text-white text-xs px-2 py-1 rounded z-10">
          SAVE {discount}%
        </span>
      )}

      <button
        onClick={handleWishlist}
        type="button"
        aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        className="wishlist_btn border-black bg-black text-white hover:!bg-black hover:text-white"
      >
        {isWishlisted ? <FaHeart /> : <GoHeart />}
      </button>

      <Link
        href={productPath}
        aria-disabled={!productSlug}
        onClick={(event) => {
          if (!productSlug) {
            event.preventDefault();
          }
        }}
        className="product_card block"
      >
        <div className="product_image">
          <Image
            src={imageUrl}
            alt={product.name}
            width={300}
            height={300}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            className="w-full h-full object-cover pro_img group-hover:scale-110 transition-transform"
          />
        </div>

        <div className="product_info">
          <h3 className="product_name hover-text-sec">
            {product.name.length > 30 ? `${product.name.slice(0, 60)}...` : product.name}
          </h3>

          <div className="product_price text-pry font-bold text-base">
            Tk {product.new_price}
            {product.old_price && (
              <span className="ml-2 text-gray-400 line-through">
                Tk {product.old_price}
              </span>
            )}
          </div>
        </div>
      </Link>

      <div className="product_btn">
        <button
          onClick={handleAddToCart}
          aria-label="Add to cart"
          className="product-action-btn border border-black bg-transparent p-2 rounded-md text-black transition hover:bg-black hover:text-white"
        >
          <FaShoppingCart className="text-lg" />
        </button>

        <button
          onClick={handleOrderNow}
          className="product-action-btn flex-1 border border-black bg-transparent text-black text-[11px] lg:text-sm font-semibold py-2 rounded-md transition hover:bg-black hover:text-white"
        >
          Order Now
        </button>
      </div>
    </div>
  );
}

export default memo(ProductCard);
