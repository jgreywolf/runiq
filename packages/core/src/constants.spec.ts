import { describe, expect, it } from 'vitest';
import {
  AnchorPoint,
  ArrowType,
  Colors,
  Direction,
  EdgeRouting,
  GlyphSetCategory,
  LayoutAlgorithm,
  LayoutDefaults,
  LineStyle,
  MessageType,
  Orientation,
  PIDLineType,
  Position,
  ProfileType,
  RenderDefaults,
  ShapeDefaults,
} from './constants.js';

describe('Constants and Enums', () => {
  describe('ProfileType', () => {
    it('should have correct profile type values', () => {
      expect(ProfileType.DIAGRAM).toBe('diagram');
      expect(ProfileType.SEQUENCE).toBe('sequence');
      expect(ProfileType.TIMELINE).toBe('timeline');
      expect(ProfileType.ELECTRICAL).toBe('electrical');
      expect(ProfileType.DIGITAL).toBe('digital');
      expect(ProfileType.BLOCK_DIAGRAM).toBe('blockDiagram');
      expect(ProfileType.WARDLEY).toBe('wardley');
      expect(ProfileType.PNEUMATIC).toBe('pneumatic');
      expect(ProfileType.HYDRAULIC).toBe('hydraulic');
      expect(ProfileType.HVAC).toBe('hvac');
      expect(ProfileType.PID).toBe('pid');
      expect(ProfileType.RAILROAD).toBe('railroad');
      expect(ProfileType.GLYPHSET).toBe('glyphset');
      expect(ProfileType.KANBAN).toBe('kanban');
      expect(ProfileType.GITGRAPH).toBe('gitgraph');
      expect(ProfileType.TREEMAP).toBe('treemap');
    });

    it('should have 16 profile types', () => {
      const values = Object.values(ProfileType);
      expect(values).toHaveLength(16);
    });
  });

  describe('Direction', () => {
    it('should have correct direction values', () => {
      expect(Direction.LEFT_TO_RIGHT).toBe('LR');
      expect(Direction.RIGHT_TO_LEFT).toBe('RL');
      expect(Direction.TOP_TO_BOTTOM).toBe('TB');
      expect(Direction.BOTTOM_TO_TOP).toBe('BT');
    });

    it('should have 4 directions', () => {
      const values = Object.values(Direction);
      expect(values).toHaveLength(4);
    });
  });

  describe('EdgeRouting', () => {
    it('should have correct routing values', () => {
      expect(EdgeRouting.ORTHOGONAL).toBe('orthogonal');
      expect(EdgeRouting.POLYLINE).toBe('polyline');
      expect(EdgeRouting.SPLINES).toBe('splines');
      expect(EdgeRouting.STRAIGHT).toBe('straight');
    });

    it('should have 4 routing algorithms', () => {
      const values = Object.values(EdgeRouting);
      expect(values).toHaveLength(4);
    });
  });

  describe('LayoutAlgorithm', () => {
    it('should have correct layout algorithm values', () => {
      expect(LayoutAlgorithm.LAYERED).toBe('layered');
      expect(LayoutAlgorithm.FORCE).toBe('force');
      expect(LayoutAlgorithm.STRESS).toBe('stress');
      expect(LayoutAlgorithm.RADIAL).toBe('radial');
      expect(LayoutAlgorithm.MRTREE).toBe('mrtree');
      expect(LayoutAlgorithm.CIRCULAR).toBe('circular');
    });

    it('should have 6 layout algorithms', () => {
      const values = Object.values(LayoutAlgorithm);
      expect(values).toHaveLength(6);
    });
  });

  describe('ArrowType', () => {
    it('should have correct arrow type values', () => {
      expect(ArrowType.STANDARD).toBe('standard');
      expect(ArrowType.HOLLOW).toBe('hollow');
      expect(ArrowType.OPEN).toBe('open');
      expect(ArrowType.NONE).toBe('none');
    });

    it('should have 4 arrow types', () => {
      const values = Object.values(ArrowType);
      expect(values).toHaveLength(4);
    });
  });

  describe('LineStyle', () => {
    it('should have correct line style values', () => {
      expect(LineStyle.SOLID).toBe('solid');
      expect(LineStyle.DASHED).toBe('dashed');
      expect(LineStyle.DOTTED).toBe('dotted');
      expect(LineStyle.DOUBLE).toBe('double');
    });

    it('should have 4 line styles', () => {
      const values = Object.values(LineStyle);
      expect(values).toHaveLength(4);
    });
  });

  describe('AnchorPoint', () => {
    it('should have correct anchor point values', () => {
      expect(AnchorPoint.NORTH).toBe('north');
      expect(AnchorPoint.SOUTH).toBe('south');
      expect(AnchorPoint.EAST).toBe('east');
      expect(AnchorPoint.WEST).toBe('west');
      expect(AnchorPoint.NORTHEAST).toBe('northeast');
      expect(AnchorPoint.NORTHWEST).toBe('northwest');
      expect(AnchorPoint.SOUTHEAST).toBe('southeast');
      expect(AnchorPoint.SOUTHWEST).toBe('southwest');
    });

    it('should have 8 anchor points', () => {
      const values = Object.values(AnchorPoint);
      expect(values).toHaveLength(8);
    });
  });

  describe('Orientation', () => {
    it('should have correct orientation values', () => {
      expect(Orientation.HORIZONTAL).toBe('horizontal');
      expect(Orientation.VERTICAL).toBe('vertical');
    });

    it('should have 2 orientations', () => {
      const values = Object.values(Orientation);
      expect(values).toHaveLength(2);
    });
  });

  describe('Position', () => {
    it('should have correct position values', () => {
      expect(Position.LEFT).toBe('left');
      expect(Position.RIGHT).toBe('right');
      expect(Position.TOP).toBe('top');
      expect(Position.BOTTOM).toBe('bottom');
      expect(Position.CENTER).toBe('center');
      expect(Position.OVER).toBe('over');
    });

    it('should have 6 positions', () => {
      const values = Object.values(Position);
      expect(values).toHaveLength(6);
    });
  });

  describe('MessageType', () => {
    it('should have correct message type values', () => {
      expect(MessageType.SYNC).toBe('sync');
      expect(MessageType.ASYNC).toBe('async');
      expect(MessageType.RETURN).toBe('return');
      expect(MessageType.DESTROY).toBe('destroy');
    });

    it('should have 4 message types', () => {
      const values = Object.values(MessageType);
      expect(values).toHaveLength(4);
    });
  });

  describe('PIDLineType', () => {
    it('should have correct PID line type values', () => {
      expect(PIDLineType.PROCESS).toBe('process');
      expect(PIDLineType.SIGNAL).toBe('signal');
      expect(PIDLineType.ELECTRICAL).toBe('electrical');
      expect(PIDLineType.UTILITY).toBe('utility');
      expect(PIDLineType.PNEUMATIC).toBe('pneumatic');
      expect(PIDLineType.HYDRAULIC).toBe('hydraulic');
      expect(PIDLineType.DATA).toBe('data');
    });

    it('should have 7 PID line types', () => {
      const values = Object.values(PIDLineType);
      expect(values).toHaveLength(7);
    });
  });

  describe('GlyphSetCategory', () => {
    it('should have correct category values', () => {
      expect(GlyphSetCategory.HIERARCHY).toBe('hierarchy');
      expect(GlyphSetCategory.LIST).toBe('list');
      expect(GlyphSetCategory.PROCESS).toBe('process');
      expect(GlyphSetCategory.RELATIONSHIP).toBe('relationship');
      expect(GlyphSetCategory.COMPARISON).toBe('comparison');
      expect(GlyphSetCategory.VISUALIZATION).toBe('visualization');
    });

    it('should have 6 glyphset categories', () => {
      const values = Object.values(GlyphSetCategory);
      expect(values).toHaveLength(6);
    });
  });

  describe('ShapeDefaults', () => {
    it('should have reasonable padding values', () => {
      expect(ShapeDefaults.PADDING).toBe(10);
      expect(ShapeDefaults.PADDING_LARGE).toBe(20);
      expect(ShapeDefaults.PADDING_SMALL).toBe(5);
    });

    it('should have reasonable rendering values', () => {
      expect(ShapeDefaults.STROKE_WIDTH).toBe(1.5);
      expect(ShapeDefaults.FONT_SIZE).toBe(14);
      expect(ShapeDefaults.ICON_SIZE).toBe(24);
      expect(ShapeDefaults.LINE_HEIGHT_MULTIPLIER).toBe(1.2);
    });

    it('should have minimum dimensions', () => {
      expect(ShapeDefaults.MIN_WIDTH).toBe(40);
      expect(ShapeDefaults.MIN_HEIGHT).toBe(30);
    });

    it('should have all expected properties', () => {
      expect(Object.keys(ShapeDefaults)).toHaveLength(9);
    });
  });

  describe('LayoutDefaults', () => {
    it('should have spacing values', () => {
      expect(LayoutDefaults.NODE_SPACING).toBe(50);
      expect(LayoutDefaults.EDGE_SPACING).toBe(40);
      expect(LayoutDefaults.CONTAINER_PADDING).toBe(30);
      expect(LayoutDefaults.LAYER_SPACING).toBe(60);
    });

    it('should have minimum node dimensions', () => {
      expect(LayoutDefaults.MIN_NODE_WIDTH).toBe(80);
      expect(LayoutDefaults.MIN_NODE_HEIGHT).toBe(40);
    });

    it('should have all expected properties', () => {
      expect(Object.keys(LayoutDefaults)).toHaveLength(6);
    });
  });

  describe('RenderDefaults', () => {
    it('should have rendering values', () => {
      expect(RenderDefaults.ARROW_SIZE).toBe(10);
      expect(RenderDefaults.EDGE_LABEL_PADDING).toBe(5);
      expect(RenderDefaults.CONTAINER_BORDER_WIDTH).toBe(2);
    });

    it('should have shadow values', () => {
      expect(RenderDefaults.SHADOW_OFFSET).toBe(4);
      expect(RenderDefaults.SHADOW_BLUR).toBe(8);
    });

    it('should have all expected properties', () => {
      expect(Object.keys(RenderDefaults)).toHaveLength(5);
    });
  });

  describe('Colors', () => {
    it('should have default color values', () => {
      expect(Colors.DEFAULT_FILL).toBe('#e0e0e0');
      expect(Colors.DEFAULT_STROKE).toBe('#000000');
      expect(Colors.DEFAULT_TEXT).toBe('#000000');
      expect(Colors.TRANSPARENT).toBe('transparent');
    });

    it('should have all expected properties', () => {
      expect(Object.keys(Colors)).toHaveLength(4);
    });
  });
});
