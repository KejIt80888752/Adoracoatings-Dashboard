import { useCallback, useEffect, useMemo, useState } from 'react'
import { RefreshCw, CheckCircle2 } from 'lucide-react'
import { fetchSheet, deleteRow } from '../../lib/api'
import { addRowVerified, replaceRowSafely } from '../../lib/safeSave'

type ProductRow = { Name: string; Category: string; 'Pack Size': string; Unit: string; Rate: string; GST: string }
type Product = ProductRow & { rowIndex: number }
type StockLite = { name: string; unit: string; packSize: string }

const normName = (n: string) => (n || '').toUpperCase().replace(/[^A-Z0-9]/g, '')
const normPack = (n: string) => (n || '').toUpperCase().replace(/[^A-Z0-9.]/g, '')

const lev = (a: string, b: string) => {
  const dp = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)])
  for (let j = 1; j <= b.length; j++) dp[0][j] = j
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++)
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1))
  return dp[a.length][b.length]
}

export default function ProductSheetCheck({ stock, onChanged, showToast }: {
  stock: StockLite[]; onChanged: () => void; showToast: (m: string) => void
}) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [busy, setBusy] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    const rows = await fetchSheet<ProductRow>('Products')
    setProducts(rows.map((r, i) => ({ ...r, rowIndex: i + 2 })))
    setLoading(false)
  }, [])
  useEffect(() => { load() }, [load])

  const report = useMemo(() => {
    const stockByNorm = new Map<string, StockLite>()
    for (const s of stock) if (!stockByNorm.has(normName(s.name))) stockByNorm.set(normName(s.name), s)

    const byNorm = new Map<string, Product[]>()
    for (const p of products) {
      const k = normName(p.Name)
      byNorm.set(k, [...(byNorm.get(k) || []), p])
    }

    const duplicates: Product[][] = []
    const spelling: { product: Product; stock: StockLite; fuzzy: boolean }[] = []
    const packDiff: { product: Product; stock: StockLite }[] = []
    let unmatchedProducts: Product[] = []
    const usedStock = new Set<string>()

    for (const [k, list] of byNorm) {
      if (list.length > 1) duplicates.push(list)
      const rep = list[0]
      const st = stockByNorm.get(k)
      if (!st) { unmatchedProducts.push(rep); continue }
      usedStock.add(k)
      if (rep.Name.trim() !== st.name) spelling.push({ product: rep, stock: st, fuzzy: false })
      if (normPack(rep['Pack Size']) !== normPack(st.packSize)) packDiff.push({ product: rep, stock: st })
    }

    let unmatchedStock = [...stockByNorm.entries()].filter(([k]) => !usedStock.has(k)).map(([, s]) => s)

    // Near-identical names (e.g. MARMORINO / MARMARINO) that the simple
    // punctuation-insensitive match above couldn't pair up.
    const leftoverProducts: Product[] = []
    for (const p of unmatchedProducts) {
      const pk = normName(p.Name)
      const hit = unmatchedStock.find(s => { const sk = normName(s.name); return Math.min(pk.length, sk.length) >= 6 && lev(pk, sk) <= 2 })
      if (hit) {
        spelling.push({ product: p, stock: hit, fuzzy: true })
        unmatchedStock = unmatchedStock.filter(s => s !== hit)
        if (normPack(p['Pack Size']) !== normPack(hit.packSize)) packDiff.push({ product: p, stock: hit })
      } else leftoverProducts.push(p)
    }
    unmatchedProducts = leftoverProducts

    return { duplicates, spelling, packDiff, onlyProducts: unmatchedProducts, onlyStock: unmatchedStock }
  }, [products, stock])

  const run = async (key: string, fn: () => Promise<string | null>) => {
    setBusy(key)
    try {
      const err = await fn()
      showToast(err ? `✗ ${err}` : '✓ Done')
    } finally {
      await load()
      onChanged()
      setBusy(null)
    }
  }

  const toData = (p: Product, patch: Partial<ProductRow>) => {
    const { rowIndex, ...rest } = p
    void rowIndex
    return { ...rest, ...patch }
  }

  const renameProduct = (p: Product, newName: string) => run(`ren-${p.rowIndex}`, async () => {
    const r = await replaceRowSafely('Products', p, toData(p, { Name: newName }), ['Name', 'Pack Size', 'Category'])
    return r.saved ? null : 'Could not rename — nothing was changed'
  })

  const usePackSize = (p: Product, packSize: string) => run(`pack-${p.rowIndex}`, async () => {
    const r = await replaceRowSafely('Products', p, toData(p, { 'Pack Size': packSize }), ['Name', 'Pack Size', 'Category'])
    return r.saved ? null : 'Could not update pack size — nothing was changed'
  })

  const addToStock = (p: Product) => run(`stk-${p.rowIndex}`, async () => {
    const r = await addRowVerified('Stock', {
      Product: p.Name.trim(), Location: 'NewProduct', Qty: 0,
      Notes: JSON.stringify({ unit: p.Unit, packSize: p['Pack Size'] }),
      'Updated By': 'Dashboard', Date: new Date().toLocaleDateString('en-IN'),
    }, ['Product', 'Location'])
    return r.saved ? null : `Could not add ${p.Name} to Stock`
  })

  const addAllToStock = () => {
    if (!confirm(`Add ${report.onlyProducts.length} products to Stock with 0 quantity?`)) return
    run('stk-all', async () => {
      for (const p of report.onlyProducts) {
        const r = await addRowVerified('Stock', {
          Product: p.Name.trim(), Location: 'NewProduct', Qty: 0,
          Notes: JSON.stringify({ unit: p.Unit, packSize: p['Pack Size'] }),
          'Updated By': 'Dashboard', Date: new Date().toLocaleDateString('en-IN'),
        }, ['Product', 'Location'])
        if (!r.saved) return `Stopped at ${p.Name} — could not add it`
      }
      return null
    })
  }

  const addToProducts = (s: StockLite) => run(`prd-${s.name}`, async () => {
    const r = await addRowVerified('Products', {
      Name: s.name, Category: 'Uncategorised', 'Pack Size': s.packSize, Unit: s.unit, Rate: '', GST: '18%',
    }, ['Name'])
    return r.saved ? null : `Could not add ${s.name} to Products`
  })

  const removeDuplicate = (p: Product) => {
    if (!confirm(`Remove this duplicate "${p.Name}" row from the Products sheet?`)) return
    run(`dup-${p.rowIndex}`, async () => {
      const r = await deleteRow('Products', p.rowIndex)
      return r?.status === 'ok' ? null : 'Could not remove the duplicate'
    })
  }

  const btn = 'text-xs px-2.5 py-1 rounded-lg border font-medium hover:bg-brand-50 text-brand disabled:opacity-40 whitespace-nowrap'
  const total = report.duplicates.length + report.spelling.length + report.packDiff.length + report.onlyProducts.length + report.onlyStock.length

  const Section = ({ title, hint, count, children }: { title: string; hint: string; count: number; children: React.ReactNode }) => count === 0 ? null : (
    <div className="rounded-xl border overflow-hidden" style={{ borderColor: 'var(--border-2)' }}>
      <div className="px-4 py-2.5 flex items-center justify-between flex-wrap gap-2" style={{ background: 'var(--bg-card2)' }}>
        <div>
          <p className="font-semibold text-sm" style={{ color: 'var(--text-1)' }}>{title} <span className="text-xs font-normal" style={{ color: 'var(--text-4)' }}>({count})</span></p>
          <p className="text-[11px]" style={{ color: 'var(--text-4)' }}>{hint}</p>
        </div>
      </div>
      <div className="divide-y" style={{ borderColor: 'var(--border-2)' }}>{children}</div>
    </div>
  )
  const Line = ({ children, action }: { children: React.ReactNode; action: React.ReactNode }) => (
    <div className="px-4 py-2 flex items-center justify-between gap-3 flex-wrap text-xs" style={{ color: 'var(--text-2)' }}>
      <div className="min-w-0">{children}</div>
      <div className="flex gap-2 shrink-0">{action}</div>
    </div>
  )

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <p className="text-sm font-semibold" style={{ color: 'var(--text-1)' }}>Product Sheet vs Stock — mismatch check</p>
          <p className="text-xs" style={{ color: 'var(--text-4)' }}>
            Compares the Products sheet ({products.length} rows) with the Stock list ({stock.length} products). Stock quantities are matched by product name, so names must agree.
          </p>
        </div>
        <button onClick={() => { load(); onChanged() }} disabled={loading}
          className="text-xs px-3 py-1.5 rounded-lg font-medium border flex items-center gap-1.5 disabled:opacity-50" style={{ color: 'var(--text-3)', borderColor: 'var(--border-2)' }}>
          <RefreshCw size={12} className={loading ? 'animate-spin' : ''} /> Re-check
        </button>
      </div>

      {!loading && total === 0 && (
        <div className="flex items-center gap-2 text-sm text-green-600 py-6 justify-center"><CheckCircle2 size={16} /> Products and Stock match.</div>
      )}

      <Section title="Same product, spelled differently" count={report.spelling.length}
        hint="Quantities follow the Stock name. 'Use Stock name' renames the Products entry to match, so both lists line up.">
        {report.spelling.map(({ product, stock: s, fuzzy }) => (
          <Line key={product.rowIndex} action={
            <button className={btn} disabled={!!busy} onClick={() => renameProduct(product, s.name)}>{busy === `ren-${product.rowIndex}` ? 'Renaming…' : 'Use Stock name'}</button>
          }>
            <b>{product.Name}</b> <span style={{ color: 'var(--text-4)' }}>(Products)</span> ↔ <b>{s.name}</b> <span style={{ color: 'var(--text-4)' }}>(Stock)</span>
            {fuzzy && <span className="ml-2 text-yellow-600">· check this is the same product</span>}
          </Line>
        ))}
      </Section>

      <Section title="Pack size differs" count={report.packDiff.length}
        hint="Same product, but the pack size isn't the same in both lists. 'Use Stock pack size' updates the Products sheet.">
        {report.packDiff.map(({ product, stock: s }) => (
          <Line key={product.rowIndex} action={
            <button className={btn} disabled={!!busy} onClick={() => usePackSize(product, s.packSize)}>{busy === `pack-${product.rowIndex}` ? 'Updating…' : 'Use Stock pack size'}</button>
          }>
            <b>{s.name}</b> — Products: <b>{product['Pack Size'] || '—'}</b>, Stock: <b>{s.packSize || '—'}</b>
          </Line>
        ))}
      </Section>

      <Section title="In Products but not in Stock" count={report.onlyProducts.length}
        hint="Add them to Stock (0 quantity) so you can start tracking them.">
        <div className="px-4 py-2 flex justify-end">
          <button className={btn} disabled={!!busy} onClick={addAllToStock}>{busy === 'stk-all' ? 'Adding…' : `Add all ${report.onlyProducts.length} to Stock`}</button>
        </div>
        {report.onlyProducts.map(p => (
          <Line key={p.rowIndex} action={<button className={btn} disabled={!!busy} onClick={() => addToStock(p)}>{busy === `stk-${p.rowIndex}` ? 'Adding…' : 'Add to Stock'}</button>}>
            <b>{p.Name}</b> <span style={{ color: 'var(--text-4)' }}>{p['Pack Size']}</span>
          </Line>
        ))}
      </Section>

      <Section title="In Stock but not in Products" count={report.onlyStock.length}
        hint="Add to Products if it's something you quote. Items like brushes, tape or rollers may be stock-only, so leave them.">
        {report.onlyStock.map(s => (
          <Line key={s.name} action={<button className={btn} disabled={!!busy} onClick={() => addToProducts(s)}>{busy === `prd-${s.name}` ? 'Adding…' : 'Add to Products'}</button>}>
            <b>{s.name}</b> <span style={{ color: 'var(--text-4)' }}>{s.packSize}</span>
          </Line>
        ))}
      </Section>

      <Section title="Duplicate rows in Products" count={report.duplicates.length}
        hint="The same product appears more than once. Remove the extra copy.">
        {report.duplicates.map(list => list.slice(1).map(p => (
          <Line key={p.rowIndex} action={<button className="text-xs px-2.5 py-1 rounded-lg border font-medium hover:bg-red-50 text-red-500 disabled:opacity-40" disabled={!!busy} onClick={() => removeDuplicate(p)}>{busy === `dup-${p.rowIndex}` ? 'Removing…' : 'Remove duplicate'}</button>}>
            <b>{p.Name}</b> <span style={{ color: 'var(--text-4)' }}>· row {p.rowIndex} · {p['Pack Size']} · {list.length} copies</span>
          </Line>
        )))}
      </Section>
    </div>
  )
}
