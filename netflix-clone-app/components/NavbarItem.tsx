import React, { memo } from 'react';

interface NavbarItemProps {
  label: string;
  active?: boolean;
  onClick?: () => void;
}

const NavigationItem: React.FC<NavbarItemProps> = ({ label, active, onClick }) => {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyPress={(e) => e.key === 'Enter' && onClick?.()}
      className={`
        text-lg font-medium transition-colors duration-200
        ${active ? 'text-white cursor-default' : 'text-gray-200 hover:text-white cursor-pointer'}
      `}
    >
      {label}
    </div>
  );
};

export default memo(NavigationItem);