# Script to convert all kebab-case shape references in .runiq files to camelCase
# This handles the BREAKING CHANGE from kebab-case to camelCase shape IDs

$ErrorActionPreference = "Stop"

# Map of kebab-case to camelCase conversions
$replacements = @{
    # C4 Shapes
    '@c4-person' = '@c4Person'
    '@c4-system' = '@c4System'
    '@c4-container' = '@c4Container'
    '@c4-component' = '@c4Component'
    
    # UML Shapes
    '@send-signal' = '@sendSignal'
    '@receive-signal' = '@receiveSignal'
    '@vertical-fork' = '@verticalFork'
    
    # Flowchart Shapes
    '@multi-process' = '@multiProcess'
    '@curly-brace-annotation' = '@curlyBraceAnnotation'
    '@magnetic-tape' = '@magneticTape'
    
    # Data Flow Shapes
    '@external-entity' = '@externalEntity'
    '@external-entity-corner' = '@externalEntityCorner'
    '@process-circle' = '@processCircle'
    '@data-store-line' = '@dataStoreLine'
    '@data-store-left' = '@dataStoreLeft'
    '@data-store-open' = '@dataStoreOpen'
    
    # BPMN Shapes
    '@event-sub-process' = '@eventSubProcess'
    '@call-activity' = '@callActivity'
    '@start-non-interfering' = '@startNonInterfering'
    '@intermediate-non-interfering' = '@intermediateNonInterfering'
    
    # Basic Shapes
    '@star-filled' = '@starFilled'
    
    # Chart Shapes (already camelCase in shape def, but DSL may use kebab)
    '@pie-chart' = '@pieChart'
    '@bar-chart-vertical' = '@barChartVertical'
    '@bar-chart-horizontal' = '@barChartHorizontal'
    
    # Common shape references that may appear
    '@ellipse-wide' = '@ellipseWide'
    '@load-balancer' = '@loadBalancer'
    '@transfer-fn' = '@transferFn'
    '@sm-circ' = '@smCirc'
    '@curv-trap' = '@curvTrap'
    '@lean-r' = '@leanR'
    '@line-chart' = '@lineChart'
}

# Get all .runiq files recursively
$examplesPath = "C:\source\repos\Runiq\examples"
$files = Get-ChildItem -Path $examplesPath -Filter "*.runiq" -Recurse

Write-Host "Found $($files.Count) .runiq files to process" -ForegroundColor Cyan
Write-Host ""

$totalReplacements = 0
$filesModified = 0

foreach ($file in $files) {
    $content = Get-Content -Path $file.FullName -Raw
    $originalContent = $content
    $fileReplacements = 0
    
    foreach ($kebab in $replacements.Keys) {
        $camel = $replacements[$kebab]
        if ($content -match [regex]::Escape($kebab)) {
            $count = ([regex]::Matches($content, [regex]::Escape($kebab))).Count
            $content = $content -replace [regex]::Escape($kebab), $camel
            $fileReplacements += $count
            $totalReplacements += $count
        }
    }
    
    if ($content -ne $originalContent) {
        Set-Content -Path $file.FullName -Value $content -NoNewline
        $filesModified++
        Write-Host "✓ $($file.Name): $fileReplacements replacements" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "Conversion complete!" -ForegroundColor Green
Write-Host "Files modified: $filesModified" -ForegroundColor Yellow
Write-Host "Total replacements: $totalReplacements" -ForegroundColor Yellow
Write-Host "============================================" -ForegroundColor Cyan
