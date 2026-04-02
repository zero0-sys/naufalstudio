import { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, ExternalLink, Download, FileText, Play, Image as ImageIcon, Crown, Medal, Star } from 'lucide-react';
import portfolioData from './data.json';
import * as Icons from 'lucide-react';

// Custom Typewriter Hook
const useTypewriter = (words: string[], typingSpeed = 100, deletingSpeed = 60, delay = 2000) => {
  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingDelta, setTypingDelta] = useState(typingSpeed);

  useEffect(() => {
    let ticker = setTimeout(() => {
      const i = loopNum % words.length;
      const fullText = words[i];

      setText(isDeleting 
        ? fullText.substring(0, text.length - 1) 
        : fullText.substring(0, text.length + 1)
      );

      setTypingDelta(isDeleting ? deletingSpeed : typingSpeed);

      if (!isDeleting && text === fullText) {
        setIsDeleting(true);
        setTypingDelta(delay);
      } else if (isDeleting && text === '') {
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
        setTypingDelta(500);
      }
    }, typingDelta);
    return () => clearTimeout(ticker);
  }, [text, isDeleting, loopNum, words, typingSpeed, deletingSpeed, delay, typingDelta]);

  return text;
};

// Security Hook
const useSecurity = () => {
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => e.preventDefault();
    const handleDragStart = (e: DragEvent) => e.preventDefault();
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && e.key === 'I') ||
        (e.ctrlKey && e.shiftKey && e.key === 'J') ||
        (e.ctrlKey && e.key === 'U')
      ) {
        e.preventDefault();
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('dragstart', handleDragStart);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('dragstart', handleDragStart);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
};

