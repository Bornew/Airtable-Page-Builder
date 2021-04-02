// import sanitizeHtml from "sanitize-html";

export default function SanitizeHTML(md, { html }: { html: string }) {
  html = html
    .replace(/^(\s*)\[(X|\s|\_|\-)\]\s(.*)/gim, "$1- [$2] $3")
    .replace(/\n\[(.{1})]/g, "\\\n[$1]");
  const html2 = md.render(html);
  const domParser = new DOMParser();
  const tmpEl = domParser.parseFromString(html2, "text/html");
  const links = tmpEl.querySelectorAll("a");
  links.forEach((aEl) => {
    if (!aEl.attributes.getNamedItem("target")) {
      aEl.setAttribute("target", "_blank");
    }
  });
  const htmlFixed = tmpEl.body.innerHTML;
  console.log("htmlFixed", htmlFixed);
  return htmlFixed;
}
