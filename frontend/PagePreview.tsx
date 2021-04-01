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
  Icon,
  Button,
} from "@airtable/blocks/ui";
import React, { useEffect, useState } from "react";
import { cursor } from "@airtable/blocks";
import { allowedUrlFieldTypes, useSettings } from "./settings/settings";
import BlockPreview from "./BlockPreview";

export default function PagePreview() {
  // const {
  //     settings: {table},
  // } = useSettings();
  let errorMessage = null;
  const base = useBase();
  useWatchable(cursor, ["selectedRecordIds", "selectedFieldIds"]);
  const activeTable = base.getTableByIdIfExists(cursor.activeTableId);
  const [blockArrays, setBlockArrays] = useState<BlockInterface[]>([]);
  const selectedFieldIds = cursor.selectedFieldIds;
  const selectedRecordIds = cursor.selectedRecordIds;

  const addBlocks = (selectedBlocks: BlockInterface[]) => {
    const newBlockArrays = blockArrays.concat(selectedBlocks);
    setBlockArrays(newBlockArrays);
  };

  useEffect(() => {
    console.log("blockArrays", blockArrays);
  }, [blockArrays]);
  return (
    <Box paddingX={4} paddingY={3} display="flex" flexDirection="column">
      <div>
        <Heading marginBottom={4}>{activeTable.name}</Heading>
        {blockArrays.map((block) => (
          <BlockPreview
            table={block.table}
            recordId={block.recordId}
            field={block.field}
          />
        ))}
      </div>
      <Box
        onClick={() => {
          if (selectedRecordIds && selectedFieldIds) {
            const selectedBlocks: BlockInterface[] = selectedRecordIds
              .map((selectedRecordId) => ({
                table: activeTable,
                recordId: selectedRecordId,
                field: activeTable.getField(selectedFieldIds[0]),
              }))
              .concat();
            addBlocks(selectedBlocks);
          } else {
            console.log("error, no selected cells");
          }
        }}
        marginTop="16px"
        width="100%"
        height="28px"
        backgroundColor="lightGray1"
        display="flex"
        flexDirection="row"
        alignItems="center"
        justifyContent="center"
      >
        <Icon
          name="plus"
          size={16}
          fillColor="hsl(0,0%,46%)"
          marginRight="4px"
        />
        <Text textColor="light">Add</Text>
      </Box>
    </Box>
  );
}
export interface BlockInterface {
  table: Table;
  recordId: string;
  field: Field;
}
