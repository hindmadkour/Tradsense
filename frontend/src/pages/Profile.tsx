import { useRef, useState, useEffect } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import {
  User,
  Camera,
  Mail,
  Lock,
  Moon,
  Sun,
  Save,
  Eye,
  EyeOff,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getCurrentUserId } from '@/lib/auth';
import { API_BASE_URL, submitContactMessage } from '@/lib/api';
import { useNavigate } from 'react-router-dom';
import { useTheme } from 'next-themes';
import { useLanguage } from '@/contexts/LanguageContext';

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'ar', name: 'العربية', flag: '🇲🇦' },
];

const Profile = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const userId = getCurrentUserId();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { setTheme } = useTheme();
  const { t, setLanguage, language } = useLanguage();
  const [darkMode, setDarkMode] = useState(true);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [avatarData, setAvatarData] = useState<string | null>(null);
  const [contactReplies, setContactReplies] = useState<any[]>([]);
  const [contactRepliesLoading, setContactRepliesLoading] = useState(false);
  const [supportSending, setSupportSending] = useState(false);
  const [supportForm, setSupportForm] = useState({
    subject: '',
    message: '',
  });
  
  const [profileData, setProfileData] = useState({
    fullName: 'Ahmed Bennani',
    email: 'ahmed@example.com',
    phone: '+212 600 000 000',
    country: 'Morocco',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/profile/${userId}`);
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.detail || 'Failed to load profile');
        }
        setProfileData({
          fullName: data.full_name || '',
          email: data.email || '',
          phone: data.phone || '',
          country: data.country || '',
        });
        const nextLanguage = data.preferred_language || 'en';
        const nextDarkMode = Boolean(data.dark_mode);
        setSelectedLanguage(nextLanguage);
        setLanguage(nextLanguage);
        setDarkMode(nextDarkMode);
        setTheme(nextDarkMode ? 'dark' : 'light');
        setAvatarData(data.avatar_data || null);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to load profile data.',
          variant: 'destructive',
        });
      }
    };
    loadProfile();
  }, [toast, userId]);

  const getAuthHeaders = () => {
    if (typeof window === 'undefined') return {};
    const token = localStorage.getItem('auth_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const fetchContactReplies = async (email: string) => {
    if (!email) return;
    setContactRepliesLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/contact/replies?email=${encodeURIComponent(email)}`, {
        headers: getAuthHeaders(),
      });
      const data = await response.json();
      setContactReplies(data.items || []);
    } catch (error) {
      setContactReplies([]);
    } finally {
      setContactRepliesLoading(false);
    }
  };

  useEffect(() => {
    if (profileData.email) {
      fetchContactReplies(profileData.email);
    }
  }, [profileData.email]);

  useEffect(() => {
    setSelectedLanguage(language);
  }, [language]);

  const updateSupportField = (field: keyof typeof supportForm) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setSupportForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleSupportSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!profileData.email.trim() || !supportForm.message.trim()) {
      toast({
        title: 'Missing details',
        description: 'Please add your email and a message.',
        variant: 'destructive',
      });
      return;
    }
    setSupportSending(true);
    try {
      await submitContactMessage({
        name: profileData.fullName.trim() || 'User',
        email: profileData.email.trim(),
        subject: supportForm.subject.trim() || undefined,
        message: supportForm.message.trim(),
      });
      toast({
        title: 'Message sent',
        description: 'Your message was sent to support.',
      });
      setSupportForm({ subject: '', message: '' });
      await fetchContactReplies(profileData.email);
    } catch (error) {
      toast({
        title: 'Send failed',
        description: 'Unable to send your message right now.',
        variant: 'destructive',
      });
    } finally {
      setSupportSending(false);
    }
  };

  const handleProfileSave = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/profile/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: profileData.fullName,
          email: profileData.email,
          phone: profileData.phone,
          country: profileData.country,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.detail || 'Failed to save profile');
      }
      toast({
        title: 'Profile Updated',
        description: 'Your profile information has been saved.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save profile information.',
        variant: 'destructive',
      });
    }
  };

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: 'Error',
        description: 'New passwords do not match.',
        variant: 'destructive',
      });
      return;
    }
    if (passwordData.newPassword.length < 6) {
      toast({
        title: 'Error',
        description: 'Password must be at least 6 characters.',
        variant: 'destructive',
      });
      return;
    }
    try {
      const res = await fetch(`${API_BASE_URL}/profile/${userId}/password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          current_password: passwordData.currentPassword,
          new_password: passwordData.newPassword,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.detail || 'Failed to update password');
      }
      toast({
        title: 'Password Changed',
        description: 'Your password has been updated successfully.',
      });
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update password.',
        variant: 'destructive',
      });
    }
  };

  const handleAvatarUpload = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarRemove = async () => {
    if (!avatarData) return;
    const confirmed = window.confirm(t('profile_remove_photo_confirm'));
    if (!confirmed) return;
    try {
      const res = await fetch(`${API_BASE_URL}/profile/${userId}/avatar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ avatar_data: '' }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.detail || 'Failed to remove avatar');
      }
      setAvatarData(null);
      toast({ title: 'Photo Removed', description: 'Your profile photo has been removed.' });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to remove photo.', variant: 'destructive' });
    }
  };

  const handleAvatarFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result?.toString();
      if (!dataUrl) return;
      try {
        const res = await fetch(`${API_BASE_URL}/profile/${userId}/avatar`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ avatar_data: dataUrl }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          throw new Error(data.detail || 'Failed to upload avatar');
        }
        setAvatarData(data.avatar_data || dataUrl);
        toast({ title: 'Avatar Updated', description: 'Your photo has been uploaded.' });
      } catch (error) {
        toast({ title: 'Error', description: 'Failed to upload avatar.', variant: 'destructive' });
      }
    };
    reader.readAsDataURL(file);
  };

  const savePreferences = async (nextLanguage: string, nextDarkMode: boolean) => {
    try {
      const res = await fetch(`${API_BASE_URL}/profile/${userId}/preferences`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          preferred_language: nextLanguage,
          dark_mode: nextDarkMode,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.detail || 'Failed to save preferences');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save preferences.',
        variant: 'destructive',
      });
    }
  };

  const handleLanguageChange = (code: string) => {
    setSelectedLanguage(code);
    setLanguage(code as 'en' | 'fr' | 'ar');
    savePreferences(code, darkMode);
  };

  const handleDarkModeChange = (checked: boolean) => {
    setDarkMode(checked);
    setTheme(checked ? 'dark' : 'light');
    savePreferences(selectedLanguage, checked);
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(t('profile_delete_confirm'));
    if (!confirmed) return;
    try {
      const res = await fetch(`${API_BASE_URL}/profile/${userId}`, { method: 'DELETE' });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.detail || 'Failed to delete account');
      }
      toast({ title: 'Account Deleted', description: 'Your account has been removed.' });
      navigate('/login');
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to delete account.', variant: 'destructive' });
    }
  };

  return (
    <DashboardLayout>
      <div className="relative space-y-8 max-w-6xl">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_10%_0%,rgba(56,189,248,0.12),transparent_45%),radial-gradient(circle_at_80%_10%,rgba(34,197,94,0.08),transparent_40%),radial-gradient(circle_at_50%_80%,rgba(14,116,144,0.12),transparent_45%)] dark:bg-[radial-gradient(circle_at_10%_0%,rgba(56,189,248,0.12),transparent_45%),radial-gradient(circle_at_80%_10%,rgba(34,197,94,0.08),transparent_40%),radial-gradient(circle_at_50%_80%,rgba(14,116,144,0.12),transparent_45%)]" />

        <div className="surface-card p-5 rounded-3xl border border-border/60 bg-gradient-to-r from-background via-background to-background">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="text-xs uppercase tracking-[0.35em] text-muted-foreground">{t('dashboard')}</div>
              <h1 className="text-2xl font-bold">{t('profile_title')}</h1>
              <p className="text-sm text-muted-foreground">{t('profile_subtitle')}</p>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-border/60 bg-secondary/50 px-4 py-2 text-xs text-muted-foreground">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Trader profile active
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[360px_minmax(0,1fr)] gap-6">
          <div className="space-y-6">
            <div className="surface-card p-6 rounded-3xl border border-border/60 bg-gradient-to-br from-background via-background to-background">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold">{t('profile_photo')}</h2>
                  <p className="text-xs text-muted-foreground">Customize your public profile look.</p>
                </div>
                <button
                  onClick={handleAvatarUpload}
                  className="h-9 w-9 rounded-full border border-border/60 bg-secondary/60 flex items-center justify-center hover:border-cyan-400/40 transition-colors"
                >
                  <Camera className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
              <div className="mt-6 flex flex-col gap-6">
                <div className="flex flex-col sm:flex-row sm:items-center gap-5">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cyan-500 via-sky-500 to-emerald-400 flex items-center justify-center overflow-hidden shadow-[0_14px_30px_-18px_rgba(56,189,248,0.9)]">
                      {avatarData ? (
                        <img src={avatarData} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-10 h-10 text-white" />
                      )}
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-lg font-semibold">{profileData.fullName}</p>
                    <p className="text-xs text-muted-foreground">{profileData.email}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="rounded-full border border-border/60 bg-secondary/60 px-3 py-1 text-xs text-muted-foreground">
                    {profileData.country || t('profile_country')}
                  </span>
                  <span className="rounded-full border border-border/60 bg-secondary/60 px-3 py-1 text-xs text-muted-foreground">
                    {profileData.phone || t('profile_phone')}
                  </span>
                </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" onClick={handleAvatarUpload}>
                    {t('profile_upload_photo')}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleAvatarRemove}
                    disabled={!avatarData}
                  >
                    {t('profile_remove_photo')}
                  </Button>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarFileChange}
                  className="hidden"
                />
              </div>
            </div>

            <div className="surface-card p-6 rounded-3xl border border-border/60 bg-gradient-to-br from-background via-background to-background">
              <h2 className="text-lg font-semibold mb-4">{t('profile_preferences')}</h2>
              <div className="mb-6">
                <Label className="mb-3 block">{t('profile_language')}</Label>
                <div className="grid grid-cols-2 gap-2">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleLanguageChange(lang.code)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${
                        selectedLanguage === lang.code
                          ? 'border-cyan-400/60 bg-cyan-400/10 text-cyan-600 dark:text-cyan-200'
                          : 'border-border/60 bg-secondary/60 hover:border-cyan-400/40'
                      }`}
                    >
                      <span className="text-lg">{lang.flag}</span>
                      <span className="text-sm font-medium">{lang.name}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between p-4 rounded-2xl border border-border/60 bg-secondary/60">
                <div className="flex items-center gap-3">
                  {darkMode ? <Moon className="w-5 h-5 text-cyan-300" /> : <Sun className="w-5 h-5 text-warning" />}
                  <div>
                    <p className="font-medium">{t('profile_dark_mode')}</p>
                    <p className="text-sm text-muted-foreground">{t('profile_dark_mode_desc')}</p>
                  </div>
                </div>
                <Switch
                  checked={darkMode}
                  onCheckedChange={handleDarkModeChange}
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="surface-card p-6 rounded-3xl border border-border/60 bg-gradient-to-br from-background via-background to-background">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div>
                  <h2 className="text-lg font-semibold">{t('profile_personal_info')}</h2>
                  <p className="text-xs text-muted-foreground">Keep your trader identity up to date.</p>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleProfileSave}
                  className="bg-gradient-to-r from-cyan-500 via-sky-500 to-emerald-400 text-white hover:opacity-90"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {t('profile_save_changes')}
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="fullName">{t('profile_full_name')}</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="fullName"
                      value={profileData.fullName}
                      onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                      className="pl-10 bg-secondary/60 border-border/60 focus-visible:ring-cyan-400/20 focus-visible:border-cyan-400/50"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">{t('profile_email')}</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                      className="pl-10 bg-secondary/60 border-border/60 focus-visible:ring-cyan-400/20 focus-visible:border-cyan-400/50"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">{t('profile_phone')}</Label>
                  <Input
                    id="phone"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    className="bg-secondary/60 border-border/60 focus-visible:ring-cyan-400/20 focus-visible:border-cyan-400/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">{t('profile_country')}</Label>
                  <Input
                    id="country"
                    value={profileData.country}
                    onChange={(e) => setProfileData({ ...profileData, country: e.target.value })}
                    className="bg-secondary/60 border-border/60 focus-visible:ring-cyan-400/20 focus-visible:border-cyan-400/50"
                  />
                </div>
              </div>
            </div>

            <div className="surface-card p-6 rounded-3xl border border-border/60 bg-gradient-to-br from-background via-background to-background">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div>
                  <h2 className="text-lg font-semibold">{t('profile_change_password')}</h2>
                  <p className="text-xs text-muted-foreground">Use a strong password to keep your account safe.</p>
                </div>
                <Button variant="outline" size="sm" onClick={handlePasswordChange} className="border-border/60">
                  {t('profile_update_password')}
                </Button>
              </div>
              <div className="space-y-4 max-w-md">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">{t('profile_current_password')}</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="currentPassword"
                      type={showCurrentPassword ? 'text' : 'password'}
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                      className="pl-10 pr-10 bg-secondary/60 border-border/60 focus-visible:ring-cyan-400/20 focus-visible:border-cyan-400/50"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">{t('profile_new_password')}</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="newPassword"
                      type={showNewPassword ? 'text' : 'password'}
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      className="pl-10 pr-10 bg-secondary/60 border-border/60 focus-visible:ring-cyan-400/20 focus-visible:border-cyan-400/50"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">{t('profile_confirm_password')}</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                      className="pl-10 bg-secondary/60 border-border/60 focus-visible:ring-cyan-400/20 focus-visible:border-cyan-400/50"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="surface-card p-6 rounded-3xl border border-border/60 bg-gradient-to-br from-background via-background to-background">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Support Replies</h2>
            <Button variant="outline" size="sm" onClick={() => fetchContactReplies(profileData.email)} className="border-border/60">
              Refresh
            </Button>
          </div>
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <form onSubmit={handleSupportSubmit} className="space-y-3 rounded-2xl border border-border/60 bg-secondary/60 p-4">
              <div>
                <Label htmlFor="support-subject" className="text-xs">
                  Envoyer un message au support
                </Label>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="support-name">Name</Label>
                  <Input
                    id="support-name"
                    value={profileData.fullName}
                    readOnly
                  className="bg-secondary/60 border-border/60"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="support-email">Email</Label>
                  <Input
                    id="support-email"
                    type="email"
                    value={profileData.email}
                    readOnly
                  className="bg-secondary/60 border-border/60"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="support-subject-input">Subject</Label>
                <Input
                  id="support-subject-input"
                  value={supportForm.subject}
                  onChange={updateSupportField('subject')}
                  placeholder="How can we help?"
                className="bg-secondary/60 border-border/60 focus-visible:ring-cyan-400/20 focus-visible:border-cyan-400/50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="support-message">Message</Label>
                <Textarea
                  id="support-message"
                  value={supportForm.message}
                  onChange={updateSupportField('message')}
                  placeholder="Describe your issue..."
                  rows={4}
                className="bg-secondary/60 border-border/60 focus-visible:ring-cyan-400/20 focus-visible:border-cyan-400/50"
                />
              </div>
              <Button
                type="submit"
                variant="secondary"
                disabled={supportSending}
                className="bg-gradient-to-r from-cyan-500 via-sky-500 to-emerald-400 text-white hover:opacity-90"
              >
                {supportSending ? 'Sending...' : 'Send message'}
              </Button>
            </form>
            <div className="rounded-2xl border border-border/60 bg-secondary/60 p-4">
              {contactRepliesLoading ? (
                <div className="text-sm text-muted-foreground">Loading replies...</div>
              ) : contactReplies.length ? (
                <div className="space-y-3">
                  {contactReplies.map((reply) => (
                    <div key={reply.id} className="rounded-2xl border border-border/60 bg-background/60 p-3 text-xs">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="font-semibold">{reply.subject || 'Support'}</div>
                        <div className="text-[10px] text-muted-foreground">
                          {reply.replied_at ? new Date(reply.replied_at).toLocaleString() : '—'}
                        </div>
                      </div>
                      <div className="text-[11px] text-muted-foreground mt-1">
                        Your message: {reply.message}
                      </div>
                      <div className="mt-2 rounded-md border border-border/60 bg-secondary/60 p-2">
                        <div className="text-[11px] text-muted-foreground mb-1">Admin reply</div>
                        <p className="text-muted-foreground">{reply.reply_message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">No replies yet.</div>
              )}
            </div>
          </div>
        </div>

        <div className="surface-card p-6 rounded-3xl border border-rose-500/20 bg-gradient-to-br from-[#1a0f14] via-[#120a10] to-[#0b111a]">
          <h2 className="text-lg font-semibold text-rose-400 mb-4">{t('profile_danger_zone')}</h2>
          <p className="text-sm text-muted-foreground mb-4">
            {t('profile_delete_warning')}
          </p>
          <Button variant="destructive" onClick={handleDeleteAccount}>
            {t('profile_delete_account')}
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
