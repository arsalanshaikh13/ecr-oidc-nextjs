"use client";

import { useState } from "react";
import {
  updateProfileAction,
  resendVerificationEmailAction,
  confirmEmailAction,
  updatePasswordAction,
} from "@/lib/settings-actions";
import { authClient } from "@/lib/auth-client";

interface SettingsFormProps {
  user: User;
}

export default function SettingsForm({ user }: SettingsFormProps) {
  const [formData, setFormData] = useState({
    name: user.name || "",
    email: user.email || "",
  });

  const [passwordData, setPasswordData] = useState({
    password: "",
    confirmPassword: "",
  });

  const [confirmationCode, setConfirmationCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear messages when user starts typing
    setError(null);
    setSuccess(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    if (confirmationCode) {
      try {
        await confirmEmailAction(confirmationCode);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to confirm email",
        );
        setIsLoading(false);
        return;
      }
      setSuccess("Email confirmed successfully!");
      user.emailVerified = true;
      setConfirmationCode("");
      setIsLoading(false);
      return;
    }

    const name = formData.name.trim();
    const email = formData.email.trim();

    try {
      // Validate form
      if (!name) {
        throw new Error("Name is required");
      }

      if (!email) {
        throw new Error("Email is required");
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error("Please enter a valid email address");
      }

      const userAttributes = {};
      if (name !== user.name) {
        Object.assign(userAttributes, { name });
      }
      if (email !== user.email) {
        Object.assign(userAttributes, { email });
      }

      if (Object.keys(userAttributes).length === 0) {
        setIsLoading(false);
        return;
      }

      await updateProfileAction(userAttributes);

      const result = await authClient.updateUser({
        name: formData.name.trim(),
      });

      if (email !== user.email) {
        user.emailVerified = false;
      }

      if (result.data?.status) {
        setSuccess("Profile updated successfully!");
      } else if (result.error) {
        setError(result.error.statusText || "Failed to update profile");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendVerification = async () => {
    setError(null);
    setSuccess(null);
    setIsResending(true);

    try {
      const result = await resendVerificationEmailAction();
      setSuccess(result.message);
      setConfirmationCode("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsResending(false);
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(null);
    setSuccess(null);
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsPasswordLoading(true);

    try {
      if (!passwordData.password.trim()) {
        throw new Error("Password is required");
      }

      if (passwordData.password !== passwordData.confirmPassword) {
        throw new Error("Passwords do not match");
      }

      if (passwordData.password.length < 8) {
        throw new Error("Password must be at least 8 characters long");
      }

      await updatePasswordAction({ password: passwordData.password });
      setSuccess("Password updated successfully!");
      setPasswordData({ password: "", confirmPassword: "" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsPasswordLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-100 rounded-lg">
            {error}
          </div>
        )}

        {success && (
          <div className="p-4 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-100 rounded-lg">
            {success}
          </div>
        )}

        {/* Name Field */}
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
          >
            Full Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your full name"
            required
            className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Email Field */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
          >
            Email Address
            {user.emailVerified && (
              <span className="text-green-600 dark:text-green-400 font-normal ml-2">
                ✓ Verified
              </span>
            )}
            {!user.emailVerified && (
              <span className="text-orange-600 dark:text-orange-400 font-normal ml-2">
                ⚠ Not Verified
              </span>
            )}
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email address"
            required
            className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Email Verification Section */}
        {!user.emailVerified && (
          <div className="p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
            <h3 className="font-semibold text-orange-900 dark:text-orange-100 mb-3">
              Verify Your Email
            </h3>
            <p className="text-sm text-orange-800 dark:text-orange-200 mb-3">
              A verification email has been sent to your email address. Please
              enter the confirmation code below.
            </p>
            <div className="space-y-2">
              <input
                type="text"
                value={confirmationCode}
                onChange={(e) => setConfirmationCode(e.target.value)}
                placeholder="Enter verification code"
                className="w-full px-4 py-2 border border-orange-300 dark:border-orange-700 rounded-lg bg-white dark:bg-orange-900/40 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <button
                type="button"
                onClick={handleResendVerification}
                disabled={isResending}
                className="w-full px-4 py-2 text-sm bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300 rounded-lg hover:bg-orange-200 dark:hover:bg-orange-900/60 disabled:opacity-50 transition-colors font-medium"
              >
                {isResending ? "Sending..." : "Resend Verification Email"}
              </button>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>

      {/* Password Change Section - Only for non-social auth users */}
      {!user.identities && (
        <form
          onSubmit={handlePasswordSubmit}
          className="bg-white dark:bg-zinc-800 rounded-lg shadow p-6 space-y-4"
        >
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-4">
            Change Password
          </h2>

          {/* Password Field */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
            >
              New Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={passwordData.password}
              onChange={handlePasswordChange}
              placeholder="Enter new password (min 8 characters)"
              className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Confirm Password Field */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              placeholder="Confirm new password"
              className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={isPasswordLoading}
              className="flex-1 px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {isPasswordLoading ? "Updating..." : "Change Password"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
