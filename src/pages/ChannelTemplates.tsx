import { useState } from "react";
import { useParams } from "react-router-dom";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { DataTable, Column } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Plus, Search, Eye, Edit, Trash2, Mail, MessageSquare, Bell, Inbox, Globe } from "lucide-react";
import { toast } from "sonner";

interface ChannelTemplate {
  id: number;
  code: string;
  name: string;
  status: "active" | "inactive" | "draft";
  languages: string[];
  lastModified: string;
  noReply?: boolean;
  hasMedia?: boolean;
  hasRedirectUrl?: boolean;
}

const mockEmailTemplates: ChannelTemplate[] = [
  { id: 1, code: "EMAIL_WELCOME", name: "Welcome Email", status: "active", languages: ["EN", "GE", "RU"], lastModified: "2024-01-15" },
  { id: 2, code: "EMAIL_RESET", name: "Password Reset", status: "active", languages: ["EN", "GE"], lastModified: "2024-01-14" },
  { id: 3, code: "EMAIL_VERIFY", name: "Email Verification", status: "active", languages: ["EN"], lastModified: "2024-01-13" },
  { id: 4, code: "EMAIL_PROMO", name: "Promotional Campaign", status: "draft", languages: ["EN", "GE", "RU"], lastModified: "2024-01-12" },
];

const mockSmsTemplates: ChannelTemplate[] = [
  { id: 1, code: "SMS_OTP", name: "OTP Code", status: "active", languages: ["EN", "GE"], lastModified: "2024-01-15", noReply: true },
  { id: 2, code: "SMS_TXN", name: "Transaction Alert", status: "active", languages: ["EN", "GE", "RU"], lastModified: "2024-01-14", noReply: true },
  { id: 3, code: "SMS_PROMO", name: "Promotional SMS", status: "inactive", languages: ["EN"], lastModified: "2024-01-13", noReply: false },
];

const mockPushTemplates: ChannelTemplate[] = [
  { id: 1, code: "PUSH_LOGIN", name: "Login Alert", status: "active", languages: ["EN", "GE"], lastModified: "2024-01-15", hasMedia: false, hasRedirectUrl: true },
  { id: 2, code: "PUSH_PROMO", name: "Promo Notification", status: "draft", languages: ["EN", "GE", "RU"], lastModified: "2024-01-14", hasMedia: true, hasRedirectUrl: true },
  { id: 3, code: "PUSH_UPDATE", name: "App Update", status: "active", languages: ["EN"], lastModified: "2024-01-13", hasMedia: true, hasRedirectUrl: true },
];

const mockInboxTemplates: ChannelTemplate[] = [
  { id: 1, code: "INBOX_WELCOME", name: "Welcome Message", status: "active", languages: ["EN", "GE", "RU"], lastModified: "2024-01-15" },
  { id: 2, code: "INBOX_TXN", name: "Transaction Receipt", status: "active", languages: ["EN", "GE"], lastModified: "2024-01-14" },
  { id: 3, code: "INBOX_SUPPORT", name: "Support Response", status: "draft", languages: ["EN"], lastModified: "2024-01-13" },
];

const channelConfig = {
  email: { icon: Mail, title: "Email Templates", data: mockEmailTemplates },
  sms: { icon: MessageSquare, title: "SMS Templates", data: mockSmsTemplates },
  push: { icon: Bell, title: "Push Templates", data: mockPushTemplates },
  inbox: { icon: Inbox, title: "Inbox Templates", data: mockInboxTemplates },
};

