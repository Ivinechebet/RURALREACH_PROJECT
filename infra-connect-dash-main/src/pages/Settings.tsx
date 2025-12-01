import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, ShieldCheck, ShieldOff, Mail, Bell, ChevronDown, ExternalLink } from "lucide-react";
import QRCodeSVG from "react-qr-code";

// --- MOCK EMAIL INBOX SIMULATION ---
interface Email {
  id: string;
  from: string;
  subject: string;
  preview: string;
  timestamp: string;
  read: boolean;
  type: string;
}

const mockEmailInbox: Email[] = [];

const simulateEmailDelivery = (email: Omit<Email, 'id' | 'read'>) => {
  const newEmail: Email = {
    id: Date.now().toString(),
    from: email.from,
    subject: email.subject,
    preview: email.preview,
    timestamp: email.timestamp,
    read: false,
    type: email.type
  };
  
  mockEmailInbox.unshift(newEmail);
  console.log(`📧 New email delivered to inbox:`, newEmail);
  return newEmail;
};

// --- MOCK API FUNCTIONS ---
const mockApi = {
  updateProfile: async (data: { firstName: string; lastName: string; email: string; phone: string }) => {
    console.log("Saving profile to API:", data);
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (data.email === "fail@test.com") throw new Error("Email is already in use.");
    return { success: true };
  },
  updatePreferences: async (prefs: any) => {
    console.log("Saving preferences to API:", prefs);
    await new Promise(resolve => setTimeout(resolve, 800));
    return { success: true };
  },
  changePassword: async (data: { currentPassword: string; newPassword: string }) => {
    console.log("Sending password change request to API.");
    await new Promise(resolve => setTimeout(resolve, 1200));
    if (data.currentPassword === "wrongpassword") throw new Error("Current password is incorrect.");
    return { success: true };
  },
  updateSystemSettings: async (settings: { defaultView: string; language: string; timezone: string }) => {
    console.log("Saving system settings to API:", settings);
    await new Promise(resolve => setTimeout(resolve, 900));
    return { success: true };
  },
  enable2FA: async () => {
    console.log("Enabling 2FA for user...");
    await new Promise(resolve => setTimeout(resolve, 1500));
    return { success: true, secret: "JBSWY3DPEHPK3PXP" };
  },
  disable2FA: async (password: string) => {
    console.log("Disabling 2FA for user...");
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (password === "wrongpassword") throw new Error("Password is incorrect.");
    return { success: true };
  },
  sendEmailNotification: async (type: string, data: any) => {
    console.log(`Sending ${type} email notification to:`, data.email);
    
    const email = simulateEmailDelivery({
      from: "RuralReach Notifications <notifications@ruralreach.com>",
      subject: data.subject,
      preview: data.preview || data.message.substring(0, 100) + "...",
      timestamp: new Date().toLocaleString(),
      type: type
    });
    
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: true, emailId: email.id };
  },
};

// --- OPTIONS FOR DROPDOWNS ---
const defaultViewOptions = ["Dashboard Overview", "Analytics", "User Management", "Project List"];
const languageOptions = ["English", "Spanish", "French", "German", "Swahili"];
const timezoneOptions = [
  "EAT (East Africa Time)",
  "UTC (Coordinated Universal Time)",
  "EST (Eastern Standard Time)",
  "PST (Pacific Standard Time)",
  "CET (Central European Time)",
];

