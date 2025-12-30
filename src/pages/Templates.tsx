import { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { DataTable, Column } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Plus, Search, Filter, Eye, Edit, Trash2, Clock } from "lucide-react";
import { toast } from "sonner";

interface Template {
  id: number;
  name: string;
  code: string;
  channel: "EMAIL" | "SMS" | "PUSH" | "INBOX";
  status: "active" | "inactive" | "draft" | "published";
  version: number;
  lastModified: string;
  createdBy: string;
}

const mockTemplates: Template[] = [
  {
    id: 1,
    name: "Welcome Email",
    code: "WELCOME_EMAIL_V2",
    channel: "EMAIL",
    status: "active",
    version: 3,
    lastModified: "2024-01-15",
    createdBy: "admin@example.com",
  },
  {
    id: 2,
    name: "Password Reset",
    code: "PWD_RESET",
    channel: "EMAIL",
    status: "published",
    version: 2,
    lastModified: "2024-01-14",
    createdBy: "admin@example.com",
  },
  {
    id: 3,
    name: "OTP Verification SMS",
    code: "OTP_SMS",
    channel: "SMS",
    status: "active",
    version: 5,
    lastModified: "2024-01-13",
    createdBy: "user@example.com",
  },
  {
    id: 4,
    name: "Promotional Push",
    code: "PROMO_PUSH",
    channel: "PUSH",
    status: "draft",
    version: 1,
    lastModified: "2024-01-12",
    createdBy: "marketing@example.com",
  },
  {
    id: 5,
    name: "Account Update Notice",
    code: "ACCOUNT_UPDATE",
    channel: "INBOX",
    status: "active",
    version: 2,
    lastModified: "2024-01-11",
    createdBy: "admin@example.com",
  },
  {
    id: 6,
    name: "Transaction Alert",
    code: "TXN_ALERT",
    channel: "SMS",
    status: "published",
    version: 4,
    lastModified: "2024-01-10",
    createdBy: "system@example.com",
  },
  {
    id: 7,
    name: "Newsletter Monthly",
    code: "NEWS_MONTHLY",
    channel: "EMAIL",
    status: "inactive",
    version: 1,
    lastModified: "2024-01-09",
    createdBy: "marketing@example.com",
  },
  {
    id: 8,
    name: "Login Notification",
    code: "LOGIN_NOTIF",
    channel: "PUSH",
    status: "active",
    version: 2,
    lastModified: "2024-01-08",
    createdBy: "security@example.com",
  },
];

const Templates = () => {
  const [templates, setTemplates] = useState<Template[]>(mockTemplates);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [channelFilter, setChannelFilter] = useState<string>("all");
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || template.status === statusFilter;
    const matchesChannel =
      channelFilter === "all" || template.channel === channelFilter;
    return matchesSearch && matchesStatus && matchesChannel;
  });

  const columns: Column<Template>[] = [
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
      key: "channel",
      header: "Channel",
      render: (item) => (
        <span className="inline-flex items-center rounded-md bg-muted px-2 py-1 text-xs font-medium">
          {item.channel}
        </span>
      ),
    },
    {
      key: "version",
      header: "Version",
      render: (item) => (
        <span className="text-sm font-mono">v{item.version}</span>
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
        <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Clock className="h-3.5 w-3.5" />
          {item.lastModified}
        </span>
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
              toast.info(`Viewing template: ${item.name}`);
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
              toast.info(`Editing template: ${item.name}`);
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
              toast.success(`Template "${item.name}" deleted`);
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
    const newTemplate: Template = {
      id: Date.now(),
      name: formData.get("name") as string,
      code: formData.get("code") as string,
      channel: formData.get("channel") as Template["channel"],
      status: "draft",
      version: 1,
      lastModified: new Date().toISOString().split("T")[0],
      createdBy: "admin@example.com",
    };
    setTemplates((prev) => [newTemplate, ...prev]);
    setIsCreateOpen(false);
    toast.success(`Template "${newTemplate.name}" created`);
  };

  return (
    <AdminLayout
      title="Templates"
      description="Manage your message templates across all channels"
    >
      <div className="space-y-6 animate-in">
        {/* Toolbar */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 items-center gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
              </SelectContent>
            </Select>
            <Select value={channelFilter} onValueChange={setChannelFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Channel" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Channels</SelectItem>
                <SelectItem value="EMAIL">Email</SelectItem>
                <SelectItem value="SMS">SMS</SelectItem>
                <SelectItem value="PUSH">Push</SelectItem>
                <SelectItem value="INBOX">Inbox</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Template
              </Button>
            </DialogTrigger>
            <DialogContent>
              <form onSubmit={handleCreate}>
                <DialogHeader>
                  <DialogTitle>Create New Template</DialogTitle>
                  <DialogDescription>
                    Create a new message template for your communications
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
                      placeholder="e.g., WELCOME_EMAIL"
                      className="font-mono"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="channel">Channel</Label>
                    <Select name="channel" defaultValue="EMAIL">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="EMAIL">Email</SelectItem>
                        <SelectItem value="SMS">SMS</SelectItem>
                        <SelectItem value="PUSH">Push</SelectItem>
                        <SelectItem value="INBOX">Inbox</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="content">Content</Label>
                    <Textarea
                      id="content"
                      name="content"
                      placeholder="Enter template content..."
                      rows={4}
                    />
                  </div>
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
          emptyMessage="No templates found matching your filters"
        />
      </div>
    </AdminLayout>
  );
};

export default Templates;
