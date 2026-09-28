"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Project } from "@/types/project";

interface ProjectsChartProps {
  projects: Project[];
}

export function ProjectsChart({ projects }: ProjectsChartProps) {
  const data = projects.map((project) => ({
    name: project.display_name ?? project.repository.name,

    stars: project.repository.stars,
  }));

  if (data.length === 0) {
    return null;
  }

  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />

          <XAxis dataKey="name" tickLine={false} />

          <YAxis tickLine={false} />

          <Tooltip />

          <Bar
            dataKey="stars"
            name="Stars"
            fill="#2563eb"
            radius={[6, 6, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
