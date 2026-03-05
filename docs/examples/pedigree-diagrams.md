---
title: Pedigree Diagrams
description: Family tree examples with spouses, children, and adoption.
---

# Pedigree Diagrams

## Family Tree Basics

```runiq
pedigree "Family Tree Basics" {
  people {
    p1 "Alex Rivera" dob:"1970-01-10" sex:male
    p2 "Jordan Lee" dob:"1972-05-22" sex:female
    c1 "Casey Rivera" dob:"1998-03-11" sex:female
    c2 "Morgan Rivera" dob:"2001-09-04" sex:male
  }

  families {
    p1 + p2 date:"1995-06-12" -> c1, c2
  }
}
```

## Second Spouse + Adoption

```runiq
pedigree "Second Spouse + Adoption" {
  people {
    a1 "Chris Kim" dob:"1968-08-04" sex:male
    a2 "Taylor Watts" dob:"1971-02-19" sex:female
    a3 "Riley Moore" dob:"1975-11-30" sex:female
    c1 "Avery Kim" dob:"1995-06-15" sex:unknown
    c2 "Logan Kim" dob:"2001-09-08" sex:male
  }

  families {
    a1 + a2 date:"1993-05-10" -> c1
    a1 + a3 date:"2000-07-22" -> c2 adopt
  }
}
```

## Multi-Generation Example

```runiq
pedigree "Three Generations" {
  people {
    g1 "Pat Lee" dob:"1942-04-12" sex:male
    g2 "Dana Lee" dob:"1944-12-09" sex:female
    p1 "Jamie Lee" dob:"1968-03-18" sex:female
    p2 "Robin Lee" dob:"1970-07-01" sex:male
    c1 "Sky Lee" dob:"1994-01-02" sex:unknown
  }

  families {
    g1 + g2 date:"1963-06-02" -> p1
    p1 + p2 date:"1990-09-20" -> c1
  }
}
```
