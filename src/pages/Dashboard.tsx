import { AdminLayout } from "@/components/layout/AdminLayout";
import { StatCard } from "@/components/ui/stat-card";
import { DataTable, Column } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  FileText,
  FolderOpen,
  Mail,
  MessageSquare,
  TrendingUp,
  Clock,
} from "lucide-react";

// Mock data for recent templates
const recentTemplates = [
  {
    id: 1,
    name: "Welcome Email",
    code: "WELCOME_EMAIL_V2",
    channel: "EMAIL",
    status: "active" as const,
    lastModified: "2024-01-15",
  },
  {
    id: 2,
    name: "Password Reset",
    code: "PWD_RESET",
    channel: "EMAIL",
    status: "published" as const,
    lastModified: "2024-01-14",
  },
  {
    id: 3,
    name: "OTP Verification",
    code: "OTP_SMS",
    channel: "SMS",
    status: "active" as const,
    lastModified: "2024-01-13",
  },
  {
    id: 4,
    name: "Push Notification",
    code: "PROMO_PUSH",
    channel: "PUSH",
    status: "draft" as const,
    lastModified: "2024-01-12",
  },
  {
    id: 5,
    name: "Account Update",
    code: "ACCOUNT_UPDATE",
    channel: "INBOX",
    status: "pending" as const,
    lastModified: "2024-01-11",
  },
];

const columns: Column<typeof recentTemplates[0]>[] = [
  {
    key: "name",
    header: "Template Name",
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
      <span className="inline-flex items-center gap-1.5 text-sm">
        {item.channel === "EMAIL" && <Mail className="h-3.5 w-3.5" />}
        {item.channel === "SMS" && <MessageSquare className="h-3.5 w-3.5" />}
        {item.channel === "PUSH" && <TrendingUp className="h-3.5 w-3.5" />}
        {item.channel === "INBOX" && <FileText className="h-3.5 w-3.5" />}
        {item.channel}
      </span>
    ),
  },
  {
    key: "status",
    header: "Status",
    render: (item) => <StatusBadge status={item.status} />,
  },
  {
    key: "lastModified",
    header: "Last Modified",
    render: (item) => (
      <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <Clock className="h-3.5 w-3.5" />
        {item.lastModified}
      </span>
    ),
  },
];

const Dashboard = () => {
  return (
    <AdminLayout
      title="Dashboard"
      description="Overview of your CMS templates and activity"
    >
      <div className="space-y-8 animate-in">
        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Templates"
            value={247}
            icon={FileText}
            trend={{ value: 12, isPositive: true }}
            description="vs last month"
          />
          <StatCard
            title="Template Bundles"
            value={38}
            icon={FolderOpen}
            trend={{ value: 5, isPositive: true }}
            description="vs last month"
          />
          <StatCard
            title="Email Templates"
            value={89}
            icon={Mail}
            description="Active templates"
          />
          <StatCard
            title="SMS Templates"
            value={64}
            icon={MessageSquare}
            description="Active templates"
          />
        </div>

        {/* Recent Templates */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">
              Recent Templates
            </h2>
            <a
              href="/templates"
              className="text-sm font-medium text-primary hover:underline"
            >
              View all →
            </a>
          </div>
          <DataTable
            columns={columns}
            data={recentTemplates}
            keyExtractor={(item) => item.id}
            onRowClick={(item) => console.log("Clicked:", item)}
          />
        </div>

        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-3">
          <QuickActionCard
            title="Create Template"
            description="Start with a new template from scratch"
            href="/templates?action=create"
          />
          <QuickActionCard
            title="Manage Bundles"
            description="Organize templates into bundles"
            href="/bundles"
          />
          <QuickActionCard
            title="API Documentation"
            description="Explore the API endpoints"
            href="/api-explorer"
          />
        </div>
      </div>
    </AdminLayout>
  );
};

function QuickActionCard({
  title,
  description,
  href,
}: {
  title: string;
  description: string;
  href: string;
}) {
  return (
    <a
      href={href}
      className="group relative overflow-hidden rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/30 hover:shadow-glow"
    >
      <div className="absolute -right-8 -top-8 h-20 w-20 rounded-full bg-primary/5 blur-2xl transition-all group-hover:bg-primary/10" />
      <div className="relative">
        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
    </a>
  );
}

export default Dashboard;
