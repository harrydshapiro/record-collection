import { snakeCase } from 'lodash';
import pluralize from 'pluralize';
import { DefaultNamingStrategy, NamingStrategyInterface, Table } from 'typeorm';

export class SnakeCaseNamingStrategy extends DefaultNamingStrategy implements NamingStrategyInterface {
    tableName(className: string, customName: string): string {
        return customName ? customName : pluralize(snakeCase(className));
    }

    columnName(propertyName: string, customName: string | undefined, embeddedPrefixes: string[]) {
        return snakeCase(embeddedPrefixes.concat('').join('_')) + (customName ? customName : snakeCase(propertyName));
    }

    joinColumnName(relationName: string, referencedColumnName = 'id') {
        return `${pluralize(snakeCase(relationName), 1)}_${referencedColumnName}`;
    }

    primaryKeyName(tableOrName: Table | string) {
        const tableName = typeof tableOrName === 'string' ? tableOrName : tableOrName.name;
        return `pk_${pluralize(snakeCase(tableName))}`;
    }

    indexName(tableOrName: Table | string, columns: string[]) {
        const tableName = typeof tableOrName === 'string' ? tableOrName : tableOrName.name;

        return `idx_${tableName}_on_${columns.sort().join('_')}`;
    }

    uniqueConstraintName(tableOrName: Table | string, columns: string[]) {
        const tableName = typeof tableOrName === 'string' ? tableOrName : tableOrName.name;

        return `uq_${tableName}_on_${columns.sort().join('_')}`;
    }
}
