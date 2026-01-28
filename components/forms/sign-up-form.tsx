/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { signUpSchema } from "@/lib/form-schema";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import z from "zod";

type Inputs = z.infer<typeof signUpSchema>;

const SignUpForm = () => {
  const [passwordShown, setPasswordShown] = useState(false);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const createAccountMutation = useMutation({
    mutationFn: async (formData: Inputs) => {
      const res = await fetch("/api/sign-up", {
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
    createAccountMutation.mutate(data);
  };

  return (
    <div className="flex min-h-screen w-full flex-col lg:flex-row">
      {/* LEFT SIDE OF THE FORM */}
      <div
        className="relative hidden lg:flex lg:w-1/2 flex-col justify-center px-12 xl:px-24 bg-cover bg-center"
        data-alt="Professional office workspace with laptop and charts"
        style={{
          backgroundImage:
            "linear-gradient(rgba(19, 91, 236, 0.4), rgba(16, 22, 34, 0.8)), url('https://lh3.googleusercontent.com/aida-public/AB6AXuAiIMFt8SF0GX51_z65IhWXZpcBFaD0yv2hkBhU3JahHQrVxNl5hJ1g3lsudXSOcf9c6cw7MzXb1mHJBmdRnXv7DNyYeF3gmc4guKmMni4A068jFPMF1FLpbDcTZqiIpR81n9WvVwf4gU2lVFnx-JD_SujxKZ-dTUM8Qzf8LIM1z6NkqWRdlpsWjheogxB8J3UgzxnbJ3YZEcy5WhP2nTNC2DQIAgjMAXviTHs3Wng5OUedF1Ru8s9DkW7bYl4EizCFgJ9_TCPreQ')",
        }}
      >
        <div className="z-10 max-w-lg">
          <div className="mb-8 flex items-center gap-2 text-white">
            <span className="material-symbols-outlined text-4xl">
              receipt_long
            </span>
            <span className="text-2xl font-black tracking-tight">
              TRADERFLOW
            </span>
          </div>
          <h1 className="text-white text-5xl font-black leading-tight tracking-[-0.033em] mb-6">
            Growth is never by mere chance; it is the result of forces working
            together.
          </h1>
          <p className="text-white/80 text-lg font-normal leading-relaxed">
            Join thousands of global traders simplifying their commercial
            invoicing and documentation process with our enterprise-grade
            platform.
          </p>
        </div>
      </div>

      {/* RIGHT SIDE OF THE FORM */}
      <div className="flex flex-1 flex-col justify-center items-center py-12 px-6 sm:px-12 lg:px-20 bg-[#f6f6f7]">
        <div className="w-full max-w-120">
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-[#0d121b]  text-3xl font-bold leading-tight tracking-[-0.015em]">
              Create your Trader Account
            </h2>
            <p className="mt-2 text-[#4c669a] text-base">
              Already have an account?{" "}
              <a
                className="text-[#135bec] font-semibold hover:underline"
                href="#"
              >
                Log in
              </a>
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-[#0d121b] text-sm font-semibold">
                Full Name
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#4c669a]">
                  person
                </span>
                <input
                  {...register("fullName")}
                  className="w-full pl-11 pr-4 h-14 rounded-lg border border-[#cfd7e7] bg-white text-[#0d121b] placeholder:text-[#4c669a] focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                  placeholder="Enter your full name"
                  type="text"
                />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[#0d121b] text-sm font-semibold">
                Business Name
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#4c669a]">
                  corporate_fare
                </span>
                <input
                  {...register("businessName")}
                  className="w-full pl-11 pr-4 h-14 rounded-lg border border-[#cfd7e7] bg-white text-[#0d121b] placeholder:text-[#4c669a] focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                  placeholder="Enter registered business name"
                  type="text"
                />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[#0d121b] text-sm font-semibold">
                Work Email
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#4c669a]">
                  mail
                </span>
                <input
                  {...register("email")}
                  className="w-full pl-11 pr-4 h-14 rounded-lg border border-[#cfd7e7] bg-white text-[#0d121b] placeholder:text-[#4c669a] focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                  placeholder="you@company.com"
                  type="email"
                />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[#0d121b] text-sm font-semibold">
                Password
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#4c669a]">
                  lock
                </span>
                <input
                  {...register("password")}
                  className="w-full pl-11 pr-12 h-14 rounded-lg border border-[#cfd7e7] bg-white text-[#0d121b] placeholder:text-[#4c669a] focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
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
                    <span className="material-symbols-outlined">
                      visibility
                    </span>
                  </button>
                )}
              </div>
              <p className="text-xs text-[#4c669a] mt-1">
                Must be at least 8 characters
              </p>
            </div>

            {/* TOS Checkbox */}
            <div className="flex items-start gap-3 py-2">
              <input
                {...register("tos")}
                className="mt-1 h-5 w-5 rounded border-[#cfd7e7] text-primary focus:ring-primary transition-all cursor-pointer"
                id="tos"
                type="checkbox"
              />
              <label
                className="text-sm text-[#4c669a] cursor-pointer"
                htmlFor="tos"
              >
                I agree to the{" "}
                <a
                  className="text-primary hover:underline font-medium"
                  href="#"
                >
                  Terms of Service
                </a>{" "}
                and{" "}
                <a
                  className="text-primary hover:underline font-medium"
                  href="#"
                >
                  Privacy Policy
                </a>
                , including the processing of my business data.
              </label>
            </div>

            {/* Submit Button */}
            <button
              className="w-full bg-[#135bec] hover:bg-[#135bec]/90 text-white h-14 rounded-lg font-bold text-lg shadow-lg shadow-[#135bec]/20 transition-all flex items-center justify-center gap-2 group disabled:opacity-40"
              disabled={createAccountMutation.isPending}
              type="submit"
            >
              <span>Create Account</span>
              {createAccountMutation.isPending ? (
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
      </div>
    </div>
  );
};

export default SignUpForm;
