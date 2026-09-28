"use client";

import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import { Project } from "@/types/project";
import { getLanguageDistribution } from "@/utils/dashboard";

interface ProjectsChartProps {
  projects: Project[];
}

export function ProjectsChart({ projects }: ProjectsChartProps) {
  const data = getLanguageDistribution(projects);
  const colors = ["#2563eb", "#0f766e", "#7c3aed", "#c2410c", "#64748b"];

  if (data.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col items-center gap-5 sm:flex-row sm:justify-center">
      <div
        className="h-56 w-full max-w-64"
        role="img"
        aria-label="Gráfico de distribuição dos projetos por linguagem"
      >
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="count"
              nameKey="language"
              cx="50%"
              cy="50%"
              innerRadius={54}
              outerRadius={82}
              paddingAngle={2}
              stroke="#ffffff"
              strokeWidth={2}
            >
              {data.map((item, index) => (
                <Cell
                  key={item.language}
                  fill={colors[index % colors.length]}
                />
              ))}
            </Pie>

            <Tooltip
              formatter={(value) => [value, "Projetos"]}
              contentStyle={{
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
                boxShadow: "0 4px 8px rgb(15 23 42 / 0.08)",
                fontSize: "0.875rem",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <ul className="grid w-full gap-2.5 text-sm sm:max-w-60">
        {data.map((item, index) => (
          <li key={item.language} className="flex items-center gap-3">
            <span
              className="size-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: colors[index % colors.length] }}
              aria-hidden="true"
            />
            <span className="min-w-0 flex-1 truncate text-slate-700">
              {item.language}
            </span>
            <span className="font-medium tabular-nums text-slate-950">
              {item.count}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
