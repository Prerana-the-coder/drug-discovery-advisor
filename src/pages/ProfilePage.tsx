import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2, User, Mail, Calendar, Volume2, Bell, Palette, Shield, Sun, Moon, Monitor } from "lucide-react";
import { z } from "zod";
import { useTheme } from "@/components/ThemeProvider";

const displayNameSchema = z.string().trim().max(100, "Display name must be less than 100 characters");

const ProfilePage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  const [displayName, setDisplayName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Settings state
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [selectedVoice, setSelectedVoice] = useState("sarah");
  const [voiceAutoPlay, setVoiceAutoPlay] = useState(false);
  const [notifications, setNotifications] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      
      const { data, error } = await supabase
        .from("profiles")
        .select("display_name")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) {
        console.error("Error fetching profile:", error);
      } else if (data) {
        setDisplayName(data.display_name || "");
      }
      
      // Load saved settings from localStorage
      const savedSettings = localStorage.getItem("medlens_settings");
      if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        setVoiceEnabled(settings.voiceEnabled ?? true);
        setSelectedVoice(settings.selectedVoice ?? "sarah");
        setVoiceAutoPlay(settings.voiceAutoPlay ?? false);
        setNotifications(settings.notifications ?? true);
      }
      
      setIsLoading(false);
    };

    fetchProfile();
  }, [user]);

  const saveSettings = () => {
    const settings = {
      voiceEnabled,
      selectedVoice,
      voiceAutoPlay,
      notifications,
      theme,
    };
    localStorage.setItem("medlens_settings", JSON.stringify(settings));
  };

  useEffect(() => {
    if (!isLoading) {
      saveSettings();
    }
  }, [voiceEnabled, selectedVoice, voiceAutoPlay, notifications, theme]);

  const handleSave = async () => {
    if (!user) return;

    try {
      displayNameSchema.parse(displayName);
      setError(null);
    } catch (e) {
      if (e instanceof z.ZodError) {
        setError(e.errors[0].message);
        return;
      }
    }

    setIsSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({ display_name: displayName.trim() })
      .eq("user_id", user.id);

    setIsSaving(false);

    if (error) {
      toast({
        variant: "destructive",
        title: "Failed to update profile",
        description: error.message,
      });
    } else {
      toast({
        title: "Profile updated",
        description: "Your profile has been saved.",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold mb-2">Profile Settings</h1>
        <p className="text-muted-foreground">
          Manage your account details and preferences.
        </p>
      </div>

      {/* Account Information */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5 text-primary" />
            Account Information
          </CardTitle>
          <CardDescription>
            View and update your personal information.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-muted-foreground">
              <Mail className="w-4 h-4" />
              Email Address
            </Label>
            <Input 
              value={user?.email || ""} 
              disabled 
              className="bg-muted/50"
            />
            <p className="text-xs text-muted-foreground">
              Email cannot be changed.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="display-name" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Display Name
            </Label>
            <Input
              id="display-name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Enter your display name"
              className={error ? "border-destructive" : ""}
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="w-4 h-4" />
              Account Created
            </Label>
            <Input 
              value={user?.created_at ? new Date(user.created_at).toLocaleDateString() : ""} 
              disabled 
              className="bg-muted/50"
            />
          </div>

          <Button 
            onClick={handleSave} 
            variant="gradient" 
            disabled={isSaving}
            className="w-full sm:w-auto"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Appearance Settings */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-primary" />
            Appearance
          </CardTitle>
          <CardDescription>
            Customize the look and feel of the application.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <Label>Theme</Label>
            <div className="grid grid-cols-3 gap-3">
              <Button
                variant={theme === "light" ? "default" : "outline"}
                className={`flex flex-col gap-2 h-auto py-4 ${theme === "light" ? "bg-primary" : ""}`}
                onClick={() => setTheme("light")}
              >
                <Sun className="w-5 h-5" />
                <span className="text-xs">Light</span>
              </Button>
              <Button
                variant={theme === "dark" ? "default" : "outline"}
                className={`flex flex-col gap-2 h-auto py-4 ${theme === "dark" ? "bg-primary" : ""}`}
                onClick={() => setTheme("dark")}
              >
                <Moon className="w-5 h-5" />
                <span className="text-xs">Dark</span>
              </Button>
              <Button
                variant={theme === "system" ? "default" : "outline"}
                className={`flex flex-col gap-2 h-auto py-4 ${theme === "system" ? "bg-primary" : ""}`}
                onClick={() => setTheme("system")}
              >
                <Monitor className="w-5 h-5" />
                <span className="text-xs">System</span>
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Select your preferred color theme
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Voice Settings */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Volume2 className="w-5 h-5 text-primary" />
            Voice Settings
          </CardTitle>
          <CardDescription>
            Configure text-to-speech preferences for AI responses.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Enable Voice Output</Label>
              <p className="text-sm text-muted-foreground">
                Allow AI to read responses aloud
              </p>
            </div>
            <Switch
              checked={voiceEnabled}
              onCheckedChange={setVoiceEnabled}
            />
          </div>

          <div className="space-y-2">
            <Label>Voice Selection</Label>
            <Select value={selectedVoice} onValueChange={setSelectedVoice}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sarah">Sarah (Professional)</SelectItem>
                <SelectItem value="roger">Roger (Deep)</SelectItem>
                <SelectItem value="alice">Alice (Friendly)</SelectItem>
                <SelectItem value="brian">Brian (Narrator)</SelectItem>
                <SelectItem value="lily">Lily (Warm)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Choose the voice style for AI responses
            </p>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Auto-Play Responses</Label>
              <p className="text-sm text-muted-foreground">
                Automatically read AI responses aloud
              </p>
            </div>
            <Switch
              checked={voiceAutoPlay}
              onCheckedChange={setVoiceAutoPlay}
              disabled={!voiceEnabled}
            />
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-primary" />
            Notifications
          </CardTitle>
          <CardDescription>
            Manage your notification preferences.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Enable Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive updates about new features and insights
              </p>
            </div>
            <Switch
              checked={notifications}
              onCheckedChange={setNotifications}
            />
          </div>
        </CardContent>
      </Card>

      {/* Security */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            Security
          </CardTitle>
          <CardDescription>
            Manage your account security settings.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 rounded-lg bg-muted/50 border border-border">
            <p className="text-sm text-muted-foreground">
              Your account is secured with email authentication. For additional security options, please contact support.
            </p>
          </div>
          <p className="text-xs text-muted-foreground text-center">
            Designed & Developed by Prerana
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;
