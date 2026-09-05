"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { deskApi } from "@/lib/desk/client";
import {
  DEFAULT_DESK_EMAIL,
  DEFAULT_DESK_PASSWORD,
} from "@/lib/desk/defaults";

export default function DeskAuthCard({ mode }: { mode: "login" | "signup" }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState(
    mode === "login" ? DEFAULT_DESK_EMAIL : ""
  );
  const [password, setPassword] = useState(
    mode === "login" ? DEFAULT_DESK_PASSWORD : ""
  );
  const [inviteCode, setInviteCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (mode === "signup") {
        await deskApi.signup({ name, email, password, inviteCode });
      } else {
        await deskApi.login(email, password);
      }
      router.push("/desk");
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#07090d] flex items-center justify-center px-4 font-desk">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <p className="text-[10px] font-mono tracking-[0.35em] text-[#c9a227] uppercase mb-3">
          Abramovich Media · Desk
        </p>
        <h1 className="text-3xl font-bold text-[#d7e0ea] mb-2">
          {mode === "login" ? "Sign in" : "Create an account"}
        </h1>
        <p className="text-sm text-[#7d8b9c] mb-8">
          Talent, distribution, financiers, production work, and brand deals —
          one CRM.
        </p>

        <form
          onSubmit={handleSubmit}
          className="border border-[#243040] bg-[#0e131b] rounded-xl p-6 space-y-4"
        >
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {mode === "signup" && (
            <Field label="Name">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className={inputClass}
                placeholder="Jonathan Abramovich"
              />
            </Field>
          )}

          <Field label="Email">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={inputClass}
              placeholder={DEFAULT_DESK_EMAIL}
            />
          </Field>

          <Field label="Password">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={mode === "signup" ? 6 : 1}
              className={inputClass}
              placeholder={
                mode === "signup" ? "At least 6 characters" : DEFAULT_DESK_PASSWORD
              }
            />
          </Field>

          {mode === "signup" && (
            <Field label="Invite code (if your team uses one)">
              <input
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value)}
                className={inputClass}
                placeholder="Optional unless DESK_INVITE_CODE is set"
              />
            </Field>
          )}

          {mode === "login" && (
            <p className="text-[11px] font-mono text-[#7d8b9c]">
              Default · {DEFAULT_DESK_EMAIL} · {DEFAULT_DESK_PASSWORD}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#c9a227] text-[#07090d] font-semibold py-2.5 rounded-lg text-sm hover:bg-[#e4c56a] disabled:opacity-50 transition-colors"
          >
            {loading
              ? "Working…"
              : mode === "login"
                ? "Sign in"
                : "Create account"}
          </button>
        </form>

        <p className="text-sm text-[#7d8b9c] mt-6">
          {mode === "login" ? (
            <>
              Need an account?{" "}
              <Link href="/desk/signup" className="text-[#e4c56a] hover:underline">
                Sign up
              </Link>
            </>
          ) : (
            <>
              Already have access?{" "}
              <Link href="/desk/login" className="text-[#e4c56a] hover:underline">
                Sign in
              </Link>
            </>
          )}
          <span className="block mt-2">
            <Link href="/" className="hover:text-[#d7e0ea]">
              ← Back to abramovichmedia.com
            </Link>
          </span>
        </p>
      </motion.div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="block text-xs font-medium text-[#7d8b9c] mb-1.5">
        {label}
      </span>
      {children}
    </label>
  );
}

const inputClass =
  "w-full bg-white/5 border border-[#243040] text-[#d7e0ea] rounded-lg px-4 py-2.5 text-sm focus:border-[#c9a227] focus:ring-1 focus:ring-[#c9a227] outline-none placeholder:text-white/20";
