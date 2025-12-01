import { test, expect } from '@playwright/test';
import { renderAndSetup } from './utils';

test.describe('Visual Regression - Container Tests', () => {
  test('should render a basic container with shapes', async ({ page }) => {
    const dsl = `
diagram "Basic Container" {
  container backend "Backend Services" fillColor:"#e3f2fd" strokeColor:"#1976d2" strokeWidth:2 {
    shape api as @hexagon label:"API"
    shape db as @cylinder label:"Database"
    api -> db
  }
}`;
    await renderAndSetup(page, dsl);

    const svg = page.locator('svg');
    await expect(svg).toBeVisible();
    await expect(svg).toHaveScreenshot('container-basic.png');
  });

  test('should render a container with fill property', async ({ page }) => {
    const dsl = `
diagram "Container Fill" {
  container "Services" fill:"#fff3e0" {
    shape app as @rectangle label:"Application"
    shape cache as @cylinder label:"Cache"
    app -> cache
  }
}`;
    await renderAndSetup(page, dsl);

    const svg = page.locator('svg');
    await expect(svg).toBeVisible();
    await expect(svg).toHaveScreenshot('container-fill.png');
  });

  test('should render a container with TB direction', async ({ page }) => {
    const dsl = `
diagram "Container Direction TB" {
  container "Vertical Flow" fillColor:"#e3f2fd" strokeColor:"#1976d2" direction:TB {
    shape a as @rounded label:"Step A"
    shape b as @rounded label:"Step B"
    shape c as @rounded label:"Step C"
    a -> b
    b -> c
  }
}`;
    await renderAndSetup(page, dsl);

    const svg = page.locator('svg');
    await expect(svg).toBeVisible();
    await expect(svg).toHaveScreenshot('container-direction-tb.png');
  });

  test('should render a container with LR direction', async ({ page }) => {
    const dsl = `
diagram "Container Direction LR" {
  container "Horizontal Flow" fillColor:"#f3e5f5" strokeColor:"#7b1fa2" direction:LR {
    shape x as @rounded label:"Step X"
    shape y as @rounded label:"Step Y"
    shape z as @rounded label:"Step Z"
    x -> y
    y -> z
  }
}`;
    await renderAndSetup(page, dsl);

    const svg = page.locator('svg');
    await expect(svg).toBeVisible();
    await expect(svg).toHaveScreenshot('container-direction-lr.png');
  });

  test('should render nested containers (2 levels)', async ({ page }) => {
    const dsl = `
diagram "Nested Containers" {
  container outer "Outer Container" fillColor:"#e8f5e9" strokeColor:"#388e3c" strokeWidth:3 {
    shape start as @hexagon label:"Start"
    
    container inner "Inner Container" fillColor:"#fff3e0" strokeColor:"#f57c00" {
      shape p1 as @rounded label:"Process 1"
      shape p2 as @rounded label:"Process 2"
      p1 -> p2
    }
    
    shape end as @hexagon label:"End"
    start -> p1
    p2 -> end
  }
}`;
    await renderAndSetup(page, dsl);

    const svg = page.locator('svg');
    await expect(svg).toBeVisible();
    await expect(svg).toHaveScreenshot('container-nested-2levels.png');
  });

  test('should render nested containers (3 levels)', async ({ page }) => {
    const dsl = `
diagram "Deeply Nested Containers" {
  container level1 "Level 1" fillColor:"#e3f2fd" strokeColor:"#1976d2" {
    shape a as @rounded label:"A"
    
    container level2 "Level 2" fillColor:"#f3e5f5" strokeColor:"#7b1fa2" {
      shape b as @rounded label:"B"
      
      container level3 "Level 3" fillColor:"#fff3e0" strokeColor:"#f57c00" {
        shape c as @rounded label:"C"
        shape d as @rounded label:"D"
        c -> d
      }
      
      b -> c
    }
    
    a -> b
  }
}`;
    await renderAndSetup(page, dsl);

    const svg = page.locator('svg');
    await expect(svg).toBeVisible();
    await expect(svg).toHaveScreenshot('container-nested-3levels.png');
  });

  test('should render nested containers with different directions', async ({
    page,
  }) => {
    const dsl = `
diagram "Nested Direction Mix" {
  container outer "Outer (TB)" fillColor:"#e8f5e9" strokeColor:"#388e3c" direction:TB {
    shape start as @hexagon label:"Start"
    
    container inner "Inner (LR)" fillColor:"#fff3e0" strokeColor:"#f57c00" direction:LR {
      shape p1 as @rounded label:"P1"
      shape p2 as @rounded label:"P2"
      shape p3 as @rounded label:"P3"
      p1 -> p2
      p2 -> p3
    }
    
    shape end as @hexagon label:"End"
    start -> p1
    p3 -> end
  }
}`;
    await renderAndSetup(page, dsl);

    const svg = page.locator('svg');
    await expect(svg).toBeVisible();
    await expect(svg).toHaveScreenshot('container-nested-mixed-directions.png');
  });

  test('should render container with different border styles', async ({
    page,
  }) => {
    const dsl = `
diagram "Container Border Styles" {
  container "Dashed Border" fillColor:"#e3f2fd" strokeColor:"#1976d2" borderStyle:dashed {
    shape a as @rounded label:"Node A"
    shape b as @rounded label:"Node B"
    a -> b
  }
}`;
    await renderAndSetup(page, dsl);

    const svg = page.locator('svg');
    await expect(svg).toBeVisible();
    await expect(svg).toHaveScreenshot('container-border-dashed.png');
  });

  test('should render container with padding', async ({ page }) => {
    const dsl = `
diagram "Container Padding" {
  container "With Padding" fillColor:"#f3e5f5" strokeColor:"#7b1fa2" padding:40 {
    shape item1 as @rectangle label:"Item 1"
    shape item2 as @rectangle label:"Item 2"
    item1 -> item2
  }
}`;
    await renderAndSetup(page, dsl);

    const svg = page.locator('svg');
    await expect(svg).toBeVisible();
    await expect(svg).toHaveScreenshot('container-padding.png');
  });

  test('should render cross-container edges', async ({ page }) => {
    const dsl = `
diagram "Cross Container Edges" {
  container "Frontend" fillColor:"#e3f2fd" strokeColor:"#1976d2" {
    shape ui as @rounded label:"UI"
  }
  
  container "Backend" fillColor:"#f3e5f5" strokeColor:"#7b1fa2" {
    shape api as @hexagon label:"API"
  }
  
  ui -calls-> api
}`;
    await renderAndSetup(page, dsl);

    const svg = page.locator('svg');
    await expect(svg).toBeVisible();
    await expect(svg).toHaveScreenshot('container-cross-edges.png');
  });

  test('should render container with external edge connections', async ({
    page,
  }) => {
    const dsl = `
diagram "External Connections" {
  shape external as @rounded label:"External Service"
  
  container "Internal Services" fillColor:"#e8f5e9" strokeColor:"#388e3c" {
    shape internal as @hexagon label:"Internal API"
  }
  
  external -connects-> internal
}`;
    await renderAndSetup(page, dsl);

    const svg = page.locator('svg');
    await expect(svg).toBeVisible();
    await expect(svg).toHaveScreenshot('container-external-connections.png');
  });

  test('should render container with collapsible property', async ({
    page,
  }) => {
    const dsl = `
diagram "Collapsible Container" {
  container "Services" fillColor:"#e3f2fd" strokeColor:"#1976d2" collapsible:true {
    shape svc1 as @rectangle label:"Service 1"
    shape svc2 as @rectangle label:"Service 2"
    svc1 -> svc2
  }
}`;
    await renderAndSetup(page, dsl);

    const svg = page.locator('svg');
    await expect(svg).toBeVisible();
    await expect(svg).toHaveScreenshot('container-collapsible.png');
  });

  test('should render collapsed container', async ({ page }) => {
    const dsl = `
diagram "Collapsed Container" {
  container "Services" fillColor:"#e3f2fd" strokeColor:"#1976d2" collapsible:true collapsed:true {
    shape svc1 as @rectangle label:"Service 1"
    shape svc2 as @rectangle label:"Service 2"
    svc1 -> svc2
  }
}`;
    await renderAndSetup(page, dsl);

    const svg = page.locator('svg');
    await expect(svg).toBeVisible();
    await expect(svg).toHaveScreenshot('container-collapsed.png');
  });

  test('should render container with radial algorithm', async ({ page }) => {
    const dsl = `
diagram "Radial Container" {
  container "Radial Layout" algorithm:radial fillColor:"#fff3e0" strokeColor:"#f57c00" {
    shape hub as @circle label:"Hub"
    shape n1 as @rounded label:"Node 1"
    shape n2 as @rounded label:"Node 2"
    shape n3 as @rounded label:"Node 3"
    shape n4 as @rounded label:"Node 4"
    hub -to-> n1
    hub -to-> n2
    hub -to-> n3
    hub -to-> n4
  }
}`;
    await renderAndSetup(page, dsl);

    const svg = page.locator('svg');
    await expect(svg).toBeVisible();
    await expect(svg).toHaveScreenshot('container-algorithm-radial.png');
  });

  test('should render container with stress algorithm', async ({ page }) => {
    const dsl = `
diagram "Stress Container" {
  container "Stress Layout" algorithm:stress spacing:50 fillColor:"#e8f5e9" strokeColor:"#388e3c" {
    shape a as @rounded label:"A"
    shape b as @rounded label:"B"
    shape c as @rounded label:"C"
    shape d as @rounded label:"D"
    a -> b
    b -> c
    c -> d
    d -> a
    a -> c
  }
}`;
    await renderAndSetup(page, dsl);

    const svg = page.locator('svg');
    await expect(svg).toBeVisible();
    await expect(svg).toHaveScreenshot('container-algorithm-stress.png');
  });

  test('should render multiple containers side by side', async ({ page }) => {
    const dsl = `
diagram "Multiple Containers" {
  direction LR
  
  container "Container 1" fillColor:"#e3f2fd" strokeColor:"#1976d2" {
    shape a1 as @rounded label:"A1"
    shape a2 as @rounded label:"A2"
    a1 -to-> a2
  }
  
  container "Container 2" fillColor:"#f3e5f5" strokeColor:"#7b1fa2" {
    shape b1 as @rounded label:"B1"
    shape b2 as @rounded label:"B2"
    b1 -to-> b2
  }
  
  container "Container 3" fillColor:"#fff3e0" strokeColor:"#f57c00" {
    shape c1 as @rounded label:"C1"
    shape c2 as @rounded label:"C2"
    c1 -to-> c2
  }
}`;
    await renderAndSetup(page, dsl);

    const svg = page.locator('svg');
    await expect(svg).toBeVisible();
    await expect(svg).toHaveScreenshot('container-multiple-side-by-side.png');
  });
});
