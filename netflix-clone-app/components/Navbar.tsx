import React, { useCallback, useEffect, useState } from 'react';
import { BsBell, BsSearch, BsChevronDown } from 'react-icons/bs';
import { debounce } from 'lodash';

import AccountMenu from '@/components/AccountMenu';
import MobileMenu from '@/components/MobileMenu';
import NavbarItem from '@/components/NavbarItem';
import { useRouter } from 'next/router';

const TOP_OFFSET = 66;

const Navbar: React.FC = () => {
  const router = useRouter();
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showBackground, setShowBackground] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const handleScroll = debounce(() => {
      setShowBackground(window.scrollY >= TOP_OFFSET);
    }, 50);

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleAccountMenu = useCallback(() => setShowAccountMenu((prev) => !prev), []);
  const toggleMobileMenu = useCallback(() => setShowMobileMenu((prev) => !prev), []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const menuItems = [
    { label: 'Home', onClick: () => router.push('/'), active: router.pathname === '/' },
    { label: 'My List', onClick: () => router.push('/my-list') },
    // Add more routes as pages are created
    { label: 'Series', onClick: () => router.push('/series') },
    // { label: 'Films', onClick: () => router.push('/films') },
  ];

  return (
    <nav className="w-full fixed z-40" role="navigation" aria-label="Main navigation">
      <div
        className={`
          px-4 md:px-16 py-6 flex flex-row items-center transition duration-500
          ${showBackground ? 'bg-zinc-900/90' : ''}
        `}
      >
        <img src="/images/logo.png" className="h-4 md:h-7" alt="Netflix logo" />
        <div className="flex-row ml-8 gap-6 hidden lg:flex">
          {menuItems.map((item) => (
            <NavbarItem
              key={item.label}
              label={item.label}
              active={item.active}
              onClick={item.onClick}
            />
          ))}
        </div>
        <div
          onClick={toggleMobileMenu}
          className="lg:hidden flex flex-row items-center gap-2 ml-8 cursor-pointer relative"
        >
          <button
            className="text-white text-sm flex items-center gap-1"
            aria-controls="mobile-menu"
            aria-expanded={showMobileMenu}
          >
            Browse
            <BsChevronDown
              className={`w-4 text-white transition ${showMobileMenu ? 'rotate-180' : ''}`}
            />
          </button>
          <MobileMenu visible={showMobileMenu} items={menuItems} />
        </div>
        <div className="flex flex-row ml-auto items-center gap-4">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="bg-zinc-700 text-white text-sm rounded-full px-4 py-1 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Search movies"
            />
            <BsSearch className="absolute right-3 top-2 w-4 h-4 text-gray-200" />
          </form>
          <button className="text-gray-200 hover:text-white transition" aria-label="Notifications">
            <BsBell className="w-5 h-5" />
          </button>
          <button
            onClick={toggleAccountMenu}
            className="flex flex-row items-center gap-2 cursor-pointer"
            aria-controls="account-menu"
            aria-expanded={showAccountMenu}
          >
            <div className="w-8 h-8 rounded-md overflow-hidden">
              <img src="/images/default-blue.png" alt="User profile" />
            </div>
            <BsChevronDown
              className={`w-4 text-white transition ${showAccountMenu ? 'rotate-180' : ''}`}
            />
            <AccountMenu visible={showAccountMenu} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;