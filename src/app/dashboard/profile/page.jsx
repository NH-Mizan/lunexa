"use client";

import {
  useAuthSession,
  useAuthSessionActions,
} from "@/components/Auth/AuthSessionProvider";
import { apiRequest } from "@/lib/auth-client";
import { getAssetUrl } from "@/lib/asset-url";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Bounce, toast } from "react-toastify";
import {
  FaCamera,
  FaCheckCircle,
  FaEnvelope,
  FaMapMarkerAlt,
  FaPhone,
  FaSave,
  FaUser,
} from "react-icons/fa";

function getInitialFormState(user) {
  return {
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
  };
}

function InputField({ label, icon, ...props }) {
  return (
    <label className="space-y-2">
      <span className="flex items-center gap-2 text-sm font-semibold text-slate-700">
        <span className="text-slate-400">{icon}</span>
        {label}
      </span>
      <input
        {...props}
        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-pry focus:ring-4 focus:ring-rose-100"
      />
    </label>
  );
}

function InfoTile({ label, value, accent }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
        {label}
      </p>
      <p className={`mt-3 text-lg font-semibold ${accent || "text-slate-900"}`}>
        {value || "Not available"}
      </p>
    </div>
  );
}

export default function ProfilePage() {
  const user = useAuthSession();
  const { setUser } = useAuthSessionActions();
  const [formData, setFormData] = useState(() => getInitialFormState(user));
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setFormData(getInitialFormState(user));
  }, [user]);

  useEffect(() => {
    if (!selectedImage) {
      setPreviewUrl("");
      return undefined;
    }

    const objectUrl = URL.createObjectURL(selectedImage);
    setPreviewUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedImage]);

  const profileImage = previewUrl || getAssetUrl(user?.image);
  const isVerified = Number(user?.verify) === 1;
  const accountStatus = user?.status === "active" ? "Active" : "Inactive";

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function handleImageChange(event) {
    setSelectedImage(event.target.files?.[0] || null);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Name is required.", { transition: Bounce });
      return;
    }

    setIsSaving(true);

    try {
      const payload = new FormData();
      payload.append("name", formData.name);
      payload.append("email", formData.email);
      payload.append("phone", formData.phone);
      payload.append("address", formData.address);

      if (selectedImage) {
        payload.append("image", selectedImage);
      }

      const data = await apiRequest("/api/user", {
        method: "POST",
        body: payload,
      });

      const nextUser = data?.user ?? user;
      setUser(nextUser);
      setFormData(getInitialFormState(nextUser));
      setSelectedImage(null);

      toast.success(data?.message || "Profile updated successfully.", {
        transition: Bounce,
      });
    } catch (error) {
      toast.error(error.message || "Failed to update profile.", {
        transition: Bounce,
      });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-[linear-gradient(135deg,#fff8f8_0%,#ffffff_45%,#f7fbff_100%)] shadow-sm">
        <div className="grid gap-6 p-6 lg:grid-cols-[1.15fr_0.85fr] lg:p-8">
          <div className="space-y-5">
            <div className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
              {isVerified ? "Verified profile" : "Verification pending"}
            </div>
            <div>
              <h2 className="text-3xl font-bold text-slate-900">
                {user?.name || "Customer profile"}
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600">
                Keep your personal details updated so checkout, delivery, and
                account communication stay smooth.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <InfoTile label="Phone" value={user?.phone} />
              <InfoTile label="Status" value={accountStatus} accent="text-emerald-600" />
              <InfoTile
                label="Address"
                value={user?.address || user?.district}
                accent="text-slate-800"
              />
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-white/70 bg-white/80 p-5 shadow-lg backdrop-blur">
            <div className="flex items-center gap-4">
              <div className="relative h-20 w-20 overflow-hidden rounded-3xl border border-slate-200 bg-slate-100">
                <Image
                  src={profileImage}
                  alt={user?.name || "Customer"}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  {user?.name || "Customer"}
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  {user?.phone || user?.email || "No contact details"}
                </p>
                <p className="mt-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                  Member since{" "}
                  {user?.created_at
                    ? new Date(user.created_at).toLocaleDateString("en-GB")
                    : "N/A"}
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-slate-50 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                  Verification
                </p>
                <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-slate-800">
                  <FaCheckCircle className="text-emerald-500" />
                  {isVerified ? "Phone verified" : "Phone not verified"}
                </p>
              </div>
              <div className="rounded-2xl bg-slate-50 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                  District
                </p>
                <p className="mt-2 text-sm font-semibold text-slate-800">
                  {user?.district || "Not available"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <form
        onSubmit={handleSubmit}
        className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm lg:p-8"
      >
        <div className="flex flex-col gap-3 border-b border-slate-100 pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-pry">
              Edit Profile
            </p>
            <h3 className="mt-2 text-2xl font-bold text-slate-900">
              Personal information
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              Update your basic account details and save them directly to your
              profile.
            </p>
          </div>
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <FaSave />
            {isSaving ? "Saving..." : "Save changes"}
          </button>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <InputField
            label="Full name"
            icon={<FaUser />}
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your full name"
          />
          <InputField
            label="Email address"
            icon={<FaEnvelope />}
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
          />
          <InputField
            label="Phone number"
            icon={<FaPhone />}
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Enter your phone number"
          />

          <div className="space-y-2">
            <span className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <span className="text-slate-400">
                <FaCamera />
              </span>
              Profile image
            </span>
            <label className="flex min-h-[54px] cursor-pointer items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-600 transition hover:border-pry hover:bg-rose-50">
              <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
              {selectedImage ? selectedImage.name : "Choose image"}
            </label>
          </div>
        </div>

        <div className="mt-6">
          <label className="space-y-2">
            <span className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <span className="text-slate-400">
                <FaMapMarkerAlt />
              </span>
              Address
            </span>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows={5}
              placeholder="Enter your address"
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-pry focus:ring-4 focus:ring-rose-100"
            />
          </label>
        </div>
      </form>
    </div>
  );
}
