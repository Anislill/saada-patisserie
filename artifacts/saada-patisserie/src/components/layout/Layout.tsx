import * as React from "react";
import Header from "./Header";
import Footer from "./Footer";
import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [showWhatsApp, setShowWhatsApp] = React.useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setShowWhatsApp(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow flex flex-col">
        {children}
      </main>
      <Footer />
      
      {/* WhatsApp FAB */}
      {showWhatsApp && (
        <motion.a
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.1 }}
          href="https://wa.me/1234567890"
          target="_blank"
          rel="norenoopener noreferrer"
          className="fixed bottom-6 right-6 w-14 h-14 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-lg z-40 hover:bg-[#1EBE5D] transition-colors"
        >
          <MessageCircle size={28} />
        </motion.a>
      )}
    </div>
  );
}
