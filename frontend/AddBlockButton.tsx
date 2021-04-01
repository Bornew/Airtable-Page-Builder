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
}

export default function AddBlockButton({
  selectedBlocks,
  addBlocks,
  isStaticButton,
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
    message = `insert ${selectedBlocks.length} blocks`;
  } else if (selectedBlocks.length === 1) {
    message = "insert 1 block";
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
            addBlocks(selectedBlocks);
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
    >
      {isShowAddButton ? (
        <Box
          width="100%"
          height="100%"
          display="flex"
          flexDirection="row"
          alignItems="center"
          justifyContent="center"
          onClick={() => {
            addBlocks(selectedBlocks);
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
      ) : (
        ""
      )}
    </Box>
  );
}
