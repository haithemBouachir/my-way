import { useEffect, useMemo, useRef, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { apiClient } from "../../shared/api/client";
import { useAuth } from "../../shared/auth/AuthContext";
import { SquareImageCropper } from "../../shared/components/cropper/SquareImageCropper";
import type { UserProfile } from "../../shared/types/models";
import "./ProfilePage.css";

const initialForm = {
  fullName: "",
  email: "",
  avatarUrl: "",
  phone: "",
  address: "",
  postalCode: "",
  city: "",
  description: "",
};

export function ProfilePage() {
  const { token, setSession, updateProfileSession } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [form, setForm] = useState(initialForm);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [cropperOpen, setCropperOpen] = useState(false);
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const initials = useMemo(() => {
    const source = (form.fullName || profile?.fullName || "User").trim();
    const parts = source.split(/\s+/).slice(0, 2);
    return parts.map((part) => part[0]?.toUpperCase() ?? "").join("");
  }, [form.fullName, profile?.fullName]);

  const fetchProfile = async () => {
    const response = await apiClient.get<UserProfile>("/profile");
    setProfile(response.data);
    setForm({
      fullName: response.data.fullName,
      email: response.data.email,
      avatarUrl: response.data.avatarUrl ?? "",
      phone: response.data.phone ?? "",
      address: response.data.address ?? "",
      postalCode: response.data.postalCode ?? "",
      city: response.data.city ?? "",
      description: response.data.description ?? "",
    });
  };

  useEffect(() => {
    fetchProfile().catch(() => {
      setProfile(null);
    });
  }, []);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFeedback(null);

    const payload = {
      fullName: form.fullName,
      email: form.email,
      avatarUrl: form.avatarUrl.trim() || null,
      phone: form.phone.trim() || null,
      address: form.address.trim() || null,
      postalCode: form.postalCode.trim() || null,
      city: form.city.trim() || null,
      description: form.description.trim() || null,
    };

    const response = await apiClient.put<UserProfile>("/profile", payload);
    setProfile(response.data);

    if (response.data.token && token) {
      setSession(response.data.token, response.data.fullName, response.data.avatarUrl);
    } else {
      updateProfileSession(response.data.fullName, response.data.avatarUrl);
    }

    setFeedback("Profile updated successfully.");
  };

  const onPickAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const onAvatarFileSelected = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setFeedback("Please select an image file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : null;
      setSourceImage(result);
      setCropperOpen(Boolean(result));
      setFeedback(null);
    };
    reader.readAsDataURL(file);
  };

  const onApplyCrop = (dataUrl: string) => {
    setForm((current) => ({ ...current, avatarUrl: dataUrl }));
    setSourceImage(null);
    setCropperOpen(false);
    setFeedback("Avatar cropped. Save profile to apply changes.");
  };

  const onCancelCrop = () => {
    setSourceImage(null);
    setCropperOpen(false);
  };

  const removeAvatar = () => {
    setForm((current) => ({ ...current, avatarUrl: "" }));
    setFeedback("Avatar removed. Save profile to apply changes.");
  };

  return (
    <section className="profile-layout">
      <article className="panel profile-summary">
        <h2>Profile</h2>

        <div className="profile-avatar-shell" aria-hidden="true">
          {form.avatarUrl ? (
            <img src={form.avatarUrl} alt="" className="profile-avatar-image" />
          ) : (
            <span>{initials}</span>
          )}
        </div>

        <p>{profile?.fullName || "-"}</p>
        <p>{profile?.email || "-"}</p>
        <p>{profile?.phone || "No phone number"}</p>
        <p>
          {profile?.address || "No address"}
          {profile?.postalCode || profile?.city
            ? `, ${profile?.postalCode || ""} ${profile?.city || ""}`
            : ""}
        </p>
        <p>{profile?.description || "No description"}</p>

        <div className="profile-avatar-actions">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="profile-hidden-file"
            onChange={onAvatarFileSelected}
          />
          <button type="button" onClick={onPickAvatarClick}>
            Import image
          </button>
          {form.avatarUrl ? (
            <button type="button" className="secondary" onClick={removeAvatar}>
              Remove avatar
            </button>
          ) : null}
        </div>
      </article>

      <article className="panel">
        <h2>Update profile</h2>
        <form className="panel-form" onSubmit={onSubmit}>
          <label>
            Full name
            <input
              value={form.fullName}
              onChange={(event) => setForm((v) => ({ ...v, fullName: event.target.value }))}
              required
            />
          </label>

          <label>
            Email
            <input
              type="email"
              value={form.email}
              onChange={(event) => setForm((v) => ({ ...v, email: event.target.value }))}
              required
            />
          </label>

          <label>
            Telephone
            <input
              value={form.phone}
              onChange={(event) => setForm((v) => ({ ...v, phone: event.target.value }))}
              placeholder="+216..."
            />
          </label>

          <label>
            Address
            <input
              value={form.address}
              onChange={(event) => setForm((v) => ({ ...v, address: event.target.value }))}
              placeholder="Street and number"
            />
          </label>

          <div className="profile-address-grid">
            <label>
              Postal code
              <input
                value={form.postalCode}
                onChange={(event) => setForm((v) => ({ ...v, postalCode: event.target.value }))}
              />
            </label>

            <label>
              City
              <input
                value={form.city}
                onChange={(event) => setForm((v) => ({ ...v, city: event.target.value }))}
              />
            </label>
          </div>

          <label>
            Description
            <textarea
              rows={4}
              value={form.description}
              onChange={(event) => setForm((v) => ({ ...v, description: event.target.value }))}
              placeholder="Professional summary"
            />
          </label>

          <button type="submit">Save profile</button>
          {feedback ? <p className="profile-feedback">{feedback}</p> : null}
        </form>
      </article>

      <SquareImageCropper
        open={cropperOpen}
        imageSrc={sourceImage}
        onCancel={onCancelCrop}
        onApply={onApplyCrop}
      />
    </section>
  );
}
