"use client";

import Link from "next/link";
import { forwardRef, useId } from "react";

// Shared building blocks. Every page uses these instead of styling its own
// buttons, fields or notices, so Kinnect looks and behaves the same everywhere.

type Variant = "primary" | "secondary" | "quiet";

const buttonBase =
  "inline-flex min-h-11 items-center justify-center gap-2 whitespace-nowrap px-5 label text-[13px]! cursor-pointer transition-colors border disabled:cursor-not-allowed disabled:bg-disabled disabled:text-disabled-ink disabled:border-disabled";

const buttonVariants: Record<Variant, string> = {
  primary: "bg-accent text-white border-accent hover:bg-accent-hover hover:border-accent-hover active:bg-accent-pressed",
  secondary: "bg-surface text-ink border-ink hover:bg-hover active:bg-hover",
  quiet: "bg-transparent text-ink border-transparent underline underline-offset-4 hover:decoration-2 px-2",
};

export function Button({
  variant = "primary",
  className = "",
  type = "button",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return <button type={type} className={`${buttonBase} ${buttonVariants[variant]} ${className}`} {...props} />;
}

export function ButtonLink({
  variant = "primary",
  className = "",
  ...props
}: React.ComponentProps<typeof Link> & { variant?: Variant }) {
  return <Link className={`${buttonBase} ${buttonVariants[variant]} ${className}`} {...props} />;
}

export function TextLink({ className = "", ...props }: React.ComponentProps<typeof Link>) {
  return <Link className={`underline underline-offset-4 hover:decoration-2 ${className}`} {...props} />;
}

type FieldProps = {
  label: string;
  hint?: string;
  error?: string;
  // Shown at the right of the label row, e.g. a character count
  aside?: React.ReactNode;
};

// A labelled input or textarea. The error sits right under the field, is
// announced to screen readers, and never clears what the person typed.
export const Field = forwardRef<
  HTMLInputElement & HTMLTextAreaElement,
  FieldProps &
    (
      | ({ multiline?: false } & React.InputHTMLAttributes<HTMLInputElement>)
      | ({ multiline: true } & React.TextareaHTMLAttributes<HTMLTextAreaElement>)
    )
>(function Field({ label, hint, error, aside, multiline, className = "", ...props }, ref) {
  const id = useId();
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [errorId, hintId].filter(Boolean).join(" ") || undefined;
  const control = `w-full bg-surface text-ink border px-3 text-base placeholder:text-muted hover:bg-hover focus-visible:bg-surface ${
    error ? "border-danger border-2" : "border-ink"
  } ${className}`;

  return (
    <div className="grid gap-1.5">
      <div className="flex items-baseline justify-between gap-4">
        <label htmlFor={id} className="label">
          {label}
        </label>
        {aside}
      </div>
      {multiline ? (
        <textarea
          ref={ref}
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={`${control} min-h-32 py-2.5 leading-normal`}
          {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
      ) : (
        <input
          ref={ref}
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={`${control} min-h-11`}
          {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
        />
      )}
      {error && (
        <p id={errorId} className="flex gap-1.5 text-sm font-semibold text-danger">
          <span aria-hidden="true">!</span>
          {error}
        </p>
      )}
      {hint && (
        <p id={hintId} className="text-sm text-muted">
          {hint}
        </p>
      )}
    </div>
  );
});

// A boxed notice at the top of a page: welcome back, storage blocked, and so on.
export function Banner({
  tone = "info",
  title,
  children,
}: {
  tone?: "info" | "accent";
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <section
      aria-label={title}
      className={`border p-4 ${tone === "accent" ? "border-accent border-l-8" : "border-ink"} bg-surface`}
    >
      <p className="font-bold">{title}</p>
      {children && <div className="mt-1 text-muted">{children}</div>}
    </section>
  );
}

// A short confirmation after an action ("Added @milemarker"). It lives in a
// polite live region so screen readers announce it without moving focus.
export function Toast({ message }: { message: string | null }) {
  return (
    <div role="status" aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-20 z-30 sm:bottom-6 flex justify-center px-4">
      {message && <p className="bg-ink px-5 py-3 text-sm font-semibold text-paper">{message}</p>}
    </div>
  );
}

export function PageHeader({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <header className="grid gap-2 border-b border-ink pb-4">
      <h1 className="text-4xl font-bold tracking-tight">{title}</h1>
      {children && <div className="text-muted">{children}</div>}
    </header>
  );
}

// A square of initials, standing in for a profile photo (Kinnect is text only).
export function Avatar({ name, size = "md" }: { name: string; size?: "md" | "lg" }) {
  const initials = name
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return (
    <span
      aria-hidden="true"
      className={`grid shrink-0 place-items-center bg-ink font-bold text-paper ${size === "lg" ? "size-14 text-lg" : "size-10 text-sm"}`}
    >
      {initials}
    </span>
  );
}
