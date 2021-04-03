import { Table, Field, Record } from "@airtable/blocks/models";
import {
  useBase,
  useRecordById,
  useRecords,
  useLoadable,
  useSettingsButton,
  useWatchable,
  Box,
  Text,
  Heading,
  TextButton,
  Icon,
  Button,
} from "@airtable/blocks/ui";
import React, { useEffect, useState } from "react";
import { cursor } from "@airtable/blocks";
import { allowedUrlFieldTypes, useSettings } from "./settings/settings";
import BlockPreview from "./BlockPreview";
import AddBlockButton from "./AddBlockButton";
import ExportHTML from "./exportHTML";
import SanitizeHTML from "./sanitizeHTML";
import jsPDF from "jspdf";

interface IProps {
  isValid: Boolean;
}

function getSelectedBlocks(
  activeTable: Table,
  selectedRecordIds: string[],
  selectedFieldIds: string[]
) {
  let selectedBlocks: BlockInterface[] = [];

  if (selectedRecordIds && selectedFieldIds) {
    for (let selectedRecordId of selectedRecordIds) {
      for (let selectedFieldId of selectedFieldIds) {
        selectedBlocks.push({
          table: activeTable,
          recordId: selectedRecordId,
          field: activeTable.getField(selectedFieldId),
        });
        console.log(selectedRecordId);
      }
    }
  }
  return selectedBlocks;
}

export async function exportBlocks(
  isHTML: boolean,
  blocksArray: BlockInterface[]
) {
  let htmlPromise = "";
  for (let block of blocksArray) {
    const table = block.table;
    const field = block.field;
    const recordId = block.recordId;
    const queryResult = await table.selectRecordsAsync();
    const record = queryResult.getRecordById(recordId);
    let html = (record.getCellValue(field) || "").toString();
    isHTML ? (html = SanitizeHTML({ html })) : html;
    htmlPromise += html;
  }
  Promise.resolve(htmlPromise).then((value) => {
    console.log(value);
    isHTML
      ? downloadFile(value, "notes.html")
      : downloadFile(value, "notes.md");
  });
  return htmlPromise;
}

export const printFile = (html) => {
  //   new jsPDF("p", "mm", "a4");
  //   pdf.text(html, 1, 1);
  //   pdf.save("pdf");
  //   window.print();
};

export const downloadFile = (html, fileName) => {
  var eleLink = document.createElement("a");
  eleLink.download = fileName;
  eleLink.style.display = "none";
  // 字符内容转变成blob地址
  var blob = new Blob([html]);
  eleLink.href = URL.createObjectURL(blob);
  // 触发点击
  document.body.appendChild(eleLink);
  eleLink.click();
  // 然后移除
  document.body.removeChild(eleLink);
};

export default function PagePreview({ isValid }: IProps) {
  let errorMessage = null;
  const base = useBase();
  useWatchable(cursor, ["selectedRecordIds", "selectedFieldIds"]);
  const activeTable = base.getTableByIdIfExists(cursor.activeTableId);
  const [blocksArray, setBlocksArray] = useState<BlockInterface[]>([]);
  const selectedFieldIds = cursor.selectedFieldIds;
  const selectedRecordIds = cursor.selectedRecordIds;
  const addBlocks = (selectedBlocks: BlockInterface[], index: number) => {
    if (selectedBlocks.length) {
      let newBlocksArray = blocksArray;
      if (blocksArray.length === index) {
        newBlocksArray = blocksArray.concat(selectedBlocks);
      } else if (index === 0) {
        newBlocksArray = selectedBlocks.concat(blocksArray);
      } else {
        newBlocksArray.splice(index, 0, ...selectedBlocks);
        newBlocksArray = [...newBlocksArray];
      }
      setBlocksArray(newBlocksArray);
    } else {
      console.log("you have not selected anything!");
    }
  };

  const deleteBlock = (index: number) => {
    let newBlocksArray = blocksArray;
    newBlocksArray.splice(index, 1);
    newBlocksArray = [...newBlocksArray];
    setBlocksArray(newBlocksArray);
  };

  useEffect(() => {}, [blocksArray]);

  const Toolbar = () => {
    return (
      <Box
        position="sticky"
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        paddingX="2vw"
        paddingY={3}
        width="100%"
        height="20px"
      >
        <TextButton
          onClick={() =>
            addBlocks(
              getSelectedBlocks(
                activeTable,
                selectedRecordIds,
                selectedFieldIds
              ),
              1
            )
          }
          icon="plus"
          variant="light"
        >
          Add Block
        </TextButton>
        <Box>
          <TextButton
            onClick={() => {
              ExportHTML(exportBlocks(true, blocksArray));
            }}
            icon="share1"
            marginRight={3}
            variant="light"
          >
            Export
          </TextButton>
          <TextButton
            onClick={() => console.log("Button overflow")}
            icon="overflow"
            aria-label="overflow"
            variant="light"
          />
        </Box>
      </Box>
    );
  };
  if (!isValid) {
    return <Toolbar />;
  }
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      width="100vw"
    >
      <Toolbar />
      <Box
        paddingX="6vw"
        paddingBottom={3}
        display="flex"
        flexDirection="column"
        width="100%"
      >
        {!blocksArray.length ? (
          <AddBlockButton
            selectedBlocks={getSelectedBlocks(
              activeTable,
              selectedRecordIds,
              selectedFieldIds
            )}
            addBlocks={addBlocks}
            isStaticButton={true}
            insertIndex={0}
          />
        ) : (
          <AddBlockButton
            selectedBlocks={getSelectedBlocks(
              activeTable,
              selectedRecordIds,
              selectedFieldIds
            )}
            addBlocks={addBlocks}
            isStaticButton={false}
            insertIndex={0}
          />
        )}
        <div>
          {blocksArray.map((block, index) => (
            <Box display="flex" flexDirection="column" width="100%">
              <BlockPreview
                table={block.table}
                recordId={block.recordId}
                field={block.field}
                deleteBlock={deleteBlock}
                deleteIndex={index}
              />
              <AddBlockButton
                selectedBlocks={getSelectedBlocks(
                  activeTable,
                  selectedRecordIds,
                  selectedFieldIds
                )}
                addBlocks={addBlocks}
                isStaticButton={blocksArray.length === index + 1 ? true : false}
                insertIndex={index + 1}
              />
            </Box>
          ))}
        </div>
      </Box>
    </Box>
  );
}
export interface BlockInterface {
  table: Table;
  recordId: string;
  field: Field;
}
