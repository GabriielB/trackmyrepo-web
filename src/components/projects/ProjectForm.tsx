"use client";

import { SubmitHandler, useForm } from "react-hook-form";

import { ProjectFormValues } from "@/types/project";

interface ProjectFormProps {
  onSubmit: (repository: string) => Promise<boolean>;
}

export function ProjectForm({ onSubmit }: ProjectFormProps) {
  const {
    register,
    handleSubmit,
    reset,

    formState: { errors, isSubmitting },
  } = useForm<ProjectFormValues>({
    mode: "onBlur",
    defaultValues: {
      repository: "",
    },
  });

  const submitForm: SubmitHandler<ProjectFormValues> = async (data) => {
    const added = await onSubmit(data.repository.trim());

    if (added) {
      reset();
    }
  };

  return (
    <form
      onSubmit={handleSubmit(submitForm)}
      className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6"
    >
      <div className="mb-5">
        <h2 className="text-base font-semibold text-slate-950">
          Adicionar repositório
        </h2>
        <p className="mt-1 text-sm leading-6 text-slate-600">
          Informe um repositório público para começar a acompanhá-lo.
        </p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
        <div className="flex-1">
          <label
            htmlFor="repository"
            className="mb-2 block text-sm font-medium text-slate-800"
          >
            Repositório no GitHub
          </label>

          <input
            id="repository"
            type="text"
            placeholder="flutter/flutter"
            autoComplete="off"
            aria-describedby={
              errors.repository ? "repository-error" : "repository-hint"
            }
            aria-invalid={Boolean(errors.repository)}
            disabled={isSubmitting}
            {...register("repository", {
              required: "Informe um repositório.",

              pattern: {
                value: /^[^/\s]+\/[^/\s]+$/,

                message: "Use o formato owner/repositorio.",
              },
            })}
            className={`h-11 w-full rounded-lg border bg-white px-3.5 text-sm text-slate-950 outline-none transition-colors placeholder:text-slate-500 focus:ring-2 focus:ring-blue-600/20 disabled:bg-slate-50 disabled:text-slate-500 ${
              errors.repository
                ? "border-red-400 focus:border-red-500 focus:ring-red-500/15"
                : "border-slate-300 hover:border-slate-400 focus:border-blue-600"
            }`}
          />

          {errors.repository ? (
            <p
              id="repository-error"
              role="alert"
              className="mt-2 text-sm text-red-700"
            >
              {errors.repository.message}
            </p>
          ) : (
            <p id="repository-hint" className="mt-2 text-xs text-slate-500">
              Use o formato proprietário/repositório. Ex.: vercel/next.js
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex h-11 shrink-0 items-center justify-center rounded-lg bg-slate-950 px-5 text-sm font-semibold text-white transition-colors hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:bg-slate-400 sm:min-w-44"
        >
          {isSubmitting ? "Adicionando..." : "Adicionar projeto"}
        </button>
      </div>
    </form>
  );
}
