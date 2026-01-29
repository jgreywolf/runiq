import type { IconDefinition, IconProvider } from '@runiq/core';
export declare class IconifyProvider implements IconProvider {
    id: string;
    getIcon(name: string): IconDefinition | undefined;
    getPath(): {
        d: string;
        viewBox: string;
    } | undefined;
}
export declare const iconify: IconifyProvider;
//# sourceMappingURL=index.d.ts.map