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
import { Textarea } from "@/components/ui/textarea";
import {
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  Power,
  PowerOff,
  FileText,
} from "lucide-react";
import { toast } from "sonner";

interface Bundle {
  id: number;
  name: string;
  code: string;
  description: string;
  status: "active" | "inactive";
  templateCount: number;
  createdAt: string;
  updatedAt: string;
}

const mockBundles: Bundle[] = [
  {
    id: 1,
    name: "Onboarding Flow",
    code: "ONBOARDING_BUNDLE",
    description: "Complete onboarding email sequence",
    status: "active",
    templateCount: 5,
    createdAt: "2024-01-01",
    updatedAt: "2024-01-15",
  },
  {
    id: 2,
    name: "Transaction Alerts",
    code: "TXN_ALERTS",
    description: "All transaction-related notifications",
    status: "active",
    templateCount: 8,
    createdAt: "2024-01-02",
    updatedAt: "2024-01-14",
  },
  {
    id: 3,
    name: "Marketing Campaigns",
    code: "MARKETING_V2",
    description: "Promotional email templates",
    status: "inactive",
    templateCount: 12,
    createdAt: "2024-01-03",
    updatedAt: "2024-01-13",
  },
  {
    id: 4,
    name: "Security Notifications",
    code: "SECURITY_NOTIF",
    description: "Login alerts and security updates",
    status: "active",
    templateCount: 6,
    createdAt: "2024-01-04",
    updatedAt: "2024-01-12",
  },
  {
    id: 5,
    name: "Account Management",
    code: "ACCOUNT_MGMT",
    description: "Account settings and profile updates",
    status: "active",
    templateCount: 4,
    createdAt: "2024-01-05",
    updatedAt: "2024-01-11",
  },
];

const TemplateBundles = () => {
  const [bundles, setBundles] = useState<Bundle[]>(mockBundles);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const filteredBundles = bundles.filter(
    (bundle) =>
      bundle.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bundle.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleStatus = (bundleId: number) => {
    setBundles((prev) =>
      prev.map((b) =>
        b.id === bundleId
          ? { ...b, status: b.status === "active" ? "inactive" : "active" }
          : b
      )
    );
    const bundle = bundles.find((b) => b.id === bundleId);
    const newStatus = bundle?.status === "active" ? "deactivated" : "activated";
    toast.success(`Bundle "${bundle?.name}" ${newStatus}`);
  };

  const columns: Column<Bundle>[] = [
    {
      key: "name",
      header: "Bundle",
      render: (item) => (
        <div>
          <p className="font-medium text-foreground">{item.name}</p>
          <p className="text-xs text-muted-foreground font-mono">{item.code}</p>
        </div>
      ),
    },
    {
      key: "description",
      header: "Description",
      render: (item) => (
        <span className="text-sm text-muted-foreground line-clamp-1">
          {item.description}
        </span>
      ),
    },
    {
      key: "templateCount",
      header: "Templates",
      render: (item) => (
        <div className="flex items-center gap-1.5">
          <FileText className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">{item.templateCount}</span>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (item) => <StatusBadge status={item.status} />,
    },
    {
      key: "updatedAt",
      header: "Last Updated",
      render: (item) => (
        <span className="text-sm text-muted-foreground">{item.updatedAt}</span>
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
              toast.info(`Viewing bundle: ${item.name}`);
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
              toast.info(`Editing bundle: ${item.name}`);
            }}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={(e) => {
              e.stopPropagation();
              toggleStatus(item.id);
            }}
          >
            {item.status === "active" ? (
              <PowerOff className="h-4 w-4 text-warning" />
            ) : (
              <Power className="h-4 w-4 text-success" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive hover:text-destructive"
            onClick={(e) => {
              e.stopPropagation();
              setBundles((prev) => prev.filter((b) => b.id !== item.id));
              toast.success(`Bundle "${item.name}" deleted`);
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
    const newBundle: Bundle = {
      id: Date.now(),
      name: formData.get("name") as string,
      code: formData.get("code") as string,
      description: formData.get("description") as string,
      status: "inactive",
      templateCount: 0,
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
    };
    setBundles((prev) => [newBundle, ...prev]);
    setIsCreateOpen(false);
    toast.success(`Bundle "${newBundle.name}" created`);
  };

  return (
    <AdminLayout
      title="Template Bundles"
      description="Organize templates into logical groups"
    >
      <div className="space-y-6 animate-in">
        {/* Toolbar */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search bundles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Bundle
              </Button>
            </DialogTrigger>
            <DialogContent>
              <form onSubmit={handleCreate}>
                <DialogHeader>
                  <DialogTitle>Create New Bundle</DialogTitle>
                  <DialogDescription>
                    Group related templates together for easier management
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Bundle Name</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="e.g., Onboarding Flow"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="code">Bundle Code</Label>
                    <Input
                      id="code"
                      name="code"
                      placeholder="e.g., ONBOARDING_BUNDLE"
                      className="font-mono"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      placeholder="Describe the purpose of this bundle..."
                      rows={3}
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
                  <Button type="submit">Create Bundle</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Results info */}
        <p className="text-sm text-muted-foreground">
          Showing {filteredBundles.length} of {bundles.length} bundles
        </p>

        {/* Table */}
        <DataTable
          columns={columns}
          data={filteredBundles}
          keyExtractor={(item) => item.id}
          emptyMessage="No bundles found"
        />
      </div>
    </AdminLayout>
  );
};

export default TemplateBundles;
