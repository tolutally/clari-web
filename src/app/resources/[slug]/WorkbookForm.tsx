"use client";

import { useEffect, useRef, useState } from "react";

// ─── MailerLite CSS ──────────────────────────────────────────────────────────
const ML_CSS = `
@import url("https://assets.mlcdn.com/fonts.css?version=1782388");
.ml-form-embedSubmitLoad{display:inline-block;width:20px;height:20px}
.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);border:0}
.ml-form-embedSubmitLoad:after{content:" ";display:block;width:11px;height:11px;margin:1px;border-radius:50%;border:4px solid #fff;border-color:#fff #fff #fff transparent;animation:ml-form-embedSubmitLoad 1.2s linear infinite}
@keyframes ml-form-embedSubmitLoad{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}
#mlb2-42973861.ml-form-embedContainer{box-sizing:border-box;display:table;margin:0 auto;position:static;width:100%!important}
#mlb2-42973861.ml-form-embedContainer h4,#mlb2-42973861.ml-form-embedContainer p,#mlb2-42973861.ml-form-embedContainer span,#mlb2-42973861.ml-form-embedContainer button{text-transform:none!important;letter-spacing:normal!important}
#mlb2-42973861.ml-form-embedContainer .ml-form-embedWrapper{background-color:#cbc0f3;border-width:0;border-color:transparent;border-radius:4px;border-style:solid;box-sizing:border-box;display:inline-block!important;margin:0;padding:0;position:relative}
#mlb2-42973861.ml-form-embedContainer .ml-form-embedWrapper.embedPopup,#mlb2-42973861.ml-form-embedContainer .ml-form-embedWrapper.embedDefault{width:400px}
#mlb2-42973861.ml-form-embedContainer .ml-form-embedWrapper.embedForm{max-width:400px;width:100%}
#mlb2-42973861.ml-form-embedContainer .ml-form-align-center{text-align:center}
#mlb2-42973861.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedHeader img{border-top-left-radius:4px;border-top-right-radius:4px;height:auto;margin:0 auto!important;max-width:100%;width:2339px}
#mlb2-42973861.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody,#mlb2-42973861.ml-form-embedContainer .ml-form-embedWrapper .ml-form-successBody{padding:20px 20px 0 20px}
#mlb2-42973861.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-embedContent,#mlb2-42973861.ml-form-embedContainer .ml-form-embedWrapper .ml-form-successBody .ml-form-successContent{text-align:left;margin:0 0 20px 0}
#mlb2-42973861.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-embedContent h4,#mlb2-42973861.ml-form-embedContainer .ml-form-embedWrapper .ml-form-successBody .ml-form-successContent h4{color:#003366;font-family:'Lucida Sans Unicode','Lucida Grande',sans-serif;font-size:30px;font-weight:400;margin:0 0 10px 0;text-align:left;word-break:break-word}
#mlb2-42973861.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-embedContent p,#mlb2-42973861.ml-form-embedContainer .ml-form-embedWrapper .ml-form-successBody .ml-form-successContent p{color:#003366;font-family:'Open Sans',Arial,Helvetica,sans-serif;font-size:14px;font-weight:400;line-height:20px;margin:0 0 10px 0;text-align:left}
#mlb2-42973861.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody form{margin:0;width:100%}
#mlb2-42973861.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-formContent{margin:0 0 20px 0;width:100%}
#mlb2-42973861.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-fieldRow{margin:0 0 10px 0;width:100%}
#mlb2-42973861.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-fieldRow.ml-last-item{margin:0}
#mlb2-42973861.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-fieldRow input{background-color:#fff!important;color:#807a7a!important;border-color:#ccc;border-radius:2px!important;border-style:solid!important;border-width:1px!important;font-family:'Lucida Sans Unicode','Lucida Grande',sans-serif;font-size:12px!important;height:auto;line-height:21px!important;margin:0;padding:10px!important;width:100%!important;box-sizing:border-box!important;max-width:100%!important}
#mlb2-42973861.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-embedSubmit{margin:0 0 20px 0;float:left;width:100%}
#mlb2-42973861.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-embedSubmit button{background-color:#003366!important;border:none!important;border-radius:4px!important;box-shadow:none!important;color:#fff!important;cursor:pointer;font-family:'Open Sans',Arial,Helvetica,sans-serif!important;font-size:14px!important;font-weight:700!important;line-height:21px!important;height:auto;padding:10px!important;width:100%!important;box-sizing:border-box!important}
#mlb2-42973861.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-embedSubmit button.loading{display:none}
#mlb2-42973861.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-embedSubmit button:hover{background-color:#ff686c!important}
.ml-error input,.ml-error textarea,.ml-error select{border-color:red!important}
.ml-error .label-description,.ml-error .label-description p,.ml-error label:first-child{color:#f00!important}
.ml-form-recaptcha{margin-bottom:20px}
.ml-form-recaptcha.ml-error iframe{border:solid 1px #f00}
@media screen and (max-width:480px){.ml-form-recaptcha{width:220px!important}.g-recaptcha{transform:scale(0.78);-webkit-transform:scale(0.78);transform-origin:0 0;-webkit-transform-origin:0 0}}
@media only screen and (max-width:400px){.ml-form-embedWrapper.embedDefault,.ml-form-embedWrapper.embedPopup{width:100%!important}}
`;

