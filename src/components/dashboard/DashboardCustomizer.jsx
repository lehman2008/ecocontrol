import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Settings, X } from "lucide-react";

export default function DashboardCustomizer({ widgets, onToggleWidget, onClose }) {
  return (
    <Card className="border-2 border-blue-200 shadow-xl">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Personalizar Dashboard
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          <p className="text-sm text-slate-600 mb-4">
            Activa o desactiva los widgets que quieres ver en tu dashboard
          </p>
          {widgets.map((widget) => (
            <div key={widget.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <Label htmlFor={widget.id} className="flex-1 cursor-pointer">
                <div>
                  <p className="font-semibold text-slate-800">{widget.title}</p>
                  <p className="text-xs text-slate-500">{widget.description}</p>
                </div>
              </Label>
              <Switch
                id={widget.id}
                checked={widget.enabled}
                onCheckedChange={() => onToggleWidget(widget.id)}
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}