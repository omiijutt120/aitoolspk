'use client';
import Image from 'next/image';
import Link from 'next/link';
import { Search, Menu, X, ArrowUpRight, MessageCircle } from 'lucide-react';
import { useRef, useState, useEffect } from 'react';
export function Header() {
  const [open, setOpen] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const search = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const shortcut = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        search.current?.focus();
      }
    };
    document.addEventListener('keydown', shortcut);
    return () => document.removeEventListener('keydown', shortcut);
  }, []);
  useEffect(() => {
    if (open) {
      dialog.current?.showModal();
      document.body.style.overflow = 'hidden';
    } else {
      dialog.current?.close();
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);
  const close = () => {
    setOpen(false);
    trigger.current?.focus();
  };
  return (
    <header className="header">
      <div className="container header-inner">
        <Link href="/" className="brand" aria-label="AiToolsPk home">
          <Image
            src="/brand/symbol-small.webp"
            alt=""
            width={38}
            height={38}
            priority
          />
          <span>
            AiTools<span className="brand-light">Pk</span>
          </span>
        </Link>
        <form className="header-search" action="/tools/" role="search">
          <Search size={18} aria-hidden="true" />
          <label htmlFor="site-search" className="sr-only">
            Search the complete catalog
          </label>
          <input
            ref={search}
            id="site-search"
            name="q"
            placeholder="Find your next tool…"
            autoComplete="off"
          />
          <button type="submit" aria-label="Search catalog">
            <ArrowUpRight size={17} />
          </button>
          <kbd>Ctrl K</kbd>
        </form>
        <nav aria-label="Main navigation" className="desktop-nav">
          <Link href="/how-to-order/">How to order</Link>
          <Link href="/contact/">Contact</Link>
        </nav>
        <div className="header-actions">
          <a
            href="https://wa.me/923714549245"
            target="_blank"
            rel="noopener noreferrer"
            className="button small desktop-contact"
          >
            <MessageCircle size={16} /> WhatsApp
          </a>
          <button
            ref={trigger}
            className="icon-button menu-toggle"
            aria-label="Open navigation"
            aria-expanded={open}
            onClick={() => setOpen(true)}
          >
            <Menu size={22} />
          </button>
        </div>
      </div>
      <dialog
        ref={dialog}
        className="nav-dialog"
        onCancel={close}
        onClick={(e) => {
          if (e.target === e.currentTarget) close();
        }}
      >
        <div className="nav-panel">
          <div className="flex items-center justify-between">
            <span className="eyebrow">AiToolsPk</span>
            <button
              onClick={close}
              className="icon-button"
              aria-label="Close navigation"
            >
              <X />
            </button>
          </div>
          <nav aria-label="Mobile navigation">
            {[
              ['All tools', '/#all-tools'],
              ['Categories', '/categories/'],
              ['How to order', '/how-to-order/'],
              ['Contact', '/contact/'],
            ].map(([label, href]) => (
              <Link onClick={close} key={href} href={href}>
                {label}
                <ArrowUpRight size={18} />
              </Link>
            ))}
          </nav>
          <p className="muted">
            Find your tools. Confirm the details. Order on WhatsApp.
          </p>
        </div>
      </dialog>
    </header>
  );
}
