"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  BOOK_SEARCH_HINT,
  DESK_BOOKS,
  DISCOVER_QUERY_HINT,
  DISCOVERY_PROVIDERS,
  STAGES,
  SUBTYPES,
  defaultStage,
  isDeskBook,
  stageLabel,
  subtypeLabel,
  type DeskBookId,
  type DiscoveryProviderId,
} from "@/lib/desk/kinds";
import {
  deskApi,
  type DeskRecordDTO,
  type DeskStats,
  type DiscoverHit,
} from "@/lib/desk/client";

function money(n?: number) {
  if (n == null || Number.isNaN(n)) return "—";
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(n % 1_000 === 0 ? 0 : 0)}k`;
  return `$${n}`;
}

export default function DeskApp() {
  const router = useRouter();
  const searchRef = useRef<HTMLInputElement>(null);
  const [book, setBook] = useState<DeskBookId>("investor");
  const [search, setSearch] = useState("");
  const [stage, setStage] = useState("all");
  const [subtype, setSubtype] = useState("all");
  const [watchOnly, setWatchOnly] = useState(false);
  const [items, setItems] = useState<DeskRecordDTO[]>([]);
  const [stats, setStats] = useState<DeskStats | null>(null);
  const [selected, setSelected] = useState<DeskRecordDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [showDiscover, setShowDiscover] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [provider, setProvider] = useState<DiscoveryProviderId>("web");
  const [discoverQuery, setDiscoverQuery] = useState("");
  const [discoverHits, setDiscoverHits] = useState<DiscoverHit[]>([]);
  const [discoverNote, setDiscoverNote] = useState("");
  const [discoverBusy, setDiscoverBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params: Record<string, string> = { kind: book };
      if (search.trim()) params.search = search.trim();
      if (stage !== "all") params.stage = stage;
      if (subtype !== "all") params.subtype = subtype;
      if (watchOnly) params.watchlisted = "1";
      const [{ items: next }, nextStats] = await Promise.all([
        deskApi.records(params),
        deskApi.stats(),
      ]);
      setItems(next);
      setStats(nextStats);
      setSelected((cur) => {
        if (!cur) return next[0] || null;
        return next.find((r) => r._id === cur._id) || next[0] || null;
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to load desk";
      setError(message);
      if (message.toLowerCase().includes("unauthorized")) {
        router.push("/desk/login");
      }
    } finally {
      setLoading(false);
    }
  }, [book, search, stage, subtype, watchOnly, router]);

  useEffect(() => {
    deskApi
      .me()
      .then((r) => setUserEmail(r.user.email))
      .catch(() => router.push("/desk/login"));
  }, [router]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "/" && !(e.target instanceof HTMLInputElement) && !(e.target instanceof HTMLTextAreaElement)) {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    setStage("all");
    setSubtype("all");
    setDiscoverQuery("");
    setDiscoverHits([]);
    setDiscoverNote("");
  }, [book]);

  async function toggleWatch(row: DeskRecordDTO) {
    const updated = await deskApi.update(row._id, {
      watchlisted: !row.watchlisted,
    });
    setItems((prev) => prev.map((r) => (r._id === updated._id ? updated : r)));
    setSelected((cur) => (cur?._id === updated._id ? updated : cur));
  }

  async function changeStage(row: DeskRecordDTO, next: string) {
    const updated = await deskApi.update(row._id, { stage: next });
    setItems((prev) => prev.map((r) => (r._id === updated._id ? updated : r)));
    setSelected((cur) => (cur?._id === updated._id ? updated : cur));
  }

  async function saveNotes(row: DeskRecordDTO, notes: string) {
    const updated = await deskApi.update(row._id, { notes });
    setItems((prev) => prev.map((r) => (r._id === updated._id ? updated : r)));
  }

  async function runDiscover() {
    setDiscoverBusy(true);
    setDiscoverNote("");
    try {
      const result = await deskApi.discover({
        kind: book,
        provider,
        query: discoverQuery || DISCOVER_QUERY_HINT[book],
      });
      setDiscoverHits(result.hits);
      setDiscoverNote(result.note || `Ran ${result.provider} · ${result.hits.length} hits`);
    } catch (err: unknown) {
      setDiscoverNote(err instanceof Error ? err.message : "Discover failed");
    } finally {
      setDiscoverBusy(false);
    }
  }

  async function saveHit(hit: DiscoverHit) {
    const created = await deskApi.create({
      kind: book,
      name: hit.title.slice(0, 160),
      organization: hit.title.slice(0, 160),
      website: hit.url,
      sourceUrl: hit.url,
      sourceSnippet: hit.snippet,
      sourceQuery: discoverQuery,
      sourceProvider: hit.sourceProvider,
      source: hit.sourceProvider,
      thesis: hit.snippet,
      lastPrint: `Discovered via ${hit.sourceProvider}`,
      stage: defaultStage(book),
    });
    setItems((prev) => [created, ...prev.filter((r) => r._id !== created._id)]);
    setSelected(created);
  }

  async function logout() {
    await deskApi.logout();
    router.push("/desk/login");
  }

  const bookMeta = DESK_BOOKS.find((b) => b.id === book)!;
  const subtypeCounts = useMemo(() => {
    const map: Record<string, number> = {};
    for (const row of items) {
      map[row.subtype || "—"] = (map[row.subtype || "—"] || 0) + 1;
    }
    return map;
  }, [items]);

  return (
    <div className="min-h-screen flex flex-col font-desk">
      <Ticker tape={stats?.tape || []} />

      <header className="flex flex-wrap items-center gap-3 border-b border-[#243040] bg-[#0e131b] px-3 py-2.5">
        <Link href="/" className="flex items-center gap-3 shrink-0">
          <div className="flex h-9 w-9 items-center justify-center border border-[#c9a227] font-mono text-[10px] font-semibold text-[#c9a227]">
            AM
          </div>
          <div>
            <p className="text-[11px] font-mono tracking-[0.28em] text-[#c9a227] uppercase">
              Abramovich Media
            </p>
            <p className="text-sm font-semibold text-[#d7e0ea]">Industry desk</p>
          </div>
        </Link>

        <label className="flex flex-col text-[10px] font-mono uppercase tracking-[0.18em] text-[#7d8b9c]">
          Book
          <select
            value={book}
            onChange={(e) => {
              const v = e.target.value;
              if (isDeskBook(v)) setBook(v);
            }}
            className="mt-1 bg-[#141b24] border border-[#243040] text-[#d7e0ea] rounded px-3 py-2 text-sm font-sans tracking-normal normal-case min-w-[240px]"
          >
            {DESK_BOOKS.map((b) => (
              <option key={b.id} value={b.id}>
                {b.label}
              </option>
            ))}
          </select>
        </label>

        <div className="flex-1 min-w-[180px]">
          <label className="sr-only" htmlFor="scan">
            Search
          </label>
          <input
            id="scan"
            ref={searchRef}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && load()}
            placeholder={BOOK_SEARCH_HINT[book]}
            className="w-full border border-[#243040] bg-[#07090d] px-3 py-2 font-mono text-[12px] text-[#d7e0ea] placeholder:text-[#7d8b9c]"
          />
        </div>

        <select
          value={subtype}
          onChange={(e) => setSubtype(e.target.value)}
          className="bg-[#141b24] border border-[#243040] text-sm px-3 py-2 rounded"
        >
          <option value="all">All types</option>
          {SUBTYPES[book].map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>

        <select
          value={stage}
          onChange={(e) => setStage(e.target.value)}
          className="bg-[#141b24] border border-[#243040] text-sm px-3 py-2 rounded"
        >
          <option value="all">All stages</option>
          {STAGES[book].map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={() => setWatchOnly((v) => !v)}
          className={`font-mono text-[11px] tracking-wider border px-3 py-2 ${
            watchOnly
              ? "border-[#c9a227] text-[#c9a227]"
              : "border-[#243040] text-[#7d8b9c]"
          }`}
        >
          WATCH
        </button>
        <button
          type="button"
          onClick={() => setShowDiscover(true)}
          className="font-mono text-[11px] tracking-wider border border-[#5ad0e8]/40 text-[#5ad0e8] px-3 py-2"
        >
          FIND
        </button>
        <button
          type="button"
          onClick={() => setShowAdd(true)}
          className="font-mono text-[11px] tracking-wider bg-[#c9a227] text-[#07090d] px-3 py-2"
        >
          + SAVE
        </button>
        <button
          type="button"
          onClick={logout}
          className="text-[11px] text-[#7d8b9c] hover:text-[#d7e0ea]"
        >
          {userEmail || "Sign out"}
        </button>
      </header>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-px bg-[#243040] border-b border-[#243040]">
        <Stat label="Book" value={String(stats?.byKind[book] ?? items.length)} />
        <Stat label="Desk total" value={String(stats?.total ?? "—")} />
        <Stat label="Watchlist" value={String(stats?.watchlisted ?? 0)} />
        <Stat label={bookMeta.short} value={bookMeta.subtitle} muted />
        <Stat
          label="Live source"
          value="Web / Google"
          muted
        />
        <Stat
          label="Later"
          value="LinkedIn · FB · IG"
          muted
        />
      </div>

      {error && (
        <div className="px-4 py-3 text-sm text-red-400 border-b border-red-500/20 bg-red-500/10">
          {error}
        </div>
      )}

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[1fr_360px] min-h-0">
        <div className="overflow-auto">
          {loading ? (
            <p className="p-8 text-[#7d8b9c] font-mono text-sm">Loading book…</p>
          ) : items.length === 0 ? (
            <div className="p-10 max-w-lg">
              <p className="text-lg font-semibold">No records in this book yet.</p>
              <p className="text-sm text-[#7d8b9c] mt-2">
                Save a contact, or run FIND to crawl public web / Google results into MongoDB.
              </p>
            </div>
          ) : (
            <table className="w-full text-sm text-left">
              <thead className="sticky top-0 bg-[#0e131b] border-b border-[#243040] font-mono text-[10px] uppercase tracking-[0.16em] text-[#7d8b9c]">
                <tr>
                  <th className="p-3">Name</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">City</th>
                  <th className="p-3">Stage</th>
                  <th className="p-3">Ticket / role</th>
                  <th className="p-3">Warmth</th>
                </tr>
              </thead>
              <tbody>
                {items.map((row) => (
                  <tr
                    key={row._id}
                    onClick={() => setSelected(row)}
                    className={`border-b border-[#243040] cursor-pointer ${
                      selected?._id === row._id
                        ? "bg-[#c9a227]/10"
                        : "hover:bg-white/[0.03]"
                    }`}
                  >
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        {row.watchlisted && (
                          <span className="text-[#c9a227]">★</span>
                        )}
                        <div>
                          <div className="font-medium text-[#d7e0ea]">
                            {row.ticker ? (
                              <span className="font-mono text-[#e4c56a] mr-2">
                                {row.ticker}
                              </span>
                            ) : null}
                            {row.name}
                          </div>
                          <div className="text-xs text-[#7d8b9c] truncate max-w-[280px]">
                            {row.organization !== row.name ? row.organization : row.lastPrint}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 font-mono text-[11px] text-[#5ad0e8]">
                      {subtypeLabel(book, row.subtype)}
                    </td>
                    <td className="p-3 text-[#7d8b9c]">{row.city || "—"}</td>
                    <td className="p-3">
                      <select
                        value={row.stage}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => changeStage(row, e.target.value)}
                        className="bg-[#07090d] border border-[#243040] rounded px-2 py-1 text-xs"
                      >
                        {STAGES[book].map((s) => (
                          <option key={s.value} value={s.value}>
                            {s.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="p-3 text-xs text-[#7d8b9c]">
                      {row.ticketMin || row.ticketMax
                        ? `${money(row.ticketMin)} – ${money(row.ticketMax)}`
                        : row.title || row.unionStatus || "—"}
                    </td>
                    <td className="p-3 font-mono text-[#3dd68c]">{row.warmth}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {Object.keys(subtypeCounts).length > 0 && (
            <div className="flex flex-wrap gap-2 p-3 border-t border-[#243040] text-[10px] font-mono text-[#7d8b9c]">
              {Object.entries(subtypeCounts).map(([k, n]) => (
                <span key={k} className="border border-[#243040] px-2 py-0.5">
                  {k || "—"} {n}
                </span>
              ))}
            </div>
          )}
        </div>

        <DetailPanel
          book={book}
          record={selected}
          onWatch={() => selected && toggleWatch(selected)}
          onNotes={(notes) => selected && saveNotes(selected, notes)}
          onClose={() => setSelected(null)}
        />
      </div>

      <AnimatePresence>
        {showDiscover && (
          <Drawer title="Find work / contacts" onClose={() => setShowDiscover(false)}>
            <p className="text-sm text-[#7d8b9c] mb-4">
              Current method: crawl public web and Google. LinkedIn, Facebook, and
              Instagram are stubbed so a richer connector can drop in later.
            </p>
            <div className="grid sm:grid-cols-2 gap-3 mb-4">
              <label className="text-xs text-[#7d8b9c]">
                Provider
                <select
                  value={provider}
                  onChange={(e) =>
                    setProvider(e.target.value as DiscoveryProviderId)
                  }
                  className="mt-1 w-full bg-[#141b24] border border-[#243040] rounded px-3 py-2 text-sm text-[#d7e0ea]"
                >
                  {DISCOVERY_PROVIDERS.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.label}
                      {p.ready ? "" : " (later)"}
                    </option>
                  ))}
                </select>
              </label>
              <label className="text-xs text-[#7d8b9c] sm:col-span-2">
                Query
                <input
                  value={discoverQuery}
                  onChange={(e) => setDiscoverQuery(e.target.value)}
                  placeholder={DISCOVER_QUERY_HINT[book]}
                  className="mt-1 w-full bg-[#141b24] border border-[#243040] rounded px-3 py-2 text-sm"
                />
              </label>
            </div>
            <button
              type="button"
              disabled={discoverBusy}
              onClick={runDiscover}
              className="bg-[#c9a227] text-[#07090d] font-semibold px-4 py-2 rounded text-sm disabled:opacity-50"
            >
              {discoverBusy ? "Scanning…" : "Run scan"}
            </button>
            {discoverNote && (
              <p className="text-xs text-[#5ad0e8] mt-3">{discoverNote}</p>
            )}
            <ul className="mt-4 space-y-3 max-h-[50vh] overflow-auto">
              {discoverHits.map((hit) => (
                <li
                  key={hit.url}
                  className="border border-[#243040] bg-[#141b24] p-3 rounded"
                >
                  <a
                    href={hit.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#e4c56a] text-sm font-medium hover:underline"
                  >
                    {hit.title}
                  </a>
                  <p className="text-xs text-[#7d8b9c] mt-1">{hit.snippet}</p>
                  <p className="text-[10px] font-mono text-[#5ad0e8] mt-1 truncate">
                    {hit.sourceProvider} · {hit.url}
                  </p>
                  <button
                    type="button"
                    onClick={() => saveHit(hit)}
                    className="mt-2 text-xs border border-[#243040] px-2 py-1 hover:border-[#c9a227]"
                  >
                    Save to {bookMeta.short}
                  </button>
                </li>
              ))}
            </ul>
          </Drawer>
        )}
        {showAdd && (
          <Drawer title={`Save ${bookMeta.short} record`} onClose={() => setShowAdd(false)}>
            <AddForm
              book={book}
              onSaved={(row) => {
                setItems((prev) => [row, ...prev]);
                setSelected(row);
                setShowAdd(false);
              }}
            />
          </Drawer>
        )}
      </AnimatePresence>
    </div>
  );
}

function Stat({
  label,
  value,
  muted,
}: {
  label: string;
  value: string;
  muted?: boolean;
}) {
  return (
    <div className="bg-[#0e131b] px-4 py-3">
      <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-[#7d8b9c]">
        {label}
      </p>
      <p className={`mt-1 text-sm ${muted ? "text-[#7d8b9c]" : "text-[#d7e0ea] font-semibold"}`}>
        {value}
      </p>
    </div>
  );
}

function Ticker({
  tape,
}: {
  tape: DeskStats["tape"];
}) {
  const items = tape.length
    ? tape
    : [{ t: "", kind: "desk", name: "Abramovich Media", subtype: "", city: "", text: "Desk live · MongoCRM", warmth: 0 }];
  return (
    <div className="flex items-center gap-2 border-b border-[#243040] bg-[#07090d] text-[11px] font-mono overflow-hidden h-8">
      <span className="flex shrink-0 items-center gap-2 border-r border-[#243040] px-3 text-[#c9a227]">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#3dd68c]" />
        LIVE
      </span>
      <div className="relative flex-1 overflow-hidden">
        <div className="desk-ticker flex w-max gap-8 px-4">
          {items.concat(items).map((q, i) => (
            <span key={`${q.name}-${i}`} className="whitespace-nowrap text-[#7d8b9c]">
              <span className="text-[#e4c56a]">{q.kind.toUpperCase()}</span>{" "}
              {q.name}
              {q.city ? ` · ${q.city}` : ""} — {q.text}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function DetailPanel({
  book,
  record,
  onWatch,
  onNotes,
  onClose,
}: {
  book: DeskBookId;
  record: DeskRecordDTO | null;
  onWatch: () => void;
  onNotes: (notes: string) => void;
  onClose: () => void;
}) {
  if (!record) {
    return (
      <aside className="hidden lg:flex h-full flex-col border-l border-[#243040] bg-[#0e131b] p-6 text-[#7d8b9c] text-sm">
        Select a row.
      </aside>
    );
  }
  const photo = record.photo || record.headshotUrl;
  return (
    <aside className="hidden lg:flex h-full flex-col border-l border-[#243040] bg-[#0e131b] overflow-auto">
      {photo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={photo} alt="" className="h-40 w-full object-cover" />
      ) : (
        <div className="h-24 bg-[#141b24] border-b border-[#243040]" />
      )}
      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            {record.ticker && (
              <p className="font-mono text-[11px] text-[#e4c56a]">{record.ticker}</p>
            )}
            <h2 className="text-lg font-semibold leading-tight">{record.name}</h2>
            <p className="text-xs text-[#7d8b9c] mt-1">
              {subtypeLabel(book, record.subtype)} · {record.city || "—"}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[#7d8b9c] text-xs"
          >
            Close
          </button>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onWatch}
            className={`flex-1 border px-3 py-2 font-mono text-[11px] tracking-wider ${
              record.watchlisted
                ? "border-[#c9a227] text-[#c9a227]"
                : "border-[#243040] text-[#7d8b9c]"
            }`}
          >
            {record.watchlisted ? "WATCHING" : "WATCH"}
          </button>
          {record.website && (
            <a
              href={record.website}
              target="_blank"
              rel="noreferrer"
              className="flex-1 border border-[#243040] px-3 py-2 font-mono text-[11px] text-center text-[#5ad0e8]"
            >
              SITE
            </a>
          )}
        </div>
        <dl className="grid grid-cols-2 gap-2 text-xs">
          <Info label="Stage" value={stageLabel(book, record.stage)} />
          <Info label="Warmth" value={String(record.warmth)} />
          {(record.ticketMin || record.ticketMax) && (
            <Info
              label="Ticket"
              value={`${money(record.ticketMin)} – ${money(record.ticketMax)}`}
            />
          )}
          {record.aum && <Info label="AUM / book" value={record.aum} />}
          {record.unionStatus && <Info label="Union" value={record.unionStatus} />}
          {record.email && <Info label="Email" value={record.email} />}
          {record.phone && <Info label="Phone" value={record.phone} />}
        </dl>
        {record.thesis && (
          <Section title="Thesis / brief">{record.thesis}</Section>
        )}
        {record.approach && (
          <Section title="Approach">{record.approach}</Section>
        )}
        {record.logline && <Section title="Logline">{record.logline}</Section>}
        {record.headshotUrl && (
          <a
            href={record.headshotUrl}
            target="_blank"
            rel="noreferrer"
            className="block text-xs text-[#e4c56a] hover:underline"
          >
            Headshot
          </a>
        )}
        {record.reelUrl && (
          <a
            href={record.reelUrl}
            target="_blank"
            rel="noreferrer"
            className="block text-xs text-[#e4c56a] hover:underline"
          >
            Reel
          </a>
        )}
        {record.applyUrl && (
          <a
            href={record.applyUrl}
            target="_blank"
            rel="noreferrer"
            className="block text-xs text-[#5ad0e8] hover:underline"
          >
            Apply / listing
          </a>
        )}
        <Chips title="Genres" items={record.genres} />
        <Chips title="Markets" items={record.markets} />
        <Chips title="Geos" items={record.geos} />
        <label className="block text-xs text-[#7d8b9c]">
          Notes
          <textarea
            defaultValue={record.notes}
            key={record._id}
            rows={3}
            onBlur={(e) => onNotes(e.target.value)}
            className="mt-1 w-full bg-[#07090d] border border-[#243040] rounded px-2 py-1 text-sm text-[#d7e0ea]"
          />
        </label>
        <p className="text-[10px] font-mono text-[#7d8b9c]">
          Source {record.sourceProvider} · {record.sourceUrl || "manual"}
        </p>
      </div>
    </aside>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-[#243040] bg-[#141b24] px-2 py-1.5">
      <dt className="text-[10px] font-mono uppercase tracking-wider text-[#7d8b9c]">
        {label}
      </dt>
      <dd className="mt-0.5 text-[#d7e0ea] break-all">{value}</dd>
    </div>
  );
}

function Section({ title, children }: { title: string; children: string }) {
  return (
    <div>
      <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-[#7d8b9c]">
        {title}
      </p>
      <p className="text-sm text-[#d7e0ea]/90 mt-1 leading-relaxed">{children}</p>
    </div>
  );
}

function Chips({ title, items }: { title: string; items: string[] }) {
  if (!items?.length) return null;
  return (
    <div>
      <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-[#7d8b9c]">
        {title}
      </p>
      <div className="mt-1.5 flex flex-wrap gap-1.5">
        {items.map((item) => (
          <span
            key={item}
            className="border border-[#243040] bg-[#141b24] px-2 py-0.5 font-mono text-[10px] text-[#5ad0e8]"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

function Drawer({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      className="fixed inset-0 z-40 bg-black/70"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 40 }}
        animate={{ y: 0 }}
        exit={{ y: 40 }}
        onClick={(e) => e.stopPropagation()}
        className="absolute bottom-0 left-0 right-0 max-h-[85vh] overflow-auto rounded-t-lg border-t border-[#243040] bg-[#0e131b] p-5"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button type="button" onClick={onClose} className="text-sm text-[#7d8b9c]">
            Close
          </button>
        </div>
        {children}
      </motion.div>
    </motion.div>
  );
}

function AddForm({
  book,
  onSaved,
}: {
  book: DeskBookId;
  onSaved: (row: DeskRecordDTO) => void;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const fd = new FormData(e.currentTarget);
    const num = (key: string) => {
      const v = String(fd.get(key) || "").trim();
      return v ? Number(v) : undefined;
    };
    try {
      const row = await deskApi.create({
        kind: book,
        name: String(fd.get("name") || ""),
        organization: String(fd.get("organization") || ""),
        ticker: String(fd.get("ticker") || ""),
        subtype: String(fd.get("subtype") || ""),
        stage: String(fd.get("stage") || defaultStage(book)),
        email: String(fd.get("email") || ""),
        phone: String(fd.get("phone") || ""),
        website: String(fd.get("website") || ""),
        city: String(fd.get("city") || ""),
        thesis: String(fd.get("thesis") || ""),
        notes: String(fd.get("notes") || ""),
        headshotUrl: String(fd.get("headshotUrl") || ""),
        reelUrl: String(fd.get("reelUrl") || ""),
        unionStatus: String(fd.get("unionStatus") || ""),
        applyUrl: String(fd.get("applyUrl") || ""),
        ticketMin: num("ticketMin"),
        ticketMax: num("ticketMax"),
        sourceProvider: "manual",
        source: "manual",
      });
      onSaved(row);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid sm:grid-cols-2 gap-3">
      {error && <p className="sm:col-span-2 text-sm text-red-400">{error}</p>}
      <Input name="name" label="Name" required />
      <Input name="organization" label="Organization / brand" />
      <label className="text-xs text-[#7d8b9c]">
        Type
        <select
          name="subtype"
          className="mt-1 w-full bg-[#141b24] border border-[#243040] rounded px-3 py-2 text-sm"
        >
          {SUBTYPES[book].map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </label>
      <label className="text-xs text-[#7d8b9c]">
        Stage
        <select
          name="stage"
          defaultValue={defaultStage(book)}
          className="mt-1 w-full bg-[#141b24] border border-[#243040] rounded px-3 py-2 text-sm"
        >
          {STAGES[book].map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </label>
      <Input name="ticker" label="Ticker (optional)" />
      <Input name="city" label="City" />
      <Input name="email" label="Email" type="email" />
      <Input name="phone" label="Phone" />
      <Input name="website" label="Website" />
      <Input name="applyUrl" label="Listing / apply URL" />
      {(book === "investor" || book === "distribution") && (
        <>
          <Input name="ticketMin" label="Ticket min" type="number" />
          <Input name="ticketMax" label="Ticket max" type="number" />
        </>
      )}
      {book === "talent" && (
        <>
          <Input name="headshotUrl" label="Headshot URL" />
          <Input name="reelUrl" label="Reel URL" />
          <Input name="unionStatus" label="Union status" />
        </>
      )}
      <label className="sm:col-span-2 text-xs text-[#7d8b9c]">
        Thesis / brief
        <textarea
          name="thesis"
          rows={3}
          className="mt-1 w-full bg-[#141b24] border border-[#243040] rounded px-3 py-2 text-sm"
        />
      </label>
      <label className="sm:col-span-2 text-xs text-[#7d8b9c]">
        Notes
        <textarea
          name="notes"
          rows={2}
          className="mt-1 w-full bg-[#141b24] border border-[#243040] rounded px-3 py-2 text-sm"
        />
      </label>
      <button
        type="submit"
        disabled={busy}
        className="sm:col-span-2 bg-[#c9a227] text-[#07090d] font-semibold py-2.5 rounded text-sm disabled:opacity-50"
      >
        {busy ? "Saving…" : "Save to MongoDB"}
      </button>
    </form>
  );
}

function Input({
  name,
  label,
  type = "text",
  required,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="text-xs text-[#7d8b9c]">
      {label}
      <input
        name={name}
        type={type}
        required={required}
        className="mt-1 w-full bg-[#141b24] border border-[#243040] rounded px-3 py-2 text-sm text-[#d7e0ea]"
      />
    </label>
  );
}
