"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ExternalLink, RefreshCw, Copy } from "lucide-react"

export default function TestFramePage() {
  const [formUrl, setFormUrl] = useState("")
  const [iframeUrl, setIframeUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleLoadForm = () => {
    if (!formUrl.trim()) {
      alert("Please enter a form URL")
      return
    }

    // Validate URL format
    try {
      new URL(formUrl)
      setIframeUrl(formUrl)
    } catch (error) {
      alert("Please enter a valid URL (including http:// or https://)")
    }
  }

  const handleRefresh = () => {
    setIsLoading(true)
    // Force iframe refresh by updating the key
    setIframeUrl(prev => prev + "?t=" + Date.now())
    setTimeout(() => setIsLoading(false), 1000)
  }

  const copyUrl = () => {
    navigator.clipboard.writeText(iframeUrl)
    alert("URL copied to clipboard!")
  }

  const sampleUrls = [
    "http://localhost:3000/forms/public/01K5B248H2RX8M2EZ6J34HKXV8",
    "https://example.com/form",
    "http://localhost:3000/forms/public/01K5FXZN2NVYRPDZ1H7KDSH1NV"
  ]

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Form Iframe Test Page</h1>
          <p className="text-gray-600">
            Test your forms in an iframe to verify redirect behavior and post-submit functionality
          </p>
        </div>

        {/* Controls */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ExternalLink className="w-5 h-5" />
              Form URL Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="formUrl" className="text-sm font-medium text-gray-700 mb-2 block">
                Form URL
              </Label>
              <div className="flex gap-2">
                <Input
                  id="formUrl"
                  value={formUrl}
                  onChange={(e) => setFormUrl(e.target.value)}
                  placeholder="https://example.com/form or http://localhost:3000/forms/public/[form-id]"
                  className="flex-1"
                />
                <Button onClick={handleLoadForm} disabled={!formUrl.trim()}>
                  Load Form
                </Button>
              </div>
            </div>

            {/* Sample URLs */}
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">
                Sample URLs (click to use):
              </Label>
              <div className="space-y-2">
                {sampleUrls.map((url, index) => (
                  <button
                    key={index}
                    onClick={() => setFormUrl(url)}
                    className="block w-full text-left p-2 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded border border-gray-200 hover:border-blue-300 transition-colors"
                  >
                    {url}
                  </button>
                ))}
              </div>
            </div>

            {/* Current URL Display */}
            {iframeUrl && (
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">
                  Current Form URL:
                </Label>
                <div className="flex gap-2">
                  <Input
                    value={iframeUrl}
                    readOnly
                    className="flex-1 bg-gray-50"
                  />
                  <Button variant="outline" onClick={copyUrl} size="sm">
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" onClick={handleRefresh} size="sm" disabled={isLoading}>
                    <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Iframe Container */}
        {iframeUrl && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Form Preview</span>
                <div className="text-sm text-gray-500">
                  Testing iframe behavior and redirect functionality
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-gray-200 rounded-lg overflow-hidden">
                <iframe
                  key={iframeUrl} // Force re-render when URL changes
                  src={iframeUrl}
                  width="100%"
                  height="800"
                  frameBorder="0"
                  title="Form Preview"
                  className="w-full"
                  sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-top-navigation"
                />
              </div>
              
              {/* Instructions */}
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-medium text-blue-900 mb-2">Testing Instructions:</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Fill out the form and submit it</li>
                  <li>• Test redirect behavior with different target settings</li>
                  <li>• Verify post-submit message customization</li>
                  <li>• Check if "Parent Window" redirect works (should redirect this page)</li>
                  <li>• Test "New Tab" redirect (should open in new tab)</li>
                  <li>• Test button actions (Go Back, Close, Hidden)</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Info Panel */}
        <Card>
          <CardHeader>
            <CardTitle>Iframe Testing Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Redirect Target Testing</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• <strong>Same Window:</strong> Redirects within iframe</li>
                  <li>• <strong>New Tab:</strong> Opens redirect in new browser tab</li>
                  <li>• <strong>Parent Window:</strong> Redirects this page (breaks out of iframe)</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Post-Submit Testing</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• <strong>Custom Messages:</strong> Test title, message, button text</li>
                  <li>• <strong>Button Actions:</strong> Go Back, Close Window, Hidden</li>
                  <li>• <strong>URL Updates:</strong> Check for ?submitted=true parameter</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
