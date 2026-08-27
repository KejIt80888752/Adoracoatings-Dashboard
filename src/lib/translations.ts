// ── Language support (English / Kannada / Hindi) ────────────────────────
// Scoped to the Sidebar navigation and the Stock & Inventory page first --
// that's the screen warehouse/stock staff use daily and the one flagged as
// needing translation. Add more page keys here as more screens are covered.
export type Lang = 'en' | 'kn' | 'hi'

export const LANGUAGES: { code: Lang; label: string; native: string }[] = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'kn', label: 'Kannada', native: 'ಕನ್ನಡ' },
  { code: 'hi', label: 'Hindi',   native: 'हिन्दी' },
]

const dict = {
  // ── Sidebar navigation ──
  'nav.dashboard':      { en: 'Dashboard',            kn: 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',              hi: 'डैशबोर्ड' },
  'nav.products':       { en: 'Products',             kn: 'ಉತ್ಪನ್ನಗಳು',                  hi: 'उत्पाद' },
  'nav.inventory':      { en: 'Stock & Inventory',    kn: 'ಸ್ಟಾಕ್ ಮತ್ತು ದಾಸ್ತಾನು',       hi: 'स्टॉक और इन्वेंटरी' },
  'nav.portfolio':      { en: 'Portfolio',            kn: 'ಪೋರ್ಟ್‌ಫೋಲಿಯೋ',              hi: 'पोर्टफोलियो' },
  'nav.quotation':      { en: 'Quotation',            kn: 'ಕೋಟೇಶನ್',                     hi: 'कोटेशन' },
  'nav.billing':        { en: 'Billing / Invoice',    kn: 'ಬಿಲ್ಲಿಂಗ್ / ಇನ್‌ವಾಯ್ಸ್',      hi: 'बिलिंग / इनवॉइस' },
  'nav.leads':          { en: 'Lead Generation',      kn: 'ಲೀಡ್ ಜನರೇಶನ್',                hi: 'लीड जनरेशन' },
  'nav.clients':        { en: 'B2B & B2C Clients',    kn: 'B2B ಮತ್ತು B2C ಗ್ರಾಹಕರು',      hi: 'B2B और B2C ग्राहक' },
  'nav.salesReports':   { en: 'Sales Reports',        kn: 'ಮಾರಾಟ ವರದಿಗಳು',               hi: 'बिक्री रिपोर्ट' },
  'nav.purchaseReports':{ en: 'Purchase Reports',     kn: 'ಖರೀದಿ ವರದಿಗಳು',                hi: 'खरीद रिपोर्ट' },
  'nav.outstanding':    { en: 'Outstanding',          kn: 'ಬಾಕಿ',                        hi: 'बकाया' },
  'nav.profitLoss':     { en: 'Profit & Loss',        kn: 'ಲಾಭ ಮತ್ತು ನಷ್ಟ',              hi: 'लाभ और हानि' },
  'nav.gstReports':     { en: 'GST Reports',          kn: 'GST ವರದಿಗಳು',                  hi: 'GST रिपोर्ट' },
  'nav.userManagement': { en: 'User Management',      kn: 'ಬಳಕೆದಾರ ನಿರ್ವಹಣೆ',            hi: 'उपयोगकर्ता प्रबंधन' },
  'nav.orders':         { en: 'Orders',               kn: 'ಆರ್ಡರ್‌ಗಳು',                  hi: 'ऑर्डर' },
  'nav.settings':       { en: 'Settings',             kn: 'ಸೆಟ್ಟಿಂಗ್‌ಗಳು',               hi: 'सेटिंग्स' },
  'nav.signOut':        { en: 'Sign Out',             kn: 'ಸೈನ್ ಔಟ್',                    hi: 'साइन आउट' },

  // ── Common actions (shared across pages) ──
  'common.save':    { en: 'Save',   kn: 'ಉಳಿಸಿ',        hi: 'सहेजें' },
  'common.delete':  { en: 'Delete', kn: 'ಅಳಿಸಿ',         hi: 'हटाएं' },
  'common.edit':    { en: 'Edit',   kn: 'ಸಂಪಾದಿಸಿ',      hi: 'संपादित करें' },
  'common.add':     { en: 'Add',    kn: 'ಸೇರಿಸಿ',        hi: 'जोड़ें' },
  'common.cancel':  { en: 'Cancel', kn: 'ರದ್ದುಮಾಡಿ',     hi: 'रद्द करें' },
  'common.search':  { en: 'Search', kn: 'ಹುಡುಕಿ',        hi: 'खोजें' },
  'common.status':  { en: 'Status', kn: 'ಸ್ಥಿತಿ',        hi: 'स्थिति' },
  'common.date':    { en: 'Date',   kn: 'ದಿನಾಂಕ',        hi: 'तारीख' },

  // ── Stock & Inventory page ──
  'inv.stockOverview':   { en: 'Stock Overview',   kn: 'ಸ್ಟಾಕ್ ಅವಲೋಕನ',       hi: 'स्टॉक अवलोकन' },
  'inv.addProduct':      { en: 'Add Product',      kn: 'ಉತ್ಪನ್ನ ಸೇರಿಸಿ',      hi: 'उत्पाद जोड़ें' },
  'inv.dispatch':        { en: 'Dispatch',         kn: 'ರವಾನೆ',                hi: 'डिस्पैच' },
  'inv.productReturn':   { en: 'Product Return',   kn: 'ಉತ್ಪನ್ನ ಹಿಂತಿರುಗಿಸಿ', hi: 'उत्पाद वापसी' },
  'inv.totalProducts':   { en: 'Total Products',   kn: 'ಒಟ್ಟು ಉತ್ಪನ್ನಗಳು',    hi: 'कुल उत्पाद' },
  'inv.godownStock':     { en: 'Godown Stock',     kn: 'ಗೋದಾಮು ಸ್ಟಾಕ್',       hi: 'गोदाम स्टॉक' },
  'inv.seaAirStock':     { en: 'Sea Air Stock',    kn: 'ಸೀ ಏರ್ ಸ್ಟಾಕ್',       hi: 'सी एयर स्टॉक' },
  'inv.outOfStock':      { en: 'Out of Stock',     kn: 'ಸ್ಟಾಕ್ ಇಲ್ಲ',         hi: 'स्टॉक खत्म' },
  'inv.productName':     { en: 'Product Name',     kn: 'ಉತ್ಪನ್ನದ ಹೆಸರು',      hi: 'उत्पाद का नाम' },
  'inv.packSize':        { en: 'Pack Size',        kn: 'ಪ್ಯಾಕ್ ಗಾತ್ರ',        hi: 'पैक साइज़' },
  'inv.seaAirQty':       { en: 'Sea Air Qty',      kn: 'ಸೀ ಏರ್ ಪ್ರಮಾಣ',       hi: 'सी एयर मात्रा' },
  'inv.seaAirKgL':       { en: 'Sea Air Kg/L',     kn: 'ಸೀ ಏರ್ Kg/L',          hi: 'सी एयर Kg/L' },
  'inv.godownQty':       { en: 'Godown Qty',       kn: 'ಗೋದಾಮು ಪ್ರಮಾಣ',       hi: 'गोदाम मात्रा' },
  'inv.godownKgL':       { en: 'Godown Kg/L',      kn: 'ಗೋದಾಮು Kg/L',          hi: 'गोदाम Kg/L' },
  'inv.totalKgL':        { en: 'Total Kg/L',       kn: 'ಒಟ್ಟು Kg/L',           hi: 'कुल Kg/L' },
  'inv.transfer':        { en: 'Transfer',         kn: 'ವರ್ಗಾವಣೆ',            hi: 'स्थानांतरण' },
  'inv.inStock':         { en: 'In Stock',         kn: 'ಸ್ಟಾಕ್‌ನಲ್ಲಿದೆ',      hi: 'स्टॉक में' },
  'inv.lowStock':        { en: 'Low Stock',        kn: 'ಕಡಿಮೆ ಸ್ಟಾಕ್',        hi: 'कम स्टॉक' },
  'inv.addStock':        { en: 'Add Stock',        kn: 'ಸ್ಟಾಕ್ ಸೇರಿಸಿ',       hi: 'स्टॉक जोड़ें' },
  'inv.searchProduct':   { en: 'Search product…',  kn: 'ಉತ್ಪನ್ನ ಹುಡುಕಿ…',    hi: 'उत्पाद खोजें…' },
  'inv.recentEntries':   { en: 'Recent Stock Entries', kn: 'ಇತ್ತೀಚಿನ ಸ್ಟಾಕ್ ನಮೂದುಗಳು', hi: 'हाल की स्टॉक प्रविष्टियाँ' },
} as const

export type TranslationKey = keyof typeof dict
export const TRANSLATIONS: Record<TranslationKey, Record<Lang, string>> = dict
