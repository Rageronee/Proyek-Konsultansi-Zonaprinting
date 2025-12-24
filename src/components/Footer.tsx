import { motion } from "framer-motion";
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "@/assets/logo-zonaprint.png";

const Footer = () => {
  const footerLinks = {
    Produk: [
      { label: "Digital Printing", to: "/products?category=Digital%20Printing" },
      { label: "Merchandise", to: "/products?category=Merchandise" },
      { label: "Sticker & Label", to: "/products?category=Sticker" },
      { label: "Document Books", to: "/products?category=Document%20Books" },
      { label: "Packaging", to: "/products?category=Packaging" },
    ],
    Perusahaan: [
      { label: "About Us", to: "/about" },
    ],
    Support: [
      { label: "Contact", to: "/contact" },
      { label: "FAQ", to: "/faq" },
    ],
  };

  const socialLinks = [
    { icon: Instagram, href: "https://www.instagram.com/zonaprintdigitalprinting/", label: "Instagram" },
    {
      icon: ({ className }: { className?: string }) => (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
        >
          <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
        </svg>
      ),
      href: "https://www.tiktok.com/@zonaprintdigitalprinting",
      label: "TikTok Center",
    },
    {
      icon: ({ className }: { className?: string }) => (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
        >
          <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
        </svg>
      ),
      href: "https://www.tiktok.com/@zonaprintpurwakarta_",
      label: "TikTok Purwakarta",
    },
  ];

  return (
    <footer className="bg-primary-deep text-primary-foreground dark:bg-slate-950 dark:text-slate-100">
      {/* Main Footer */}
      <div className="container mx-auto px-4 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <img src={logo} alt="ZONAPRINT" className="h-12 mb-6 brightness-0 invert dark:brightness-100 dark:invert-0" />
              <p className="text-primary-foreground/80 dark:text-slate-300 mb-6 max-w-sm">
                Solusi cetak digital terpercaya untuk semua kebutuhan bisnis dan personal Anda. Kualitas premium, harga terjangkau.
              </p>

              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-primary-foreground/80 dark:text-slate-300">
                  <Phone className="w-5 h-5 text-accent dark:text-amber-400" />
                  <div className="flex flex-col text-sm">
                    <span>+62 822-4690-7899 (Wanayasa)</span>
                    <span>+62 811-8894-690 (Purwakarta)</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-primary-foreground/80 dark:text-slate-300">
                  <Mail className="w-5 h-5 text-accent dark:text-amber-400" />
                  <span>zonaprintwanayasa@gmail.com</span>
                </div>
                <div className="flex items-center gap-3 text-primary-foreground/80 dark:text-slate-300">
                  <MapPin className="w-5 h-5 text-accent dark:text-amber-400" />
                  <span>Purwakarta, Indonesia</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Links Columns */}
          {Object.entries(footerLinks).map(([title, links], colIndex) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: colIndex * 0.1 }}
            >
              <h3 className="font-bold text-lg mb-4">{title}</h3>
              <ul className="space-y-3">
                {links.map((link, index) => (
                  <li key={index}>
                    <Link
                      to={link.to}
                      className="text-primary-foreground/80 dark:text-slate-300 hover:text-accent dark:hover:text-amber-400 transition-colors duration-300 inline-block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Social Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="flex gap-4 mt-12 pt-8 border-t border-primary-foreground/20 dark:border-slate-800"
        >
          {socialLinks.map((social, index) => {
            const Icon = social.icon;
            return (
              <motion.a
                key={index}
                href={social.href}
                aria-label={social.label}
                whileHover={{ scale: 1.1, y: -2 }}
                className="w-10 h-10 rounded-full bg-primary-foreground/10 dark:bg-slate-800 hover:bg-accent dark:hover:bg-amber-400/90 flex items-center justify-center transition-colors duration-300"
              >
                <Icon className="w-5 h-5" />
              </motion.a>
            );
          })}
        </motion.div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-primary-foreground/20 dark:border-slate-800">
        <div className="container mx-auto px-4 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-primary-foreground/80 dark:text-slate-400">
            <p>© 2025 ZONAPRINT X MKB UPI Purwakarta. All rights reserved.</p>
            <div className="flex gap-6">
              <Link to="/refund" className="hover:text-accent dark:hover:text-amber-400 transition-colors">
                Refund Policy
              </Link>
              <Link to="/terms" className="hover:text-accent dark:hover:text-amber-400 transition-colors">
                Terms & Conditions
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
