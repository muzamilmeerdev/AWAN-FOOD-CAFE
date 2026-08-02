import { useState, useEffect, useRef } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────
interface MenuItem {
  id: number
  name: string
  category: string
  price: number
  image: string
  description: string
  badge?: string
  spicy?: boolean
  rating: number
  sold: number
}
interface CartItem { item: MenuItem; qty: number }
interface OrderForm { name: string; phone: string; address: string; notes: string }

// ─── Data ─────────────────────────────────────────────────────────────────────
const CATEGORIES = ['All', 'Rice', 'Noodles & Soup', 'Snacks', 'Drinks', 'Dessert']

const MENU: MenuItem[] = [
  {
    id: 1, name: 'Awan Special Fried Rice', category: 'Rice', price: 350,
    image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=500&h=380&fit=crop&auto=format',
    description: 'Fried rice with sunny-side-up egg, shredded chicken, and our signature Awan chili sambal.',
    badge: 'Best Seller', spicy: true, rating: 4.9, sold: 1240,
  },
  {
    id: 2, name: 'Beef Rendang Rice', category: 'Rice', price: 450,
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&h=380&fit=crop&auto=format',
    description: 'Tender beef slow-cooked for 4 hours in 30+ aromatic spices. Rich, deep, and incredibly satisfying.',
    badge: 'Premium', rating: 4.8, sold: 820,
  },
  {
    id: 3, name: 'Honey Glazed Grilled Chicken', category: 'Rice', price:200,
    image: 'https://images.unsplash.com/photo-1529042410759-befb1204b468?w=500&h=380&fit=crop&auto=format',
    description: 'Free-range chicken grilled with honey and sweet soy glaze. Fragrant aroma, perfect caramelized crust.',
    rating: 4.7, sold: 630,
  },
  {
    id: 4, name: 'Jumbo Fried Noodles', category: 'Noodles & Soup', price: 300,
    image: 'https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=500&h=380&fit=crop&auto=format',
    description: 'Extra-large portion of wok-fried noodles with meatballs, egg, and fresh vegetables. Built for big appetites.',
    badge: 'Best Seller', spicy: true, rating: 4.8, sold: 980,
  },
  {
    id: 5, name: 'Beef Meatball Soup', category: 'Noodles & Soup', price:150 ,
    image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=500&h=380&fit=crop&auto=format',
    description: 'Authentic beef meatballs in a clear savory broth with noodles and fresh garnish. Comforting and hearty.',
    rating: 4.6, sold: 750,
  },
  {
    id: 6, name: 'Chicken Noodle Soup', category: 'Noodles & Soup', price: 360,
    image: 'https://images.unsplash.com/photo-1555126634-323283e090fa?w=500&h=380&fit=crop&auto=format',
    description: 'Classic golden chicken soup with shredded chicken, soft noodles, and crispy shallots on top.',
    badge: 'New', rating: 4.7, sold: 410,
  },
  {
    id: 7, name: 'Crispy Mix Fritters', category: 'Snacks', price: 420,
    image: 'https://images.unsplash.com/photo-1541519227354-08fa5d50c820?w=500&h=380&fit=crop&auto=format',
    description: 'Mix of corn fritters, stuffed tofu, and extra-crispy tempeh. Perfect companion for your coffee.',
    spicy: true, rating: 4.5, sold: 1100,
  },
  {
    id: 8, name: 'Chicken Mayo Rolls', category: 'Snacks', price: 180,
    image: 'https://images.unsplash.com/photo-1618679683071-e9b9cc06c94b?w=500&h=380&fit=crop&auto=format',
    description: 'Golden-fried rolls stuffed with creamy chicken ragout and drizzled with our special mayonnaise sauce.',
    badge: 'Favorite', rating: 4.8, sold: 560,
  },
  {
    id: 9, name: 'Awan Cloud Coffee', category: 'Drinks', price: 100,
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500&h=380&fit=crop&auto=format',
    description: 'Robusta espresso over fresh milk, palm sugar syrup, and crystal clear ice. Our most iconic drink.',
    badge: 'Signature', rating: 4.9, sold: 2100,
  },
  {
    id: 10, name: 'Jumbo Sweet Iced Tea', category: 'Drinks', price: 80,
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500&h=380&fit=crop&auto=format',
    description: 'Premium loose-leaf tea sweetened with rock sugar, served ice-cold in a large glass. Pure refreshment.',
    rating: 4.5, sold: 1800,
  },
  {
    id: 11, name: 'Creamy Avocado Shake', category: 'Drinks', price: 200,
    image: 'https://images.unsplash.com/photo-1638805981949-36b2e2c0cde3?w=500&h=380&fit=crop&auto=format',
    description: 'Premium avocado blended with condensed milk and fine-shaved ice. Thick, velvety, and delightful.',
    badge: 'New', rating: 4.7, sold: 340,
  },
  {
    id: 12, name: 'Special Mixed Ice', category: 'Dessert', price: 170,
    image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=500&h=380&fit=crop&auto=format',
    description: 'Refreshing bowl of grass jelly, coconut jelly, nata de coco, and red syrup over shaved ice.',
    rating: 4.6, sold: 490,
  },
  {
    id: 13, name: 'Moist Chocolate Pudding', category: 'Dessert', price: 160,
    image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=500&h=380&fit=crop&auto=format',
    description: 'Silky chocolate pudding with warm caramel sauce and a sprinkle of toasted almonds.',
    rating: 4.7, sold: 370,
  },
]

