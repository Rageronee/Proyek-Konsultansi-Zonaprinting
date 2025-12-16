import { motion } from "framer-motion";
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "@/assets/logo-zonaprint.png";

const Footer = () => {
  const footerLinks = {
    Produk: [
      { label: "Digital Printing", to: "/category/digital-printing" },
      { label: "Merchandise", to: "/category/merchandise" },
      { label: "Sticker & Label", to: "/category/sticker-label" },
      { label: "Document & Books", to: "/category/documents" },
      { label: "Packaging", to: "/category/packaging" },
    ],
    Perusahaan: [
      { label: "About Us", to: "/about" },
      { label: "Blog", to: "/about" },
      { label: "Contact", to: "/contact" },
    ],
    Support: [
      { label: "Help Center", to: "/contact" },
      { label: "Track Order", to: "/cart" },
      { label: "FAQ", to: "/contact" },
      { label: "Terms of Service", to: "/about" },
    ],
  };

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Twitter, href: "#", label: "Twitter" },
  ];

  return (
    <footer className="bg-primary-deep text-primary-foreground">
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
              <img src={logo} alt="ZONAPRINT" className="h-12 mb-6 brightness-0 invert" />
              <p className="text-primary-foreground/80 mb-6 max-w-sm">
                Solusi cetak digital terpercaya untuk semua kebutuhan bisnis dan personal Anda. Kualitas premium, harga terjangkau.
              </p>
              
              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-primary-foreground/80">
                  <Phone className="w-5 h-5 text-accent" />
                  <span>+62 812-3456-7890</span>
                </div>
                <div className="flex items-center gap-3 text-primary-foreground/80">
                  <Mail className="w-5 h-5 text-accent" />
                  <span>info@zonaprint.com</span>
                </div>
                <div className="flex items-center gap-3 text-primary-foreground/80">
                  <MapPin className="w-5 h-5 text-accent" />
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
                      className="text-primary-foreground/80 hover:text-accent transition-colors duration-300 inline-block"
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
          className="flex gap-4 mt-12 pt-8 border-t border-primary-foreground/20"
        >
          {socialLinks.map((social, index) => {
            const Icon = social.icon;
            return (
              <motion.a
                key={index}
                href={social.href}
                aria-label={social.label}
                whileHover={{ scale: 1.1, y: -2 }}
                className="w-10 h-10 rounded-full bg-primary-foreground/10 hover:bg-accent flex items-center justify-center transition-colors duration-300"
              >
                <Icon className="w-5 h-5" />
              </motion.a>
            );
          })}
        </motion.div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-primary-foreground/20">
        <div className="container mx-auto px-4 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-primary-foreground/80">
            <p>© 2024 ZONAPRINT. All rights reserved.</p>
            <div className="flex gap-6">
              <Link to="/about" className="hover:text-accent transition-colors">
                Privacy Policy
              </Link>
              <Link to="/about" className="hover:text-accent transition-colors">
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
