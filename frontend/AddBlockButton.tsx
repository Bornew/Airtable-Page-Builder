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
import { BlockInterface } from "./PagePreview";

interface IProps {
  selectedBlocks: BlockInterface[];
  addBlocks: Function;
  isStaticButton: boolean;
  insertIndex: number;
}

export default function AddBlockButton({
  selectedBlocks,
  addBlocks,
  isStaticButton,
  insertIndex,
}: IProps) {
  const [isShowAddButton, setShowAddButton] = useState(false);
  const handleShowAddButton = () => {
    setShowAddButton(true);
  };
  const handleHideAddButton = () => {
    setShowAddButton(false);
  };
  let message = "Add block";
  if (selectedBlocks.length > 1) {
    if (isStaticButton) {
      message = `Add ${selectedBlocks.length} blocks`;
    } else {
      message = `insert ${selectedBlocks.length} blocks`;
    }
  } else if (selectedBlocks.length === 1) {
    if (isStaticButton) {
      message = `Add 1 block`;
    } else {
      message = "insert 1 block";
    }
  }
  if (isStaticButton) {
    return (
      <Box
        width="100%"
        paddingX="20px"
        height="24px"
        backgroundColor="lightGray1"
        marginTop="16px"
      >
        <Box
          width="100%"
          height="100%"
          display="flex"
          flexDirection="row"
          alignItems="center"
          justifyContent="center"
          onClick={() => {
            addBlocks(selectedBlocks, insertIndex);
          }}
        >
          <TextButton
            onClick={() => console.log("Button clicked")}
            variant="light"
            size="small"
            icon="plus"
          >
            {message}
          </TextButton>
        </Box>
      </Box>
    );
  }
  return (
    <Box
      width="100%"
      onMouseEnter={handleShowAddButton}
      onMouseLeave={handleHideAddButton}
      paddingX="20px"
      height="18px"
      backgroundColor={isShowAddButton ? "lightGray1" : "white"}
      onClick={() => {
        addBlocks(selectedBlocks, insertIndex);
      }}
    >
      {isShowAddButton ? (
        <Box
          width="100%"
          height="100%"
          display="flex"
          flexDirection="row"
          alignItems="center"
          justifyContent="center"
        >
          <TextButton
            onClick={() => console.log("Button clicked")}
            variant="light"
            size="small"
            icon="plus"
          >
            {message}
          </TextButton>
        </Box>
      ) : (
        ""
      )}
    </Box>
  );
}
