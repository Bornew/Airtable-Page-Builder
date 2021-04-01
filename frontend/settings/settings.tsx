import {useBase, useGlobalConfig} from '@airtable/blocks/ui';
import {Base, Field, FieldType, Table} from '@airtable/blocks/models';
import GlobalConfig from "@airtable/blocks/dist/types/src/global_config";

export const ConfigKeys = {
    TABLE_ID: 'tableId',
    SHOW_CATALOG: 'showCatalog',
    SHOW_FULLWIDTH: 'showFullWidth'

};


export const allowedUrlFieldTypes = [
    // 支持的 format，未来可以支持解析更多
    FieldType.FORMULA,
    FieldType.MULTIPLE_LOOKUP_VALUES,
    FieldType.MULTILINE_TEXT,
    FieldType.RICH_TEXT,
    FieldType.SINGLE_LINE_TEXT,
];

/**
 * Return settings from GlobalConfig with defaults, and converts them to Airtable objects.
 * @param {GlobalConfig} globalConfig
 * @param {Base} base - The base being used by the block in order to convert id's to objects
 * @returns {SettingsInterface}
 */

function getSettings(globalConfig: GlobalConfig, base: Base): SettingsInterface {
    if (typeof globalConfig.get(ConfigKeys.SHOW_CATALOG) !== "boolean") {
        globalConfig.setAsync(ConfigKeys.SHOW_CATALOG, true).then()
    }
    if (typeof globalConfig.get(ConfigKeys.SHOW_FULLWIDTH) !== "boolean") {
        globalConfig.setAsync(ConfigKeys.SHOW_FULLWIDTH, true).then()
    }
    const tableId = globalConfig.get(ConfigKeys.TABLE_ID)?.toString();
    const table = base.getTableByIdIfExists(tableId);
    const showCatalog = Boolean(globalConfig.get(ConfigKeys.SHOW_CATALOG));
    const showFullWidth = Boolean(globalConfig.get(ConfigKeys.SHOW_FULLWIDTH));
    return {
        table, showCatalog, showFullWidth
    }
}

/**
 * Wraps the settings with validation information
 * @param {SettingsInterface} settings - The object returned by getSettings
 * @returns {SettingsValidationInterface}
 */
function getSettingsValidationResult(settings: SettingsInterface): { settings: SettingsInterface, isValid: boolean, message: string | null } {
    const {table} = settings;
    let isValid = true;
    let message = null;
    if(!table) {
        isValid = false;
        message = 'Please select a table for previews';
    }
    return {
        isValid,
        message,
        settings,
    };
}

/**
 * A React hook to validate and access settings configured in SettingsForm.
 * @returns {SettingsValidationInterface}
 */
export function useSettings():SettingsValidationInterface {
    const base = useBase();
    const globalConfig = useGlobalConfig();
    const settings = getSettings(globalConfig, base);
    return getSettingsValidationResult(settings);
}

export interface SettingsValidationInterface {
    settings: SettingsInterface,
    isValid: boolean,
    message: string | null
}

export interface SettingsInterface {
    table: Table,
    showCatalog: boolean,
    showFullWidth: boolean
    // includeMarkdown: boolean, 未来需要同步的format写在这里
}

