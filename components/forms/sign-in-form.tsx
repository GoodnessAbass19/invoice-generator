/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { signInSchema } from "@/lib/form-schema";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import z from "zod";

type Inputs = z.infer<typeof signInSchema>;

const SignInForm = () => {
  const [passwordShown, setPasswordShown] = useState(false);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const SignInMutation = useMutation({
    mutationFn: async (formData: Inputs) => {
      const res = await fetch("/api/sign-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to create store.");
      }
      return res.json();
    },
    onSuccess: (data) => {
      router.push("/dashboard");
    },
    onError: (error: any) => {
      // Handle error (e.g., show toast)
      console.error("Account creation failed:", error.message);
    },
  });

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    console.log(data);
    SignInMutation.mutate(data);
  };

  return (
    <div className="w-full max-w-110 bg-white shadow-xl rounded-xl overflow-hidden border border-gray-100">
      <div className="pt-10 pb-2 px-8">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <span className="material-symbols-outlined text-primary text-3xl">
              lock_open
            </span>
          </div>
        </div>
        <h2 className="text-gray-900  tracking-tight text-2xl font-bold leading-tight text-center">
          Sign in to your account
        </h2>
        <p className="text-gray-500 text-sm text-center mt-2">
          Enter your credentials to access the trader portal
        </p>
      </div>

      {/* <!-- Login Form --> */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="px-8 py-6 flex flex-col gap-5"
      >
        {/* <!-- Email Field --> */}
        <div className="flex flex-col gap-2">
          <label className="text-gray-900 text-sm font-medium">
            Email Address
          </label>
          <div className="relative">
            <input
              {...register("email")}
              className="form-input flex w-full rounded-lg text-gray-900  border border-gray-300 bg-white focus:outline-0 focus:ring-2 focus:ring-primary/20 focus:border-primary h-12 px-4 text-base font-normal placeholder:text-gray-400"
              placeholder="name@company.com"
              type="email"
            />
          </div>
        </div>
        {/* <!-- Password Field --> */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <label className="text-gray-900 text-sm font-medium">
              Password
            </label>
            <a
              className="text-[#135bec] text-xs font-semibold hover:underline"
              href="#"
            >
              Forgot password?
            </a>
          </div>
          <div className="flex flex-col gap-1.5">
            <div className="relative">
              <input
                {...register("password")}
                className="w-full px-4 h-14 rounded-lg border border-[#cfd7e7] bg-white text-[#0d121b] placeholder:text-[#4c669a] focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                placeholder="••••••••"
                type={passwordShown ? "text" : "password"}
              />
              {passwordShown ? (
                <button
                  onClick={() => setPasswordShown(!passwordShown)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#4c669a] hover:text-[#0d121b]"
                  type="button"
                >
                  <span className="material-symbols-outlined">
                    visibility_off
                  </span>
                </button>
              ) : (
                <button
                  onClick={() => setPasswordShown(!passwordShown)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#4c669a] hover:text-[#0d121b]"
                  type="button"
                >
                  <span className="material-symbols-outlined">visibility</span>
                </button>
              )}
            </div>
          </div>
        </div>
        {/* <!-- Remember Me --> */}

        {/* <!-- Sign In Button --> */}
        <button
          className="w-full bg-[#135bec] hover:bg-[#135bec]/90 text-white font-semibold h-12 rounded-lg transition-colors shadow-lg shadow-[#135bec]/20 flex items-center justify-center gap-2 disabled:opacity-40"
          type="submit"
          disabled={SignInMutation.isPending}
        >
          <span>Sign In</span>
          {SignInMutation.isPending ? (
            <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform animate-spin">
              cached
            </span>
          ) : (
            <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">
              arrow_forward
            </span>
          )}
        </button>
      </form>
    </div>
  );
};

export default SignInForm;
