"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Badge } from "../ui/badge";
import { 
  FileText, 
  Copy, 
  Download, 
  Search, 
  BookOpen,
  CheckCircle,
  AlertCircle,
  Loader2
} from "lucide-react";

const citationFormats = [
  { value: "apa", label: "APA 7th Edition" },
  { value: "mla", label: "MLA 9th Edition" },
  { value: "chicago", label: "Chicago" },
  { value: "harvard", label: "Harvard" },
  { value: "ieee", label: "IEEE" },
  { value: "vancouver", label: "Vancouver" },
];

export default function CitationPanel() {
  const [isLoading, setIsLoading] = useState(false);
  const [format, setFormat] = useState("apa");
  const [title, setTitle] = useState("");
  const [authors, setAuthors] = useState("");
  const [year, setYear] = useState("");
  const [journal, setJournal] = useState("");
  const [doi, setDoi] = useState("");
  const [url, setUrl] = useState("");
  const [citations, setCitations] = useState<string[]>([]);

  const handleGenerate = async () => {
    if (!title.trim()) return;
    
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      const mockCitation = `${authors} (${year}). ${title}. ${journal}. ${doi ? `https://doi.org/${doi}` : url}`;
      setCitations([mockCitation]);
      setIsLoading(false);
    }, 2000);
  };

  const handleCopy = (citation: string) => {
    navigator.clipboard.writeText(citation);
  };

  const handleDownload = (citation: string) => {
    const blob = new Blob([citation], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'citation.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">Citation Generator</h1>
          <p className="text-muted-foreground">Generate citations in multiple formats</p>
        </div>
        <Badge variant="secondary" className="bg-secondary text-secondary-foreground">
          <FileText className="h-3 w-3 mr-1" />
          AI Powered
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Form */}
        <Card className="card-modern">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center space-x-2">
              <BookOpen className="h-5 w-5" />
              <span>Paper Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Citation Format</label>
              <Select value={format} onValueChange={setFormat}>
                <SelectTrigger className="focus-ring">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {citationFormats.map((fmt) => (
                    <SelectItem key={fmt.value} value={fmt.value}>
                      {fmt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Title</label>
              <Input
                placeholder="Paper title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="focus-ring"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Authors</label>
              <Input
                placeholder="Author names (comma separated)..."
                value={authors}
                onChange={(e) => setAuthors(e.target.value)}
                className="focus-ring"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Year</label>
                <Input
                  placeholder="2024"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="focus-ring"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Journal</label>
                <Input
                  placeholder="Journal name..."
                  value={journal}
                  onChange={(e) => setJournal(e.target.value)}
                  className="focus-ring"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">DOI or URL</label>
              <Input
                placeholder="10.1000/xyz123 or https://..."
                value={doi || url}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value.includes('10.')) {
                    setDoi(value);
                    setUrl('');
                  } else {
                    setUrl(value);
                    setDoi('');
                  }
                }}
                className="focus-ring"
              />
            </div>

            <Button
              onClick={handleGenerate}
              disabled={isLoading || !title.trim()}
              className="w-full btn-modern"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  Generate Citation
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Results */}
        <Card className="card-modern">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center space-x-2">
              <CheckCircle className="h-5 w-5" />
              <span>Generated Citations</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {citations.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No citations generated yet</p>
                <p className="text-sm">Fill in the form and click generate</p>
              </div>
            ) : (
              <div className="space-y-4">
                {citations.map((citation, index) => (
                  <div key={index} className="p-4 bg-muted rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <Badge variant="secondary" className="bg-secondary text-secondary-foreground">
                        {format.toUpperCase()}
                      </Badge>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopy(citation)}
                          className="text-muted-foreground hover:text-foreground hover:bg-accent"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDownload(citation)}
                          className="text-muted-foreground hover:text-foreground hover:bg-accent"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-foreground text-sm leading-relaxed">{citation}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 