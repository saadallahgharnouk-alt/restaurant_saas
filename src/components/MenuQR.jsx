import React from 'react';
import { Download, Share2, Copy } from 'lucide-react';
import { motion } from 'framer-motion';
import QRCodeStyling from 'qr-code-styling';

export default function MenuQRGenerator({ restaurant }) {
  const [copied, setCopied] = React.useState(false);
  const canvasRef = React.useRef(null);
  const menuUrl = `${window.location.origin}/restaurants/${restaurant?.id || 'demo'}`;

  React.useEffect(() => {
    const qrCode = new QRCodeStyling({
      width: 300,
      height: 300,
      type: 'canvas',
      data: menuUrl,
      image: null,
      dotsOptions: {
        color: '#000000',
        type: 'rounded',
      },
      cornersSquareOptions: {
        color: '#000000',
        type: 'rounded',
      },
      cornersDotOptions: {
        color: '#000000',
        type: 'dot',
      },
      backgroundOptions: {
        color: '#ffffff',
      },
    });

    if (canvasRef.current) {
      canvasRef.current.innerHTML = '';
      qrCode.append(canvasRef.current);
    }
  }, [menuUrl]);

  const downloadQR = () => {
    const qrCode = new QRCodeStyling({
      width: 300,
      height: 300,
      type: 'canvas',
      data: menuUrl,
      dotsOptions: { color: '#000000', type: 'rounded' },
      cornersSquareOptions: { color: '#000000', type: 'rounded' },
      cornersDotOptions: { color: '#000000', type: 'dot' },
      backgroundOptions: { color: '#ffffff' },
    });
    qrCode.download({ name: `menu-qr-${restaurant?.name || 'restaurant'}.png`, extension: 'png' });
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(menuUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-2xl p-8 max-w-md mx-auto"
    >
      <h2 className="text-2xl font-bold text-white mb-6">Digital Menu QR</h2>

      {/* QR Code Container */}
      <div className="bg-white p-6 rounded-xl mb-6 flex justify-center" ref={canvasRef} />

      {/* Menu URL */}
      <div className="bg-zinc-700/50 p-3 rounded-lg mb-4 flex items-center justify-between">
        <code className="text-xs text-zinc-300 truncate flex-1">{menuUrl}</code>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={copyToClipboard}
          className={`ml-2 p-2 rounded-lg transition-all ${
            copied ? 'bg-green-500 text-white' : 'bg-zinc-600 text-zinc-300 hover:bg-zinc-500'
          }`}
        >
          <Copy size={16} />
        </motion.button>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={downloadQR}
          className="flex-1 bg-indigo-500 hover:bg-indigo-600 text-white py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
        >
          <Download size={18} /> Download
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.95 }}
          className="flex-1 bg-purple-500 hover:bg-purple-600 text-white py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
        >
          <Share2 size={18} /> Share
        </motion.button>
      </div>

      {/* Info Text */}
      <p className="text-xs text-zinc-400 mt-4 text-center">
        Customers can scan this QR code to view your menu on their phones
      </p>
    </motion.div>
  );
}
