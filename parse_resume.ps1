$xmlPath = "extracted_document.xml"
$textPath = "resume_text.txt"
$xml = [System.IO.File]::ReadAllText($xmlPath, [System.Text.Encoding]::Unicode)
$text = $xml -replace '<[^>]+>', ' '
$text = $text -replace '\s+', ' '
[System.IO.File]::WriteAllText($textPath, $text, [System.Text.Encoding]::UTF8)
Write-Host "Wrote $textPath"