// ─── MailerLite form HTML ─────────────────────────────────────────────────────
const ML_FORM_HTML = `<div id="mlb2-42973861" class="ml-form-embedContainer ml-subscribe-form ml-subscribe-form-42973861"><div class="ml-form-align-center"><div class="ml-form-embedWrapper embedForm"><div class="ml-form-embedHeader"><img src="https://storage.mlcdn.com/account_image/2466380/kdEfUiaICQZtQwg3Ub2AfOtcOflI6Y9ZtQZNbc5M.jpg" border="0" style="display:block;" alt=""></div><div class="ml-form-embedBody ml-form-embedBodyDefault row-form"><div class="ml-form-embedContent"><h4>Send me the workbook</h4><p>The question bank, scorecard, and full quote dataset, straight to your inbox.</p></div><form class="ml-block-form" action="https://assets.mailerlite.com/jsonp/2466380/forms/191100561442998162/subscribe" data-code="" method="post" target="_blank"><div class="ml-form-formContent"><div class="ml-form-fieldRow ml-last-item"><div class="ml-field-group ml-field-email ml-validate-email ml-validate-required"><input aria-label="email" aria-required="true" type="email" class="form-control" data-inputmask="" name="fields[email]" placeholder="Your work email" autocomplete="email"></div></div></div><div class="ml-form-recaptcha ml-validate-required" style="float:left;"><div class="g-recaptcha" data-sitekey="6Lf1KHQUAAAAAFNKEX1hdSWCS3mRMv4FlFaNslaD"></div></div><input type="hidden" name="ml-submit" value="1"><div class="ml-form-embedSubmit"><button type="submit" class="primary">Send me the workbook</button><button disabled="disabled" style="display:none;" type="button" class="loading"><div class="ml-form-embedSubmitLoad"></div><span class="sr-only">Loading...</span></button></div><input type="hidden" name="anticsrf" value="true"></form></div><div class="ml-form-successBody row-success" style="display:none"><div class="ml-form-successContent"><h4>Thank you!</h4><p>Your workbook is on its way &#8212; check your inbox.</p></div></div></div></div></div>`;

export default function WorkbookModalButton({ workbookUrl }: { workbookUrl: string }) {
  const [open, setOpen] = useState(false);
  const loaded = useRef(false);

  // Load MailerLite + reCAPTCHA scripts once on mount
  useEffect(() => {
    if (loaded.current) return;
    loaded.current = true;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).ml_webform_success_42973861 = function () {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const $ = (window as any).ml_jQuery || (window as any).jQuery;
      if ($) {
        $(".ml-subscribe-form-42973861 .row-success").show();
        $(".ml-subscribe-form-42973861 .row-form").hide();
      }
      setTimeout(() => window.open(workbookUrl, "_blank"), 800);
    };
    const addScript = (src: string) => {
      if (document.querySelector(`script[src="${src}"]`)) return;
      const s = document.createElement("script");
      s.src = src;
      s.async = true;
      document.head.appendChild(s);
    };
    addScript("https://www.google.com/recaptcha/api.js");
    addScript("https://groot.mailerlite.com/js/w/webforms.min.js?v83147fa8ce2d95cb73ece7f28b469519");
    fetch("https://assets.mailerlite.com/jsonp/2466380/forms/191100561442998162/takel").catch(() => {});
  }, [workbookUrl]);

  // Lock body scroll, hide footer, ESC key when modal is open
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const footer = document.querySelector("footer") as HTMLElement | null;
    if (footer) footer.style.display = "none";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      if (footer) footer.style.display = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: ML_CSS }} />
      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 9,
          fontFamily: "inherit",
          fontSize: "1rem",
          fontWeight: 600,
          lineHeight: 1,
          padding: "16px 30px",
          borderRadius: 999,
          border: "none",
          background: "#ff686c",
          color: "#fff",
          cursor: "pointer",
          minHeight: 44,
          transition: "background 0.2s ease",
        }}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ width: 18, height: 18 }}
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
        Get the workbook
      </button>

      {/* Modal — always in DOM so MailerLite script can find #mlb2-42973861 */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Workbook sign-up"
        aria-hidden={!open}
        onClick={(e) => {
          if (e.target === e.currentTarget) setOpen(false);
        }}
        style={{
          display: open ? "flex" : "none",
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.6)",
          zIndex: 9999,
          alignItems: "center",
          justifyContent: "center",
          padding: 16,
        }}
      >
        <div
          style={{
            position: "relative",
            maxWidth: 440,
            width: "100%",
            borderRadius: 16,
            overflow: "hidden",
            boxShadow: "0 24px 60px rgba(0,0,0,0.3)",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close"
            style={{
              position: "absolute",
              top: 10,
              right: 10,
              zIndex: 10,
              background: "rgba(255,255,255,0.88)",
              border: "none",
              borderRadius: "50%",
              width: 30,
              height: 30,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#1F2D5C",
              fontSize: 18,
              fontWeight: 700,
              lineHeight: 1,
            }}
          >
            &times;
          </button>
          <div dangerouslySetInnerHTML={{ __html: ML_FORM_HTML }} />
        </div>
      </div>
    </>
  );
}
