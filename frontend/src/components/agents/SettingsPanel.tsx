"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useTheme } from "@/lib/theme";
import { 
  User, 
  Bell, 
  Database,
  Shield,
  Save
} from "lucide-react";

export default function SettingsPanel() {
  const { theme, setTheme } = useTheme();
  const [notifications, setNotifications] = useState(true);
  const [autoSave, setAutoSave] = useState(true);
  const [language, setLanguage] = useState("en");

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-foreground tracking-tight">Settings</h1>
          <p className="text-lg text-muted-foreground">Configure your Research Suite preferences</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* User Preferences */}
        <Card className="card-modern">
          <CardHeader className="pb-6">
            <CardTitle className="text-xl font-semibold text-foreground flex items-center space-x-3">
              <div className="p-2 bg-primary/10 rounded-xl">
                <User className="h-6 w-6 text-primary" />
              </div>
              <span>User Preferences</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="language" className="text-sm font-semibold text-foreground">Language</Label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="input-modern focus-ring">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                  <SelectItem value="de">German</SelectItem>
                  <SelectItem value="zh">Chinese</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label htmlFor="theme" className="text-sm font-semibold text-foreground">Theme</Label>
              <Select value={theme} onValueChange={setTheme}>
                <SelectTrigger className="input-modern focus-ring">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="card-modern">
          <CardHeader className="pb-6">
            <CardTitle className="text-xl font-semibold text-foreground flex items-center space-x-3">
              <div className="p-2 bg-amber-500/10 rounded-xl">
                <Bell className="h-6 w-6 text-amber-500" />
              </div>
              <span>Notifications</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl">
              <div className="space-y-1">
                <Label className="text-sm font-semibold text-foreground">Enable Notifications</Label>
                <p className="text-xs text-muted-foreground">Receive notifications for updates</p>
              </div>
              <Switch checked={notifications} onCheckedChange={setNotifications} className="switch-modern" />
            </div>

            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl">
              <div className="space-y-1">
                <Label className="text-sm font-semibold text-foreground">Email Notifications</Label>
                <p className="text-xs text-muted-foreground">Send notifications via email</p>
              </div>
              <Switch checked={notifications} onCheckedChange={setNotifications} className="switch-modern" />
            </div>
          </CardContent>
        </Card>

        {/* Data & Storage */}
        <Card className="card-modern">
          <CardHeader className="pb-6">
            <CardTitle className="text-xl font-semibold text-foreground flex items-center space-x-3">
              <div className="p-2 bg-blue-500/10 rounded-xl">
                <Database className="h-6 w-6 text-blue-500" />
              </div>
              <span>Data & Storage</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl">
              <div className="space-y-1">
                <Label className="text-sm font-semibold text-foreground">Auto Save</Label>
                <p className="text-xs text-muted-foreground">Automatically save your work</p>
              </div>
              <Switch checked={autoSave} onCheckedChange={setAutoSave} className="switch-modern" />
            </div>

            <div className="space-y-3">
              <Label htmlFor="save-interval" className="text-sm font-semibold text-foreground">Save Interval (minutes)</Label>
              <Input
                id="save-interval"
                type="number"
                defaultValue="5"
                min="1"
                max="60"
                className="input-modern focus-ring"
              />
            </div>
          </CardContent>
        </Card>

        {/* Privacy & Security */}
        <Card className="card-modern">
          <CardHeader className="pb-6">
            <CardTitle className="text-xl font-semibold text-foreground flex items-center space-x-3">
              <div className="p-2 bg-emerald-500/10 rounded-xl">
                <Shield className="h-6 w-6 text-emerald-500" />
              </div>
              <span>Privacy & Security</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl">
              <div className="space-y-1">
                <Label className="text-sm font-semibold text-foreground">Analytics</Label>
                <p className="text-xs text-muted-foreground">Help improve the app</p>
              </div>
              <Switch checked={notifications} onCheckedChange={setNotifications} className="switch-modern" />
            </div>

            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl">
              <div className="space-y-1">
                <Label className="text-sm font-semibold text-foreground">Crash Reports</Label>
                <p className="text-xs text-muted-foreground">Send crash reports</p>
              </div>
              <Switch checked={notifications} onCheckedChange={setNotifications} className="switch-modern" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-6">
        <Button className="btn-modern">
          <Save className="h-4 w-4 mr-2" />
          Save Settings
        </Button>
      </div>
    </div>
  );
} 