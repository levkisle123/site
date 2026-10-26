"""Original geometric display alphabet for the furniture demo; no third-party glyphs."""
from pathlib import Path
import math
from fontTools.fontBuilder import FontBuilder
from fontTools.pens.ttGlyphPen import TTGlyphPen
from fontTools.feaLib.builder import addOpenTypeFeaturesFromString
ROOT=Path(__file__).resolve().parents[1]
shapes={}; advances={}

def make(name, draw, width=600):
    pen=TTGlyphPen(None)
    def poly(points, hole=False):
        area=sum(a[0]*b[1]-b[0]*a[1] for a,b in zip(points,points[1:]+points[:1]))
        if (area>0) != (not hole): points=list(reversed(points))
        pen.moveTo(points[0])
        for pt in points[1:]:pen.lineTo(pt)
        pen.closePath()
    def bar(x1,y1,x2,y2,t=116):
        dx=x2-x1;dy=y2-y1;length=math.hypot(dx,dy);nx=-dy/length*t/2;ny=dx/length*t/2
        poly([(round(x1+nx),round(y1+ny)),(round(x2+nx),round(y2+ny)),(round(x2-nx),round(y2-ny)),(round(x1-nx),round(y1-ny))])
    def ring(x,y,w,h,t=112):
        def rounded(xx,yy,ww,hh,c,hole=False):
            pts=[(xx+c,yy),(xx+ww-c,yy),(xx+ww,yy+c),(xx+ww,yy+hh-c),(xx+ww-c,yy+hh),(xx+c,yy+hh),(xx,yy+hh-c),(xx,yy+c)]
            # Smooth quadratic shoulders, retaining broad flat sides.
            if hole: pts.reverse()
            corners=[(xx+ww,yy),(xx+ww,yy+hh),(xx,yy+hh),(xx,yy)]
            if not hole:
                pen.moveTo(pts[0]);pen.lineTo(pts[1]);pen.qCurveTo(corners[0],pts[2]);pen.lineTo(pts[3]);pen.qCurveTo(corners[1],pts[4]);pen.lineTo(pts[5]);pen.qCurveTo(corners[2],pts[6]);pen.lineTo(pts[7]);pen.qCurveTo(corners[3],pts[0]);pen.closePath()
            else:
                pen.moveTo((xx+c,yy));pen.qCurveTo((xx,yy),(xx,yy+c));pen.lineTo((xx,yy+hh-c));pen.qCurveTo((xx,yy+hh),(xx+c,yy+hh));pen.lineTo((xx+ww-c,yy+hh));pen.qCurveTo((xx+ww,yy+hh),(xx+ww,yy+hh-c));pen.lineTo((xx+ww,yy+c));pen.qCurveTo((xx+ww,yy),(xx+ww-c,yy));pen.closePath()
        rounded(x,y,w,h,min(160,w/3,h/3))
        rounded(x+t,y+t,w-2*t,h-2*t,min(75,(h-2*t)/3),True)
    draw(poly,bar,ring)
    glyph=pen.glyph()
    # Consistent side bearings; outlines remain original polygons.
    if glyph.numberOfContours: glyph.coordinates.translate((40,0))
    shapes[name]=glyph;advances[name]=(width+80,40)

