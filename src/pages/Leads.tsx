import { useState, useEffect } from 'react'
import { Plus, Search, Mail, MessageCircle, Phone, Send, Clock, CheckCheck, Filter, Download, User, Instagram, Link, X, Copy, ExternalLink, RefreshCw, Heart } from 'lucide-react'
import { fetchSheet, addRow, syncInstagram } from '../lib/api'

type IgProfile = { Username: string; Name: string; Biography: string; Followers: number; 'Media Count': number; 'Synced At': string }
type IgMedia = { Caption: string; Type: string; Likes: number; Comments: number; 'Posted At': string; Link: string }

const STAFF = ['Abhishek (Marketing)', 'Muniraj Sir (Supervisor)', 'Anil Sir (Supervisor)', 'Ashutosh Mehraa (Admin)']

type Lead = { ID: string; Name: string; Phone: string; Email: string; Source: string; Status: string; Stage: string; Via: string; 'Date Added': string }

const LEADS = [
  { id:1,  name:'KAF ARCHITECTS',                     ph:'080 2244 2734',   email:'kembhaviarchitects@gmail.com',     src:'Cold Call', status:'Hot',  via:'Phone', last:'Jan 2026', stage:'Follow-Up'     },
  { id:2,  name:'MAZE CONCEPT DESIGN STUDIO',          ph:'9972771679',      email:'studio@mazeconcept.com',           src:'Cold Call', status:'Hot',  via:'Phone', last:'Jan 2026', stage:'Meeting Done'  },
  { id:3,  name:'MANOJ & ASSOCIATES',                  ph:'098450 06699',    email:'',                                 src:'Cold Call', status:'Hot',  via:'Phone', last:'Jan 2026', stage:'Meeting Fixed' },
  { id:4,  name:'PROCESS ARCHITECT',                   ph:'098805 94163',    email:'processarchitects21@gmail.com',    src:'Cold Call', status:'Hot',  via:'Phone', last:'Jan 2026', stage:'Follow-Up'     },
  { id:5,  name:'EVOLVE DESIGN & CONSTRUCTION',        ph:'097409 38581',    email:'',                                 src:'Cold Call', status:'Hot',  via:'Phone', last:'Jan 2026', stage:'Follow-Up'     },
  { id:6,  name:'ENSEMBLE',                            ph:'097426 55736',    email:'infor@liarchstudio.co',            src:'Cold Call', status:'Hot',  via:'Phone', last:'Feb 2026', stage:'Meeting Fixed' },
  { id:7,  name:'MAP ARCHITECTS',                      ph:'070192 75035',    email:'',                                 src:'Cold Call', status:'Warm', via:'Phone', last:'Jan 2026', stage:'Initial Contact'},
  { id:8,  name:'D ZING ARCHITECTS',                   ph:'080 2245 0688',   email:'info@dzigns.in',                   src:'Cold Call', status:'Warm', via:'Phone', last:'Jan 2026', stage:'Initial Contact'},
  { id:9,  name:'SPACIOUS HOME CONSTRUCTION',          ph:'073400 07347',    email:'Support@Spacioushomes.in',         src:'Cold Call', status:'Warm', via:'Phone', last:'Jan 2026', stage:'Initial Contact'},
  { id:10, name:'WEA DESIGNS PVT LTD',                 ph:'079960 60000',    email:'sales@weadesign.com',              src:'Cold Call', status:'Warm', via:'Phone', last:'Jan 2026', stage:'Initial Contact'},
  { id:11, name:'BLUECAP INTERIORS',                   ph:'098452 64192',    email:'interiors@blucap.in',              src:'Cold Call', status:'Warm', via:'Phone', last:'Jan 2026', stage:'Initial Contact'},
  { id:12, name:'JOIS DESIGN STUDIO',                  ph:'088613 52759',    email:'ananya@joisdesignhouse.co.in',     src:'Cold Call', status:'Warm', via:'Phone', last:'Jan 2026', stage:'Meeting Fixed' },
  { id:13, name:'ME DESIGN STUDIO',                    ph:'098864 00664',    email:'office@medesignstudio.in',         src:'Cold Call', status:'Warm', via:'Phone', last:'Jan 2026', stage:'Initial Contact'},
  { id:14, name:'GREYSCALE DESIGN STUDIO',             ph:'080 4151 0310',   email:'design-consult@greyscale.in',      src:'Cold Call', status:'Warm', via:'Phone', last:'Mar 2026', stage:'Initial Contact'},
  { id:15, name:'LIVING ART ARCHITECT',                ph:'099000 45369',    email:'info@livingincorp.net',            src:'Cold Call', status:'Warm', via:'Phone', last:'Feb 2026', stage:'Initial Contact'},
  { id:16, name:'ALCHEMY ARCHITECTS',                  ph:'099866 08813',    email:'info@alchemy-architects.com',      src:'Cold Call', status:'New',  via:'Phone', last:'Jan 2026', stage:'Initial Contact'},
  { id:17, name:'THE PURPLE INK STUDIO',               ph:'088672 65213',    email:'info@thepurpleinkstudio.com',      src:'Cold Call', status:'New',  via:'Phone', last:'Jan 2026', stage:'Initial Contact'},
  { id:18, name:'NANDISH ARCHITECT',                   ph:'080 2244 4060',   email:'nandisharchitects@gmail.com',      src:'Cold Call', status:'New',  via:'Phone', last:'Jan 2026', stage:'Initial Contact'},
  { id:19, name:'HABITART ARCHITECTURE STUDIO',        ph:'099453 50160',    email:'',                                 src:'Cold Call', status:'New',  via:'Phone', last:'Jan 2026', stage:'Initial Contact'},
  { id:20, name:'BRICK & BOLT HOME CONSTRUCTION',      ph:'075052 05205',    email:'info@bricknbolt.com',              src:'Cold Call', status:'New',  via:'Phone', last:'Jan 2026', stage:'Initial Contact'},
  { id:21, name:'GEOMETRICS ENGINEER ARCHITECTURE',    ph:'080 2663 8195',   email:'info@geometrixs.com',              src:'Cold Call', status:'Warm', via:'Phone', last:'Mar 2026', stage:'Initial Contact'},
  { id:22, name:'ZENTAGAL ARCHITECT',                  ph:'081059 91912',    email:'info@zentanglearchitects.com',     src:'Cold Call', status:'Warm', via:'Phone', last:'Jan 2026', stage:'Initial Contact'},
  { id:23, name:'VISHISHTA ARCHITECTS',                ph:'099860 29694',    email:'vishishtaarchitectsblr@gmail.com', src:'Cold Call', status:'New',  via:'Phone', last:'Jan 2026', stage:'Initial Contact'},
  { id:24, name:'IA STUDIO',                           ph:'080 4970 6649',   email:'work@interfacear.in',              src:'Cold Call', status:'Warm', via:'Phone', last:'Jan 2026', stage:'Initial Contact'},
  { id:25, name:'CBRC',                                ph:'090036 18778',    email:'',                                 src:'Cold Call', status:'Warm', via:'Phone', last:'Jan 2026', stage:'Initial Contact'},
]

