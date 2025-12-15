/**
 * Tests for picture glyphset parsing
 */

import { describe, it, expect } from 'vitest';
import { parse } from '../langium-parser.js';

describe('Picture Glyphsets', () => {
  describe('pictureGrid parsing', () => {
    it('should parse image items with label', () => {
      const input = `
        glyphset pictureGrid "Featured Products" {
          theme "colorful"
          columns 3
          
          image "https://i.pravatar.cc/300?img=1" label "Product A"
          image "https://i.pravatar.cc/300?img=2" label "Product B"
          image "https://i.pravatar.cc/300?img=3" label "Product C"
        }
      `;

      const result = parse(input);
      expect(result.success).toBe(true);
      expect(result.document).toBeDefined();
    });

    it('should parse image items with label and description', () => {
      const input = `
        glyphset pictureList "Team Members" {
          image "https://i.pravatar.cc/300?img=1" label "Alice Johnson" description "Lead Developer"
          image "https://i.pravatar.cc/300?img=2" label "Bob Smith" description "UX Designer"
        }
      `;

      const result = parse(input);
      expect(result.success).toBe(true);
      expect(result.document).toBeDefined();
    });

    it('should parse image items with only url', () => {
      const input = `
        glyphset pictureProcess "Manufacturing Steps" {
          image "https://example.com/step1.jpg"
          image "https://example.com/step2.jpg"
        }
      `;

      const result = parse(input);
      expect(result.success).toBe(true);
      expect(result.document).toBeDefined();
    });
  });
});
