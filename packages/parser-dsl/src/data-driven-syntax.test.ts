import { describe, it, expect } from 'vitest';
import { parse } from './langium-parser.js';

describe('Data-Driven Syntax', () => {
  describe('DataSourceDeclaration', () => {
    it('parses JSON data source declaration', () => {
      const input = `
        diagram "test" {
          datasource "json" key:users from:"data/users.json"
        }
      `;
      const result = parse(input);
      expect(result.success).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.document).toBeDefined();

      const profiles = result.document!.profiles;
      expect(profiles).toHaveLength(1);

      const profile = profiles[0] as any;
      expect(profile.dataSources).toBeDefined();
      expect(profile.dataSources).toHaveLength(1);

      const dataSource = profile.dataSources[0];
      expect(dataSource.format).toBe('json');
      expect(dataSource.key).toBe('users');
      expect(dataSource.source).toBe('data/users.json');
    });

    it('parses CSV data source declaration', () => {
      const input = `
        diagram "test" {
          datasource "csv" key:metrics from:"metrics.csv"
        }
      `;
      const result = parse(input);
      expect(result.success).toBe(true);
      expect(result.errors).toHaveLength(0);

      const profile = result.document!.profiles[0] as any;
      expect(profile.dataSources).toHaveLength(1);

      const dataSource = profile.dataSources[0];
      expect(dataSource.format).toBe('csv');
      expect(dataSource.key).toBe('metrics');
      expect(dataSource.source).toBe('metrics.csv');
    });

    it('parses data source with options', () => {
      const input = `
        diagram "test" {
          datasource "csv" key:mydata from:"data.csv" options:{sep:",", hasHeader:true}
        }
      `;
      const result = parse(input);
      expect(result.success).toBe(true);
      expect(result.errors).toHaveLength(0);

      const profile = result.document!.profiles[0] as any;
      expect(profile.dataSources).toHaveLength(1);

      const dataSource = profile.dataSources[0];
      expect(dataSource.options).toBeDefined();
      expect(dataSource.options).toHaveLength(2);
      expect(dataSource.options[0].name).toBe('sep');
      expect(dataSource.options[0].value).toBe(',');
      expect(dataSource.options[1].name).toBe('hasHeader');
      expect(dataSource.options[1].value).toBe(true);
    });

    it('parses inline JSON data source', () => {
      const input = `
        diagram "test" {
          datasource "json" key:inline from:"[{\\"id\\":1,\\"name\\":\\"Alice\\"}]"
        }
      `;
      const result = parse(input);
      expect(result.errors).toHaveLength(0);
    });
  });

  describe('DataTemplateBlock', () => {
    it('parses basic template with variable substitution', () => {
      const input = `
        diagram "test" {
          template "userCard" from:users {
            node \${item.id} shape:rect label:\${item.name}
          }
        }
      `;
      const result = parse(input);
      expect(result.success).toBe(true);
      expect(result.errors).toHaveLength(0);

      const profile = result.document!.profiles[0] as any;
      expect(profile.dataTemplates).toHaveLength(1);

      const template = profile.dataTemplates[0];
      expect(template.id).toBe('userCard');
      expect(template.dataKey).toBe('users');
      expect(template.statements).toHaveLength(1);
    });

    it('parses template with filter', () => {
      const input = `
        diagram "test" {
          template "activeUsers" from:users {
            filter:"active = true"
            node \${item.id} shape:rect label:\${item.name}
          }
        }
      `;
      const result = parse(input);
      expect(result.success).toBe(true);
      expect(result.errors).toHaveLength(0);

      const profile = result.document!.profiles[0] as any;
      expect(profile.dataTemplates).toHaveLength(1);

      const template = profile.dataTemplates[0];
      expect(template.filter).toBe('active = true');
    });

    it('parses template with limit', () => {
      const input = `
        diagram "test" {
          template "top10" from:users {
            limit:10
            node \${item.id} shape:rect label:\${item.name}
          }
        }
      `;
      const result = parse(input);
      expect(result.success).toBe(true);
      expect(result.errors).toHaveLength(0);

      const profile = result.document!.profiles[0] as any;
      expect(profile.dataTemplates).toHaveLength(1);

      const template = profile.dataTemplates[0];
      expect(template.limit).toBe(10);
    });

    it('parses template node with multiple properties', () => {
      const input = `
        diagram "test" {
          template "card" from:mydata {
            node \${item.id} shape:rect label:\${item.name} fill:\${item.color} stroke:"black"
          }
        }
      `;
      const result = parse(input);
      expect(result.success).toBe(true);
      expect(result.errors).toHaveLength(0);

      const profile = result.document!.profiles[0] as any;
      expect(profile.dataTemplates).toHaveLength(1);

      const template = profile.dataTemplates[0];
      expect(template.statements).toHaveLength(1);
    });

    it('parses template node with data properties', () => {
      const input = `
        diagram "test" {
          template "chart" from:mydata {
            node \${item.id} shape:pieChart data:{amount:\${item.amount}, category:\${item.category}}
          }
        }
      `;
      const result = parse(input);
      expect(result.success).toBe(true);
      expect(result.errors).toHaveLength(0);

      const profile = result.document!.profiles[0] as any;
      expect(profile.dataTemplates).toHaveLength(1);

      const template = profile.dataTemplates[0];
      expect(template.statements).toHaveLength(1);
    });

    it('parses template edge with variable substitution', () => {
      const input = `
        diagram "test" {
          template "connections" from:edges {
            edge \${item.from} -> \${item.to} label:\${item.type}
          }
        }
      `;
      const result = parse(input);
      expect(result.success).toBe(true);
      expect(result.errors).toHaveLength(0);

      const profile = result.document!.profiles[0] as any;
      expect(profile.dataTemplates).toHaveLength(1);

      const template = profile.dataTemplates[0];
      expect(template.statements).toHaveLength(1);
    });

    it('parses conditional block', () => {
      const input = `
        diagram "test" {
          template "conditionalNodes" from:mydata {
            if \${item.active} {
              node \${item.id} shape:rect label:\${item.name}
            }
          }
        }
      `;
      const result = parse(input);
      expect(result.success).toBe(true);
      expect(result.errors).toHaveLength(0);

      const profile = result.document!.profiles[0] as any;
      expect(profile.dataTemplates).toHaveLength(1);

      const template = profile.dataTemplates[0];
      expect(template.statements).toHaveLength(1);
    });

    it('parses loop block', () => {
      const input = `
        diagram "test" {
          template "nestedLoop" from:mydata {
            for child in \${item.children} {
              node \${child.id} shape:rect label:\${child.name}
            }
          }
        }
      `;
      const result = parse(input);
      expect(result.success).toBe(true);
      expect(result.errors).toHaveLength(0);

      const profile = result.document!.profiles[0] as any;
      expect(profile.dataTemplates).toHaveLength(1);

      const template = profile.dataTemplates[0];
      expect(template.statements).toHaveLength(1);
    });

    it('parses nested template expression with dot notation', () => {
      const input = `
        diagram "test" {
          template "nested" from:mydata {
            node \${item.user.profile.name} shape:rect label:\${item.user.email}
          }
        }
      `;
      const result = parse(input);
      expect(result.errors).toHaveLength(0);
    });

    it('parses complex template with all features', () => {
      const input = `
        diagram "test" {
          datasource "json" key:users from:"users.json"
          
          template "userNetwork" from:users {
            filter:"role = 'admin'"
            limit:50
            
            node \${item.id} shape:rect label:\${item.name} fill:\${item.color}
            
            if \${item.hasTeam} {
              for member in \${item.team} {
                node \${member.id} shape:ellipse label:\${member.name}
                edge \${item.id} -> \${member.id} label:"manages"
              }
            }
          }
        }
      `;
      const result = parse(input);
      expect(result.success).toBe(true);
      expect(result.errors).toHaveLength(0);

      const profile = result.document!.profiles[0] as any;
      expect(profile.dataSources).toHaveLength(1);
      expect(profile.dataTemplates).toHaveLength(1);
    });
  });

  describe('Variable Substitution', () => {
    it('parses simple variable reference', () => {
      const input = `
        diagram "test" {
          template "test" from:mydata {
            node \${id} shape:rect
          }
        }
      `;
      const result = parse(input);
      expect(result.errors).toHaveLength(0);
    });

    it('parses nested property access', () => {
      const input = `
        diagram "test" {
          template "test" from:mydata {
            node \${item.user.name} shape:rect
          }
        }
      `;
      const result = parse(input);
      expect(result.errors).toHaveLength(0);
    });

    it('parses mixed literal and variable in label', () => {
      const input = `
        diagram "test" {
          template "test" from:mydata {
            node \${item.id} shape:rect label:"User: \${item.name}"
          }
        }
      `;
      const result = parse(input);
      expect(result.errors).toHaveLength(0);
    });
  });

  describe('Error Cases', () => {
    it('reports error for missing key in datasource', () => {
      const input = `
        diagram "test" {
          datasource "json" from:"data.json"
        }
      `;
      const result = parse(input);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('reports error for missing from in datasource', () => {
      const input = `
        diagram "test" {
          datasource "json" key:users
        }
      `;
      const result = parse(input);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('reports error for missing from in template', () => {
      const input = `
        diagram "test" {
          template "test" {
            node id shape:rect
          }
        }
      `;
      const result = parse(input);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });
});
