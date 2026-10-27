/**
 * A five-year three-statement model for an illustrative company. The income
 * statement, balance sheet and cash flow are linked the standard way:
 * net income feeds retained earnings, the cash flow statement explains the
 * change in cash, and a revolver draws only when cash would fall below the
 * minimum. Interest runs on opening balances, so there is no circularity.
 * Everything is in Ghana cedis.
 */

export interface Inputs {
  units: number; // packs sold in year 1
  price: number; // GHS per pack, year 1
  volumeGrowth: number; // % a year
  priceGrowth: number; // % a year
  cogsPct: number; // % of revenue
  opex: number; // fixed operating costs, year 1
  opexGrowth: number; // % a year
  capex: number; // a year
  life: number; // straight-line depreciation, years
  arDays: number;
  invDays: number; // on COGS
  apDays: number; // on COGS
  debt: number; // opening term loan
  rate: number; // % on the term loan
  term: number; // years to amortise, equal instalments of principal
  taxPct: number;
  payoutPct: number; // dividends, % of positive net income
  minCash: number;
}

export const DEFAULTS: Inputs = {
  units: 420_000,
  price: 18,
  volumeGrowth: 10,
  priceGrowth: 8,
  cogsPct: 58,
  opex: 1_300_000,
  opexGrowth: 6,
  capex: 450_000,
  life: 8,
  arDays: 30,
  invDays: 45,
  apDays: 40,
  debt: 3_000_000,
  rate: 24,
  term: 5,
  taxPct: 25,
  payoutPct: 0,
  minCash: 250_000,
};

/** Opening balance sheet (year 0). Equity is whatever balances it. */
export const OPENING = {
  cash: 600_000,
  ar: 520_000,
  inventory: 640_000,
  grossPpe: 2_800_000,
  accDep: 400_000,
  ap: 560_000,
  revolver: 0,
  shareCapital: 400_000,
};

export interface Shocks {
  cedi: boolean; // cedi falls 30%: imported inputs and equipment cost more
  rates: boolean; // +500 bp on all borrowing
  demand: boolean; // volumes 20% lower
}

export const NO_SHOCKS: Shocks = { cedi: false, rates: false, demand: false };

export function applyShocks(i: Inputs, s: Shocks): Inputs {
  return {
    ...i,
    // about 40% of COGS is imported; a 30% fall in the cedi lifts those costs by ~43%
    cogsPct: s.cedi ? i.cogsPct + i.cogsPct * 0.4 * (1 / 0.7 - 1) : i.cogsPct,
    capex: s.cedi ? i.capex * 1.3 : i.capex,
    rate: s.rates ? i.rate + 5 : i.rate,
    units: s.demand ? i.units * 0.8 : i.units,
  };
}

export interface Year {
  year: number;
  // income statement
  revenue: number;
  cogs: number;
  gross: number;
  opex: number;
  ebitda: number;
  dep: number;
  ebit: number;
  interest: number;
  pbt: number;
  tax: number;
  net: number;
  // balance sheet
  cash: number;
  ar: number;
  inventory: number;
  netPpe: number;
  assets: number;
  ap: number;
  revolver: number;
  termDebt: number;
  liabilities: number;
  shareCapital: number;
  retained: number;
  equity: number;
  check: number; // assets - (liabilities + equity), should be 0
  // cash flow
  cfo: number;
  dAr: number;
  dInv: number;
  dAp: number;
  capex: number;
  principal: number;
  revolverFlow: number;
  dividends: number;
  netCash: number;
  fcf: number; // CFO - capex
  dscr: number; // (EBITDA - tax) / (interest + principal)
}

