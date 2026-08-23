import React from "react";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeft, BookOpen } from "lucide-react";

export const revalidate = 0; // always dynamic

export default async function TermsPage() {
  const page = await prisma.contentPage.findUnique({
    where: { slug: "terms" },
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link
        href="/"
        className="inline-flex items-center space-x-2 text-sm text-gray-400 hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Store</span>
      </Link>

      <div className="bg-[#181b27] border border-[#262c3e] rounded-3xl p-6 sm:p-10 shadow-card">
        <div className="flex items-center space-x-3 mb-6 pb-6 border-b border-[#252b3d]">
          <div className="w-12 h-12 rounded-2xl bg-[#222739] border border-[#313950] flex items-center justify-center text-blue-400">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              {page?.title || "Terms & Conditions"}
            </h1>
            <p className="text-xs text-gray-400 mt-1">
              Last updated: {page?.updatedAt ? new Date(page.updatedAt).toLocaleDateString() : "August 2026"}
            </p>
          </div>
        </div>

        <div className="prose prose-invert max-w-none text-sm leading-relaxed text-gray-300 space-y-4 whitespace-pre-wrap">
          {page?.content || "Terms and conditions are being updated."}
        </div>
      </div>
    </div>
  );
}
