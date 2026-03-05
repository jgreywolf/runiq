# Railroad Diagrams

Railroad diagrams visualize grammar and syntax rules using a left-to-right layout with branches, loops, and optional paths.

## Quick Start

```runiq
railroad "Expression Grammar" {
  diagram Expr = Term (("+" | "-") Term)*
  diagram Term = Factor (("*" | "/") Factor)*
  diagram Factor = Number | "(" Expr ")"
  diagram Number = digit+
  diagram digit = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9"
}
```

![Expression Grammar diagram](/examples/railroad/expression-grammar.svg)

## Arithmetic Grammar (Precedence)

```runiq
railroad "Arithmetic Grammar" {
  diagram Expr = Term (("+" | "-") Term)*
  diagram Term = Factor (("*" | "/") Factor)*
  diagram Factor = Number | "(" Expr ")"
  diagram Number = digit+
  diagram digit = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9"
}
```

## JSON Subset

```runiq
railroad "JSON Subset" {
  diagram Value = String | Number | Object | Array | "true" | "false" | "null"
  diagram Object = "{" (Pair ("," Pair)*)? "}"
  diagram Pair = String ":" Value
  diagram Array = "[" (Value ("," Value)*)? "]"
  diagram String = "\"" character* "\""
  diagram Number = digit+ ("." digit+)? ("e" ("+" | "-")? digit+)?
}
```

## URL Grammar

```runiq
railroad "URL Grammar" {
  diagram URL = Scheme "://" Host (":" Port)? Path? Query?
  diagram Scheme = "http" | "https"
  diagram Host = Subdomain ("." Subdomain)*
  diagram Subdomain = letter (letter | digit | "-")*
  diagram Port = digit+
  diagram Path = "/" Segment ("/" Segment)*
  diagram Segment = letter (letter | digit | "-" | "_")*
  diagram Query = "?" Pair ("&" Pair)*
  diagram Pair = Key "=" Value
  diagram Key = letter (letter | digit | "_" | "-")*
  diagram Value = letter (letter | digit | "_" | "-")*
  diagram digit = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9"
  diagram letter = "a" | "b" | "c" | "d" | "e" | "f" | "g" | "h" | "i" | "j" | "k" | "l" | "m" | "n" | "o" | "p" | "q" | "r" | "s" | "t" | "u" | "v" | "w" | "x" | "y" | "z"
}
```

![URL Grammar diagram](/examples/railroad/url-grammar.svg)

## Optional and Repetition

```runiq
railroad "Quantifiers" {
  diagram List = Item ("," Item)*
  diagram Item = Name ("=" Value)?
  diagram Name = letter (letter | digit)*
  diagram Value = digit+
}
```

## Loops and Optionals

```runiq
railroad "Loops and Optionals" {
  diagram Args = "(" (Arg ("," Arg)*)? ")"
  diagram Arg = Name ("=" Value)?
  diagram Name = letter (letter | digit | "_")*
  diagram Value = digit+ ("." digit+)?
  diagram digit = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9"
  diagram letter = "a" | "b" | "c" | "d" | "e" | "f" | "g" | "h" | "i" | "j" | "k" | "l" | "m" | "n" | "o" | "p" | "q" | "r" | "s" | "t" | "u" | "v" | "w" | "x" | "y" | "z"
}
```

![Loops and optionals railroad diagram](/examples/railroad/loops-optionals.svg)

## Options: Custom Colors

```runiq
railroad "Custom Colors" {
  theme runiq
  options markerColor:"#1f2937" operatorColor:"#2563eb" startMarker:circle endMarker:arrow
  options compact:true gap:16 branchPad:16 vGap:18 loop:20 boxPadX:12 boxPadY:8

  diagram Expr = Term (("+" | "-") Term)*
  diagram Term = Factor (("*" | "/") Factor)*
  diagram Factor = Number | "(" Expr ")"
  diagram Number = digit+
  diagram digit = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9"
}
```

![Custom colors railroad diagram](/examples/railroad/custom-colors.svg)

## Thumbnails

<div class="railroad-thumbnails">
  <img src="/examples/railroad/expression-grammar.svg" alt="Expression grammar thumbnail" />
  <img src="/examples/railroad/url-grammar.svg" alt="URL grammar thumbnail" />
  <img src="/examples/railroad/custom-colors.svg" alt="Custom colors thumbnail" />
  <img src="/examples/railroad/loops-optionals.svg" alt="Loops and optionals thumbnail" />
</div>

## Tips

<style>
.railroad-thumbnails {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
  margin: 1rem 0 2rem;
}

.railroad-thumbnails img {
  width: 100%;
  height: auto;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: #fff;
  padding: 0.5rem;
}
</style>

- Use parentheses to make precedence explicit.
- References are case-sensitive.
- If a reference is missing, the editor shows a warning with the missing name.

## See Also

- [Railroad Diagrams Guide](/guide/railroad-diagrams)
- [Profile System](/guide/profiles)
- [DSL Syntax Reference](/reference/dsl)
