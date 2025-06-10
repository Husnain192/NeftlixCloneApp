import React from 'react';

interface MenuItem {
  label: string;
  onClick?: () => void;
}

interface MobileMenuProps {
  visible?: boolean;
  items?: MenuItem[];
}

const defaultItems: MenuItem[] = [
  { label: 'Home' },
  { label: 'Series' },
  { label: 'Films' },
  { label: 'New & Popular' },
  { label: 'My List' },
  { label: 'Browse by Languages' },
];

const MobileMenu: React.FC<MobileMenuProps> = ({ visible, items = defaultItems }) => {
  if (!visible) return null;

  return (
    <div
      className="bg-black w-56 absolute top-8 left-0 py-5 flex flex-col border-2 border-gray-800 rounded-md shadow-lg transition-opacity duration-300"
      role="menu"
      aria-label="Mobile navigation menu"
    >
      <div className="flex flex-col gap-4">
        {items.map((item) => (
          <button
            key={item.label}
            onClick={item.onClick}
            className="px-3 text-center text-white text-sm hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500"
            role="menuitem"
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MobileMenu;