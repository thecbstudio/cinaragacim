/* ============================================================
   ÇINAR AĞACIM — script.js
   Elif Tunceroğlu · Keller Williams
   Interactive functionality:
   - Navbar scroll + mobile menu
   - Scroll reveal animations
   - Property grid + filtering + add-property CMS
   - Testimonials slider
   - Appointment + Contact form validation
   - Property detail modal
   - TR / EN i18n toggle (localStorage)
   - Footer year
   ============================================================ */

'use strict';

/* ── 0. Global language state (must be before renderGrid call) ─ */
let currentLang = localStorage.getItem('cinarLang') || 'tr';

/* ── 1. Navbar ───────────────────────────────────────────────── */
(function initNavbar() {
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');
  const links     = navLinks.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
    highlightActiveLink();
  }, { passive: true });

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });

  links.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });

  function highlightActiveLink() {
    const sections = ['hero','about','services','why-me','portfolio','appointment','testimonials','certificates','blog','contact'];
    let current = 'hero';
    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el && window.scrollY >= el.offsetTop - 200) current = id;
    });
    links.forEach(link => {
      const href = link.getAttribute('href').replace('#','');
      link.classList.toggle('active', href === current);
    });
  }
})();

/* ── 2. Scroll reveal (IntersectionObserver) ─────────────────── */
(function initReveal() {
  const targets = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
  if (!window.IntersectionObserver) {
    targets.forEach(el => el.classList.add('in-view'));
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  targets.forEach(el => observer.observe(el));
})();

/* ── 3. Properties Data & Grid ───────────────────────────────── */
let properties = [
  {
    id: 1,
    type: 'villa',
    title: 'Belek Satılık İkiz Villalar',
    title_en: 'Twin Villas for Sale in Belek',
    location: 'Belek, Antalya',
    price: 'Fiyat Sorunuz',
    price_en: 'Ask for Price',
    size: '220 m²',
    image: 'portfoy/1-belek-villa.jpg',
    desc: '330 m² arsada, 2 katlı, 220 m² modern ikiz villalar. Özel havuzlu, Belek\'in en gözde lokasyonunda.',
    desc_en: 'Modern twin villas on 330 m² plot, 2-storey, 220 m² each. Private pool in Belek\'s prime location.'
  },
  {
    id: 2,
    type: 'apartment',
    title: 'Aksu Altıntaş Satılık Proje',
    title_en: 'New Project for Sale in Aksu Altıntaş',
    location: 'Aksu, Altıntaş, Antalya',
    price: 'Fiyat Sorunuz',
    price_en: 'Ask for Price',
    size: '2+1',
    image: 'portfoy/2-aksu-proje.jpg',
    desc: 'Aksu Altıntaş bölgesinde satılık 2+1 daireler ve villalar. Krediye uygun, havuzlu site projesi.',
    desc_en: '2+1 apartments and villas for sale in Aksu Altıntaş. Eligible for bank loan, gated complex with pool.'
  },
  {
    id: 3,
    type: 'hotel',
    title: 'Kaleiçi Satılık Butik Otel + 2 Dükkan',
    title_en: 'Boutique Hotel + 2 Shops for Sale in Kaleiçi',
    location: 'Kaleiçi, Antalya',
    price: 'Fiyat Sorunuz',
    price_en: 'Ask for Price',
    size: 'Otel + 2 Dükkan',
    image: 'portfoy/3-kaleici-otel.jpg',
    desc: 'Antalya Kale içinde satılık butik otel ve 2 dükkan. Tarihi dokuda yatırım fırsatı.',
    desc_en: 'Boutique hotel and 2 shops for sale inside Antalya Castle. Investment opportunity in historic district.'
  },
  {
    id: 4,
    type: 'villa',
    title: 'Konyaaltı Hisarçandır Lüks Villa',
    title_en: 'Luxury Villa in Konyaaltı Hisarçandır',
    location: 'Hisarçandır, Konyaaltı, Antalya',
    price: 'Fiyat Sorunuz',
    price_en: 'Ask for Price',
    size: '1000 m²',
    image: 'portfoy/4-hisarcandir-luks-villa.jpg',
    desc: 'Orman içinde, 2560 m² parselde, 11+7 odalı, 1000 m² lüks villa. Özel havuz, bahçe, garaj, Antalya manzaralı.',
    desc_en: 'Luxury villa in the forest, 2560 m² plot, 11+7 rooms, 1000 m². Private pool, garden, garage, Antalya views.'
  },
  {
    id: 5,
    type: 'hotel',
    title: 'Alanya Kalesinde Satılık Butik Otel',
    title_en: 'Boutique Hotel for Sale in Alanya Castle',
    location: 'Alanya Kalesi, Antalya',
    price: 'Fiyat Sorunuz',
    price_en: 'Ask for Price',
    size: 'Butik Otel',
    image: 'portfoy/5-alanya-otel.jpg',
    desc: 'Alanya Kalesinde deniz manzaralı, tarihi ve doğal atmosferde satılık butik otel.',
    desc_en: 'Boutique hotel for sale in Alanya Castle with sea views, historic and natural atmosphere.'
  },
  {
    id: 6,
    type: 'villa',
    title: 'Hisarçandır Satılık İkiz Ev 4+1',
    title_en: '4+1 Twin House for Sale in Hisarçandır',
    location: 'Hisarçandır, Konyaaltı, Antalya',
    price: '20.500.000 ₺',
    price_en: '20,500,000 ₺',
    size: '4+1',
    image: 'portfoy/6-hisarcandir-ikiz-ev.jpg',
    desc: 'Hisarçandır\'da havuzlu, bahçeli, orman içinde, doğa ile iç içe satılık 4+1 ikiz ev.',
    desc_en: '4+1 twin house for sale in Hisarçandır with pool, garden, in the forest, surrounded by nature.'
  },
  {
    id: 7,
    type: 'villa',
    title: 'Altınova Kiralık Villa 5+1',
    title_en: '5+1 Villa for Rent in Altınova',
    location: 'Altınova, Antalya',
    price: 'Kira: 60.000 ₺',
    price_en: 'Rent: 60,000 ₺',
    size: '5+1',
    image: 'portfoy/7-altinova-villa.jpg',
    desc: '2 katlı, 2 banyolu, bahçeli büyük villa. Havalimanına 10 dakika mesafede kiralık.',
    desc_en: '2-storey, 2-bathroom, large villa with garden. 10 minutes to the airport, for rent.'
  },
  {
    id: 8,
    type: 'shop',
    title: 'Kepez Satılık 3 Katlı Dükkan',
    title_en: '3-Storey Shop for Sale in Kepez',
    location: 'Kepez, Teomanpaşa, Antalya',
    price: 'Fiyat Sorunuz',
    price_en: 'Ask for Price',
    size: '200 m²',
    image: 'portfoy/8-kepez-dukkan.jpg',
    desc: '200 m², 3 katlı, köşe parsel, giriş katı 70 m². Necip Fazıl Kısakürek Caddesi üzerinde, krediye uygun.',
    desc_en: '200 m², 3-storey corner plot shop, ground floor 70 m². On Necip Fazıl Kısakürek Street, eligible for bank loan.'
  },
  {
    id: 9,
    type: 'apartment',
    title: 'Altıntaş Satılık Sıfır 1+1 Daire',
    title_en: 'Brand New 1+1 Apartment in Altıntaş',
    location: 'Altıntaş, Antalya',
    price: 'Fiyat Sorunuz',
    price_en: 'Ask for Price',
    size: '1+1',
    image: 'portfoy/9-altintas-daire.jpg',
    desc: 'Sıfır daire, havuz, asansör, balkon, 2. kat. Kardeş Kentler Caddesine çok yakın.',
    desc_en: 'Brand new apartment with pool, elevator, balcony, 2nd floor. Very close to Kardeş Kentler Avenue.'
  },
  {
    id: 10,
    type: 'shop',
    title: 'Güzeloba Kiralık İşyeri',
    title_en: 'Commercial Space for Rent in Güzeloba',
    location: 'Güzeloba, Muratpaşa, Antalya',
    price: 'Fiyat Sorunuz',
    price_en: 'Ask for Price',
    size: '40 m²',
    image: 'portfoy/10-guzeloba-isyeri.jpg',
    desc: 'Yola cepheli, eşyalı işyeri. Mutfak, WC ve bahçe mevcut. Kiralık.',
    desc_en: 'Road-facing furnished commercial space with kitchen, WC and garden. For rent.'
  },
  {
    id: 11,
    type: 'apartment',
    title: 'Konyaaltı Sarısu Satılık 2+1 Daire',
    title_en: '2+1 Apartment for Sale in Konyaaltı Sarısu',
    location: 'Konyaaltı, Sarısu, Antalya',
    price: 'Fiyat Sorunuz',
    price_en: 'Ask for Price',
    size: '95 m²',
    image: 'portfoy/11-konyaalti-daire.jpg',
    desc: '2+1, 3. kat, eşyalı, havuzlu site içinde. Sarısu bölgesinde satılık daire.',
    desc_en: '2+1, 3rd floor, furnished apartment in a complex with pool. For sale in Sarısu area.'
  },
  {
    id: 12,
    type: 'shop',
    title: 'Muratpaşa Meltem Satılık Dükkan',
    title_en: 'Shop for Sale in Muratpaşa Meltem',
    location: 'Muratpaşa, Meltem Mah., Antalya',
    price: '11.000.000 ₺',
    price_en: '11,000,000 ₺',
    size: '35 m²',
    image: 'portfoy/12-meltem-dukkan.jpg',
    desc: 'Stadyumun arkasında, 35 m² satılık dükkan. Muratpaşa Meltem Mahallesi.',
    desc_en: '35 m² shop for sale behind the stadium. Muratpaşa Meltem neighbourhood.'
  },
  {
    id: 13,
    type: 'apartment',
    title: 'Güzeloba Kiralık 1+1 Daire',
    title_en: '1+1 Apartment for Rent in Güzeloba',
    location: 'Güzeloba, Muratpaşa, Antalya',
    price: 'Fiyat Sorunuz',
    price_en: 'Ask for Price',
    size: '1+1',
    image: 'portfoy/13-guzeloba-daire.jpg',
    desc: 'Bahçe katı, eşyalı, site içinde kiralık 1+1 daire. Anadolu Hastanesinin yanında.',
    desc_en: 'Ground floor, furnished 1+1 apartment in a gated complex for rent. Next to Anadolu Hospital.'
  },
];

let activeFilter = 'all';
const grid = document.getElementById('propertyGrid');

function renderGrid() {
  const filtered = activeFilter === 'all'
    ? properties
    : properties.filter(p => p.type === activeFilter);

  if (filtered.length === 0) {
    grid.innerHTML = '<p style="grid-column:1/-1;text-align:center;color:var(--text-muted);padding:3rem;">Bu kategoride ilan bulunamadı.</p>';
    return;
  }

  grid.innerHTML = filtered.map((p, i) => {
    const title = (currentLang === 'en' && p.title_en) ? p.title_en : p.title;
    const desc  = (currentLang === 'en' && p.desc_en)  ? p.desc_en  : p.desc;
    const price = (currentLang === 'en' && p.price_en) ? p.price_en : p.price;
    return `
    <article class="prop-card" data-id="${p.id}" style="animation-delay:${i * 0.07}s">
      <div class="prop-img-wrap">
        <img
          src="${escapeHtml(p.image) || 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80'}"
          alt="${escapeHtml(title)}"
          loading="lazy"
          onerror="this.src='https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80'"
        />
        <span class="prop-badge">${typeLabel(p.type)}</span>
      </div>
      <div class="prop-body">
        <div class="prop-price">${escapeHtml(price)}</div>
        <h3 class="prop-title">${escapeHtml(title)}</h3>
        <p class="prop-location">&#128205; ${escapeHtml(p.location)}</p>
        <div class="prop-meta">
          <span>&#128208; ${escapeHtml(p.size)}</span>
          <span>&#127968; ${typeLabel(p.type)}</span>
        </div>
        <p class="prop-desc">${escapeHtml(desc)}</p>
      </div>
    </article>
  `;}).join('');

  grid.querySelectorAll('.prop-card').forEach(card => {
    card.addEventListener('click', () => openModal(+card.dataset.id));
  });
}

document.getElementById('portfolioFilters').addEventListener('click', e => {
  const btn = e.target.closest('.filter-btn');
  if (!btn) return;
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  activeFilter = btn.dataset.filter;
  renderGrid();
});

renderGrid();


/* ── 5. Property Modal ───────────────────────────────────────── */
const modalOverlay = document.getElementById('propertyModal');
const modalContent = document.getElementById('modalContent');
const modalClose   = document.getElementById('modalClose');

function openModal(id) {
  const p = properties.find(x => x.id === id);
  if (!p) return;

  const lang = currentLang;
  const title = (lang === 'en' && p.title_en) ? p.title_en : p.title;
  const desc  = (lang === 'en' && p.desc_en)  ? p.desc_en  : p.desc;
  const price = (lang === 'en' && p.price_en) ? p.price_en : p.price;
  const ctaText = lang === 'en' ? 'Request Viewing' : 'Görüntüleme Talep Et';
  const whatsappText = lang === 'en' ? 'Ask via WhatsApp' : 'WhatsApp ile Sor';

  modalContent.innerHTML = `
    <img src="${escapeHtml(p.image)}" alt="${escapeHtml(title)}"
         onerror="this.src='https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80'" />
    <div class="modal-body">
      <div class="prop-price">${escapeHtml(price)}</div>
      <div class="prop-title">${escapeHtml(title)}</div>
      <div class="prop-location">&#128205; ${escapeHtml(p.location)} &nbsp;&middot;&nbsp; &#128208; ${escapeHtml(p.size)} &nbsp;&middot;&nbsp; &#127968; ${typeLabel(p.type)}</div>
      <p class="modal-desc">${escapeHtml(desc)}</p>
      <a href="#appointment" class="btn-gold modal-cta" id="modalBookBtn">${ctaText}</a>
      <a href="https://wa.me/905306077396?text=${encodeURIComponent(title + ' - ' + p.location)}" target="_blank" rel="noopener" class="btn-outline modal-cta" style="margin-left:0.8rem">${whatsappText}</a>
    </div>
  `;
  modalOverlay.style.display = 'flex';
  document.body.style.overflow = 'hidden';
  document.getElementById('modalBookBtn').addEventListener('click', closeModal);
}

function closeModal() {
  modalOverlay.style.display = 'none';
  document.body.style.overflow = '';
}

modalClose.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', e => { if (e.target === modalOverlay) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

/* ── 6. Blog Modal ───────────────────────────────────────────── */
const blogPosts = [
  {
    img: 'portfoy/11-konyaalti-daire.jpg',
    tag: 'Piyasa Analizi',
    date: 'Nisan 2026',
    title: "Antalya'da 2026 İlk Çeyrek: Konut Fiyatları ve Talep Artışı",
    body: `<p>TCMB'nin 2025 yılı sonundan itibaren sürdürdüğü faiz indirim politikası, Antalya konut piyasasına olumlu yansıdı. 2026'nın ilk çeyreğinde şehir genelinde konut satışları bir önceki yıla kıyasla %28 arttı.</p>
<p><strong>Öne çıkan bölgeler:</strong></p>
<ul style="padding-left:1.2rem;line-height:2">
  <li><strong>Konyaaltı:</strong> Yıllık %43 fiyat artışı — deniz manzaralı projeler hızla satışta</li>
  <li><strong>Lara:</strong> %38 artış — lüks konut talebi rekor kırdı</li>
  <li><strong>Kepez:</strong> Uygun fiyatlı segmentte stok eridi, yeni projeler başladı</li>
  <li><strong>Aksu / Döşemealtı:</strong> Gelişen altyapıyla yatırımcıların gözdesi</li>
</ul>
<p>Uzmanlar, faiz düşüşünün devam etmesi ve turizm sezonunun erken açılmasıyla birlikte 2026 yılının tamamında konut değerlerinin %35-50 bandında artmaya devam edeceğini öngörüyor.</p>
<p style="margin-top:1.5rem;font-style:italic;color:var(--gold)">Portföyümüzde Antalya'nın tüm bölgelerinde seçkin ilanlar mevcuttur. Randevu için WhatsApp'tan ulaşın.</p>`
  },
  {
    img: 'portfoy/1-belek-villa.jpg',
    tag: 'Yatırım',
    date: 'Nisan 2026',
    title: "Belek ve Serik'te Villa Yatırımı: Kira Getirisi Yüzde 12'ye Ulaştı",
    body: `<p>Türkiye'nin golf ve turizm başkenti Belek, 2026 sezonunda rekor ziyaretçi beklentisiyle yatırımcıların en çok ilgi gösterdiği bölge olmaya devam ediyor.</p>
<p><strong>Neden Belek?</strong></p>
<ul style="padding-left:1.2rem;line-height:2">
  <li>7 uluslararası golf sahası, 5 yıldızlı otel kompleksleri</li>
  <li>Nisan–Ekim arası yüksek sezon — kısa dönem kiralama zirveye ulaşıyor</li>
  <li>Havalimanına 35 km mesafe, ulaşım kolay</li>
  <li>Yıllık brüt kira getirisi: <strong>%10–12</strong></li>
</ul>
<p><strong>Serik'te fırsatlar:</strong> Belek'e yakınlığı ve daha makul fiyatlarıyla Serik, uzun vadeli değer artışı arayan yatırımcılar için ideal.</p>
<p>Golf bölgesindeki villa değerleri son 2 yılda %65 artış gösterirken, kira gelirleri de paralel yükseldi.</p>
<p style="margin-top:1.5rem;font-style:italic;color:var(--gold)">Belek ve Serik'teki satılık villa portföyümüz için bizimle iletişime geçin.</p>`
  },
  {
    img: 'portfoy/3-kaleici-otel.jpg',
    tag: 'Uluslararası',
    date: 'Nisan 2026',
    title: "Yabancı Alıcılara Türkiye'de Mülk: 2026 Güncel Mevzuat ve Fırsatlar",
    body: `<p>Türkiye, 2026 yılında yabancı uyruklu alıcılar için gayrimenkul edinim süreçlerini daha da kolaylaştırdı. Antalya bu kategoride İstanbul'un ardından en çok tercih edilen şehir konumunda.</p>
<p><strong>2026 güncel bilgiler:</strong></p>
<ul style="padding-left:1.2rem;line-height:2">
  <li>Tapu işlemleri ortalama <strong>3–5 iş günü</strong>nde tamamlanıyor</li>
  <li><strong>400.000 USD</strong> ve üzeri yatırımlarda Türk vatandaşlığı hakkı geçerli</li>
  <li>Kısa dönem oturma izni mülk sahiplerine otomatik tanınıyor</li>
  <li>Rus, Alman, İngiliz ve Ukraynalı alıcıların yoğunluğu artıyor</li>
</ul>
<p><strong>Dikkat edilmesi gerekenler:</strong> Tapu devri öncesinde imar durumu, belediye borçları ve tapu sicil kayıtları mutlaka kontrol edilmeli. Bu süreçlerin tamamında danışmanınız sizin yanınızda olmalı.</p>
<p style="margin-top:1.5rem;font-style:italic;color:var(--gold)">Türkçe ve İngilizce destek için Elif Hanım ile doğrudan iletişime geçin.</p>`
  }
];

function openBlog(idx) {
  const p = blogPosts[idx];
  document.getElementById('blogModalContent').innerHTML = `
    <img src="${p.img}" alt="${p.title}" style="width:100%;max-height:320px;object-fit:cover;display:block" />
    <div style="padding:2rem 2.5rem 2.5rem">
      <div style="display:flex;align-items:center;gap:0.8rem;margin-bottom:1rem">
        <span style="font-size:0.72rem;letter-spacing:0.1em;color:var(--gold);font-family:var(--font-body);text-transform:uppercase">${p.tag}</span>
        <span style="color:var(--border)">·</span>
        <span style="font-size:0.75rem;color:var(--text-muted)">${p.date}</span>
      </div>
      <h2 style="font-family:var(--font-display);font-size:1.5rem;color:var(--text-primary);margin-bottom:1.2rem;line-height:1.3">${p.title}</h2>
      <div style="font-size:0.92rem;color:var(--text-light);line-height:1.9">${p.body}</div>
      <a href="#appointment" class="btn-gold" style="margin-top:1.8rem;display:inline-block" onclick="closeBlog()">Randevu Al</a>
    </div>
  `;
  document.getElementById('blogModal').style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function closeBlog() {
  document.getElementById('blogModal').style.display = 'none';
  document.body.style.overflow = '';
}
window.openBlog = openBlog;
window.closeBlog = closeBlog;

document.addEventListener('DOMContentLoaded', () => {
  const bc = document.getElementById('blogClose');
  if (bc) bc.addEventListener('click', closeBlog);
  const bm = document.getElementById('blogModal');
  if (bm) bm.addEventListener('click', e => { if (e.target === bm) closeBlog(); });
});

/* ── 7. Testimonials Slider ──────────────────────────────────── */
const testimonials = [
  {
    quote: "Belek'te villa satın alma sürecinde Elif Hanım'ın desteği paha biçilemezdi. Bölgeyi çok iyi tanıyor; doğru fiyat analizi ve kararlı müzakeresiyle hayalimizin çok ötesinde bir villa bulduk. Her adımda yanımızda oldu.",
    quote_en: "Elif's support during our villa purchase in Belek was invaluable. She knows the area very well; with accurate price analysis and confident negotiation, she found us a villa far beyond our dreams.",
    name: "Mustafa Efren",
    role: "Villa Alıcısı, Belek",
    role_en: "Villa Buyer, Belek",
    stars: 5
  },
  {
    quote: "Altıntaş'ta işyerim için kiralık dükkan arayışımdayken Elif Hanım devreye girdi. Kısa sürede merkezi konumda, bütçeme tam uyan bir dükkan buldu. Kira sözleşmesi sürecinde de yanımda oldu, son derece memnun kaldım.",
    quote_en: "When I was looking for a shop to rent in Altıntaş, Elif stepped in. She quickly found a centrally located shop that perfectly fit my budget and supported me throughout the lease process.",
    name: "Fehmi Orhan",
    role: "Kiracı, Altıntaş",
    role_en: "Tenant, Altıntaş",
    stars: 5
  },
  {
    quote: "Kepez'de yatırım amaçlı bir arsa arıyordum. Elif Hanım bana bölgeyi çok iyi analiz ederek sundu ve doğru kararı vermemi sağladı. Çınar Ağacım'ı herkese öneriyorum!",
    quote_en: "I was looking for investment land in Kepez. Elif presented me with an excellent regional analysis and helped me make the right decision. I recommend Çınar Ağacım to everyone!",
    name: "Nurhan Okyay",
    role: "Yatırımcı, Kepez",
    role_en: "Investor, Kepez",
    stars: 5
  },
];

let testimonialsGoTo;

(function initTestimonials() {
  const track = document.getElementById('testimonialsTrack');
  const dotsContainer = document.getElementById('sliderDots');
  let current = 0;
  let autoTimer;

  function renderTestimonials() {
    const saved = current;
    track.innerHTML = testimonials.map(t => {
      const quote = (currentLang === 'en' && t.quote_en) ? t.quote_en : t.quote;
      const role  = (currentLang === 'en' && t.role_en)  ? t.role_en  : t.role;
      return `
      <div class="testimonial-card">
        <p class="test-quote">${escapeHtml(quote)}</p>
        <div class="test-author">
          <div class="test-stars">${'\u2605'.repeat(t.stars)}</div>
          <span class="test-name">${escapeHtml(t.name)}</span>
          <span class="test-role">${escapeHtml(role)}</span>
        </div>
      </div>`;
    }).join('');
    dotsContainer.innerHTML = testimonials.map((_, i) =>
      `<div class="dot ${i === 0 ? 'active' : ''}" data-index="${i}"></div>`
    ).join('');
    goTo(saved);
  }

  function goTo(n) {
    current = (n + testimonials.length) % testimonials.length;
    track.style.transform = `translateX(-${current * 100}%)`;
    dotsContainer.querySelectorAll('.dot').forEach((d, i) => d.classList.toggle('active', i === current));
  }

  testimonialsGoTo = function() { renderTestimonials(); };

  document.getElementById('prevTest').addEventListener('click', () => { goTo(current - 1); resetTimer(); });
  document.getElementById('nextTest').addEventListener('click', () => { goTo(current + 1); resetTimer(); });

  dotsContainer.addEventListener('click', e => {
    const dot = e.target.closest('.dot');
    if (dot) { goTo(+dot.dataset.index); resetTimer(); }
  });

  function startTimer() { autoTimer = setInterval(() => goTo(current + 1), 5500); }
  function resetTimer() { clearInterval(autoTimer); startTimer(); }

  renderTestimonials();
  startTimer();
})();

/* ── 7. Appointment Form ─────────────────────────────────────── */
document.getElementById('appointmentForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const fields = [
    { id: 'appt-name',     check: v => v.trim().length > 1 },
    { id: 'appt-email',    check: isValidEmail },
    { id: 'appt-datetime', check: v => v.length > 0 },
  ];

  const feedback = document.getElementById('apptFeedback');
  if (!validateFields(fields)) {
    showFeedback(feedback, 'error', currentLang === 'en'
      ? 'Please fill in all required fields correctly.'
      : 'Lütfen tüm zorunlu alanları doğru şekilde doldurun.');
    return;
  }

  sendEmail(this, feedback, {
    from_name:  document.getElementById('appt-name').value.trim(),
    from_email: document.getElementById('appt-email').value.trim(),
    phone:      document.getElementById('appt-phone').value.trim() || '—',
    date:       document.getElementById('appt-datetime').value,
    message:    document.getElementById('appt-message').value.trim() || '—',
    form_type:  currentLang === 'en' ? 'Appointment Request' : 'Randevu Talebi',
  });
});

