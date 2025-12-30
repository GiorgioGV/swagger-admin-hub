import { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { DataTable, Column } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Search, Eye, Edit, Trash2, Clock, Hash } from "lucide-react";
import { toast } from "sonner";

interface TemplateHeader {
  id: number;
  code: string;
  name: string;
  channel: "EMAIL" | "SMS" | "PUSH" | "INBOX";
  activeVersion: number;
  totalVersions: number;
  status: "active" | "inactive" | "draft";
  lastModified: string;
}

const mockHeaders: TemplateHeader[] = [
  {
    id: 1,
    code: "HEADER_WELCOME",
    name: "Welcome Header",
    channel: "EMAIL",
    activeVersion: 3,
    totalVersions: 5,
    status: "active",
    lastModified: "2024-01-15",
  },
  {
    id: 2,
    code: "HEADER_TXN",
    name: "Transaction Header",
    channel: "EMAIL",
    activeVersion: 2,
    totalVersions: 3,
    status: "active",
    lastModified: "2024-01-14",
  },
  {
    id: 3,
    code: "HEADER_PROMO",
    name: "Promotional Header",
    channel: "EMAIL",
    activeVersion: 1,
    totalVersions: 2,
    status: "draft",
    lastModified: "2024-01-13",
  },
  {
    id: 4,
    code: "HEADER_ALERT",
    name: "Alert Header",
    channel: "SMS",
    activeVersion: 4,
    totalVersions: 4,
    status: "active",
    lastModified: "2024-01-12",
  },
  {
    id: 5,
    code: "HEADER_NOTIF",
    name: "Notification Header",
    channel: "PUSH",
    activeVersion: 2,
    totalVersions: 3,
    status: "inactive",
    lastModified: "2024-01-11",
  },
];

const TemplateHeaders = () => {
  const [headers, setHeaders] = useState<TemplateHeader[]>(mockHeaders);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const filteredHeaders = headers.filter(
    (header) =>
      header.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      header.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns: Column<TemplateHeader>[] = [
    {
      key: "name",
      header: "Header",
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
        <div className="flex items-center gap-1.5">
          <Hash className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-sm font-mono">
            v{item.activeVersion}
            <span className="text-muted-foreground">/{item.totalVersions}</span>
          </span>
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
              toast.info(`Viewing header: ${item.name}`);
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
              toast.info(`Editing header: ${item.name}`);
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
              setHeaders((prev) => prev.filter((h) => h.id !== item.id));
              toast.success(`Header "${item.name}" deleted`);
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
    const newHeader: TemplateHeader = {
      id: Date.now(),
      code: formData.get("code") as string,
      name: formData.get("name") as string,
      channel: formData.get("channel") as TemplateHeader["channel"],
      activeVersion: 1,
      totalVersions: 1,
      status: "draft",
      lastModified: new Date().toISOString().split("T")[0],
    };
    setHeaders((prev) => [newHeader, ...prev]);
    setIsCreateOpen(false);
    toast.success(`Header "${newHeader.name}" created`);
  };

  return (
    <AdminLayout
      title="Template Headers"
      description="Manage template headers and their versions"
    >
      <div className="space-y-6 animate-in">
        {/* Toolbar */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search headers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Header
              </Button>
            </DialogTrigger>
            <DialogContent>
              <form onSubmit={handleCreate}>
                <DialogHeader>
                  <DialogTitle>Create Template Header</DialogTitle>
                  <DialogDescription>
                    Create a new template header to manage versions
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Header Name</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="e.g., Welcome Header"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="code">Header Code</Label>
                    <Input
                      id="code"
                      name="code"
                      placeholder="e.g., HEADER_WELCOME"
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
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsCreateOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">Create Header</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Results info */}
        <p className="text-sm text-muted-foreground">
          Showing {filteredHeaders.length} of {headers.length} headers
        </p>

        {/* Table */}
        <DataTable
          columns={columns}
          data={filteredHeaders}
          keyExtractor={(item) => item.id}
          emptyMessage="No headers found"
        />
      </div>
    </AdminLayout>
  );
};

export default TemplateHeaders;
