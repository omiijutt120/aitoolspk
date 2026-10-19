'use client';
import Image from 'next/image';
import Link from 'next/link';
import { Search, Menu, X, ArrowUpRight } from 'lucide-react';
import { useRef, useState, useEffect } from 'react';
export function Header() {
  const [open, setOpen] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
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
        <Link href="/" className="brand" aria-label="AItoolsPK home">
          <Image
            src="/brand/symbol.webp"
            alt=""
            width={38}
            height={38}
            priority
          />
          <span>
            AItools<span className="brand-light">PK</span>
            <span className="brand-dot">.</span>
          </span>
        </Link>
        <nav aria-label="Main navigation" className="desktop-nav">
          <Link href="/tools/">Explore tools</Link>
          <Link href="/categories/">Categories</Link>
          <Link href="/how-to-order/">How to order</Link>
          <Link href="/contact/">Contact</Link>
        </nav>
        <div className="header-actions">
          <Link
            className="icon-button"
            href="/tools/?focus=search"
            aria-label="Search tools"
          >
            <Search size={19} />
          </Link>
          <a
            href="https://wa.me/923714549245"
            target="_blank"
            rel="noopener noreferrer"
            className="button small desktop-contact"
          >
            Let’s talk <ArrowUpRight size={15} />
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
            <span className="eyebrow">AItoolsPK</span>
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
              ['Explore tools', '/tools/'],
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
