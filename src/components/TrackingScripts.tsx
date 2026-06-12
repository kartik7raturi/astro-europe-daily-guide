import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

/**
 * Loads tracking pixels/scripts configured in admin Manage Pages → Tracking tab.
 * Stored in platform_settings under key "tracking_settings".
 */
const TrackingScripts = () => {
  useEffect(() => {
    let cancelled = false;
    const injected: HTMLElement[] = [];

    const inject = (html: string, target: HTMLElement) => {
      const tmp = document.createElement("div");
      tmp.innerHTML = html;
      Array.from(tmp.childNodes).forEach((node) => {
        if (node.nodeType === 1) {
          const el = node as HTMLElement;
          // re-create script tags so the browser executes them
          if (el.tagName === "SCRIPT") {
            const s = document.createElement("script");
            for (const attr of Array.from(el.attributes)) s.setAttribute(attr.name, attr.value);
            s.text = el.textContent || "";
            target.appendChild(s);
            injected.push(s);
          } else {
            target.appendChild(el);
            injected.push(el);
          }
        }
      });
    };

    const load = async () => {
      try {
        const { data } = await supabase
          .from("platform_settings")
          .select("value")
          .eq("key", "tracking_settings")
          .maybeSingle();
        if (cancelled || !data?.value) return;
        const v = data.value as Record<string, string>;

        // Google Analytics (GA4)
        if (v.ga_id) {
          inject(
            `<script async src="https://www.googletagmanager.com/gtag/js?id=${v.ga_id}"></script>
             <script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${v.ga_id}');</script>`,
            document.head
          );
        }
        // Google Tag Manager
        if (v.gtm_id) {
          inject(
            `<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${v.gtm_id}');</script>`,
            document.head
          );
        }
        // Facebook Pixel
        if (v.fb_pixel_id) {
          inject(
            `<script>!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${v.fb_pixel_id}');fbq('track','PageView');</script>`,
            document.head
          );
        }
        // TikTok Pixel
        if (v.tiktok_pixel_id) {
          inject(
            `<script>!function(w,d,t){w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var o=document.createElement("script");o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};ttq.load('${v.tiktok_pixel_id}');ttq.page();}(window,document,'ttq');</script>`,
            document.head
          );
        }
        // Custom head HTML
        if (v.custom_head) inject(v.custom_head, document.head);
        // Custom body HTML
        if (v.custom_body) inject(v.custom_body, document.body);
      } catch (err) {
        console.error("TrackingScripts load error", err);
      }
    };

    load();
    return () => {
      cancelled = true;
      injected.forEach((el) => el.parentNode?.removeChild(el));
    };
  }, []);

  return null;
};

export default TrackingScripts;