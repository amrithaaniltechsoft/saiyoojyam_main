"use client";

import { useState, useEffect } from "react";
import { Download, ExternalLink, FileText, Loader2, AlertCircle } from "lucide-react";

interface ResidentTermItem {
  id: number | string;
  title: string;
  small_description?: string;
  desc?: string;
  pdf_file?: string | null;
  pdf_url?: string;
  download_url?: string;
}

export function TermsTab() {
  const [termsList, setTermsList] = useState<ResidentTermItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<number | string | null>(null);

  const handleDownload = async (term: ResidentTermItem) => {
    const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost/saiyoojyam";
    const baseUrl = rawApiUrl.replace(/\/+$/, "");
    const targetUrl = term.download_url || `${baseUrl}/api/terms/download/${term.id}` || term.pdf_url;

    if (!targetUrl) return;

    try {
      setDownloadingId(term.id);

      const res = await fetch(targetUrl);
      if (!res.ok) {
        throw new Error(`Failed to fetch file: ${res.statusText}`);
      }

      const blob = await res.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      let filename = `${(term.title || "Terms_and_Conditions").replace(/[^a-zA-Z0-9_\-]/g, "_")}.pdf`;
      if (!filename.toLowerCase().endsWith(".pdf")) {
        filename += ".pdf";
      }

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setTimeout(() => {
        window.URL.revokeObjectURL(blobUrl);
      }, 1000);
    } catch (err) {
      console.warn("Direct blob download failed, falling back to direct navigation download:", err);
      if (term.download_url) {
        window.location.href = term.download_url;
      } else if (term.pdf_url) {
        window.open(term.pdf_url, "_blank");
      }
    } finally {
      setDownloadingId(null);
    }
  };

  useEffect(() => {
    let isMounted = true;

    async function fetchResidentTerms() {
      try {
        setLoading(true);
        setError(null);
        const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost/saiyoojyam";
        const baseUrl = rawApiUrl.replace(/\/+$/, "");

        // Logged-in resident terms strictly fetch from saiyoojyam_terms_conditions
        const res = await fetch(`${baseUrl}/api/terms`, { cache: "no-store" });
        if (res.ok) {
          const json = await res.json();
          if (json && json.status) {
            let list: ResidentTermItem[] = [];
            if (Array.isArray(json.list) && json.list.length > 0) {
              list = json.list;
            } else if (json.data && (json.data.title || json.data.small_description || json.data.pdf_url)) {
              list = [json.data];
            }

            if (isMounted) {
              setTermsList(list);
            }
            return;
          }
        }
        if (isMounted) {
          setError("Failed to fetch resident Terms & Conditions. Please try again.");
        }
      } catch (err) {
        console.error("Failed to load resident terms dynamically:", err);
        if (isMounted) {
          setError("An error occurred while loading Terms & Conditions.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchResidentTerms();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="bg-white rounded-xl border border-gray-200/90 shadow-sm p-6 sm:p-8 space-y-6 animate-in fade-in duration-200">
      <div className="border-b border-gray-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-gray-950">Terms and Conditions of Stay</h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Official rules, code of conduct, and policies for residents staying at Saiyoojyam Hostels.
          </p>
        </div>
        {!loading && termsList.length > 0 && (
          <span className="text-xs font-semibold px-2.5 py-1 bg-orange-50 text-[#FF561C] rounded-full border border-orange-100 self-start sm:self-auto">
            {termsList.length} Policy {termsList.length === 1 ? "Section" : "Sections"}
          </span>
        )}
      </div>

      {loading ? (
        <div className="py-12 flex flex-col items-center justify-center gap-3 text-gray-500 text-sm">
          <Loader2 className="w-6 h-6 animate-spin text-[#FF561C]" />
          <span>Loading Terms &amp; Conditions...</span>
        </div>
      ) : error && termsList.length === 0 ? (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      ) : termsList.length === 0 ? (
        <div className="p-8 text-center text-gray-500 text-xs sm:text-sm bg-gray-50 rounded-xl border border-dashed border-gray-200">
          <FileText className="w-8 h-8 mx-auto text-gray-400 mb-2" />
          <p className="font-medium text-gray-700">No Terms &amp; Conditions Published</p>
          <p className="text-gray-500 text-xs mt-1">Hostel policies will be updated shortly by management.</p>
        </div>
      ) : (
        <div className="space-y-4 text-xs sm:text-sm text-gray-700 leading-relaxed">
          {termsList.map((term, index) => {
            const description = term.small_description || term.desc || "";
            return (
              <div
                key={term.id || index}
                className="p-5 sm:p-6 bg-gray-50/80 hover:bg-gray-50 border border-gray-200/90 rounded-xl flex flex-col sm:flex-row sm:items-start justify-between gap-4 transition-all"
              >
                <div className="space-y-2 sm:max-w-[75%]">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-orange-100 text-[#FF561C] font-bold text-xs flex items-center justify-center shrink-0">
                      {index + 1}
                    </span>
                    <h3 className="font-bold text-gray-950 text-sm sm:text-base">{term.title}</h3>
                  </div>
                  {description && (
                    <p className="text-gray-600 text-xs sm:text-sm leading-relaxed pl-8.5 whitespace-pre-line">
                      {description}
                    </p>
                  )}
                </div>

                {term.pdf_url && (
                  <div className="flex items-center gap-2 self-start sm:self-center shrink-0 pt-2 sm:pt-0 pl-8.5 sm:pl-0">
                    <button
                      type="button"
                      onClick={() => handleDownload(term)}
                      disabled={downloadingId === term.id}
                      className="px-3.5 py-2 bg-white hover:bg-orange-50 border border-gray-200 hover:border-[#FF561C]/50 text-gray-800 hover:text-[#FF561C] text-xs sm:text-sm font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
                      title="Download PDF Document"
                    >
                      {downloadingId === term.id ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-[#FF561C]" />
                          <span>Downloading...</span>
                        </>
                      ) : (
                        <>
                          <Download className="w-3.5 h-3.5 text-[#FF561C]" />
                          <span>Download PDF</span>
                        </>
                      )}
                    </button>
                    <a
                      href={term.pdf_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-white hover:bg-gray-100 border border-gray-200 text-gray-600 hover:text-gray-900 rounded-lg transition-colors"
                      title="Open in new tab / Preview"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
