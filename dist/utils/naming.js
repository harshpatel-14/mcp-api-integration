export function toPascalCase(str) {
    return str
        .replace(/[-_\s]+(.)?/g, (_, char) => (char ? char.toUpperCase() : ''))
        .replace(/^(.)/, (_, char) => char.toUpperCase());
}
export function toCamelCase(str) {
    return str
        .replace(/[-_\s]+(.)?/g, (_, char) => (char ? char.toUpperCase() : ''))
        .replace(/^(.)/, (_, char) => char.toLowerCase());
}
export function toKebabCase(str) {
    return str
        .replace(/([a-z])([A-Z])/g, '$1-$2')
        .replace(/[\s_]+/g, '-')
        .toLowerCase();
}
export function toSnakeCase(str) {
    return str
        .replace(/([a-z])([A-Z])/g, '$1_$2')
        .replace(/[\s-]+/g, '_')
        .toLowerCase();
}
export function pluralize(str) {
    if (str.endsWith('y')) {
        return str.slice(0, -1) + 'ies';
    }
    if (str.endsWith('s')) {
        return str + 'es';
    }
    return str + 's';
}
export function singularize(str) {
    if (str.endsWith('ies')) {
        return str.slice(0, -3) + 'y';
    }
    if (str.endsWith('ses')) {
        return str.slice(0, -2);
    }
    if (str.endsWith('s')) {
        return str.slice(0, -1);
    }
    return str;
}
//# sourceMappingURL=naming.js.map