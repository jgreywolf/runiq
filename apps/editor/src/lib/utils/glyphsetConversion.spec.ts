import { describe, expect, it } from 'vitest';
import { convertGlyphset, getGlyphsetKeywords } from './glyphsetConversion';
import { areGlyphsetsCompatible } from './glyphsetConversion/compatibility';
//import { flattenSegmentedPyramid } from './glyphsetConversion/levelConversions';

describe('glyphsetConversion', () => {
	describe('getGlyphsetKeywords', () => {
		it('should return correct primary keyword', () => {
			expect(getGlyphsetKeywords('basicProcess')[0]).toBe('item');
			expect(getGlyphsetKeywords('pyramid')[0]).toBe('level');
			expect(getGlyphsetKeywords('pictureGrid')[0]).toBe('image');
			expect(getGlyphsetKeywords('labeledHierarchy')[0]).toBe('root');
			expect(getGlyphsetKeywords('orgChart')[0]).toBe('person');
			expect(getGlyphsetKeywords('teamHierarchy')[0]).toBe('team');
			expect(getGlyphsetKeywords('cluster')[0]).toBe('center');
		});

		// it('should return "item" for unknown types', () => {
		// 	expect(getGlyphsetKeywords('unknownType')).toBe('item');
		// });
	});

	describe('areGlyphsetsCompatible', () => {
		it('should allow same type conversion', () => {
			const result = areGlyphsetsCompatible('pyramid', 'pyramid');
			expect(result.compatible).toBe(true);
		});

		it('should allow conversion within same group', () => {
			const result = areGlyphsetsCompatible('pyramid', 'invertedPyramid');
			expect(result.compatible).toBe(true);
		});

		// it('should block equation conversions', () => {
		// 	const result = areGlyphsetsCompatible('equation', 'basicProcess');
		// 	expect(result.compatible).toBe(false);
		// 	expect(result.reason).toContain('special structure');
		// });

		// it('should warn when converting from balance', () => {
		// 	const result = areGlyphsetsCompatible('balance', 'basicProcess');
		// 	expect(result.compatible).toBe(true);
		// 	expect(result.reason).toContain('2 sides');
		// });

		it('should allow list conversions', () => {
			const result = areGlyphsetsCompatible('basicList', 'chevronList');
			expect(result.compatible).toBe(true);
		});
	});

	describe('convertGlyphset', () => {
		it('should convert pyramid to invertedPyramid', () => {
			const code = `glyphset pyramid "Test" {
  theme ocean
  level "Top"
  level "Middle"
  level "Bottom"
}`;
			const result = convertGlyphset(code, 'invertedPyramid');

			expect(result.success).toBe(true);
			expect(result.newCode).toContain('glyphset invertedPyramid');
			expect(result.newCode).toContain('level "Top"');
			expect(result.newCode).toContain('level "Middle"');
			expect(result.newCode).toContain('level "Bottom"');
		});

		it('should convert funnel levels to basicList items', () => {
			const code = `glyphset funnel "Sales" {
  theme ocean
  level "Awareness"
  level "Interest"
  level "Decision"
}`;
			const result = convertGlyphset(code, 'basicList');

			expect(result.success).toBe(true);
			expect(result.newCode).toContain('glyphset basicList');
			expect(result.newCode).toContain('item "Awareness"');
			expect(result.newCode).toContain('item "Interest"');
			expect(result.newCode).toContain('item "Decision"');
		});

		it('should preserve theme and parameters', () => {
			const code = `glyphset pyramid "Test" {
  theme professional
  direction "up"
  level "A"
  level "B"
}`;
			const result = convertGlyphset(code, 'invertedPyramid');

			expect(result.success).toBe(true);
			expect(result.newCode).toContain('theme professional');
			expect(result.newCode).toContain('direction "up"');
		});

		it('should convert interconnected nodes to items', () => {
			const code = `glyphset interconnected "Network" {
  node "Server A"
  node "Server B"
  node "Server C"
}`;
			const result = convertGlyphset(code, 'basicList');

			expect(result.success).toBe(true);
			expect(result.newCode).toContain('item "Server A"');
			expect(result.newCode).toContain('item "Server B"');
		});

		it('should preserve comments', () => {
			const code = `glyphset pyramid "Test" {
  // This is a comment
  level "Top"
  level "Bottom"
}`;
			const result = convertGlyphset(code, 'invertedPyramid');

			expect(result.success).toBe(true);
			expect(result.newCode).toContain('// This is a comment');
		});

		it('should convert to pictureProcess with image URLs', () => {
			const code = `glyphset basicList "Test" {
  theme vibrant
  item "Awareness"
  item "Interest"
  item "Decision"
}`;
			const result = convertGlyphset(code, 'pictureProcess');

			expect(result.success).toBe(true);
			expect(result.newCode).toContain('glyphset pictureProcess');
			expect(result.newCode).toContain('image "https://i.pravatar.cc/200?img=1" label "Awareness"');
			expect(result.newCode).toContain('image "https://i.pravatar.cc/200?img=2" label "Interest"');
			expect(result.newCode).toContain('image "https://i.pravatar.cc/200?img=3" label "Decision"');
		});

		it('should convert from pictureProcess extracting labels', () => {
			const code = `glyphset pictureProcess "Baking" {
  theme colorful
  image "https://i.pravatar.cc/200?img=0" label "Gather Ingredients"
  image "https://i.pravatar.cc/200?img=1" label "Mix Thoroughly"
  image "https://i.pravatar.cc/200?img=2" label "Bake at 350°F"
}`;
			const result = convertGlyphset(code, 'basicList');

			expect(result.success).toBe(true);
			expect(result.newCode).toContain('glyphset basicList');
			expect(result.newCode).toContain('item "Gather Ingredients"');
			expect(result.newCode).toContain('item "Mix Thoroughly"');
			expect(result.newCode).toContain('item "Bake at 350°F"');
			expect(result.newCode).not.toContain('image "https://');
		});

		it('should convert funnel to pictureProcess', () => {
			const code = `glyphset funnel "Sales" {
  level "Awareness"
  level "Interest"
}`;
			const result = convertGlyphset(code, 'pictureProcess');

			expect(result.success).toBe(true);
			expect(result.newCode).toContain('image "https://i.pravatar.cc/200?img=0" label "Awareness"');
			expect(result.newCode).toContain('image "https://i.pravatar.cc/200?img=1" label "Interest"');
		});

		it('should convert to detailedProcess adding pipe separator', () => {
			const code = `glyphset basicList "Process" {
  theme vibrant
  item "Research"
  item "Design"
  item "Build"
}`;
			const result = convertGlyphset(code, 'detailedProcess');

			expect(result.success).toBe(true);
			expect(result.newCode).toContain('glyphset detailedProcess');
			expect(result.newCode).toContain('item "Research | "');
			expect(result.newCode).toContain('item "Design | "');
			expect(result.newCode).toContain('item "Build | "');
		});

		it('should preserve existing pipe separators in detailedProcess', () => {
			const code = `glyphset detailedProcess "Test" {
  item "Step 1 | Substep A"
  item "Step 2 | Substep B"
}`;
			const result = convertGlyphset(code, 'detailedProcess');

			expect(result.success).toBe(true);
			expect(result.newCode).toContain('item "Step 1 | Substep A"');
			expect(result.newCode).toContain('item "Step 2 | Substep B"');
		});

		it('should handle detailedProcess to pictureProcess conversion', () => {
			const code = `glyphset detailedProcess "Workflow" {
  item "Plan | Research | Strategy"
  item "Execute | Build | Test"
}`;
			const result = convertGlyphset(code, 'pictureProcess');

			expect(result.success).toBe(true);
			expect(result.newCode).toContain(
				'image "https://i.pravatar.cc/200?img=0" label "Plan | Research | Strategy"'
			);
			expect(result.newCode).toContain(
				'image "https://i.pravatar.cc/200?img=1" label "Execute | Build | Test"'
			);
		});

		it('should handle pictureProcess to detailedProcess conversion', () => {
			const code = `glyphset pictureProcess "Steps" {
  image "https://i.pravatar.cc/200?img=11" label "Design"
  image "https://i.pravatar.cc/200?img=12" label "Build"
}`;
			const result = convertGlyphset(code, 'detailedProcess');

			expect(result.success).toBe(true);
			expect(result.newCode).toContain('glyphset detailedProcess');
			expect(result.newCode).toContain('item "Design | "');
			expect(result.newCode).toContain('item "Build | "');
		});

		it('should successfully convert groupedProcess via specialized function', () => {
			const code = `glyphset groupedProcess "Test" {
  group "Team A" {
    item "Task 1"
  }
  mergePoint "Done"
}`;
			const result = convertGlyphset(code, 'basicProcess');

			expect(result.success).toBe(true);
			expect(result.newCode).toContain('glyphset basicProcess');
			expect(result.newCode).toContain('item "Task 1"');
			expect(result.newCode).not.toContain('group');
			expect(result.newCode).not.toContain('mergePoint');
		});
	});
});
