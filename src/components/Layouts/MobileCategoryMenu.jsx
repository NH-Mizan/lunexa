'use client';

import { memo, useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { getChildCategories, getSubcategories } from '@/lib/taxonomy';

function getItemId(item, fallback) {
  return item?.id ?? item?._id ?? item?.slug ?? fallback;
}

function buildTaxonomyPath(type, item) {
  const itemId = getItemId(item);
  return itemId ? `/${type}/${itemId}` : null;
}

const ToggleIcon = memo(function ToggleIcon({ isOpen }) {
  return (
    <span
      aria-hidden="true"
      className="flex h-6 w-6 items-center justify-center rounded-full border border-white/20 text-sm font-semibold text-white transition-all duration-300"
    >
      {isOpen ? '-' : '+'}
    </span>
  );
});

const MenuLinkButton = memo(function MenuLinkButton({
  label,
  isActive,
  onClick,
  className = '',
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`${className} truncate text-left transition-all duration-300 ${
        isActive ? 'text-white' : 'text-white/85 hover:text-white'
      }`}
    >
      {label}
    </button>
  );
});

const ChildCategoryButton = memo(function ChildCategoryButton({
  child,
  isActive,
  onClick,
}) {
  return (
    <li>
      <button
        type="button"
        onClick={() => onClick(child)}
        className={`flex w-full items-center rounded-xl px-3 py-2 pl-8 text-left text-sm transition-all duration-300 ${
          isActive
            ? 'bg-white text-black shadow-sm'
            : 'text-white/80 hover:bg-white/10 hover:text-white'
        }`}
      >
        <span className="mr-2 text-white/40">-</span>
        <span className="truncate">{child?.name}</span>
      </button>
    </li>
  );
});

const SubCategoryItem = memo(function SubCategoryItem({
  subcategory,
  isOpen,
  pathname,
  onToggle,
  onNavigate,
}) {
  const childCategories = getChildCategories(subcategory);
  const hasChildren = childCategories.length > 0;
  const subcategoryPath = buildTaxonomyPath('subcategory', subcategory);
  const isActive = pathname === subcategoryPath;

  return (
    <li className="rounded-2xl bg-white/5">
      <div
        className={`flex items-center gap-3 rounded-2xl px-3 py-3 pl-6 transition-all duration-300 ${
          isOpen ? 'bg-white/10' : 'hover:bg-white/8'
        }`}
      >
        <MenuLinkButton
          label={subcategory?.name}
          isActive={isActive}
          onClick={() => onNavigate(subcategoryPath)}
          className="flex-1 text-sm font-medium"
        />

        {hasChildren ? (
          <button
            type="button"
            onClick={() => onToggle(getItemId(subcategory, subcategory?.name))}
            className="shrink-0"
            aria-expanded={isOpen}
            aria-label={`${isOpen ? 'Collapse' : 'Expand'} ${subcategory?.name}`}
          >
            <ToggleIcon isOpen={isOpen} />
          </button>
        ) : null}
      </div>

      {isOpen && hasChildren ? (
        <ul className="space-y-1 px-2 pb-2 transition-all duration-300">
          {childCategories.map((child, index) => {
            const childPath = buildTaxonomyPath('childcategory', child);

            return (
              <ChildCategoryButton
                key={getItemId(child, `${subcategory?.name}-${index}`)}
                child={child}
                isActive={pathname === childPath}
                onClick={() => onNavigate(childPath)}
              />
            );
          })}
        </ul>
      ) : null}
    </li>
  );
});

const CategoryItem = memo(function CategoryItem({
  category,
  isOpen,
  openSubCategoryId,
  pathname,
  onToggle,
  onSubToggle,
  onNavigate,
}) {
  const subcategories = getSubcategories(category);
  const hasSubcategories = subcategories.length > 0;
  const categoryPath = buildTaxonomyPath('category', category);
  const isActive = pathname === categoryPath;

  return (
    <li className="bg-white/5">
      <div
        className={`flex items-center gap-3 rounded-2xl px-4 py-3 transition-all duration-300 ${
          isOpen ? 'bg-white/10' : 'hover:bg-white/8'
        }`}
      >
        <MenuLinkButton
          label={category?.name}
          isActive={isActive}
          onClick={() => onNavigate(categoryPath)}
          className="flex-1 text-sm font-semibold"
        />

        {hasSubcategories ? (
          <button
            type="button"
            onClick={() => onToggle(getItemId(category, category?.name))}
            className="shrink-0"
            aria-expanded={isOpen}
            aria-label={`${isOpen ? 'Collapse' : 'Expand'} ${category?.name}`}
          >
            <ToggleIcon isOpen={isOpen} />
          </button>
        ) : null}
      </div>

      {isOpen && hasSubcategories ? (
        <ul className="space-y-2 px-2 pb-2 transition-all duration-300">
          {subcategories.map((subcategory, index) => (
            <SubCategoryItem
              key={getItemId(subcategory, `${category?.name}-${index}`)}
              subcategory={subcategory}
              isOpen={openSubCategoryId === getItemId(subcategory, `${category?.name}-${index}`)}
              pathname={pathname}
              onToggle={onSubToggle}
              onNavigate={onNavigate}
            />
          ))}
        </ul>
      ) : null}
    </li>
  );
});

export default function MobileCategoryMenu({ categories = [], onNavigate }) {
  const [openCategory, setOpenCategory] = useState(null);
  const [openSubCategory, setOpenSubCategory] = useState(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) {
      return;
    }

    const matchedCategory = categories.find((category) => {
      if (pathname === buildTaxonomyPath('category', category)) {
        return true;
      }

      return getSubcategories(category).some((subcategory) => {
        if (pathname === buildTaxonomyPath('subcategory', subcategory)) {
          return true;
        }

        return getChildCategories(subcategory).some(
          (child) => pathname === buildTaxonomyPath('childcategory', child)
        );
      });
    });

    if (!matchedCategory) {
      return;
    }

    setOpenCategory(getItemId(matchedCategory, matchedCategory?.name));

    const matchedSubcategory = getSubcategories(matchedCategory).find((subcategory) => {
      if (pathname === buildTaxonomyPath('subcategory', subcategory)) {
        return true;
      }

      return getChildCategories(subcategory).some(
        (child) => pathname === buildTaxonomyPath('childcategory', child)
      );
    });

    setOpenSubCategory(
      matchedSubcategory ? getItemId(matchedSubcategory, matchedSubcategory?.name) : null
    );
  }, [categories, pathname]);

  const handleCategoryToggle = (categoryId) => {
    setOpenCategory((current) => (current === categoryId ? null : categoryId));
    setOpenSubCategory(null);
  };

  const handleSubCategoryToggle = (subcategoryId) => {
    setOpenSubCategory((current) => (current === subcategoryId ? null : subcategoryId));
  };

  const handleNavigation = (targetPath) => {
    if (!targetPath) {
      return;
    }

    router.push(targetPath);
    onNavigate?.();
  };

  return (
    <div className="space-y-3">
      <ul className="space-y-3">
        {categories.map((category, index) => {
          const categoryId = getItemId(category, index);

          return (
            <CategoryItem
              key={categoryId}
              category={category}
              isOpen={openCategory === categoryId}
              openSubCategoryId={openSubCategory}
              pathname={pathname}
              onToggle={handleCategoryToggle}
              onSubToggle={handleSubCategoryToggle}
              onNavigate={handleNavigation}
            />
          );
        })}
      </ul>
    </div>
  );
}
