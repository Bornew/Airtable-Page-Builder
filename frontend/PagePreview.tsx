import { Table, Field } from "@airtable/blocks/models";
import {
  useBase,
  useRecordById,
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

interface IProps {
  isValid: Boolean;
}

export default function PagePreview({ isValid }: IProps) {
  let errorMessage = null;
  const base = useBase();
  useWatchable(cursor, ["selectedRecordIds", "selectedFieldIds"]);
  const activeTable = base.getTableByIdIfExists(cursor.activeTableId);
  const [blockArrays, setBlockArrays] = useState<BlockInterface[]>([]);
  const selectedFieldIds = cursor.selectedFieldIds;
  const selectedRecordIds = cursor.selectedRecordIds;

  const getSelectedBlocks = () => {
    let selectedBlocks: BlockInterface[] = [];
    if (selectedRecordIds && selectedFieldIds) {
      selectedBlocks = selectedRecordIds
        .map((selectedRecordId) => ({
          table: activeTable,
          recordId: selectedRecordId,
          field: activeTable.getField(selectedFieldIds[0]),
        }))
        .concat();
    }
    return selectedBlocks;
  };
  const addBlocks = (selectedBlocks: BlockInterface[], index: number) => {
    if (selectedBlocks.length) {
      let newBlockArrays = blockArrays;
      if (blockArrays.length === index) {
        newBlockArrays = blockArrays.concat(selectedBlocks);
      } else if (index === 0) {
        newBlockArrays = selectedBlocks.concat(blockArrays);
      } else {
        newBlockArrays.splice(index, 0, ...selectedBlocks);
        newBlockArrays = [...newBlockArrays];
      }
      setBlockArrays(newBlockArrays);
    } else {
      console.log("you have not selected anything!");
    }
  };

  const deleteBlock = (index: number) => {
    let newBlockArrays = blockArrays;
    newBlockArrays.splice(index, 1);
    newBlockArrays = [...newBlockArrays];
    setBlockArrays(newBlockArrays);
  };

  useEffect(() => {
    console.log("blockArrays", blockArrays);
  }, [blockArrays]);

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
          onClick={() => addBlocks(getSelectedBlocks(), 1)}
          icon="plus"
          variant="light"
        >
          Add Block
        </TextButton>
        <Box>
          <TextButton
            onClick={() => console.log("Button download")}
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
        {!blockArrays.length ? (
          <AddBlockButton
            selectedBlocks={getSelectedBlocks()}
            addBlocks={addBlocks}
            isStaticButton={true}
            insertIndex={0}
          />
        ) : (
          <AddBlockButton
            selectedBlocks={getSelectedBlocks()}
            addBlocks={addBlocks}
            isStaticButton={false}
            insertIndex={0}
          />
        )}
        <div>
          {/* <Heading marginBottom={4}>{activeTable.name}</Heading> */}

          {blockArrays.map((block, index) => (
            <Box display="flex" flexDirection="column" width="100%">
              <BlockPreview
                table={block.table}
                recordId={block.recordId}
                field={block.field}
                deleteBlock={deleteBlock}
                deleteIndex={index}
              />
              <AddBlockButton
                selectedBlocks={getSelectedBlocks()}
                addBlocks={addBlocks}
                isStaticButton={blockArrays.length === index + 1 ? true : false}
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
