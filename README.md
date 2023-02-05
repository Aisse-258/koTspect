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

- обязательный параметр. Список JPG/PNG/PDF файлов, которые нужно сжать. Названия файлов не должны содержать пробелов.

'--grid1':'-G', - Big grid. Natural number. Default: 32 (px). Recommended to be a multiple of 8. Set it '0' to disable.

- Крупные плитки. Натуральное число. По умолчанию 32 (px). Рекомендуется брать числа кратные 8. Установите равным 0, чтобы не усреднять крупные плитки.

'--grid2':'-g', - Small grid. Natural number. Default: 16 (px). Recommended to be a multiple of 8.

- Мелкие плитки. Натуральное число.  По умолчанию 32 (px). Рекомендуется брать числа кратные 8.

'--simplify':'-s', - Colors uniform areas with their medium color. Default: true. Disable by --no-simplify .

- Закрашивать однородные плитки их средним цветом. По умолчанию true. Выключается параметром --no-simplify .

'--simplify-treshold', - Simplicity (uniform) treshold. Number >= 0 (no simplifying when = 0). Default: 10. Recommended step: 1. If simplifies too much, make it lower.

- Порог усреднения (однородности). Число >= 0 (не усредняет ничего при = 0). По умолчанию 10. Рекомендуемый шаг 1. Если усредняет лишнее - уменьшить (соотв. если усредняет не все кажущиеся однородными участки - увеличить).

'--colors-to-paper', - Colors "not paper" areas by color of nearest "paper" areas. Default: true. Disable by --no-colors-to-paper .

- Закрашивать "не бумажные" плитки цветом (средним) ближайших "бумажных" плиток. По умолчанию true. Выключается параметром --no-colors-to-paper . Для справки: Программа определяет "бумажные" плитки как "не цветные и однородные", и затем закрашивает цветные плитки средним цветом ближайших бумажных плиток. Таким образом, даже если усреднение плиток выключено, его порог --simplify-treshold всё ещё влияет на итог.

'--treshold':'-t', -Coloring treshold; number; default: 2; recommended step: 0.1. If colors too much make it bigger.

-Порог  закрашивания "не бумажных" плиток; число. По умолчанию 2. Рекомендуемый шаг: 0.1. Если закрашивает лишнее, увеличить (соотв. если остались явные незакрашенные цветные плитки, уменьшить).

'--height-divide':'-h', - Dividing to similar light areas by height. natural number; default: 2. Set it 1 to disable.

- Разделение на области однородного освещения по высоте. натуральное число. по умолчанию 2. Установите равным 1, чтобы отключить.

'-width-divide':'-w', - Dividing to similar light areas by width. natural number; default: 2.  Set it 1 to disable.

- Разделение на области однородного освещения по ширине. натуральное число. по умолчанию 2. Установите равным 1, чтобы отключить.

'--pixel-colors' - Colors pixels on the edge of "not paper" area and "paper" area. Default: true. Disable by --no-pixel-colors .

- Закрашивать цветные пиксели между "бумажными" и "не бумажными" плитками. По умолчанию true. Выключается параметром --no-pixel-colors .

'--dir-to-save':'-d', - where to save. Default: ./uploads .

- путь для сохранения выходного файла. По умолчанию ./uploads .

'--mk-pdf', - create PDF from images after all.

- поместить итоговые файлы в PDF файл.

'--mk-zip', - create ZIP from images after all.

- поместить итоговые файлы в ZIP архив.

'--color-system':'-c', - color space 'rgb' or 'hsv'

- цветовое пространство: 'rgb' или 'hsv'

Full command (all enabled):

```
node koTspect.js -t 2 -h 2 -w 2 -c rgb  -G 32 -g 16 --simplify-treshold 10 -f 'file1.jpg file2.jpg' -d './uploads' --mk-pdf --mk-zip
```

Run WEB UI local:

Local server: node app.js

Link: http://localhost:3000/webui/index.html
