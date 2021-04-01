import {Box, Heading, initializeBlock, useBase, useLoadable, useSettingsButton, useWatchable} from '@airtable/blocks/ui';
import React, {useEffect, useState} from 'react';
import {cursor} from "@airtable/blocks";
import {useSettings} from './settings/settings';
import SettingsForm from './settings/SettingsForm';
import { viewport } from "@airtable/blocks";
import {TextButton, Text} from "@airtable/blocks/ui";
import PagePreview from './PagePreview';


function PagePreviewBlock() {
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    useSettingsButton(() => setIsSettingsOpen(!isSettingsOpen));
    const [selectedRecordId, setSelectedRecordId] = useState('');
    const [selectedFieldId, setSelectedFieldId] = useState('');
    useLoadable(cursor);
    useWatchable(cursor, ['selectedRecordIds', 'selectedFieldIds']);
    const base = useBase();
    const activeTable = base.getTableByIdIfExists(cursor.activeTableId);
    const {isValid} = useSettings();
    if (!isValid && !isSettingsOpen) {
        setIsSettingsOpen(true)
    }
    useEffect(() => {
        // Display the settings form if the settings aren't valid.
        
        if (!isValid && !isSettingsOpen) {
            setIsSettingsOpen(true);
            viewport.enterFullscreenIfPossible();
        }
    }, [isValid, isSettingsOpen]);
    return (
        <Box
            position="absolute"
            top={0}
            bottom={0}
            left={0}
            right={0}
            display="flex"
            flexDirection="column"
        >
            <Box display="flex" flexDirection="row" justifyContent="space-between" alignContent="center" paddingX={3} paddingY={3}>
                <TextButton onClick={() => console.log("Button plus")} icon="plus" variant="light">
                    Add Block
                </TextButton>
                <Box>
                     <TextButton
                        onClick={() => console.log("Button download")}
                        icon="share1"
                        marginRight={3}
                        variant="light"
                    >Export</TextButton>
                    <TextButton
                        onClick={() => console.log("Button overflow")}
                        icon="overflow"
                        aria-label="overflow"
                        variant="light"
                    />
                </Box>
            </Box>
            <Box paddingX={4} paddingY={3} display="flex" flexDirection="column">
                {isValid? <PagePreview/>
                : 
                <div>
                    <Heading marginBottom={1}>Untitled</Heading>
                    <Text></Text>

                </div>}
            </Box>
            {isSettingsOpen ? (
                <SettingsForm setIsSettingsOpen={setIsSettingsOpen}/>
            ) : null}
            
        </Box>
    )
}

initializeBlock(() => <PagePreviewBlock />);
