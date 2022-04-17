# koTspect
______________________________________

[![NPM](https://nodei.co/npm/koTspect.png?downloads=true&stars=true)](https://nodei.co/npm/koTspect/)

**WEB UI**: [koTspect](http://391701-cn25543.tmweb.ru/webui/index.html)

**CLI**:

**Compress images**

```
node koTspect.js {-f 'file1.jpg file2.jpg ...'}
```
**Options**

'--files':'-f' - required option. List of JPG/PNG/PDF files to compress. File names must not contain spaces.

'--grid1':'-G', - Big grid. Natural number. Default: 32 (px). Recommended to be a multiple of 8. Set it '0' to disable.

'--grid2':'-g', - Small grid. Natural number. Default: 16 (px). Recommended to be a multiple of 8.

'--simplify':'-s', - Colors uniform areas with their medium color. Default: true. Disable by --no-simplify .

'--simplify-treshold', - Simplicity (uniform) treshold. Number >= 0 (no simplifying when = 0). Default: 10. Recommended step: 1. If simplifies too much, make it lower.

'--colors-to-paper', - Colors "not paper" areas by color of nearest "paper" areas. Default: true. Disable by --no-colors-to-paper .

'--treshold':'-t', -Coloring treshold; number; default: 2; recommended step: 0.1. If colors too much make it bigger.

'--height-divide':'-h', - Dividing to similar light areas by height. natural number; default: 2. Set it 1 to disable.

'-width-divide':'-w', - Dividing to similar light areas by width. natural number; default: 2.  Set it 1 to disable.

'--pixel-colors' - Colors pixels on the edge of "not paper" area and "paper" area. Default: true. Disable by --no-pixel-colors .

'--dir-to-save':'-d', - where to save. Default: ./uploads .

'--mk-pdf', - create PDF from images after all.

'--mk-zip', - create ZIP from images after all.

'--color-system':'-c', - color space 'rgb' or 'hsv'

Full command (all enabled):

```
node koTspect.js -t 2 -h 2 -w 2 -c rgb  -G 32 -g 16 --simplify-treshold 10 -f 'file1.jpg file2.jpg' --mk-pdf --mk-zip
```
