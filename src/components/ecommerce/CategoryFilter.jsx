import React from 'react';
import { FiChevronRight } from 'react-icons/fi';

const CategoryFilter = ({ categories, selectedCategory, selectedSubcategory, onSelectCategory, onSelectSubcategory }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h3 className="font-bold text-lg mb-4">Categories</h3>

      <div className="space-y-2">
        <button
          onClick={() => {
            onSelectCategory(null);
            onSelectSubcategory(null);
          }}
          className={`w-full text-left px-4 py-2 rounded-md transition-colors ${
            !selectedCategory
              ? 'bg-blue-100 text-blue-700 font-medium'
              : 'hover:bg-gray-100'
          }`}
        >
          All Products
        </button>

        {categories.map((category) => (
          <div key={category._id}>
            <button
              onClick={() => {
                onSelectCategory(category._id);
                onSelectSubcategory(null);
              }}
              className={`w-full flex items-center justify-between px-4 py-2 rounded-md transition-colors ${
                selectedCategory === category._id && !selectedSubcategory
                  ? 'bg-blue-100 text-blue-700 font-medium'
                  : 'hover:bg-gray-100'
              }`}
            >
              <span>{category.name}</span>
              {category.subcategories && category.subcategories.length > 0 && (
                <FiChevronRight className={`transition-transform ${
                  selectedCategory === category._id ? 'rotate-90' : ''
                }`} />
              )}
            </button>

            {selectedCategory === category._id && category.subcategories && category.subcategories.length > 0 && (
              <div className="ml-4 mt-1 space-y-1">
                {category.subcategories.map((subcategory) => (
                  <button
                    key={subcategory._id}
                    onClick={() => onSelectSubcategory(subcategory._id)}
                    className={`w-full text-left px-4 py-2 rounded-md text-sm transition-colors ${
                      selectedSubcategory === subcategory._id
                        ? 'bg-blue-50 text-blue-600 font-medium'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    {subcategory.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;
