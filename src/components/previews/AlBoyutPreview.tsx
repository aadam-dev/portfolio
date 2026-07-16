"use client";

interface Props { screen: string }

const LATERITE = "#a8462a";
const STEEL = "#41545f";

export default function AlBoyutPreview({ screen }: Props) {
  if (screen === "admin") return <Admin />;
  if (screen === "pos") return <Pos />;
  if (screen === "laundry") return <Laundry />;
  return <Landing />;
}

function Landing() {
  return (
    <div className="min-h-full bg-[#eeeeeb] font-sans text-[#211d18]">
      <nav className="px-6 py-4 flex items-center justify-between bg-white border-b border-[#ddd]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-md flex items-center justify-center text-white font-black" style={{ background: LATERITE }}>AB</div>
          <span className="font-black tracking-tight uppercase">Al-Boyut</span>
        </div>
        <div className="hidden md:flex gap-8 text-[10px] font-bold uppercase tracking-widest text-[#5c554b]">
          <span style={{ color: LATERITE }}>Materials</span>
          <span>Laundry</span>
          <span>Delivery</span>
          <span>Contact</span>
        </div>
        <button className="px-4 py-2 rounded-md text-white text-[10px] font-black uppercase tracking-widest" style={{ background: "#25d366" }}>Order on WhatsApp</button>
      </nav>
      <div className="px-6 py-14 max-w-5xl mx-auto">
        <p className="text-[10px] font-black uppercase tracking-[0.25em] mb-4" style={{ color: STEEL }}>Builder&apos;s merchant · Accra</p>
        <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-[0.95] mb-6">
          Cement, iron rods &<br />
          <span style={{ color: LATERITE }}>everything the site needs.</span>
        </h1>
        <p className="text-[#5c554b] max-w-md mb-8">Counter pickup or delivery across Accra. Message us your list — we quote, you confirm, we deliver.</p>
        <div className="flex gap-3">
          <button className="px-8 py-4 rounded-md text-white text-xs font-black uppercase tracking-widest" style={{ background: LATERITE }}>Browse materials</button>
          <button className="px-8 py-4 rounded-md text-xs font-black uppercase tracking-widest border border-[#211d18]/20 bg-white">Laundry counter</button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-14">
          {[["Cement", "GH₵ 85 / bag"], ["Iron rods", "12mm · 16mm"], ["Blocks", "5\" · 6\" solid"], ["Roofing", "IBR · aluzinc"]].map(([t, s]) => (
            <div key={t} className="bg-white rounded-md p-5 border border-[#ddd]">
              <div className="w-10 h-10 rounded-sm mb-4" style={{ background: `${LATERITE}22` }} />
              <p className="font-black text-sm">{t}</p>
              <p className="text-[11px] text-[#6f6656]">{s}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Shell({ title, tab, children }: { title: string; tab: string; children: React.ReactNode }) {
  return (
    <div className="min-h-full bg-[#eeeeeb] font-sans text-[#211d18] flex">
      <aside className="hidden md:flex w-44 flex-col bg-[#211d18] text-white/80 p-4 gap-1 text-[11px] font-semibold">
        <p className="font-black text-white mb-4 uppercase tracking-widest text-[10px]">Al-Boyut · {title}</p>
        {["Dashboard", "Orders", "Products", "Inventory", "POS", "Laundry", "Suppliers", "Reports"].map((i) => (
          <span key={i} className={`px-3 py-2 rounded-sm ${i === tab ? "text-white" : ""}`} style={i === tab ? { background: LATERITE } : undefined}>{i}</span>
        ))}
      </aside>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}

function Admin() {
  return (
    <Shell title="Back office" tab="Dashboard">
      <h2 className="font-black text-xl mb-5">Today at the counter</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[["GH₵ 12,480", "Sales today"], ["37", "Orders"], ["6", "Deliveries out"], ["4", "Low stock"]].map(([v, l]) => (
          <div key={l} className="bg-white rounded-md p-4 border border-[#ddd]">
            <p className="font-black text-lg" style={{ color: STEEL }}>{v}</p>
            <p className="text-[10px] uppercase tracking-widest text-[#6f6656]">{l}</p>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-md border border-[#ddd] p-4">
        <p className="text-[10px] font-black uppercase tracking-widest mb-3 text-[#6f6656]">Recent orders</p>
        {[["#1042", "K. Mensah", "40 bags cement", "Delivery", "GH₵ 3,400"], ["#1041", "Site — East Legon", "Iron rods 16mm ×60", "Pickup", "GH₵ 5,160"], ["#1040", "A. Owusu", "Laundry · 12 items", "Counter", "GH₵ 180"]].map(([id, c, items, ch, amt]) => (
          <div key={id} className="flex items-center justify-between py-2.5 border-b border-[#eee] last:border-0 text-xs">
            <span className="font-mono text-[#6f6656]">{id}</span>
            <span className="font-bold flex-1 px-3">{c}</span>
            <span className="hidden md:block flex-1 text-[#5c554b]">{items}</span>
            <span className="px-2 py-0.5 rounded-sm text-[9px] font-black uppercase" style={{ background: `${STEEL}18`, color: STEEL }}>{ch}</span>
            <span className="font-black w-24 text-right">{amt}</span>
          </div>
        ))}
      </div>
    </Shell>
  );
}

function Pos() {
  return (
    <Shell title="POS" tab="POS">
      <div className="flex gap-4">
        <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-2">
          {["Cement 50kg", "Block 6\"", "Iron rod 12mm", "Binding wire", "Nails 3\"", "Aluzinc sheet"].map((p) => (
            <div key={p} className="bg-white rounded-md border border-[#ddd] p-3">
              <div className="h-10 rounded-sm mb-2" style={{ background: `${LATERITE}18` }} />
              <p className="text-[11px] font-black leading-tight">{p}</p>
            </div>
          ))}
        </div>
        <div className="w-56 bg-white rounded-md border border-[#ddd] p-4 flex flex-col">
          <p className="text-[10px] font-black uppercase tracking-widest text-[#6f6656] mb-3">Ticket</p>
          {[["Cement 50kg ×10", "850"], ["Block 6\" ×200", "1,100"], ["Iron rod ×8", "688"]].map(([l, v]) => (
            <div key={l} className="flex justify-between text-[11px] py-1.5 border-b border-[#eee]"><span>{l}</span><span className="font-bold">{v}</span></div>
          ))}
          <div className="flex justify-between font-black mt-auto pt-3 text-sm"><span>Total</span><span style={{ color: LATERITE }}>GH₵ 2,638</span></div>
          <button className="mt-3 py-3 rounded-md text-white text-[10px] font-black uppercase tracking-widest" style={{ background: LATERITE }}>Charge</button>
        </div>
      </div>
    </Shell>
  );
}

function Laundry() {
  return (
    <Shell title="Laundry ops" tab="Laundry">
      <h2 className="font-black text-xl mb-5">Laundry board</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[["Received", ["#L-201 · 8 items", "#L-202 · 3 items"]], ["Washing", ["#L-198 · 14 items"]], ["Ready", ["#L-195 · 6 items", "#L-196 · 9 items"]], ["Collected", ["#L-190", "#L-191", "#L-193"]]].map(([col, tickets]) => (
          <div key={col as string} className="bg-white rounded-md border border-[#ddd] p-3">
            <p className="text-[10px] font-black uppercase tracking-widest mb-3" style={{ color: STEEL }}>{col as string}</p>
            {(tickets as string[]).map((t) => (
              <div key={t} className="rounded-sm border border-[#eee] p-2.5 mb-2 text-[11px] font-bold">{t}</div>
            ))}
          </div>
        ))}
      </div>
    </Shell>
  );
}
