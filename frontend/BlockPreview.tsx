import { Field, Table } from "@airtable/blocks/models";
import {
  useRecordById,
  Text,
  Box,
  Button,
  Icon,
  TextButton,
  expandRecord,
  loadCSSFromString,
} from "@airtable/blocks/ui";
import { githubStyle } from "./MarkdownPreviewStyle";
import React, { useEffect, useState } from "react";
import ReactDOMServer from "react-dom/server";
// import sanitizeHtml from "sanitize-html";
import MarkdownIt from "markdown-it";
import { useSettings } from "./settings/settings";
import SanitizeHTML from "./sanitizeHTML";
import { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";

loadCSSFromString(githubStyle);

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
        <ShowHTML html={SanitizeHTML({ html })} />
      </Box>
    </Box>
  );
}

function ShowHTML({ html }: { html: string }) {
  return (
    <Box>
      <div dangerouslySetInnerHTML={{ __html: html }}></div>
    </Box>
  );
}
