import { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Search,
  ChevronRight,
  Lock,
  Copy,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";

interface Endpoint {
  method: "GET" | "POST" | "PUT" | "DELETE";
  path: string;
  summary: string;
  description: string;
  tags: string[];
  permission?: string;
}

const endpoints: Record<string, Endpoint[]> = {
  "Templates": [
    { method: "GET", path: "/api/bo/templates/{templateId}", summary: "Get template by id", description: "Retrieve detailed information of a template by its id.", tags: ["bo-template-controller"], permission: "6000" },
    { method: "POST", path: "/api/bo/templates", summary: "Create a template", description: "Create a new template.", tags: ["bo-template-controller"], permission: "6001" },
    { method: "PUT", path: "/api/bo/templates/{templateId}", summary: "Modify a template", description: "Update an existing template.", tags: ["bo-template-controller"], permission: "6002" },
    { method: "DELETE", path: "/api/bo/templates/{templateId}", summary: "Delete a template", description: "Delete a template by its id.", tags: ["bo-template-controller"], permission: "6004" },
    { method: "POST", path: "/api/bo/templates/search", summary: "Search templates", description: "Search templates based on search criteria.", tags: ["bo-template-controller"], permission: "6000" },
  ],
  "Template Headers": [
    { method: "POST", path: "/api/bo/template-headers", summary: "Create or modify header", description: "Create or modify a template header.", tags: ["bo-template-header-controller"], permission: "6001" },
    { method: "POST", path: "/api/bo/template-headers/search", summary: "Search headers", description: "Search template headers.", tags: ["bo-template-header-controller"], permission: "6000" },
    { method: "PUT", path: "/api/bo/template-headers/active", summary: "Set active version", description: "Set which published version of a template is active.", tags: ["bo-template-header-controller"], permission: "6003" },
  ],
  "Template Bundles": [
    { method: "GET", path: "/api/bo/template-bundles/{templateCode}", summary: "Get bundle by code", description: "Retrieve detailed information of a template bundle.", tags: ["bo-template-bundle-controller"], permission: "6006" },
    { method: "POST", path: "/api/bo/template-bundles", summary: "Create bundle", description: "Create a new template bundle.", tags: ["bo-template-bundle-controller"], permission: "6007" },
    { method: "PUT", path: "/api/bo/template-bundles/{templateCode}", summary: "Modify bundle", description: "Update an existing template bundle.", tags: ["bo-template-bundle-controller"], permission: "6008" },
    { method: "DELETE", path: "/api/bo/template-bundles/{templateCode}", summary: "Delete bundle", description: "Delete a template bundle by its code.", tags: ["bo-template-bundle-controller"], permission: "6009" },
    { method: "PUT", path: "/api/bo/template-bundles/{templateCode}/activate", summary: "Activate bundle", description: "Set template bundle status to active.", tags: ["bo-template-bundle-controller"], permission: "6010" },
    { method: "PUT", path: "/api/bo/template-bundles/{templateCode}/deactivate", summary: "Deactivate bundle", description: "Set template bundle status to inactive.", tags: ["bo-template-bundle-controller"], permission: "6010" },
  ],
  "Channel Templates": [
    { method: "POST", path: "/api/bo/channel-templates/email", summary: "Create/update email template", description: "Create or update an email template with multi-language support.", tags: ["Channel Templates"], permission: "6001" },
    { method: "POST", path: "/api/bo/channel-templates/sms", summary: "Create/update SMS template", description: "Create or update an SMS template.", tags: ["Channel Templates"], permission: "6001" },
    { method: "POST", path: "/api/bo/channel-templates/push", summary: "Create/update push template", description: "Create or update a push notification template.", tags: ["Channel Templates"], permission: "6001" },
    { method: "POST", path: "/api/bo/channel-templates/inbox", summary: "Create/update inbox template", description: "Create or update an inbox message template.", tags: ["Channel Templates"], permission: "6001" },
  ],
  "Redirect URL Builder": [
    { method: "POST", path: "/api/bo/redirect-url/build", summary: "Build redirect URL", description: "Build a redirect URL based on type and parameters.", tags: ["Redirect URL Builder"], permission: "6000" },
    { method: "POST", path: "/api/bo/redirect-url/validate", summary: "Validate redirect URL", description: "Validate an existing redirect URL against rules.", tags: ["Redirect URL Builder"], permission: "6000" },
  ],
  "Template Rendering": [
    { method: "POST", path: "/api/bo/template/{templateHeaderId}", summary: "Render by medium", description: "Render a template with provided medium and variables.", tags: ["bo-template-render-controller"], permission: "6000" },
    { method: "POST", path: "/api/bo/template/render", summary: "Render content", description: "Render template content with variables.", tags: ["bo-template-render-controller"], permission: "6000" },
  ],
};

const methodColors: Record<string, string> = {
  GET: "bg-info/10 text-info border-info/20",
  POST: "bg-success/10 text-success border-success/20",
  PUT: "bg-warning/10 text-warning border-warning/20",
  DELETE: "bg-destructive/10 text-destructive border-destructive/20",
};

const ApiExplorer = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEndpoint, setSelectedEndpoint] = useState<Endpoint | null>(null);

  const filteredEndpoints = Object.entries(endpoints).reduce(
    (acc, [category, items]) => {
      const filtered = items.filter(
        (endpoint) =>
          endpoint.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
          endpoint.summary.toLowerCase().includes(searchQuery.toLowerCase())
      );
      if (filtered.length > 0) {
        acc[category] = filtered;
      }
      return acc;
    },
    {} as Record<string, Endpoint[]>
  );

  const copyPath = (path: string) => {
    navigator.clipboard.writeText(path);
    toast.success("Path copied to clipboard");
  };

  return (
    <AdminLayout
      title="API Explorer"
      description="Browse and explore the CMS Back Office API endpoints"
    >
      <div className="grid gap-6 lg:grid-cols-3 animate-in">
        {/* Endpoints List */}
        <div className="lg:col-span-1">
          <Card className="sticky top-20">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Endpoints</CardTitle>
              <div className="relative mt-2">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search endpoints..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[calc(100vh-300px)]">
                <Accordion type="multiple" defaultValue={Object.keys(endpoints)} className="px-4 pb-4">
                  {Object.entries(filteredEndpoints).map(([category, items]) => (
                    <AccordionItem key={category} value={category}>
                      <AccordionTrigger className="text-sm font-medium">
                        {category}
                        <Badge variant="secondary" className="ml-2">
                          {items.length}
                        </Badge>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-1">
                          {items.map((endpoint, index) => (
                            <button
                              key={index}
                              onClick={() => setSelectedEndpoint(endpoint)}
                              className={`w-full rounded-lg p-2 text-left transition-colors hover:bg-muted ${
                                selectedEndpoint?.path === endpoint.path
                                  ? "bg-muted"
                                  : ""
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <span
                                  className={`inline-flex items-center rounded px-1.5 py-0.5 text-xs font-semibold ${
                                    methodColors[endpoint.method]
                                  }`}
                                >
                                  {endpoint.method}
                                </span>
                                <span className="text-xs text-muted-foreground truncate flex-1">
                                  {endpoint.summary}
                                </span>
                                <ChevronRight className="h-3 w-3 text-muted-foreground" />
                              </div>
                            </button>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Endpoint Details */}
        <div className="lg:col-span-2">
          {selectedEndpoint ? (
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className={`inline-flex items-center rounded px-2 py-1 text-xs font-semibold ${
                          methodColors[selectedEndpoint.method]
                        }`}
                      >
                        {selectedEndpoint.method}
                      </span>
                      {selectedEndpoint.permission && (
                        <Badge variant="outline" className="gap-1">
                          <Lock className="h-3 w-3" />
                          {selectedEndpoint.permission}
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-lg">{selectedEndpoint.summary}</CardTitle>
                    <CardDescription className="mt-1">
                      {selectedEndpoint.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Path */}
                <div>
                  <h4 className="text-sm font-medium mb-2">Endpoint Path</h4>
                  <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/50 p-3">
                    <code className="flex-1 text-sm font-mono text-foreground">
                      {selectedEndpoint.path}
                    </code>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => copyPath(selectedEndpoint.path)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <h4 className="text-sm font-medium mb-2">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedEndpoint.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Example Request */}
                <Tabs defaultValue="curl" className="w-full">
                  <h4 className="text-sm font-medium mb-2">Example Request</h4>
                  <TabsList>
                    <TabsTrigger value="curl">cURL</TabsTrigger>
                    <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                  </TabsList>
                  <TabsContent value="curl" className="mt-2">
                    <div className="rounded-lg border border-border bg-muted/50 p-4">
                      <pre className="text-sm font-mono text-foreground overflow-x-auto">
{`curl -X ${selectedEndpoint.method} \\
  '${selectedEndpoint.path}' \\
  -H 'Content-Type: application/json' \\
  -H 'Authorization: Bearer <token>'`}
                      </pre>
                    </div>
                  </TabsContent>
                  <TabsContent value="javascript" className="mt-2">
                    <div className="rounded-lg border border-border bg-muted/50 p-4">
                      <pre className="text-sm font-mono text-foreground overflow-x-auto">
{`const response = await fetch('${selectedEndpoint.path}', {
  method: '${selectedEndpoint.method}',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer <token>'
  }
});

const data = await response.json();`}
                      </pre>
                    </div>
                  </TabsContent>
                </Tabs>

                {/* Required Permission */}
                {selectedEndpoint.permission && (
                  <div className="rounded-lg border border-border bg-card p-4">
                    <div className="flex items-center gap-2">
                      <Lock className="h-4 w-4 text-warning" />
                      <span className="text-sm font-medium">Required Permission</span>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      This endpoint requires permission code <code className="text-primary">{selectedEndpoint.permission}</code> to access.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex h-96 items-center justify-center">
                <div className="text-center">
                  <ExternalLink className="mx-auto h-12 w-12 text-muted-foreground/50" />
                  <h3 className="mt-4 text-lg font-medium">Select an Endpoint</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Choose an endpoint from the list to view its details
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default ApiExplorer;
