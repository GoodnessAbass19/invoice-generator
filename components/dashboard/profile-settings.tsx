"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";

const profileSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().optional(),
  currentPassword: z.string().optional(),
  newPassword: z.string().min(6, "Password must be 6+ chars").optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfileSettingsPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  });

  const { register, handleSubmit, reset } = form;

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    const file = e.target.files[0];
    setAvatarPreview(URL.createObjectURL(file));
  };

  const onSubmit = async (values: ProfileFormValues) => {
    try {
      setIsSubmitting(true);

      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!res.ok) throw new Error("Failed to update profile");

      toast.success("Profile updated successfully");
    } catch (err) {
      toast.error("Update failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-8">
      <h1 className="text-2xl font-bold">Profile Settings</h1>

      {/* Profile Picture */}
      <div className="flex items-center gap-4">
        <Avatar className="w-20 h-20">
          {avatarPreview ? (
            <AvatarImage src={avatarPreview} />
          ) : (
            <AvatarFallback>JD</AvatarFallback>
          )}
        </Avatar>
        <div>
          <label className="cursor-pointer text-blue-600 hover:underline">
            Change Avatar
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </label>
        </div>
      </div>

      {/* Basic Info Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 bg-white dark:bg-[#1a2133] p-6 rounded-xl shadow-md"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Name</label>
            <Input {...register("name")} />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Email</label>
            <Input {...register("email")} type="email" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Phone</label>
          <Input {...register("phone")} type="tel" />
        </div>

        {/* Password Change */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-1">
              Current Password
            </label>
            <Input {...register("currentPassword")} type="password" />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">
              New Password
            </label>
            <Input {...register("newPassword")} type="password" />
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>

      {/* Preferences */}
      <div className="bg-white dark:bg-[#1a2133] p-6 rounded-xl shadow-md space-y-4">
        <h2 className="text-lg font-bold">Preferences</h2>
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <label className="flex items-center gap-2">
            <input type="checkbox" className="w-4 h-4" />
            Enable Dark Mode
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" className="w-4 h-4" />
            Email Notifications
          </label>
        </div>
      </div>
    </div>
  );
}
