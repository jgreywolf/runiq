import { describe, it, expect } from 'vitest';
import {
	convertGlyphset,
	areGlyphsetsCompatible,
	getPrimaryKeyword,
	getCompatibleAlternatives,
	flattenGroupedProcess,
	expandToGroupedProcess,
	flattenSegmentedPyramid,
	flattenMatrix
} from './glyphsetConversion';

describe('glyphsetConversion', () => {
	describe('getPrimaryKeyword', () => {
		it('should return correct primary keywords', () => {
			expect(getPrimaryKeyword('basicProcess')).toBe('item');
			expect(getPrimaryKeyword('pyramid')).toBe('level');
			expect(getPrimaryKeyword('balance')).toBe('side');
			expect(getPrimaryKeyword('interconnected')).toBe('node');
			expect(getPrimaryKeyword('funnel')).toBe('level');
		});

		it('should return "item" for unknown types', () => {
			expect(getPrimaryKeyword('unknownType')).toBe('item');
		});
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

		it('should block equation conversions', () => {
			const result = areGlyphsetsCompatible('equation', 'basicProcess');
			expect(result.compatible).toBe(false);
			expect(result.reason).toContain('special structure');
		});

		it('should warn when converting from balance', () => {
			const result = areGlyphsetsCompatible('balance', 'basicProcess');
			expect(result.compatible).toBe(true);
			expect(result.reason).toContain('2 sides');
		});

		it('should allow list conversions', () => {
			const result = areGlyphsetsCompatible('basicList', 'chevronList');
			expect(result.compatible).toBe(true);
		});

		it('should block groupedProcess conversions', () => {
			const result1 = areGlyphsetsCompatible('groupedProcess', 'basicProcess');
			expect(result1.compatible).toBe(false);
			expect(result1.reason).toContain('nested group blocks');

			const result2 = areGlyphsetsCompatible('basicProcess', 'groupedProcess');
			expect(result2.compatible).toBe(false);
			expect(result2.reason).toContain('nested group blocks');
		});

		it('should block hub conversions', () => {
			const result1 = areGlyphsetsCompatible('hub', 'basicProcess');
			expect(result1.compatible).toBe(false);
			expect(result1.reason).toContain('radial structure');

			const result2 = areGlyphsetsCompatible('basicProcess', 'hub');
			expect(result2.compatible).toBe(false);
			expect(result2.reason).toContain('center item and spoke items');
		});
	});
	describe('getCompatibleAlternatives', () => {
		it('should suggest alternatives for groupedProcess', () => {
			const alternatives = getCompatibleAlternatives('groupedProcess', 'funnel');
			expect(alternatives).toContain('basicProcess');
			expect(alternatives).toContain('stepProcess');
			expect(alternatives).not.toContain('funnel'); // Target type excluded
		});

		it('should suggest alternatives when converting to hub', () => {
			const alternatives = getCompatibleAlternatives('basicProcess', 'hub');
			expect(alternatives).toContain('interconnected');
			expect(alternatives).toContain('cluster');
		});

		it('should suggest alternatives for equation', () => {
			const alternatives = getCompatibleAlternatives('equation', 'basicProcess');
			expect(alternatives).toContain('balance');
			expect(alternatives).toContain('basicList');
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

		it('should convert balance sides to items with warning', () => {
			const code = `glyphset balance "Test" {
  side "Pros"
  side "Cons"
}`;
			const result = convertGlyphset(code, 'basicList');

			expect(result.success).toBe(true);
			expect(result.newCode).toContain('glyphset basicList');
			expect(result.newCode).toContain('item "Pros"');
			expect(result.newCode).toContain('item "Cons"');
			expect(result.warnings.length).toBeGreaterThan(0);
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

		it('should successfully convert to matrix2x2 with warnings', () => {
			const code = `glyphset basicList "Test" {
  item "A"
  item "B"
  item "C"
}`;
			const result = convertGlyphset(code, 'matrix2x2');

			expect(result.success).toBe(true);
			expect(result.newCode).toContain('glyphset matrix2x2');
			expect(result.warnings?.length).toBeGreaterThan(0);
			expect(result.warnings?.some((w) => w.includes('designed for 4 items'))).toBe(true);
		});

		it('should warn about item count for balance', () => {
			const code = `glyphset basicList "Test" {
  item "A"
  item "B"
  item "C"
}`;
			const result = convertGlyphset(code, 'balance');

			expect(result.success).toBe(true);
			expect(result.warnings.some((w) => w.includes('2 items'))).toBe(true);
		});

		it('should block equation conversions', () => {
			const code = `glyphset equation "Test" {
  input "A"
  operator "+"
  input "B"
  result "C"
}`;
			const result = convertGlyphset(code, 'basicList');

			expect(result.success).toBe(false);
			expect(result.errors.some((e) => e.includes('special structure'))).toBe(true);
		});

		it('should handle glyphset without name', () => {
			const code = `glyphset pyramid {
  level "A"
  level "B"
}`;
			const result = convertGlyphset(code, 'invertedPyramid');

			expect(result.success).toBe(true);
			expect(result.newCode).toContain('glyphset invertedPyramid {');
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
			expect(result.newCode).toContain(
				'image "https://i.pravatar.cc/200?img=11" label "Awareness"'
			);
			expect(result.newCode).toContain('image "https://i.pravatar.cc/200?img=12" label "Interest"');
			expect(result.newCode).toContain('image "https://i.pravatar.cc/200?img=13" label "Decision"');
		});

		it('should convert from pictureProcess extracting labels', () => {
			const code = `glyphset pictureProcess "Baking" {
  theme colorful
  image "https://i.pravatar.cc/200?img=11" label "Gather Ingredients"
  image "https://i.pravatar.cc/200?img=12" label "Mix Thoroughly"
  image "https://i.pravatar.cc/200?img=13" label "Bake at 350°F"
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
			expect(result.newCode).toContain(
				'image "https://i.pravatar.cc/200?img=11" label "Awareness"'
			);
			expect(result.newCode).toContain('image "https://i.pravatar.cc/200?img=12" label "Interest"');
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

		it('should convert from detailedProcess extracting main step only', () => {
			const code = `glyphset detailedProcess "Product Dev" {
  theme forest
  item "Research | Market Analysis | User Interviews"
  item "Design | Wireframes | Prototypes"
  item "Build | Frontend | Backend"
}`;
			const result = convertGlyphset(code, 'basicList');

			expect(result.success).toBe(true);
			expect(result.newCode).toContain('glyphset basicList');
			expect(result.newCode).toContain('item "Research"');
			expect(result.newCode).toContain('item "Design"');
			expect(result.newCode).toContain('item "Build"');
			expect(result.newCode).not.toContain('Market Analysis');
			expect(result.newCode).not.toContain('Wireframes');
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
			expect(result.newCode).toContain('image "https://i.pravatar.cc/200?img=11" label "Plan"');
			expect(result.newCode).toContain('image "https://i.pravatar.cc/200?img=12" label "Execute"');
			expect(result.newCode).not.toContain('Research');
			expect(result.newCode).not.toContain('Strategy');
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

		it('should successfully convert hub via specialized function', () => {
			const code = `glyphset hub "Test" {
  center "Core"
  spoke "Branch 1"
}`;
			const result = convertGlyphset(code, 'basicProcess');

			expect(result.success).toBe(true);
			expect(result.newCode).toContain('glyphset basicProcess');
			expect(result.newCode).toContain('item "Core"');
			expect(result.newCode).toContain('item "Branch 1"');
			expect(result.warnings).toBeDefined();
		});
	});

	describe('flattenGroupedProcess', () => {
		it('should flatten groupedProcess to basicList', () => {
			const code = `glyphset groupedProcess "Project" {
  theme forest
  group "Design Team" {
    item "Research"
    item "Design"
  }
  group "Engineering" {
    item "Build"
    item "Test"
  }
  mergePoint "Launch"
}`;
			const result = flattenGroupedProcess(code, 'basicList');

			expect(result.success).toBe(true);
			expect(result.newCode).toContain('glyphset basicList');
			expect(result.newCode).toContain('theme forest');
			expect(result.newCode).toContain('item "Research"');
			expect(result.newCode).toContain('item "Design"');
			expect(result.newCode).toContain('item "Build"');
			expect(result.newCode).toContain('item "Test"');
			expect(result.newCode).not.toContain('group');
			expect(result.newCode).not.toContain('mergePoint');
		});

		it('should flatten groupedProcess to basicProcess', () => {
			const code = `glyphset groupedProcess "Workflow" {
  group "Team A" {
    item "Task 1"
    item "Task 2"
  }
  group "Team B" {
    item "Task 3"
  }
  mergePoint "Complete"
}`;
			const result = flattenGroupedProcess(code, 'basicProcess');

			expect(result.success).toBe(true);
			expect(result.newCode).toContain('glyphset basicProcess');
			expect(result.newCode).toContain('item "Task 1"');
			expect(result.newCode).toContain('item "Task 2"');
			expect(result.newCode).toContain('item "Task 3"');
		});

		it('should preserve comments when flattening', () => {
			const code = `glyphset groupedProcess "Test" {
  // Important comment
  group "Team A" {
    item "Task 1"
  }
  mergePoint "Done"
}`;
			const result = flattenGroupedProcess(code, 'basicList');

			expect(result.success).toBe(true);
			expect(result.newCode).toContain('// Important comment');
		});
	});

	describe('expandToGroupedProcess', () => {
		it('should expand basicList to groupedProcess with two groups', () => {
			const code = `glyphset basicList "Test" {
  item "Task 1"
  item "Task 2"
  item "Task 3"
  item "Task 4"
}`;
			const result = expandToGroupedProcess(code);

			expect(result.success).toBe(true);
			expect(result.newCode).toContain('glyphset groupedProcess');
			expect(result.newCode).toContain('group "Group 1"');
			expect(result.newCode).toContain('group "Group 2"');
			expect(result.newCode).toContain('mergePoint "Result"');
			expect(result.newCode).toContain('item "Task 1"');
			expect(result.newCode).toContain('item "Task 4"');
		});

		it('should split items evenly between two groups', () => {
			const code = `glyphset basicProcess "Test" {
  step "Step 1"
  step "Step 2"
  step "Step 3"
}`;
			const result = expandToGroupedProcess(code);

			expect(result.success).toBe(true);
			// Should have 2 items in first group (ceil(3/2))
			const firstGroupMatch = result.newCode.match(/group "Group 1" \{([^}]+)\}/);
			const secondGroupMatch = result.newCode.match(/group "Group 2" \{([^}]+)\}/);
			expect(firstGroupMatch).toBeTruthy();
			expect(secondGroupMatch).toBeTruthy();
			// First group should have 2 items, second group should have 1 item
			const firstGroupItems = (firstGroupMatch![1].match(/item/g) || []).length;
			const secondGroupItems = (secondGroupMatch![1].match(/item/g) || []).length;
			expect(firstGroupItems).toBe(2);
			expect(secondGroupItems).toBe(1);
		});

		it('should preserve theme when expanding', () => {
			const code = `glyphset basicList "Test" {
  theme darkBlue
  item "Task 1"
  item "Task 2"
}`;
			const result = expandToGroupedProcess(code);

			expect(result.success).toBe(true);
			expect(result.newCode).toContain('theme darkBlue');
		});
	});

	describe('flattenSegmentedPyramid', () => {
		it('should flatten segmentedPyramid to basicList', () => {
			const code = `glyphset segmentedPyramid "Skills" {
  level "Expert" {
    item "Architecture"
    item "Leadership"
  }
  level "Advanced" {
    item "Design"
  }
}`;
			const result = flattenSegmentedPyramid(code, 'basicList');

			expect(result.success).toBe(true);
			expect(result.newCode).toContain('glyphset basicList');
			expect(result.newCode).toContain('item "Architecture"');
			expect(result.newCode).toContain('item "Leadership"');
			expect(result.newCode).toContain('item "Design"');
			expect(result.newCode).not.toContain('level "Expert"');
			expect(result.newCode).not.toContain('level "Advanced"');
		});

		it('should convert items to target keyword', () => {
			const code = `glyphset segmentedPyramid "Test" {
  level "Top" {
    item "Task 1"
  }
}`;
			const result = flattenSegmentedPyramid(code, 'basicProcess');

			expect(result.success).toBe(true);
			expect(result.newCode).toContain('glyphset basicProcess');
			expect(result.newCode).toContain('item "Task 1"');
		});
	});

	describe('flattenMatrix', () => {
		it('should flatten segmentedMatrix to basicList', () => {
			const code = `glyphset segmentedMatrix "Test" {
  quadrant "Q1"
  quadrant "Q2"
  quadrant "Q3"
  quadrant "Q4"
}`;
			const result = flattenMatrix(code, 'basicList');

			expect(result.success).toBe(true);
			expect(result.newCode).toContain('glyphset basicList');
			expect(result.newCode).toContain('item "Q1"');
			expect(result.newCode).toContain('item "Q2"');
			expect(result.newCode).toContain('item "Q3"');
			expect(result.newCode).toContain('item "Q4"');
			expect(result.newCode).not.toContain('quadrant');
		});

		it('should convert matrix3x3 quadrants to steps', () => {
			const code = `glyphset matrix3x3 "Test" {
  quadrant "A"
  quadrant "B"
}`;
			const result = flattenMatrix(code, 'basicProcess');

			expect(result.success).toBe(true);
			expect(result.newCode).toContain('glyphset basicProcess');
			expect(result.newCode).toContain('item "A"');
			expect(result.newCode).toContain('item "B"');
		});
	});
});
