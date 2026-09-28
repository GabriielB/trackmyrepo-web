"use client";

import { SubmitHandler, useForm } from "react-hook-form";

import { ProjectFormValues } from "@/types/project";

interface ProjectFormProps {
  onSubmit: (repository: string) => Promise<void>;
}

export function ProjectForm({ onSubmit }: ProjectFormProps) {
  const {
    register,
    handleSubmit,
    reset,

    formState: { errors, isSubmitting },
  } = useForm<ProjectFormValues>({
    defaultValues: {
      repository: "",
    },
  });

  const submitForm: SubmitHandler<ProjectFormValues> = async (data) => {
    await onSubmit(data.repository.trim());

    reset();
  };

  return (
    <form
      onSubmit={handleSubmit(submitForm)}
      className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
    >
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="flex-1">
          <label
            htmlFor="repository"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Repositório do GitHub
          </label>

          <input
            id="repository"
            type="text"
            placeholder="Ex.: flutter/flutter"
            {...register("repository", {
              required: "Informe um repositório.",

              pattern: {
                value: /^[^/\s]+\/[^/\s]+$/,

                message: "Use o formato owner/repositorio.",
              },
            })}
            className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500"
          />

          {errors.repository && (
            <p className="mt-2 text-sm text-red-600">
              {errors.repository.message}
            </p>
          )}
        </div>

        <div className="flex items-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="h-[50px] rounded-lg bg-blue-600 px-6 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? "Adicionando..." : "Adicionar projeto"}
          </button>
        </div>
      </div>
    </form>
  );
}
