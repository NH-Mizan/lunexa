'use client';

import { getAssetUrl } from "@/lib/asset-url";
import { getLiveSearchProducts } from "@/lib/client-api";
import { getProductPath, getProductSlug } from "@/lib/product-routing";
import { getChildCategories, getSubcategories } from "@/lib/taxonomy";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { BiSupport } from "react-icons/bi";
import {
  FaAngleDown,
  FaBars,
  FaRegUserCircle,
  FaSearch,
  FaShoppingCart,
  FaTimes,
  FaUser,
} from "react-icons/fa";
import { GoHeart } from "react-icons/go";
import { IoGitCompare } from "react-icons/io5";
import useShopStore from "@/context/cardStore";
import OtpLoginModal from "../OtpLoginModal ";
import MobileCategoryMenu from "./MobileCategoryMenu";
import { useAuthSession } from "../Auth/AuthSessionProvider";

function normalizeLiveSearchResults(results = []) {
  return results
    .map((item) => ({
      id: item?.id ?? item?.product_id ?? item?._id,
      slug: getProductSlug(item),
      name: item?.name ?? item?.product_name ?? item?.title,
      image:
        item?.image ??
        item?.thumbnail ??
        item?.product_image ??
        item?.photo,
      price:
        item?.new_price ??
        item?.price ??
        item?.sale_price ??
        item?.regular_price,
    }))
    .filter((item) => item.slug && item.name);
}

function getItemId(item, fallback) {
  return item?.id ?? item?._id ?? item?.slug ?? fallback;
}

function buildTaxonomyPath(type, item) {
  const itemId = getItemId(item);
  return itemId ? `/${type}/${itemId}` : "#";
}

