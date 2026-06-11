import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Download, Copy, Check, Palette, Type } from 'lucide-react';
import { Card } from '../components/ui/card';
import { useToast } from '../components/ui/toast';

export const Brand = () => {
  const toast = useToast();
  const [copiedColor, setCopiedColor] = useState<string | null>(null);

  const colorsList = [
    { name: 'Canvas White (darkbg)', hex: '#ffffff', desc: 'Core editorial background of the application' },
    { name: 'Primary Accent (primary)', hex: '#17171c', desc: 'Primary typography and Near-Black highlight' },
    { name: 'Secondary Coral (secondary)', hex: '#ff7759', desc: 'Tacit brand elements and category tags' },
    { name: 'Deep Enterprise Green', hex: '#003c33', desc: 'Callouts and high-contrast dark sections' },
    { name: 'Text Muted (textSecondary)', hex: '#616161', desc: 'Muted body copy and descriptive lists' },
    { name: 'Soft Stone (surface1)', hex: '#eeece7', desc: 'Warm mineral cards and layout background grids' }
  ];

  const handleCopyColor = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedColor(hex);
    toast.show(`Copied HEX code: ${hex}!`);
    setTimeout(() => setCopiedColor(null), 2000);
  };

  const handleDownloadLogos = () => {
    toast.show('Downloading logo asset pack...');
  };

  return (
    <>
      <Helmet>
        <title>Brand Identity & Assets | ViralAI Hub</title>
        <meta name="description" content="Download official ViralAI Hub logos, color palettes, and typography assets. Learn about our brand design guidelines." />
      </Helmet>

      <div className="relative min-h-[90vh] bg-white text-[#17171c] py-24 px-6 md:px-12 overflow-hidden">
        <div className="max-w-4xl mx-auto space-y-16 relative z-10">
          {/* Header */}
          <div className="space-y-6 text-center md:text-left">
            <span className="inline-flex px-3 py-1 rounded-full border border-neutral-200 bg-[#eeece7]/50 text-[10px] uppercase font-mono tracking-wider font-bold text-neutral-500">
              Brand Assets
            </span>
            <h1 className="font-heading text-4xl sm:text-6xl font-bold leading-none tracking-tight text-[#17171c]">
              Design & <span className="text-[#ff7759]">Guidelines</span>
            </h1>
            <p className="text-sm sm:text-base text-[#616161] font-light leading-relaxed max-w-2xl">
              Official design assets and style guidelines for references, partnerships, and community creations. 
            </p>
          </div>

          {/* Logo Section */}
          <div className="space-y-8 border-b border-neutral-200 pb-12">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left">
              <div>
                <h2 className="font-heading text-xl sm:text-2xl font-bold text-[#17171c]">Logo & Mark</h2>
                <p className="text-xs text-[#616161] font-medium">Download high-resolution branding graphics.</p>
              </div>
              <button 
                onClick={handleDownloadLogos}
                className="inline-flex items-center space-x-2 bg-[#17171c] hover:bg-black text-white px-5 py-2.5 rounded-full text-xs font-semibold tracking-wide cursor-pointer transition-colors duration-300 self-start sm:self-center shadow-sm"
              >
                <Download size={14} />
                <span>Download Assets Zip</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* White background logo box */}
              <Card hoverEffect={false} className="p-10 flex flex-col items-center justify-center bg-white border border-neutral-200 rounded-2xl h-48 select-none shadow-sm">
                <img src="/logo.png" alt="ViralAI Hub Logo on Light" className="w-16 h-16 object-contain" />
                <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-mono mt-4">Light background logo</span>
              </Card>

              {/* Dark background logo box */}
              <Card hoverEffect={false} className="p-10 flex flex-col items-center justify-center bg-[#17171c] border border-transparent rounded-2xl h-48 select-none shadow-sm">
                <div className="w-16 h-16 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center p-1">
                  <img src="/logo.png" alt="ViralAI Hub Logo on Dark" className="w-full h-full object-contain" />
                </div>
                <span className="text-[10px] uppercase tracking-wider text-white/40 font-mono mt-4">Dark background logo</span>
              </Card>
            </div>
          </div>

          {/* Colors System Grid */}
          <div className="space-y-8 border-b border-neutral-200 pb-12">
            <div className="space-y-1 text-left">
              <h2 className="font-heading text-xl sm:text-2xl font-bold flex items-center gap-2 text-[#17171c]">
                <Palette size={20} className="text-[#ff7759]" />
                <span>Color Palette</span>
              </h2>
              <p className="text-xs text-[#616161] font-medium">Harmonious mineral colors used throughout our application.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {colorsList.map((c) => (
                <Card 
                  key={c.name} 
                  hoverEffect={false} 
                  className="bg-white border border-neutral-200 rounded-2xl overflow-hidden p-4 space-y-4 flex flex-col justify-between shadow-sm hover:border-neutral-300 transition-colors"
                >
                  <div className="space-y-2 text-left">
                    <div 
                      className="w-full h-16 rounded-xl border border-neutral-200/50 shadow-inner" 
                      style={{ backgroundColor: c.hex }} 
                    />
                    <h3 className="text-xs font-semibold text-[#17171c] truncate leading-none pt-2">{c.name}</h3>
                    <p className="text-[10px] text-[#616161] leading-relaxed font-light line-clamp-2 h-8">{c.desc}</p>
                  </div>
                  
                  <button
                    onClick={() => handleCopyColor(c.hex)}
                    className="w-full py-2 bg-[#eeece7] border border-neutral-200 rounded-xl text-[10px] font-mono text-neutral-600 hover:text-[#17171c] hover:bg-[#eeece7]/80 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    {copiedColor === c.hex ? (
                      <>
                        <Check size={11} className="text-emerald-600" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy size={11} />
                        <span>{c.hex}</span>
                      </>
                    )}
                  </button>
                </Card>
              ))}
            </div>
          </div>

          {/* Typography guidelines */}
          <div className="space-y-8">
            <div className="space-y-1 text-left">
              <h2 className="font-heading text-xl sm:text-2xl font-bold flex items-center gap-2 text-[#17171c]">
                <Type size={20} className="text-[#616161]" />
                <span>Typography</span>
              </h2>
              <p className="text-xs text-[#616161] font-medium">Our elegant display and functional body text fonts.</p>
            </div>

            <Card hoverEffect={false} className="p-6 bg-white border border-neutral-200 rounded-2xl divide-y divide-neutral-100 shadow-sm text-left">
              {/* Space Grotesk */}
              <div className="py-6 first:pt-0 space-y-3">
                <div className="flex items-center justify-between text-xs text-neutral-400">
                  <span className="font-semibold text-neutral-700">Space Grotesk</span>
                  <span className="font-mono">Display / Headlines</span>
                </div>
                <p className="font-heading text-3xl sm:text-4xl text-[#17171c] tracking-tight leading-none">
                  Packaged AI workflows engineered for creators.
                </p>
              </div>

              {/* Inter */}
              <div className="py-6 last:pb-0 space-y-3">
                <div className="flex items-center justify-between text-xs text-neutral-400">
                  <span className="font-semibold text-neutral-700">Inter</span>
                  <span className="font-mono">Body / UI Copy</span>
                </div>
                <p className="text-xs sm:text-sm text-[#616161] leading-relaxed font-light">
                  A modern, neutral sans-serif designed for high legibility on screens. Used across all step descriptions, resource details, forms, and technical guides.
                </p>
              </div>
            </Card>
          </div>

        </div>
      </div>
    </>
  );
};

export default Brand;