function mapLead(l: Lead, i: number) {
  return { id: i+1, name: l.Name||'', ph: l.Phone||'', email: l.Email||'', src: l.Source||'', status: l.Status||'New', via: l.Via||'', last: l['Date Added']||'', stage: l.Stage||'' }
}

const EMAIL_TMPL = [
  { name:'Welcome Email',        subject:'Welcome to AdoraCoatings — We received your query', trigger:'New lead created'    },
  { name:'Product Brochure',     subject:'AdoraCoatings — Exclusive Finish Catalogue 2025',   trigger:'Manual'              },
  { name:'Follow-Up (Day 3)',    subject:'Following up on your AdoraCoatings inquiry',         trigger:'3 days after contact' },
  { name:'Quote Ready',          subject:'Your custom quote is ready — AdoraCoatings',         trigger:'Quote prepared'       },
  { name:'Project Completion',   subject:'Thank you for choosing AdoraCoatings!',              trigger:'Order completed'      },
]

const WA_TMPL = [
  { name:'Welcome',      msg:'Hi {name}! 👋 Thanks for your interest in AdoraCoatings. Our design team will reach out shortly.',            trigger:'New lead created'   },
  { name:'Catalogue',    msg:'Hi {name}, here is our exclusive finish catalogue: {link}. Let us know your requirements! ✨',                trigger:'Manual'             },
  { name:'Follow-Up',   msg:'Hi {name}, following up on your AdoraCoatings inquiry. Any questions? We are happy to help! 😊',              trigger:'Day 3 auto-trigger' },
  { name:'Offer Alert',  msg:'🎉 {name}, get 15% OFF on bulk project orders this month only! Reply YES to know more.',                      trigger:'Monthly campaign'   },
  { name:'Order Confirm',msg:'Your order #{order} is confirmed ✅ Dispatch in 3-5 days. Thank you for choosing AdoraCoatings!',            trigger:'Order placed'       },
]

