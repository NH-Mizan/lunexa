export function getSubcategories(category) {
  return (
    category?.subcategories ||
    category?.subCategories ||
    category?.sub_categories ||
    []
  );
}

export function getChildCategories(subcategory) {
  return (
    subcategory?.childcategories ||
    subcategory?.childCategories ||
    subcategory?.child_categories ||
    subcategory?.children ||
    []
  );
}

export function findCategoryById(categories = [], id) {
  return categories.find((item) => Number(item.id) === Number(id)) ?? null;
}

export function findSubcategoryById(categories = [], id) {
  for (const category of categories) {
    const match = getSubcategories(category).find(
      (item) => Number(item.id) === Number(id)
    );

    if (match) {
      return match;
    }
  }

  return null;
}

export function findChildCategoryById(categories = [], id) {
  for (const category of categories) {
    for (const subcategory of getSubcategories(category)) {
      const match = getChildCategories(subcategory).find(
        (item) => Number(item.id) === Number(id)
      );

      if (match) {
        return match;
      }
    }
  }

  return null;
}

export function findParentCategoryBySubcategoryId(categories = [], id) {
  for (const category of categories) {
    const match = getSubcategories(category).find(
      (item) => Number(item.id) === Number(id)
    );

    if (match) {
      return category;
    }
  }

  return null;
}

export function findParentSubcategoryByChildId(categories = [], id) {
  for (const category of categories) {
    for (const subcategory of getSubcategories(category)) {
      const match = getChildCategories(subcategory).find(
        (item) => Number(item.id) === Number(id)
      );

      if (match) {
        return subcategory;
      }
    }
  }

  return null;
}

export function findParentCategoryByChildId(categories = [], id) {
  for (const category of categories) {
    for (const subcategory of getSubcategories(category)) {
      const match = getChildCategories(subcategory).find(
        (item) => Number(item.id) === Number(id)
      );

      if (match) {
        return category;
      }
    }
  }

  return null;
}
