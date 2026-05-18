import { useState } from 'react'
import { Plus, Eye, MapPin, Calendar } from 'lucide-react'

const PROJECTS = [
  { id:1,  title:'The Leela Residences',      cat:'Metallic Wall Finishes',    city:'Chennai',   year:2024, finish:'Metallic Silver & Gold Blend',  area:'8,400 sq.ft',  status:'Completed' },
  { id:2,  title:'Prestige Lakeside Villa',   cat:'Moroccan Wall Finishes',    city:'Bangalore', year:2024, finish:'Desert Sand Moroccan',           area:'5,200 sq.ft',  status:'Completed' },
  { id:3,  title:'ITC Grand Hotel Lobby',     cat:'Decorative Wall Finishes',  city:'Chennai',   year:2023, finish:'Venetian Plaster Premium',       area:'12,000 sq.ft', status:'Completed' },
  { id:4,  title:'SOBHA Dream Acres',         cat:'Exterior Finishes',         city:'Bangalore', year:2024, finish:'Smooth Exterior + Texture Coat', area:'34,000 sq.ft', status:'Ongoing'   },
  { id:5,  title:'Brigade Orchards Club',     cat:'Designer Flooring',         city:'Bangalore', year:2023, finish:'Micro Cement + Anti-Skid',       area:'9,800 sq.ft',  status:'Completed' },
  { id:6,  title:'Phoenix Palladium Mall',    cat:'Metallic Wall Finishes',    city:'Mumbai',    year:2024, finish:'Copper Metallic Commercial',     area:'22,000 sq.ft', status:'Completed' },
  { id:7,  title:'Hiranandani Estate Villas', cat:'Greek Lime Plaster',        city:'Mumbai',    year:2024, finish:'Classic Lime Venetian',          area:'6,100 sq.ft',  status:'Ongoing'   },
  { id:8,  title:'Salarpuria Magnificia',     cat:'Decorative Wall Finishes',  city:'Hyderabad', year:2023, finish:'Rustic Stone Effect',            area:'7,200 sq.ft',  status:'Completed' },
  { id:9,  title:'DLF Ultima Tower',          cat:'Exterior Finishes',         city:'Delhi',     year:2024, finish:'Exterior Smooth Premium',        area:'48,000 sq.ft', status:'Ongoing'   },
  { id:10, title:'Naveen Corporate Park',     cat:'Floor Finishes',            city:'Chennai',   year:2023, finish:'Floor Hardener Industrial',      area:'15,000 sq.ft', status:'Completed' },
]

const CATS = ['All', 'Metallic Wall Finishes', 'Moroccan Wall Finishes', 'Decorative Wall Finishes', 'Exterior Finishes', 'Designer Flooring', 'Greek Lime Plaster', 'Floor Finishes']
const catColors: Record<string, string> = {
  'Metallic Wall Finishes':   'border-yellow-500/50 bg-yellow-500/5',
  'Moroccan Wall Finishes':   'border-orange-500/50 bg-orange-500/5',
  'Decorative Wall Finishes': 'border-purple-500/50 bg-purple-500/5',
  'Exterior Finishes':        'border-blue-500/50 bg-blue-500/5',
  'Designer Flooring':        'border-green-500/50 bg-green-500/5',
  'Greek Lime Plaster':       'border-pink-500/50 bg-pink-500/5',
  'Floor Finishes':           'border-gray-500/50 bg-gray-500/5',
}

export default function Portfolio() {
  const [cat, setCat] = useState('All')

  const list = PROJECTS.filter(p => cat === 'All' || p.cat === cat)

  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label:'Total Projects',  val: PROJECTS.length },
          { label:'Completed',       val: PROJECTS.filter(p => p.status === 'Completed').length },
          { label:'Ongoing',         val: PROJECTS.filter(p => p.status === 'Ongoing').length },
          { label:'Cities Covered',  val: [...new Set(PROJECTS.map(p => p.city))].length },
        ].map(s => (
          <div key={s.label} className="card text-center">
            <p className="font-display text-3xl font-bold text-brand-gold">{s.val}</p>
            <p className="text-xs text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="card">
        <div className="flex items-center gap-2 flex-wrap">
          {CATS.map(c => (
            <button key={c} onClick={() => setCat(c)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${cat === c ? 'bg-brand-gold text-black' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}>
              {c}
            </button>
          ))}
          <button className="ml-auto btn-gold flex items-center gap-1.5"><Plus size={13} />Add Project</button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {list.map(p => (
          <div key={p.id} className={`card border ${catColors[p.cat] ?? 'border-brand-border'} group cursor-pointer hover:border-brand-gold/40 transition-all`}>
            {/* Placeholder image area */}
            <div className="w-full h-36 rounded-lg bg-brand-border/50 mb-4 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-brand-gold/10 to-transparent" />
              <p className="text-brand-gold/40 text-xs font-medium z-10">Project Image</p>
              <button className="absolute top-2 right-2 p-1.5 bg-black/60 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity text-brand-gold">
                <Eye size={13} />
              </button>
            </div>

            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-sm font-semibold text-white leading-tight">{p.title}</h3>
                <span className={p.status === 'Completed' ? 'badge-green shrink-0' : 'badge-yellow shrink-0'}>{p.status}</span>
              </div>
              <p className="text-xs text-brand-gold">{p.finish}</p>
              <div className="flex items-center gap-3 text-xs text-gray-500">
                <span className="flex items-center gap-1"><MapPin size={11} />{p.city}</span>
                <span className="flex items-center gap-1"><Calendar size={11} />{p.year}</span>
                <span className="ml-auto text-gray-400">{p.area}</span>
              </div>
              <div className="pt-1">
                <span className={`badge text-[10px] border ${catColors[p.cat]?.replace('bg-','').replace('/5','')}`}>{p.cat}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
