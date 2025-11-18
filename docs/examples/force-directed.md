# Force-Directed Networks & Graph Theory Examples

Force-directed networks visualize relationships between entities using physics-based layouts where nodes repel each other and edges act like springs. This creates organic, natural-looking graphs that reveal patterns and communities.

### Example 1: Computer Network (10 nodes)

Office network showing routers, servers, and workstations.

```runiq
diagram "Office Network" {
  container "Network" algorithm: force spacing: 100 {
    // Core infrastructure
    shape router as @hexagon label:"Router"
    shape firewall as @rect label:"Firewall"
    shape mainSwitch as @rhombus label:"Main Switch"

    // Servers
    shape webServer as @cylinder label:"Web Server"
    shape dbServer as @cylinder label:"Database"
    shape fileServer as @cylinder label:"File Server"

    // Workstations
    shape ws1 as @display label:"Sales-PC"
    shape ws2 as @display label:"Dev-PC"
    shape ws3 as @display label:"Admin-PC"

    // Network topology
    router -> firewall label:"WAN"
    firewall -> mainSwitch
    mainSwitch -> webServer
    mainSwitch -> dbServer
    mainSwitch -> fileServer
    mainSwitch -> ws1
    mainSwitch -> ws2
    mainSwitch -> ws3
    webServer -> dbServer label:"SQL"
  }
}
```

### Example 2: Citation Network (8 nodes)

Academic papers citing each other.

```runiq
diagram "Citation Network" {
  container "Papers" algorithm: force spacing: 130 {
    // Foundational papers
    shape p1 as @document label:"ML Basics (2015)"
    shape p2 as @document label:"Deep Learning (2016)"
    shape p3 as @document label:"Neural Nets (2015)"

    // Recent research
    shape p4 as @document label:"Transformers (2017)"
    shape p5 as @document label:"BERT (2018)"
    shape p6 as @document label:"GPT (2019)"
    shape p7 as @document label:"Vision Models (2020)"
    shape p8 as @document label:"Multimodal (2021)"

    // Citation relationships
    p4 -> p1
    p4 -> p2
    p5 -> p4
    p5 -> p2
    p6 -> p4
    p6 -> p5
    p7 -> p4
    p7 -> p6
    p8 -> p5
    p8 -> p7
  }
}
```

### Example 3: Social Network with Communities (7 nodes)

Friend connections showing natural clustering.

```runiq
diagram "Friend Network" {
  container "Friends" algorithm: force spacing: 110 {
    // Tech community
    shape alice as @actor label:"Alice"
    shape bob as @actor label:"Bob"
    shape carol as @actor label:"Carol"

    // Sports community
    shape david as @actor label:"David"
    shape eve as @actor label:"Eve"
    shape frank as @actor label:"Frank"

    // Bridge member
    shape grace as @actor label:"Grace"

    // Tech friendships
    alice -> bob
    alice -> carol
    bob -> carol

    // Sports friendships
    david -> eve
    david -> frank
    eve -> frank

    // Bridges between communities
    alice -> grace
    david -> grace
  }
}
```

### Example 4: Software Dependency Graph (9 nodes)

Package dependencies forming a network.

```runiq
// Software Dependency Graph
// Visualizes package dependencies with force-directed layout

diagram "Package Dependencies" {
  container "Packages" algorithm: force spacing: 110 {
    // Core infrastructure (few dependencies)
    shape types as @rect label:"@core/types"
    shape utils as @rect label:"@core/utils"
    shape config as @rect label:"@core/config"

    // Mid-level libraries
    shape auth as @rect label:"@lib/auth"
    shape api as @rect label:"@lib/api"
    shape db as @rect label:"@lib/database"
    shape cache as @rect label:"@lib/cache"

    // UI components
    shape uiCore as @rect label:"@ui/core"
    shape uiIcons as @rect label:"@ui/icons"
    shape uiForms as @rect label:"@ui/forms"

    // Applications
    shape webApp as @rect label:"web-app"
    shape mobileApp as @rect label:"mobile-app"
    shape cli as @rect label:"cli"

    // Core dependencies (everything needs these)
    auth -> types
    api -> types
    db -> types
    cache -> types
    uiCore -> types
    uiForms -> types

    auth -> utils
    api -> utils
    db -> utils
    uiCore -> utils

    auth -> config
    api -> config
    db -> config

    // Library dependencies
    api -> auth label:"requires"
    api -> db label:"queries"
    api -> cache label:"caches"
    db -> cache label:"uses"

    // UI dependencies
    uiForms -> uiCore label:"extends"
    uiForms -> uiIcons label:"uses"
    uiIcons -> uiCore

    // App dependencies
    webApp -> api label:"calls"
    webApp -> uiForms label:"displays"
    webApp -> auth label:"authenticates"

    mobileApp -> api
    mobileApp -> auth
    mobileApp -> uiCore

    cli -> api
    cli -> utils
    cli -> config
  }
}

```

