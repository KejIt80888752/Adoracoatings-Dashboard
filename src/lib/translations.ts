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

  // ── Dashboard ──
  'dash.totalRevenue':      { en: 'Total Revenue',        kn: 'ಒಟ್ಟು ಆದಾಯ',              hi: 'कुल राजस्व' },
  'dash.grossProfit':       { en: 'Gross Profit',         kn: 'ಒಟ್ಟು ಲಾಭ',                hi: 'सकल लाभ' },
  'dash.totalCollected':    { en: 'Total Collected',      kn: 'ಒಟ್ಟು ಸಂಗ್ರಹಿಸಿದ್ದು',       hi: 'कुल वसूली' },
  'dash.activeProjects':    { en: 'Active Projects',      kn: 'ಸಕ್ರಿಯ ಯೋಜನೆಗಳು',           hi: 'सक्रिय परियोजनाएं' },
  'dash.revenueLessGst':    { en: 'Revenue less GST',     kn: 'GST ಕಳೆದ ಆದಾಯ',            hi: 'GST घटाकर राजस्व' },
  'dash.inclAdvances':      { en: 'Incl. advances',       kn: 'ಅಡ್ವಾನ್ಸ್ ಸೇರಿ',           hi: 'अग्रिम सहित' },
  'dash.invoice':           { en: 'invoice',              kn: 'ಇನ್‌ವಾಯ್ಸ್',               hi: 'इनवॉइस' },
  'dash.invoices':          { en: 'invoices',             kn: 'ಇನ್‌ವಾಯ್ಸ್‌ಗಳು',          hi: 'इनवॉइस' },
  'dash.monthlyRevenueProfit': { en: 'Monthly Revenue & Profit', kn: 'ಮಾಸಿಕ ಆದಾಯ ಮತ್ತು ಲಾಭ', hi: 'मासिक राजस्व और लाभ' },
  'dash.expenseBreakdown':  { en: 'Expense Breakdown',    kn: 'ಖರ್ಚು ವಿಭಜನೆ',              hi: 'खर्च विवरण' },
  'dash.totalFY':           { en: 'Total FY 2026–27',     kn: 'ಒಟ್ಟು FY 2026–27',          hi: 'कुल FY 2026–27' },
  'dash.topProjectsByRevenue': { en: 'Top Projects by Revenue', kn: 'ಆದಾಯದ ಪ್ರಕಾರ ಟಾಪ್ ಯೋಜನೆಗಳು', hi: 'राजस्व अनुसार शीर्ष परियोजनाएं' },
  'dash.noProjectsYet':     { en: 'No projects yet',      kn: 'ಇನ್ನೂ ಯೋಜನೆಗಳಿಲ್ಲ',          hi: 'अभी तक कोई परियोजना नहीं' },
  'dash.alerts':            { en: 'Alerts',               kn: 'ಎಚ್ಚರಿಕೆಗಳು',                hi: 'चेतावनियाँ' },
  'dash.noAlerts':          { en: 'No alerts',            kn: 'ಎಚ್ಚರಿಕೆಗಳಿಲ್ಲ',             hi: 'कोई चेतावनी नहीं' },
  'dash.recentProjects':    { en: 'Recent Projects',      kn: 'ಇತ್ತೀಚಿನ ಯೋಜನೆಗಳು',          hi: 'हाल की परियोजनाएं' },
  'dash.viewAll':           { en: 'View all',             kn: 'ಎಲ್ಲಾ ನೋಡಿ',                 hi: 'सभी देखें' },
  'dash.noRecentProjects':  { en: 'No recent projects',   kn: 'ಇತ್ತೀಚಿನ ಯೋಜನೆಗಳಿಲ್ಲ',        hi: 'कोई हाल की परियोजना नहीं' },
  'dash.hasDueOn':          { en: 'has {amt} due on {inv}', kn: '{inv} ನಲ್ಲಿ {amt} ಬಾಕಿ ಇದೆ', hi: '{inv} पर {amt} बकाया है' },
  'dash.allCollected':      { en: 'All invoices fully collected', kn: 'ಎಲ್ಲಾ ಇನ್‌ವಾಯ್ಸ್‌ಗಳು ಸಂಪೂರ್ಣ ಸಂಗ್ರಹವಾಗಿವೆ', hi: 'सभी इनवॉइस पूरी तरह वसूल हो गए हैं' },

  // ── Quotation ──
  'quo.title':          { en: 'Quotations',            kn: 'ಕೋಟೇಶನ್‌ಗಳು',              hi: 'कोटेशन' },
  'quo.subtitle':       { en: 'All project quotations for FY 2026-27', kn: 'FY 2026-27ಗಾಗಿ ಎಲ್ಲಾ ಯೋಜನೆ ಕೋಟೇಶನ್‌ಗಳು', hi: 'FY 2026-27 के लिए सभी परियोजना कोटेशन' },
  'quo.list':           { en: 'Quotation List',        kn: 'ಕೋಟೇಶನ್ ಪಟ್ಟಿ',            hi: 'कोटेशन सूची' },
  'quo.new':            { en: 'New Quotation',         kn: 'ಹೊಸ ಕೋಟೇಶನ್',              hi: 'नया कोटेशन' },
  'quo.totalQuotations':{ en: 'Total Quotations',      kn: 'ಒಟ್ಟು ಕೋಟೇಶನ್‌ಗಳು',        hi: 'कुल कोटेशन' },
  'quo.totalValue':     { en: 'Total Value',           kn: 'ಒಟ್ಟು ಮೌಲ್ಯ',              hi: 'कुल मूल्य' },
  'quo.completed':      { en: 'Completed',             kn: 'ಪೂರ್ಣಗೊಂಡಿದೆ',            hi: 'पूर्ण' },
  'quo.pendingProgress':{ en: 'Pending / In Progress', kn: 'ಬಾಕಿ / ಪ್ರಗತಿಯಲ್ಲಿದೆ',      hi: 'लंबित / प्रगति में' },
  'quo.searchPlaceholder': { en: 'Search client or quotation #…', kn: 'ಗ್ರಾಹಕ ಅಥವಾ ಕೋಟೇಶನ್ # ಹುಡುಕಿ…', hi: 'ग्राहक या कोटेशन # खोजें…' },
  'quo.quotationNo':    { en: 'Quotation #',           kn: 'ಕೋಟೇಶನ್ #',                hi: 'कोटेशन #' },
  'quo.client':         { en: 'Client',                kn: 'ಗ್ರಾಹಕ',                   hi: 'ग्राहक' },
  'quo.total':          { en: 'Total',                 kn: 'ಒಟ್ಟು',                    hi: 'कुल' },
  'quo.grandTotal':     { en: 'Grand Total',           kn: 'ಒಟ್ಟು ಮೊತ್ತ',              hi: 'कुल राशि' },
  'quo.workOrder':      { en: 'Work Order',            kn: 'ಕೆಲಸದ ಆದೇಶ',               hi: 'कार्य आदेश' },
  'quo.email':          { en: 'Email',                 kn: 'ಇಮೇಲ್',                    hi: 'ईमेल' },
  'quo.whatsapp':       { en: 'WhatsApp',              kn: 'ವಾಟ್ಸಾಪ್',                 hi: 'व्हाट्सएप' },
  'quo.loading':        { en: 'Loading…',              kn: 'ಲೋಡ್ ಆಗುತ್ತಿದೆ…',          hi: 'लोड हो रहा है…' },
  'quo.noMatch':        { en: 'No quotations match your search.', kn: 'ನಿಮ್ಮ ಹುಡುಕಾಟಕ್ಕೆ ಯಾವುದೇ ಕೋಟೇಶನ್ ಹೊಂದಿಕೆಯಾಗಲಿಲ್ಲ.', hi: 'आपकी खोज से कोई कोटेशन मेल नहीं खाता.' },
  'quo.noneYet':        { en: 'No quotations yet.',   kn: 'ಇನ್ನೂ ಯಾವುದೇ ಕೋಟೇಶನ್ ಇಲ್ಲ.', hi: 'अभी तक कोई कोटेशन नहीं.' },

  // ── Billing / Invoice ──
  'bill.title':          { en: 'Billing',              kn: 'ಬಿಲ್ಲಿಂಗ್',                hi: 'बिलिंग' },
  'bill.taxInvoice':     { en: 'Tax Invoice',          kn: 'ತೆರಿಗೆ ಇನ್‌ವಾಯ್ಸ್',        hi: 'टैक्स इनवॉइस' },
  'bill.proformaInvoice':{ en: 'Proforma Invoice',     kn: 'ಪ್ರೊಫಾರ್ಮಾ ಇನ್‌ವಾಯ್ಸ್',    hi: 'प्रोफार्मा इनवॉइस' },
  'bill.challan':        { en: 'Challan',              kn: 'ಚಲನ್',                     hi: 'चालान' },
  'bill.documentList':   { en: 'Document List',        kn: 'ದಾಖಲೆ ಪಟ್ಟಿ',              hi: 'दस्तावेज़ सूची' },
  'bill.newDocument':    { en: 'New Document',         kn: 'ಹೊಸ ದಾಖಲೆ',                hi: 'नया दस्तावेज़' },
  'bill.taxInvoices':    { en: 'Tax Invoices',         kn: 'ತೆರಿಗೆ ಇನ್‌ವಾಯ್ಸ್‌ಗಳು',    hi: 'टैक्स इनवॉइस' },
  'bill.proformaInvoices':{ en: 'Proforma Invoices',   kn: 'ಪ್ರೊಫಾರ್ಮಾ ಇನ್‌ವಾಯ್ಸ್‌ಗಳು', hi: 'प्रोफार्मा इनवॉइस' },
  'bill.deliveryChallans':{ en: 'Delivery Challans',   kn: 'ಡೆಲಿವರಿ ಚಲನ್‌ಗಳು',          hi: 'डिलीवरी चालान' },
  'bill.invoiceNo':      { en: 'Invoice #',            kn: 'ಇನ್‌ವಾಯ್ಸ್ #',             hi: 'इनवॉइस #' },
  'bill.challanNo':      { en: 'Challan #',            kn: 'ಚಲನ್ #',                   hi: 'चालान #' },
  'bill.party':          { en: 'Party',                kn: 'ಪಾರ್ಟಿ',                   hi: 'पार्टी' },
  'bill.clientProject':  { en: 'Client / Project',     kn: 'ಗ್ರಾಹಕ / ಯೋಜನೆ',            hi: 'ग्राहक / परियोजना' },
  'bill.amount':         { en: 'Amount',               kn: 'ಮೊತ್ತ',                    hi: 'राशि' },
  'bill.view':           { en: 'View',                 kn: 'ವೀಕ್ಷಿಸಿ',                 hi: 'देखें' },
} as const

export type TranslationKey = keyof typeof dict
export const TRANSLATIONS: Record<TranslationKey, Record<Lang, string>> = dict
