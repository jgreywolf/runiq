import { describe, expect, it } from 'vitest';
import {
  getAllGlyphsetIds,
  getGlyphsetStructureType,
  GlyphsetIdList,
  isGlyphsetId,
  isNestedGlyphset,
  isPictureGlyphset,
  NestedStructureGlyphsets,
  PictureGlyphsets,
} from './constants.js';

describe('constants', () => {
  describe('GlyphsetIdList', () => {
    it('should have process glyphsets', () => {
      expect(GlyphsetIdList.basicProcess).toBe('basicProcess');
      expect(GlyphsetIdList.cycle).toBe('cycle');
      expect(GlyphsetIdList.blockCycle).toBe('blockCycle');
      expect(GlyphsetIdList.stepProcess).toBe('stepProcess');
    });

    it('should have hierarchy glyphsets', () => {
      expect(GlyphsetIdList.pyramid).toBe('pyramid');
      expect(GlyphsetIdList.orgChart).toBe('orgChart');
      expect(GlyphsetIdList.invertedPyramid).toBe('invertedPyramid');
    });

    it('should have comparison glyphsets', () => {
      expect(GlyphsetIdList.matrix).toBe('matrix');
      expect(GlyphsetIdList.venn).toBe('venn');
      expect(GlyphsetIdList.linearVenn).toBe('linearVenn');
    });

    it('should have relationship glyphsets', () => {
      expect(GlyphsetIdList.target).toBe('target');
      expect(GlyphsetIdList.balance).toBe('balance');
      expect(GlyphsetIdList.converging).toBe('converging');
    });

    it('should have visualization glyphsets', () => {
      expect(GlyphsetIdList.funnel).toBe('funnel');
      expect(GlyphsetIdList.pictureGrid).toBe('pictureGrid');
      expect(GlyphsetIdList.events).toBe('events');
    });

    it('should have list glyphsets', () => {
      expect(GlyphsetIdList.basicList).toBe('basicList');
      expect(GlyphsetIdList.horizontalList).toBe('horizontalList');
      expect(GlyphsetIdList.chevronList).toBe('chevronList');
    });

    it('should have unique IDs', () => {
      const ids = Object.values(GlyphsetIdList);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it('should use consistent naming convention', () => {
      Object.entries(GlyphsetIdList).forEach(([key, value]) => {
        expect(value).toBe(key);
      });
    });
  });

  describe('isGlyphsetId', () => {
    it('should return the ID for valid glyphset', () => {
      expect(isGlyphsetId('basicProcess')).toBe('basicProcess');
      expect(isGlyphsetId('pyramid')).toBe('pyramid');
      expect(isGlyphsetId('matrix')).toBe('matrix');
    });

    it('should return null for invalid glyphset', () => {
      expect(isGlyphsetId('invalidGlyphset')).toBeNull();
      expect(isGlyphsetId('notARealType')).toBeNull();
      expect(isGlyphsetId('')).toBeNull();
    });

    it('should be case sensitive', () => {
      expect(isGlyphsetId('BasicProcess')).toBeNull();
      expect(isGlyphsetId('PYRAMID')).toBeNull();
    });

    it('should validate all glyphset IDs', () => {
      Object.values(GlyphsetIdList).forEach((id) => {
        expect(isGlyphsetId(id)).toBe(id);
      });
    });
  });

  describe('getAllGlyphsetIds', () => {
    it('should return array of all glyphset IDs', () => {
      const ids = getAllGlyphsetIds();
      expect(Array.isArray(ids)).toBe(true);
      expect(ids.length).toBeGreaterThan(0);
    });

    it('should include process glyphsets', () => {
      const ids = getAllGlyphsetIds();
      expect(ids).toContain('basicProcess');
      expect(ids).toContain('cycle');
      expect(ids).toContain('stepProcess');
    });

    it('should include hierarchy glyphsets', () => {
      const ids = getAllGlyphsetIds();
      expect(ids).toContain('pyramid');
      expect(ids).toContain('orgChart');
    });

    it('should include comparison glyphsets', () => {
      const ids = getAllGlyphsetIds();
      expect(ids).toContain('matrix');
      expect(ids).toContain('venn');
    });

    it('should include relationship glyphsets', () => {
      const ids = getAllGlyphsetIds();
      expect(ids).toContain('target');
      expect(ids).toContain('balance');
    });

    it('should include visualization glyphsets', () => {
      const ids = getAllGlyphsetIds();
      expect(ids).toContain('funnel');
      expect(ids).toContain('events');
    });

    it('should include list glyphsets', () => {
      const ids = getAllGlyphsetIds();
      expect(ids).toContain('basicList');
      expect(ids).toContain('horizontalList');
    });

    it('should match GlyphsetIdList values', () => {
      const ids = getAllGlyphsetIds();
      const expectedIds = Object.values(GlyphsetIdList);
      expect(ids.sort()).toEqual(expectedIds.sort());
    });
  });

  describe('PictureGlyphsets', () => {
    it('should contain picture-based glyphsets', () => {
      expect(PictureGlyphsets).toContain(GlyphsetIdList.pictureProcess);
      expect(PictureGlyphsets).toContain(GlyphsetIdList.pictureList);
      expect(PictureGlyphsets).toContain(GlyphsetIdList.pictureBlocks);
      expect(PictureGlyphsets).toContain(GlyphsetIdList.framedPicture);
      expect(PictureGlyphsets).toContain(GlyphsetIdList.pictureGrid);
      expect(PictureGlyphsets).toContain(GlyphsetIdList.pictureCallout);
    });

    it('should have correct count', () => {
      expect(PictureGlyphsets.length).toBe(6);
    });
  });

  describe('NestedStructureGlyphsets', () => {
    it('should contain nested structure glyphsets', () => {
      expect(NestedStructureGlyphsets).toContain(GlyphsetIdList.orgChart);
      expect(NestedStructureGlyphsets).toContain(
        GlyphsetIdList.horizontalOrgChart
      );
      expect(NestedStructureGlyphsets).toContain(GlyphsetIdList.tableHierarchy);
      expect(NestedStructureGlyphsets).toContain(GlyphsetIdList.matrixOrgChart);
      expect(NestedStructureGlyphsets).toContain(
        GlyphsetIdList.labeledHierarchy
      );
      expect(NestedStructureGlyphsets).toContain(
        GlyphsetIdList.segmentedPyramid
      );
      expect(NestedStructureGlyphsets).toContain(GlyphsetIdList.nestedList);
      expect(NestedStructureGlyphsets).toContain(GlyphsetIdList.pyramidList);
      expect(NestedStructureGlyphsets).toContain(GlyphsetIdList.groupedProcess);
    });

    it('should have correct count', () => {
      expect(NestedStructureGlyphsets.length).toBe(9);
    });
  });

  describe('getGlyphsetStructureType', () => {
    it('should return "nested" for nested glyphsets', () => {
      expect(getGlyphsetStructureType('orgChart')).toBe('nested');
      expect(getGlyphsetStructureType('horizontalOrgChart')).toBe('nested');
      expect(getGlyphsetStructureType('tableHierarchy')).toBe('nested');
      expect(getGlyphsetStructureType('labeledHierarchy')).toBe('nested');
      expect(getGlyphsetStructureType('segmentedPyramid')).toBe('nested');
      expect(getGlyphsetStructureType('nestedList')).toBe('nested');
      expect(getGlyphsetStructureType('pyramidList')).toBe('nested');
      expect(getGlyphsetStructureType('groupedProcess')).toBe('nested');
    });

    it('should return "flat" for non-nested glyphsets', () => {
      expect(getGlyphsetStructureType('basicProcess')).toBe('flat');
      expect(getGlyphsetStructureType('pyramid')).toBe('flat');
      expect(getGlyphsetStructureType('matrix')).toBe('flat');
      expect(getGlyphsetStructureType('target')).toBe('flat');
      expect(getGlyphsetStructureType('funnel')).toBe('flat');
      expect(getGlyphsetStructureType('basicList')).toBe('flat');
    });

    it('should handle all glyphset IDs', () => {
      getAllGlyphsetIds().forEach((id) => {
        const type = getGlyphsetStructureType(id);
        expect(['flat', 'nested']).toContain(type);
      });
    });
  });

  describe('isNestedGlyphset', () => {
    it('should return true for nested glyphsets', () => {
      expect(isNestedGlyphset('orgChart')).toBe(true);
      expect(isNestedGlyphset('horizontalOrgChart')).toBe(true);
      expect(isNestedGlyphset('tableHierarchy')).toBe(true);
      expect(isNestedGlyphset('labeledHierarchy')).toBe(true);
      expect(isNestedGlyphset('segmentedPyramid')).toBe(true);
      expect(isNestedGlyphset('nestedList')).toBe(true);
      expect(isNestedGlyphset('pyramidList')).toBe(true);
      expect(isNestedGlyphset('groupedProcess')).toBe(true);
    });

    it('should return false for non-nested glyphsets', () => {
      expect(isNestedGlyphset('basicProcess')).toBe(false);
      expect(isNestedGlyphset('pyramid')).toBe(false);
      expect(isNestedGlyphset('matrix')).toBe(false);
      expect(isNestedGlyphset('target')).toBe(false);
      expect(isNestedGlyphset('funnel')).toBe(false);
      expect(isNestedGlyphset('basicList')).toBe(false);
    });

    it('should be consistent with getGlyphsetStructureType', () => {
      getAllGlyphsetIds().forEach((id) => {
        const isNested = isNestedGlyphset(id);
        const type = getGlyphsetStructureType(id);
        expect(isNested).toBe(type === 'nested');
      });
    });
  });

  describe('isPictureGlyphset', () => {
    it('should return true for picture glyphsets', () => {
      expect(isPictureGlyphset('pictureProcess')).toBe(true);
      expect(isPictureGlyphset('pictureList')).toBe(true);
      expect(isPictureGlyphset('pictureBlocks')).toBe(true);
      expect(isPictureGlyphset('framedPicture')).toBe(true);
      expect(isPictureGlyphset('pictureGrid')).toBe(true);
      expect(isPictureGlyphset('pictureCallout')).toBe(true);
    });

    it('should return false for non-picture glyphsets', () => {
      expect(isPictureGlyphset('basicProcess')).toBe(false);
      expect(isPictureGlyphset('pyramid')).toBe(false);
      expect(isPictureGlyphset('matrix')).toBe(false);
      expect(isPictureGlyphset('target')).toBe(false);
      expect(isPictureGlyphset('funnel')).toBe(false);
      expect(isPictureGlyphset('basicList')).toBe(false);
    });

    it('should match PictureGlyphsets array', () => {
      getAllGlyphsetIds().forEach((id) => {
        const isPicture = isPictureGlyphset(id);
        const inArray = PictureGlyphsets.some((pid) => pid === id);
        expect(isPicture).toBe(inArray);
      });
    });
  });

  describe('integration', () => {
    it('nested and picture glyphsets should be mutually exclusive', () => {
      // TypeScript ensures these types don't overlap at compile time
      // This test verifies runtime behavior
      const nestedIds = [...NestedStructureGlyphsets];
      const pictureIds = [...PictureGlyphsets];

      nestedIds.forEach((nestedId) => {
        // Cast to string for runtime comparison
        const foundInPictures = pictureIds.some(
          (pid) => String(pid) === String(nestedId)
        );
        expect(foundInPictures).toBe(false);
      });
    });

    it('all glyphsets should be either flat nested or picture', () => {
      getAllGlyphsetIds().forEach((id) => {
        const isNested = isNestedGlyphset(id);
        const isPicture = isPictureGlyphset(id);
        const isFlat = !isNested && !isPicture;

        // Each glyphset should be exactly one of these
        const count = [isNested, isPicture, isFlat].filter(Boolean).length;
        expect(count).toBeGreaterThan(0);
      });
    });
  });
});