### Example 5: Medium Network (25 nodes)

Collaboration network showing complex team relationships.

```runiq
diagram "Collaboration Network" {
  container "Team" algorithm: force spacing: 120 {
    // Department leaders
    shape ceo as @actor label:"CEO"
    shape cto as @actor label:"CTO"
    shape cfo as @actor label:"CFO"
    shape cmo as @actor label:"CMO"

    // Engineering team
    shape eng1 as @circle label:"Dev 1"
    shape eng2 as @circle label:"Dev 2"
    shape eng3 as @circle label:"Dev 3"
    shape eng4 as @circle label:"Dev 4"
    shape eng5 as @circle label:"Dev 5"

    // Design team
    shape des1 as @circle label:"Designer 1"
    shape des2 as @circle label:"Designer 2"
    shape des3 as @circle label:"Designer 3"

    // Marketing team
    shape mkt1 as @circle label:"Marketing 1"
    shape mkt2 as @circle label:"Marketing 2"
    shape mkt3 as @circle label:"Marketing 3"

    // Finance team
    shape fin1 as @circle label:"Finance 1"
    shape fin2 as @circle label:"Finance 2"

    // Product team
    shape pm1 as @circle label:"PM 1"
    shape pm2 as @circle label:"PM 2"
    shape pm3 as @circle label:"PM 3"

    // Sales team
    shape sal1 as @circle label:"Sales 1"
    shape sal2 as @circle label:"Sales 2"
    shape sal3 as @circle label:"Sales 3"
    shape sal4 as @circle label:"Sales 4"

    // Reporting structure
    ceo -> cto
    ceo -> cfo
    ceo -> cmo
    cto -> eng1
    cto -> eng2
    cto -> pm1
    cfo -> fin1
    cfo -> fin2
    cmo -> mkt1
    cmo -> sal1

    // Cross-team collaboration
    eng1 -> eng2
    eng2 -> eng3
    eng3 -> eng4
    eng4 -> eng5
    eng1 -> des1
    eng2 -> des2
    eng3 -> des3
    pm1 -> eng1
    pm2 -> eng3
    pm3 -> eng5
    pm1 -> des1
    pm2 -> des2
    pm3 -> des3
    mkt1 -> mkt2
    mkt2 -> mkt3
    sal1 -> sal2
    sal2 -> sal3
    sal3 -> sal4
    mkt1 -> sal1
    pm1 -> mkt1
  }
}
```

### Example 6: Protein Interaction Network (10 nodes)

Biological network showing protein interactions.

```runiq
diagram "Protein Interactions" {
  container "Proteins" algorithm: force spacing: 90 {
    // Proteins
    shape p1 as @hexagon label:"P53"
    shape p2 as @hexagon label:"MDM2"
    shape p3 as @hexagon label:"ATM"
    shape p4 as @hexagon label:"ATR"
    shape p5 as @hexagon label:"CHK1"
    shape p6 as @hexagon label:"CHK2"
    shape p7 as @hexagon label:"CDC25"
    shape p8 as @hexagon label:"CDK2"
    shape p9 as @hexagon label:"Cyclin E"
    shape p10 as @hexagon label:"Rb"

    // Interactions
    p1 -> p2 label:"inhibits"
    p1 -> p6
    p3 -> p1 label:"activates"
    p3 -> p6
    p4 -> p5
    p4 -> p1
    p5 -> p7
    p6 -> p7
    p7 -> p8
    p8 -> p9
    p8 -> p10
    p9 -> p8
  }
}
```

### Example 7: Knowledge Graph (15 nodes)

Concepts and their relationships.

```runiq
diagram "Knowledge Graph" {
  container "Concepts" algorithm: force spacing: 110 {
    // Core concepts
    shape prog as @rect label:"Programming"
    shape web as @rect label:"Web Dev"
    shape mobile as @rect label:"Mobile Dev"
    shape db as @rect label:"Databases"
    shape ai as @rect label:"AI/ML"

    // Languages
    shape js as @circle label:"JavaScript"
    shape py as @circle label:"Python"
    shape java as @circle label:"Java"
    shape cpp as @circle label:"C++"

    // Frameworks
    shape react as @roundedRect label:"React"
    shape vue as @roundedRect label:"Vue"
    shape django as @roundedRect label:"Django"
    shape flask as @roundedRect label:"Flask"
    shape tensorflow as @roundedRect label:"TensorFlow"
    shape pytorch as @roundedRect label:"PyTorch"

    // Relationships
    prog -> web
    prog -> mobile
    prog -> db
    prog -> ai
    web -> js
    mobile -> java
    ai -> py
    ai -> cpp
    js -> react
    js -> vue
    py -> django
    py -> flask
    py -> tensorflow
    py -> pytorch
    web -> react
    web -> vue
  }
}
```

### Example 8: Large Network (50 nodes)

Complex organization structure with multiple departments.

