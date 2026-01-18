import { useCallback } from "react";
import { useShareStore } from "@/lib/store/share-store";
import toast from "react-hot-toast";

export interface ShareOptions {
  url: string;
  title?: string;
  text?: string;
}

export const useShare = () => {
  const addShare = useShareStore((state) => state.addShare);

  const shareToTwitter = useCallback(
    ({ url, text }: ShareOptions) => {
      const shareText = text || "Check this out!";
      const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(url)}`;
      window.open(twitterUrl, "_blank", "width=550,height=420");
      addShare("twitter", url);
      toast.success("Opened Twitter share dialog");
    },
    [addShare],
  );

  const shareToFacebook = useCallback(
    ({ url }: ShareOptions) => {
      const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
      window.open(facebookUrl, "_blank", "width=550,height=420");
      addShare("facebook", url);
      toast.success("Opened Facebook share dialog");
    },
    [addShare],
  );

  const shareToLinkedIn = useCallback(
    ({ url }: ShareOptions) => {
      const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
      window.open(linkedInUrl, "_blank", "width=550,height=420");
      addShare("linkedin", url);
      toast.success("Opened LinkedIn share dialog");
    },
    [addShare],
  );

  const shareToWhatsApp = useCallback(
    ({ url, text }: ShareOptions) => {
      const shareText = text || "Check this out!";
      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${shareText} ${url}`)}`;
      window.open(whatsappUrl, "_blank");
      addShare("whatsapp", url);
      toast.success("Opened WhatsApp share");
    },
    [addShare],
  );

  const shareViaGmail = useCallback(
    ({ url, title, text }: ShareOptions) => {
      const subject = title || "Check this out!";
      const body = text ? `${text}\n\n${url}` : url;

      // Gmail web compose URL
      const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

      window.open(gmailUrl, "_blank");
      addShare("email", url);
      toast.success("Opened Gmail");
    },
    [addShare],
  );

  const copyToClipboard = useCallback(
    async ({ url }: ShareOptions) => {
      try {
        await navigator.clipboard.writeText(url);
        addShare("clipboard", url);
        toast.success("Link copied to clipboard!");
      } catch (error) {
        toast.error("Failed to copy link");
      }
    },
    [addShare],
  );

  const nativeShare = useCallback(
    async ({ url, title, text }: ShareOptions) => {
      if (navigator.share) {
        try {
          await navigator.share({
            title: title || "Share",
            text: text || "",
            url: url,
          });
          addShare("native", url);
          toast.success("Shared successfully!");
        } catch (error) {
          // User cancelled share - don't show error
          if ((error as Error).name !== "AbortError") {
            toast.error("Failed to share");
          }
        }
      } else {
        toast.error("Native share not supported");
      }
    },
    [addShare],
  );

  const canUseNativeShare =
    typeof navigator !== "undefined" && !!navigator.share;

  return {
    shareToTwitter,
    shareToFacebook,
    shareToLinkedIn,
    shareToWhatsApp,
    shareViaGmail,
    copyToClipboard,
    nativeShare,
    canUseNativeShare,
  };
};
