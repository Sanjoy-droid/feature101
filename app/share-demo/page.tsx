"use client";

import { ShareButton } from "@/components/share/share-button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useShareStore } from "@/lib/store/share-store";
import { BarChart3 } from "lucide-react";

export default function ShareDemoPage() {
  const shareHistory = useShareStore((state) => state.shareHistory);
  const getShareCount = useShareStore((state) => state.getShareCount);

  const platforms = [
    "twitter",
    "facebook",
    "linkedin",
    "whatsapp",
    "email",
    "clipboard",
    "native",
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container flex h-16 items-center px-4">
          <h1 className="text-xl font-semibold">Share Button System Demo</h1>
        </div>
      </header>

      <main className="container px-4 py-8">
        <div className="mx-auto max-w-4xl space-y-8">
          {/* Demo Cards */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Blog Post Example</CardTitle>
                <CardDescription>
                  Share this amazing article about web development
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-lg border bg-muted p-4">
                  <h3 className="font-semibold">
                    Building Modern Web Apps with Next.js
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Learn how to build production-grade applications with the
                    latest Next.js features...
                  </p>
                </div>
                <ShareButton
                  url="https://yourblog.com/nextjs-guide"
                  title="Building Modern Web Apps with Next.js"
                  text="Check out this awesome guide on Next.js!"
                  variant="default"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Product Example</CardTitle>
                <CardDescription>
                  Share this cool product with your friends
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-lg border bg-muted p-4">
                  <h3 className="font-semibold">Awesome Headphones Pro</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Premium noise-canceling headphones with 30-hour battery
                    life...
                  </p>
                  <p className="mt-2 text-lg font-bold">$299.99</p>
                </div>
                <ShareButton
                  url="https://yourstore.com/headphones-pro"
                  title="Awesome Headphones Pro"
                  text="Check out these amazing headphones!"
                  variant="outline"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Event Example</CardTitle>
                <CardDescription>
                  Invite people to your upcoming event
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-lg border bg-muted p-4">
                  <h3 className="font-semibold">Web Dev Conference 2026</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Join us for 3 days of talks, workshops, and networking...
                  </p>
                  <p className="mt-2 text-sm font-medium">
                    📅 March 15-17, 2026
                  </p>
                </div>
                <ShareButton
                  url="https://webdevconf.com/2026"
                  title="Web Dev Conference 2026"
                  text="Join me at Web Dev Conference 2026!"
                  variant="default"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Custom Styling</CardTitle>
                <CardDescription>
                  Different button variants and sizes
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <ShareButton
                    url="https://example.com"
                    text="Check this out!"
                    variant="default"
                    size="sm"
                  />
                  <ShareButton
                    url="https://example.com"
                    text="Check this out!"
                    variant="outline"
                  />
                  <ShareButton
                    url="https://example.com"
                    text="Check this out!"
                    variant="ghost"
                    size="lg"
                  />
                  <ShareButton
                    url="https://example.com"
                    text="Check this out!"
                    variant="default"
                    size="icon"
                    showLabel={false}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Analytics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Share Analytics
              </CardTitle>
              <CardDescription>
                Track how your content is being shared
              </CardDescription>
            </CardHeader>
            <CardContent>
              {shareHistory.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No shares yet. Click a share button above to track analytics!
                </p>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    {platforms.map((platform) => {
                      const count = getShareCount(platform);
                      return count > 0 ? (
                        <div
                          key={platform}
                          className="rounded-lg border bg-muted p-3 text-center"
                        >
                          <div className="text-2xl font-bold">{count}</div>
                          <div className="text-xs capitalize text-muted-foreground">
                            {platform}
                          </div>
                        </div>
                      ) : null;
                    })}
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold">Recent Activity</h4>
                    <div className="max-h-40 space-y-2 overflow-y-auto">
                      {shareHistory
                        .slice()
                        .reverse()
                        .slice(0, 10)
                        .map((share, i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between rounded border bg-background px-3 py-2 text-sm"
                          >
                            <span className="capitalize">{share.platform}</span>
                            <span className="text-xs text-muted-foreground">
                              {new Date(share.timestamp).toLocaleTimeString()}
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
