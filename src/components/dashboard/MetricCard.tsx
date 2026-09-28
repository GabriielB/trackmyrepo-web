interface MetricCardProps {
  title: string;
  value: string;
}

export function MetricCard({ title, value }: MetricCardProps) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
      <p className="text-sm font-medium text-slate-600">{title}</p>

      <p className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">
        {value}
      </p>
    </article>
  );
}