// Components
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const links = ['Home', 'About', 'Sertifikat', 'Gallery', 'Contact'];

  return (
    <nav className="fixed top-0 left-0 w-full z-50 glass no-select">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <span className="text-xl font-bold tracking-tighter text-white">Naufal<span className="text-primary">Studio</span></span>
          </div>
          <div className="hidden md:block">
            <div 
              className="ml-10 flex items-baseline space-x-2"
              onMouseLeave={() => setHoveredLink(null)}
            >
              {links.map((link) => (
                <a
                  key={link}
                  href={`#${link.toLowerCase()}`}
                  onMouseEnter={() => setHoveredLink(link)}
                  className="relative px-4 py-2 rounded-full text-sm font-medium transition-colors text-gray-300 hover:text-white"
                >
                  {hoveredLink === link && (
                    <motion.div
                      layoutId="nav-bubble"
                      className="absolute inset-0 bg-white/10 rounded-full z-[-1]"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  {link}
                </a>
              ))}
            </div>
          </div>
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-400 hover:text-white focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      {isOpen && (
        <div className="md:hidden glass border-t border-white/10">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {links.map((link) => (
              <a
                key={link}
                href={`#${link.toLowerCase()}`}
                onClick={() => setIsOpen(false)}
                className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
              >
                {link}
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

const Hero = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const heroRef = useRef<HTMLElement>(null);
  
  const typewriterText = useTypewriter(['Studio', 'Graphic Design', 'VFX Artist', 'UI/UX Design', '3D Creator']);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!heroRef.current) return;
      const rect = heroRef.current.getBoundingClientRect();
      setMousePos({ 
        x: ((e.clientX - rect.left) / rect.width) * 100, 
        y: ((e.clientY - rect.top) / rect.height) * 100 
      });
    };
    
    const handleTouchMove = (e: TouchEvent) => {
      if (!heroRef.current) return;
      const touch = e.touches[0];
      const rect = heroRef.current.getBoundingClientRect();
      setMousePos({
        x: ((touch.clientX - rect.left) / rect.width) * 100,
        y: ((touch.clientY - rect.top) / rect.height) * 100
      });
    };

    const handleMouseEnter = () => setIsHovering(true);
    const handleMouseLeave = () => setIsHovering(false);

    const heroEl = heroRef.current;
    if (heroEl) {
      heroEl.addEventListener("mousemove", handleMouseMove);
      heroEl.addEventListener("mouseenter", handleMouseEnter);
      heroEl.addEventListener("mouseleave", handleMouseLeave);
      
      heroEl.addEventListener("touchmove", handleTouchMove, { passive: true });
      heroEl.addEventListener("touchstart", handleMouseEnter, { passive: true });
      heroEl.addEventListener("touchend", handleMouseLeave);
    }

    return () => {
      if (heroEl) {
        heroEl.removeEventListener("mousemove", handleMouseMove);
        heroEl.removeEventListener("mouseenter", handleMouseEnter);
        heroEl.removeEventListener("mouseleave", handleMouseLeave);
        
        heroEl.removeEventListener("touchmove", handleTouchMove);
        heroEl.removeEventListener("touchstart", handleMouseEnter);
        heroEl.removeEventListener("touchend", handleMouseLeave);
      }
    };
  }, []);

  // Generate random particles
  const particles = useMemo(() => Array.from({ length: 40 }).map((_, i) => ({
    id: i,
    size: Math.random() * 6 + 2, // 2px to 8px
    startX: Math.random() * 100, // vw
    startY: Math.random() * 100, // vh
    moveX: (Math.random() - 0.5) * 20, // Drift X distance
    moveY: (Math.random() - 0.5) * 20, // Drift Y distance
    offsetX: (Math.random() - 0.5) * 15, // vw spread
    offsetY: (Math.random() - 0.5) * 15, // vh spread
    duration: Math.random() * 15 + 15,  // Animation loop duration
    delay: Math.random() * 5,
  })), []);

  return (
    <section ref={heroRef} id="home" className="min-h-screen flex items-center justify-center pt-16 no-select relative overflow-hidden cursor-crosshair">
      {/* Background Gradient & Glass */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] bg-primary/20 rounded-full blur-[100px] pointer-events-none opacity-50"></div>
      <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px] pointer-events-none z-0"></div>

      {/* Animated Particles */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute z-0 pointer-events-none"
            animate={{
              x: `${isHovering ? mousePos.x + p.offsetX : p.startX}vw`,
              y: `${isHovering ? mousePos.y + p.offsetY : p.startY}vh`,
            }}
            transition={{
              type: "spring",
              stiffness: isHovering ? 40 : 15,
              damping: isHovering ? 20 : 50,
              mass: 1
            }}
          >
            <motion.div
              className="rounded-full bg-gradient-to-r from-primary/50 to-secondary/50"
              style={{
                width: p.size,
                height: p.size,
              }}
              animate={{
                x: [`0vw`, `${p.moveX}vw`, `0vw`],
                y: [`0vh`, `${p.moveY}vh`, `0vh`],
                scale: isHovering ? 1.5 : 1,
                opacity: isHovering ? 0.6 : 0.2, // Subtle fade out when idle
              }}
              transition={{
                x: { duration: p.duration, repeat: Infinity, ease: "easeInOut", delay: p.delay },
                y: { duration: p.duration, repeat: Infinity, ease: "easeInOut", delay: p.delay },
                scale: { type: "spring", stiffness: 40 },
                opacity: { duration: 1.5 } // Smooth fade
              }}
            />
          </motion.div>
        ))}
      </div>
      
      <div className="text-center px-4 relative z-10 pointer-events-none">
        <div className="relative inline-block pointer-events-auto">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tighter mb-4 relative z-10"
          >
            Naufal<span className="text-primary">{typewriterText}</span><span className="text-primary animate-pulse relative -top-1 ml-1 text-4xl sm:text-5xl md:text-7xl font-light">|</span>
          </motion.h1>
        </div>
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-xl md:text-2xl text-gray-400 mb-10"
        >
          {portfolioData.about.title}
        </motion.h2>
        <motion.a 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.92 }}
          href="/cv-naufalstudio.pdf"
          download="CV_NaufalStudio.pdf"
          className="inline-flex items-center gap-2 bg-white hover:bg-gray-200 text-black font-medium px-8 py-3 rounded-full transition-colors pointer-events-auto shadow-xl shadow-white/10"
        >
          <Download size={20} />
          Download CV (PDF)
        </motion.a>
      </div>
    </section>
  );
};

