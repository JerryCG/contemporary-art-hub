$ErrorActionPreference = "Continue"
$proxy = "http://127.0.0.1:7897"
$ua = "ContemporaryArtHub/2.0 (https://github.com/JerryCG/contemporary-art-hub; educational)"
$root = "D:\cheng\Projects\contemporary-art-hub"
$log = Join-Path $root "scripts\upgrade-work-images.log"
$index = Get-Content (Join-Path $root "scripts\works-index.json") -Raw | ConvertFrom-Json

$skipSlugs = @(
  "number-1a-1948","no-61-rust-and-blue","woman-i","campbells-soup-cans","whaam",
  "just-what-is-it","one-and-three-chairs","untitled-number-5","silueta","tv-buddha",
  "self-portrait-inn-of-the-dawn-horse","the-elephant-celebes","cut-with-the-kitchen-knife",
  "guitar-and-bottles","still-life-1920","houses-at-estaque","violin-and-palette",
  "the-persistence-of-memory","guernica","the-dream","the-studio","woman-dressing-her-hair",
  "the-treachery-of-images","the-son-of-man","the-lovers-i","golconda","the-false-mirror",
  "fountain","bicycle-wheel","bottle-rack","l-h-o-o-q","why-not-sneeze-rose-selavy"
)

$freeLicense = 'public domain|cc0|cc-by|cc by|cc-by-sa|cc by-sa|pd-|gfdl|creativecommons'

function Write-Log($m) {
  $line = "$(Get-Date -Format o)  $m"
  Add-Content -Path $log -Value $line
  Write-Host $m
}

function Get-ImageSize($path) {
  Add-Type -AssemblyName System.Drawing
  try {
    $img = [System.Drawing.Image]::FromFile($path)
    $o = @{ w = $img.Width; h = $img.Height }
    $img.Dispose()
    return $o
  } catch { return @{ w = 0; h = 0 } }
}

function Search-Commons($query) {
  $url = "https://commons.wikimedia.org/w/api.php?action=query&format=json&list=search&srnamespace=6&srlimit=5&srsearch=" + [uri]::EscapeDataString($query)
  return (Invoke-RestMethod -Uri $url -UserAgent $ua -Proxy $proxy).query.search
}

function Get-CommonsInfo($title) {
  $url = "https://commons.wikimedia.org/w/api.php?action=query&format=json&prop=imageinfo&iiprop=url|size|mime|extmetadata&iiurlwidth=2560&titles=" + [uri]::EscapeDataString($title)
  $r = Invoke-RestMethod -Uri $url -UserAgent $ua -Proxy $proxy
  return $r.query.pages.PSObject.Properties.Value | Select-Object -First 1
}

function Get-Keywords($text) {
  $stop = @('the','a','an','of','and','in','on','at','to','for','with','from','by','or')
  return @($text.ToLower() -replace "[^a-z0-9\s]"," " -split '\s+' | Where-Object { $_.Length -gt 2 -and $stop -notcontains $_ })
}

function Test-TitleMatch($workTitle, $fileTitle) {
  $need = Get-Keywords $workTitle
  if ($need.Count -eq 0) { return $false }
  $have = ($fileTitle.ToLower())
  $hits = @($need | Where-Object { $have -like "*$_*" }).Count
  $min = [Math]::Min(2, $need.Count)
  return $hits -ge $min
}

function Test-FreeLicense($info) {
  $mime = [string]$info.imageinfo[0].mime
  if ($mime -and $mime -notmatch '^image/') { return $false }
  $meta = $info.imageinfo[0].extmetadata
  $blob = @(
    $meta.LicenseShortName.value,
    $meta.License.value,
    $meta.UsageTerms.value,
    $meta.Copyrighted.value
  ) -join " "
  if ($blob -match 'fair use|non-free|nonfree') { return $false }
  if ($blob -match $freeLicense) { return $true }
  if ($blob -match 'public domain') { return $true }
  return $false
}

function Save-IfBetter($dest, $url, $curW, $curH) {
  $tmp = "$dest.__tmp"
  & curl.exe -sL --proxy $proxy -A $ua -e "https://commons.wikimedia.org/" --max-time 90 -o $tmp $url
  if (-not (Test-Path $tmp) -or ((Get-Item $tmp).Length -lt 50000)) {
    Remove-Item $tmp -ErrorAction SilentlyContinue
    return $false
  }
  $got = Get-ImageSize $tmp
  if ($got.w -lt [Math]::Max(1200, $curW + 80)) {
    Remove-Item $tmp -ErrorAction SilentlyContinue
    return $false
  }
  if (($got.w * $got.h) -le ($curW * $curH * 1.25) -and $curW -ge 1400) {
    Remove-Item $tmp -ErrorAction SilentlyContinue
    return $false
  }
  Move-Item $tmp $dest -Force
  return $true
}

function Upgrade-One($title, $artist, $destRel) {
  $dest = Join-Path $root ("public" + ($destRel -replace "/","\"))
  if (-not (Test-Path $dest)) { Write-Log "MISS FILE $destRel"; return }
  $cur = Get-ImageSize $dest
  $queries = @(
    "`"$title`" $artist",
    "$title $artist painting",
    "$title $artist"
  )
  foreach ($q in $queries) {
    try { $hits = Search-Commons $q } catch { continue }
    foreach ($hit in $hits) {
      if ($hit.title -match '\.pdf$') { continue }
      if (-not (Test-TitleMatch $title $hit.title)) { continue }
      try { $page = Get-CommonsInfo $hit.title } catch { continue }
      if (-not $page.imageinfo) { continue }
      if (-not (Test-FreeLicense $page)) { continue }
      $ii = $page.imageinfo[0]
      $url = $ii.thumburl
      if (-not $url) { $url = $ii.url }
      if (Save-IfBetter $dest $url $cur.w $cur.h) {
        $now = Get-ImageSize $dest
        Write-Log "UP $destRel  $($cur.w)x$($cur.h) -> $($now.w)x$($now.h)  << $($hit.title)"
        return
      }
    }
  }
  Write-Log "KEEP $destRel  $($cur.w)x$($cur.h)"
}

Set-Content -Path $log -Value "start $(Get-Date -Format o)"
$n = 0
foreach ($w in $index) {
  $n++
  if ($skipSlugs -contains $w.slug) { Write-Log "SKIP $($w.slug)"; continue }
  if ($w.title -match 'artworks collection') { Write-Log "SKIP $($w.slug)"; continue }
  if ($w.image -match '\.svg$') { continue }
  Write-Log "[$n/$($index.Count)] $($w.title) / $($w.artist)"
  Upgrade-One $w.title $w.artist $w.image
}

Write-Log "done"