export default function MainHeader({ initialCategories = [], brands = [] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loginModal, setLoginModal] = useState(false);
  const [show, setShow] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [liveResults, setLiveResults] = useState([]);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [activeCategoryId, setActiveCategoryId] = useState(null);
  const [activeSubcategoryId, setActiveSubcategoryId] = useState(null);
  const cartCount = useShopStore((state) => state.cart.length);
  const wishlistCount = useShopStore((state) => state.wishlist.length);
  const user = useAuthSession();
  const router = useRouter();
  const searchBoxRef = useRef(null);

  useEffect(() => {
    if (!initialCategories.length) {
      setActiveCategoryId(null);
      setActiveSubcategoryId(null);
      return;
    }

    const firstCategory = initialCategories[0];
    const firstSubcategory = getSubcategories(firstCategory)[0] ?? null;

    setActiveCategoryId(getItemId(firstCategory, firstCategory?.name));
    setActiveSubcategoryId(
      firstSubcategory ? getItemId(firstSubcategory, firstSubcategory?.name) : null
    );
  }, [initialCategories]);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (!searchBoxRef.current?.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  useEffect(() => {
    const trimmedSearch = searchTerm.trim();

    if (trimmedSearch.length < 2) {
      setLiveResults([]);
      setIsSearchLoading(false);
      return undefined;
    }

    const timeoutId = setTimeout(async () => {
      try {
        setIsSearchLoading(true);
        const results = await getLiveSearchProducts(trimmedSearch);
        setLiveResults(normalizeLiveSearchResults(results));
        setShowResults(true);
      } catch (error) {
        console.error("Live search failed:", error);
        setLiveResults([]);
      } finally {
        setIsSearchLoading(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const safeCartCount = isHydrated ? cartCount : 0;
  const safeWishlistCount = isHydrated ? wishlistCount : 0;

  const toggleMenu = () => setIsOpen((value) => !value);
  const openLoginModal = () => {
    setIsOpen(false);
    setLoginModal(true);
  };

  const handleSearchInput = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    setShowResults(Boolean(value.trim()));
  };

  const handleSearchSubmit = () => {
    const firstResultPath = getProductPath(liveResults[0]);

    if (firstResultPath !== "#") {
      router.push(firstResultPath);
      setShowResults(false);
    }
  };

  const handleResultClick = (product) => {
    const productPath = getProductPath(product);

    if (productPath === "#") {
      return;
    }

    router.push(productPath);
    setSearchTerm("");
    setLiveResults([]);
    setShowResults(false);
  };

  const activeCategory =
    initialCategories.find(
      (category) => getItemId(category, category?.name) === activeCategoryId
    ) ?? initialCategories[0];
  const activeSubcategories = getSubcategories(activeCategory);
  const activeSubcategory =
    activeSubcategories.find(
      (subcategory) =>
        getItemId(subcategory, subcategory?.name) === activeSubcategoryId
    ) ?? activeSubcategories[0];
  const activeChildCategories = getChildCategories(activeSubcategory);

  return (
    <div className="sticky top-0 z-50 shadow-md mb-2">
      <div className="bg-black z-20 relative">
        <header className="text-white">
          <nav className="container grid grid-cols-1 md:grid-cols-3 items-center gap-3 py-3 md:py-4">
            <div className="flex items-center justify-between md:justify-start col-span-1">
              <button onClick={toggleMenu} className="md:hidden text-white text-2xl focus:outline-none" aria-label="Open menu">
                <FaBars />
              </button>

              <Link href="/">
                <Image src="/images/logo.png" alt="SellPixser" width={160} height={90} priority className="w-32 md:w-40 h-auto ml-4" />
              </Link>

              <div className="lg:hidden md:hidden flex gap-4 text-white">
                {user ? (
                  <Link href="/dashboard" className="flex items-center gap-1" aria-label="Dashboard">
                    <FaUser />
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={openLoginModal}
                    className="flex items-center gap-1"
                    aria-label="Login"
                  >
                    <FaUser />
                  </button>
                )}
                <Link href="/checkout" className="relative" aria-label="Cart">
                  <FaShoppingCart />
                  <span className="absolute -top-2 -right-2 bg-pry text-wt text-xs px-1 rounded-full">{safeCartCount}</span>
                </Link>
              </div>
            </div>

            <div
              ref={searchBoxRef}
              className="relative mb-2 flex h-12 w-full min-w-0 max-w-2xl items-center rounded-lg border border-white/10 bg-white shadow-sm transition focus-within:border-pry focus-within:ring-2 focus-within:ring-pink-200 lg:mb-0"
            >
              <FaSearch className="ml-4 shrink-0 text-base text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={handleSearchInput}
                onFocus={() => {
                  if (searchTerm.trim()) {
                    setShowResults(true);
                  }
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    handleSearchSubmit();
                  }
                }}
                className="min-w-0 flex-1 bg-transparent px-3 py-3 text-sm font-medium text-gray-800 outline-none placeholder:text-gray-400 sm:text-base"
              />
              <button
                type="button"
                onClick={handleSearchSubmit}
                className="mr-1 flex h-10 w-12 shrink-0 items-center justify-center rounded-md bg-pry text-white transition hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-200"
                aria-label="Search"
              >
                <FaSearch className="text-base" />
              </button>

              {showResults ? (
                <div className="absolute left-0 top-full z-40 mt-2 w-full overflow-hidden rounded-lg border border-gray-200 bg-white shadow-xl">
                  {isSearchLoading ? (
                    <div className="px-4 py-3 text-sm text-gray-500">Searching...</div>
                  ) : liveResults.length > 0 ? (
                    <ul className="max-h-96 overflow-y-auto py-2">
                      {liveResults.map((product) => (
                        <li key={product.id ?? product.slug}>
                          <button
                            type="button"
                            onClick={() => handleResultClick(product)}
                            className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-gray-50"
                          >
                            <Image
                              src={getAssetUrl(product.image)}
                              alt={product.name}
                              width={48}
                              height={48}
                              className="h-12 w-12 rounded-md object-cover"
                            />
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-medium text-gray-900">
                                {product.name}
                              </p>
                              <p className="text-sm font-semibold text-pry">
                                Tk {product.price ?? "0"}
                              </p>
                            </div>
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : searchTerm.trim().length >= 2 ? (
                    <div className="px-4 py-3 text-sm text-gray-500">
                      No products found.
                    </div>
                  ) : null}
                </div>
              ) : null}
            </div>

            <div className="hidden lg:flex items-center justify-end gap-4 text-sm col-span-1 text-white">
              {
                user ? (
                  <Link href="/dashboard" className="flex items-center gap-1">
                    <FaRegUserCircle className="text-[30px]" />
                       <p className="text-sm">{user.name}</p>
                  </Link>
                ) : (
                  <button type="button" onClick={openLoginModal} className="flex items-center gap-1">
                    <FaRegUserCircle className="text-[30px]" />
                     <p className="text-sm">Login / Register</p>
                  </button>
                )
              }
            
              <Link href="#" className="flex items-center gap-1" aria-label="Compare">
                <IoGitCompare className="text-[24px]" />
              </Link>

              <Link href="/wishlist" className="relative" aria-label="Wishlist">
                <GoHeart className="text-[24px]" />
                <span className="absolute -top-2 -right-2 bg-pry text-wt text-xs px-1 rounded-full">{safeWishlistCount}</span>
              </Link>
              <Link href="/checkout" className="relative" aria-label="Cart">
                <FaShoppingCart className="text-[24px]" />
                <span className="absolute -top-2 -right-2 bg-pry text-wt text-xs px-1 rounded-full">{safeCartCount}</span>
              </Link>
            </div>
          </nav>
        </header>
      </div>

      {loginModal && <OtpLoginModal onClose={() => setLoginModal(false)} />}

      <div className={`fixed top-0 left-0 h-full w-[260px] bg-black text-white z-50 transform transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <Link href="/">
            <Image src="/images/logo.png" alt="SellPixser" width={144} height={81} className="w-36 h-auto ml-4" />
          </Link>
          <button onClick={toggleMenu} className="text-xl" aria-label="Close menu">
            <FaTimes />
          </button>
        </div>
        <ul className="flex flex-col gap-4 px-6 py-4">
          <li><Link href="/" className="hover-text-pry">Home</Link></li>
        </ul>
        <div className="px-4 pb-6">
          <MobileCategoryMenu categories={initialCategories} onNavigate={toggleMenu} />
        </div>
        <ul className="flex flex-col gap-4 px-6 py-4">
          <li><Link href="#" className="hover-text-pry">Track Order</Link></li>
          {user ? (
            <li>
              <Link href="/dashboard" onClick={toggleMenu} className="hover-text-pry">
                Dashboard
              </Link>
            </li>
          ) : (
            <li>
              <button type="button" onClick={openLoginModal} className="hover-text-pry">
                Login / Signup
              </button>
            </li>
          )}
        </ul>
        
      </div>

      {isOpen && (
        <div onClick={toggleMenu} className="fixed inset-0 bg-black opacity-30 z-40" />
      )}

      <div className="bg-black shadow-sm">
        <div className="w-11/12 lg:w-10/12 mx-auto flex items-center justify-between pt-2 pb-3 lg:pt-0 lg:pb-3">
          <div
            className="relative hidden lg:block"
            onMouseEnter={() => setShow(true)}
            onMouseLeave={() => setShow(false)}
          >
            <button
              type="button"
              className="flex items-center border border-white bg-black text-white px-4 py-2 cursor-pointer"
            >
              <span className="mr-2 text-xl"><FaBars /></span>
              <span>Categories</span>
              <span className={`ml-2 text-sm transition-transform ${show ? "rotate-180" : ""}`}>
                <FaAngleDown />
              </span>
            </button>

            {show ? (
              <div className="absolute left-0 top-full z-30 w-[820px] overflow-hidden rounded-b-xl border border-black/5 bg-white shadow-2xl">
                <div className="grid grid-cols-[260px_260px_1fr]">
                  <div className="max-h-[460px] overflow-y-auto border-r border-gray-100 bg-gray-50/80 py-3">
                    {initialCategories.map((category, index) => {
                      const categoryId = getItemId(category, index);
                      const isActive = categoryId === getItemId(activeCategory, activeCategory?.name);

                      return (
                        <Link
                          key={categoryId}
                          href={buildTaxonomyPath("category", category)}
                          onMouseEnter={() => {
                            const firstSubcategory = getSubcategories(category)[0] ?? null;
                            setActiveCategoryId(categoryId);
                            setActiveSubcategoryId(
                              firstSubcategory
                                ? getItemId(firstSubcategory, firstSubcategory?.name)
                                : null
                            );
                          }}
                          className={`flex items-center gap-3 px-4 py-3 transition ${
                            isActive ? "bg-white text-pry" : "text-gray-700 hover:bg-white hover:text-pry"
                          }`}
                        >
                          <Image
                            src={getAssetUrl(category.image)}
                            alt={category.name}
                            width={40}
                            height={40}
                            className="h-10 w-10 rounded-full object-cover"
                          />
                          <span className="line-clamp-1 text-sm font-semibold">{category.name}</span>
                        </Link>
                      );
                    })}
                  </div>

                  <div className="max-h-[460px] overflow-y-auto border-r border-gray-100 py-3">
                    {activeSubcategories.length > 0 ? (
                      activeSubcategories.map((subcategory, index) => {
                        const subcategoryId = getItemId(subcategory, `${activeCategory?.name}-${index}`);
                        const isActive =
                          subcategoryId === getItemId(activeSubcategory, activeSubcategory?.name);

                        return (
                          <Link
                            key={subcategoryId}
                            href={buildTaxonomyPath("subcategory", subcategory)}
                            onMouseEnter={() => setActiveSubcategoryId(subcategoryId)}
                            className={`flex items-center justify-between gap-3 px-4 py-3 text-sm transition ${
                              isActive ? "bg-gray-50 font-semibold text-pry" : "text-gray-700 hover:bg-gray-50 hover:text-pry"
                            }`}
                          >
                            <span className="line-clamp-1">{subcategory.name}</span>
                            {getChildCategories(subcategory).length > 0 ? (
                              <span className="text-xs text-gray-400">&gt;</span>
                            ) : null}
                          </Link>
                        );
                      })
                    ) : (
                      <div className="px-4 py-6 text-sm text-gray-500">
                        No subcategories available.
                      </div>
                    )}
                  </div>

                  <div className="max-h-[460px] overflow-y-auto p-4">
                    {activeSubcategory ? (
                      <div className="mb-4 border-b border-gray-100 pb-3">
                        <Link
                          href={buildTaxonomyPath("subcategory", activeSubcategory)}
                          className="text-base font-semibold text-gray-900 hover:text-pry"
                        >
                          {activeSubcategory.name}
                        </Link>
                      </div>
                    ) : null}

                    {activeChildCategories.length > 0 ? (
                      <div className="grid grid-cols-2 gap-3">
                        {activeChildCategories.map((child, index) => (
                          <Link
                            key={getItemId(child, `${activeSubcategory?.name}-${index}`)}
                            href={buildTaxonomyPath("childcategory", child)}
                            className="rounded-lg border border-gray-100 px-4 py-3 text-sm font-medium text-gray-700 transition hover:border-pry hover:text-pry"
                          >
                            {child.name}
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500">
                        No child categories available.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          <ul className="flex items-center uppercase gap-2 lg:gap-6 text-[9px] lg:text-[15px] font-medium text-wt">
            <li className="hover-text-pry cursor-pointer"><Link href="/">Home</Link></li>
            <li className="hover-text-pry cursor-pointer"><Link href="/products">Products</Link></li>
            <li className="group relative cursor-pointer">
              <div className="hover-text-pry flex items-center gap-1">
                <span>Brands</span>
                <FaAngleDown />
              </div>
              {brands.length > 0 ? (
                <div className="invisible absolute left-0 top-full z-30 min-w-[220px] translate-y-2 rounded-xl bg-white p-2 text-left normal-case opacity-0 shadow-xl transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                  {brands.map((brand) => (
                    <Link
                      key={brand.id ?? brand.slug}
                      href={`/brands/${brand.slug}`}
                      className="block rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 hover:text-pry"
                    >
                      {brand.name}
                    </Link>
                  ))}
                </div>
              ) : null}
            </li>
            <li className="hover-text-pry cursor-pointer">Offers</li>
            <li className="hover-text-pry cursor-pointer">Best Seller</li>
          </ul>

          <div className="hidden lg:flex items-center gap-2 text-sm">
            <BiSupport className="text-[25px] text-white" />
            <Link href="tel:+8801846494272" className="text-wt">
              <div className="text-white text-[15px] mb-[-3px]">Hotline:</div>
              <span className="text-sm"> +8801846494272</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
