import { Field, Table } from "@airtable/blocks/models";
import {
  useRecordById,
  Text,
  Box,
  Button,
  Icon,
  TextButton,
  expandRecord,
} from "@airtable/blocks/ui";
import React, { useEffect, useState } from "react";
import ReactDOMServer from "react-dom/server";
// import sanitizeHtml from "sanitize-html";
import MarkdownIt from "markdown-it";
import { useSettings } from "./settings/settings";

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
        <input type="checkbox" checked={matches[1].trim()} disabled />
        <label>{defaultTextRender(tokens, idx, options, env, self)}</label>
      </span>
    );
  }
  // pass token to default renderer.
  return defaultTextRender(tokens, idx, options, env, self);
};

export default function BlockPreview(props: {
  table: Table;
  recordId: string;
  field: Field;
  deleteBlock: Function;
  deleteIndex: number;
}) {
  const { table, recordId, field, deleteBlock, deleteIndex } = props;
  const [isHover, setHover] = useState(false);

  const record = useRecordById(table, recordId, { fields: [field] });
  if (!record) {
    console.log("no Record");
    return <p>"Error: Record not found."</p>;
  }
  const html = (record.getCellValue(field) || "").toString();
  console.log(html);
  const handleMouseEnter = () => {
    setHover(true);
  };
  const handleMouseLeave = () => {
    setHover(false);
  };

  return (
    <Box
      display="flex"
      flexDirection="row"
      width="100%"
      paddingX="1px"
      paddingY="1px"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      backgroundColor={isHover ? "#E3ECFD" : "white"}
      minHeight="16px"
    >
      {isHover ? (
        <Box display="flex" flexDirection="row" width="16px" height="auto">
          <TextButton
            onClick={() => console.log("Button clicked")}
            variant="light"
            icon="dragHandle"
            size="large"
            aria-label="dragHandle"
          />
        </Box>
      ) : (
        <Box width="16px" height="auto"></Box>
      )}
      <Box width="100%">
        {isHover ? (
          <Box
            width="100%"
            height="20px"
            display="flex"
            flexDirection="row-reverse"
            marginBottom="-20px"
          >
            <TextButton
              onClick={() => {
                deleteBlock(deleteIndex);
              }}
              variant="light"
              icon="x"
              size="small"
              aria-label="delete"
              marginRight="3px"
            />
            <TextButton
              onClick={() => expandRecord(record)}
              icon="overflow"
              variant="light"
              size="small"
              aria-label="expand"
              marginRight="3px"
            />
          </Box>
        ) : (
          ""
        )}

        <ShowHTML html={html} />
      </Box>
    </Box>
  );
}

function ShowHTML({ html }: { html: string }) {
  html = html
    .replace(/^(\s*)\[(X|\s|\_|\-)\]\s(.*)/gim, "$1- [$2] $3")
    .replace(/\n\[(.{1})]/g, "\\\n[$1]");

  const html2 = md.render(html);

  const domParser = new DOMParser();
  const tmpEl = domParser.parseFromString(html2, "text/html");
  const htmlFixed = tmpEl.body.innerHTML;
  console.log("htmlFixed", htmlFixed);
  return (
    <Box>
      <style>
        {`
            .contains-task-list {
                list-style: none;
                padding: 0;
            }
            .contains-task-list ul {
                padding-left: 2em;
            }
            input[type="checkbox"] {
                visibility: hidden;
                width: 0;
            }
            input[type="checkbox"] + label:before {
                border: 2px solid rgba(0,0,0,0.25);
                border-radius: 3px;
                box-sizing: border-box;
                content: "\\00a0";
                display: inline-block;
                left: -25px;
                margin: 0 .5em 0 0;
                padding: 0;
                vertical-align: bottom;
                top: 3.5px;
                width: 12px;
                height: 12px;
            }
            input[type="checkbox"]:checked + label:before {
                border: 0;
                background-color: rgb(45, 127, 249);
                background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 16 16' style='shape-rendering: geometricprecision;'%3E%3Cpath fill-rule='evenodd' fill='white' d='M5.944 12.305a1.031 1.031 0 0 0 1.433-.009l5.272-5.181A1.483 1.483 0 0 0 12.661 5a1.468 1.468 0 0 0-2.109.025L7.008 8.701a.465.465 0 0 1-.685-.01l-.587-.641A1.42 1.42 0 0 0 3.661 8a1.473 1.473 0 0 0 .017 2.106l2.266 2.199z'%3E%3C/path%3E%3C/svg%3E");
                box-sizing: border-box;
                color: rgb(119, 119, 119);
                content: "\\2713";
                text-align: center;
            }
            input[type="checkbox"]:focus + label::before {
                outline: rgb(59, 153, 252) auto 5px;
            }
            `}
      </style>
      <div dangerouslySetInnerHTML={{ __html: htmlFixed }}></div>
    </Box>
  );
}
