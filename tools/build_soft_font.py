"""Build MVD Forma Soft: a carefully widened Onest derivative (SIL OFL)."""
from pathlib import Path
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools.pens.recordingPen import DecomposingRecordingPen
from fontTools.pens.ttGlyphPen import TTGlyphPen
from fontTools.pens.transformPen import TransformPen
ROOT=Path(__file__).resolve().parents[1]
# Source fonts and OFL license are kept alongside the project.
# Merge the matching Latin and Cyrillic subsets before deriving the face.
from fontTools.merge import Merger
sources=[]
for subset in ['latin','cyrillic']:
 f=TTFont(ROOT/f'fonts/onest/onest-{subset}-wght-normal.woff2')
 f=instantiateVariableFont(f,{'wght':550},inplace=True)
 f.flavor=None
 p=ROOT/f'fonts/mvd-forma/.onest-{subset}.ttf';f.save(p);sources.append(str(p))
f=Merger().merge(sources)
original=f.getGlyphSet();out={}
for name in f.getGlyphOrder():
 recording=DecomposingRecordingPen(original);original[name].draw(recording)
 pen=TTGlyphPen(None);recording.replay(TransformPen(pen,(1.035,0,0,1,0,0)))
 out[name]=pen.glyph()
for name,glyph in out.items():f['glyf'][name]=glyph
for name,(advance,lsb) in f['hmtx'].metrics.items():f['hmtx'].metrics[name]=(round(advance*1.035),round(lsb*1.035))
for record in f['name'].names:
 if record.nameID in {1,2,3,4,6,16,17}:
  values={1:'MVD Forma Soft',2:'Medium',3:'MVDFormaSoft-1.0',4:'MVD Forma Soft Medium',6:'MVDFormaSoft-Medium',16:'MVD Forma Soft',17:'Medium'}
  record.string=values[record.nameID].encode(record.getEncoding())
f['OS/2'].usWeightClass=550;f['OS/2'].fsType=0
f.flavor=None;f.save(ROOT/'fonts/mvd-forma/MVDForma-Soft.ttf')
for p in sources:Path(p).unlink()
print('MVD Forma Soft generated:',len(f.getBestCmap()),'Unicode mappings')
