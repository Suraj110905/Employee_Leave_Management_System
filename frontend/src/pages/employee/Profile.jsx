import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { authService } from "@/services/authService";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Lock, Mail, Bell, Shield, Camera, Check } from "lucide-react";
import SectionHeader from "@/components/dashboard/SectionHeader";

/**
 * Employee Profile Page.
 * Implements HLD Use Cases: Update Profile, Manage notification preferences,
 * and simulate file upload (MERN Multer profile picture feature).
 *
 * @component
 */
export default function Profile() {
  const { user, updateProfile } = useAuth();
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    emailAlerts: user?.emailAlerts ?? true,
    smsAlerts: user?.smsAlerts ?? false,
    pushAlerts: user?.pushAlerts ?? true,
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [uploadingPic, setUploadingPic] = useState(false);
  const [feedback, setFeedback] = useState({ profile: "", password: "" });

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        emailAlerts: user.emailAlerts ?? true,
        smsAlerts: user.smsAlerts ?? false,
        pushAlerts: user.pushAlerts ?? true,
      });
    }
  }, [user]);

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    setFeedback((prev) => ({ ...prev, profile: "" }));
    try {
      await updateProfile({
        name: profileData.name,
        phone: profileData.phone,
        emailAlerts: profileData.emailAlerts,
        smsAlerts: profileData.smsAlerts,
        pushAlerts: profileData.pushAlerts,
      });
      setFeedback((prev) => ({ ...prev, profile: "Profile details updated successfully!" }));
    } catch (err) {
      setFeedback((prev) => ({ ...prev, profile: err.message || "Failed to update profile details." }));
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setFeedback((prev) => ({ ...prev, password: "Passwords do not match." }));
      return;
    }
    setSavingPassword(true);
    setFeedback((prev) => ({ ...prev, password: "" }));
    try {
      await authService.changePassword(passwordData.currentPassword, passwordData.newPassword);
      setFeedback((prev) => ({ ...prev, password: "Password changed successfully!" }));
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      setFeedback((prev) => ({ ...prev, password: err.message || "Failed to change password credentials." }));
    } finally {
      setSavingPassword(false);
    }
  };

  const handlePicUpload = (e) => {
    setUploadingPic(true);
    setTimeout(() => {
      setUploadingPic(false);
      alert("Profile picture uploaded successfully (mock Multer backend integration)!");
    }, 1500);
  };

  return (
    <div className="space-y-6 font-sans text-left select-none">
      <div>
        <h2 className="text-2xl font-bold text-foreground">My Profile</h2>
        <p className="text-xs text-muted-foreground mt-1">
          Manage your personal details, credentials, and alerts preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column: Avatar & Summary Details */}
        <div className="space-y-6 lg:col-span-1">
          <Card className="p-6 border border-border bg-card text-card-foreground shadow-xs text-center flex flex-col items-center">
            <div className="relative group">
              <Avatar className="h-24 w-24 border-2 border-border shadow-md">
                <AvatarFallback className="bg-primary/10 text-primary font-bold text-xl uppercase">
                  {getInitials(profileData.name)}
                </AvatarFallback>
              </Avatar>
              <label
                htmlFor="avatar-upload"
                className="absolute bottom-0 right-0 p-2 rounded-full bg-primary text-primary-foreground border border-border cursor-pointer shadow-lg hover:scale-105 active:scale-95 transition-all"
                title="Upload Profile Image"
              >
                <Camera className="w-4 h-4" />
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  onChange={handlePicUpload}
                  className="hidden"
                  disabled={uploadingPic}
                />
              </label>
            </div>

            <h3 className="text-base font-bold text-foreground mt-4">{profileData.name}</h3>
            <p className="text-xs text-muted-foreground mt-0.5">{user?.label || "Employee"}</p>
            <span className="mt-3 badge badge-approved uppercase tracking-wider text-[9px] font-bold">
              {user?.department || "General"} Department
            </span>

            <div className="w-full border-t border-border mt-6 pt-5 space-y-3.5 text-xs text-muted-foreground font-semibold">
              <div className="flex justify-between items-center">
                <span>Employee ID</span>
                <span className="text-foreground">{user?.id || "EMP-10024"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Reporting Manager</span>
                <span className="text-foreground">Jane Smith (Manager)</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Joined Date</span>
                <span className="text-foreground">Jan 15, 2024</span>
              </div>
            </div>
          </Card>

          {/* Preferences/Alerts Card */}
          <Card className="p-5 border border-border bg-card text-card-foreground shadow-xs">
            <SectionHeader title="System Alerts" subtitle="Configure notifications dispatch preferences" compact />
            <div className="space-y-4 mt-5">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-foreground">Email Alerts</span>
                  <p className="text-[10px] text-muted-foreground">Immediate leave updates dispatch</p>
                </div>
                <input
                  type="checkbox"
                  checked={profileData.emailAlerts}
                  onChange={(e) => setProfileData((prev) => ({ ...prev, emailAlerts: e.target.checked }))}
                  className="h-4 w-4 rounded border border-border accent-primary cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-foreground">SMS Notifications</span>
                  <p className="text-[10px] text-muted-foreground">Mobile text reminders fallback</p>
                </div>
                <input
                  type="checkbox"
                  checked={profileData.smsAlerts}
                  onChange={(e) => setProfileData((prev) => ({ ...prev, smsAlerts: e.target.checked }))}
                  className="h-4 w-4 rounded border border-border accent-primary cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-foreground">Push Notifications</span>
                  <p className="text-[10px] text-muted-foreground">Real-time web browser popups</p>
                </div>
                <input
                  type="checkbox"
                  checked={profileData.pushAlerts}
                  onChange={(e) => setProfileData((prev) => ({ ...prev, pushAlerts: e.target.checked }))}
                  className="h-4 w-4 rounded border border-border accent-primary cursor-pointer"
                />
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Update Forms */}
        <div className="space-y-6 lg:col-span-2">
          {/* General Information Form */}
          <Card className="p-6 border border-border bg-card text-card-foreground shadow-xs">
            <SectionHeader title="Profile Details" subtitle="General identity parameters configuration" />

            <form onSubmit={handleProfileSubmit} className="space-y-4 mt-6">
              {feedback.profile && (
                <div className="flex items-center gap-2 p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-xs rounded-xl font-medium">
                  <Check className="w-4 h-4 shrink-0" />
                  <span>{feedback.profile}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                    Full Name
                  </label>
                  <Input
                    required
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData((prev) => ({ ...prev, name: e.target.value }))}
                    className="h-10 w-full rounded-xl bg-card border-border text-xs font-semibold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                    Email Address
                  </label>
                  <Input
                    required
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData((prev) => ({ ...prev, email: e.target.value }))}
                    className="h-10 w-full rounded-xl bg-card border-border text-xs font-semibold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                    Phone Contact
                  </label>
                  <Input
                    required
                    type="text"
                    value={profileData.phone}
                    onChange={(e) => setProfileData((prev) => ({ ...prev, phone: e.target.value }))}
                    className="h-10 w-full rounded-xl bg-card border-border text-xs font-semibold"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <Button
                  type="submit"
                  disabled={savingProfile}
                  className="rounded-xl font-bold text-xs h-9 px-5 cursor-pointer shadow-sm"
                >
                  {savingProfile ? "Saving changes..." : "Save Profile Details"}
                </Button>
              </div>
            </form>
          </Card>

          {/* Security / Password Form */}
          <Card className="p-6 border border-border bg-card text-card-foreground shadow-xs">
            <SectionHeader title="Authentication Security" subtitle="Update account login passphrase keys" />

            <form onSubmit={handlePasswordSubmit} className="space-y-4 mt-6">
              {feedback.password && (
                <div
                  className={`flex items-center gap-2 p-3 text-xs rounded-xl font-medium ${
                    feedback.password.includes("successfully")
                      ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-600"
                      : "bg-destructive/10 border border-destructive/25 text-destructive"
                  }`}
                >
                  {feedback.password.includes("successfully") ? (
                    <Check className="w-4 h-4 shrink-0" />
                  ) : (
                    <Shield className="w-4 h-4 shrink-0" />
                  )}
                  <span>{feedback.password}</span>
                </div>
              )}

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                    Current Password
                  </label>
                  <Input
                    required
                    type="password"
                    placeholder="Enter current password"
                    value={passwordData.currentPassword}
                    onChange={(e) =>
                      setPasswordData((prev) => ({ ...prev, currentPassword: e.target.value }))
                    }
                    className="h-10 w-full rounded-xl bg-card border-border text-xs font-semibold"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                      New Password
                    </label>
                    <Input
                      required
                      type="password"
                      placeholder="Minimum 6 characters"
                      value={passwordData.newPassword}
                      onChange={(e) =>
                        setPasswordData((prev) => ({ ...prev, newPassword: e.target.value }))
                      }
                      className="h-10 w-full rounded-xl bg-card border-border text-xs font-semibold"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                      Confirm New Password
                    </label>
                    <Input
                      required
                      type="password"
                      placeholder="Verify new passphrase key"
                      value={passwordData.confirmPassword}
                      onChange={(e) =>
                        setPasswordData((prev) => ({ ...prev, confirmPassword: e.target.value }))
                      }
                      className="h-10 w-full rounded-xl bg-card border-border text-xs font-semibold"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <Button
                  type="submit"
                  disabled={savingPassword}
                  className="rounded-xl font-bold text-xs h-9 px-5 cursor-pointer shadow-sm"
                >
                  {savingPassword ? "Updating..." : "Update Security Passphrase"}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