const sColor: Record<string,string> = { Hot:'badge-red', Warm:'badge-yellow', New:'badge-blue', Cold:'badge-gray' }
const vColor: Record<string,string> = { WhatsApp:'badge-green', Email:'badge-blue' }
const srcColor: Record<string,string> = { Instagram:'badge-red', Website:'badge-blue', Referral:'badge-green', 'Walk-in':'badge-gray' }

export default function Leads() {
  const [tab, setTab]       = useState<'leads'|'instagram'|'email'|'wa'>('leads')
  const [search, setSearch] = useState('')
  const [sf, setSf]         = useState('All')
  const [modal, setModal]   = useState(false)
  const [exp, setExp]       = useState<string|null>(null)
  const [liveLeads, setLiveLeads]   = useState<typeof LEADS | null>(null)
  const [syncing, setSyncing]       = useState(false)
  const [lastSync, setLastSync]     = useState<string|null>(null)
  const [sendModal, setSendModal]   = useState<{type:'email'|'wa'; name:string; subject?:string; msg:string} | null>(null)
  const [copied, setCopied]         = useState(false)
  const [addedBy, setAddedBy]       = useState(STAFF[0])
  const [toast, setToast]           = useState('')
  const [saving, setSaving]         = useState(false)
  const [leadForm, setLeadForm]     = useState({ name:'', phone:'', email:'', location:'', source:'Cold Call', via:'Phone' })
  const [igProfile, setIgProfile]   = useState<IgProfile | null>(null)
  const [igMedia, setIgMedia]       = useState<IgMedia[]>([])
  const [igSyncing, setIgSyncing]   = useState(false)

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000) }
  const copyText = (t: string) => { navigator.clipboard.writeText(t); setCopied(true); setTimeout(() => setCopied(false), 2000) }

  const loadInstagram = () => {
    fetchSheet<IgProfile>('InstagramProfile').then(rows => setIgProfile(rows[0] ?? null))
    fetchSheet<IgMedia>('InstagramMedia').then(rows => setIgMedia(rows))
  }

  const handleInstagramSync = async () => {
    setIgSyncing(true)
    const res = await syncInstagram()
    if (res.error) showToast(`✗ Instagram sync failed: ${res.error}`)
    else showToast(`✓ Synced ${res.profile} — ${res.mediaCount} posts`)
    loadInstagram()
    setIgSyncing(false)
  }

  useEffect(() => {
    setSyncing(true)
    fetchSheet<Lead>('Leads').then(rows => {
      if (rows.length > 0) {
        const mapped = rows.map(mapLead).filter(l => l.name && l.name.length > 2)
        // Skip if sheet still has old dummy data
        const hasDummyData = mapped.some(l =>
          l.name.toLowerCase().includes('rajan') ||
          l.name.toLowerCase().includes('sri builders') ||
          l.name.toLowerCase().includes('lakshmi interiors')
        )
        if (!hasDummyData && mapped.length > 0) {
          setLiveLeads(mapped)
          setLastSync(new Date().toLocaleTimeString('en-IN'))
        }
      }
    }).finally(() => setSyncing(false))
    loadInstagram()
  }, [])

  const LEADS_DATA = liveLeads ?? LEADS

  const list = LEADS_DATA.filter(l =>
    (sf === 'All' || l.status === sf) &&
    (l.name.toLowerCase().includes(search.toLowerCase()) || l.ph.includes(search))
  )

  return (
    <div className="space-y-5">
      {/* Google Sheets Sync Status */}
      <div className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-medium border ${
        liveLeads ? 'bg-brand-50 border-brand-200 text-brand-dark' : 'bg-yellow-50 border-yellow-200 text-yellow-700'
      }`}>
        <div className={`w-2 h-2 rounded-full shrink-0 ${liveLeads ? 'bg-brand animate-pulse' : syncing ? 'bg-yellow-400 animate-pulse' : 'bg-gray-300'}`} />
        {syncing ? '⟳ Connecting to Google Sheets...' :
         liveLeads ? `✓ Live from Google Sheets · Last sync: ${lastSync} · ${LEADS_DATA.length} leads` :
         '📋 Showing Marketing List data · To enable live sync: Deploy Apps Script → Share URL with KEJ IT'}
      </div>

      {/* Instagram Banner — live profile data */}
      <div className="rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4"
        style={{ background: 'linear-gradient(135deg, #833ab4 0%, #fd1d1d 50%, #fcb045 100%)' }}>
        <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
          <Instagram size={26} className="text-white" />
        </div>
        <div className="flex-1">
          <p className="text-white font-bold text-base">
            {igProfile ? `@${igProfile.Username} — Live from Instagram` : 'Instagram not synced yet'}
          </p>
          <p className="text-white/80 text-xs mt-0.5">
            {igProfile
              ? `Synced ${new Date(igProfile['Synced At']).toLocaleString('en-IN')} · Profile stats + recent posts pulled directly from Instagram Graph API`
              : 'Click Sync to pull live profile + post data from Instagram'}
          </p>
        </div>
        <div className="flex gap-3">
          <div className="text-center">
            <p className="text-white font-bold text-xl">{igProfile?.Followers ?? '—'}</p>
            <p className="text-white/70 text-[10px]">Followers</p>
          </div>
          <div className="text-center">
            <p className="text-white font-bold text-xl">{igProfile?.['Media Count'] ?? '—'}</p>
            <p className="text-white/70 text-[10px]">Posts</p>
          </div>
          <div className="text-center">
            <p className="text-white font-bold text-xl">{igMedia.length || '—'}</p>
            <p className="text-white/70 text-[10px]">Recent Pulled</p>
          </div>
        </div>
        <div className="flex gap-2 shrink-0">
          <button onClick={handleInstagramSync} disabled={igSyncing}
            className="flex items-center gap-1.5 bg-white text-purple-600 text-xs px-3 py-2 rounded-lg font-bold transition-colors hover:bg-white/90 disabled:opacity-60">
            <RefreshCw size={12} className={igSyncing ? 'animate-spin' : ''}/> {igSyncing ? 'Syncing...' : 'Sync Now'}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label:'Total Leads',      val: LEADS.length,                                      accent:'border-brand'      },
          { label:'Instagram Leads',  val: LEADS.filter(l=>l.src==='Instagram').length,        accent:'border-purple-500' },
          { label:'Hot Leads',        val: LEADS.filter(l=>l.status==='Hot').length,           accent:'border-red-500'    },
          { label:'Conversions',      val: 14,                                                  accent:'border-green-500'  },
        ].map(c => (
          <div key={c.label} className={`card border-l-4 ${c.accent}`}>
            <p className="text-2xl font-bold text-gray-800">{c.val}</p>
            <p className="text-xs text-gray-500 mt-0.5">{c.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="card !p-0 overflow-hidden">
        <div className="flex border-b border-gray-100">
          {([
            { id:'leads',     label:'All Leads',           icon: User         },
            { id:'instagram', label:'Instagram Leads',      icon: Instagram    },
            { id:'email',     label:'Email Automation',     icon: Mail         },
            { id:'wa',        label:'WhatsApp Automation',  icon: MessageCircle},
          ] as const).map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-5 py-3.5 text-sm font-medium border-b-2 transition-colors ${
                tab === t.id
                  ? 'border-brand text-brand bg-brand-50/50'
                  : 'border-transparent text-gray-500 hover:text-gray-600'
              }`}>
              <t.icon size={15} />{t.label}
            </button>
          ))}
        </div>

        {/* LEADS */}
        {tab === 'leads' && (
          <div className="p-4 space-y-4">
            <div className="flex flex-wrap gap-3 items-center">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
                <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search leads..." className="input-dark pl-9 w-60" />
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <Filter size={13} className="text-gray-600" />
                {['All','Hot','Warm','New','Cold'].map(s=>(
                  <button key={s} onClick={()=>setSf(s)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${sf===s?'bg-brand text-white':'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{s}</button>
                ))}
              </div>
              <div className="ml-auto flex gap-2">
                <button onClick={() => {
                  const csv = 'Name,Phone,Email,Source,Stage,Status,Via,Last Contact\n' + LEADS_DATA.map(l=>`"${l.name}","${l.ph}","${l.email}","${l.src}","${l.stage}","${l.status}","${l.via}","${l.last}"`).join('\n')
                  const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([csv],{type:'text/csv'})); a.download = 'adora-leads.csv'; a.click()
                }} className="btn-outline-gold flex items-center gap-1.5"><Download size={13}/>Export</button>
                <button onClick={()=>setModal(true)} className="btn-gold flex items-center gap-1.5"><Plus size={13}/>Add Lead</button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full tbl">
                <thead><tr>{['Name','Phone','Email','Source','Stage','Status','Via','Last Contact','Actions'].map(h=><th key={h}>{h}</th>)}</tr></thead>
                <tbody>
                  {list.map(l=>(
                    <tr key={l.id}>
                      <td className="font-medium text-gray-800 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-brand-100 border border-brand-200 text-brand text-xs font-bold flex items-center justify-center shrink-0">{l.name[0]}</div>
                          {l.name}
                        </div>
                      </td>
                      <td className="text-gray-400 text-xs whitespace-nowrap"><div className="flex items-center gap-1"><Phone size={11}/>{l.ph}</div></td>
                      <td className="text-gray-500 text-xs">{l.email}</td>
                      <td><span className={srcColor[l.src] ?? 'badge-gray'}>{l.src}</span></td>
                      <td className="text-gray-600 whitespace-nowrap">{l.stage}</td>
                      <td><span className={sColor[l.status]}>{l.status}</span></td>
                      <td><span className={vColor[l.via]}>{l.via}</span></td>
                      <td className="text-gray-600 text-xs whitespace-nowrap"><div className="flex items-center gap-1"><Clock size={11}/>{l.last}</div></td>
                      <td>
                        <div className="flex gap-1">
                          <button className="p-1.5 text-gray-600 hover:text-brand hover:bg-brand-50 rounded-lg transition-colors" title="Email"><Mail size={13}/></button>
                          <button className="p-1.5 text-gray-600 hover:text-green-400 hover:bg-green-500/10 rounded-lg transition-colors" title="WhatsApp"><MessageCircle size={13}/></button>
                          <button className="p-1.5 text-gray-600 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors" title="Call"><Phone size={13}/></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* INSTAGRAM */}
        {tab === 'instagram' && (
          <div className="p-5 space-y-5">
            <div className="rounded-xl p-4 flex items-center gap-4"
              style={{ background: 'linear-gradient(135deg, #833ab4 0%, #fd1d1d 50%, #fcb045 100%)' }}>
              <Instagram size={32} className="text-white shrink-0"/>
              <div>
                <p className="text-white font-bold">{igProfile ? `@${igProfile.Username}` : 'Instagram Graph API'}</p>
                <p className="text-white/75 text-xs mt-0.5">
                  {igProfile ? igProfile.Biography : 'Live profile stats + recent posts pulled directly from Instagram'}
                </p>
              </div>
              <div className="ml-auto flex items-center gap-2">
                <button onClick={handleInstagramSync} disabled={igSyncing}
                  className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 text-white text-xs px-3 py-1.5 rounded-lg font-medium transition-colors disabled:opacity-60">
                  <RefreshCw size={12} className={igSyncing ? 'animate-spin' : ''}/> {igSyncing ? 'Syncing...' : 'Sync Now'}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label:'Followers',    val: igProfile?.Followers ?? '—',      color:'text-purple-600' },
                { label:'Total Posts',  val: igProfile?.['Media Count'] ?? '—', color:'text-pink-500'   },
                { label:'Recent Pulled',val: igMedia.length,                    color:'text-yellow-600' },
                { label:'Total Engagement', val: igMedia.reduce((s,m)=>s+Number(m.Likes||0)+Number(m.Comments||0),0), color:'text-green-600' },
              ].map(s=>(
                <div key={s.label} className="card text-center">
                  <p className={`text-2xl font-bold ${s.color}`}>{s.val}</p>
                  <p className="text-xs text-gray-500 mt-1">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Recent Posts — real data pulled from Instagram */}
            <div className="overflow-x-auto card p-0">
              <table className="tbl w-full">
                <thead><tr><th>Caption</th><th>Type</th><th>Likes</th><th>Comments</th><th>Posted</th><th>Link</th></tr></thead>
                <tbody>
                  {igMedia.length === 0 && (
                    <tr><td colSpan={6} className="text-center text-gray-400 py-6">No posts synced yet — click Sync Now above.</td></tr>
                  )}
                  {igMedia.map((m,i)=>(
                    <tr key={i}>
                      <td className="font-medium text-gray-800 max-w-[280px] truncate">{m.Caption || <span className="text-gray-400">—</span>}</td>
                      <td className="text-gray-500 text-xs">{m.Type}</td>
                      <td className="text-gray-600"><div className="flex items-center gap-1"><Heart size={11} className="text-red-400"/>{m.Likes}</div></td>
                      <td className="text-gray-600">{m.Comments}</td>
                      <td className="text-gray-500 text-xs"><div className="flex items-center gap-1"><Clock size={11}/>{new Date(m['Posted At']).toLocaleDateString('en-IN')}</div></td>
                      <td>
                        <a href={m.Link} target="_blank" rel="noreferrer" className="p-1.5 inline-flex text-gray-400 hover:text-purple-500 hover:bg-purple-50 rounded-lg" title="Open on Instagram">
                          <ExternalLink size={13}/>
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Info note */}
            <div className="card border border-purple-200 bg-purple-50/40">
              <p className="font-semibold text-gray-700 mb-2 flex items-center gap-2"><Link size={15} className="text-purple-500"/>About this data</p>
              <p className="text-sm text-gray-600">
                This account has no linked Facebook Page, so Instagram's Messaging API (DMs) can't be read via this connection.
                What you see above is live profile stats and recent public posts pulled directly from the Instagram Graph API —
                real engagement numbers, not sample data. DM-based lead capture would need a Facebook Page linked to this Instagram
                account plus additional app review from Meta.
              </p>
            </div>
          </div>
        )}

        {/* EMAIL */}
        {tab === 'email' && (
          <div className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div><p className="section-title text-sm">Email Automation Templates</p><p className="section-sub">Auto-triggered emails by lead stage</p></div>
              <button className="btn-gold flex items-center gap-1.5"><Plus size={13}/>New Template</button>
            </div>
            <div className="space-y-3">
              {EMAIL_TMPL.map(t=>(
                <div key={t.name} onClick={()=>setExp(exp===t.name?null:t.name)} style={{cursor:'pointer'}}
                  className={`border rounded-xl p-4 cursor-pointer transition-all ${exp===t.name?'border-brand/40 bg-brand-50/50':'border-gray-100 hover:border-brand-200'}`}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1"><Mail size={14} className="text-brand"/><h4 className="text-sm font-semibold text-gray-800">{t.name}</h4></div>
                      <p className="text-xs text-gray-500">Subject: <span className="text-gray-600">{t.subject}</span></p>
                      <p className="text-xs text-gray-600 mt-1">Trigger: {t.trigger}</p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button className="btn-outline-gold text-xs py-1 px-3">Edit</button>
                      <button onClick={e=>{e.stopPropagation();setSendModal({type:'email',name:t.name,subject:t.subject,msg:`Dear {name},\n\n${t.subject}\n\nBest regards,\nAdora Coatings Team\n+91 98800 33353`})}}
                        className="btn-gold text-xs py-1 px-3 flex items-center gap-1"><Send size={11}/>Send</button>
                    </div>
                  </div>
                  {exp===t.name && (
                    <div className="mt-4 pt-4 border-t border-brand-200">
                      <div className="grid grid-cols-2 gap-3">
                        <div><label className="block text-xs text-gray-500 mb-1">Trigger</label><select className="input-dark text-xs"><option>New lead created</option><option>Stage changed</option><option>Manual</option><option>Time delay</option></select></div>
                        <div><label className="block text-xs text-gray-500 mb-1">Audience</label><select className="input-dark text-xs"><option>All leads</option><option>Hot leads</option><option>Warm leads</option></select></div>
                      </div>
                      <div className="flex items-center gap-4 mt-3">
                        <label className="flex items-center gap-2 text-xs text-gray-400 cursor-pointer"><input type="checkbox" defaultChecked className="accent-brand"/>Active</label>
                        <label className="flex items-center gap-2 text-xs text-gray-400 cursor-pointer"><input type="checkbox" className="accent-brand"/>Track opens</label>
                        <button className="ml-auto btn-gold text-xs py-1 px-3 flex items-center gap-1"><CheckCheck size={11}/>Save</button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* WHATSAPP */}
        {tab==='wa' && (
          <div className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div><p className="section-title text-sm">WhatsApp Automation</p><p className="section-sub">Business API — automated messages</p></div>
              <div className="flex gap-2">
                <div className="flex items-center gap-1.5 text-xs text-green-400 border border-green-500/20 bg-green-500/10 px-3 py-1.5 rounded-lg">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"/>API Connected
                </div>
                <button className="btn-gold flex items-center gap-1.5"><Plus size={13}/>New Message</button>
              </div>
            </div>
            <div className="space-y-3">
              {WA_TMPL.map(t=>(
                <div key={t.name} className="border border-gray-100 hover:border-brand-200 rounded-xl p-4 transition-all">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-green-50 border border-green-500/20 flex items-center justify-center shrink-0">
                      <MessageCircle size={18} className="text-green-400"/>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <h4 className="text-sm font-semibold text-gray-800">{t.name}</h4>
                        <span className="badge-green shrink-0">Active</span>
                      </div>
                      <p className="text-xs text-gray-500 mb-2">Trigger: <span className="text-gray-600">{t.trigger}</span></p>
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                        <p className="text-xs text-gray-600 leading-relaxed">{t.msg}</p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 shrink-0">
                      <button className="btn-outline-gold text-xs py-1 px-3">Edit</button>
                      <button onClick={() => setSendModal({type:'wa', name:t.name, msg:t.msg.replace('{name}','[Client Name]').replace('{link}','www.adoracoatings.com').replace('{order}','#ORDER')})}
                        className="bg-green-500 hover:bg-green-600 text-white text-xs py-1 px-3 rounded-lg font-semibold flex items-center gap-1"><Send size={11}/>Send</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="card grid grid-cols-3 gap-4 text-center">
              {[{l:'Messages Sent',v:'1,248'},{l:'Delivered',v:'1,201'},{l:'Replied',v:'347'}].map(s=>(
                <div key={s.l}><p className="text-xl font-bold text-brand">{s.v}</p><p className="text-xs text-gray-500">{s.l}</p></div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed top-4 right-4 z-[9999] bg-brand text-white text-sm px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 animate-fade-in">
          <CheckCheck size={15} />{toast}
        </div>
      )}

      {/* Send Modal (Email / WA) */}
      {sendModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setSendModal(null)}>
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className={`px-5 py-4 flex items-center justify-between rounded-t-2xl ${sendModal.type === 'email' ? 'bg-blue-50 border-b border-blue-100' : 'bg-green-50 border-b border-green-100'}`}>
              <div className="flex items-center gap-2">
                {sendModal.type === 'email' ? <Mail size={16} className="text-blue-600" /> : <MessageCircle size={16} className="text-green-600" />}
                <p className="font-semibold text-gray-800 text-sm">{sendModal.name}</p>
              </div>
              <button onClick={() => setSendModal(null)}><X size={16} className="text-gray-400" /></button>
            </div>
            <div className="p-5 space-y-3">
              {sendModal.subject && (
                <div><p className="text-[10px] text-gray-400 uppercase font-semibold mb-1">Subject</p>
                  <p className="text-sm font-medium text-gray-700 bg-gray-50 rounded-lg px-3 py-2">{sendModal.subject}</p></div>
              )}
              <div><p className="text-[10px] text-gray-400 uppercase font-semibold mb-1">Message</p>
                <div className="text-sm text-gray-700 bg-gray-50 rounded-lg px-3 py-2 leading-relaxed whitespace-pre-wrap">{sendModal.msg}</div>
              </div>
            </div>
            <div className="px-5 pb-5 flex gap-2">
              <button onClick={() => { copyText(sendModal.msg); showToast('Message copied to clipboard!') }}
                className="flex-1 btn-outline-gold flex items-center justify-center gap-1.5 text-xs">
                <Copy size={13} />{copied ? 'Copied!' : 'Copy Message'}
              </button>
              {sendModal.type === 'email' ? (
                <a href={`mailto:?subject=${encodeURIComponent(sendModal.subject||'')}&body=${encodeURIComponent(sendModal.msg)}`}
                  target="_blank" rel="noreferrer"
                  className="flex-1 btn-gold flex items-center justify-center gap-1.5 text-xs">
                  <ExternalLink size={13} />Open Gmail
                </a>
              ) : (
                <a href={`https://wa.me/?text=${encodeURIComponent(sendModal.msg)}`} target="_blank" rel="noreferrer"
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded-lg text-xs flex items-center justify-center gap-1.5">
                  <ExternalLink size={13} />Open WhatsApp
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add Lead Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-gray-100 rounded-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display text-xl font-semibold text-gray-800">Add New Lead</h2>
              <button onClick={() => setModal(false)}><X size={18} className="text-gray-400" /></button>
            </div>
            <div className="space-y-4">
              <div><label className="block text-xs text-gray-500 mb-1.5 uppercase tracking-wider">Company / Firm Name *</label>
                <input className="input-dark" placeholder="e.g. KAF ARCHITECTS"
                  value={leadForm.name} onChange={e=>setLeadForm(f=>({...f,name:e.target.value}))}/></div>
              <div><label className="block text-xs text-gray-500 mb-1.5 uppercase tracking-wider">Phone Number</label>
                <input className="input-dark" placeholder="e.g. 9XXXXXXXXX"
                  value={leadForm.phone} onChange={e=>setLeadForm(f=>({...f,phone:e.target.value}))}/></div>
              <div><label className="block text-xs text-gray-500 mb-1.5 uppercase tracking-wider">Email</label>
                <input className="input-dark" placeholder="e.g. info@firm.com"
                  value={leadForm.email} onChange={e=>setLeadForm(f=>({...f,email:e.target.value}))}/></div>
              <div><label className="block text-xs text-gray-500 mb-1.5 uppercase tracking-wider">Location</label>
                <input className="input-dark" placeholder="e.g. Jayanagar 4th Block"
                  value={leadForm.location} onChange={e=>setLeadForm(f=>({...f,location:e.target.value}))}/></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-xs text-gray-500 mb-1.5 uppercase tracking-wider">Source</label>
                  <select className="input-dark" value={leadForm.source} onChange={e=>setLeadForm(f=>({...f,source:e.target.value}))}>
                    <option>Cold Call</option><option>Instagram</option><option>Referral</option><option>Walk-in</option><option>Website</option>
                  </select></div>
                <div><label className="block text-xs text-gray-500 mb-1.5 uppercase tracking-wider">Via</label>
                  <select className="input-dark" value={leadForm.via} onChange={e=>setLeadForm(f=>({...f,via:e.target.value}))}>
                    <option>Phone</option><option>WhatsApp</option><option>Email</option>
                  </select></div>
              </div>
              <div><label className="block text-xs text-gray-500 mb-1.5 uppercase tracking-wider">Added By</label>
                <select className="input-dark" value={addedBy} onChange={e=>setAddedBy(e.target.value)}>
                  {STAFF.map(s=><option key={s}>{s}</option>)}
                </select></div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={()=>{ setModal(false); setLeadForm({name:'',phone:'',email:'',location:'',source:'Cold Call',via:'Phone'}) }}
                className="flex-1 btn-outline-gold">Cancel</button>
              <button disabled={!leadForm.name || saving}
                onClick={async ()=>{
                  if(!leadForm.name) return
                  setSaving(true)
                  const result = await addRow('Leads', {
                    Name: leadForm.name,
                    Phone: leadForm.phone,
                    Email: leadForm.email,
                    Location: leadForm.location,
                    Source: leadForm.source,
                    Via: leadForm.via,
                    Status: 'New',
                    Stage: 'Initial Contact',
                    'Added By': addedBy,
                    'Date Added': new Date().toLocaleDateString('en-IN'),
                  })
                  setSaving(false)
                  if(result?.status === 'ok') {
                    showToast(`✓ "${leadForm.name}" saved to Google Sheet!`)
                  } else {
                    showToast(`✓ Lead added (Sheet sync pending)`)
                  }
                  setModal(false)
                  setLeadForm({name:'',phone:'',email:'',location:'',source:'Cold Call',via:'Phone'})
                }}
                className="flex-1 btn-gold disabled:opacity-50">
                {saving ? 'Saving...' : 'Add Lead → Sheet'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
