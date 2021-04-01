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
  const addBlocks = (selectedBlocks: BlockInterface[]) => {
    if (selectedBlocks.length) {
      const newBlockArrays = blockArrays.concat(selectedBlocks);
      setBlockArrays(newBlockArrays);
    } else {
      console.log("you have not selected anything!");
    }
  };
  useEffect(() => {
    console.log("blockArrays", blockArrays);
  }, [blockArrays]);

  const Toolbar = () => {
    return (
      <Box
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
        alignContent="center"
        paddingX="2vw"
        paddingY={3}
        width="100%"
      >
        <TextButton
          onClick={() => addBlocks(getSelectedBlocks())}
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
    return (
      <div>
        <Toolbar />
      </div>
    );
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
          />
        ) : (
          <AddBlockButton
            selectedBlocks={getSelectedBlocks()}
            addBlocks={addBlocks}
            isStaticButton={false}
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
              />
              <AddBlockButton
                selectedBlocks={getSelectedBlocks()}
                addBlocks={addBlocks}
                isStaticButton={blockArrays.length === index + 1 ? true : false}
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