const Settings = () => {
  // --- Profile State ---
  const [firstName, setFirstName] = useState("Ivine");
  const [lastName, setLastName] = useState("Chebet");
  const [email, setEmail] = useState("chebethivine@gmail.com");
  const [phone, setPhone] = useState("+254 790 162 587");
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // --- Preferences State ---
  const [newReports, setNewReports] = useState(true);
  const [projectUpdates, setProjectUpdates] = useState(true);
  const [newRatings, setNewRatings] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [isSavingPreferences, setIsSavingPreferences] = useState(false);

  // Track email notification state changes
  const [emailNotificationsEnabled, setEmailNotificationsEnabled] = useState(false);

  // --- System Settings State ---
  const [defaultView, setDefaultView] = useState("Dashboard Overview");
  const [language, setLanguage] = useState("English");
  const [timezone, setTimezone] = useState("EAT (East Africa Time)");
  const [isSavingSystemSettings, setIsSavingSystemSettings] = useState(false);

  // --- Security State ---
  const [twoFactor, setTwoFactor] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isChangingPasswordLoading, setIsChangingPasswordLoading] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  // --- 2FA Dialog State ---
  const [is2FADialogOpen, setIs2FADialogOpen] = useState(false);
  const [is2FASetupFlow, setIs2FASetupFlow] = useState(false);
  const [is2FAActionLoading, setIs2FAActionLoading] = useState(false);
  const [disablePassword, setDisablePassword] = useState("");

  // --- Email Inbox State ---
  const [emailInbox, setEmailInbox] = useState<Email[]>(mockEmailInbox);
  const [showEmailInbox, setShowEmailInbox] = useState(false);

  // Initialize email notifications state
  useEffect(() => {
    setEmailNotificationsEnabled(emailNotifications);
  }, [emailNotifications]);

  // --- EMAIL NOTIFICATION FUNCTIONS ---
  const sendEmailNotification = async (type: string, subject: string, message: string) => {
    if (!emailNotificationsEnabled) return;

    try {
      const result = await mockApi.sendEmailNotification(type, {
        email: email,
        subject: subject,
        message: message,
        preview: message.substring(0, 100) + "..."
      });

      setEmailInbox([...mockEmailInbox]);
      toast.success(`📧 Email notification sent to your inbox!`);
    } catch (error) {
      console.error(`Failed to send email notification: ${error}`);
      toast.error("Failed to send email notification");
    }
  };

  const handleEmailNotificationsChange = (enabled: boolean) => {
    setEmailNotifications(enabled);
    setEmailNotificationsEnabled(enabled);
    
    if (enabled) {
      toast.success("Email notifications enabled! You'll receive emails for important actions.");
      sendEmailNotification(
        'settings',
        'Email Notifications Enabled - RuralReach',
        'You have successfully enabled email notifications for your RuralReach account. You will now receive email alerts for important activities and system changes.'
      );
    } else {
      toast.info("Email notifications disabled. You won't receive email alerts.");
    }
  };

  // --- ENHANCED HANDLER FUNCTIONS WITH EMAIL NOTIFICATIONS ---
  const handleSaveProfile = async () => {
    setIsSavingProfile(true);
    try {
      await mockApi.updateProfile({ firstName, lastName, email, phone });
      toast.success("Profile settings saved successfully!");
      
      await sendEmailNotification(
        'profile_update',
        'Profile Updated - RuralReach',
        `Your RuralReach profile has been successfully updated. Changes include: Name - ${firstName} ${lastName}, Email - ${email}, Phone - ${phone}.`
      );
    } catch (error: any) {
      toast.error(`Error saving profile: ${error.message}`);
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleSavePreferences = async () => {
    setIsSavingPreferences(true);
    const preferences = { newReports, projectUpdates, newRatings, emailNotifications };
    try {
      await mockApi.updatePreferences(preferences);
      toast.success("Notification preferences saved successfully!");
      
      await sendEmailNotification(
        'preferences',
        'Notification Preferences Updated - RuralReach',
        `Your notification preferences have been updated: New Reports - ${newReports ? 'ON' : 'OFF'}, Project Updates - ${projectUpdates ? 'ON' : 'OFF'}, New Ratings - ${newRatings ? 'ON' : 'OFF'}, Email Notifications - ${emailNotifications ? 'ON' : 'OFF'}.`
      );
    } catch (error: any) {
      toast.error(`Error saving preferences: ${error.message}`);
    } finally {
      setIsSavingPreferences(false);
    }
  };

  const handleChangePasswordSubmit = async () => {
    if (newPassword !== confirmNewPassword) {
      toast.error("New passwords do not match.");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("New password must be at least 8 characters long.");
      return;
    }
    setIsChangingPasswordLoading(true);
    try {
      await mockApi.changePassword({ currentPassword, newPassword });
      toast.success("Password changed successfully!");
      
      await sendEmailNotification(
        'security',
        'Password Changed - RuralReach Security Alert',
        'Your RuralReach account password has been successfully changed. If you did not make this change, please contact support immediately.'
      );
      
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      setIsChangingPassword(false);
    } catch (error: any) {
      toast.error(`Error changing password: ${error.message}`);
    } finally {
      setIsChangingPasswordLoading(false);
    }
  };

  const handleSaveSystemSettings = async () => {
    setIsSavingSystemSettings(true);
    try {
      await mockApi.updateSystemSettings({ defaultView, language, timezone });
      toast.success("System settings saved successfully!");
      
      await sendEmailNotification(
        'system_settings',
        'System Settings Updated - RuralReach',
        `Your system settings have been updated: Default View - ${defaultView}, Language - ${language}, Timezone - ${timezone}.`
      );
    } catch (error: any) {
      toast.error(`Error saving system settings: ${error.message}`);
    } finally {
      setIsSavingSystemSettings(false);
    }
  };

  const handleToggle2FA = (enable: boolean) => {
    if (enable) {
      setIs2FASetupFlow(true);
      setIs2FADialogOpen(true);
    } else {
      setIs2FASetupFlow(false);
      setIs2FADialogOpen(true);
    }
  };

  const handleConfirmEnable2FA = async () => {
    setIs2FAActionLoading(true);
    try {
      await mockApi.enable2FA();
      toast.success("Two-Factor Authentication enabled! Please save your backup codes.");
      
      await sendEmailNotification(
        'security',
        'Two-Factor Authentication Enabled - RuralReach Security',
        'Two-Factor Authentication has been enabled for your RuralReach account. Your account is now more secure.'
      );
      
      setTwoFactor(true);
      setIs2FADialogOpen(false);
    } catch (error: any) {
      toast.error(`Failed to enable 2FA: ${error.message}`);
    } finally {
      setIs2FAActionLoading(false);
    }
  };

  const handleConfirmDisable2FA = async () => {
    if (!disablePassword) {
      toast.error("Please enter your password to disable 2FA.");
      return;
    }
    setIs2FAActionLoading(true);
    try {
      await mockApi.disable2FA(disablePassword);
      toast.success("Two-Factor Authentication disabled.");
      
      await sendEmailNotification(
        'security',
        'Two-Factor Authentication Disabled - RuralReach Security Alert',
        'Two-Factor Authentication has been disabled for your RuralReach account. Your account security has been reduced.'
      );
      
      setTwoFactor(false);
      setIs2FADialogOpen(false);
      setDisablePassword("");
    } catch (error: any) {
      toast.error(`Failed to disable 2FA: ${error.message}`);
    } finally {
      setIs2FAActionLoading(false);
    }
  };

  const totpSecret = "JBSWY3DPEHPK3PXP";
  const issuer = "RuralReach Dashboard";
  const accountName = "Ivine Chebet";
  const qrCodeValue = `otpauth://totp/${issuer}:${accountName}?secret=${totpSecret}&issuer=${issuer}`;

  // Custom Select Item Component for consistent styling
  const CustomSelectItem = ({ value, children }: { value: string; children: React.ReactNode }) => (
    <SelectItem 
      value={value} 
      className="cursor-pointer transition-all duration-200 hover:bg-blue-50 hover:text-blue-700 rounded-lg m-1 data-[highlighted]:bg-blue-50 data-[highlighted]:text-blue-700 data-[state=checked]:bg-blue-100 data-[state=checked]:text-blue-800"
    >
      {children}
    </SelectItem>
  );

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-4xl mx-auto">
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Settings</h2>
        <p className="text-gray-600 mt-2 text-sm sm:text-base">
          Manage your dashboard preferences and configurations
        </p>
      </div>

      {/* Email Inbox Preview */}
      {emailNotifications && emailInbox.length > 0 && (
        <Card className="border-2 border-blue-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-200">
            <CardTitle className="text-gray-900 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-blue-600" />
                Email Inbox Preview
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowEmailInbox(!showEmailInbox)}
                className="border-blue-300 text-blue-600 hover:bg-blue-50"
              >
                {showEmailInbox ? 'Hide' : 'Show'} Emails
              </Button>
            </CardTitle>
            <CardDescription className="text-gray-600">
              Recent notifications sent to your email inbox
            </CardDescription>
          </CardHeader>
          {showEmailInbox && (
            <CardContent className="pt-6">
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {emailInbox.slice(0, 5).map((email) => (
                  <div
                    key={email.id}
                    className={`p-3 border rounded-lg transition-all duration-200 ${
                      email.read 
                        ? 'bg-gray-50 border-gray-200' 
                        : 'bg-blue-50 border-blue-200 shadow-sm'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-gray-900 text-sm">{email.from}</span>
                          {!email.read && (
                            <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                              New
                            </span>
                          )}
                        </div>
                        <h4 className="font-semibold text-gray-900 text-sm mb-1">{email.subject}</h4>
                        <p className="text-gray-600 text-sm line-clamp-2">{email.preview}</p>
                      </div>
                      <div className="text-right ml-4">
                        <div className="text-xs text-gray-500 mb-2">{email.timestamp}</div>
                        <div className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-gray-100 text-gray-700">
                          {email.type}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-center">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-gray-300 text-gray-600 hover:bg-gray-50"
                  onClick={() => {
                    toast.info("In a real application, this would open your email client");
                  }}
                >
                  <ExternalLink className="h-3 w-3 mr-1" />
                  Open Email Client
                </Button>
              </div>
            </CardContent>
          )}
        </Card>
      )}

      {/* Profile Settings Card */}
      <Card className="border-2 border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-gray-200">
          <CardTitle className="text-gray-900 flex items-center gap-2">
            <User className="h-5 w-5 text-blue-600" />
            Profile Settings
          </CardTitle>
          <CardDescription className="text-gray-600">
            Update your profile information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-gray-700 font-medium">First Name</Label>
              <Input 
                id="firstName" 
                value={firstName} 
                onChange={(e) => setFirstName(e.target.value)} 
                className="border-2 border-gray-300 focus:border-blue-500 rounded-xl transition-all duration-300"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-gray-700 font-medium">Last Name</Label>
              <Input 
                id="lastName" 
                value={lastName} 
                onChange={(e) => setLastName(e.target.value)} 
                className="border-2 border-gray-300 focus:border-blue-500 rounded-xl transition-all duration-300"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-700 font-medium">Email</Label>
            <Input 
              id="email" 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              className="border-2 border-gray-300 focus:border-blue-500 rounded-xl transition-all duration-300"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-gray-700 font-medium">Phone Number</Label>
            <Input 
              id="phone" 
              type="tel" 
              value={phone} 
              onChange={(e) => setPhone(e.target.value)} 
              className="border-2 border-gray-300 focus:border-blue-500 rounded-xl transition-all duration-300"
            />
          </div>
          <Button 
            className="bg-blue-600 hover:bg-blue-700 text-white transition-all duration-300 hover:scale-105" 
            onClick={handleSaveProfile} 
            disabled={isSavingProfile}
          >
            {isSavingProfile && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
        </CardContent>
      </Card>

      {/* Notification Preferences Card */}
      <Card className="border-2 border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader className="bg-gradient-to-r from-green-50 to-green-100 border-b border-gray-200">
          <CardTitle className="text-gray-900 flex items-center gap-2">
            <Bell className="h-5 w-5 text-green-600" />
            Notification Preferences
          </CardTitle>
          <CardDescription className="text-gray-600">
            Choose what notifications you want to receive
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
            <div className="flex-1 min-w-0 mr-4">
              <Label htmlFor="newReports" className="text-gray-700 font-medium">New Reports</Label>
              <p className="text-sm text-gray-600">Get notified when new reports are submitted</p>
            </div>
            <Switch 
              id="newReports" 
              checked={newReports} 
              onCheckedChange={setNewReports}
              className="data-[state=checked]:bg-green-500"
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
            <div className="flex-1 min-w-0 mr-4">
              <Label htmlFor="projectUpdates" className="text-gray-700 font-medium">Project Updates</Label>
              <p className="text-sm text-gray-600">Receive updates when project status changes</p>
            </div>
            <Switch 
              id="projectUpdates" 
              checked={projectUpdates} 
              onCheckedChange={setProjectUpdates}
              className="data-[state=checked]:bg-green-500"
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
            <div className="flex-1 min-w-0 mr-4">
              <Label htmlFor="newRatings" className="text-gray-700 font-medium">New Ratings</Label>
              <p className="text-sm text-gray-600">Get notified about new project ratings</p>
            </div>
            <Switch 
              id="newRatings" 
              checked={newRatings} 
              onCheckedChange={setNewRatings}
              className="data-[state=checked]:bg-green-500"
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
            <div className="flex-1 min-w-0 mr-4">
              <Label htmlFor="emailNotifications" className="text-gray-700 font-medium flex items-center gap-2">
                <Mail className="h-4 w-4 text-blue-500" />
                Email Notifications
              </Label>
              <p className="text-sm text-gray-600">Receive notifications via email</p>
            </div>
            <Switch 
              id="emailNotifications" 
              checked={emailNotifications} 
              onCheckedChange={handleEmailNotificationsChange}
              className="data-[state=checked]:bg-blue-500"
            />
          </div>

          <Button 
            className="bg-green-600 hover:bg-green-700 text-white transition-all duration-300 hover:scale-105" 
            onClick={handleSavePreferences} 
            disabled={isSavingPreferences}
          >
            {isSavingPreferences && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Preferences
          </Button>
        </CardContent>
      </Card>

      {/* System Settings Card */}
      <Card className="border-2 border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100 border-b border-gray-200">
          <CardTitle className="text-gray-900 flex items-center gap-2">
            <SettingsIcon className="h-5 w-5 text-purple-600" />
            System Settings
          </CardTitle>
          <CardDescription className="text-gray-600">
            Configure system-wide settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <div className="space-y-2">
            <Label className="text-gray-700 font-medium">Default Dashboard View</Label>
            <Select value={defaultView} onValueChange={setDefaultView}>
              <SelectTrigger className="border-2 border-gray-300 focus:border-purple-500 rounded-xl transition-all duration-300 hover:border-purple-400 group">
                <SelectValue placeholder="Select a view" />
                <ChevronDown className="h-4 w-4 text-gray-500 group-hover:text-purple-600 transition-colors" />
              </SelectTrigger>
              <SelectContent className="bg-white border-2 border-gray-200 rounded-xl shadow-2xl p-2">
                {defaultViewOptions.map((option) => (
                  <CustomSelectItem key={option} value={option}>
                    {option}
                  </CustomSelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-gray-700 font-medium">Language</Label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="border-2 border-gray-300 focus:border-purple-500 rounded-xl transition-all duration-300 hover:border-purple-400 group">
                <SelectValue placeholder="Select a language" />
                <ChevronDown className="h-4 w-4 text-gray-500 group-hover:text-purple-600 transition-colors" />
              </SelectTrigger>
              <SelectContent className="bg-white border-2 border-gray-200 rounded-xl shadow-2xl p-2">
                {languageOptions.map((option) => (
                  <CustomSelectItem key={option} value={option}>
                    {option}
                  </CustomSelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-gray-700 font-medium">Timezone</Label>
            <Select value={timezone} onValueChange={setTimezone}>
              <SelectTrigger className="border-2 border-gray-300 focus:border-purple-500 rounded-xl transition-all duration-300 hover:border-purple-400 group">
                <SelectValue placeholder="Select a timezone" />
                <ChevronDown className="h-4 w-4 text-gray-500 group-hover:text-purple-600 transition-colors" />
              </SelectTrigger>
              <SelectContent className="bg-white border-2 border-gray-200 rounded-xl shadow-2xl p-2">
                {timezoneOptions.map((option) => (
                  <CustomSelectItem key={option} value={option}>
                    {option}
                  </CustomSelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button 
            className="bg-purple-600 hover:bg-purple-700 text-white transition-all duration-300 hover:scale-105" 
            onClick={handleSaveSystemSettings} 
            disabled={isSavingSystemSettings}
          >
            {isSavingSystemSettings && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save System Settings
          </Button>
        </CardContent>
      </Card>

      {/* Security Card */}
      <Card className="border-2 border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader className="bg-gradient-to-r from-red-50 to-red-100 border-b border-gray-200">
          <CardTitle className="text-gray-900 flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-red-600" />
            Security
          </CardTitle>
          <CardDescription className="text-gray-600">
            Manage your security settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          {!isChangingPassword ? (
            <Button 
              variant="outline" 
              className="border-orange-300 text-orange-600 hover:bg-orange-50 transition-all duration-300 hover:scale-105"
              onClick={() => setIsChangingPassword(true)}
            >
              Change Password
            </Button>
          ) : (
            <div className="space-y-4 border-2 border-orange-200 rounded-xl p-4 bg-orange-50">
              <h4 className="font-medium text-orange-900">Change Your Password</h4>
              <div className="space-y-2">
                <Label htmlFor="currentPassword" className="text-orange-700">Current Password</Label>
                <Input 
                  id="currentPassword" 
                  type="password" 
                  value={currentPassword} 
                  onChange={(e) => setCurrentPassword(e.target.value)} 
                  className="border-2 border-orange-300 focus:border-orange-500 rounded-lg"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword" className="text-orange-700">New Password</Label>
                <Input 
                  id="newPassword" 
                  type="password" 
                  value={newPassword} 
                  onChange={(e) => setNewPassword(e.target.value)} 
                  className="border-2 border-orange-300 focus:border-orange-500 rounded-lg"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmNewPassword" className="text-orange-700">Confirm New Password</Label>
                <Input 
                  id="confirmNewPassword" 
                  type="password" 
                  value={confirmNewPassword} 
                  onChange={(e) => setConfirmNewPassword(e.target.value)} 
                  className="border-2 border-orange-300 focus:border-orange-500 rounded-lg"
                />
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setIsChangingPassword(false)}
                  className="border-gray-300 hover:bg-gray-100"
                >
                  Cancel
                </Button>
                <Button 
                  className="bg-orange-600 hover:bg-orange-700 text-white transition-all duration-300 hover:scale-105"
                  onClick={handleChangePasswordSubmit}
                  disabled={isChangingPasswordLoading}
                >
                  {isChangingPasswordLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Change Password
                </Button>
              </div>
            </div>
          )}
          <Separator />
          <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
            <div className="flex-1 min-w-0 mr-4">
              <Label htmlFor="twoFactor" className="text-gray-700 font-medium">Two-Factor Authentication</Label>
              <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
            </div>
            <Switch 
              id="twoFactor" 
              checked={twoFactor} 
              onCheckedChange={handleToggle2FA}
              className="data-[state=checked]:bg-red-500"
            />
          </div>
          
          {/* 2FA Dialog */}
          <Dialog open={is2FADialogOpen} onOpenChange={setIs2FADialogOpen}>
            <DialogContent className="sm:max-w-md bg-white border-2 border-gray-200 rounded-2xl shadow-2xl">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-gray-900">
                  {is2FASetupFlow ? <ShieldCheck className="h-5 w-5 text-green-600" /> : <ShieldOff className="h-5 w-5 text-red-600" />}
                  {is2FASetupFlow ? "Enable Two-Factor Authentication" : "Disable Two-Factor Authentication"}
                </DialogTitle>
                <DialogDescription className="text-gray-600">
                  {is2FASetupFlow ? "Scan the QR code below with an authenticator app (like Google Authenticator or Authy) on your phone." : "To disable 2FA, please confirm your password. This is a critical security action."}
                </DialogDescription>
              </DialogHeader>
              {is2FASetupFlow ? (
                <div className="flex items-center justify-center p-4">
                  <div className="bg-white p-4 rounded-xl border-2 border-gray-300">
                    <QRCodeSVG value={qrCodeValue} size={180} level="H" bgColor="#ffffff" fgColor="#000000" />
                  </div>
                </div>
              ) : (
                <div className="py-4">
                  <Label htmlFor="disablePassword" className="text-gray-700 font-medium">Enter your password</Label>
                  <Input 
                    id="disablePassword" 
                    type="password" 
                    value={disablePassword} 
                    onChange={(e) => setDisablePassword(e.target.value)} 
                    placeholder="Enter your current password"
                    className="border-2 border-gray-300 focus:border-red-500 rounded-lg mt-2"
                  />
                </div>
              )}
              <DialogFooter>
                <Button 
                  variant="outline" 
                  onClick={() => setIs2FADialogOpen(false)}
                  className="border-gray-300 hover:bg-gray-100 transition-all duration-300"
                >
                  Cancel
                </Button>
                <Button 
                  variant={is2FASetupFlow ? "default" : "destructive"} 
                  onClick={is2FASetupFlow ? handleConfirmEnable2FA : handleConfirmDisable2FA} 
                  disabled={is2FAActionLoading}
                  className={`transition-all duration-300 hover:scale-105 ${
                    is2FASetupFlow 
                      ? "bg-green-600 hover:bg-green-700 text-white" 
                      : "bg-red-600 hover:bg-red-700 text-white"
                  }`}
                >
                  {is2FAActionLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {is2FASetupFlow ? "Enable 2FA" : "Disable 2FA"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  );
};

// Add missing icon components
const User = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const SettingsIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

export default Settings;