const ChannelTemplates = () => {
  const { channel = "email" } = useParams<{ channel: string }>();
  const config = channelConfig[channel as keyof typeof channelConfig] || channelConfig.email;
  
  const [templates, setTemplates] = useState<ChannelTemplate[]>(config.data);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const filteredTemplates = templates.filter(
    (template) =>
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns: Column<ChannelTemplate>[] = [
    {
      key: "name",
      header: "Template",
      render: (item) => (
        <div>
          <p className="font-medium text-foreground">{item.name}</p>
          <p className="text-xs text-muted-foreground font-mono">{item.code}</p>
        </div>
      ),
    },
    {
      key: "languages",
      header: "Languages",
      render: (item) => (
        <div className="flex items-center gap-1">
          <Globe className="h-3.5 w-3.5 text-muted-foreground mr-1" />
          {item.languages.map((lang) => (
            <span
              key={lang}
              className="inline-flex items-center rounded bg-muted px-1.5 py-0.5 text-xs font-medium"
            >
              {lang}
            </span>
          ))}
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (item) => <StatusBadge status={item.status} />,
    },
    {
      key: "lastModified",
      header: "Modified",
      render: (item) => (
        <span className="text-sm text-muted-foreground">{item.lastModified}</span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      className: "text-right",
      render: (item) => (
        <div className="flex items-center justify-end gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={(e) => {
              e.stopPropagation();
              toast.info(`Viewing: ${item.name}`);
            }}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={(e) => {
              e.stopPropagation();
              toast.info(`Editing: ${item.name}`);
            }}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive hover:text-destructive"
            onClick={(e) => {
              e.stopPropagation();
              setTemplates((prev) => prev.filter((t) => t.id !== item.id));
              toast.success(`"${item.name}" deleted`);
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newTemplate: ChannelTemplate = {
      id: Date.now(),
      code: formData.get("code") as string,
      name: formData.get("name") as string,
      status: "draft",
      languages: ["EN"],
      lastModified: new Date().toISOString().split("T")[0],
    };
    setTemplates((prev) => [newTemplate, ...prev]);
    setIsCreateOpen(false);
    toast.success(`Template "${newTemplate.name}" created`);
  };

  const Icon = config.icon;

  return (
    <AdminLayout
      title={config.title}
      description={`Manage ${channel} templates with multi-language support`}
    >
      <div className="space-y-6 animate-in">
        {/* Channel indicator */}
        <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Icon className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground capitalize">{channel} Channel</h3>
            <p className="text-sm text-muted-foreground">
              {templates.length} templates • Multi-language support (EN, GE, RU)
            </p>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create {channel.charAt(0).toUpperCase() + channel.slice(1)} Template
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <form onSubmit={handleCreate}>
                <DialogHeader>
                  <DialogTitle>Create {channel.charAt(0).toUpperCase() + channel.slice(1)} Template</DialogTitle>
                  <DialogDescription>
                    Create a new {channel} template with multi-language content
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Template Name</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="e.g., Welcome Email"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="code">Template Code</Label>
                    <Input
                      id="code"
                      name="code"
                      placeholder={`e.g., ${channel.toUpperCase()}_WELCOME`}
                      className="font-mono"
                      required
                    />
                  </div>
                  
                  <Tabs defaultValue="en" className="w-full">
                    <Label>Content by Language</Label>
                    <TabsList className="mt-2 grid w-full grid-cols-3">
                      <TabsTrigger value="en">English</TabsTrigger>
                      <TabsTrigger value="ge">Georgian</TabsTrigger>
                      <TabsTrigger value="ru">Russian</TabsTrigger>
                    </TabsList>
                    {["en", "ge", "ru"].map((lang) => (
                      <TabsContent key={lang} value={lang} className="mt-4">
                        {channel === "email" && (
                          <div className="grid gap-3">
                            <div className="grid gap-2">
                              <Label>Subject</Label>
                              <Input placeholder={`Subject in ${lang.toUpperCase()}`} />
                            </div>
                            <div className="grid gap-2">
                              <Label>Body</Label>
                              <Textarea placeholder={`Email body in ${lang.toUpperCase()}`} rows={4} />
                            </div>
                          </div>
                        )}
                        {channel === "sms" && (
                          <div className="grid gap-2">
                            <Label>Message</Label>
                            <Textarea placeholder={`SMS text in ${lang.toUpperCase()}`} rows={3} />
                          </div>
                        )}
                        {channel === "push" && (
                          <div className="grid gap-3">
                            <div className="grid gap-2">
                              <Label>Title</Label>
                              <Input placeholder={`Title in ${lang.toUpperCase()}`} />
                            </div>
                            <div className="grid gap-2">
                              <Label>Body</Label>
                              <Textarea placeholder={`Body in ${lang.toUpperCase()}`} rows={2} />
                            </div>
                          </div>
                        )}
                        {channel === "inbox" && (
                          <div className="grid gap-3">
                            <div className="grid gap-2">
                              <Label>Title</Label>
                              <Input placeholder={`Title in ${lang.toUpperCase()}`} />
                            </div>
                            <div className="grid gap-2">
                              <Label>Content</Label>
                              <Textarea placeholder={`Content in ${lang.toUpperCase()}`} rows={4} />
                            </div>
                          </div>
                        )}
                      </TabsContent>
                    ))}
                  </Tabs>

                  {channel === "sms" && (
                    <div className="flex items-center justify-between rounded-lg border border-border p-3">
                      <div>
                        <Label>No Reply</Label>
                        <p className="text-xs text-muted-foreground">Disable replies to this SMS</p>
                      </div>
                      <Switch />
                    </div>
                  )}

                  {channel === "push" && (
                    <div className="grid gap-3">
                      <div className="grid gap-2">
                        <Label>Media URL (optional)</Label>
                        <Input placeholder="https://example.com/image.jpg" />
                      </div>
                      <div className="grid gap-2">
                        <Label>Redirect URL (optional)</Label>
                        <Input placeholder="https://example.com/page" />
                      </div>
                    </div>
                  )}
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsCreateOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">Create Template</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Results info */}
        <p className="text-sm text-muted-foreground">
          Showing {filteredTemplates.length} of {templates.length} templates
        </p>

        {/* Table */}
        <DataTable
          columns={columns}
          data={filteredTemplates}
          keyExtractor={(item) => item.id}
          emptyMessage="No templates found"
        />
      </div>
    </AdminLayout>
  );
};

export default ChannelTemplates;