const REVIEWS = [
  { id: 1, name: 'irfan', rating: 5, date: '2 days ago', text: 'The Awan Special Fried Rice is absolutely incredible! Generous portions, perfect seasoning, and the staff is super friendly. It\'s become our family\'s weekly ritual!', avatar: 'ST', color: 'bg-rose-500', item: 'Awan Special Fried Rice' },
  { id: 2, name: 'jameel lali', rating: 5, date: '5 days ago', text: 'Awan Cloud Coffee is a game-changer. Perfect sweetness, bold but smooth coffee flavor. I stop here every morning — it\'s become part of my daily routine.', avatar: 'JC', color: 'bg-blue-500', item: 'Awan Cloud Coffee' },
  { id: 3, name: 'javid ahmad', rating: 5, date: '1 week ago', text: 'The Beef Rendang is fall-apart tender with spices soaked all the way through. Hands down the best rendang I\'ve had outside of Padang. Highly recommended!', avatar: 'PS', color: 'bg-violet-500', item: 'Beef Rendang Rice' },
  { id: 4, name: 'altaf ahmad ', rating: 4, date: '1 week ago', text: 'The Jumbo Fried Noodles is genuinely JUMBO haha. You\'ll be full for hours and the flavor is spot on. Amazing value for the portion size!', avatar: 'MT', color: 'bg-emerald-500', item: 'Jumbo Fried Noodles' },
  { id: 5, name: 'saleem ahmad', rating: 5, date: '2 weeks ago', text: 'Ordering via WhatsApp is incredibly easy and they respond so fast. Food arrived hot and perfectly packed. The Chicken Mayo Rolls are my obsession!', avatar: 'EW', color: 'bg-amber-500', item: 'Chicken Mayo Rolls' },
  { id: 6, name: 'suhail awan', rating: 5, date: '2 weeks ago', text: 'Clean restaurant, huge menu variety, and most importantly — everything tastes AMAZING. The Chicken Noodle Soup is addictive. You must try it!', avatar: 'DM', color: 'bg-sky-500', item: 'Chicken Noodle Soup' },
]

const BADGE_STYLE: Record<string, string> = {
  'Best Seller': 'bg-amber-500 text-white',
  'Premium': 'bg-violet-600 text-white',
  'New': 'bg-emerald-500 text-white',
  'Favorite': 'bg-rose-500 text-white',
  'Signature': 'bg-sky-600 text-white',
}

const WA_NUMBER = '919103594759'

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (n: number) => '₹' + n.toLocaleString('en-IN')

function Stars({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'md' }) {
  const sz = size === 'md' ? 'w-5 h-5' : 'w-3.5 h-3.5'
  return (
    <span className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <svg key={i} viewBox="0 0 20 20" className={`${sz} ${i <= Math.round(rating) ? 'fill-amber-400' : 'fill-gray-300 dark:fill-gray-700'}`}>
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </span>
  )
}

function WAIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className ?? 'w-6 h-6 fill-white'}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [dark, setDark] = useState(false)
  const [cart, setCart] = useState<CartItem[]>([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [cartOpen, setCartOpen] = useState(false)
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [form, setForm] = useState<OrderForm>({ name: '', phone: '', address: '', notes: '' })
  const [orderSent, setOrderSent] = useState(false)
  const [menuVisible, setMenuVisible] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
  }, [dark])

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setMenuVisible(true) }, { threshold: 0.1 })
    if (menuRef.current) obs.observe(menuRef.current)
    return () => obs.disconnect()
  }, [])

  const totalQty = cart.reduce((s, c) => s + c.qty, 0)
  const totalPrice = cart.reduce((s, c) => s + c.item.price * c.qty, 0)

  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const found = prev.find(c => c.item.id === item.id)
      if (found) return prev.map(c => c.item.id === item.id ? { ...c, qty: c.qty + 1 } : c)
      return [...prev, { item, qty: 1 }]
    })
  }

  const changeQty = (id: number, delta: number) => {
    setCart(prev =>
      prev.map(c => c.item.id === id ? { ...c, qty: Math.max(0, c.qty + delta) } : c)
        .filter(c => c.qty > 0)
    )
  }

  const filtered = MENU.filter(m => {
    const bycat = category === 'All' || m.category === category
    const bysearch = m.name.toLowerCase().includes(search.toLowerCase()) || m.description.toLowerCase().includes(search.toLowerCase())
    return bycat && bysearch
  })

  const sendToWhatsApp = () => {
    const lines = cart.map(c => `  • ${c.item.name} x${c.qty} = ${fmt(c.item.price * c.qty)}`)
    const msg = [
      '🍽️ *NEW ORDER — AWAN FOOD CAFE*',
      '━━━━━━━━━━━━━━━━━━━━━━',
      `👤 *Name:* ${form.name}`,
      `📞 *Phone:* ${form.phone}`,
      `📍 *Address:* ${form.address}`,
      '━━━━━━━━━━━━━━━━━━━━━━',
      '🛒 *ORDER DETAILS:*',
      ...lines,
      '━━━━━━━━━━━━━━━━━━━━━━',
      `💰 *TOTAL: ${fmt(totalPrice)}*`,
      ...(form.notes ? [`📝 *Special Instructions:* ${form.notes}`] : []),
      '━━━━━━━━━━━━━━━━━━━━━━',
      '✅ Thank you for ordering from Awan Food Cafe!',
      '⏱️ We will confirm your order shortly. Please wait 🙏',
    ].join('\n')
    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank')
    setOrderSent(true)
    setCart([])
  }

  const canOrder = form.name.trim() && form.phone.trim() && form.address.trim()

  return (
    <div className="min-h-screen bg-[#fdf8f0] dark:bg-[#0f0c09] text-[#1a1108] dark:text-[#f5efe6] transition-colors duration-300">

      {/* ── Navbar ─────────────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 bg-[#fdf8f0]/92 dark:bg-[#0f0c09]/92 backdrop-blur-xl border-b border-amber-100 dark:border-amber-900/20 shadow-sm shadow-amber-100/50 dark:shadow-black/30">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-md shadow-amber-300/40 flex-shrink-0">
              <span className="text-lg">☕</span>
            </div>
            <div className="min-w-0">
              <span className="font-black text-base leading-none" style={{ fontFamily: "'Fraunces', serif" }}>
                Awan Food <span className="text-amber-500">Cafe</span>
              </span>
              <p className="text-[10px] text-[#a89078] dark:text-[#6b5040]">🕐 Open 7:00 AM – 10:00 PM</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setDark(d => !d)}
              className="p-2.5 rounded-full hover:bg-amber-100 dark:hover:bg-amber-900/20 transition-colors text-base"
              aria-label="Toggle dark mode"
            >
              {dark ? '☀️' : '🌙'}
            </button>
            <button
              onClick={() => setCartOpen(true)}
              className="relative flex items-center gap-2 px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-full font-semibold text-sm transition-all hover:scale-105 shadow-md shadow-amber-400/30"
            >
              🛒 <span className="hidden sm:inline">Cart</span>
              {totalQty > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-white text-[11px] flex items-center justify-center font-black animate-bounce">
                  {totalQty}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* ── Hero ───────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden" style={{ minHeight: '92vh' }}>
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1600&h=1000&fit=crop&auto=format')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/55 to-[#0f0c09]" />
        <div className="absolute top-20 right-10 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-40 left-10 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-6xl mx-auto px-4 pt-20 pb-36 flex flex-col items-center text-center text-white">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/15 border border-amber-400/40 text-amber-300 text-sm font-medium mb-8 animate-fade-in-up">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            ⭐ Rated 4.8 · 2,000+ Happy Customers · Open Now
          </span>

          <h1
            className="text-5xl sm:text-6xl md:text-7xl font-black leading-[1.05] mb-6 animate-fade-in-up"
            style={{ fontFamily: "'Fraunces', serif", animationDelay: '0.1s', opacity: 0, animationFillMode: 'forwards' }}
          >
            Authentic<br />
            <span className="text-amber-400 italic">Home Flavors</span><br />
            At Your Door
          </h1>

          <p
            className="text-base sm:text-xl text-white/75 max-w-lg mb-10 leading-relaxed animate-fade-in-up"
            style={{ animationDelay: '0.2s', opacity: 0, animationFillMode: 'forwards' }}
          >
            Enjoy the warmth of homemade cooking, crafted fresh every day. Order now via WhatsApp and get it delivered straight to you!
          </p>

          <div
            className="flex flex-col sm:flex-row gap-4 animate-fade-in-up"
            style={{ animationDelay: '0.3s', opacity: 0, animationFillMode: 'forwards' }}
          >
            <a
              href="#menu"
              className="px-8 py-4 bg-amber-500 hover:bg-amber-400 text-black font-black rounded-2xl text-lg transition-all hover:scale-105 shadow-xl shadow-amber-500/35"
            >
              🍽️ View Menu
            </a>
            <a
              href={`https://wa.me/${WA_NUMBER}`}
              target="_blank"
              rel="noreferrer"
              className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/25 text-white font-bold rounded-2xl text-lg transition-all hover:scale-105 flex items-center gap-2.5 justify-center"
            >
              <WAIcon className="w-5 h-5 fill-white" /> Chat on WhatsApp
            </a>
          </div>
        </div>

        {/* Stats band */}
        <div className="relative z-10 max-w-3xl mx-auto px-4 -mt-14">
          <div className="grid grid-cols-3 gap-3 sm:gap-6 bg-white/8 dark:bg-black/30 backdrop-blur-xl border border-white/15 rounded-3xl p-5 sm:p-7 shadow-2xl">
            {[
              { icon: '🍜', val: '50+', label: 'Menu Items' },
              { icon: '👥', val: '2K+', label: 'Happy Customers' },
              { icon: '🏆', val: '5+', label: 'Years Open' },
            ].map(s => (
              <div key={s.label} className="text-center text-white">
                <div className="text-2xl sm:text-3xl mb-1.5">{s.icon}</div>
                <div className="text-2xl sm:text-3xl font-black" style={{ fontFamily: "'Fraunces', serif" }}>{s.val}</div>
                <div className="text-[11px] sm:text-xs text-white/65 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Menu Section ───────────────────────────────────────────────── */}
      <section id="menu" ref={menuRef} className="max-w-6xl mx-auto px-4 py-24">
        <div className="text-center mb-14">
          <span className="text-amber-500 dark:text-amber-400 font-bold text-xs uppercase tracking-[0.2em]">Our Menu</span>
          <h2 className="text-4xl sm:text-5xl font-black mt-2" style={{ fontFamily: "'Fraunces', serif" }}>
            The <span className="text-amber-500 italic">Best Picks</span> For You
          </h2>
          <p className="text-[#6b5040] dark:text-[#a89078] mt-3 max-w-md mx-auto">
            Everything is made fresh daily with carefully selected, high-quality ingredients
          </p>
        </div>

        {/* Search bar */}
        <div className="relative mb-8 max-w-xl mx-auto">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a89078] pointer-events-none text-lg">🔍</span>
          <input
            type="text"
            placeholder="Search your favourite dish..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-12 pr-5 py-4 rounded-2xl bg-white dark:bg-[#1a1610] border border-amber-100 dark:border-amber-900/20 text-[#1a1108] dark:text-[#f5efe6] placeholder:text-[#c9b89e] focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all shadow-sm"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#a89078] hover:text-[#6b5040] dark:hover:text-[#f5efe6] text-lg transition-colors"
            >
              ✕
            </button>
          )}
        </div>

        {/* Category filter */}
        <div className="flex gap-2.5 overflow-x-auto pb-2 mb-10 scrollbar-hide">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`flex-shrink-0 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 ${
                category === cat
                  ? 'bg-amber-500 text-white shadow-lg shadow-amber-400/30 scale-[1.03]'
                  : 'bg-white dark:bg-[#1a1610] text-[#6b5040] dark:text-[#a89078] border border-amber-100 dark:border-amber-900/20 hover:border-amber-400 dark:hover:border-amber-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-24 text-[#a89078]">
            <p className="text-6xl mb-4">🍽️</p>
            <p className="text-xl font-bold mb-1">No items found</p>
            <p className="text-sm">Try a different keyword or category</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((item, idx) => {
  const inCart = cart.find(c => c.item.id === item.id)

  return (
                <div
                  key={item.id}
                  className="group bg-white dark:bg-[#1a1610] rounded-3xl overflow-hidden border border-amber-50 dark:border-amber-900/15 hover:shadow-2xl hover:shadow-amber-200/40 dark:hover:shadow-amber-900/20 transition-all duration-300 hover:-translate-y-1.5"
                  style={menuVisible ? { animation: `fadeInUp 0.5s ease-out ${idx * 0.06}s both` } : { opacity: 0 }}
                >
                  {/* Image */}
                  <div className="relative h-48 bg-amber-100 dark:bg-[#221e17] overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-[1.07] transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    {item.badge && (
                      <span className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wide shadow ${BADGE_STYLE[item.badge] ?? 'bg-gray-600 text-white'}`}>
                        {item.badge}
                      </span>
                    )}
                    {item.spicy && (
                      <span className="absolute top-3 right-3 bg-red-500 text-white px-2 py-0.5 rounded-full text-[11px] font-bold">
                        🌶️ Spicy
                      </span>
                    )}
                    <div className="absolute bottom-3 right-3 bg-black/50 backdrop-blur-sm text-white text-[11px] font-medium px-2 py-0.5 rounded-full">
                      🔥 {item.sold.toLocaleString()} sold
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="font-black text-[15px] leading-snug mb-1.5">{item.name}</h3>
                    <div className="flex items-center gap-1.5 mb-2.5">
                      <Stars rating={item.rating} />
                      <span className="text-xs font-bold text-amber-600 dark:text-amber-400">{item.rating}</span>
                    </div>
                    <p className="text-sm text-[#6b5040] dark:text-[#a89078] mb-5 line-clamp-2 leading-relaxed">{item.description}</p>

                    <div className="flex items-center justify-between gap-3">
                      <span className="text-xl font-black text-amber-600 dark:text-amber-400 leading-none" style={{ fontFamily: "'Fraunces', serif" }}>
                        {fmt(item.price)}
                      </span>
                      {inCart ? (
                        <div className="flex items-center gap-1.5 bg-amber-50 dark:bg-amber-900/15 rounded-full px-2 py-1 border border-amber-100 dark:border-amber-800/30">
                          <button
                            onClick={() => changeQty(item.id, -1)}
                            className="w-7 h-7 rounded-full bg-amber-500 hover:bg-amber-600 text-white flex items-center justify-center font-black text-base transition-colors"
                          >−</button>
                          <span className="w-5 text-center font-black text-sm tabular-nums">{inCart.qty}</span>
                          <button
                            onClick={() => changeQty(item.id, 1)}
                            className="w-7 h-7 rounded-full bg-amber-500 hover:bg-amber-600 text-white flex items-center justify-center font-black text-base transition-colors"
                          >+</button>
                        </div>
                      ) : (
                        <button
                          onClick={() => addToCart(item)}
                          className="px-4 py-2 bg-amber-500 hover:bg-amber-600 active:scale-95 text-white text-sm font-bold rounded-full transition-all hover:scale-105 shadow-md shadow-amber-400/25"
                        >
                          + Add
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>

      {/* ── Reviews ────────────────────────────────────────────────────── */}
      <section className="bg-[#1c1814] dark:bg-[#0d0b08] py-24">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-14">
            <span className="text-amber-500 font-bold text-xs uppercase tracking-[0.2em]">Testimonials</span>
            <h2 className="text-4xl sm:text-5xl font-black text-[#f5efe6] mt-2" style={{ fontFamily: "'Fraunces', serif" }}>
              What Our <span className="text-amber-400 italic">Customers</span> Say
            </h2>
            <div className="flex items-center justify-center gap-2.5 mt-4">
              <Stars rating={4.8} size="md" />
              <span className="text-amber-400 font-black text-xl">4.8</span>
              <span className="text-[#a89078] text-sm">from 2,400+ reviews</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {REVIEWS.map(r => (
              <div
                key={r.id}
                className="bg-[#221e18] rounded-3xl p-6 border border-amber-900/15 hover:border-amber-700/30 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex items-start gap-3 mb-4">
                  <div className={`w-11 h-11 rounded-full ${r.color} flex items-center justify-center text-white font-black text-sm flex-shrink-0 shadow-lg`}>
                    {r.avatar}
                  </div>
                  <div>
                    <p className="font-bold text-[#f5efe6] text-sm">{r.name}</p>
                    <p className="text-xs text-[#a89078]">{r.date}</p>
                  </div>
                  <div className="ml-auto">
                    <Stars rating={r.rating} />
                  </div>
                </div>
                <p className="text-[#c9b89e] text-sm leading-relaxed mb-4">"{r.text}"</p>
                <div className="pt-3 border-t border-amber-900/20">
                  <p className="text-xs text-amber-500 font-semibold">🍽️ {r.item}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Map & Info ─────────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 py-24">
        <div className="text-center mb-12">
          <span className="text-amber-500 dark:text-amber-400 font-bold text-xs uppercase tracking-[0.2em]">Find Us</span>
          <h2 className="text-4xl sm:text-5xl font-black mt-2" style={{ fontFamily: "'Fraunces', serif" }}>
            Visit <span className="text-amber-500 italic">Our Cafe</span>
          </h2>
          <p className="text-[#6b5040] dark:text-[#a89078] mt-3">Bandipora main Market </p>
        </div>

        <div className="rounded-3xl overflow-hidden border border-amber-100 dark:border-amber-900/20 shadow-xl mb-8" style={{ height: 400 }}>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m16!1m12!1m3!1d52686.024486329676!2d74.61124260392303!3d34.37906044684037!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!2m1!1sbandipora%20main%20market!5e0!3m2!1sen!2sin!4v1785598737334!5m2!1sen!2sin"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Awan Food Cafe Location"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {[
            { icon: '📍', label: 'Address', value: 'Bandipora main Market' },
            { icon: '📞', label: 'Phone / WhatsApp', value: '+919103594759' },
            { icon: '🕐', label: 'Opening Hours', value: 'Monday – Sunday\n9:00 AM – 10:00 PM' },
          ].map(info => (
            <div key={info.label} className="flex items-start gap-4 p-5 bg-white dark:bg-[#1a1610] rounded-2xl border border-amber-50 dark:border-amber-900/15 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-900/15 flex items-center justify-center text-2xl flex-shrink-0">
                {info.icon}
              </div>
              <div>
                <p className="text-[10px] font-black text-amber-600 dark:text-amber-400 uppercase tracking-widest mb-1">{info.label}</p>
                <p className="text-sm leading-relaxed whitespace-pre-line font-medium">{info.value}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────────────── */}
      <footer className="bg-[#1c1814] py-14">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-xl shadow-lg">☕</div>
            <span className="text-2xl font-black text-[#f5efe6]" style={{ fontFamily: "'Fraunces', serif" }}>Awan Food Cafe</span>
          </div>
          <p className="text-[#a89078] text-sm mb-8 max-w-xs mx-auto leading-relaxed">
            Warm, authentic home flavors that delight every palate — since 2019.
          </p>
          <div className="flex justify-center gap-3 mb-10">
            <a
              href={`https://wa.me/${WA_NUMBER}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2.5 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-full transition-all hover:scale-105 text-sm shadow-lg shadow-emerald-500/30"
            >
              <WAIcon className="w-4 h-4 fill-white" /> WhatsApp
            </a>
            <a
              href="tel:+919103594759"
              className="flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-black font-bold rounded-full transition-all hover:scale-105 text-sm shadow-lg shadow-amber-500/30"
            >
              📞 Call Us
            </a>
          </div>
          <div className="border-t border-amber-900/20 pt-6">
            <p className="text-[#6b5040] text-xs">© 2024 Awan Food Cafe. Made with ❤️ in india</p>
          </div>
        </div>
      </footer>

      {/* ── Floating WhatsApp ───────────────────────────────────────────── */}
      <a
        href={`https://wa.me/${WA_NUMBER}`}
        target="_blank"
        rel="noreferrer"
        aria-label="Chat on WhatsApp"
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-full shadow-2xl shadow-emerald-500/40 transition-all hover:scale-110"
        style={{ padding: '14px 20px 14px 16px' }}
      >
        <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-30 pointer-events-none" />
        <WAIcon className="w-6 h-6 fill-white relative z-10" />
        <span className="relative z-10 text-sm hidden sm:inline">Order Now</span>
      </a>

      {/* ── Cart Drawer ─────────────────────────────────────────────────── */}
      {cartOpen && (
        <>
          <div className="fixed inset-0 z-50 bg-black/55 backdrop-blur-sm" onClick={() => setCartOpen(false)} />
          <div className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-[#fdf8f0] dark:bg-[#1a1610] shadow-2xl flex flex-col animate-slide-in-right">
            <div className="flex items-center justify-between px-5 py-4 border-b border-amber-100 dark:border-amber-900/20">
              <h2 className="text-xl font-black" style={{ fontFamily: "'Fraunces', serif" }}>
                🛒 Your Cart
                {totalQty > 0 && <span className="ml-2 text-base font-black text-amber-500">({totalQty})</span>}
              </h2>
              <button
                onClick={() => setCartOpen(false)}
                className="w-9 h-9 rounded-full hover:bg-amber-100 dark:hover:bg-amber-900/20 flex items-center justify-center text-sm font-bold transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-3">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-[#a89078] py-20">
                  <p className="text-6xl mb-4 animate-float">🛒</p>
                  <p className="font-bold text-lg">Your cart is empty</p>
                  <p className="text-sm mt-1">Add your favourite items to get started!</p>
                  <button
                    onClick={() => setCartOpen(false)}
                    className="mt-6 px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-full transition-all text-sm"
                  >
                    Browse Menu
                  </button>
                </div>
              ) : (
                cart.map(c => (
                  <div key={c.item.id} className="flex gap-3 bg-white dark:bg-[#221e17] rounded-2xl p-3.5 border border-amber-50 dark:border-amber-900/15">
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-amber-100 dark:bg-amber-900/20 flex-shrink-0">
                      <img src={c.item.image} alt={c.item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm leading-snug line-clamp-1 mb-0.5">{c.item.name}</p>
                      <p className="text-amber-600 dark:text-amber-400 font-black text-sm">{fmt(c.item.price)}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <button onClick={() => changeQty(c.item.id, -1)} className="w-7 h-7 rounded-full bg-amber-500 hover:bg-amber-600 text-white flex items-center justify-center font-black transition-colors">−</button>
                        <span className="w-6 text-center font-black text-sm tabular-nums">{c.qty}</span>
                        <button onClick={() => changeQty(c.item.id, 1)} className="w-7 h-7 rounded-full bg-amber-500 hover:bg-amber-600 text-white flex items-center justify-center font-black transition-colors">+</button>
                        <span className="ml-auto text-sm font-bold text-[#6b5040] dark:text-[#a89078]">{fmt(c.item.price * c.qty)}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-5 border-t border-amber-100 dark:border-amber-900/20 bg-white/50 dark:bg-black/20">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-[#6b5040] dark:text-[#a89078]">{totalQty} item{totalQty !== 1 ? 's' : ''}</span>
                  <span className="text-2xl font-black text-amber-600 dark:text-amber-400" style={{ fontFamily: "'Fraunces', serif" }}>{fmt(totalPrice)}</span>
                </div>
                <p className="text-xs text-[#a89078] mb-4">Delivery fee not included</p>
                <button
                  onClick={() => { setCartOpen(false); setCheckoutOpen(true) }}
                  className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-black rounded-2xl text-base transition-all hover:scale-[1.02] shadow-xl shadow-emerald-500/30 flex items-center justify-center gap-2.5"
                >
                  <WAIcon className="w-5 h-5 fill-white" />
                  Place Order via WhatsApp
                </button>
              </div>
            )}
          </div>
        </>
      )}

      {/* ── Checkout Modal ──────────────────────────────────────────────── */}
      {checkoutOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
          onClick={e => { if (e.target === e.currentTarget) setCheckoutOpen(false) }}
        >
          <div className="bg-[#fdf8f0] dark:bg-[#1a1610] w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[92vh] overflow-y-auto animate-scale-in">
            {!orderSent ? (
              <>
                <div className="sticky top-0 bg-[#fdf8f0] dark:bg-[#1a1610] flex items-center justify-between px-5 py-4 border-b border-amber-100 dark:border-amber-900/20 rounded-t-3xl sm:rounded-t-3xl">
                  <h2 className="text-xl font-black" style={{ fontFamily: "'Fraunces', serif" }}>📝 Order Details</h2>
                  <button
                    onClick={() => setCheckoutOpen(false)}
                    className="w-9 h-9 rounded-full hover:bg-amber-100 dark:hover:bg-amber-900/20 flex items-center justify-center text-sm font-bold transition-colors"
                  >✕</button>
                </div>

                <div className="p-5 space-y-5">
                  {/* Order summary */}
                  <div className="bg-amber-50 dark:bg-amber-900/10 rounded-2xl p-4 border border-amber-100 dark:border-amber-800/20">
                    <p className="text-xs font-black text-amber-700 dark:text-amber-400 uppercase tracking-widest mb-3">Order Summary</p>
                    <div className="space-y-2">
                      {cart.map(c => (
                        <div key={c.item.id} className="flex justify-between items-center text-sm">
                          <span className="text-[#1a1108] dark:text-[#f5efe6]">{c.item.name} <span className="text-[#a89078]">×{c.qty}</span></span>
                          <span className="font-bold text-amber-700 dark:text-amber-400 tabular-nums">{fmt(c.item.price * c.qty)}</span>
                        </div>
                      ))}
                    </div>
                    <div className="border-t border-amber-200 dark:border-amber-800/40 mt-3 pt-3 flex justify-between items-center">
                      <span className="font-black">Total</span>
                      <span className="text-lg font-black text-amber-600 dark:text-amber-400 tabular-nums">{fmt(totalPrice)}</span>
                    </div>
                  </div>

                  {/* Form fields */}
                  {[
                    { key: 'name', label: 'Full Name', placeholder: 'Enter your full name', type: 'text', icon: '👤', required: true },
                    { key: 'phone', label: 'Phone / WhatsApp Number', placeholder: '08xx-xxxx-xxxx', type: 'tel', icon: '📞', required: true },
                    { key: 'address', label: 'Delivery Address', placeholder: 'Street, House No., City', type: 'text', icon: '📍', required: true },
                  ].map(f => (
                    <div key={f.key}>
                      <label className="block text-sm font-bold mb-1.5">
                        {f.icon} {f.label}
                        {f.required && <span className="text-red-500 ml-1">*</span>}
                      </label>
                      <input
                        type={f.type}
                        placeholder={f.placeholder}
                        value={form[f.key as keyof OrderForm]}
                        onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                        className="w-full px-4 py-3.5 rounded-xl bg-white dark:bg-[#221e17] border border-amber-100 dark:border-amber-900/20 focus:outline-none focus:ring-2 focus:ring-amber-400 dark:focus:ring-amber-500 text-[#1a1108] dark:text-[#f5efe6] placeholder:text-[#c9b89e] transition-all text-sm"
                      />
                    </div>
                  ))}

                  <div>
                    <label className="block text-sm font-bold mb-1.5">
                      📝 Special Instructions <span className="text-[#a89078] font-normal">(optional)</span>
                    </label>
                    <textarea
                      placeholder="e.g. no spice, extra rice, no onions..."
                      value={form.notes}
                      onChange={e => setForm(prev => ({ ...prev, notes: e.target.value }))}
                      rows={3}
                      className="w-full px-4 py-3.5 rounded-xl bg-white dark:bg-[#221e17] border border-amber-100 dark:border-amber-900/20 focus:outline-none focus:ring-2 focus:ring-amber-400 dark:focus:ring-amber-500 text-[#1a1108] dark:text-[#f5efe6] placeholder:text-[#c9b89e] transition-all resize-none text-sm"
                    />
                  </div>

                  <button
                    onClick={sendToWhatsApp}
                    disabled={!canOrder}
                    className={`w-full py-4 font-black rounded-2xl text-base transition-all flex items-center justify-center gap-3 shadow-xl ${
                      canOrder
                        ? 'bg-emerald-500 hover:bg-emerald-600 text-white hover:scale-[1.02] shadow-emerald-500/30 cursor-pointer'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    <WAIcon className="w-5 h-5 fill-current" />
                    Send Order via WhatsApp
                  </button>

                  {!canOrder && (
                    <p className="text-center text-xs text-[#a89078]">Please fill in your name, phone number, and address to continue</p>
                  )}
                  <p className="text-center text-xs text-[#a89078]">
                    You will be redirected to WhatsApp to confirm your order
                  </p>
                </div>
              </>
            ) : (
              <div className="p-12 text-center">
                <div className="text-7xl mb-5 animate-float inline-block">🎉</div>
                <h2 className="text-3xl font-black mb-3" style={{ fontFamily: "'Fraunces', serif" }}>Order Sent!</h2>
                <p className="text-[#6b5040] dark:text-[#a89078] mb-2 leading-relaxed">
                  Your order has been sent to our WhatsApp.
                </p>
                <p className="text-[#6b5040] dark:text-[#a89078] text-sm mb-8">
                  Our team will confirm and process your order shortly. Thank you! 🙏
                </p>
                <button
                  onClick={() => { setCheckoutOpen(false); setOrderSent(false); setForm({ name: '', phone: '', address: '', notes: '' }) }}
                  className="px-8 py-3.5 bg-amber-500 hover:bg-amber-600 text-black font-black rounded-2xl transition-all hover:scale-105 text-sm shadow-lg shadow-amber-400/30"
                >
                  🍽️ Order Again
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
