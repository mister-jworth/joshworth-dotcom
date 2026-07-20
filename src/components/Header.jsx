'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const NAV = [
  ['Home', '/'],
  ['Posts', '/posts'],
  ['Projects', '/projects'],
  ['About', '/about'],
  ['Contact', '/contact'],
];

function isActive(pathname, href) {
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(href + '/');
}

const SearchIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" {...props}>
    <circle cx="10.5" cy="10.5" r="6.5" />
    <line x1="15.5" y1="15.5" x2="21" y2="21" />
  </svg>
);

const BurgerIcon = (props) => (
  <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" {...props}>
    <line x1="2" y1="6" x2="22" y2="6" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <line x1="2" y1="18" x2="22" y2="18" />
  </svg>
);

const CloseIcon = (props) => (
  <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" {...props}>
    <line x1="4" y1="4" x2="20" y2="20" />
    <line x1="20" y1="4" x2="4" y2="20" />
  </svg>
);

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const pathname = usePathname();
  const router = useRouter();

  // close overlays on navigation
  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  // esc to close + scroll lock
  useEffect(() => {
    const open = menuOpen || searchOpen;
    function onKey(e) {
      if (e.key === 'Escape') {
        setMenuOpen(false);
        setSearchOpen(false);
      }
    }
    if (open) {
      window.addEventListener('keydown', onKey);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [menuOpen, searchOpen]);

  function submitSearch(e) {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    setSearchOpen(false);
    router.push(`/search?q=${encodeURIComponent(q)}`);
  }

  const bar = (
    <div className="inner">
      <Link href="/" className="site-logo" aria-label="Josh Worth Art & Design — home">
        <img
          src="/uploads/2019/09/logomark19-web@0.5x.png"
          srcSet="/uploads/2019/09/logomark19-web@0.5x.png 1x, /uploads/2019/09/logomark19-web.png 2x"
          alt="Josh Worth Art & Design logo"
        />
      </Link>
      <div className="header-icons">
        {searchOpen ? (
          <button className="icon-btn" aria-label="Close search" onClick={() => setSearchOpen(false)}>
            <CloseIcon />
          </button>
        ) : (
          <button
            className="icon-btn"
            aria-label="Search"
            onClick={() => {
              setSearchOpen(true);
              setMenuOpen(false);
            }}
          >
            <SearchIcon />
          </button>
        )}
        {menuOpen ? (
          <button className="icon-btn" aria-label="Close menu" onClick={() => setMenuOpen(false)}>
            <CloseIcon />
          </button>
        ) : (
          <button
            className="icon-btn"
            aria-label="Menu"
            onClick={() => {
              setMenuOpen(true);
              setSearchOpen(false);
            }}
          >
            <BurgerIcon />
          </button>
        )}
      </div>
    </div>
  );

  return (
    <>
      <header className="site-header">{bar}</header>

      {menuOpen && (
        <div className="nav-overlay" onClick={(e) => e.target === e.currentTarget && setMenuOpen(false)}>
          <nav className="overlay-nav" aria-label="Site">
            {NAV.map(([label, href]) => (
              <Link
                key={href}
                href={href}
                aria-current={isActive(pathname, href) ? 'page' : undefined}
                onClick={() => setMenuOpen(false)}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
      )}

      {searchOpen && (
        <div
          className="search-overlay"
          onClick={(e) => e.target === e.currentTarget && setSearchOpen(false)}
        >
          <form className="overlay-search" onSubmit={submitSearch}>
            <input
              autoFocus
              type="search"
              placeholder="Search..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search the site"
            />
          </form>
        </div>
      )}
    </>
  );
}
