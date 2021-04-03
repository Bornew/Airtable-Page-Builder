// import sanitizeHtml from "sanitize-html";
import React, { useEffect, useState } from "react";
import ReactDOMServer from "react-dom/server";
// import sanitizeHtml from "sanitize-html";
import MarkdownIt from "markdown-it";
const md = new MarkdownIt({
  html: true,
  linkify: true,
});

const defaultTextRender = md.renderer.rules.text;

md.renderer.rules.text = function (tokens, idx, options, env, self) {
  const token = tokens[idx];
  const matches = token.content.match(/\[(X|\s|\_|\-)\]\s(.*)/i);

  if (matches) {
    token.content = matches[2];
    return ReactDOMServer.renderToString(
      <span>
        <input type="checkbox" checked={!!matches[1].trim()} disabled />
        <label>{defaultTextRender(tokens, idx, options, env, self)}</label>
      </span>
    );
  }
  // pass token to default renderer.
  return defaultTextRender(tokens, idx, options, env, self);
};

export default function SanitizeHTML({ html }: { html: string }) {
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
  return htmlFixed;
}