/* ── 8. Contact Form ─────────────────────────────────────────── */
document.getElementById('contactForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const fields = [
    { id: 'cnt-name',    check: v => v.trim().length > 1 },
    { id: 'cnt-email',   check: isValidEmail },
    { id: 'cnt-message', check: v => v.trim().length > 5 },
  ];

  const feedback = document.getElementById('contactFeedback');
  if (!validateFields(fields)) {
    showFeedback(feedback, 'error', currentLang === 'en'
      ? 'Please complete all required fields correctly.'
      : 'Lütfen tüm zorunlu alanları doğru şekilde doldurun.');
    return;
  }

  sendEmail(this, feedback, {
    from_name:  document.getElementById('cnt-name').value.trim(),
    from_email: document.getElementById('cnt-email').value.trim(),
    phone:      document.getElementById('cnt-phone') ? document.getElementById('cnt-phone').value.trim() : '—',
    date:       '—',
    message:    document.getElementById('cnt-message').value.trim(),
    form_type:  currentLang === 'en' ? 'Contact Form' : 'İletişim Formu',
  });
});

/* ── 9. Utility Functions ────────────────────────────────────── */
function validateFields(fields) {
  let allValid = true;
  fields.forEach(({ id, check }) => {
    const el = document.getElementById(id);
    const val = el.value;
    if (!check(val)) { el.classList.add('invalid'); allValid = false; }
    else el.classList.remove('invalid');
  });
  return allValid;
}

function isValidEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
}

function showFeedback(el, type, msg) {
  el.className = `form-feedback ${type}`;
  el.textContent = msg;
}

function sendEmail(form, feedback, params) {
  const submitBtn = form.querySelector('[type="submit"]');
  const originalText = submitBtn.textContent;
  submitBtn.textContent = currentLang === 'en' ? 'Sending...' : 'Gönderiliyor...';
  submitBtn.disabled = true;

  emailjs.send('service_bm7l7nl', 'template_oyjun4t', params)
    .then(() => {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
      showFeedback(feedback, 'success', currentLang === 'en'
        ? 'Your message has been sent! We will get back to you within 24 hours.'
        : 'Mesajınız gönderildi! 24 saat içinde sizinle iletişime geçeceğiz.');
      form.reset();
      setTimeout(() => {
        feedback.className = 'form-feedback';
        feedback.textContent = '';
      }, 8000);
    })
    .catch(() => {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
      showFeedback(feedback, 'error', currentLang === 'en'
        ? 'Failed to send. Please try again or contact via WhatsApp.'
        : 'Gönderim başarısız. Lütfen tekrar deneyin veya WhatsApp\'tan ulaşın.');
    });
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function typeLabel(type) {
  const labels = {
    tr: { apartment: 'Daire', villa: 'Villa', shop: 'Dükkan', hotel: 'Otel' },
    en: { apartment: 'Apartment', villa: 'Villa', shop: 'Shop', hotel: 'Hotel' }
  };
  return (labels[currentLang] && labels[currentLang][type]) || capitalise(type);
}

function capitalise(str) {
  return str ? str.charAt(0).toUpperCase() + str.slice(1) : '';
}

/* ── 10. Footer Year ─────────────────────────────────────────── */
document.getElementById('footerYear').textContent = new Date().getFullYear();

/* ── 11. Language Toggle (TR / EN) with localStorage ─────────── */
const translations = {
  en: {
    'logo.sub': 'Real Estate Consultancy',
    'nav.home': 'Home',
    'nav.about': 'About',
    'nav.services': 'Services',
    'nav.portfolio': 'Portfolio',
    'nav.appointment': 'Appointment',
    'nav.testimonials': 'Reviews',
    'nav.contact': 'Contact',
    'hero.eyebrow': 'Antalya \u00b7 Turkey \u00b7 Worldwide',
    'hero.subtitle': 'Real Estate',
    'hero.tagline': 'Turning Your Dream Property Into Reality',
    'hero.cta': 'View Portfolio',
    'hero.scroll': 'Scroll',
    'about.eyebrow': 'About Me',
    'about.title': 'Built on Trust<br /><em>and Professionalism</em>',
    'about.badge': 'Successful Sales',
    'about.kw_role': 'Real Estate Consultant',
    'about.bio1': "With my experience in Antalya's dynamic real estate market, I provide personalized solutions for every client. From Muratpa\u015fa to Konyaalt\u0131, from Kepez to Lara, from Belek to Kalei\u00e7i \u2014 I serve with a wide portfolio.",
    'about.bio2': 'Whether you are a family buying your first home, an experienced investor, or an international client seeking a property in Turkey \u2014 finding the right property for your vision and being by your side through every step is my priority.',
    'about.stat1': 'Properties Sold',
    'about.stat2': 'Authorized Portfolios',
    'about.stat3': 'Client Satisfaction',
    'about.projects_title': 'Key Achievements',
    'services.eyebrow': 'Our Services',
    'services.title': 'Professional <em>Services</em>',
    'services.subtitle': 'I am with you at every stage of your real estate journey.',
    'services.s1_title': 'Sales Consulting',
    'services.s1_desc': 'Professional marketing and negotiation support to sell your property at the best price in the shortest time.',
    'services.s2_title': 'Rental Services',
    'services.s2_desc': 'Proper tenant matching and contract management support for long and short-term rental processes.',
    'services.s3_title': 'Investment Advisory',
    'services.s3_desc': 'Market analysis and portfolio recommendations to maximize your real estate investment.',
    'services.s4_title': 'International Buyer Services',
    'services.s4_desc': 'Turkish and English support for foreign investors, guidance on title deed processes and residence permits.',
    'services.s5_title': 'Title Deed Support',
    'services.s5_desc': 'Handling land registry processes on your behalf and providing guidance throughout legal procedures.',
    'services.s6_title': 'Property Valuation',
    'services.s6_desc': 'Expert valuation service to determine the real market value of your property with current data and regional analysis.',
    'why.eyebrow': 'Why \u00c7\u0131nar A\u011fac\u0131m?',
    'why.title': 'What Makes Us <em>Different?</em>',
    'why.subtitle': 'My clients keep choosing me because...',
    'why.c1_title': 'Personal Attention',
    'why.c1_desc': 'I give each client one-on-one, dedicated attention. Your needs are my priority.',
    'why.c2_title': 'Local Expertise',
    'why.c2_desc': "I know every district and neighbourhood of Antalya. From Muratpa\u015fa to Kepez, Konyaalt\u0131 to Belek.",
    'why.c3_title': 'Honest Pricing',
    'why.c3_desc': 'I tell you the real market value. Transparent, reliable, and no exaggeration.',
    'why.c4_title': '24/7 Availability',
    'why.c4_desc': 'WhatsApp, phone, or email \u2014 you can always reach me. Quick response guaranteed.',
    'portfolio.eyebrow': 'Our Portfolio',
    'portfolio.title': 'Premium <em>Properties</em>',
    'portfolio.subtitle': 'Apartments, villas, shops and hotels across Antalya and Turkey.',
    'portfolio.filter_all': 'All',
    'portfolio.filter_apt': 'Apartment',
    'portfolio.filter_villa': 'Villa',
    'portfolio.filter_shop': 'Shop',
    'portfolio.filter_hotel': 'Hotel',
    'appointment.eyebrow': 'One-on-One Meeting',
    'appointment.title': 'Schedule a<br /><em>Private Consultation</em>',
    'appointment.desc': 'Schedule a meeting with me to explore your options, discuss your goals, and get expert advice tailored to you.',
    'appointment.feat1': '\u2726 In-person or video call',
    'appointment.feat2': '\u2726 Turkish and English language options',
    'appointment.feat3': '\u2726 Confidentiality guaranteed',
    'appointment.submit': 'Request Appointment',
    'testimonials.eyebrow': 'Client Reviews',
    'testimonials.title': 'Voice of <em>Trust</em>',
    'certificates.eyebrow': 'Certificates & Education',
    'certificates.title': 'Professional <em>Qualifications</em>',
    'cert.c1_title': 'Real Estate Consultancy',
    'cert.c1_sub': 'Professional Competency Certificate',
    'cert.c2_title': 'Property Marketing',
    'cert.c2_sub': 'Certified Training Program',
    'cert.c3_title': 'International Sales',
    'cert.c3_sub': 'Foreign Investor Training',
    'cert.c4_title': 'Property Valuation',
    'cert.c4_sub': 'Expert Valuation Certificate',
    'blog.eyebrow': 'Blog & News',
    'blog.title': 'Real Estate <em>Guide</em>',
    'blog.subtitle': 'Latest insights from the Antalya property market and investment world.',
    'blog.tag_market': 'Market Analysis',
    'blog.tag_intl': 'International',
    'blog.tag_invest': 'Investment',
    'blog.a1_title': 'Antalya Q1 2026: Housing Prices & Rising Demand',
    'blog.a1_desc': 'As the TCMB continues rate cuts, Antalya\'s housing market sees a strong rebound. New project inventory in Kepez and Aksu is selling fast, while Konyaaltı and Lara recorded over 40% annual price growth.',
    'blog.a2_title': 'Villa Investment in Belek & Serik: Rental Yields Hit 12%',
    'blog.a2_desc': 'With record tourist arrivals expected for the 2026 season, demand for rental villas in Belek and Serik has surged. Short-term rental gross yields have reached 10–12%, with Golf District properties seeing the highest appreciation.',
    'blog.a3_title': 'Buying Property in Turkey as a Foreigner: 2026 Updates',
    'blog.a3_desc': 'Turkey made foreign property ownership even easier in 2026. Antalya sees growing interest from Russian, German and British buyers, and citizenship by investment for properties above $400,000 remains in effect.',
    'blog.guide': 'Guide',
    'blog.tips': 'Tips',
    'contact.eyebrow': 'Contact',
    'contact.title': 'Get in <em>Touch</em>',
    'contact.address_label': 'Office Address',
    'contact.phone_label': 'Phone / WhatsApp',
    'contact.email_label': 'E-mail',
    'contact.instagram_label': 'Follow on Instagram',
    'contact.submit': 'Send Message',
    'form.name': 'Full Name *',
    'form.email': 'E-mail *',
    'form.phone': 'Phone',
    'form.date': 'Preferred Date *',
    'form.message': 'Your Message',
    'form.subject': 'Subject',
    'form.your_message': 'Your Message *',
    'ph.full_name': 'Your Full Name',
    'ph.email_addr': 'example@email.com',
    'ph.phone_num': '+90 (530) 607 73 96',
    'ph.appt_msg': 'Tell us about your real estate goals...',
    'ph.subject_hint': 'Property inquiry, general questions...',
    'ph.cnt_msg': 'Write your message here...',
    'footer.menu': 'Menu',
    'footer.appt': 'Book Appointment',
    'footer.contact_title': 'Contact Information',
    'footer.tagline': 'Elif Tuncero\u011flu<br />Keller Williams',
    'footer.rights': 'All Rights Reserved.',
    'footer.legal': 'Privacy Policy \u00b7 Terms of Use',
    'tag.p1': 'Sea View Villa, Lara',
    'tag.p2': 'Residence Apartment, Konyaalt\u0131',
    'tag.p3': 'Investment Land, Belek',
    'tag.p4': 'Boutique Hotel Project, Kalei\u00e7i',
  },
  tr: {
    'logo.sub': 'Gayrimenkul Dan\u0131\u015fmanl\u0131\u011f\u0131',
    'nav.home': 'Ana Sayfa',
    'nav.about': 'Hakk\u0131mda',
    'nav.services': 'Hizmetler',
    'nav.portfolio': 'Portf\u00f6y',
    'nav.appointment': 'Randevu',
    'nav.testimonials': 'Referanslar',
    'nav.contact': '\u0130leti\u015fim',
    'hero.eyebrow': 'Antalya \u00b7 T\u00fcrkiye \u00b7 D\u00fcnya',
    'hero.subtitle': 'Gayrimenkul',
    'hero.tagline': 'Hayalinizdeki M\u00fclk\u00fc Ger\u00e7e\u011fe D\u00f6n\u00fc\u015ft\u00fcr\u00fcy\u00f6rum',
    'hero.cta': 'Portf\u00f6y\u00fc \u0130ncele',
    'hero.scroll': 'Kayd\u0131r',
    'about.eyebrow': 'Hakk\u0131mda',
    'about.title': 'G\u00fcven ve Profesyonellik<br /><em>\u00dczerine Kurulu</em>',
    'about.badge': 'Ba\u015far\u0131l\u0131 Sat\u0131\u015f',
    'about.kw_role': 'Gayrimenkul Dan\u0131\u015fman\u0131',
    'about.bio1': "Antalya'n\u0131n en dinamik gayrimenkul pazar\u0131nda edindiğim tecrübe ve bilgi birikimimle, her müşterime özel, kişiye özel çözümler sunuyorum. Muratpaşa'dan Konyaaltı'na, Kepez'den Lara'ya, Belek'ten Kaleiçi'ne kadar geniş bir portföyle hizmet veriyorum.",
    'about.bio2': "\u0130ster ilk evini alan bir aile, ister deneyimli bir yat\u0131r\u0131mc\u0131, isterse T\u00fcrkiye'de ya\u015fam alan\u0131 arayan uluslararas\u0131 bir m\u00fc\u015fteri olun \u2014 vizyonunuza uygun en do\u011fru m\u00fclk\u00fc bulmak ve s\u00fcrecin her a\u015famas\u0131nda yan\u0131n\u0131zda olmak benim \u00f6nceli\u011fimdir.",
    'about.stat1': 'Sat\u0131lan M\u00fclk',
    'about.stat2': 'Yetkili Portf\u00f6y',
    'about.stat3': 'M\u00fc\u015fteri Memnuniyeti',
    'about.projects_title': '\u00d6ne \u00c7\u0131kan Ba\u015far\u0131lar',
    'services.eyebrow': 'Hizmetlerimiz',
    'services.title': 'Profesyonel <em>Hizmetler</em>',
    'services.subtitle': 'Gayrimenkul s\u00fcrecinizin her a\u015famas\u0131nda yan\u0131n\u0131zday\u0131m.',
    'services.s1_title': 'Sat\u0131\u015f Dan\u0131\u015fmanl\u0131\u011f\u0131',
    'services.s1_desc': 'M\u00fclk\u00fcn\u00fcz\u00fc en do\u011fru fiyatla, en k\u0131sa s\u00fcrede satman\u0131z i\u00e7in profesyonel pazarlama ve m\u00fczakere deste\u011fi sunuyorum.',
    'services.s2_title': 'Kiralama Hizmetleri',
    'services.s2_desc': 'Uzun ve k\u0131sa d\u00f6nem kiralama s\u00fcre\u00e7lerinde, do\u011fru kirac\u0131 e\u015fle\u015ftirmesi ve s\u00f6zle\u015fme y\u00f6netimi ile yan\u0131n\u0131zday\u0131m.',
    'services.s3_title': 'Yat\u0131r\u0131m Dan\u0131\u015fmanl\u0131\u011f\u0131',
    'services.s3_desc': 'Gayrimenkul yat\u0131r\u0131m\u0131n\u0131z\u0131 en verimli \u015fekilde de\u011flendirmeniz i\u00e7in piyasa analizi ve portf\u00f6y \u00f6nerileri sunuyorum.',
    'services.s4_title': 'Uluslararas\u0131 Al\u0131c\u0131 Hizmetleri',
    'services.s4_desc': 'Yabanc\u0131 yat\u0131r\u0131mc\u0131lara T\u00fcrk\u00e7e ve \u0130ngilizce destek, tapu i\u015flemleri rehberli\u011fi ve ikamet s\u00fcre\u00e7lerinde yard\u0131m sa\u011fl\u0131yorum.',
    'services.s5_title': 'Tapu \u0130\u015flemleri Deste\u011fi',
    'services.s5_desc': 'Sat\u0131\u015f ve devir s\u00fcre\u00e7lerinde tapu m\u00fcd\u00fcrl\u00fc\u011f\u00fc i\u015flemlerini sizin ad\u0131n\u0131za takip ediyor, hukuki s\u00fcre\u00e7lerde rehberlik sunuyorum.',
    'services.s6_title': 'M\u00fclk De\u011flerleme',
    'services.s6_desc': 'G\u00fcncel piyasa verileri ve b\u00f6lgesel analizlerle m\u00fclk\u00fcn\u00fcz\u00fcn ger\u00e7ek piyasa de\u011ferini belirlemek i\u00e7in uzman de\u011flerleme hizmeti sunuyorum.',
    'why.eyebrow': 'Neden \u00c7\u0131nar A\u011fac\u0131m?',
    'why.title': 'Fark\u0131m\u0131z <em>Ne?</em>',
    'why.subtitle': 'M\u00fc\u015fterilerim beni tercih etmeye devam ediyor \u00e7\u00fcnk\u00fc...',
    'why.c1_title': 'Ki\u015fisel \u0130lgi',
    'why.c1_desc': 'Her m\u00fc\u015fterime birebir, \u00f6zel ilgi g\u00f6steriyorum. Sizin ihtiya\u00e7lar\u0131n\u0131z benim \u00f6nceli\u011fimdir.',
    'why.c2_title': 'B\u00f6lge Bilgisi',
    'why.c2_desc': "Antalya'n\u0131n her semtini, her mahallesini tan\u0131yorum. Muratpa\u015fa'dan Kepez'e, Konyaalt\u0131'ndan Belek'e kadar.",
    'why.c3_title': 'D\u00fcr\u00fcst Fiyatlama',
    'why.c3_desc': 'Piyasadaki ger\u00e7ek de\u011feri s\u00f6ylerim. Abart\u0131s\u0131z, \u015feffaf ve g\u00fcvenilir fiyat de\u011flendirmesi.',
    'why.c4_title': '7/24 Ula\u015f\u0131labilirlik',
    'why.c4_desc': 'WhatsApp, telefon veya e-posta \u2014 her zaman ula\u015fabilirsiniz. H\u0131zl\u0131 d\u00f6n\u00fc\u015f garantisi.',
    'portfolio.eyebrow': 'Portf\u00f6y\u00fcm\u00fcz',
    'portfolio.title': 'Se\u00e7kin <em>M\u00fclkler</em>',
    'portfolio.subtitle': 'Antalya ve Türkiye genelinde daire, villa, dükkan ve otel seçenekleri.',
    'portfolio.filter_all': 'Tümü',
    'portfolio.filter_apt': 'Daire',
    'portfolio.filter_villa': 'Villa',
    'portfolio.filter_shop': 'Dükkan',
    'portfolio.filter_hotel': 'Otel',
    'appointment.eyebrow': 'Birebir G\u00f6r\u00fc\u015fme',
    'appointment.title': '\u00d6zel Randevu<br /><em>Olu\u015fturun</em>',
    'appointment.desc': 'Se\u00e7eneklerinizi ke\u015ffetmek, hedeflerinizi konu\u015fmak ve size tamamen \u00f6zel, uzman tavsiyesi almak i\u00e7in benimle bir g\u00f6r\u00fc\u015fme ayarlay\u0131n.',
    'appointment.feat1': '\u2726 Y\u00fcz y\u00fcze veya g\u00f6r\u00fcnt\u00fcl\u00fc arama',
    'appointment.feat2': '\u2726 T\u00fcrk\u00e7e ve \u0130ngilizce dil se\u00e7ene\u011fi',
    'appointment.feat3': '\u2726 Gizlilik garantisi',
    'appointment.submit': 'Randevu Talep Et',
    'testimonials.eyebrow': 'M\u00fc\u015fteri Yorumlar\u0131',
    'testimonials.title': 'G\u00fcvenin <em>Sesi</em>',
    'certificates.eyebrow': 'Sertifika & E\u011fitim',
    'certificates.title': 'Profesyonel <em>Yetkinlikler</em>',
    'cert.c1_title': 'Gayrimenkul Dan\u0131\u015fmanl\u0131\u011f\u0131',
    'cert.c1_sub': 'Mesleki Yeterlilik Belgesi',
    'cert.c2_title': 'Emlak Pazarlama',
    'cert.c2_sub': 'Sertifikal\u0131 E\u011fitim Program\u0131',
    'cert.c3_title': 'Uluslararas\u0131 Sat\u0131\u015f',
    'cert.c3_sub': 'Yabanc\u0131 Yat\u0131r\u0131mc\u0131 E\u011fitimi',
    'cert.c4_title': 'M\u00fclk De\u011flerleme',
    'cert.c4_sub': 'Uzman De\u011flerleme Sertifikas\u0131',
    'blog.eyebrow': 'Blog & Haberler',
    'blog.title': 'Gayrimenkul <em>Rehberi</em>',
    'blog.subtitle': 'Antalya emlak piyasas\u0131 ve yat\u0131r\u0131m d\u00fcnyas\u0131ndan g\u00fcncel bilgiler.',
    'blog.tag_market': 'Piyasa Analizi',
    'blog.tag_intl': 'Uluslararas\u0131',
    'blog.tag_invest': 'Yat\u0131r\u0131m',
    'blog.a1_title': "Antalya'da 2026 İlk Çeyrek: Konut Fiyatları ve Talep Artışı",
    'blog.a1_desc': "TCMB'nin faiz indirim süreciyle Antalya'da konut talebinde belirgin canlanma var. Kepez, Aksu ve Döşemealtı'nda yeni proje stoku hızla eriyorken, Konyaaltı ve Lara'da fiyatlar yıllık %40'ın üzerinde arttı.",
    'blog.a2_title': "Belek ve Serik'te Villa Yatırımı: Kira Getirisi %12'ye Ulaştı",
    'blog.a2_desc': "2026 turizm sezonunda rekor ziyaretçi beklentisiyle Belek ve Serik'teki kiralık villalara talep patladı. Kısa dönem kiralamada yıllık brüt getiri %10-12 bandına yükselirken, Golf bölgesi mülkleri en yüksek değer artışını yaşıyor.",
    'blog.a3_title': "Yabancı Alıcılara Türkiye'de Mülk: 2026 Güncel Mevzuat",
    'blog.a3_desc': "Türkiye'de yabancı mülk edinimi 2026'da daha da kolaylaştı. Antalya'da Rus, Alman ve İngiliz alıcıların yoğunluğu artarken, 400.000 USD üzeri yatırımlarda vatandaşlık hakkı geçerliliğini koruyor.",
    'blog.guide': 'Rehber',
    'blog.tips': '\u0130pu\u00e7lar\u0131',
    'contact.eyebrow': '\u0130leti\u015fim',
    'contact.title': 'Benimle <em>\u0130leti\u015fime Ge\u00e7in</em>',
    'contact.address_label': 'Ofis Adresi',
    'contact.phone_label': 'Telefon / WhatsApp',
    'contact.email_label': 'E-posta',
    'contact.instagram_label': "Instagram'da Takip Edin",
    'contact.submit': 'Mesaj\u0131 G\u00f6nder',
    'form.name': 'Ad Soyad *',
    'form.email': 'E-posta *',
    'form.phone': 'Telefon',
    'form.date': 'Tercih Edilen Tarih *',
    'form.message': 'Mesaj\u0131n\u0131z',
    'form.subject': 'Konu',
    'form.your_message': 'Mesaj\u0131n\u0131z *',
    'ph.full_name': 'Ad\u0131n\u0131z Soyad\u0131n\u0131z',
    'ph.email_addr': 'ornek@email.com',
    'ph.phone_num': '+90 (530) 607 73 96',
    'ph.appt_msg': 'Gayrimenkul hedeflerinizden bahsedin...',
    'ph.subject_hint': 'Gayrimenkul talebi, genel sorular...',
    'ph.cnt_msg': 'Mesaj\u0131n\u0131z\u0131 buraya yaz\u0131n...',
    'footer.menu': 'Men\u00fc',
    'footer.appt': 'Randevu Al',
    'footer.contact_title': '\u0130leti\u015fim Bilgileri',
    'footer.tagline': 'Elif Tuncero\u011flu<br />Keller Williams',
    'footer.rights': 'T\u00fcm Haklar\u0131 Sakl\u0131d\u0131r.',
    'footer.legal': 'Gizlilik Politikas\u0131 \u00b7 Kullan\u0131m \u015eartlar\u0131',
    'tag.p1': 'Deniz Manzaral\u0131 Villa, Lara',
    'tag.p2': 'Rezidans Daire, Konyaalt\u0131',
    'tag.p3': 'Yat\u0131r\u0131ml\u0131k Arsa, Belek',
    'tag.p4': 'Butik Otel Projesi, Kalei\u00e7i',
  }
};

function applyLang(lang) {
  currentLang = lang;
  localStorage.setItem('cinarLang', lang);
  const dict = translations[lang];
  if (!dict) return;

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (dict[key]) {
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.placeholder = dict[key];
      } else {
        el.innerHTML = dict[key];
      }
    }
  });

  // Re-render JS-generated content with new language
  renderGrid();
  if (typeof testimonialsGoTo === 'function') testimonialsGoTo();

  document.documentElement.lang = lang === 'en' ? 'en' : 'tr';
}

(function initLangToggle() {
  const btn = document.getElementById('langToggle');

  // Apply saved language on load
  if (currentLang === 'en') {
    btn.textContent = 'TR / EN';
    applyLang('en');
  }

  btn.addEventListener('click', () => {
    currentLang = currentLang === 'tr' ? 'en' : 'tr';
    btn.textContent = currentLang === 'tr' ? 'EN / TR' : 'TR / EN';
    applyLang(currentLang);
  });
})();

/* ── 12. Hero reveal on load ─────────────────────────────────── */
window.addEventListener('load', () => {
  document.querySelectorAll('#hero .reveal-up').forEach(el => {
    el.classList.add('in-view');
  });
});
