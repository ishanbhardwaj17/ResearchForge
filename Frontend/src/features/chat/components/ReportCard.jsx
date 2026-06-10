import ReactMarkdown from 'react-markdown'

function SourceChip({ source, index }) {
  const label = source?.title || source?.sourceTitle || source?.url || `Source ${index + 1}`
  const href = source?.url

  if (!href) {
    return (
      <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-slate-300">
        {label}
      </span>
    )
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="rounded-full border border-sky-300/20 bg-sky-300/10 px-3 py-1.5 text-xs text-sky-100 transition hover:border-sky-300/40 hover:bg-sky-300/14"
    >
      {label}
    </a>
  )
}

export default function ReportCard({ report, isStreaming = false }) {
  if (!report) {
    return null
  }

  return (
    <article className="mt-4 rounded-[24px] border border-white/10 bg-black/20 p-5">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-slate-400">
          {report.reportType?.replaceAll('_', ' ') || 'Research report'}
        </span>
        {report.provider ? (
          <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-slate-400">
            {report.provider}
          </span>
        ) : null}
      </div>

      <h3 className="mt-4 text-xl font-semibold text-white">{report.title}</h3>

      <div className="markdown-body mt-4 text-sm leading-7 text-slate-200">
        <ReactMarkdown>{report.content}</ReactMarkdown>
      </div>

      <div className="mt-5">
        <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-slate-500">
          Sources
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {report.sources?.length ? (
            report.sources.map((source, index) => (
              <SourceChip key={`${source?.url || source?.title || 'source'}-${index}`} source={source} index={index} />
            ))
          ) : (
            <span className="text-xs text-slate-500">No sources were returned.</span>
          )}
        </div>
      </div>

      {isStreaming ? (
        <div className="mt-4 flex items-center gap-2 text-xs text-sky-200">
          <span className="h-2 w-2 animate-pulse rounded-full bg-sky-300" />
          Preparing response
        </div>
      ) : null}
    </article>
  )
}
