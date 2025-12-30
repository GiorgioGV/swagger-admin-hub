import { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Link2, CheckCircle, AlertCircle, Copy, ExternalLink } from "lucide-react";
import { toast } from "sonner";

const redirectTypes = [
  { value: "DEEPLINK", label: "Deep Link" },
  { value: "WEBVIEW", label: "Web View" },
  { value: "EXTERNAL", label: "External URL" },
  { value: "INTERNAL", label: "Internal Page" },
];

const RedirectUrls = () => {
  const [buildForm, setBuildForm] = useState({
    type: "",
    baseUrl: "",
    path: "",
    params: "",
  });
  const [validateUrl, setValidateUrl] = useState("");
  const [buildResult, setBuildResult] = useState<{ url: string; valid: boolean } | null>(null);
  const [validateResult, setValidateResult] = useState<{ valid: boolean; errors: string[] } | null>(null);

  const handleBuild = () => {
    if (!buildForm.type || !buildForm.baseUrl) {
      toast.error("Please fill in required fields");
      return;
    }

    // Simulate building URL
    const params = buildForm.params ? `?${buildForm.params}` : "";
    const url = `${buildForm.baseUrl}${buildForm.path}${params}`;
    
    setBuildResult({
      url,
      valid: true,
    });
    toast.success("URL built successfully");
  };

  const handleValidate = () => {
    if (!validateUrl) {
      toast.error("Please enter a URL to validate");
      return;
    }

    // Simulate validation
    const isValid = validateUrl.startsWith("http://") || validateUrl.startsWith("https://");
    const errors: string[] = [];
    
    if (!isValid) {
      errors.push("URL must start with http:// or https://");
    }
    if (validateUrl.includes(" ")) {
      errors.push("URL contains spaces");
    }

    setValidateResult({
      valid: errors.length === 0,
      errors,
    });

    if (errors.length === 0) {
      toast.success("URL is valid");
    } else {
      toast.error("URL validation failed");
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  return (
    <AdminLayout
      title="Redirect URL Builder"
      description="Build and validate redirect URLs for your templates"
    >
      <div className="space-y-6 animate-in">
        <Tabs defaultValue="build" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="build">Build URL</TabsTrigger>
            <TabsTrigger value="validate">Validate URL</TabsTrigger>
          </TabsList>

          <TabsContent value="build" className="mt-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Link2 className="h-5 w-5 text-primary" />
                    URL Builder
                  </CardTitle>
                  <CardDescription>
                    Build a redirect URL based on type and parameters
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-2">
                    <Label>Redirect Type *</Label>
                    <Select
                      value={buildForm.type}
                      onValueChange={(value) =>
                        setBuildForm((prev) => ({ ...prev, type: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {redirectTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label>Base URL *</Label>
                    <Input
                      value={buildForm.baseUrl}
                      onChange={(e) =>
                        setBuildForm((prev) => ({ ...prev, baseUrl: e.target.value }))
                      }
                      placeholder="https://example.com"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label>Path</Label>
                    <Input
                      value={buildForm.path}
                      onChange={(e) =>
                        setBuildForm((prev) => ({ ...prev, path: e.target.value }))
                      }
                      placeholder="/page/action"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label>Query Parameters</Label>
                    <Textarea
                      value={buildForm.params}
                      onChange={(e) =>
                        setBuildForm((prev) => ({ ...prev, params: e.target.value }))
                      }
                      placeholder="key1=value1&key2=value2"
                      rows={2}
                    />
                  </div>

                  <Button onClick={handleBuild} className="w-full">
                    Build URL
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Result</CardTitle>
                  <CardDescription>
                    Your generated redirect URL
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {buildResult ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-success" />
                        <span className="font-medium text-success">URL Built Successfully</span>
                      </div>
                      
                      <div className="rounded-lg border border-border bg-muted/50 p-4">
                        <div className="flex items-start justify-between gap-2">
                          <code className="text-sm text-foreground break-all">
                            {buildResult.url}
                          </code>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 shrink-0"
                              onClick={() => copyToClipboard(buildResult.url)}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 shrink-0"
                              asChild
                            >
                              <a href={buildResult.url} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-4 w-4" />
                              </a>
                            </Button>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline">Type: {buildForm.type}</Badge>
                        {buildForm.path && <Badge variant="outline">Path: {buildForm.path}</Badge>}
                      </div>
                    </div>
                  ) : (
                    <div className="flex h-40 items-center justify-center text-muted-foreground">
                      <p>Fill in the form and click "Build URL" to generate</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="validate" className="mt-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    URL Validator
                  </CardTitle>
                  <CardDescription>
                    Validate an existing redirect URL against configured rules
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-2">
                    <Label>URL to Validate</Label>
                    <Textarea
                      value={validateUrl}
                      onChange={(e) => setValidateUrl(e.target.value)}
                      placeholder="https://example.com/redirect?param=value"
                      rows={3}
                    />
                  </div>

                  <Button onClick={handleValidate} className="w-full">
                    Validate URL
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Validation Result</CardTitle>
                  <CardDescription>
                    Validation status and any errors found
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {validateResult ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        {validateResult.valid ? (
                          <>
                            <CheckCircle className="h-5 w-5 text-success" />
                            <span className="font-medium text-success">URL is Valid</span>
                          </>
                        ) : (
                          <>
                            <AlertCircle className="h-5 w-5 text-destructive" />
                            <span className="font-medium text-destructive">Validation Failed</span>
                          </>
                        )}
                      </div>

                      {validateResult.errors.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-sm font-medium">Errors:</p>
                          <ul className="space-y-1">
                            {validateResult.errors.map((error, index) => (
                              <li
                                key={index}
                                className="flex items-center gap-2 text-sm text-destructive"
                              >
                                <span className="h-1.5 w-1.5 rounded-full bg-destructive" />
                                {error}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {validateResult.valid && (
                        <div className="rounded-lg border border-success/20 bg-success/10 p-4">
                          <p className="text-sm text-success">
                            The URL meets all validation requirements and can be used in templates.
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex h-40 items-center justify-center text-muted-foreground">
                      <p>Enter a URL and click "Validate URL" to check</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default RedirectUrls;
