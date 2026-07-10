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

function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function normalizeVariantOptions(source, key) {
  const list = Array.isArray(source) ? source : source ? [source] : [];

  return [
    ...new Set(
      list
        .map((item) => {
          if (typeof item === 'string' || typeof item === 'number') {
            return String(item);
          }

          return item?.[key] ?? item?.name ?? item?.value ?? item?.title;
        })
        .filter(Boolean)
        .map((item) => String(item).trim())
        .filter(Boolean)
    ),
  ];
}

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
    let selectedSize = null;
    let selectedColor = null;
    const sizes = normalizeVariantOptions(product.sizes ?? product.size, 'size');
    const colors = normalizeVariantOptions(product.colors ?? product.color, 'color');
    const hasSizes = sizes.length > 0;
    const hasColors = colors.length > 0;
    selectedSize = hasSizes ? sizes[0] : null;
    selectedColor = hasColors ? colors[0] : null;
    const variantHtml = [
      hasSizes
        ? `<div class="order-now-variant-group">
            <span class="order-now-variant-label">Size</span>
            <div class="order-now-variant-options" data-variant="size">
              ${sizes
                .map(
                  (size, index) =>
                    `<button type="button" class="order-now-chip ${index === 0 ? 'is-active' : ''}" data-value="${escapeHtml(size)}">${escapeHtml(size)}</button>`
                )
                .join('')}
            </div>
          </div>`
        : '',
      hasColors
        ? `<div class="order-now-variant-group">
            <span class="order-now-variant-label">Color</span>
            <div class="order-now-variant-options" data-variant="color">
              ${colors
                .map(
                  (color, index) =>
                    `<button type="button" class="order-now-chip ${index === 0 ? 'is-active' : ''}" data-value="${escapeHtml(color)}">${escapeHtml(color)}</button>`
                )
                .join('')}
            </div>
          </div>`
        : '',
    ].join('');

    Swal.fire({
      title: '',
      html: `
        <div class="order-now-modal">
          <div class="order-now-media">
            <img src="${imageUrl}" alt="${escapeHtml(product.name)}" />
          </div>
          <div class="order-now-content">
            <h2>${escapeHtml(product.name)}</h2>
            <p class="order-now-price">
              <span>Tk ${escapeHtml(product.new_price)}</span>
              ${product.old_price ? `<del>Tk ${escapeHtml(product.old_price)}</del>` : ''}
            </p>
            ${variantHtml}
            <div class="order-now-qty" aria-label="Quantity selector">
              <button id="decreaseQty" type="button" aria-label="Decrease quantity">-</button>
              <span id="qtyValue">${quantity}</span>
              <button id="increaseQty" type="button" aria-label="Increase quantity">+</button>
            </div>
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Purchase',
      cancelButtonText: 'Cancel',
      focusConfirm: false,
      customClass: {
        popup: 'order-now-popup',
        actions: 'order-now-actions',
        confirmButton: 'order-now-action-btn',
        cancelButton: 'order-now-action-btn',
      },
      buttonsStyling: false,
      didOpen: () => {
        const container = Swal.getHtmlContainer();
        const qtyValue = container.querySelector('#qtyValue');
        const decreaseButton = container.querySelector('#decreaseQty');
        const increaseButton = container.querySelector('#increaseQty');

        const updateQuantity = (nextQuantity) => {
          quantity = Math.max(1, nextQuantity);
          qtyValue.innerText = quantity;
          decreaseButton.disabled = quantity === 1;
        };

        updateQuantity(quantity);

        container.querySelectorAll('[data-variant="size"] .order-now-chip').forEach((button) => {
          button.onclick = () => {
            selectedSize = button.dataset.value;
            button.parentElement.querySelectorAll('.order-now-chip').forEach((chip) => chip.classList.remove('is-active'));
            button.classList.add('is-active');
          };
        });

        container.querySelectorAll('[data-variant="color"] .order-now-chip').forEach((button) => {
          button.onclick = () => {
            selectedColor = button.dataset.value;
            button.parentElement.querySelectorAll('.order-now-chip').forEach((chip) => chip.classList.remove('is-active'));
            button.classList.add('is-active');
          };
        });

        container.querySelector('#increaseQty').onclick = () => {
          updateQuantity(quantity + 1);
        };
        container.querySelector('#decreaseQty').onclick = () => {
          updateQuantity(quantity - 1);
        };
      },
      preConfirm: () => ({ quantity, selectedSize, selectedColor }),
    }).then((result) => {
      if (!result.isConfirmed) return;

      const cartItem = {
        ...product,
        size: result.value.selectedSize,
        color: result.value.selectedColor,
      };

      for (let i = 0; i < result.value.quantity; i += 1) {
        addToCart(cartItem);
      }

      toast.success(`${result.value.quantity} x ${product.name} added!`, {
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