# Skeletons have slightly oblique joins and broad, open counters.
S={
'A':[(42,0,284,648),(284,648,520,0),(128,240,436,240)],
'E':[(52,0,52,700),(48,648,530,648),(48,350,475,350),(48,52,545,52)],
'F':[(52,0,52,700),(48,648,530,648),(48,350,465,350)],
'H':[(52,0,52,700),(548,0,548,700),(52,350,548,350)],
'I':[(52,0,52,700)],
'K':[(52,0,52,700),(90,320,520,660),(260,460,550,30)],
'L':[(52,0,52,700),(52,52,545,52)],
'M':[(52,0,52,700),(52,650,300,300),(300,300,548,650),(548,700,548,0)],
'N':[(52,0,52,700),(52,650,548,50),(548,0,548,700)],
'T':[(0,648,600,648),(300,648,300,0)],
'V':[(48,690,300,50),(300,50,552,690)],
'W':[(48,690,158,40),(158,40,300,390),(300,390,442,40),(442,40,552,690)],
'X':[(48,670,552,30),(48,30,552,670)],
'Y':[(42,680,300,355),(558,680,300,355),(300,355,300,0)],
'Z':[(10,648,548,648),(548,648,52,52),(52,52,590,52)]}
for n,lines in S.items():make(n,lambda p,b,r,ls=lines:[b(*a) for a in ls],120 if n=='I' else 600)
make('O',lambda p,b,r:r(0,0,650,700),650)
make('C',lambda p,b,r:(p([(600,610),(510,700),(112,700),(0,588),(0,112),(112,0),(510,0),(600,90),(530,166),(465,104),(158,104),(104,158),(104,542),(158,596),(465,596),(530,534)])),620)
make('G',lambda p,b,r:(p([(600,610),(510,700),(112,700),(0,588),(0,112),(112,0),(510,0),(600,90),(600,350),(340,350),(340,252),(496,252),(496,150),(465,104),(158,104),(104,158),(104,542),(158,596),(465,596),(530,534)])),620)
make('P',lambda p,b,r:(b(52,0,52,700),r(0,300,570,400)))
make('B',lambda p,b,r:(r(0,0,590,380),r(0,320,550,380),p([(0,0),(100,0),(100,700),(0,700)])))
make('R',lambda p,b,r:(b(52,0,52,700),r(0,300,570,400),b(300,320,568,25)))
make('D',lambda p,b,r:r(0,0,610,700),610)
make('Q',lambda p,b,r:(r(0,0,650,700),b(420,170,650,-40)),650)
make('U',lambda p,b,r:p([(0,700),(104,700),(104,160),(160,104),(440,104),(496,160),(496,700),(600,700),(600,110),(490,0),(110,0),(0,110)]))
make('J',lambda p,b,r:p([(40,648),(600,648),(600,110),(490,0),(110,0),(0,110),(0,250),(104,250),(104,160),(160,104),(440,104),(496,160),(496,596),(40,596)]))
make('S',lambda p,b,r:p([(600,610),(510,700),(100,700),(0,600),(0,400),(100,300),(440,300),(496,245),(496,160),(440,104),(155,104),(70,165),(0,85),(110,0),(490,0),(600,110),(600,290),(490,400),(160,400),(104,455),(104,540),(160,596),(465,596),(530,534)]))
# Cyrillic glyphs not shared with Latin.
make('CYR_BE',lambda p,b,r:(b(52,0,52,700),b(52,648,545,648),r(0,0,590,400)))
make('CYR_GHE',lambda p,b,r:(b(52,0,52,700),b(52,648,545,648)))
make('CYR_DE',lambda p,b,r:(b(45,52,610,52),b(45,104,45,-95),b(610,104,610,-95),b(125,100,230,648),b(230,648,515,648),b(515,648,515,100)),660)
make('CYR_ZHE',lambda p,b,r:(b(350,0,350,700),b(40,680,350,345),b(350,345,660,680),b(40,20,350,345),b(350,345,660,20)),700)
make('CYR_ZE',lambda p,b,r:(p([(0,615),(100,700),(490,700),(590,600),(590,430),(510,350),(600,260),(600,110),(490,0),(100,0),(0,85),(70,165),(150,104),(440,104),(496,160),(496,240),(440,296),(225,296),(225,400),(440,400),(486,450),(486,540),(430,596),(150,596),(70,535)])))
make('CYR_I',lambda p,b,r:(b(52,0,52,700),b(52,50,548,650),b(548,0,548,700)))
make('CYR_SHORTI',lambda p,b,r:(b(52,0,52,700),b(52,50,548,650),b(548,0,548,700),b(180,820,300,770,65),b(300,770,420,820,65)))
make('CYR_EL',lambda p,b,r:(b(20,15,200,648),b(200,648,548,648),b(548,0,548,700)))
make('CYR_PE',lambda p,b,r:(b(52,0,52,700),b(52,648,548,648),b(548,0,548,700)))
make('CYR_U',lambda p,b,r:(b(35,680,290,310),b(560,680,145,0)))
make('CYR_EF',lambda p,b,r:(r(0,115,690,475,95),b(345,-20,345,720)),690)
make('CYR_TSE',lambda p,b,r:(b(52,0,52,700),b(52,52,548,52),b(548,0,548,700),b(548,52,630,52),b(630,104,630,-95)),680)
make('CYR_CHE',lambda p,b,r:(b(52,700,52,340),b(52,340,548,340),b(548,700,548,0)))
make('CYR_SHA',lambda p,b,r:(b(52,700,52,0),b(350,700,350,0),b(648,700,648,0),b(52,52,648,52)),700)
make('CYR_SHCHA',lambda p,b,r:(b(52,700,52,0),b(350,700,350,0),b(648,700,648,0),b(52,52,728,52),b(728,104,728,-95)),780)
make('CYR_SOFT',lambda p,b,r:(b(52,0,52,700),r(0,0,590,400)))
make('CYR_HARD',lambda p,b,r:(b(0,648,220,648),b(170,0,170,700),r(118,0,590,400)),710)
make('CYR_YERU',lambda p,b,r:(b(52,0,52,700),r(0,0,550,400),b(688,0,688,700)),740)
make('CYR_E',lambda p,b,r:(p([(0,610),(90,700),(488,700),(600,588),(600,112),(488,0),(90,0),(0,90),(70,166),(135,104),(442,104),(496,158),(496,542),(442,596),(135,596),(70,534)]),b(260,350,548,350)))
make('CYR_YU',lambda p,b,r:(b(52,0,52,700),b(52,350,300,350),r(250,0,650,700)),900)
make('CYR_YA',lambda p,b,r:(r(0,300,570,400),b(518,0,518,700),b(275,320,30,25)))
make('CYR_YO',lambda p,b,r:([b(*a) for a in S['E']],b(170,800,170,850,76),b(425,800,425,850,76)))
# Numerals: open, architectural seven-segment forms.
segments={'a':(65,648,515,648),'b':(548,620,548,385),'c':(548,315,548,80),'d':(65,52,515,52),'e':(32,80,32,315),'f':(32,385,32,620),'g':(65,350,515,350)}
for digit,parts in enumerate(['abcdef','bc','abged','abgcd','fgbc','afgcd','afgecd','abc','abcdefg','abfgcd']):make('num'+str(digit),lambda p,b,r,parts=parts:[b(*segments[a],95) for a in parts])
make('period',lambda p,b,r:p([(0,0),(110,0),(110,110),(0,110)]),150)
make('comma',lambda p,b,r:p([(0,-100),(75,-100),(130,110),(20,110)]),155)
make('hyphen',lambda p,b,r:b(0,300,330,300,85),360)
make('slash',lambda p,b,r:b(30,-30,330,730,80),360)
make('exclam',lambda p,b,r:(b(60,235,60,700,100),p([(10,0),(110,0),(110,110),(10,110)])),150)
make('colon',lambda p,b,r:(p([(0,0),(100,0),(100,100),(0,100)]),p([(0,390),(100,390),(100,490),(0,490)])),150)
make('space',lambda p,b,r:None,230)
make('.notdef',lambda p,b,r:r(0,0,500,700,65),500)
mapc={ord(c):c for c in 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'}
ru='АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ'
names=['A','CYR_BE','B','CYR_GHE','CYR_DE','E','CYR_YO','CYR_ZHE','CYR_ZE','CYR_I','CYR_SHORTI','K','CYR_EL','M','H','O','CYR_PE','P','C','T','CYR_U','CYR_EF','X','CYR_TSE','CYR_CHE','CYR_SHA','CYR_SHCHA','CYR_HARD','CYR_YERU','CYR_SOFT','CYR_E','CYR_YU','CYR_YA']
for c,n in zip(ru,names):mapc[ord(c)]=n;mapc[ord(c.lower())]=n
for c in 'ABCDEFGHIJKLMNOPQRSTUVWXYZ':mapc[ord(c.lower())]=c
for i in range(10):mapc[ord(str(i))]='num'+str(i)
for chars,n in [(' \u00a0','space'),('.','period'),(',','comma'),('-–—','hyphen'),('/','slash'),('!','exclam'),(':','colon')]:
    for c in chars:mapc[ord(c)]=n
fb=FontBuilder(1000,isTTF=True)
fb.setupGlyphOrder(['.notdef']+[n for n in shapes if n!='.notdef']);fb.setupCharacterMap(mapc);fb.setupGlyf(shapes);fb.setupHorizontalMetrics(advances)
fb.setupHorizontalHeader(ascent=900,descent=-160);fb.setupNameTable({'familyName':'MVD Forma','styleName':'Display','uniqueFontIdentifier':'MVDFormaDisplay-1.0','fullName':'MVD Forma Display','psName':'MVDForma-Display','version':'Version 1.0'})
fb.setupOS2(sTypoAscender=900,sTypoDescender=-160,usWinAscent=920,usWinDescent=180,sCapHeight=700,sxHeight=700,usWeightClass=600,fsType=0);fb.setupPost();fb.setupMaxp()
addOpenTypeFeaturesFromString(fb.font,'feature kern { pos T A -35; pos A V -25; pos CYR_GHE A -30; pos T O -20; pos CYR_EL A -20; } kern;')
fb.font.save(ROOT/'fonts/mvd-forma/MVDForma-Display.ttf')
print('MVD Forma:',len(shapes),'glyphs;',len(mapc),'Unicode mappings')
