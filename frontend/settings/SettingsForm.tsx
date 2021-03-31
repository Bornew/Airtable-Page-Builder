import PropTypes from 'prop-types';
import React from 'react';
import {
    useGlobalConfig,
    Box,
    Dialog,
    Button,
    FieldPickerSynced,
    FormField,
    Heading,
    Switch,
    TablePickerSynced,
    Text,
} from '@airtable/blocks/ui';

import {useSettings, ConfigKeys, allowedUrlFieldTypes} from './settings';

function SettingsForm({
    setIsSettingsOpen
}){
    const globalConfig = useGlobalConfig();
    const {
        isValid,
        message,
        settings: {table, showFullWidth},
    } = useSettings();

    return(
       <Dialog onClose={() => setIsSettingsOpen(false)} width="420px" padding={4} paddingBottom={2}>
          <Dialog.CloseButton />
          <Heading marginBottom={3}>Settings</Heading>
          <FormField label="Table">
              <TablePickerSynced globalConfigKey={ConfigKeys.TABLE_ID} />
              <Text paddingY={1} textColor="light">{message}</Text> 
          </FormField>
          
          <Box display="flex" flex="none" padding={3} borderTop="thick">
                <Box
                    flex="auto"
                    display="flex"
                    alignItems="center"
                    justifyContent="flex-end"
                    paddingRight={2}
                >
                    <Text textColor="light">{message}</Text>
                </Box>
                <Button
                    disabled={!isValid}
                    size="large"
                    variant="primary"
                    onClick={() => setIsSettingsOpen(false)}
                >
                    Done
                </Button>
            </Box>
        </Dialog>
    )

}
SettingsForm.propTypes = {
    setIsSettingsOpen: PropTypes.func.isRequired,
};

export default SettingsForm;