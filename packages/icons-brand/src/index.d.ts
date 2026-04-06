import type { IconDefinition, IconProvider } from '@runiq/core';
export declare class BrandIconProvider implements IconProvider {
    id: string;
    getIcon(name: string): IconDefinition | undefined;
    getPath(): {
        d: string;
        viewBox: string;
    } | undefined;
}
export declare const brandIcons: BrandIconProvider;
//# sourceMappingURL=index.d.ts.map