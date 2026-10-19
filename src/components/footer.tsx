import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
export function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-about">
            <Link className="brand" href="/">
              <Image
                src="/brand/symbol-small.webp"
                alt=""
                width={34}
                height={34}
              />
              <span>
                AiTools<span className="brand-light">Pk</span>
              </span>
            </Link>
            <p>
              A clearer way to find digital tools.
              <br />
              Compare in PKR. Connect on WhatsApp.
            </p>
            <a
              className="text-link"
              href="https://wa.me/923714549245"
              target="_blank"
              rel="noopener noreferrer"
            >
              +92 371 4549245 <ArrowUpRight size={14} />
            </a>
          </div>
          <div>
            <p className="footer-label">EXPLORE</p>
            <Link href="/tools/">All tools</Link>
            <Link href="/categories/">Categories</Link>
            <Link href="/how-to-order/">How to order</Link>
          </div>
          <div>
            <p className="footer-label">HERE TO HELP</p>
            <Link href="/faq/">FAQs</Link>
            <Link href="/contact/">Contact us</Link>
            <Link href="/refund-policy/">Refund policy</Link>
          </div>
          <div>
            <p className="footer-label">THE DETAILS</p>
            <Link href="/privacy-policy/">Privacy policy</Link>
            <Link href="/terms/">Terms of service</Link>
            <span className="muted text-sm">Pakistan · Prices in PKR</span>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} AiToolsPk.tech</span>
          <span>
            Independent catalog. Product trademarks belong to their respective
            owners. No vendor affiliation is claimed.
          </span>
        </div>
      </div>
    </footer>
  );
}