```runiq
diagram "Large Organization" {
  container "Company" algorithm: force spacing: 140 {
    // C-Level
    shape ceo as @actor label:"CEO"
    shape cto as @actor label:"CTO"
    shape cfo as @actor label:"CFO"
    shape cmo as @actor label:"CMO"
    shape coo as @actor label:"COO"

    // Engineering - 10 people
    shape engDir as @circle label:"Eng Director"
    shape engMgr1 as @circle label:"Eng Mgr 1"
    shape engMgr2 as @circle label:"Eng Mgr 2"
    shape dev1 as @circ label:"Dev 1"
    shape dev2 as @circ label:"Dev 2"
    shape dev3 as @circ label:"Dev 3"
    shape dev4 as @circ label:"Dev 4"
    shape dev5 as @circ label:"Dev 5"
    shape dev6 as @circ label:"Dev 6"
    shape dev7 as @circ label:"Dev 7"

    // Product - 8 people
    shape prodDir as @circle label:"Prod Director"
    shape pm1 as @circ label:"PM 1"
    shape pm2 as @circ label:"PM 2"
    shape pm3 as @circ label:"PM 3"
    shape des1 as @circ label:"Designer 1"
    shape des2 as @circ label:"Designer 2"
    shape ux1 as @circ label:"UX 1"
    shape ux2 as @circ label:"UX 2"

    // Marketing - 8 people
    shape mktDir as @circle label:"Mkt Director"
    shape mkt1 as @circ label:"Mkt 1"
    shape mkt2 as @circ label:"Mkt 2"
    shape mkt3 as @circ label:"Mkt 3"
    shape content1 as @circ label:"Content 1"
    shape content2 as @circ label:"Content 2"
    shape social1 as @circ label:"Social 1"
    shape social2 as @circ label:"Social 2"

    // Sales - 10 people
    shape salesDir as @circle label:"Sales Director"
    shape salesMgr1 as @circle label:"Sales Mgr 1"
    shape salesMgr2 as @circle label:"Sales Mgr 2"
    shape ae1 as @circ label:"AE 1"
    shape ae2 as @circ label:"AE 2"
    shape ae3 as @circ label:"AE 3"
    shape ae4 as @circ label:"AE 4"
    shape ae5 as @circ label:"AE 5"
    shape ae6 as @circ label:"AE 6"
    shape sdr1 as @circ label:"SDR 1"

    // Finance - 5 people
    shape finDir as @circle label:"Fin Director"
    shape acct1 as @circ label:"Accountant 1"
    shape acct2 as @circ label:"Accountant 2"
    shape fp1 as @circ label:"FP&A 1"
    shape fp2 as @circ label:"FP&A 2"

    // Operations - 4 people
    shape opsDir as @circle label:"Ops Director"
    shape ops1 as @circ label:"Ops 1"
    shape ops2 as @circ label:"Ops 2"
    shape ops3 as @circ label:"Ops 3"

    // Reporting lines
    ceo -> cto
    ceo -> cfo
    ceo -> cmo
    ceo -> coo
    cto -> engDir
    cto -> prodDir
    cmo -> mktDir
    cmo -> salesDir
    cfo -> finDir
    coo -> opsDir

    // Engineering
    engDir -> engMgr1
    engDir -> engMgr2
    engMgr1 -> dev1
    engMgr1 -> dev2
    engMgr1 -> dev3
    engMgr2 -> dev4
    engMgr2 -> dev5
    engMgr2 -> dev6
    engMgr2 -> dev7

    // Product
    prodDir -> pm1
    prodDir -> pm2
    prodDir -> pm3
    pm1 -> des1
    pm2 -> des2
    pm3 -> ux1
    pm3 -> ux2

    // Marketing
    mktDir -> mkt1
    mktDir -> mkt2
    mktDir -> mkt3
    mkt1 -> content1
    mkt1 -> content2
    mkt2 -> social1
    mkt2 -> social2

    // Sales
    salesDir -> salesMgr1
    salesDir -> salesMgr2
    salesMgr1 -> ae1
    salesMgr1 -> ae2
    salesMgr1 -> ae3
    salesMgr2 -> ae4
    salesMgr2 -> ae5
    salesMgr2 -> ae6
    salesMgr1 -> sdr1

    // Finance
    finDir -> acct1
    finDir -> acct2
    finDir -> fp1
    finDir -> fp2

    // Operations
    opsDir -> ops1
    opsDir -> ops2
    opsDir -> ops3

    // Cross-functional collaboration (selective to avoid clutter)
    pm1 -> dev1
    pm2 -> dev3
    pm3 -> dev5
    des1 -> dev2
    ux1 -> dev4
    mkt1 -> pm1
    ae1 -> pm2
    ops1 -> dev1
  }
}
```

:::

## Next Steps

- [Container Diagrams →](/examples/containers) - Architecture models
- [Shape Reference →](/reference/shapes) - All 54 shapes

---