const About = () => {
  const [isPaused, setIsPaused] = useState(false);
  const [titleIndex, setTitleIndex] = useState(0);

  const creativeTitles = [
    { top: "Visual", bottom: "Artist", sub: "& Designer" },
    { top: "UI/UX", bottom: "Designer", sub: "& Developer" },
    { top: "Video", bottom: "Editor", sub: "& Animator" },
    { top: "3D", bottom: "Creator", sub: "& Modeler" },
    { top: "Graphic", bottom: "Designer", sub: "& Illustrator" },
    { top: "Digital", bottom: "Creator", sub: "& Visionary" }
  ];

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setTitleIndex((prev) => (prev + 1) % creativeTitles.length);
    }, 3000); // Change text every 3 seconds
    return () => clearInterval(interval);
  }, [isPaused]);

  return (
    <section id="about" className="py-20 px-4 no-select">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex-1"
          >
            <h2 className="text-3xl font-bold mb-6">Tentang <span className="text-primary">Saya</span></h2>
            <div className="space-y-4 text-gray-300 leading-relaxed whitespace-pre-line">
              {portfolioData.about.description}
            </div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex-1 w-full max-w-md relative min-h-[400px] flex items-center justify-center"
          >
            <div 
              className="relative w-full h-full flex flex-col items-center justify-center cursor-pointer group"
              onClick={() => setIsPaused(!isPaused)}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={titleIndex}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 1.05 }}
                  transition={{ duration: 0.5 }}
                  className="text-center w-full flex flex-col justify-center items-center relative z-10"
                >
                  <h3 className="text-5xl md:text-6xl font-black tracking-tighter mb-2 text-white uppercase leading-none">
                    {creativeTitles[titleIndex].top}<br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                      {creativeTitles[titleIndex].bottom}
                    </span>
                  </h3>
                  <p className="text-lg md:text-xl text-gray-400 font-mono uppercase tracking-[0.3em] mt-4">
                    {creativeTitles[titleIndex].sub}
                  </p>
                </motion.div>
              </AnimatePresence>
              
              <div className="absolute -bottom-8 left-0 w-full text-center text-[10px] text-gray-500 font-mono uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                {isPaused ? 'Click to Resume' : 'Click to Pause'}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const Certificates = () => {
  // Duplicate certificates to create a seamless infinite scroll effect
  const duplicatedCertificates = [...(portfolioData.certificates || []), ...(portfolioData.certificates || [])];

  if (!portfolioData.certificates || portfolioData.certificates.length === 0) return null;

  return (
    <section id="sertifikat" className="py-20 px-4 no-select relative overflow-hidden">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto mb-12 text-center"
      >
        <h2 className="text-3xl font-bold">Sertifikat <span className="text-primary">& Penghargaan</span></h2>
        <p className="text-gray-400 mt-4">Pencapaian dan validasi keahlian profesional.</p>
      </motion.div>

      {/* Marquee Container */}
      <div className="relative w-full overflow-hidden flex items-center py-4">
        {/* Left/Right Fades for smooth entry/exit */}
        <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-[#0a0a0a] to-transparent z-10 pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-[#0a0a0a] to-transparent z-10 pointer-events-none"></div>

        <motion.div
          className="flex gap-6 px-4"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            duration: 25,
            ease: "linear",
            repeat: Infinity,
          }}
          style={{ width: "max-content" }}
        >
          {duplicatedCertificates.map((cert, idx) => (
            <div 
              key={`${cert.id}-${idx}`} 
              className="w-[280px] md:w-[380px] shrink-0 glass-card rounded-2xl overflow-hidden group relative border border-white/10 shadow-2xl"
            >
              <div className="aspect-[4/3] overflow-hidden relative">
                <img 
                  src={cert.image} 
                  alt={cert.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 no-drag"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300"></div>
                
                <div className="absolute bottom-0 left-0 w-full p-6 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2.5 py-1 bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] uppercase tracking-wider font-bold rounded-full">
                      {cert.year}
                    </span>
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-white leading-tight mb-1">{cert.title}</h3>
                  <p className="text-sm text-gray-300">{cert.issuer}</p>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

const Gallery = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeSubcategory, setActiveSubcategory] = useState('All');
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [showAllGallery, setShowAllGallery] = useState(false);
  
  const categories = ['All', 'Image / Art', 'Video'];
  
  const subcategoriesMap: Record<string, string[]> = {
    'Image / Art': ['All', 'Traditional Art', 'Digital Art', '2D Render', '3D Render', 'Photo Manipulation', 'GFX', 'UI/UX Design', 'Graphic Design', 'Photography'],
    'Video': ['All', 'Anime', 'Clip', 'Movie', 'Short', 'Trailers', 'Videographer', 'Film']
  };

  // Handle category change and reset subcategory
  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    setActiveSubcategory('All');
    setShowAllGallery(false);
  };
  
  const filteredItems = portfolioData.gallery.filter(item => {
    const matchCategory = activeCategory === 'All' || item.category === activeCategory;
    
    // For subcategories, we do a loose match or exact match depending on how data is structured.
    // If activeSubcategory is 'All', we don't filter by it.
    // Otherwise, we check if the item's subcategory includes the activeSubcategory text.
    const matchSubcategory = activeSubcategory === 'All' || 
      (item.subcategory && item.subcategory.toLowerCase().includes(activeSubcategory.toLowerCase()));
      
    return matchCategory && matchSubcategory;
  });

  const renderRegularItem = (item: any) => (
    <motion.div
      layoutId={`gallery-item-${item.id}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      key={item.id}
      className="group relative aspect-video rounded-xl overflow-hidden glass-card cursor-pointer no-select isolate"
      onClick={() => setSelectedItem(item)}
    >
      {item.type === 'video' ? (
        <video 
          src={item.url} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 no-drag"
          muted
          loop
          autoPlay
          playsInline
        />
      ) : (
        <img 
          src={item.type === 'document' ? item.thumbnail : item.url} 
          alt={item.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 no-drag"
          referrerPolicy="no-referrer"
        />
      )}
      <div className="image-overlay"></div>
      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
        <span className="text-xs text-primary font-medium mb-1">{item.subcategory}</span>
        <h3 className="text-lg font-bold text-white">{item.title}</h3>
        <div className="absolute top-4 right-4 text-white/50">
          {item.type === 'video' && <Play size={20} />}
          {item.type === 'image' && <ImageIcon size={20} />}
          {item.type === 'document' && <Download size={20} />}
        </div>
      </div>
    </motion.div>
  );

  return (
    <section id="gallery" className="py-20 px-4 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <motion.h2 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-3xl font-bold mb-10 text-center no-select"
        >
          Portfolio <span className="text-primary">Karya</span>
        </motion.h2>
        
        {/* Filters */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex flex-col items-center gap-4 mb-12"
        >
          <div className="flex flex-wrap justify-center gap-2 no-select bg-white/5 p-2 rounded-3xl md:rounded-full backdrop-blur-md border border-white/10 max-w-fit mx-auto shadow-xl">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeCategory === cat 
                    ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/25' 
                    : 'text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Subcategory Filters */}
          <AnimatePresence>
            {activeCategory !== 'All' && subcategoriesMap[activeCategory] && (
              <motion.div 
                initial={{ opacity: 0, height: 0, y: -10 }}
                animate={{ opacity: 1, height: 'auto', y: 0 }}
                exit={{ opacity: 0, height: 0, y: -10 }}
                className="flex flex-wrap justify-center gap-2 max-w-4xl"
              >
                {subcategoriesMap[activeCategory].map(sub => (
                  <button
                    key={sub}
                    onClick={() => setActiveSubcategory(sub)}
                    className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-300 border ${
                      activeSubcategory === sub 
                        ? 'bg-white/20 text-white border-white/30' 
                        : 'bg-transparent text-gray-400 border-white/10 hover:text-white hover:border-white/30'
                    }`}
                  >
                    {sub}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Grid */}
        <motion.div layout className="w-full">
          <AnimatePresence mode="popLayout">
            {activeCategory === 'All' ? (
              <motion.div
                key="top-gallery"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="space-y-12"
              >
                {/* Top 5 Luxurious Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 auto-rows-[150px] md:auto-rows-[250px] lg:auto-rows-[300px]">
                  {portfolioData.gallery.slice(0, 5).map((item, index) => {
                    const isRank1 = index === 0;
                    const isRank2 = index === 1;
                    const isRank3 = index === 2;
                    
                    return (
                      <motion.div
                        layoutId={`gallery-item-${item.id}`}
                        key={item.id}
                        onClick={() => setSelectedItem(item)}
                        className={`group relative rounded-2xl overflow-hidden glass-card cursor-pointer no-select isolate ${
                          isRank1 ? 'col-span-2 row-span-2' : 'col-span-1 row-span-1'
                        }`}
                      >
                        {item.type === 'video' ? (
                          <video 
                            src={item.url} 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 no-drag"
                            muted
                            loop
                            autoPlay
                            playsInline
                          />
                        ) : (
                          <img 
                            src={item.type === 'document' ? item.thumbnail : item.url} 
                            alt={item.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 no-drag"
                            referrerPolicy="no-referrer"
                          />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300"></div>
                        
                        {/* Badges */}
                        <div className="absolute top-4 left-4 z-20">
                          {isRank1 && (
                            <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-500/20 to-yellow-700/20 backdrop-blur-md border border-yellow-500/50 px-3 py-1.5 rounded-full">
                              <Crown size={18} className="text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.8)]" />
                              <span className="text-yellow-400 font-bold text-xs uppercase tracking-wider">1st Place</span>
                            </div>
                          )}
                          {isRank2 && (
                            <div className="flex items-center gap-2 bg-gradient-to-r from-gray-300/20 to-gray-500/20 backdrop-blur-md border border-gray-300/50 px-3 py-1.5 rounded-full">
                              <Medal size={16} className="text-gray-300 drop-shadow-[0_0_8px_rgba(209,213,219,0.8)]" />
                              <span className="text-gray-300 font-bold text-xs uppercase tracking-wider">2nd Place</span>
                            </div>
                          )}
                          {isRank3 && (
                            <div className="flex items-center gap-2 bg-gradient-to-r from-amber-600/20 to-amber-800/20 backdrop-blur-md border border-amber-600/50 px-3 py-1.5 rounded-full">
                              <Medal size={16} className="text-amber-500 drop-shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
                              <span className="text-amber-500 font-bold text-xs uppercase tracking-wider">3rd Place</span>
                            </div>
                          )}
                          {index > 2 && (
                            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-3 py-1.5 rounded-full">
                              <Star size={14} className="text-white/80" />
                              <span className="text-white/80 font-bold text-xs uppercase tracking-wider">Top 5</span>
                            </div>
                          )}
                        </div>

                        <div className="absolute bottom-0 left-0 w-full p-6 z-20 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                          <span className="text-xs text-primary font-medium mb-2 block">{item.subcategory}</span>
                          <h3 className={`font-bold text-white ${isRank1 ? 'text-2xl md:text-3xl' : 'text-lg'}`}>{item.title}</h3>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Remaining Items */}
                {portfolioData.gallery.length > 5 && (
                  <>
                    <div className="flex items-center justify-center gap-4 my-8 opacity-50">
                      <div className="h-px bg-white/20 flex-1 max-w-[100px]"></div>
                      <span className="text-sm font-medium uppercase tracking-widest">Karya Lainnya</span>
                      <div className="h-px bg-white/20 flex-1 max-w-[100px]"></div>
                    </div>
                    {showAllGallery ? (
                      <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                          {portfolioData.gallery.slice(5).map(renderRegularItem)}
                        </div>
                        <div className="text-center mt-12 mb-8">
                          <button 
                            onClick={() => setShowAllGallery(false)} 
                            className="px-8 py-3 rounded-full bg-white/5 hover:bg-white/10 text-white font-medium transition-colors border border-white/10"
                          >
                            Tutup
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="text-center mt-8 mb-12 relative z-10 transition-transform hover:-translate-y-1">
                        <button 
                          onClick={() => setShowAllGallery(true)} 
                          className="px-8 py-3 rounded-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white font-bold transition-all shadow-lg shadow-primary/25"
                        >
                          Lihat Lainnya
                        </button>
                      </div>
                    )}
                  </>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="regular-gallery"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {filteredItems.map(renderRegularItem)}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Modal Preview */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-2 md:p-6 bg-black/95 backdrop-blur-md"
            onClick={() => setSelectedItem(null)}
          >
            <button 
              className="absolute top-4 right-4 md:top-6 md:right-6 z-50 text-white/50 hover:text-white bg-black/50 hover:bg-black/80 rounded-full p-2 backdrop-blur-sm transition-all"
              onClick={() => setSelectedItem(null)}
            >
              <X size={28} />
            </button>
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="relative w-full h-full max-w-[1400px] max-h-[90vh] flex flex-col glass-card rounded-2xl overflow-hidden shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              {/* Media Container - Takes up maximum available space */}
              <div className="flex-1 relative w-full h-full min-h-0 bg-black/80 flex items-center justify-center overflow-hidden">
                {selectedItem.type === 'image' && (
                  <>
                    <img 
                      src={selectedItem.url} 
                      alt={selectedItem.title}
                      className="w-full h-full object-contain no-drag"
                      referrerPolicy="no-referrer"
                    />
                    <div className="image-overlay"></div>
                  </>
                )}
                {selectedItem.type === 'video' && (
                  <video 
                    src={selectedItem.url} 
                    controls 
                    autoPlay
                    controlsList="nodownload"
                    className="w-full h-full object-contain"
                  />
                )}
                {selectedItem.type === 'document' && (
                  <iframe 
                    src={`${selectedItem.url}#toolbar=0`} 
                    className="w-full h-full"
                    title={selectedItem.title}
                  />
                )}
              </div>
              
              {/* Info Bar - Compact at the bottom */}
              <div className="shrink-0 p-4 md:p-6 bg-[#0a0a0a]/90 backdrop-blur-xl border-t border-white/10 no-select">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-xl md:text-2xl font-bold text-white">{selectedItem.title}</h3>
                      <span className="px-2.5 py-1 bg-primary/20 border border-primary/30 text-primary text-[10px] uppercase tracking-wider font-bold rounded-full whitespace-nowrap">
                        {selectedItem.category}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400 line-clamp-2">{selectedItem.description}</p>
                  </div>
                  
                  {/* Optional: Add an external link button if needed in the future */}
                  {selectedItem.type === 'document' ? (
                    <a href={selectedItem.url} target="_blank" rel="noreferrer" download className="shrink-0 flex items-center gap-2 px-6 py-2.5 bg-primary hover:bg-primary/90 rounded-lg text-sm font-bold text-white transition-colors shadow-lg shadow-primary/20">
                      <Download size={18} /> Download File
                    </a>
                  ) : (
                    <a href={selectedItem.url} target="_blank" rel="noreferrer" className="shrink-0 flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-colors">
                      <ExternalLink size={16} /> Buka Penuh
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

const Contact = () => {
  const handleSend = (type: 'wa' | 'email') => {
    const form = document.getElementById('contact-form') as HTMLFormElement;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const formData = new FormData(form);
    const name = formData.get('name');
    const email = formData.get('email');
    const phone = formData.get('phone');
    const services = formData.getAll('services[]');
    const purpose = formData.get('purpose');
    const message = formData.get('message');

    const text = `Halo NaufalStudio, saya ${name}.
Email: ${email}
Telepon: ${phone || '-'}
Layanan: ${services.length > 0 ? services.join(', ') : '-'}
Tujuan: ${purpose}

Pesan:
${message}`;

    if (type === 'wa') {
      const encodedText = encodeURIComponent(text);
      window.open(`https://wa.me/6283196501962?text=${encodedText}`, '_blank');
    } else {
      const encodedText = encodeURIComponent(text);
      const encodedSubject = encodeURIComponent(`Inquiry dari ${name} - ${purpose}`);
      const mailtoLink = `mailto:naufalmushaddiq@gmail.com?subject=${encodedSubject}&body=${encodedText}`;
      window.location.href = mailtoLink;
    }
  };

  return (
    <section id="contact" className="py-20 px-4 no-select">
      <div className="max-w-3xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-4">Hubungi <span className="text-primary">Saya</span></h2>
          <p className="text-gray-400">Mari diskusikan project kreatif Anda bersama NaufalStudio.</p>
        </motion.div>

        <motion.form 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
          id="contact-form"
          className="glass-card p-8 rounded-2xl space-y-6"
          onSubmit={(e) => e.preventDefault()}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Nama Lengkap</label>
              <input 
                type="text" 
                name="name" 
                required 
                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                placeholder="John Doe"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Email</label>
              <input 
                type="email" 
                name="email" 
                required 
                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                placeholder="john@example.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Nomor Telepon (Opsional)</label>
            <input 
              type="tel" 
              name="phone" 
              className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
              placeholder="+62 812 3456 7890"
            />
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-300">Pilihan Layanan</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['Masalah', 'Jasa Desain', 'Edit Video', 'Lainnya'].map(option => (
                <label key={option} className="flex items-center space-x-2 cursor-pointer">
                  <input type="checkbox" name="services[]" value={option} className="rounded border-white/10 bg-black/50 text-primary focus:ring-primary" />
                  <span className="text-sm text-gray-400">{option}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Tujuan Pengajuan</label>
            <select name="purpose" className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors appearance-none">
              <option value="freelance">Project Freelance</option>
              <option value="fulltime">Tawaran Full-time</option>
              <option value="collaboration">Kolaborasi</option>
              <option value="other">Lainnya</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Pesan</label>
            <textarea 
              name="message" 
              required 
              rows={5}
              className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors resize-none"
              placeholder="Ceritakan detail project Anda..."
            ></textarea>
          </div>

          <label className="flex items-start space-x-3 cursor-pointer">
            <input type="checkbox" name="agreement" required className="mt-1 rounded border-white/10 bg-black/50 text-primary focus:ring-primary" />
            <span className="text-sm text-gray-400">Saya setuju bahwa data yang dikirimkan akan digunakan untuk keperluan komunikasi project.</span>
          </label>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button 
              type="button"
              onClick={() => handleSend('wa')}
              className="flex-1 bg-[#25D366] hover:bg-[#128C7E] text-white font-medium py-3 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg shadow-[#25D366]/20"
            >
              Kirim ke WhatsApp
            </button>
            <button 
              type="button"
              onClick={() => handleSend('email')}
              className="flex-1 bg-primary hover:bg-primary/90 text-white font-medium py-3 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
            >
              Kirim via Email
            </button>
          </div>
        </motion.form>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="border-t border-white/10 bg-[#050505] pt-16 pb-8 no-select">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <div>
            <h3 className="text-2xl font-bold mb-4">Naufal<span className="text-primary">Studio</span></h3>
            <p className="text-gray-400 text-sm">
              Visual Artist & Graphic Designer. Menerima jasa pembuatan desain, ilustrasi, dan editing video profesional.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Navigasi</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><a href="#home" className="hover:text-primary transition-colors">Home</a></li>
              <li><a href="#about" className="hover:text-primary transition-colors">About</a></li>
              <li><a href="#gallery" className="hover:text-primary transition-colors">Gallery</a></li>
              <li><a href="#contact" className="hover:text-primary transition-colors">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Social Media</h4>
            <div className="flex flex-wrap gap-3">
              {portfolioData.socials.map(social => {
                const IconComponent = (Icons as any)[social.icon] || Icons.Link;
                return (
                  <a 
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white transition-all"
                    title={social.name}
                  >
                    <IconComponent size={18} />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 pt-8 text-center text-sm text-gray-500">
          <p>Copyright © {new Date().getFullYear()} NaufalStudio. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default function App() {
  useSecurity();

  return (
    <div className="min-h-screen text-white selection:bg-primary/30">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Certificates />
        <Gallery />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
