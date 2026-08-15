$ErrorActionPreference = "Continue"
$proxy = "http://127.0.0.1:7897"
$ua = "ContemporaryArtHub/2.0 (https://github.com/JerryCG/contemporary-art-hub; educational museum)"
$root = Split-Path -Parent $PSScriptRoot
if (-not $root) { $root = Get-Location }

$jobs = @(
  @{ dest = "public/images/works/the-cradle.jpg"; q = "Berthe Morisot The Cradle" },
  @{ dest = "public/images/works/boulevard-montmartre.jpg"; q = "Pissarro Boulevard Montmartre 1897" },
  @{ dest = "public/images/works/houses-at-estaque.jpg"; q = "Braque Houses L'Estaque 1908" },
  @{ dest = "public/images/works/violin-and-palette.jpg"; q = "Braque Violin and Palette" },
  @{ dest = "public/images/works/street-dresden.jpg"; q = "Kirchner Street Dresden Google Art" },
  @{ dest = "public/images/works/potsdamer-platz.jpg"; q = "Kirchner Potsdamer Platz" },
  @{ dest = "public/images/works/the-elephant-celebes.jpg"; q = "Max Ernst Elephant Celebes 1921" },
  @{ dest = "public/images/works/cut-with-the-kitchen-knife.jpg"; q = "Hannah Hoch Cut With the Kitchen Knife" },
  @{ dest = "public/images/works/monument-to-the-third-international.jpg"; q = "Tatlin Tower model 1919" },
  @{ dest = "public/images/works/jupiter-and-semele.jpg"; q = "Gustave Moreau Jupiter and Semele" },
  @{ dest = "public/images/works/the-cyclops.jpg"; q = "Odilon Redon The Cyclops" },
  @{ dest = "public/images/works/the-kiss.jpg"; q = "Klimt The Kiss Google Cultural Institute" },
  @{ dest = "public/images/works/composition-vii.jpg"; q = "Kandinsky Composition 7 1913" },
  @{ dest = "public/images/works/twittering-machine.jpg"; q = "Paul Klee Twittering Machine" },
  @{ dest = "public/images/works/composition-with-red-blue-and-yellow.jpg"; q = "Mondrian Composition II Red Blue Yellow 1930" },
  @{ dest = "public/images/works/counter-composition.jpg"; q = "Theo van Doesburg Counter-Composition" },
  @{ dest = "public/images/works/sunflowers.jpg"; q = "Vincent van Gogh Sunflowers Arles 1888" },
  @{ dest = "public/images/works/spiral-jetty.jpg"; q = "Robert Smithson Spiral Jetty Rozel Point" },
  @{ dest = "public/images/portraits/georges-braque.jpg"; q = "Georges Braque photograph 1908" },
  @{ dest = "public/images/portraits/berthe-morisot.jpg"; q = "Berthe Morisot portrait photograph" },
  @{ dest = "public/images/portraits/camille-pissarro.jpg"; q = "Camille Pissarro photograph" },
  @{ dest = "public/images/portraits/ernst-ludwig-kirchner.jpg"; q = "Ernst Ludwig Kirchner photograph" },
  @{ dest = "public/images/portraits/max-ernst.jpg"; q = "Max Ernst photograph 1909" },
  @{ dest = "public/images/portraits/hannah-hoch.jpg"; q = "Hannah Höch photograph" },
  @{ dest = "public/images/portraits/vladimir-tatlin.jpg"; q = "Vladimir Tatlin photograph" },
  @{ dest = "public/images/portraits/gustave-moreau.jpg"; q = "Gustave Moreau photograph" },
  @{ dest = "public/images/portraits/odilon-redon.jpg"; q = "Odilon Redon photograph" },
  @{ dest = "public/images/portraits/gustav-klimt.jpg"; q = "Gustav Klimt photograph" },
  @{ dest = "public/images/portraits/le-corbusier.jpg"; q = "Le Corbusier 1933 photograph" },
  @{ dest = "public/images/portraits/wassily-kandinsky.jpg"; q = "Wassily Kandinsky photograph" },
  @{ dest = "public/images/portraits/paul-klee.jpg"; q = "Paul Klee 1911 photograph" },
  @{ dest = "public/images/portraits/piet-mondrian.jpg"; q = "Piet Mondrian photograph" },
  @{ dest = "public/images/portraits/theo-van-doesburg.jpg"; q = "Theo van Doesburg photograph" },
  @{ dest = "public/images/portraits/amedee-ozenfant.jpg"; q = "Amedee Ozenfant photograph" },
  @{ dest = "public/images/movements/symbolism.jpg"; q = "Klimt The Kiss Google Cultural Institute" },
  @{ dest = "public/images/movements/abstract-art.jpg"; q = "Kandinsky Composition 7 1913" },
  @{ dest = "public/images/movements/de-stijl.jpg"; q = "Mondrian Composition II Red Blue Yellow 1930" }
)

function Get-CommonsThumb([string]$query) {
  $searchUrl = "https://commons.wikimedia.org/w/api.php?action=query&format=json&list=search&srnamespace=6&srlimit=3&srsearch=" + [uri]::EscapeDataString($query)
  $s = Invoke-RestMethod -Uri $searchUrl -UserAgent $ua -Proxy $proxy
  $title = $s.query.search[0].title
  if (-not $title) { return $null }
  $infoUrl = "https://commons.wikimedia.org/w/api.php?action=query&format=json&prop=imageinfo&iiprop=url|size|mime&iiurlwidth=1600&titles=" + [uri]::EscapeDataString($title)
  $i = Invoke-RestMethod -Uri $infoUrl -UserAgent $ua -Proxy $proxy
  $page = $i.query.pages.PSObject.Properties.Value | Select-Object -First 1
  $thumb = $page.imageinfo[0].thumburl
  if (-not $thumb) { $thumb = $page.imageinfo[0].url }
  return @{ title = $title; url = $thumb }
}

foreach ($job in $jobs) {
  $abs = Join-Path $root $job.dest
  $dir = Split-Path $abs -Parent
  New-Item -ItemType Directory -Force -Path $dir | Out-Null
  try {
    $hit = Get-CommonsThumb $job.q
    if (-not $hit -or -not $hit.url) { Write-Host "MISS $($job.dest)"; continue }
    $tmp = "$abs.tmp"
    & curl.exe -sL --proxy $proxy -A $ua -e "https://commons.wikimedia.org/" -o $tmp $hit.url
    if ((Test-Path $tmp) -and ((Get-Item $tmp).Length -gt 25000)) {
      Move-Item $tmp $abs -Force
      Write-Host "OK $((Get-Item $abs).Length) $($job.dest) << $($hit.title)"
    } else {
      $len = if (Test-Path $tmp) { (Get-Item $tmp).Length } else { 0 }
      Write-Host "BAD $len $($job.dest)"
      Remove-Item $tmp -ErrorAction SilentlyContinue
    }
  } catch {
    Write-Host "FAIL $($job.dest) $($_.Exception.Message)"
  }
}