export function run(input: Inputs, shocks: Shocks = NO_SHOCKS) {
  const i = applyShocks(input, shocks);
  const o = OPENING;
  const openingAssets = o.cash + o.ar + o.inventory + (o.grossPpe - o.accDep);
  const openingRetained = openingAssets - (o.ap + o.revolver + i.debt) - o.shareCapital;

  let cash = o.cash;
  let ar = o.ar;
  let inv = o.inventory;
  let gross = o.grossPpe;
  let acc = o.accDep;
  let ap = o.ap;
  let revolver = o.revolver;
  let termDebt = i.debt;
  let retained = openingRetained;
  const years: Year[] = [];
  const instalment = i.term > 0 ? i.debt / i.term : 0;

  for (let t = 1; t <= 5; t++) {
    const units = i.units * Math.pow(1 + i.volumeGrowth / 100, t - 1);
    const price = i.price * Math.pow(1 + i.priceGrowth / 100, t - 1);
    const revenue = units * price;
    const cogs = (revenue * i.cogsPct) / 100;
    const opex = i.opex * Math.pow(1 + i.opexGrowth / 100, t - 1);
    const ebitda = revenue - cogs - opex;

    const capex = i.capex;
    const netBefore = gross + capex - acc;
    const dep = Math.min(netBefore, (gross + capex) / i.life);
    const ebit = ebitda - dep;
    const interest = (termDebt * i.rate) / 100 + (revolver * (i.rate + 2)) / 100;
    const pbt = ebit - interest;
    const tax = Math.max(0, (pbt * i.taxPct) / 100);
    const net = pbt - tax;
    const dividends = Math.max(0, (net * i.payoutPct) / 100);

    const arNew = (revenue * i.arDays) / 365;
    const invNew = (cogs * i.invDays) / 365;
    const apNew = (cogs * i.apDays) / 365;
    const dAr = arNew - ar;
    const dInv = invNew - inv;
    const dAp = apNew - ap;
    const cfo = net + dep - dAr - dInv + dAp;
    const principal = Math.min(termDebt, instalment);

    // the revolver tops cash up to the minimum and is repaid first when cash allows
    const pre = cash + cfo - capex - principal - dividends;
    let revolverFlow = 0;
    if (pre < i.minCash) revolverFlow = i.minCash - pre;
    else if (revolver > 0) revolverFlow = -Math.min(revolver, pre - i.minCash);
    const netCash = cfo - capex - principal + revolverFlow - dividends;

    cash += netCash;
    ar = arNew;
    inv = invNew;
    ap = apNew;
    gross += capex;
    acc += dep;
    revolver += revolverFlow;
    termDebt -= principal;
    retained += net - dividends;

    const netPpe = gross - acc;
    const assets = cash + ar + inv + netPpe;
    const liabilities = ap + revolver + termDebt;
    const equity = o.shareCapital + retained;
    const service = interest + principal;

    years.push({
      year: t,
      revenue,
      cogs,
      gross: revenue - cogs,
      opex,
      ebitda,
      dep,
      ebit,
      interest,
      pbt,
      tax,
      net,
      cash,
      ar,
      inventory: inv,
      netPpe,
      assets,
      ap,
      revolver,
      termDebt,
      liabilities,
      shareCapital: o.shareCapital,
      retained,
      equity,
      check: assets - liabilities - equity,
      cfo,
      dAr,
      dInv,
      dAp,
      capex,
      principal,
      revolverFlow,
      dividends,
      netCash,
      fcf: cfo - capex,
      dscr: service > 0 ? (ebitda - tax) / service : Infinity,
    });
  }

  const balances = years.every((y) => Math.abs(y.check) < 0.5);
  const minDscr = Math.min(...years.map((y) => y.dscr));
  return { years, balances, minDscr, inputs: i, openingRetained };
}

export type Model = ReturnType<typeof run>;

type Row = { label: string; key: keyof Year; strong?: boolean; negative?: boolean };

export const INCOME: Row[] = [
  { label: "Revenue", key: "revenue", strong: true },
  { label: "Cost of goods sold", key: "cogs", negative: true },
  { label: "Gross profit", key: "gross", strong: true },
  { label: "Operating costs", key: "opex", negative: true },
  { label: "EBITDA", key: "ebitda", strong: true },
  { label: "Depreciation", key: "dep", negative: true },
  { label: "EBIT", key: "ebit" },
  { label: "Interest", key: "interest", negative: true },
  { label: "Profit before tax", key: "pbt" },
  { label: "Tax", key: "tax", negative: true },
  { label: "Net income", key: "net", strong: true },
];

export const BALANCE: Row[] = [
  { label: "Cash", key: "cash" },
  { label: "Receivables", key: "ar" },
  { label: "Inventory", key: "inventory" },
  { label: "Property and equipment", key: "netPpe" },
  { label: "Total assets", key: "assets", strong: true },
  { label: "Payables", key: "ap" },
  { label: "Revolver", key: "revolver" },
  { label: "Term loan", key: "termDebt" },
  { label: "Total liabilities", key: "liabilities", strong: true },
  { label: "Share capital", key: "shareCapital" },
  { label: "Retained earnings", key: "retained" },
  { label: "Total equity", key: "equity", strong: true },
];

export const CASHFLOW: Row[] = [
  { label: "Net income", key: "net" },
  { label: "Add back depreciation", key: "dep" },
  { label: "Change in receivables", key: "dAr", negative: true },
  { label: "Change in inventory", key: "dInv", negative: true },
  { label: "Change in payables", key: "dAp" },
  { label: "Cash from operations", key: "cfo", strong: true },
  { label: "Capital expenditure", key: "capex", negative: true },
  { label: "Loan repayment", key: "principal", negative: true },
  { label: "Revolver drawn (repaid)", key: "revolverFlow" },
  { label: "Dividends", key: "dividends", negative: true },
  { label: "Net change in cash", key: "netCash", strong: true },
  { label: "Closing cash", key: "cash", strong: true },
];

/** The value as shown in a statement: costs and outflows print as negatives. */
export const shown = (r: Row, y: Year) => (r.negative ? -(y[r.key] as number) : (y[r.key] as number));

export function toCsv(m: Model) {
  const head = ["", ...m.years.map((y) => `Year ${y.year}`)];
  const block = (title: string, rows: Row[]) => [
    [title],
    ...rows.map((r) => [r.label, ...m.years.map((y) => Math.round(shown(r, y)).toString())]),
    [],
  ];
  const lines = [
    ["Harmattan Foods Ltd (illustrative). GHS."],
    head,
    ...block("Income statement", INCOME),
    ...block("Balance sheet", BALANCE),
    ...block("Cash flow", CASHFLOW),
    ["DSCR", ...m.years.map((y) => (Number.isFinite(y.dscr) ? y.dscr.toFixed(2) : ""))],
    ["Balance check", ...m.years.map((y) => y.check.toFixed(2))],
  ];
  return lines.map((l) => l.map((c) => (/[",]/.test(c) ? `"${c.replace(/"/g, '""')}"` : c)).join(",")).join("\n");
}
