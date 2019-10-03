/*
 * import-activity-list.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import cheerio from 'cheerio'
import { LanguageCode } from '@Types/common'
import ActivityService from '@Services/activity/activity.service'
import mongoose from '@Config/connections/mongoose'


const pageHTML: string = `<h2 class="pagenumber">Page 1</h2>
<table class="table table-striped table-bordered">
  <tr>
    <td colspan="6">The Compendium of Physical Activities Tracking Guide</td>
  </tr>
  <tr>
    <td colspan="6">KEY<br />Blue text = new activity was added to the descritipon of that specific compendium
      code<br />If compcode and METS columns are blank under 1993 this means that the 2000 compcode and METS wasadded to
      the new addition to the compendium<br />If compcode and METS columns are blank under 2000 this means that the 1993
      compcode and METS wasremoved from the new addition of the compendium</td>
  </tr>
  <tr>
    <td style="text-align: right" colspan="6">1993 2000</td>
  </tr>
  <tr>
    <td>compcode</td>
    <td>METS</td>
    <td>compcode</td>
    <td>METS</td>
    <td>heading</td>
    <td>description</td>
  </tr>
  <tr>
    <td style="text-align: right">01009</td>
    <td style="text-align: right">8.5</td>
    <td style="text-align: right">01009</td>
    <td style="text-align: right">8.5</td>
    <td>bicycling</td>
    <td>bicycling, BMX or mountain</td>
  </tr>
  <tr>
    <td style="text-align: right">01010</td>
    <td style="text-align: right">4.0</td>
    <td style="text-align: right">01010</td>
    <td style="text-align: right">4.0</td>
    <td>bicycling</td>
    <td>bicycling, &lt;10 mph, leisure, to work or for pleasure (Taylor Code 115</td>
  </tr>
  <tr>
    <td></td>
    <td></td>
    <td style="text-align: right">01015</td>
    <td style="text-align: right">8.0</td>
    <td>bicycling</td>
    <td>bicycling, general</td>
  </tr>
  <tr>
    <td style="text-align: right">01020</td>
    <td style="text-align: right">6.0</td>
    <td style="text-align: right">01020</td>
    <td style="text-align: right">6.0</td>
    <td>bicycling</td>
    <td>bicycling, 10-11.9 mph, leisure, slow, light effort</td>
  </tr>
  <tr>
    <td style="text-align: right">01030</td>
    <td style="text-align: right">8.0</td>
    <td style="text-align: right">01030</td>
    <td style="text-align: right">8.0</td>
    <td>bicycling</td>
    <td>bicycling, 12-13.9 mph, leisure, moderate effort</td>
  </tr>
  <tr>
    <td style="text-align: right">01040</td>
    <td style="text-align: right">10.0</td>
    <td style="text-align: right">01040</td>
    <td style="text-align: right">10.0</td>
    <td>bicycling</td>
    <td>bicycling, 14-15.9 mph, racing or leisure, fast, vigorous effor</td>
  </tr>
  <tr>
    <td style="text-align: right">01050</td>
    <td style="text-align: right">12.0</td>
    <td style="text-align: right">01050</td>
    <td style="text-align: right">12.0</td>
    <td>bicycling</td>
    <td>bicycling, 16-19 mph, racing/not drafting or &gt;19 mph drafting, very fast, racing genera</td>
  </tr>
  <tr>
    <td style="text-align: right">01060</td>
    <td style="text-align: right">16.0</td>
    <td style="text-align: right">01060</td>
    <td style="text-align: right">16.0</td>
    <td>bicycling</td>
    <td>bicycling, &gt;20 mph, racing, not drafting</td>
  </tr>
  <tr>
    <td style="text-align: right">01070</td>
    <td style="text-align: right">5.0</td>
    <td style="text-align: right">01070</td>
    <td style="text-align: right">5.0</td>
    <td>bicycling</td>
    <td>unicycling</td>
  </tr>
  <tr>
    <td style="text-align: right">02010</td>
    <td style="text-align: right">5.0</td>
    <td style="text-align: right">02010</td>
    <td style="text-align: right">7.0</td>
    <td>conditioning exercise</td>
    <td>bicycling, stationary, general</td>
  </tr>
  <tr>
    <td style="text-align: right">02011</td>
    <td style="text-align: right">3.0</td>
    <td style="text-align: right">02011</td>
    <td style="text-align: right">3.0</td>
    <td>conditioning exercise</td>
    <td>bicycling, stationary, 50 watts, very light effor</td>
  </tr>
  <tr>
    <td style="text-align: right">02012</td>
    <td style="text-align: right">5.5</td>
    <td style="text-align: right">02012</td>
    <td style="text-align: right">5.5</td>
    <td>conditioning exercise</td>
    <td>bicycling, stationary, 100 watts, light effor</td>
  </tr>
  <tr>
    <td style="text-align: right">02013</td>
    <td style="text-align: right">7.0</td>
    <td style="text-align: right">02013</td>
    <td style="text-align: right">7.0</td>
    <td>conditioning exercise</td>
    <td>bicycling, stationary, 150 watts, moderate effor</td>
  </tr>
  <tr>
    <td style="text-align: right">02014</td>
    <td style="text-align: right">10.5</td>
    <td style="text-align: right">02014</td>
    <td style="text-align: right">10.5</td>
    <td>conditioning exercise</td>
    <td>bicycling, stationary, 200 watts, vigorous effor</td>
  </tr>
  <tr>
    <td style="text-align: right">02015</td>
    <td style="text-align: right">12.5</td>
    <td style="text-align: right">02015</td>
    <td style="text-align: right">12.5</td>
    <td>conditioning exercise</td>
    <td>bicycling, stationary, 250 watts, very vigorous effor</td>
  </tr>
  <tr>
    <td style="text-align: right">02020</td>
    <td style="text-align: right">8.0</td>
    <td style="text-align: right">02020</td>
    <td style="text-align: right">8.0</td>
    <td>conditioning exercise</td>
    <td>calisthenics (e.g. pushups, situps, pullups, jumping jacks), heavy, vigorous effort</td>
  </tr>
  <tr>
    <td style="text-align: right">02030</td>
    <td style="text-align: right">4.5</td>
    <td style="text-align: right">02030</td>
    <td style="text-align: right">3.5</td>
    <td>conditioning exercise</td>
    <td>calisthenics, home exercise, light or moderate effort, general (example: back exercises), going up &amp; down
      from floor (Taylor Code 150</td>
  </tr>
  <tr>
    <td style="text-align: right">02040</td>
    <td style="text-align: right">8.0</td>
    <td style="text-align: right">02040</td>
    <td style="text-align: right">8.0</td>
    <td>conditioning exercise</td>
    <td>circuit training, including some aerobic movement with minimal rest, general</td>
  </tr>
  <tr>
    <td style="text-align: right">02050</td>
    <td style="text-align: right">6.0</td>
    <td style="text-align: right">02050</td>
    <td style="text-align: right">6.0</td>
    <td>conditioning exercise</td>
    <td>weight lifting (free weight, nautilus or universal-type), power lifting or body building, vigorous effort
      (Taylor Code 210</td>
  </tr>
  <tr>
    <td style="text-align: right">02060</td>
    <td style="text-align: right">5.5</td>
    <td style="text-align: right">02060</td>
    <td style="text-align: right">5.5</td>
    <td>conditioning exercise</td>
    <td>health club exercise, general (Taylor Code 160</td>
  </tr>
  <tr>
    <td style="text-align: right">02065</td>
    <td style="text-align: right">6.0</td>
    <td style="text-align: right">02065</td>
    <td style="text-align: right">9.0</td>
    <td>conditioning exercise</td>
    <td>stair-treadmill ergometer, general</td>
  </tr>
  <tr>
    <td style="text-align: right">02070</td>
    <td style="text-align: right">9.5</td>
    <td style="text-align: right">02070</td>
    <td style="text-align: right">7.0</td>
    <td>conditioning exercise</td>
    <td>rowing, stationary ergometer, genera</td>
  </tr>
  <tr>
    <td style="text-align: right">02071</td>
    <td style="text-align: right">3.5</td>
    <td style="text-align: right">02071</td>
    <td style="text-align: right">3.5</td>
    <td>conditioning exercise</td>
    <td>rowing, stationary, 50 watts, light effort</td>
  </tr>
  <tr>
    <td style="text-align: right">02072</td>
    <td style="text-align: right">7.0</td>
    <td style="text-align: right">02072</td>
    <td style="text-align: right">7.0</td>
    <td>conditioning exercise</td>
    <td>rowing, stationary, 100 watts, moderate effor</td>
  </tr>
  <tr>
    <td style="text-align: right">02073</td>
    <td style="text-align: right">8.5</td>
    <td style="text-align: right">02073</td>
    <td style="text-align: right">8.5</td>
    <td>conditioning exercise</td>
    <td>rowing, stationary, 150 watts, vigorous effor</td>
  </tr>
  <tr>
    <td style="text-align: right">02074</td>
    <td style="text-align: right">12.0</td>
    <td style="text-align: right">02074</td>
    <td style="text-align: right">12.0</td>
    <td>conditioning exercise</td>
    <td>rowing, stationary, 200 watts, very vigorous effor</td>
  </tr>
  <tr>
    <td style="text-align: right">02080</td>
    <td style="text-align: right">9.5</td>
    <td style="text-align: right">02080</td>
    <td style="text-align: right">7.0</td>
    <td>conditioning exercise</td>
    <td>ski machine, general</td>
  </tr>
  <tr>
    <td style="text-align: right">02090</td>
    <td style="text-align: right">6.0</td>
    <td style="text-align: right">02090</td>
    <td style="text-align: right">6.0</td>
    <td>conditioning exercise</td>
    <td>slimnastics, jazzercise</td>
  </tr>
  <tr>
    <td style="text-align: right">02100</td>
    <td style="text-align: right">4.0</td>
    <td style="text-align: right">02100</td>
    <td style="text-align: right">2.5</td>
    <td>conditioning exercise</td>
    <td>stretching, hatha yoga</td>
  </tr>
  <tr>
    <td></td>
    <td></td>
    <td style="text-align: right">02101</td>
    <td style="text-align: right">2.5</td>
    <td>conditioning exercise</td>
    <td>mild stretching</td>
  </tr>
  <tr>
    <td style="text-align: right">02110</td>
    <td style="text-align: right">6.0</td>
    <td style="text-align: right">02110</td>
    <td style="text-align: right">6.0</td>
    <td>conditioning exercise</td>
    <td>teaching aerobic exercise class</td>
  </tr>
  <tr>
    <td style="text-align: right">02120</td>
    <td style="text-align: right">4.0</td>
    <td style="text-align: right">02120</td>
    <td style="text-align: right">4.0</td>
    <td>conditioning exercise</td>
    <td>water aerobics, water calisthenics</td>
  </tr>
  <tr>
    <td style="text-align: right">02130</td>
    <td style="text-align: right">3.0</td>
    <td style="text-align: right">02130</td>
    <td style="text-align: right">3.0</td>
    <td>conditioning exercise</td>
    <td>weight lifting (free, nautilus or universal-type), light or moderate effort, light workout, genera</td>
  </tr>
  <tr>
    <td style="text-align: right">02135</td>
    <td style="text-align: right">1.0</td>
    <td style="text-align: right">02135</td>
    <td style="text-align: right">1.0</td>
    <td>conditioning exercise</td>
    <td>whirlpool, sitting</td>
  </tr>
  <tr>
    <td style="text-align: right">03010</td>
    <td style="text-align: right">6.0</td>
    <td style="text-align: right">03010</td>
    <td style="text-align: right">4.8</td>
    <td>dancing</td>
    <td>ballet or modern, twist, jazz, tap, jitterbug</td>
  </tr>
  <tr>
    <td style="text-align: right">03015</td>
    <td style="text-align: right">6.0</td>
    <td style="text-align: right">03015</td>
    <td style="text-align: right">6.5</td>
    <td>dancing</td>
    <td>aerobic, general</td>
  </tr>
  <tr>
    <td></td>
    <td></td>
    <td style="text-align: right">03016</td>
    <td style="text-align: right">8.5</td>
    <td>dancing</td>
    <td>aerobic, step, with 6 – 8 inch step</td>
  </tr>
  <tr>
    <td></td>
    <td></td>
    <td style="text-align: right">03017</td>
    <td style="text-align: right">10.0</td>
    <td>dancing</td>
    <td>aerobic, step, with 10 – 12 inch step</td>
  </tr>
  <tr>
    <td style="text-align: right">03020</td>
    <td style="text-align: right">5.0</td>
    <td style="text-align: right">03020</td>
    <td style="text-align: right">5.0</td>
    <td>dancing</td>
    <td>aerobic, low impact</td>
  </tr>
  <tr>
    <td style="text-align: right">03021</td>
    <td style="text-align: right">7.0</td>
    <td style="text-align: right">03021</td>
    <td style="text-align: right">7.0</td>
    <td>dancing</td>
    <td>aerobic, high impact</td>
  </tr>
  <tr>
    <td style="text-align: right">03025</td>
    <td style="text-align: right">4.5</td>
    <td style="text-align: right">03025</td>
    <td style="text-align: right">4.5</td>
    <td>dancing</td>
    <td>general, Greek, Middle Eastern, hula, flamenco, belly, and swing dancing</td>
  </tr>
  <tr>
    <td style="text-align: right">03030</td>
    <td style="text-align: right">5.5</td>
    <td style="text-align: right">03030</td>
    <td style="text-align: right">5.5</td>
    <td>dancing</td>
    <td>ballroom, dancing fast (Taylor Code 125)</td>
  </tr>
  <tr>
    <td></td>
    <td></td>
    <td style="text-align: right">03031</td>
    <td style="text-align: right">4.5</td>
    <td>dancing</td>
    <td>ballroom, fast (disco, folk, square), line dancing, Irish step dancing, polka, contra, country</td>
  </tr>
  <tr>
    <td style="text-align: right">03040</td>
    <td style="text-align: right">3.0</td>
    <td style="text-align: right">03040</td>
    <td style="text-align: right">3.0</td>
    <td>dancing</td>
    <td>ballroom, slow (e.g. waltz, foxtrot, slow dancing), samba, tango, 19th C, mambo, chacha</td>
  </tr>
  <tr>
    <td></td>
    <td></td>
    <td style="text-align: right">03050</td>
    <td style="text-align: right">5.5</td>
    <td>dancing</td>
    <td>Anishinaabe Jingle Dancing or other traditional American Indian dancing</td>
  </tr>
  <tr>
    <td style="text-align: right">04001</td>
    <td style="text-align: right">4.0</td>
    <td style="text-align: right">04001</td>
    <td style="text-align: right">3.0</td>
    <td>fishing and hunting</td>
    <td>fishing, general</td>
  </tr>
  <tr>
    <td style="text-align: right">04010</td>
    <td style="text-align: right">4.0</td>
    <td style="text-align: right">04010</td>
    <td style="text-align: right">4.0</td>
    <td>fishing and hunting</td>
    <td>digging worms, with shovel</td>
  </tr>
  <tr>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td>Page 1 of 12</td>
  </tr>
</table>
<h2 class="pagenumber">Page 2</h2>
<table class="table table-striped table-bordered">
  <tr>
    <td style="text-align: right">1993</td>
    <td></td>
    <td style="text-align: right">2000</td>
    <td></td>
    <td></td>
    <td></td>
  </tr>
  <tr>
    <td>compcode</td>
    <td>METS</td>
    <td>compcode</td>
    <td>METS</td>
    <td>heading</td>
    <td>description</td>
  </tr>
  <tr>
    <td style="text-align: right">04020</td>
    <td style="text-align: right">5.0</td>
    <td style="text-align: right">04020</td>
    <td style="text-align: right">4.0</td>
    <td>fishing and hunting</td>
    <td>fishing from river bank and walking</td>
  </tr>
  <tr>
    <td style="text-align: right">04030</td>
    <td style="text-align: right">2.5</td>
    <td style="text-align: right">04030</td>
    <td style="text-align: right">2.5</td>
    <td>fishing and hunting</td>
    <td>fishing from boat, sitting</td>
  </tr>
  <tr>
    <td style="text-align: right">04040</td>
    <td style="text-align: right">3.5</td>
    <td style="text-align: right">04040</td>
    <td style="text-align: right">3.5</td>
    <td>fishing and hunting</td>
    <td>fishing from river bank, standing (Taylor Code 660)</td>
  </tr>
  <tr>
    <td style="text-align: right">04050</td>
    <td style="text-align: right">6.0</td>
    <td style="text-align: right">04050</td>
    <td style="text-align: right">6.0</td>
    <td>fishing and hunting</td>
    <td>fishing in stream, in waders (Taylor Code 670)</td>
  </tr>
  <tr>
    <td style="text-align: right">04060</td>
    <td style="text-align: right">2.0</td>
    <td style="text-align: right">04060</td>
    <td style="text-align: right">2.0</td>
    <td>fishing and hunting</td>
    <td>fishing, ice, sitting</td>
  </tr>
  <tr>
    <td style="text-align: right">04070</td>
    <td style="text-align: right">2.5</td>
    <td style="text-align: right">04070</td>
    <td style="text-align: right">2.5</td>
    <td>fishing and hunting</td>
    <td>hunting, bow and arrow or crossbow</td>
  </tr>
  <tr>
    <td style="text-align: right">04080</td>
    <td style="text-align: right">6.0</td>
    <td style="text-align: right">04080</td>
    <td style="text-align: right">6.0</td>
    <td>fishing and hunting</td>
    <td>hunting, deer, elk, large game (Taylor Code 170)</td>
  </tr>
  <tr>
    <td style="text-align: right">04090</td>
    <td style="text-align: right">2.5</td>
    <td style="text-align: right">04090</td>
    <td style="text-align: right">2.5</td>
    <td>fishing and hunting</td>
    <td>hunting, duck, wading</td>
  </tr>
  <tr>
    <td style="text-align: right">04100</td>
    <td style="text-align: right">5.0</td>
    <td style="text-align: right">04100</td>
    <td style="text-align: right">5.0</td>
    <td>fishing and hunting</td>
    <td>hunting, general</td>
  </tr>
  <tr>
    <td style="text-align: right">04110</td>
    <td style="text-align: right">6.0</td>
    <td style="text-align: right">04110</td>
    <td style="text-align: right">6.0</td>
    <td>fishing and hunting</td>
    <td>hunting, pheasants or grouse (Taylor Code 680</td>
  </tr>
  <tr>
    <td style="text-align: right">04120</td>
    <td style="text-align: right">5.0</td>
    <td style="text-align: right">04120</td>
    <td style="text-align: right">5.0</td>
    <td>fishing and hunting</td>
    <td>hunting, rabbit, squirrel, prairie chick, raccoon, small game (Taylor Code 690)</td>
  </tr>
  <tr>
    <td style="text-align: right">04130</td>
    <td style="text-align: right">2.5</td>
    <td style="text-align: right">04130</td>
    <td style="text-align: right">2.5</td>
    <td>fishing and hunting</td>
    <td>pistol shooting or trap shooting, standing</td>
  </tr>
  <tr>
    <td style="text-align: right">05010</td>
    <td style="text-align: right">2.5</td>
    <td style="text-align: right">05010</td>
    <td style="text-align: right">3.3</td>
    <td>home activities</td>
    <td>carpet sweeping, sweeping floors</td>
  </tr>
  <tr>
    <td style="text-align: right">05020</td>
    <td style="text-align: right">4.5</td>
    <td style="text-align: right">05020</td>
    <td style="text-align: right">3.0</td>
    <td>home activities</td>
    <td>cleaning, heavy or major (e.g. wash car, wash windows, clean garage), vigorous effor</td>
  </tr>
  <tr>
    <td></td>
    <td></td>
    <td style="text-align: right">05021</td>
    <td style="text-align: right">3.5</td>
    <td>home activities</td>
    <td>mopping</td>
  </tr>
  <tr>
    <td></td>
    <td></td>
    <td style="text-align: right">05025</td>
    <td style="text-align: right">2.5</td>
    <td>home activities</td>
    <td>multiple household tasks all at once, light effor</td>
  </tr>
  <tr>
    <td></td>
    <td></td>
    <td style="text-align: right">05026</td>
    <td style="text-align: right">3.5</td>
    <td>home activities</td>
    <td>multiple household tasks all at once, moderate effor</td>
  </tr>
  <tr>
    <td></td>
    <td></td>
    <td style="text-align: right">05027</td>
    <td style="text-align: right">4.0</td>
    <td>home activities</td>
    <td>multiple household tasks all at once, vigorous effor</td>
  </tr>
  <tr>
    <td style="text-align: right">05030</td>
    <td style="text-align: right">3.5</td>
    <td style="text-align: right">05030</td>
    <td style="text-align: right">3.0</td>
    <td>home activities</td>
    <td>cleaning, house or cabin, genera</td>
  </tr>
  <tr>
    <td style="text-align: right">05040</td>
    <td style="text-align: right">2.5</td>
    <td style="text-align: right">05040</td>
    <td style="text-align: right">2.5</td>
    <td>home activities</td>
    <td>cleaning, light (dusting, straightening up, changing linen, carrying out trash</td>
  </tr>
  <tr>
    <td style="text-align: right">05041</td>
    <td style="text-align: right">2.3</td>
    <td style="text-align: right">05041</td>
    <td style="text-align: right">2.3</td>
    <td>home activities</td>
    <td>wash dishes - standing or in general (not broken into stand/walk components</td>
  </tr>
  <tr>
    <td style="text-align: right">05042</td>
    <td style="text-align: right">2.3</td>
    <td style="text-align: right">05042</td>
    <td style="text-align: right">2.5</td>
    <td>home activities</td>
    <td>wash dishes; clearing dishes from table – walking</td>
  </tr>
  <tr>
    <td></td>
    <td></td>
    <td style="text-align: right">05043</td>
    <td style="text-align: right">3.5</td>
    <td>home activities</td>
    <td>vacuuming</td>
  </tr>
  <tr>
    <td></td>
    <td></td>
    <td style="text-align: right">05045</td>
    <td style="text-align: right">6.0</td>
    <td>home activities</td>
    <td>butchering animals</td>
  </tr>
  <tr>
    <td style="text-align: right">05050</td>
    <td style="text-align: right">2.5</td>
    <td style="text-align: right">05050</td>
    <td style="text-align: right">2.0</td>
    <td>home activities</td>
    <td>cooking or food preparation - standing or sitting or in general (not broken into stand/walk components), manual
      appliance</td>
  </tr>
  <tr>
    <td style="text-align: right">05051</td>
    <td style="text-align: right">2.5</td>
    <td style="text-align: right">05051</td>
    <td style="text-align: right">2.5</td>
    <td>home activities</td>
    <td>serving food, setting table - implied walking or standing</td>
  </tr>
  <tr>
    <td style="text-align: right">05052</td>
    <td style="text-align: right">2.5</td>
    <td style="text-align: right">05052</td>
    <td style="text-align: right">2.5</td>
    <td>home activities</td>
    <td>cooking or food preparation - walking</td>
  </tr>
  <tr>
    <td></td>
    <td></td>
    <td style="text-align: right">05053</td>
    <td style="text-align: right">2.5</td>
    <td>home activities</td>
    <td>feeding animals</td>
  </tr>
  <tr>
    <td style="text-align: right">05055</td>
    <td style="text-align: right">2.5</td>
    <td style="text-align: right">05055</td>
    <td style="text-align: right">2.5</td>
    <td>home activities</td>
    <td>putting away groceries (e.g. carrying groceries, shopping without a grocery cart), carrying packages</td>
  </tr>
  <tr>
    <td style="text-align: right">05056</td>
    <td style="text-align: right">8.0</td>
    <td style="text-align: right">05056</td>
    <td style="text-align: right">7.5</td>
    <td>home activities</td>
    <td>carrying groceries upstairs</td>
  </tr>
  <tr>
    <td></td>
    <td></td>
    <td style="text-align: right">05057</td>
    <td style="text-align: right">3.0</td>
    <td>home activities</td>
    <td>cooking Indian bread on an outside stove</td>
  </tr>
  <tr>
    <td style="text-align: right">05060</td>
    <td style="text-align: right">3.5</td>
    <td style="text-align: right">05060</td>
    <td style="text-align: right">2.3</td>
    <td>home activities</td>
    <td>food shopping with or without a grocery cart, standing or walking</td>
  </tr>
  <tr>
    <td style="text-align: right">05065</td>
    <td style="text-align: right">2.0</td>
    <td style="text-align: right">05065</td>
    <td style="text-align: right">2.3</td>
    <td>home activities</td>
    <td>non-food shopping, standing or walking</td>
  </tr>
  <tr>
    <td style="text-align: right">05066</td>
    <td style="text-align: right">2.3</td>
    <td></td>
    <td></td>
    <td>home activities</td>
    <td>walking shopping (non-grocery shopping)</td>
  </tr>
  <tr>
    <td style="text-align: right">05070</td>
    <td style="text-align: right">2.3</td>
    <td style="text-align: right">05070</td>
    <td style="text-align: right">2.3</td>
    <td>home activities</td>
    <td>ironing</td>
  </tr>
  <tr>
    <td style="text-align: right">05080</td>
    <td style="text-align: right">1.5</td>
    <td style="text-align: right">05080</td>
    <td style="text-align: right">1.5</td>
    <td>home activities</td>
    <td>sitting - knitting, sewing, lt. wrapping (presents)</td>
  </tr>
  <tr>
    <td style="text-align: right">05090</td>
    <td style="text-align: right">2.0</td>
    <td style="text-align: right">05090</td>
    <td style="text-align: right">2.0</td>
    <td>home activities</td>
    <td>implied standing - laundry, fold or hang clothes, put clothes in washer or dryer, packing suitcase</td>
  </tr>
  <tr>
    <td style="text-align: right">05095</td>
    <td style="text-align: right">2.3</td>
    <td style="text-align: right">05095</td>
    <td style="text-align: right">2.3</td>
    <td>home activities</td>
    <td>implied walking - putting away clothes, gathering clothes to pack, putting away laundry</td>
  </tr>
  <tr>
    <td style="text-align: right">05100</td>
    <td style="text-align: right">2.0</td>
    <td style="text-align: right">05100</td>
    <td style="text-align: right">2.0</td>
    <td>home activities</td>
    <td>making bed</td>
  </tr>
  <tr>
    <td style="text-align: right">05110</td>
    <td style="text-align: right">5.0</td>
    <td style="text-align: right">05110</td>
    <td style="text-align: right">5.0</td>
    <td>home activities</td>
    <td>maple syruping/sugar bushing (including carrying buckets, carrying wood)</td>
  </tr>
  <tr>
    <td style="text-align: right">05120</td>
    <td style="text-align: right">6.0</td>
    <td style="text-align: right">05120</td>
    <td style="text-align: right">6.0</td>
    <td>home activities</td>
    <td>moving furniture, household items, carrying boxes</td>
  </tr>
  <tr>
    <td style="text-align: right">05130</td>
    <td style="text-align: right">5.5</td>
    <td style="text-align: right">05130</td>
    <td style="text-align: right">3.8</td>
    <td>home activities</td>
    <td>scrubbing floors, on hands and knees, scrubbing bathroom, bathtub</td>
  </tr>
  <tr>
    <td style="text-align: right">05140</td>
    <td style="text-align: right">4.0</td>
    <td style="text-align: right">05140</td>
    <td style="text-align: right">4.0</td>
    <td>home activities</td>
    <td>sweeping garage, sidewalk or outside of house</td>
  </tr>
  <tr>
    <td style="text-align: right">05145</td>
    <td style="text-align: right">7.0</td>
    <td></td>
    <td></td>
    <td>home activities</td>
    <td>moving household items, carrying boxes</td>
  </tr>
  <tr>
    <td style="text-align: right">05146</td>
    <td style="text-align: right">3.5</td>
    <td style="text-align: right">05146</td>
    <td style="text-align: right">3.5</td>
    <td>home activities</td>
    <td>standing - packing/unpacking boxes, occasional lifting of household items light - moderate effor</td>
  </tr>
  <tr>
    <td style="text-align: right">05147</td>
    <td style="text-align: right">3.0</td>
    <td style="text-align: right">05147</td>
    <td style="text-align: right">3.0</td>
    <td>home activities</td>
    <td>implied walking - putting away household items - moderate effort</td>
  </tr>
  <tr>
    <td></td>
    <td></td>
    <td style="text-align: right">05148</td>
    <td style="text-align: right">2.5</td>
    <td>home activities</td>
    <td>watering plants</td>
  </tr>
  <tr>
    <td></td>
    <td></td>
    <td style="text-align: right">05149</td>
    <td style="text-align: right">2.5</td>
    <td>home activities</td>
    <td>building a fire inside</td>
  </tr>
  <tr>
    <td style="text-align: right">05150</td>
    <td style="text-align: right">9.0</td>
    <td style="text-align: right">05150</td>
    <td style="text-align: right">9.0</td>
    <td>home activities</td>
    <td>moving household items upstairs, carrying boxes or furniture</td>
  </tr>
  <tr>
    <td style="text-align: right">05160</td>
    <td style="text-align: right">2.5</td>
    <td style="text-align: right">05160</td>
    <td style="text-align: right">2.0</td>
    <td>home activities</td>
    <td>standing - light (pump gas, change light bulb, etc.)</td>
  </tr>
  <tr>
    <td style="text-align: right">05165</td>
    <td style="text-align: right">3.0</td>
    <td style="text-align: right">05165</td>
    <td style="text-align: right">3.0</td>
    <td>home activities</td>
    <td>walking - light, non-cleaning (readying to leave, shut/lock doors, close windows, etc.</td>
  </tr>
  <tr>
    <td style="text-align: right">05170</td>
    <td style="text-align: right">2.5</td>
    <td style="text-align: right">05170</td>
    <td style="text-align: right">2.5</td>
    <td>home activities</td>
    <td>sitting - playing with child(ren) – light, only active periods</td>
  </tr>
  <tr>
    <td style="text-align: right">05171</td>
    <td style="text-align: right">2.8</td>
    <td style="text-align: right">05171</td>
    <td style="text-align: right">2.8</td>
    <td>home activities</td>
    <td>standing - playing with child(ren) – light, only active periods</td>
  </tr>
  <tr>
    <td style="text-align: right">05175</td>
    <td style="text-align: right">4.0</td>
    <td style="text-align: right">05175</td>
    <td style="text-align: right">4.0</td>
    <td>home activities</td>
    <td>walk/run - playing with child(ren) – moderate, only active periods</td>
  </tr>
  <tr>
    <td style="text-align: right">05180</td>
    <td style="text-align: right">5.0</td>
    <td style="text-align: right">05180</td>
    <td style="text-align: right">5.0</td>
    <td>home activities</td>
    <td>walk/run - playing with child(ren) – vigorous, only active periods</td>
  </tr>
  <tr>
    <td></td>
    <td></td>
    <td style="text-align: right">05181</td>
    <td style="text-align: right">3.0</td>
    <td>home activities</td>
    <td>carrying small children</td>
  </tr>
  <tr>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td>Page 2 of 12</td>
  </tr>
</table>
<h2 class="pagenumber">Page 3</h2>
<table class="table table-striped table-bordered">
  <tr>
    <td style="text-align: right">1993</td>
    <td></td>
    <td style="text-align: right">2000</td>
    <td></td>
    <td></td>
    <td></td>
  </tr>
  <tr>
    <td>compcode</td>
    <td>METS</td>
    <td>compcode</td>
    <td>METS</td>
    <td>heading</td>
    <td>description</td>
  </tr>
  <tr>
    <td style="text-align: right">05185</td>
    <td style="text-align: right">3.0</td>
    <td style="text-align: right">05185</td>
    <td style="text-align: right">2.5</td>
    <td>home activities</td>
    <td>child care: sitting/kneeling - dressing, bathing, grooming, feeding, occasional lifting of child-light effort,
      genera</td>
  </tr>
  <tr>
    <td style="text-align: right">05186</td>
    <td style="text-align: right">3.5</td>
    <td style="text-align: right">05186</td>
    <td style="text-align: right">3.0</td>
    <td>home activities</td>
    <td>child care: standing - dressing, bathing, grooming, feeding, occasional lifting of child-light effort</td>
  </tr>
  <tr>
    <td></td>
    <td></td>
    <td style="text-align: right">05187</td>
    <td style="text-align: right">4.0</td>
    <td>home activities</td>
    <td>elder care, disabled adult, only active periods</td>
  </tr>
  <tr>
    <td></td>
    <td></td>
    <td style="text-align: right">05188</td>
    <td style="text-align: right">1.5</td>
    <td>home activities</td>
    <td>reclining with baby</td>
  </tr>
  <tr>
    <td></td>
    <td></td>
    <td style="text-align: right">05190</td>
    <td style="text-align: right">2.5</td>
    <td>home activities</td>
    <td>sit, play ing with animals, light, only active periods</td>
  </tr>
  <tr>
    <td></td>
    <td></td>
    <td style="text-align: right">05191</td>
    <td style="text-align: right">2.8</td>
    <td>home activities</td>
    <td>stand, playing with animals, light, only active periods</td>
  </tr>
  <tr>
    <td></td>
    <td></td>
    <td style="text-align: right">05192</td>
    <td style="text-align: right">2.8</td>
    <td>home activities</td>
    <td>walk/run, playing with animals, light, only active periods</td>
  </tr>
  <tr>
    <td></td>
    <td></td>
    <td style="text-align: right">05193</td>
    <td style="text-align: right">4.0</td>
    <td>home activities</td>
    <td>walk/run, playing with animals, moderate, only active periods</td>
  </tr>
  <tr>
    <td></td>
    <td></td>
    <td style="text-align: right">05194</td>
    <td style="text-align: right">5.0</td>
    <td>home activities</td>
    <td>walk/run, playing with animals, vigorous, only active periods</td>
  </tr>
  <tr>
    <td></td>
    <td></td>
    <td style="text-align: right">05195</td>
    <td style="text-align: right">3.5</td>
    <td>home activities</td>
    <td>standing - bathing dog</td>
  </tr>
  <tr>
    <td style="text-align: right">06010</td>
    <td style="text-align: right">3.0</td>
    <td style="text-align: right">06010</td>
    <td style="text-align: right">3.0</td>
    <td>home repair</td>
    <td>airplane repair</td>
  </tr>
  <tr>
    <td style="text-align: right">06020</td>
    <td style="text-align: right">4.5</td>
    <td style="text-align: right">06020</td>
    <td style="text-align: right">4.0</td>
    <td>home repair</td>
    <td>automobile body work</td>
  </tr>
  <tr>
    <td style="text-align: right">06030</td>
    <td style="text-align: right">3.0</td>
    <td style="text-align: right">06030</td>
    <td style="text-align: right">3.0</td>
    <td>home repair</td>
    <td>automobile repair</td>
  </tr>
  <tr>
    <td style="text-align: right">06040</td>
    <td style="text-align: right">3.0</td>
    <td style="text-align: right">06040</td>
    <td style="text-align: right">3.0</td>
    <td>home repair</td>
    <td>carpentry, general, workshop (Taylor Code 620)</td>
  </tr>
  <tr>
    <td style="text-align: right">06050</td>
    <td style="text-align: right">6.0</td>
    <td style="text-align: right">06050</td>
    <td style="text-align: right">6.0</td>
    <td>home repair</td>
    <td>carpentry, outside house, installing rain gutters, building a fence, (Taylor Code 640)</td>
  </tr>
  <tr>
    <td style="text-align: right">06060</td>
    <td style="text-align: right">4.5</td>
    <td style="text-align: right">06060</td>
    <td style="text-align: right">4.5</td>
    <td>home repair</td>
    <td>carpentry, finishing or refinishing cabinets or furniture</td>
  </tr>
  <tr>
    <td style="text-align: right">06070</td>
    <td style="text-align: right">7.5</td>
    <td style="text-align: right">06070</td>
    <td style="text-align: right">7.5</td>
    <td>home repair</td>
    <td>carpentry, sawing hardwood</td>
  </tr>
  <tr>
    <td style="text-align: right">06080</td>
    <td style="text-align: right">5.0</td>
    <td style="text-align: right">06080</td>
    <td style="text-align: right">5.0</td>
    <td>home repair</td>
    <td>caulking, chinking log cabin</td>
  </tr>
  <tr>
    <td style="text-align: right">06090</td>
    <td style="text-align: right">4.5</td>
    <td style="text-align: right">06090</td>
    <td style="text-align: right">4.5</td>
    <td>home repair</td>
    <td>caulking, except log cabin</td>
  </tr>
  <tr>
    <td style="text-align: right">06100</td>
    <td style="text-align: right">5.0</td>
    <td style="text-align: right">06100</td>
    <td style="text-align: right">5.0</td>
    <td>home repair</td>
    <td>cleaning gutters</td>
  </tr>
  <tr>
    <td style="text-align: right">06110</td>
    <td style="text-align: right">5.0</td>
    <td style="text-align: right">06110</td>
    <td style="text-align: right">5.0</td>
    <td>home repair</td>
    <td>excavating garage</td>
  </tr>
  <tr>
    <td style="text-align: right">06120</td>
    <td style="text-align: right">5.0</td>
    <td style="text-align: right">06120</td>
    <td style="text-align: right">5.0</td>
    <td>home repair</td>
    <td>hanging storm windows</td>
  </tr>
  <tr>
    <td style="text-align: right">06130</td>
    <td style="text-align: right">4.5</td>
    <td style="text-align: right">06130</td>
    <td style="text-align: right">4.5</td>
    <td>home repair</td>
    <td>laying or removing carpet</td>
  </tr>
  <tr>
    <td style="text-align: right">06140</td>
    <td style="text-align: right">4.5</td>
    <td style="text-align: right">06140</td>
    <td style="text-align: right">4.5</td>
    <td>home repair</td>
    <td>laying tile or linoleum, repairing appliances</td>
  </tr>
  <tr>
    <td style="text-align: right">06150</td>
    <td style="text-align: right">5.0</td>
    <td style="text-align: right">06150</td>
    <td style="text-align: right">5.0</td>
    <td>home repair</td>
    <td>painting, outside home (Taylor Code 650)</td>
  </tr>
  <tr>
    <td style="text-align: right">06160</td>
    <td style="text-align: right">4.5</td>
    <td style="text-align: right">06160</td>
    <td style="text-align: right">3.0</td>
    <td>home repair</td>
    <td>painting, papering, plastering, scraping, inside house, hanging sheet rock, remodeling</td>
  </tr>
  <tr>
    <td></td>
    <td></td>
    <td style="text-align: right">06165</td>
    <td style="text-align: right">4.5</td>
    <td>home repair</td>
    <td>painting, (Taylor Code 630)</td>
  </tr>
  <tr>
    <td style="text-align: right">06170</td>
    <td style="text-align: right">3.0</td>
    <td style="text-align: right">06170</td>
    <td style="text-align: right">3.0</td>
    <td>home repair</td>
    <td>put on and removal of tarp - sailboat</td>
  </tr>
  <tr>
    <td style="text-align: right">06180</td>
    <td style="text-align: right">6.0</td>
    <td style="text-align: right">06180</td>
    <td style="text-align: right">6.0</td>
    <td>home repair</td>
    <td>roofing</td>
  </tr>
  <tr>
    <td style="text-align: right">06190</td>
    <td style="text-align: right">4.5</td>
    <td style="text-align: right">06190</td>
    <td style="text-align: right">4.5</td>
    <td>home repair</td>
    <td>sanding floors with a power sander</td>
  </tr>
  <tr>
    <td style="text-align: right">06200</td>
    <td style="text-align: right">4.5</td>
    <td style="text-align: right">06200</td>
    <td style="text-align: right">4.5</td>
    <td>home repair</td>
    <td>scraping and painting sailboat or powerboat</td>
  </tr>
  <tr>
    <td style="text-align: right">06210</td>
    <td style="text-align: right">5.0</td>
    <td style="text-align: right">06210</td>
    <td style="text-align: right">5.0</td>
    <td>home repair</td>
    <td>spreading dirt with a shovel</td>
  </tr>
  <tr>
    <td style="text-align: right">06220</td>
    <td style="text-align: right">4.5</td>
    <td style="text-align: right">06220</td>
    <td style="text-align: right">4.5</td>
    <td>home repair</td>
    <td>washing and waxing hull of sailboat, car, powerboat, airplane</td>
  </tr>
  <tr>
    <td style="text-align: right">06230</td>
    <td style="text-align: right">4.5</td>
    <td style="text-align: right">06230</td>
    <td style="text-align: right">4.5</td>
    <td>home repair</td>
    <td>washing fence, painting fence</td>
  </tr>
  <tr>
    <td style="text-align: right">06240</td>
    <td style="text-align: right">3.0</td>
    <td style="text-align: right">06240</td>
    <td style="text-align: right">3.0</td>
    <td>home repair</td>
    <td>wiring, plumbing</td>
  </tr>
  <tr>
    <td style="text-align: right">07010</td>
    <td style="text-align: right">0.9</td>
    <td style="text-align: right">07010</td>
    <td style="text-align: right">1.0</td>
    <td>inactivity quiet</td>
    <td>lying quietly, watching television</td>
  </tr>
  <tr>
    <td></td>
    <td></td>
    <td style="text-align: right">07011</td>
    <td style="text-align: right">1.0</td>
    <td>inactivity quiet</td>
    <td>lying quietly, doing nothing, lying in bed awake, listening to music (not talking or reading</td>
  </tr>
  <tr>
    <td style="text-align: right">07020</td>
    <td style="text-align: right">1.0</td>
    <td style="text-align: right">07020</td>
    <td style="text-align: right">1.0</td>
    <td>inactivity quiet</td>
    <td>sitting quietly and watching television</td>
  </tr>
  <tr>
    <td></td>
    <td></td>
    <td style="text-align: right">07021</td>
    <td style="text-align: right">1.0</td>
    <td>inactivity quiet</td>
    <td>sitting quietly, sitting smoking, listening to music (not talking or reading), watching a movie in a theate</td>
  </tr>
  <tr>
    <td style="text-align: right">07030</td>
    <td style="text-align: right">0.9</td>
    <td style="text-align: right">07030</td>
    <td style="text-align: right">0.9</td>
    <td>inactivity quiet</td>
    <td>sleeping</td>
  </tr>
  <tr>
    <td style="text-align: right">07040</td>
    <td style="text-align: right">1.2</td>
    <td style="text-align: right">07040</td>
    <td style="text-align: right">1.2</td>
    <td>inactivity quiet</td>
    <td>standing quietly (standing in a line)</td>
  </tr>
  <tr>
    <td style="text-align: right">07050</td>
    <td style="text-align: right">1.0</td>
    <td style="text-align: right">07050</td>
    <td style="text-align: right">1.0</td>
    <td>inactivity light</td>
    <td>reclining - writing</td>
  </tr>
  <tr>
    <td style="text-align: right">07060</td>
    <td style="text-align: right">1.0</td>
    <td style="text-align: right">07060</td>
    <td style="text-align: right">1.0</td>
    <td>inactivity light</td>
    <td>reclining - talking or talking on phone</td>
  </tr>
  <tr>
    <td style="text-align: right">07070</td>
    <td style="text-align: right">1.0</td>
    <td style="text-align: right">07070</td>
    <td style="text-align: right">1.0</td>
    <td>inactivity light</td>
    <td>reclining - reading</td>
  </tr>
  <tr>
    <td></td>
    <td></td>
    <td style="text-align: right">07075</td>
    <td style="text-align: right">1.0</td>
    <td>inactivity light</td>
    <td>meditating</td>
  </tr>
  <tr>
    <td style="text-align: right">08010</td>
    <td style="text-align: right">5.0</td>
    <td style="text-align: right">08010</td>
    <td style="text-align: right">5.0</td>
    <td>lawn and garden</td>
    <td>carrying, loading or stacking wood, loading/unloading or carrying lumber</td>
  </tr>
  <tr>
    <td style="text-align: right">08020</td>
    <td style="text-align: right">6.0</td>
    <td style="text-align: right">08020</td>
    <td style="text-align: right">6.0</td>
    <td>lawn and garden</td>
    <td>chopping wood, splitting logs</td>
  </tr>
  <tr>
    <td style="text-align: right">08030</td>
    <td style="text-align: right">5.0</td>
    <td style="text-align: right">08030</td>
    <td style="text-align: right">5.0</td>
    <td>lawn and garden</td>
    <td>clearing land, hauling branches, wheelbarrow chores</td>
  </tr>
  <tr>
    <td style="text-align: right">08040</td>
    <td style="text-align: right">5.0</td>
    <td style="text-align: right">08040</td>
    <td style="text-align: right">5.0</td>
    <td>lawn and garden</td>
    <td>digging sandbox</td>
  </tr>
  <tr>
    <td style="text-align: right">08050</td>
    <td style="text-align: right">5.0</td>
    <td style="text-align: right">08050</td>
    <td style="text-align: right">5.0</td>
    <td>lawn and garden</td>
    <td>digging, spading, filling garden, composting, (Taylor Code 590)</td>
  </tr>
  <tr>
    <td style="text-align: right">08060</td>
    <td style="text-align: right">6.0</td>
    <td style="text-align: right">08060</td>
    <td style="text-align: right">6.0</td>
    <td>lawn and garden</td>
    <td>gardening with heavy power tools, tilling a garden, chain saw</td>
  </tr>
  <tr>
    <td style="text-align: right">08080</td>
    <td style="text-align: right">5.0</td>
    <td style="text-align: right">08080</td>
    <td style="text-align: right">5.0</td>
    <td>lawn and garden</td>
    <td>laying crushed rock</td>
  </tr>
  <tr>
    <td style="text-align: right">08090</td>
    <td style="text-align: right">5.0</td>
    <td style="text-align: right">08090</td>
    <td style="text-align: right">5.0</td>
    <td>lawn and garden</td>
    <td>laying sod</td>
  </tr>
  <tr>
    <td style="text-align: right">08095</td>
    <td style="text-align: right">5.5</td>
    <td style="text-align: right">08095</td>
    <td style="text-align: right">5.5</td>
    <td>lawn and garden</td>
    <td>mowing lawn, general</td>
  </tr>
  <tr>
    <td style="text-align: right">08100</td>
    <td style="text-align: right">2.5</td>
    <td style="text-align: right">08100</td>
    <td style="text-align: right">2.5</td>
    <td>lawn and garden</td>
    <td>mowing lawn, riding mower (Taylor Code 550)</td>
  </tr>
  <tr>
    <td style="text-align: right">08110</td>
    <td style="text-align: right">6.0</td>
    <td style="text-align: right">08110</td>
    <td style="text-align: right">6.0</td>
    <td>lawn and garden</td>
    <td>mowing lawn, walk, hand mower (Taylor Code 570)</td>
  </tr>
  <tr>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td>Page 3 of 12</td>
  </tr>
</table>
<h2 class="pagenumber">Page 4</h2>
<table class="table table-striped table-bordered">
  <tr>
    <td style="text-align: right">1993</td>
    <td></td>
    <td style="text-align: right">2000</td>
    <td></td>
    <td></td>
    <td></td>
  </tr>
  <tr>
    <td>compcode</td>
    <td>METS</td>
    <td>compcode</td>
    <td>METS</td>
    <td>heading</td>
    <td>description</td>
  </tr>
  <tr>
    <td style="text-align: right">08120</td>
    <td style="text-align: right">4.5</td>
    <td style="text-align: right">08120</td>
    <td style="text-align: right">5.5</td>
    <td>lawn and garden</td>
    <td>mowing lawn, walk, power mower</td>
  </tr>
  <tr>
    <td></td>
    <td></td>
    <td style="text-align: right">08125</td>
    <td style="text-align: right">4.5</td>
    <td>lawn and garden</td>
    <td>mowing lawn, power mower (Taylor Code 590)</td>
  </tr>
  <tr>
    <td style="text-align: right">08130</td>
    <td style="text-align: right">4.5</td>
    <td style="text-align: right">08130</td>
    <td style="text-align: right">4.5</td>
    <td>lawn and garden</td>
    <td>operating snow blower, walking</td>
  </tr>
  <tr>
    <td style="text-align: right">08140</td>
    <td style="text-align: right">4.0</td>
    <td style="text-align: right">08140</td>
    <td style="text-align: right">4.5</td>
    <td>lawn and garden</td>
    <td>planting seedlings, shrubs</td>
  </tr>
  <tr>
    <td style="text-align: right">08150</td>
    <td style="text-align: right">4.5</td>
    <td style="text-align: right">08150</td>
    <td style="text-align: right">4.5</td>
    <td>lawn and garden</td>
    <td>planting trees</td>
  </tr>
  <tr>
    <td style="text-align: right">08160</td>
    <td style="text-align: right">4.0</td>
    <td style="text-align: right">08160</td>
    <td style="text-align: right">4.3</td>
    <td>lawn and garden</td>
    <td>raking lawn</td>
  </tr>
  <tr>
    <td></td>
    <td></td>
    <td style="text-align: right">08165</td>
    <td style="text-align: right">4.0</td>
    <td>lawn and garden</td>
    <td>raking lawn (Taylor Code 600)</td>
  </tr>
  <tr>
    <td style="text-align: right">08170</td>
    <td style="text-align: right">4.0</td>
    <td style="text-align: right">08170</td>
    <td style="text-align: right">4.0</td>
    <td>lawn and garden</td>
    <td>raking roof with snow rake</td>
  </tr>
  <tr>
    <td style="text-align: right">08180</td>
    <td style="text-align: right">3.0</td>
    <td style="text-align: right">08180</td>
    <td style="text-align: right">3.0</td>
    <td>lawn and garden</td>
    <td>riding snow blower</td>
  </tr>
  <tr>
    <td style="text-align: right">08190</td>
    <td style="text-align: right">4.0</td>
    <td style="text-align: right">08190</td>
    <td style="text-align: right">4.0</td>
    <td>lawn and garden</td>
    <td>sacking grass, leaves</td>
  </tr>
  <tr>
    <td style="text-align: right">08200</td>
    <td style="text-align: right">6.0</td>
    <td style="text-align: right">08200</td>
    <td style="text-align: right">6.0</td>
    <td>lawn and garden</td>
    <td>shoveling snow, by hand (Taylor Code 610)</td>
  </tr>
  <tr>
    <td style="text-align: right">08210</td>
    <td style="text-align: right">4.5</td>
    <td style="text-align: right">08210</td>
    <td style="text-align: right">4.5</td>
    <td>lawn and garden</td>
    <td>trimming shrubs or trees, manual cutter</td>
  </tr>
  <tr>
    <td style="text-align: right">08215</td>
    <td style="text-align: right">3.5</td>
    <td style="text-align: right">08215</td>
    <td style="text-align: right">3.5</td>
    <td>lawn and garden</td>
    <td>trimming shrubs or trees, power cutter, using leaf blower, edger</td>
  </tr>
  <tr>
    <td style="text-align: right">08220</td>
    <td style="text-align: right">2.5</td>
    <td style="text-align: right">08220</td>
    <td style="text-align: right">2.5</td>
    <td>lawn and garden</td>
    <td>walking, applying fertilizer or seeding a lawn</td>
  </tr>
  <tr>
    <td style="text-align: right">08230</td>
    <td style="text-align: right">1.5</td>
    <td style="text-align: right">08230</td>
    <td style="text-align: right">1.5</td>
    <td>lawn and garden</td>
    <td>watering lawn or garden, standing or walking</td>
  </tr>
  <tr>
    <td style="text-align: right">08240</td>
    <td style="text-align: right">4.5</td>
    <td style="text-align: right">08240</td>
    <td style="text-align: right">4.5</td>
    <td>lawn and garden</td>
    <td>weeding, cultivating garden (Taylor Code 580)</td>
  </tr>
  <tr>
    <td style="text-align: right">08245</td>
    <td style="text-align: right">5.0</td>
    <td style="text-align: right">08245</td>
    <td style="text-align: right">4.0</td>
    <td>lawn and garden</td>
    <td>gardening, general</td>
  </tr>
  <tr>
    <td></td>
    <td></td>
    <td style="text-align: right">08246</td>
    <td style="text-align: right">3.0</td>
    <td>lawn and garden</td>
    <td>picking fruit off trees, picking fruits/vegetables, moderate effort</td>
  </tr>
  <tr>
    <td style="text-align: right">08250</td>
    <td style="text-align: right">3.0</td>
    <td style="text-align: right">08250</td>
    <td style="text-align: right">3.0</td>
    <td>lawn and garden</td>
    <td>implied walking/standing - picking up yard, light, picking flowers or vegetables</td>
  </tr>
  <tr>
    <td></td>
    <td></td>
    <td style="text-align: right">08251</td>
    <td style="text-align: right">3.0</td>
    <td>lawn and garden</td>
    <td>walking, gathering gardening tools</td>
  </tr>
  <tr>
    <td style="text-align: right">09010</td>
    <td style="text-align: right">1.5</td>
    <td style="text-align: right">09010</td>
    <td style="text-align: right">1.5</td>
    <td>miscellaneous</td>
    <td>sitting - card playing, playing board games</td>
  </tr>
  <tr>
    <td style="text-align: right">09020</td>
    <td style="text-align: right">2.0</td>
    <td style="text-align: right">09020</td>
    <td style="text-align: right">2.3</td>
    <td>miscellaneous</td>
    <td>standing - drawing (writing), casino gambling, duplicating machine</td>
  </tr>
  <tr>
    <td style="text-align: right">09030</td>
    <td style="text-align: right">1.3</td>
    <td style="text-align: right">09030</td>
    <td style="text-align: right">1.3</td>
    <td>miscellaneous</td>
    <td>sitting - reading, book, newspaper, etc.</td>
  </tr>
  <tr>
    <td style="text-align: right">09040</td>
    <td style="text-align: right">1.8</td>
    <td style="text-align: right">09040</td>
    <td style="text-align: right">1.8</td>
    <td>miscellaneous</td>
    <td>sitting - writing, desk work, typing</td>
  </tr>
  <tr>
    <td style="text-align: right">09050</td>
    <td style="text-align: right">1.8</td>
    <td style="text-align: right">09050</td>
    <td style="text-align: right">1.8</td>
    <td>miscellaneous</td>
    <td>standing - talking or talking on the phone</td>
  </tr>
  <tr>
    <td style="text-align: right">09055</td>
    <td style="text-align: right">1.5</td>
    <td style="text-align: right">09055</td>
    <td style="text-align: right">1.5</td>
    <td>miscellaneous</td>
    <td>sitting - talking or talking on the phone</td>
  </tr>
  <tr>
    <td style="text-align: right">09060</td>
    <td style="text-align: right">1.8</td>
    <td style="text-align: right">09060</td>
    <td style="text-align: right">1.8</td>
    <td>miscellaneous</td>
    <td>sitting - studying, general, including reading and/or writing</td>
  </tr>
  <tr>
    <td style="text-align: right">09065</td>
    <td style="text-align: right">1.8</td>
    <td style="text-align: right">09065</td>
    <td style="text-align: right">1.8</td>
    <td>miscellaneous</td>
    <td>sitting - in class, general, including note-taking or class discussion</td>
  </tr>
  <tr>
    <td style="text-align: right">09070</td>
    <td style="text-align: right">1.8</td>
    <td style="text-align: right">09070</td>
    <td style="text-align: right">1.8</td>
    <td>miscellaneous</td>
    <td>standing - reading</td>
  </tr>
  <tr>
    <td></td>
    <td></td>
    <td style="text-align: right">09071</td>
    <td style="text-align: right">2.0</td>
    <td>miscellaneous</td>
    <td>standing - miscellaneous</td>
  </tr>
  <tr>
    <td></td>
    <td></td>
    <td style="text-align: right">09075</td>
    <td style="text-align: right">1.5</td>
    <td>miscellaneous</td>
    <td>sitting - arts and crafts, light effort</td>
  </tr>
  <tr>
    <td></td>
    <td></td>
    <td style="text-align: right">09080</td>
    <td style="text-align: right">2.0</td>
    <td>miscellaneous</td>
    <td>sitting - arts and crafts, moderate effort</td>
  </tr>
  <tr>
    <td></td>
    <td></td>
    <td style="text-align: right">09085</td>
    <td style="text-align: right">1.8</td>
    <td>miscellaneous</td>
    <td>standing - arts and crafts, light effort</td>
  </tr>
  <tr>
    <td></td>
    <td></td>
    <td style="text-align: right">09090</td>
    <td style="text-align: right">3.0</td>
    <td>miscellaneous</td>
    <td>standing - arts and crafts, moderate effort</td>
  </tr>
  <tr>
    <td></td>
    <td></td>
    <td style="text-align: right">09095</td>
    <td style="text-align: right">3.5</td>
    <td>miscellaneous</td>
    <td>standing - arts and crafts, vigorous effort</td>
  </tr>
  <tr>
    <td></td>
    <td></td>
    <td style="text-align: right">09100</td>
    <td style="text-align: right">1.5</td>
    <td>miscellaneous</td>
    <td>retreat/family reunion activities involving sitting, relaxing, talking, eating</td>
  </tr>
  <tr>
    <td></td>
    <td></td>
    <td style="text-align: right">09105</td>
    <td style="text-align: right">2.0</td>
    <td>miscellaneous</td>
    <td>touring/traveling/vacation involving walking and riding</td>
  </tr>
  <tr>
    <td></td>
    <td></td>
    <td style="text-align: right">09110</td>
    <td style="text-align: right">2.5</td>
    <td>miscellaneous</td>
    <td>camping involving standing, walking, sitting, light-to-moderate effort</td>
  </tr>
  <tr>
    <td></td>
    <td></td>
    <td style="text-align: right">09115</td>
    <td style="text-align: right">1.5</td>
    <td>miscellaneous</td>
    <td>sitting at a sporting event, spectator</td>
  </tr>
  <tr>
    <td style="text-align: right">10010</td>
    <td style="text-align: right">1.8</td>
    <td style="text-align: right">10010</td>
    <td style="text-align: right">1.8</td>
    <td>music playing</td>
    <td>accordion</td>
  </tr>
  <tr>
    <td style="text-align: right">10020</td>
    <td style="text-align: right">2.0</td>
    <td style="text-align: right">10020</td>
    <td style="text-align: right">2.0</td>
    <td>music playing</td>
    <td>cello</td>
  </tr>
  <tr>
    <td style="text-align: right">10030</td>
    <td style="text-align: right">2.5</td>
    <td style="text-align: right">10030</td>
    <td style="text-align: right">2.5</td>
    <td>music playing</td>
    <td>conducting</td>
  </tr>
  <tr>
    <td style="text-align: right">10040</td>
    <td style="text-align: right">4.0</td>
    <td style="text-align: right">10040</td>
    <td style="text-align: right">4.0</td>
    <td>music playing</td>
    <td>drums</td>
  </tr>
  <tr>
    <td style="text-align: right">10050</td>
    <td style="text-align: right">2.0</td>
    <td style="text-align: right">10050</td>
    <td style="text-align: right">2.0</td>
    <td>music playing</td>
    <td>flute (sitting)</td>
  </tr>
  <tr>
    <td style="text-align: right">10060</td>
    <td style="text-align: right">2.0</td>
    <td style="text-align: right">10060</td>
    <td style="text-align: right">2.0</td>
    <td>music playing</td>
    <td>horn</td>
  </tr>
  <tr>
    <td style="text-align: right">10070</td>
    <td style="text-align: right">2.5</td>
    <td style="text-align: right">10070</td>
    <td style="text-align: right">2.5</td>
    <td>music playing</td>
    <td>piano or organ</td>
  </tr>
  <tr>
    <td style="text-align: right">10080</td>
    <td style="text-align: right">3.5</td>
    <td style="text-align: right">10080</td>
    <td style="text-align: right">3.5</td>
    <td>music playing</td>
    <td>trombone</td>
  </tr>
  <tr>
    <td style="text-align: right">10090</td>
    <td style="text-align: right">2.5</td>
    <td style="text-align: right">10090</td>
    <td style="text-align: right">2.5</td>
    <td>music playing</td>
    <td>trumpet</td>
  </tr>
  <tr>
    <td style="text-align: right">10100</td>
    <td style="text-align: right">2.5</td>
    <td style="text-align: right">10100</td>
    <td style="text-align: right">2.5</td>
    <td>music playing</td>
    <td>violin</td>
  </tr>
  <tr>
    <td style="text-align: right">10110</td>
    <td style="text-align: right">2.0</td>
    <td style="text-align: right">10110</td>
    <td style="text-align: right">2.0</td>
    <td>music playing</td>
    <td>woodwind</td>
  </tr>
  <tr>
    <td style="text-align: right">10120</td>
    <td style="text-align: right">2.0</td>
    <td style="text-align: right">10120</td>
    <td style="text-align: right">2.0</td>
    <td>music playing</td>
    <td>guitar, classical, folk (sitting)</td>
  </tr>
  <tr>
    <td style="text-align: right">10125</td>
    <td style="text-align: right">3.0</td>
    <td style="text-align: right">10125</td>
    <td style="text-align: right">3.0</td>
    <td>music playing</td>
    <td>guitar, rock and roll band (standing)</td>
  </tr>
  <tr>
    <td style="text-align: right">10130</td>
    <td style="text-align: right">4.0</td>
    <td style="text-align: right">10130</td>
    <td style="text-align: right">4.0</td>
    <td>music playing</td>
    <td>marching band, playing an instrument, baton twirling (walking)</td>
  </tr>
  <tr>
    <td style="text-align: right">10135</td>
    <td style="text-align: right">3.5</td>
    <td style="text-align: right">10135</td>
    <td style="text-align: right">3.5</td>
    <td>music playing</td>
    <td>marching band, drum major (walking)</td>
  </tr>
  <tr>
    <td style="text-align: right">11010</td>
    <td style="text-align: right">4.0</td>
    <td style="text-align: right">11010</td>
    <td style="text-align: right">4.0</td>
    <td>occupation</td>
    <td>bakery, general, moderate effort</td>
  </tr>
  <tr>
    <td></td>
    <td></td>
    <td style="text-align: right">11015</td>
    <td style="text-align: right">2.5</td>
    <td>occupation</td>
    <td>bakery, light effort</td>
  </tr>
  <tr>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td>Page 4 of 12</td>
  </tr>
</table>
<h2 class="pagenumber">Page 5</h2>
<table class="table table-striped table-bordered">
  <tr>
    <td style="text-align: right">1993</td>
    <td></td>
    <td style="text-align: right">2000</td>
    <td></td>
    <td></td>
    <td></td>
  </tr>
  <tr>
    <td>compcode</td>
    <td>METS</td>
    <td>compcode</td>
    <td>METS</td>
    <td>heading</td>
    <td>description</td>
  </tr>
  <tr>
    <td style="text-align: right">11020</td>
    <td style="text-align: right">2.3</td>
    <td style="text-align: right">11020</td>
    <td style="text-align: right">2.3</td>
    <td>occupation</td>
    <td>bookbinding</td>
  </tr>
  <tr>
    <td style="text-align: right">11030</td>
    <td style="text-align: right">6.0</td>
    <td style="text-align: right">11030</td>
    <td style="text-align: right">6.0</td>
    <td>occupation</td>
    <td>building road (including hauling debris, driving heavy machinery)</td>
  </tr>
  <tr>
    <td style="text-align: right">11035</td>
    <td style="text-align: right">2.0</td>
    <td style="text-align: right">11035</td>
    <td style="text-align: right">2.0</td>
    <td>occupation</td>
    <td>building road, directing traffic (standing)</td>
  </tr>
  <tr>
    <td style="text-align: right">11040</td>
    <td style="text-align: right">3.5</td>
    <td style="text-align: right">11040</td>
    <td style="text-align: right">3.5</td>
    <td>occupation</td>
    <td>carpentry, general</td>
  </tr>
  <tr>
    <td style="text-align: right">11050</td>
    <td style="text-align: right">8.0</td>
    <td style="text-align: right">11050</td>
    <td style="text-align: right">8.0</td>
    <td>occupation</td>
    <td>carrying heavy loads, such as bricks</td>
  </tr>
  <tr>
    <td style="text-align: right">11060</td>
    <td style="text-align: right">8.0</td>
    <td style="text-align: right">11060</td>
    <td style="text-align: right">8.0</td>
    <td>occupation</td>
    <td>carrying moderate loads up stairs, moving boxes (16-40 pounds)</td>
  </tr>
  <tr>
    <td style="text-align: right">11070</td>
    <td style="text-align: right">2.5</td>
    <td style="text-align: right">11070</td>
    <td style="text-align: right">2.5</td>
    <td>occupation</td>
    <td>chambermaid, making bed (nursing)</td>
  </tr>
  <tr>
    <td style="text-align: right">11080</td>
    <td style="text-align: right">6.5</td>
    <td style="text-align: right">11080</td>
    <td style="text-align: right">6.5</td>
    <td>occupation</td>
    <td>coal mining, drilling coal, rock</td>
  </tr>
  <tr>
    <td style="text-align: right">11090</td>
    <td style="text-align: right">6.5</td>
    <td style="text-align: right">11090</td>
    <td style="text-align: right">6.5</td>
    <td>occupation</td>
    <td>coal mining, erecting supports</td>
  </tr>
  <tr>
    <td style="text-align: right">11100</td>
    <td style="text-align: right">6.0</td>
    <td style="text-align: right">11100</td>
    <td style="text-align: right">6.0</td>
    <td>occupation</td>
    <td>coal mining, general</td>
  </tr>
  <tr>
    <td style="text-align: right">11110</td>
    <td style="text-align: right">7.0</td>
    <td style="text-align: right">11110</td>
    <td style="text-align: right">7.0</td>
    <td>occupation</td>
    <td>coal mining, shoveling coal</td>
  </tr>
  <tr>
    <td style="text-align: right">11120</td>
    <td style="text-align: right">5.5</td>
    <td style="text-align: right">11120</td>
    <td style="text-align: right">5.5</td>
    <td>occupation</td>
    <td>construction, outside, remodeling</td>
  </tr>
  <tr>
    <td></td>
    <td></td>
    <td style="text-align: right">11121</td>
    <td style="text-align: right">3.0</td>
    <td>occupation</td>
    <td>custodial work - buffing the floor with electric buffer</td>
  </tr>
  <tr>
    <td></td>
    <td></td>
    <td style="text-align: right">11122</td>
    <td style="text-align: right">2.5</td>
    <td>occupation</td>
    <td>custodial work - cleaning sink and toilet, light effort</td>
  </tr>
  <tr>
    <td></td>
    <td></td>
    <td style="text-align: right">11123</td>
    <td style="text-align: right">2.5</td>
    <td>occupation</td>
    <td>custodial work - dusting, light effort</td>
  </tr>
  <tr>
    <td></td>
    <td></td>
    <td style="text-align: right">11124</td>
    <td style="text-align: right">4.0</td>
    <td>occupation</td>
    <td>custodial work – feathering arena floor, moderate effor</td>
  </tr>
  <tr>
    <td></td>
    <td></td>
    <td style="text-align: right">11125</td>
    <td style="text-align: right">3.5</td>
    <td>occupation</td>
    <td>custodial work - general cleaning, moderate effort</td>
  </tr>
  <tr>
    <td></td>
    <td></td>
    <td style="text-align: right">11126</td>
    <td style="text-align: right">3.5</td>
    <td>occupation</td>
    <td>custodial work - mopping, moderate effort</td>
  </tr>
  <tr>
    <td></td>
    <td></td>
    <td style="text-align: right">11127</td>
    <td style="text-align: right">3.0</td>
    <td>occupation</td>
    <td>custodial work - take out trash, moderate effor</td>
  </tr>
  <tr>
    <td></td>
    <td></td>
    <td style="text-align: right">11128</td>
    <td style="text-align: right">2.5</td>
    <td>occupation</td>
    <td>custodial work - vacuuming, light effort</td>
  </tr>
  <tr>
    <td></td>
    <td></td>
    <td style="text-align: right">11129</td>
    <td style="text-align: right">3.0</td>
    <td>occupation</td>
    <td>custodial work - vacuuming, moderate effort</td>
  </tr>
  <tr>
    <td style="text-align: right">11130</td>
    <td style="text-align: right">3.5</td>
    <td style="text-align: right">11130</td>
    <td style="text-align: right">3.5</td>
    <td>occupation</td>
    <td>electrical work, plumbing</td>
  </tr>
  <tr>
    <td style="text-align: right">11140</td>
    <td style="text-align: right">8.0</td>
    <td style="text-align: right">11140</td>
    <td style="text-align: right">8.0</td>
    <td>occupation</td>
    <td>farming, baling hay, cleaning barn, poultry work, vigorous effort</td>
  </tr>
  <tr>
    <td style="text-align: right">11150</td>
    <td style="text-align: right">3.5</td>
    <td style="text-align: right">11150</td>
    <td style="text-align: right">3.5</td>
    <td>occupation</td>
    <td>farming, chasing cattle, non-strenuous (walking), moderate effort</td>
  </tr>
  <tr>
    <td></td>
    <td></td>
    <td style="text-align: right">11151</td>
    <td style="text-align: right">4.0</td>
    <td>occupation</td>
    <td>farming, chasing cattle or other livestock on horseback, moderate effor</td>
  </tr>
  <tr>
    <td></td>
    <td></td>
    <td style="text-align: right">11152</td>
    <td style="text-align: right">2.0</td>
    <td>occupation</td>
    <td>farming, chasing cattle or other livestock, driving, light effort</td>
  </tr>
  <tr>
    <td style="text-align: right">11160</td>
    <td style="text-align: right">2.5</td>
    <td style="text-align: right">11160</td>
    <td style="text-align: right">2.5</td>
    <td>occupation</td>
    <td>farming, driving harvester, cutting hay, irrigation work</td>
  </tr>
  <tr>
    <td style="text-align: right">11170</td>
    <td style="text-align: right">2.5</td>
    <td style="text-align: right">11170</td>
    <td style="text-align: right">2.5</td>
    <td>occupation</td>
    <td>farming, driving tractor</td>
  </tr>
  <tr>
    <td style="text-align: right">11180</td>
    <td style="text-align: right">4.0</td>
    <td style="text-align: right">11180</td>
    <td style="text-align: right">4.0</td>
    <td>occupation</td>
    <td>farming, feeding small animals</td>
  </tr>
  <tr>
    <td style="text-align: right">11190</td>
    <td style="text-align: right">4.5</td>
    <td style="text-align: right">11190</td>
    <td style="text-align: right">4.5</td>
    <td>occupation</td>
    <td>farming, feeding cattle, horses</td>
  </tr>
  <tr>
    <td></td>
    <td></td>
    <td style="text-align: right">11191</td>
    <td style="text-align: right">4.5</td>
    <td>occupation</td>
    <td>farming, hauling water for animals, general hauling water</td>
  </tr>
  <tr>
    <td></td>
    <td></td>
    <td style="text-align: right">11192</td>
    <td style="text-align: right">6.0</td>
    <td>occupation</td>
    <td>farming, taking care of animals (grooming, brushing, shearing sheep, assisting with birthing, medical care,
      branding)</td>
  </tr>
  <tr>
    <td style="text-align: right">11200</td>
    <td style="text-align: right">8.0</td>
    <td style="text-align: right">11200</td>
    <td style="text-align: right">8.0</td>
    <td>occupation</td>
    <td>farming, forking straw bales, cleaning corral or barn, vigorous effort</td>
  </tr>
  <tr>
    <td style="text-align: right">11210</td>
    <td style="text-align: right">3.0</td>
    <td style="text-align: right">11210</td>
    <td style="text-align: right">3.0</td>
    <td>occupation</td>
    <td>farming, milking by hand, moderate effort</td>
  </tr>
  <tr>
    <td style="text-align: right">11220</td>
    <td style="text-align: right">1.5</td>
    <td style="text-align: right">11220</td>
    <td style="text-align: right">1.5</td>
    <td>occupation</td>
    <td>farming, milking by machine, light effort</td>
  </tr>
  <tr>
    <td style="text-align: right">11230</td>
    <td style="text-align: right">5.5</td>
    <td style="text-align: right">11230</td>
    <td style="text-align: right">5.5</td>
    <td>occupation</td>
    <td>farming, shoveling grain, moderate effort</td>
  </tr>
  <tr>
    <td style="text-align: right">11240</td>
    <td style="text-align: right">12.0</td>
    <td style="text-align: right">11240</td>
    <td style="text-align: right">12.0</td>
    <td>occupation</td>
    <td>fire fighter, general</td>
  </tr>
  <tr>
    <td style="text-align: right">11245</td>
    <td style="text-align: right">11.0</td>
    <td style="text-align: right">11245</td>
    <td style="text-align: right">11.0</td>
    <td>occupation</td>
    <td>fire fighter, climbing ladder with full gear</td>
  </tr>
  <tr>
    <td style="text-align: right">11246</td>
    <td style="text-align: right">8.0</td>
    <td style="text-align: right">11246</td>
    <td style="text-align: right">8.0</td>
    <td>occupation</td>
    <td>fire fighter, hauling hoses on ground</td>
  </tr>
  <tr>
    <td style="text-align: right">11250</td>
    <td style="text-align: right">17.0</td>
    <td style="text-align: right">11250</td>
    <td style="text-align: right">17.0</td>
    <td>occupation</td>
    <td>forestry, ax chopping, fast</td>
  </tr>
  <tr>
    <td style="text-align: right">11260</td>
    <td style="text-align: right">5.0</td>
    <td style="text-align: right">11260</td>
    <td style="text-align: right">5.0</td>
    <td>occupation</td>
    <td>forestry, ax chopping, slow</td>
  </tr>
  <tr>
    <td style="text-align: right">11270</td>
    <td style="text-align: right">7.0</td>
    <td style="text-align: right">11270</td>
    <td style="text-align: right">7.0</td>
    <td>occupation</td>
    <td>forestry, barking trees</td>
  </tr>
  <tr>
    <td style="text-align: right">11280</td>
    <td style="text-align: right">11.0</td>
    <td style="text-align: right">11280</td>
    <td style="text-align: right">11.0</td>
    <td>occupation</td>
    <td>forestry, carrying logs</td>
  </tr>
  <tr>
    <td style="text-align: right">11290</td>
    <td style="text-align: right">8.0</td>
    <td style="text-align: right">11290</td>
    <td style="text-align: right">8.0</td>
    <td>occupation</td>
    <td>forestry, felling trees</td>
  </tr>
  <tr>
    <td style="text-align: right">11300</td>
    <td style="text-align: right">8.0</td>
    <td style="text-align: right">11300</td>
    <td style="text-align: right">8.0</td>
    <td>occupation</td>
    <td>forestry, general</td>
  </tr>
  <tr>
    <td style="text-align: right">11310</td>
    <td style="text-align: right">5.0</td>
    <td style="text-align: right">11310</td>
    <td style="text-align: right">5.0</td>
    <td>occupation</td>
    <td>forestry, hoeing</td>
  </tr>
  <tr>
    <td style="text-align: right">11320</td>
    <td style="text-align: right">6.0</td>
    <td style="text-align: right">11320</td>
    <td style="text-align: right">6.0</td>
    <td>occupation</td>
    <td>forestry, planting by hand</td>
  </tr>
  <tr>
    <td style="text-align: right">11330</td>
    <td style="text-align: right">7.0</td>
    <td style="text-align: right">11330</td>
    <td style="text-align: right">7.0</td>
    <td>occupation</td>
    <td>forestry, sawing by hand</td>
  </tr>
  <tr>
    <td style="text-align: right">11340</td>
    <td style="text-align: right">4.5</td>
    <td style="text-align: right">11340</td>
    <td style="text-align: right">4.5</td>
    <td>occupation</td>
    <td>forestry, sawing, power</td>
  </tr>
  <tr>
    <td style="text-align: right">11350</td>
    <td style="text-align: right">9.0</td>
    <td style="text-align: right">11350</td>
    <td style="text-align: right">9.0</td>
    <td>occupation</td>
    <td>forestry, trimming trees</td>
  </tr>
  <tr>
    <td style="text-align: right">11360</td>
    <td style="text-align: right">4.0</td>
    <td style="text-align: right">11360</td>
    <td style="text-align: right">4.0</td>
    <td>occupation</td>
    <td>forestry, weeding</td>
  </tr>
  <tr>
    <td style="text-align: right">11370</td>
    <td style="text-align: right">4.5</td>
    <td style="text-align: right">11370</td>
    <td style="text-align: right">4.5</td>
    <td>occupation</td>
    <td>furriery</td>
  </tr>
  <tr>
    <td style="text-align: right">11380</td>
    <td style="text-align: right">6.0</td>
    <td style="text-align: right">11380</td>
    <td style="text-align: right">6.0</td>
    <td>occupation</td>
    <td>horse grooming</td>
  </tr>
  <tr>
    <td style="text-align: right">11390</td>
    <td style="text-align: right">8.0</td>
    <td style="text-align: right">11390</td>
    <td style="text-align: right">8.0</td>
    <td>occupation</td>
    <td>horse racing, galloping</td>
  </tr>
  <tr>
    <td style="text-align: right">11400</td>
    <td style="text-align: right">6.5</td>
    <td style="text-align: right">11400</td>
    <td style="text-align: right">6.5</td>
    <td>occupation</td>
    <td>horse racing, trotting</td>
  </tr>
  <tr>
    <td style="text-align: right">11410</td>
    <td style="text-align: right">2.6</td>
    <td style="text-align: right">11410</td>
    <td style="text-align: right">2.6</td>
    <td>occupation</td>
    <td>horse racing, walking</td>
  </tr>
  <tr>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td>Page 5 of 12</td>
  </tr>
</table>
<h2 class="pagenumber">Page 6</h2>
<table class="table table-striped table-bordered">
  <tr>
    <td style="text-align: right">1993</td>
    <td></td>
    <td style="text-align: right">2000</td>
    <td></td>
    <td></td>
    <td></td>
  </tr>
  <tr>
    <td>compcode</td>
    <td>METS</td>
    <td>compcode</td>
    <td>METS</td>
    <td>heading</td>
    <td>description</td>
  </tr>
  <tr>
    <td style="text-align: right">11420</td>
    <td style="text-align: right">3.5</td>
    <td style="text-align: right">11420</td>
    <td style="text-align: right">3.5</td>
    <td>occupation</td>
    <td>locksmith</td>
  </tr>
  <tr>
    <td style="text-align: right">11430</td>
    <td style="text-align: right">2.5</td>
    <td style="text-align: right">11430</td>
    <td style="text-align: right">2.5</td>
    <td>occupation</td>
    <td>machine tooling, machining, working sheet meta</td>
  </tr>
  <tr>
    <td style="text-align: right">11440</td>
    <td style="text-align: right">3.0</td>
    <td style="text-align: right">11440</td>
    <td style="text-align: right">3.0</td>
    <td>occupation</td>
    <td>machine tooling, operating lathe</td>
  </tr>
  <tr>
    <td style="text-align: right">11450</td>
    <td style="text-align: right">5.0</td>
    <td style="text-align: right">11450</td>
    <td style="text-align: right">5.0</td>
    <td>occupation</td>
    <td>machine tooling, operating punch press</td>
  </tr>
  <tr>
    <td style="text-align: right">11460</td>
    <td style="text-align: right">4.0</td>
    <td style="text-align: right">11460</td>
    <td style="text-align: right">4.0</td>
    <td>occupation</td>
    <td>machine tooling, tapping and drilling</td>
  </tr>
  <tr>
    <td style="text-align: right">11470</td>
    <td style="text-align: right">3.0</td>
    <td style="text-align: right">11470</td>
    <td style="text-align: right">3.0</td>
    <td>occupation</td>
    <td>machine tooling, welding</td>
  </tr>
  <tr>
    <td style="text-align: right">11480</td>
    <td style="text-align: right">7.0</td>
    <td style="text-align: right">11480</td>
    <td style="text-align: right">7.0</td>
    <td>occupation</td>
    <td>masonry, concrete</td>
  </tr>
  <tr>
    <td style="text-align: right">11485</td>
    <td style="text-align: right">4.0</td>
    <td style="text-align: right">11485</td>
    <td style="text-align: right">4.0</td>
    <td>occupation</td>
    <td>masseur, masseuse (standing)</td>
  </tr>
  <tr>
    <td style="text-align: right">11490</td>
    <td style="text-align: right">7.0</td>
    <td style="text-align: right">11490</td>
    <td style="text-align: right">7.5</td>
    <td>occupation</td>
    <td>moving, pushing heavy objects, 75 lbs or more (desks, moving van work)</td>
  </tr>
  <tr>
    <td></td>
    <td></td>
    <td style="text-align: right">11495</td>
    <td style="text-align: right">12.0</td>
    <td>occupation</td>
    <td>skindiving or SCUBA diving as a frogman (Navy Seal)</td>
  </tr>
  <tr>
    <td style="text-align: right">11500</td>
    <td style="text-align: right">2.5</td>
    <td style="text-align: right">11500</td>
    <td style="text-align: right">2.5</td>
    <td>occupation</td>
    <td>operating heavy duty equipment/automated, not driving</td>
  </tr>
  <tr>
    <td style="text-align: right">11510</td>
    <td style="text-align: right">4.5</td>
    <td style="text-align: right">11510</td>
    <td style="text-align: right">4.5</td>
    <td>occupation</td>
    <td>orange grove work</td>
  </tr>
  <tr>
    <td style="text-align: right">11520</td>
    <td style="text-align: right">2.3</td>
    <td style="text-align: right">11520</td>
    <td style="text-align: right">2.3</td>
    <td>occupation</td>
    <td>printing (standing)</td>
  </tr>
  <tr>
    <td style="text-align: right">11525</td>
    <td style="text-align: right">2.5</td>
    <td style="text-align: right">11525</td>
    <td style="text-align: right">2.5</td>
    <td>occupation</td>
    <td>police, directing traffic (standing)</td>
  </tr>
  <tr>
    <td style="text-align: right">11526</td>
    <td style="text-align: right">2.0</td>
    <td style="text-align: right">11526</td>
    <td style="text-align: right">2.0</td>
    <td>occupation</td>
    <td>police, driving a squad car (sitting)</td>
  </tr>
  <tr>
    <td style="text-align: right">11527</td>
    <td style="text-align: right">1.3</td>
    <td style="text-align: right">11527</td>
    <td style="text-align: right">1.3</td>
    <td>occupation</td>
    <td>police, riding in a squad car (sitting)</td>
  </tr>
  <tr>
    <td style="text-align: right">11528</td>
    <td style="text-align: right">8.0</td>
    <td style="text-align: right">11528</td>
    <td style="text-align: right">4.0</td>
    <td>occupation</td>
    <td>police, making an arrest (standing)</td>
  </tr>
  <tr>
    <td style="text-align: right">11530</td>
    <td style="text-align: right">2.5</td>
    <td style="text-align: right">11530</td>
    <td style="text-align: right">2.5</td>
    <td>occupation</td>
    <td>shoe repair, general</td>
  </tr>
  <tr>
    <td style="text-align: right">11540</td>
    <td style="text-align: right">8.5</td>
    <td style="text-align: right">11540</td>
    <td style="text-align: right">8.5</td>
    <td>occupation</td>
    <td>shoveling, digging ditches</td>
  </tr>
  <tr>
    <td style="text-align: right">11550</td>
    <td style="text-align: right">9.0</td>
    <td style="text-align: right">11550</td>
    <td style="text-align: right">9.0</td>
    <td>occupation</td>
    <td>shoveling, heavy (more than 16 pounds/minute</td>
  </tr>
  <tr>
    <td style="text-align: right">11560</td>
    <td style="text-align: right">6.0</td>
    <td style="text-align: right">11560</td>
    <td style="text-align: right">6.0</td>
    <td>occupation</td>
    <td>shoveling, light (less than 10 pounds/minute)</td>
  </tr>
  <tr>
    <td style="text-align: right">11570</td>
    <td style="text-align: right">7.0</td>
    <td style="text-align: right">11570</td>
    <td style="text-align: right">7.0</td>
    <td>occupation</td>
    <td>shoveling, moderate (10 to 15 pounds/minute)</td>
  </tr>
  <tr>
    <td style="text-align: right">11580</td>
    <td style="text-align: right">1.5</td>
    <td style="text-align: right">11580</td>
    <td style="text-align: right">1.5</td>
    <td>occupation</td>
    <td></td>
  </tr>
  <tr>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td>sitting - light office work, general (chemistry lab work, light use of hand tools, watch repair or
      micro-assembly, light assembly/repair),sitting, reading, driving at work</td>
  </tr>
  <tr>
    <td style="text-align: right">11585</td>
    <td style="text-align: right">1.5</td>
    <td style="text-align: right">11585</td>
    <td style="text-align: right">1.5</td>
    <td>occupation</td>
    <td>sitting meetings, general, and/or with talking involved, eatting at a business meeting</td>
  </tr>
  <tr>
    <td style="text-align: right">11590</td>
    <td style="text-align: right">2.5</td>
    <td style="text-align: right">11590</td>
    <td style="text-align: right">2.5</td>
    <td>occupation</td>
    <td>sitting; moderate (heavy levers, riding mower/forklift, crane operation) teaching stretching or yoga</td>
  </tr>
  <tr>
    <td style="text-align: right">11600</td>
    <td style="text-align: right">2.5</td>
    <td style="text-align: right">11600</td>
    <td style="text-align: right">2.3</td>
    <td>occupation</td>
    <td>standing; light (bartending, store clerk, assembling, filing, duplicating, putting up a Christmas tree),
      standing and talking at work, changing clothes when teaching</td>
  </tr>
  <tr>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td>physical education</td>
  </tr>
  <tr>
    <td style="text-align: right">11610</td>
    <td style="text-align: right">3.0</td>
    <td style="text-align: right">11610</td>
    <td style="text-align: right">3.0</td>
    <td>occupation</td>
    <td>standing; light/moderate (assemble/repair heavy parts, welding, stocking, auto repair, pack boxes for moving,
      etc.), patient care (as in nursing</td>
  </tr>
  <tr>
    <td></td>
    <td></td>
    <td style="text-align: right">11615</td>
    <td style="text-align: right">4.0</td>
    <td>occupation</td>
    <td>lifting items continuously, 10 – 20 lbs, with limited walking or resting</td>
  </tr>
  <tr>
    <td style="text-align: right">11620</td>
    <td style="text-align: right">3.5</td>
    <td style="text-align: right">11620</td>
    <td style="text-align: right">3.5</td>
    <td>occupation</td>
    <td>standing; moderate (assembling at fast rate, intermittent, lifting 50 lbs, hitch/twisting ropes)</td>
  </tr>
  <tr>
    <td style="text-align: right">11630</td>
    <td style="text-align: right">4.0</td>
    <td style="text-align: right">11630</td>
    <td style="text-align: right">4.0</td>
    <td>occupation</td>
    <td>standing; moderate/heavy (lifting more than 50 lbs, masonry, painting, paper hanging</td>
  </tr>
  <tr>
    <td style="text-align: right">11640</td>
    <td style="text-align: right">5.0</td>
    <td style="text-align: right">11640</td>
    <td style="text-align: right">5.0</td>
    <td>occupation</td>
    <td>steel mill, fettling</td>
  </tr>
  <tr>
    <td style="text-align: right">11650</td>
    <td style="text-align: right">5.5</td>
    <td style="text-align: right">11650</td>
    <td style="text-align: right">5.5</td>
    <td>occupation</td>
    <td>steel mill, forging</td>
  </tr>
  <tr>
    <td style="text-align: right">11660</td>
    <td style="text-align: right">8.0</td>
    <td style="text-align: right">11660</td>
    <td style="text-align: right">8.0</td>
    <td>occupation</td>
    <td>steel mill, hand rolling</td>
  </tr>
  <tr>
    <td style="text-align: right">11670</td>
    <td style="text-align: right">8.0</td>
    <td style="text-align: right">11670</td>
    <td style="text-align: right">8.0</td>
    <td>occupation</td>
    <td>steel mill, merchant mill rolling</td>
  </tr>
  <tr>
    <td style="text-align: right">11680</td>
    <td style="text-align: right">11.0</td>
    <td style="text-align: right">11680</td>
    <td style="text-align: right">11.0</td>
    <td>occupation</td>
    <td>steel mill, removing slag</td>
  </tr>
  <tr>
    <td style="text-align: right">11690</td>
    <td style="text-align: right">7.5</td>
    <td style="text-align: right">11690</td>
    <td style="text-align: right">7.5</td>
    <td>occupation</td>
    <td>steel mill, tending furnace</td>
  </tr>
  <tr>
    <td style="text-align: right">11700</td>
    <td style="text-align: right">5.5</td>
    <td style="text-align: right">11700</td>
    <td style="text-align: right">5.5</td>
    <td>occupation</td>
    <td>steel mill, tipping molds</td>
  </tr>
  <tr>
    <td style="text-align: right">11710</td>
    <td style="text-align: right">8.0</td>
    <td style="text-align: right">11710</td>
    <td style="text-align: right">8.0</td>
    <td>occupation</td>
    <td>steel mill, working in general</td>
  </tr>
  <tr>
    <td style="text-align: right">11720</td>
    <td style="text-align: right">2.5</td>
    <td style="text-align: right">11720</td>
    <td style="text-align: right">2.5</td>
    <td>occupation</td>
    <td>tailoring, cutting</td>
  </tr>
  <tr>
    <td style="text-align: right">11730</td>
    <td style="text-align: right">2.5</td>
    <td style="text-align: right">11730</td>
    <td style="text-align: right">2.5</td>
    <td>occupation</td>
    <td>tailoring, general</td>
  </tr>
  <tr>
    <td style="text-align: right">11740</td>
    <td style="text-align: right">2.0</td>
    <td style="text-align: right">11740</td>
    <td style="text-align: right">2.0</td>
    <td>occupation</td>
    <td>tailoring, hand sewing</td>
  </tr>
  <tr>
    <td style="text-align: right">11750</td>
    <td style="text-align: right">2.5</td>
    <td style="text-align: right">11750</td>
    <td style="text-align: right">2.5</td>
    <td>occupation</td>
    <td>tailoring, machine sewing</td>
  </tr>
  <tr>
    <td style="text-align: right">11760</td>
    <td style="text-align: right">4.0</td>
    <td style="text-align: right">11760</td>
    <td style="text-align: right">4.0</td>
    <td>occupation</td>
    <td>tailoring, pressing</td>
  </tr>
  <tr>
    <td></td>
    <td></td>
    <td style="text-align: right">11765</td>
    <td style="text-align: right">3.5</td>
    <td>occupation</td>
    <td>tailoring, weaving</td>
  </tr>
  <tr>
    <td style="text-align: right">11766</td>
    <td style="text-align: right">6.5</td>
    <td style="text-align: right">11766</td>
    <td style="text-align: right">6.5</td>
    <td>occupation</td>
    <td>truck driving, loading and unloading truck (standing)</td>
  </tr>
  <tr>
    <td style="text-align: right">11770</td>
    <td style="text-align: right">1.5</td>
    <td style="text-align: right">11770</td>
    <td style="text-align: right">1.5</td>
    <td>occupation</td>
    <td>typing, electric, manual or computer</td>
  </tr>
  <tr>
    <td style="text-align: right">11780</td>
    <td style="text-align: right">6.0</td>
    <td style="text-align: right">11780</td>
    <td style="text-align: right">6.0</td>
    <td>occupation</td>
    <td>using heavy power tools such as pneumatic tools (jackhammers, drills, etc.</td>
  </tr>
  <tr>
    <td style="text-align: right">11790</td>
    <td style="text-align: right">8.0</td>
    <td style="text-align: right">11790</td>
    <td style="text-align: right">8.0</td>
    <td>occupation</td>
    <td>using heavy tools (not power) such as shovel, pick, tunnel bar, spade</td>
  </tr>
  <tr>
    <td style="text-align: right">11791</td>
    <td style="text-align: right">2.0</td>
    <td style="text-align: right">11791</td>
    <td style="text-align: right">2.0</td>
    <td>occupation</td>
    <td>walking on job, less than 2.0 mph (in office or lab area), very slow</td>
  </tr>
  <tr>
    <td style="text-align: right">11792</td>
    <td style="text-align: right">3.5</td>
    <td style="text-align: right">11792</td>
    <td style="text-align: right">3.3</td>
    <td>occupation</td>
    <td>walking on job, 3.0 mph, in office, moderate speed, not carrying anything</td>
  </tr>
  <tr>
    <td style="text-align: right">11793</td>
    <td style="text-align: right">4.0</td>
    <td style="text-align: right">11793</td>
    <td style="text-align: right">3.8</td>
    <td>occupation</td>
    <td>walking on job, 3.5 mph, in office, brisk speed, not carrying anything</td>
  </tr>
  <tr>
    <td style="text-align: right">11795</td>
    <td style="text-align: right">3.0</td>
    <td style="text-align: right">11795</td>
    <td style="text-align: right">3.0</td>
    <td>occupation</td>
    <td>walking, 2.5 mph, slowly and carrying light objects less than 25 pounds</td>
  </tr>
  <tr>
    <td></td>
    <td></td>
    <td style="text-align: right">11796</td>
    <td style="text-align: right">3.0</td>
    <td>occupation</td>
    <td>walking, gathering things at work, ready to leave</td>
  </tr>
  <tr>
    <td style="text-align: right">11800</td>
    <td style="text-align: right">4.0</td>
    <td style="text-align: right">11800</td>
    <td style="text-align: right">4.0</td>
    <td>occupation</td>
    <td>walking, 3.0 mph, moderately and carrying light objects less than 25 lbs</td>
  </tr>
  <tr>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td>Page 6 of 12</td>
  </tr>
</table>
<h2 class="pagenumber">Page 7</h2>
<table class="table table-striped table-bordered">
  <tr>
    <td style="text-align: right">1993</td>
    <td></td>
    <td style="text-align: right">2000</td>
    <td></td>
    <td></td>
    <td></td>
  </tr>
  <tr>
    <td>compcode</td>
    <td>METS</td>
    <td>compcode</td>
    <td>METS</td>
    <td>heading</td>
    <td>description</td>
  </tr>
  <tr>
    <td></td>
    <td></td>
    <td style="text-align: right">11805</td>
    <td style="text-align: right">4.0</td>
    <td>occupation</td>
    <td>walking, pushing a wheelchair</td>
  </tr>
  <tr>
    <td style="text-align: right">11810</td>
    <td style="text-align: right">4.5</td>
    <td style="text-align: right">11810</td>
    <td style="text-align: right">4.5</td>
    <td>occupation</td>
    <td>walking, 3.5 mph, briskly and carrying objects less than 25 pounds</td>
  </tr>
  <tr>
    <td style="text-align: right">11820</td>
    <td style="text-align: right">5.0</td>
    <td style="text-align: right">11820</td>
    <td style="text-align: right">5.0</td>
    <td>occupation</td>
    <td>walking or walk downstairs or standing, carrying objects about 25 to 49 pounds</td>
  </tr>
  <tr>
    <td style="text-align: right">11830</td>
    <td style="text-align: right">6.5</td>
    <td style="text-align: right">11830</td>
    <td style="text-align: right">6.5</td>
    <td>occupation</td>
    <td>walking or walk downstairs or standing, carrying objects about 50 to 74 pounds</td>
  </tr>
  <tr>
    <td style="text-align: right">11840</td>
    <td style="text-align: right">7.5</td>
    <td style="text-align: right">11840</td>
    <td style="text-align: right">7.5</td>
    <td>occupation</td>
    <td>walking or walk downstairs or standing, carrying objects about 75 to 99 pounds</td>
  </tr>
  <tr>
    <td style="text-align: right">11850</td>
    <td style="text-align: right">8.5</td>
    <td style="text-align: right">11850</td>
    <td style="text-align: right">8.5</td>
    <td>occupation</td>
    <td>walking or walk downstairs or standing, carrying objects about 100 pounds or ove</td>
  </tr>
  <tr>
    <td style="text-align: right">11870</td>
    <td style="text-align: right">3.0</td>
    <td style="text-align: right">11870</td>
    <td style="text-align: right">3.0</td>
    <td>occupation</td>
    <td>working in scene shop, theater actor, backstage employee</td>
  </tr>
  <tr>
    <td></td>
    <td></td>
    <td style="text-align: right">11875</td>
    <td style="text-align: right">4.0</td>
    <td>occupation</td>
    <td>teach physical education, exercise, sports classes (non-sport play</td>
  </tr>
  <tr>
    <td></td>
    <td></td>
    <td style="text-align: right">11876</td>
    <td style="text-align: right">6.5</td>
    <td>occupation</td>
    <td>teach physical education, exercise, sports classes (participate in the class</td>
  </tr>
  <tr>
    <td style="text-align: right">12010</td>
    <td style="text-align: right">6.0</td>
    <td style="text-align: right">12010</td>
    <td style="text-align: right">6.0</td>
    <td>running</td>
    <td>jog/walk combination (jogging component of less than 10 minutes) (Taylor Code 180</td>
  </tr>
  <tr>
    <td style="text-align: right">12020</td>
    <td style="text-align: right">7.0</td>
    <td style="text-align: right">12020</td>
    <td style="text-align: right">7.0</td>
    <td>running</td>
    <td>jogging, general</td>
  </tr>
  <tr>
    <td></td>
    <td></td>
    <td style="text-align: right">12025</td>
    <td style="text-align: right">8.0</td>
    <td>running</td>
    <td>jogging, in place</td>
  </tr>
  <tr>
    <td></td>
    <td></td>
    <td style="text-align: right">12027</td>
    <td style="text-align: right">4.5</td>
    <td>running</td>
    <td>jogging on a mini-tramp</td>
  </tr>
  <tr>
    <td style="text-align: right">12030</td>
    <td style="text-align: right">8.0</td>
    <td style="text-align: right">12030</td>
    <td style="text-align: right">8.0</td>
    <td>running</td>
    <td>running, 5 mph (12 min/mile)</td>
  </tr>
  <tr>
    <td style="text-align: right">12040</td>
    <td style="text-align: right">9.0</td>
    <td style="text-align: right">12040</td>
    <td style="text-align: right">9.0</td>
    <td>running</td>
    <td>running, 5.2 mph (11.5 min/mile)</td>
  </tr>
  <tr>
    <td style="text-align: right">12050</td>
    <td style="text-align: right">10.0</td>
    <td style="text-align: right">12050</td>
    <td style="text-align: right">10.0</td>
    <td>running</td>
    <td>running, 6 mph (10 min/mile)</td>
  </tr>
  <tr>
    <td style="text-align: right">12060</td>
    <td style="text-align: right">11.0</td>
    <td style="text-align: right">12060</td>
    <td style="text-align: right">11.0</td>
    <td>running</td>
    <td>running, 6.7 mph (9 min/mile)</td>
  </tr>
  <tr>
    <td style="text-align: right">12070</td>
    <td style="text-align: right">11.5</td>
    <td style="text-align: right">12070</td>
    <td style="text-align: right">11.5</td>
    <td>running</td>
    <td>running, 7 mph (8.5 min/mile)</td>
  </tr>
  <tr>
    <td style="text-align: right">12080</td>
    <td style="text-align: right">12.5</td>
    <td style="text-align: right">12080</td>
    <td style="text-align: right">12.5</td>
    <td>running</td>
    <td>running, 7.5 mph (8 min/mile)</td>
  </tr>
  <tr>
    <td style="text-align: right">12090</td>
    <td style="text-align: right">13.5</td>
    <td style="text-align: right">12090</td>
    <td style="text-align: right">13.5</td>
    <td>running</td>
    <td>running, 8 mph (7.5 min/mile)</td>
  </tr>
  <tr>
    <td style="text-align: right">12100</td>
    <td style="text-align: right">14.0</td>
    <td style="text-align: right">12100</td>
    <td style="text-align: right">14.0</td>
    <td>running</td>
    <td>running, 8.6 mph (7 min/mile)</td>
  </tr>
  <tr>
    <td style="text-align: right">12110</td>
    <td style="text-align: right">15.0</td>
    <td style="text-align: right">12110</td>
    <td style="text-align: right">15.0</td>
    <td>running</td>
    <td>running, 9 mph (6.5 min/mile)</td>
  </tr>
  <tr>
    <td style="text-align: right">12120</td>
    <td style="text-align: right">16.0</td>
    <td style="text-align: right">12120</td>
    <td style="text-align: right">16.0</td>
    <td>running</td>
    <td>running, 10 mph (6 min/mile)</td>
  </tr>
  <tr>
    <td style="text-align: right">12130</td>
    <td style="text-align: right">18.0</td>
    <td style="text-align: right">12130</td>
    <td style="text-align: right">18.0</td>
    <td>running</td>
    <td>running, 10.9 mph (5.5 min/mile)</td>
  </tr>
  <tr>
    <td style="text-align: right">12140</td>
    <td style="text-align: right">9.0</td>
    <td style="text-align: right">12140</td>
    <td style="text-align: right">9.0</td>
    <td>running</td>
    <td>running, cross country</td>
  </tr>
  <tr>
    <td style="text-align: right">12150</td>
    <td style="text-align: right">8.0</td>
    <td style="text-align: right">12150</td>
    <td style="text-align: right">8.0</td>
    <td>running</td>
    <td>running (Taylor Code 200)</td>
  </tr>
  <tr>
    <td style="text-align: right">12160</td>
    <td style="text-align: right">8.0</td>
    <td></td>
    <td></td>
    <td>running</td>
    <td>running, in place</td>
  </tr>
  <tr>
    <td style="text-align: right">12170</td>
    <td style="text-align: right">15.0</td>
    <td style="text-align: right">12170</td>
    <td style="text-align: right">15.0</td>
    <td>running</td>
    <td>running, stairs, up</td>
  </tr>
  <tr>
    <td style="text-align: right">12180</td>
    <td style="text-align: right">10.0</td>
    <td style="text-align: right">12180</td>
    <td style="text-align: right">10.0</td>
    <td>running</td>
    <td>running, on a track, team practice</td>
  </tr>
  <tr>
    <td style="text-align: right">12190</td>
    <td style="text-align: right">8.0</td>
    <td style="text-align: right">12190</td>
    <td style="text-align: right">8.0</td>
    <td>running</td>
    <td>running, training, pushing a wheelchair</td>
  </tr>
  <tr>
    <td style="text-align: right">12195</td>
    <td style="text-align: right">3.0</td>
    <td></td>
    <td></td>
    <td>running</td>
    <td>running, wheeling, general</td>
  </tr>
  <tr>
    <td style="text-align: right">13000</td>
    <td style="text-align: right">2.5</td>
    <td style="text-align: right">13000</td>
    <td style="text-align: right">2.0</td>
    <td>self care</td>
    <td>standing - getting ready for bed, in general</td>
  </tr>
  <tr>
    <td style="text-align: right">13009</td>
    <td style="text-align: right">1.0</td>
    <td style="text-align: right">13009</td>
    <td style="text-align: right">1.0</td>
    <td>self care</td>
    <td>sitting on toilet</td>
  </tr>
  <tr>
    <td style="text-align: right">13010</td>
    <td style="text-align: right">2.0</td>
    <td style="text-align: right">13010</td>
    <td style="text-align: right">1.5</td>
    <td>self care</td>
    <td>bathing (sitting)</td>
  </tr>
  <tr>
    <td style="text-align: right">13020</td>
    <td style="text-align: right">2.5</td>
    <td style="text-align: right">13020</td>
    <td style="text-align: right">2.0</td>
    <td>self care</td>
    <td>dressing, undressing (standing or sitting)</td>
  </tr>
  <tr>
    <td style="text-align: right">13030</td>
    <td style="text-align: right">1.5</td>
    <td style="text-align: right">13030</td>
    <td style="text-align: right">1.5</td>
    <td>self care</td>
    <td>eating (sitting)</td>
  </tr>
  <tr>
    <td style="text-align: right">13035</td>
    <td style="text-align: right">2.0</td>
    <td style="text-align: right">13035</td>
    <td style="text-align: right">2.0</td>
    <td>self care</td>
    <td>talking and eating or eating only (standing)</td>
  </tr>
  <tr>
    <td></td>
    <td></td>
    <td style="text-align: right">13036</td>
    <td style="text-align: right">1.0</td>
    <td>self care</td>
    <td>taking medication, sitting or standing</td>
  </tr>
  <tr>
    <td style="text-align: right">13040</td>
    <td style="text-align: right">2.5</td>
    <td style="text-align: right">13040</td>
    <td style="text-align: right">2.0</td>
    <td>self care</td>
    <td>grooming (washing, shaving, brushing teeth, urinating, washing hands, putting on make-up), sitting or standing
    </td>
  </tr>
  <tr>
    <td></td>
    <td></td>
    <td style="text-align: right">13045</td>
    <td style="text-align: right">2.5</td>
    <td>self care</td>
    <td>hairstyling</td>
  </tr>
  <tr>
    <td></td>
    <td></td>
    <td style="text-align: right">13046</td>
    <td style="text-align: right">1.0</td>
    <td>self care</td>
    <td>having hair or nails done by someone else, sitting</td>
  </tr>
  <tr>
    <td style="text-align: right">13050</td>
    <td style="text-align: right">4.0</td>
    <td style="text-align: right">13050</td>
    <td style="text-align: right">2.0</td>
    <td>self care</td>
    <td>showering, toweling off (standing)</td>
  </tr>
  <tr>
    <td style="text-align: right">14010</td>
    <td style="text-align: right">1.5</td>
    <td style="text-align: right">14010</td>
    <td style="text-align: right">1.5</td>
    <td>sexual activity</td>
    <td>active, vigorous effort</td>
  </tr>
  <tr>
    <td style="text-align: right">14020</td>
    <td style="text-align: right">1.3</td>
    <td style="text-align: right">14020</td>
    <td style="text-align: right">1.3</td>
    <td>sexual activity</td>
    <td>general, moderate effort</td>
  </tr>
  <tr>
    <td style="text-align: right">14030</td>
    <td style="text-align: right">1.0</td>
    <td style="text-align: right">14030</td>
    <td style="text-align: right">1.0</td>
    <td>sexual activity</td>
    <td>passive, light effort, kissing, hugging</td>
  </tr>
  <tr>
    <td style="text-align: right">15010</td>
    <td style="text-align: right">3.5</td>
    <td style="text-align: right">15010</td>
    <td style="text-align: right">3.5</td>
    <td>sports</td>
    <td>archery (non-hunting)</td>
  </tr>
  <tr>
    <td style="text-align: right">15020</td>
    <td style="text-align: right">7.0</td>
    <td style="text-align: right">15020</td>
    <td style="text-align: right">7.0</td>
    <td>sports</td>
    <td>badminton, competitive (Taylor Code 450)</td>
  </tr>
  <tr>
    <td style="text-align: right">15030</td>
    <td style="text-align: right">4.5</td>
    <td style="text-align: right">15030</td>
    <td style="text-align: right">4.5</td>
    <td>sports</td>
    <td>badminton, social singles and doubles, general</td>
  </tr>
  <tr>
    <td style="text-align: right">15040</td>
    <td style="text-align: right">8.0</td>
    <td style="text-align: right">15040</td>
    <td style="text-align: right">8.0</td>
    <td>sports</td>
    <td>basketball, game (Taylor Code 490)</td>
  </tr>
  <tr>
    <td style="text-align: right">15050</td>
    <td style="text-align: right">6.0</td>
    <td style="text-align: right">15050</td>
    <td style="text-align: right">6.0</td>
    <td>sports</td>
    <td>basketball, non-game, general (Taylor Code 480)</td>
  </tr>
  <tr>
    <td style="text-align: right">15060</td>
    <td style="text-align: right">7.0</td>
    <td style="text-align: right">15060</td>
    <td style="text-align: right">7.0</td>
    <td>sports</td>
    <td>basketball, officiating (Taylor Code 500)</td>
  </tr>
  <tr>
    <td style="text-align: right">15070</td>
    <td style="text-align: right">4.5</td>
    <td style="text-align: right">15070</td>
    <td style="text-align: right">4.5</td>
    <td>sports</td>
    <td>basketball, shooting baskets</td>
  </tr>
  <tr>
    <td style="text-align: right">15075</td>
    <td style="text-align: right">6.5</td>
    <td style="text-align: right">15075</td>
    <td style="text-align: right">6.5</td>
    <td>sports</td>
    <td>basketball, wheelchair</td>
  </tr>
  <tr>
    <td style="text-align: right">15080</td>
    <td style="text-align: right">2.5</td>
    <td style="text-align: right">15080</td>
    <td style="text-align: right">2.5</td>
    <td>sports</td>
    <td>billiards</td>
  </tr>
  <tr>
    <td style="text-align: right">15090</td>
    <td style="text-align: right">3.0</td>
    <td style="text-align: right">15090</td>
    <td style="text-align: right">3.0</td>
    <td>sports</td>
    <td>bowling (Taylor Code 390)</td>
  </tr>
  <tr>
    <td style="text-align: right">15100</td>
    <td style="text-align: right">12.0</td>
    <td style="text-align: right">15100</td>
    <td style="text-align: right">12.0</td>
    <td>sports</td>
    <td>boxing, in ring, general</td>
  </tr>
  <tr>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td>Page 7 of 12</td>
  </tr>
</table>
<h2 class="pagenumber">Page 8</h2>
<table class="table table-striped table-bordered">
  <tr>
    <td style="text-align: right">1993</td>
    <td></td>
    <td style="text-align: right">2000</td>
    <td></td>
    <td></td>
    <td></td>
  </tr>
  <tr>
    <td>compcode</td>
    <td>METS</td>
    <td>compcode</td>
    <td>METS</td>
    <td>heading</td>
    <td>description</td>
  </tr>
  <tr>
    <td style="text-align: right">15110</td>
    <td style="text-align: right">6.0</td>
    <td style="text-align: right">15110</td>
    <td style="text-align: right">6.0</td>
    <td>sports</td>
    <td>boxing, punching bag</td>
  </tr>
  <tr>
    <td style="text-align: right">15120</td>
    <td style="text-align: right">9.0</td>
    <td style="text-align: right">15120</td>
    <td style="text-align: right">9.0</td>
    <td>sports</td>
    <td>boxing, sparring</td>
  </tr>
  <tr>
    <td style="text-align: right">15130</td>
    <td style="text-align: right">7.0</td>
    <td style="text-align: right">15130</td>
    <td style="text-align: right">7.0</td>
    <td>sports</td>
    <td>broomball</td>
  </tr>
  <tr>
    <td style="text-align: right">15135</td>
    <td style="text-align: right">5.0</td>
    <td style="text-align: right">15135</td>
    <td style="text-align: right">5.0</td>
    <td>sports</td>
    <td>children’s games (hopscotch, 4-square, dodge ball, playground apparatus, t-ball, tetherball, marbles, jacks,
      acrace games</td>
  </tr>
  <tr>
    <td style="text-align: right">15140</td>
    <td style="text-align: right">4.0</td>
    <td style="text-align: right">15140</td>
    <td style="text-align: right">4.0</td>
    <td>sports</td>
    <td>coaching: football, soccer, basketball, baseball, swimming, etc.</td>
  </tr>
  <tr>
    <td style="text-align: right">15150</td>
    <td style="text-align: right">5.0</td>
    <td style="text-align: right">15150</td>
    <td style="text-align: right">5.0</td>
    <td>sports</td>
    <td>cricket (batting, bowling)</td>
  </tr>
  <tr>
    <td style="text-align: right">15160</td>
    <td style="text-align: right">2.5</td>
    <td style="text-align: right">15160</td>
    <td style="text-align: right">2.5</td>
    <td>sports</td>
    <td>croquet</td>
  </tr>
  <tr>
    <td style="text-align: right">15170</td>
    <td style="text-align: right">4.0</td>
    <td style="text-align: right">15170</td>
    <td style="text-align: right">4.0</td>
    <td>sports</td>
    <td>curling</td>
  </tr>
  <tr>
    <td style="text-align: right">15180</td>
    <td style="text-align: right">2.5</td>
    <td style="text-align: right">15180</td>
    <td style="text-align: right">2.5</td>
    <td>sports</td>
    <td>darts, wall or lawn</td>
  </tr>
  <tr>
    <td style="text-align: right">15190</td>
    <td style="text-align: right">6.0</td>
    <td style="text-align: right">15190</td>
    <td style="text-align: right">6.0</td>
    <td>sports</td>
    <td>drag racing, pushing or driving a car</td>
  </tr>
  <tr>
    <td style="text-align: right">15200</td>
    <td style="text-align: right">6.0</td>
    <td style="text-align: right">15200</td>
    <td style="text-align: right">6.0</td>
    <td>sports</td>
    <td>fencing</td>
  </tr>
  <tr>
    <td style="text-align: right">15210</td>
    <td style="text-align: right">9.0</td>
    <td style="text-align: right">15210</td>
    <td style="text-align: right">9.0</td>
    <td>sports</td>
    <td>football, competitive</td>
  </tr>
  <tr>
    <td style="text-align: right">15230</td>
    <td style="text-align: right">8.0</td>
    <td style="text-align: right">15230</td>
    <td style="text-align: right">8.0</td>
    <td>sports</td>
    <td>football, touch, flag, general (Taylor Code 510</td>
  </tr>
  <tr>
    <td style="text-align: right">15235</td>
    <td style="text-align: right">2.5</td>
    <td style="text-align: right">15235</td>
    <td style="text-align: right">2.5</td>
    <td>sports</td>
    <td>football or baseball, playing catch</td>
  </tr>
  <tr>
    <td style="text-align: right">15240</td>
    <td style="text-align: right">3.0</td>
    <td style="text-align: right">15240</td>
    <td style="text-align: right">3.0</td>
    <td>sports</td>
    <td>frisbee playing, general</td>
  </tr>
  <tr>
    <td style="text-align: right">15250</td>
    <td style="text-align: right">3.5</td>
    <td style="text-align: right">15250</td>
    <td style="text-align: right">8.0</td>
    <td>sports</td>
    <td>frisbee, ultimate</td>
  </tr>
  <tr>
    <td style="text-align: right">15255</td>
    <td style="text-align: right">4.5</td>
    <td style="text-align: right">15255</td>
    <td style="text-align: right">4.5</td>
    <td>sports</td>
    <td>golf, general</td>
  </tr>
  <tr>
    <td style="text-align: right">15260</td>
    <td style="text-align: right">5.5</td>
    <td></td>
    <td></td>
    <td>sports</td>
    <td>golf carrying clubs</td>
  </tr>
  <tr>
    <td></td>
    <td></td>
    <td style="text-align: right">15265</td>
    <td style="text-align: right">4.5</td>
    <td>sports</td>
    <td>golf, walking and carrying clubs (See footnote at end of the Compendium</td>
  </tr>
  <tr>
    <td style="text-align: right">15270</td>
    <td style="text-align: right">3.0</td>
    <td style="text-align: right">15270</td>
    <td style="text-align: right">3.0</td>
    <td>sports</td>
    <td>golf, miniature, driving range</td>
  </tr>
  <tr>
    <td style="text-align: right">15280</td>
    <td style="text-align: right">5.0</td>
    <td></td>
    <td></td>
    <td>sports</td>
    <td>golf, pulling clubs</td>
  </tr>
  <tr>
    <td></td>
    <td></td>
    <td style="text-align: right">15285</td>
    <td style="text-align: right">4.3</td>
    <td>sports</td>
    <td>golf, walking and pulling clubs (See footnote at end of the Compendium</td>
  </tr>
  <tr>
    <td style="text-align: right">15290</td>
    <td style="text-align: right">3.5</td>
    <td style="text-align: right">15290</td>
    <td style="text-align: right">3.5</td>
    <td>sports</td>
    <td>golf, using power cart (Taylor Code 070)</td>
  </tr>
  <tr>
    <td style="text-align: right">15300</td>
    <td style="text-align: right">4.0</td>
    <td style="text-align: right">15300</td>
    <td style="text-align: right">4.0</td>
    <td>sports</td>
    <td>gymnastics, general</td>
  </tr>
  <tr>
    <td style="text-align: right">15310</td>
    <td style="text-align: right">4.0</td>
    <td style="text-align: right">15310</td>
    <td style="text-align: right">4.0</td>
    <td>sports</td>
    <td>hacky sack</td>
  </tr>
  <tr>
    <td style="text-align: right">15320</td>
    <td style="text-align: right">12.0</td>
    <td style="text-align: right">15320</td>
    <td style="text-align: right">12.0</td>
    <td>sports</td>
    <td>handball, general (Taylor Code 520)</td>
  </tr>
  <tr>
    <td style="text-align: right">15330</td>
    <td style="text-align: right">8.0</td>
    <td style="text-align: right">15330</td>
    <td style="text-align: right">8.0</td>
    <td>sports</td>
    <td>handball, team</td>
  </tr>
  <tr>
    <td style="text-align: right">15340</td>
    <td style="text-align: right">3.5</td>
    <td style="text-align: right">15340</td>
    <td style="text-align: right">3.5</td>
    <td>sports</td>
    <td>hand gliding</td>
  </tr>
  <tr>
    <td style="text-align: right">15350</td>
    <td style="text-align: right">8.0</td>
    <td style="text-align: right">15350</td>
    <td style="text-align: right">8.0</td>
    <td>sports</td>
    <td>hockey, field</td>
  </tr>
  <tr>
    <td style="text-align: right">15360</td>
    <td style="text-align: right">8.0</td>
    <td style="text-align: right">15360</td>
    <td style="text-align: right">8.0</td>
    <td>sports</td>
    <td>hockey, ice</td>
  </tr>
  <tr>
    <td style="text-align: right">15370</td>
    <td style="text-align: right">4.0</td>
    <td style="text-align: right">15370</td>
    <td style="text-align: right">4.0</td>
    <td>sports</td>
    <td>horseback riding, general</td>
  </tr>
  <tr>
    <td style="text-align: right">15380</td>
    <td style="text-align: right">3.5</td>
    <td style="text-align: right">15380</td>
    <td style="text-align: right">3.5</td>
    <td>sports</td>
    <td>horseback riding, saddling horse, grooming horse</td>
  </tr>
  <tr>
    <td style="text-align: right">15390</td>
    <td style="text-align: right">6.5</td>
    <td style="text-align: right">15390</td>
    <td style="text-align: right">6.5</td>
    <td>sports</td>
    <td>horseback riding, trotting</td>
  </tr>
  <tr>
    <td style="text-align: right">15400</td>
    <td style="text-align: right">2.5</td>
    <td style="text-align: right">15400</td>
    <td style="text-align: right">2.5</td>
    <td>sports</td>
    <td>horseback riding, walking</td>
  </tr>
  <tr>
    <td style="text-align: right">15410</td>
    <td style="text-align: right">3.0</td>
    <td style="text-align: right">15410</td>
    <td style="text-align: right">3.0</td>
    <td>sports</td>
    <td>horseshoe pitching, quoits</td>
  </tr>
  <tr>
    <td style="text-align: right">15420</td>
    <td style="text-align: right">12.0</td>
    <td style="text-align: right">15420</td>
    <td style="text-align: right">12.0</td>
    <td>sports</td>
    <td>jai alai</td>
  </tr>
  <tr>
    <td style="text-align: right">15430</td>
    <td style="text-align: right">10.0</td>
    <td style="text-align: right">15430</td>
    <td style="text-align: right">10.0</td>
    <td>sports</td>
    <td>judo, jujitsu, karate, kick boxing, tae kwan do</td>
  </tr>
  <tr>
    <td style="text-align: right">15440</td>
    <td style="text-align: right">4.0</td>
    <td style="text-align: right">15440</td>
    <td style="text-align: right">4.0</td>
    <td>sports</td>
    <td>juggling</td>
  </tr>
  <tr>
    <td style="text-align: right">15450</td>
    <td style="text-align: right">7.0</td>
    <td style="text-align: right">15450</td>
    <td style="text-align: right">7.0</td>
    <td>sports</td>
    <td>kickball</td>
  </tr>
  <tr>
    <td style="text-align: right">15460</td>
    <td style="text-align: right">8.0</td>
    <td style="text-align: right">15460</td>
    <td style="text-align: right">8.0</td>
    <td>sports</td>
    <td>lacrosse</td>
  </tr>
  <tr>
    <td style="text-align: right">15470</td>
    <td style="text-align: right">4.0</td>
    <td style="text-align: right">15470</td>
    <td style="text-align: right">4.0</td>
    <td>sports</td>
    <td>motor-cross</td>
  </tr>
  <tr>
    <td style="text-align: right">15480</td>
    <td style="text-align: right">9.0</td>
    <td style="text-align: right">15480</td>
    <td style="text-align: right">9.0</td>
    <td>sports</td>
    <td>orienteering</td>
  </tr>
  <tr>
    <td style="text-align: right">15490</td>
    <td style="text-align: right">10.0</td>
    <td style="text-align: right">15490</td>
    <td style="text-align: right">10.0</td>
    <td>sports</td>
    <td>paddleball, competitive</td>
  </tr>
  <tr>
    <td style="text-align: right">15500</td>
    <td style="text-align: right">6.0</td>
    <td style="text-align: right">15500</td>
    <td style="text-align: right">6.0</td>
    <td>sports</td>
    <td>paddleball, casual, general (Taylor Code 460)</td>
  </tr>
  <tr>
    <td style="text-align: right">15510</td>
    <td style="text-align: right">8.0</td>
    <td style="text-align: right">15510</td>
    <td style="text-align: right">8.0</td>
    <td>sports</td>
    <td>polo</td>
  </tr>
  <tr>
    <td style="text-align: right">15520</td>
    <td style="text-align: right">10.0</td>
    <td style="text-align: right">15520</td>
    <td style="text-align: right">10.0</td>
    <td>sports</td>
    <td>racquetball, competitive</td>
  </tr>
  <tr>
    <td style="text-align: right">15530</td>
    <td style="text-align: right">7.0</td>
    <td style="text-align: right">15530</td>
    <td style="text-align: right">7.0</td>
    <td>sports</td>
    <td>racquetball, casual, general (Taylor Code 470)</td>
  </tr>
  <tr>
    <td style="text-align: right">15535</td>
    <td style="text-align: right">11.0</td>
    <td style="text-align: right">15535</td>
    <td style="text-align: right">11.0</td>
    <td>sports</td>
    <td>rock climbing, ascending rock</td>
  </tr>
  <tr>
    <td style="text-align: right">15540</td>
    <td style="text-align: right">8.0</td>
    <td style="text-align: right">15540</td>
    <td style="text-align: right">8.0</td>
    <td>sports</td>
    <td>rock climbing, rappelling</td>
  </tr>
  <tr>
    <td style="text-align: right">15550</td>
    <td style="text-align: right">12.0</td>
    <td style="text-align: right">15550</td>
    <td style="text-align: right">12.0</td>
    <td>sports</td>
    <td>rope jumping, fast</td>
  </tr>
  <tr>
    <td style="text-align: right">15551</td>
    <td style="text-align: right">10.0</td>
    <td style="text-align: right">15551</td>
    <td style="text-align: right">10.0</td>
    <td>sports</td>
    <td>rope jumping, moderate, general</td>
  </tr>
  <tr>
    <td style="text-align: right">15552</td>
    <td style="text-align: right">8.0</td>
    <td style="text-align: right">15552</td>
    <td style="text-align: right">8.0</td>
    <td>sports</td>
    <td>rope jumping, slow</td>
  </tr>
  <tr>
    <td style="text-align: right">15560</td>
    <td style="text-align: right">10.0</td>
    <td style="text-align: right">15560</td>
    <td style="text-align: right">10.0</td>
    <td>sports</td>
    <td>rugby</td>
  </tr>
  <tr>
    <td style="text-align: right">15570</td>
    <td style="text-align: right">3.0</td>
    <td style="text-align: right">15570</td>
    <td style="text-align: right">3.0</td>
    <td>sports</td>
    <td>shuffleboard, lawn bowling</td>
  </tr>
  <tr>
    <td style="text-align: right">15580</td>
    <td style="text-align: right">5.0</td>
    <td style="text-align: right">15580</td>
    <td style="text-align: right">5.0</td>
    <td>sports</td>
    <td>skateboarding</td>
  </tr>
  <tr>
    <td style="text-align: right">15590</td>
    <td style="text-align: right">7.0</td>
    <td style="text-align: right">15590</td>
    <td style="text-align: right">7.0</td>
    <td>sports</td>
    <td>skating, roller (Taylor Code 360)</td>
  </tr>
  <tr>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td>Page 8 of 12</td>
  </tr>
</table>
<h2 class="pagenumber">Page 9</h2>
<table class="table table-striped table-bordered">
  <tr>
    <td style="text-align: right">1993</td>
    <td></td>
    <td style="text-align: right">2000</td>
    <td></td>
    <td></td>
    <td></td>
  </tr>
  <tr>
    <td>compcode</td>
    <td>METS</td>
    <td>compcode</td>
    <td>METS</td>
    <td>heading</td>
    <td>description</td>
  </tr>
  <tr>
    <td></td>
    <td></td>
    <td style="text-align: right">15591</td>
    <td style="text-align: right">12.0</td>
    <td>sports</td>
    <td>roller blading (in-line skating)</td>
  </tr>
  <tr>
    <td style="text-align: right">15600</td>
    <td style="text-align: right">3.5</td>
    <td style="text-align: right">15600</td>
    <td style="text-align: right">3.5</td>
    <td>sports</td>
    <td>sky diving</td>
  </tr>
  <tr>
    <td style="text-align: right">15605</td>
    <td style="text-align: right">10.0</td>
    <td style="text-align: right">15605</td>
    <td style="text-align: right">10.0</td>
    <td>sports</td>
    <td>soccer, competitive</td>
  </tr>
  <tr>
    <td style="text-align: right">15610</td>
    <td style="text-align: right">7.0</td>
    <td style="text-align: right">15610</td>
    <td style="text-align: right">7.0</td>
    <td>sports</td>
    <td>soccer, casual, general (Taylor Code 540)</td>
  </tr>
  <tr>
    <td style="text-align: right">15620</td>
    <td style="text-align: right">5.0</td>
    <td style="text-align: right">15620</td>
    <td style="text-align: right">5.0</td>
    <td>sports</td>
    <td>softball or baseball, fast or slow pitch, general (Taylor Code 440)</td>
  </tr>
  <tr>
    <td style="text-align: right">15630</td>
    <td style="text-align: right">4.0</td>
    <td style="text-align: right">15630</td>
    <td style="text-align: right">4.0</td>
    <td>sports</td>
    <td>softball, officiating</td>
  </tr>
  <tr>
    <td style="text-align: right">15640</td>
    <td style="text-align: right">6.0</td>
    <td style="text-align: right">15640</td>
    <td style="text-align: right">6.0</td>
    <td>sports</td>
    <td>softball, pitching</td>
  </tr>
  <tr>
    <td style="text-align: right">15650</td>
    <td style="text-align: right">12.0</td>
    <td style="text-align: right">15650</td>
    <td style="text-align: right">12.0</td>
    <td>sports</td>
    <td>squash (Taylor Code 530)</td>
  </tr>
  <tr>
    <td style="text-align: right">15660</td>
    <td style="text-align: right">4.0</td>
    <td style="text-align: right">15660</td>
    <td style="text-align: right">4.0</td>
    <td>sports</td>
    <td>table tennis, ping pong (Taylor Code 410)</td>
  </tr>
  <tr>
    <td style="text-align: right">15670</td>
    <td style="text-align: right">4.0</td>
    <td style="text-align: right">15670</td>
    <td style="text-align: right">4.0</td>
    <td>sports</td>
    <td>tai chi</td>
  </tr>
  <tr>
    <td style="text-align: right">15675</td>
    <td style="text-align: right">7.0</td>
    <td style="text-align: right">15675</td>
    <td style="text-align: right">7.0</td>
    <td>sports</td>
    <td>tennis, general</td>
  </tr>
  <tr>
    <td style="text-align: right">15680</td>
    <td style="text-align: right">6.0</td>
    <td style="text-align: right">15680</td>
    <td style="text-align: right">6.0</td>
    <td>sports</td>
    <td>tennis, doubles (Taylor Code 430)</td>
  </tr>
  <tr>
    <td></td>
    <td></td>
    <td style="text-align: right">15685</td>
    <td style="text-align: right">5.0</td>
    <td>sports</td>
    <td>tennis, doubles</td>
  </tr>
  <tr>
    <td style="text-align: right">15690</td>
    <td style="text-align: right">8.0</td>
    <td style="text-align: right">15690</td>
    <td style="text-align: right">8.0</td>
    <td>sports</td>
    <td>tennis, singles (Taylor Code 420)</td>
  </tr>
  <tr>
    <td style="text-align: right">15700</td>
    <td style="text-align: right">3.5</td>
    <td style="text-align: right">15700</td>
    <td style="text-align: right">3.5</td>
    <td>sports</td>
    <td>trampoline</td>
  </tr>
  <tr>
    <td style="text-align: right">15710</td>
    <td style="text-align: right">4.0</td>
    <td style="text-align: right">15710</td>
    <td style="text-align: right">4.0</td>
    <td>sports</td>
    <td>volleyball (Taylor Code 400)</td>
  </tr>
  <tr>
    <td></td>
    <td></td>
    <td style="text-align: right">15711</td>
    <td style="text-align: right">8.0</td>
    <td>sports</td>
    <td>volleyball, competitive, in gymnasium</td>
  </tr>
  <tr>
    <td style="text-align: right">15720</td>
    <td style="text-align: right">3.0</td>
    <td style="text-align: right">15720</td>
    <td style="text-align: right">3.0</td>
    <td>sports</td>
    <td>volleyball, non-competitive, 6 - 9 member team, genera</td>
  </tr>
  <tr>
    <td style="text-align: right">15725</td>
    <td style="text-align: right">8.0</td>
    <td style="text-align: right">15725</td>
    <td style="text-align: right">8.0</td>
    <td>sports</td>
    <td>volleyball, beach</td>
  </tr>
  <tr>
    <td style="text-align: right">15730</td>
    <td style="text-align: right">6.0</td>
    <td style="text-align: right">15730</td>
    <td style="text-align: right">6.0</td>
    <td>sports</td>
    <td>wrestling (one match = 5 minutes)</td>
  </tr>
  <tr>
    <td style="text-align: right">15731</td>
    <td style="text-align: right">7.0</td>
    <td style="text-align: right">15731</td>
    <td style="text-align: right">7.0</td>
    <td>sports</td>
    <td>wallyball, general</td>
  </tr>
  <tr>
    <td></td>
    <td></td>
    <td style="text-align: right">15732</td>
    <td style="text-align: right">4.0</td>
    <td>sports</td>
    <td>track and field (shot, discus, hammer throw)</td>
  </tr>
  <tr>
    <td></td>
    <td></td>
    <td style="text-align: right">15733</td>
    <td style="text-align: right">6.0</td>
    <td>sports</td>
    <td>track and field (high jump, long jump, triple jump, javelin, pole vault)</td>
  </tr>
  <tr>
    <td></td>
    <td></td>
    <td style="text-align: right">15734</td>
    <td style="text-align: right">10.0</td>
    <td>sports</td>
    <td>track and field (steeplechase, hurdles)</td>
  </tr>
  <tr>
    <td style="text-align: right">16010</td>
    <td style="text-align: right">2.0</td>
    <td style="text-align: right">16010</td>
    <td style="text-align: right">2.0</td>
    <td>transportation</td>
    <td>automobile or light truck (not a semi) driving</td>
  </tr>
  <tr>
    <td></td>
    <td></td>
    <td style="text-align: right">16015</td>
    <td style="text-align: right">1.0</td>
    <td>transportation</td>
    <td>riding in a car or truck</td>
  </tr>
  <tr>
    <td></td>
    <td></td>
    <td style="text-align: right">16016</td>
    <td style="text-align: right">1.0</td>
    <td>transportation</td>
    <td>riding in a bus</td>
  </tr>
  <tr>
    <td style="text-align: right">16020</td>
    <td style="text-align: right">2.0</td>
    <td style="text-align: right">16020</td>
    <td style="text-align: right">2.0</td>
    <td>transportation</td>
    <td>flying airplane</td>
  </tr>
  <tr>
    <td style="text-align: right">16030</td>
    <td style="text-align: right">2.5</td>
    <td style="text-align: right">16030</td>
    <td style="text-align: right">2.5</td>
    <td>transportation</td>
    <td>motor scooter, motorcycle</td>
  </tr>
  <tr>
    <td style="text-align: right">16040</td>
    <td style="text-align: right">6.0</td>
    <td style="text-align: right">16040</td>
    <td style="text-align: right">6.0</td>
    <td>transportation</td>
    <td>pushing plane in and out of hangar</td>
  </tr>
  <tr>
    <td style="text-align: right">16050</td>
    <td style="text-align: right">3.0</td>
    <td style="text-align: right">16050</td>
    <td style="text-align: right">3.0</td>
    <td>transportation</td>
    <td>driving heavy truck, tractor, bus</td>
  </tr>
  <tr>
    <td style="text-align: right">17010</td>
    <td style="text-align: right">7.0</td>
    <td style="text-align: right">17010</td>
    <td style="text-align: right">7.0</td>
    <td>walking</td>
    <td>backpacking (Taylor Code 050)</td>
  </tr>
  <tr>
    <td style="text-align: right">17020</td>
    <td style="text-align: right">3.5</td>
    <td style="text-align: right">17020</td>
    <td style="text-align: right">3.5</td>
    <td>walking</td>
    <td>carrying infant or 15 pound load (e.g. suitcase), level ground or downstairs</td>
  </tr>
  <tr>
    <td style="text-align: right">17025</td>
    <td style="text-align: right">9.0</td>
    <td style="text-align: right">17025</td>
    <td style="text-align: right">9.0</td>
    <td>walking</td>
    <td>carrying load upstairs, general</td>
  </tr>
  <tr>
    <td style="text-align: right">17026</td>
    <td style="text-align: right">5.0</td>
    <td style="text-align: right">17026</td>
    <td style="text-align: right">5.0</td>
    <td>walking</td>
    <td>carrying 1 to 15 lb load, upstairs</td>
  </tr>
  <tr>
    <td style="text-align: right">17027</td>
    <td style="text-align: right">6.0</td>
    <td style="text-align: right">17027</td>
    <td style="text-align: right">6.0</td>
    <td>walking</td>
    <td>carrying 16 to 24 lb load, upstairs</td>
  </tr>
  <tr>
    <td style="text-align: right">17028</td>
    <td style="text-align: right">8.0</td>
    <td style="text-align: right">17028</td>
    <td style="text-align: right">8.0</td>
    <td>walking</td>
    <td>carrying 25 to 49 lb load, upstairs</td>
  </tr>
  <tr>
    <td style="text-align: right">17029</td>
    <td style="text-align: right">10.0</td>
    <td style="text-align: right">17029</td>
    <td style="text-align: right">10.0</td>
    <td>walking</td>
    <td>carrying 50 to 74 lb load, upstairs</td>
  </tr>
  <tr>
    <td style="text-align: right">17030</td>
    <td style="text-align: right">12.0</td>
    <td style="text-align: right">17030</td>
    <td style="text-align: right">12.0</td>
    <td>walking</td>
    <td>carrying 74+ lb load, upstairs</td>
  </tr>
  <tr>
    <td></td>
    <td></td>
    <td style="text-align: right">17031</td>
    <td style="text-align: right">3.0</td>
    <td>walking</td>
    <td>loading /unloading a car</td>
  </tr>
  <tr>
    <td style="text-align: right">17035</td>
    <td style="text-align: right">7.0</td>
    <td style="text-align: right">17035</td>
    <td style="text-align: right">7.0</td>
    <td>walking</td>
    <td>climbing hills with 0 to 9 pound load</td>
  </tr>
  <tr>
    <td style="text-align: right">17040</td>
    <td style="text-align: right">7.5</td>
    <td style="text-align: right">17040</td>
    <td style="text-align: right">7.5</td>
    <td>walking</td>
    <td>climbing hills with 10 to 20 pound load</td>
  </tr>
  <tr>
    <td style="text-align: right">17050</td>
    <td style="text-align: right">8.0</td>
    <td style="text-align: right">17050</td>
    <td style="text-align: right">8.0</td>
    <td>walking</td>
    <td>climbing hills with 21 to 42 pound load</td>
  </tr>
  <tr>
    <td style="text-align: right">17060</td>
    <td style="text-align: right">9.0</td>
    <td style="text-align: right">17060</td>
    <td style="text-align: right">9.0</td>
    <td>walking</td>
    <td>climbing hills with 42+ pound load</td>
  </tr>
  <tr>
    <td style="text-align: right">17070</td>
    <td style="text-align: right">3.0</td>
    <td style="text-align: right">17070</td>
    <td style="text-align: right">3.0</td>
    <td>walking</td>
    <td>downstairs</td>
  </tr>
  <tr>
    <td style="text-align: right">17080</td>
    <td style="text-align: right">6.0</td>
    <td style="text-align: right">17080</td>
    <td style="text-align: right">6.0</td>
    <td>walking</td>
    <td>hiking, cross country (Taylor Code 040)</td>
  </tr>
  <tr>
    <td></td>
    <td></td>
    <td style="text-align: right">17085</td>
    <td style="text-align: right">2.5</td>
    <td>walking</td>
    <td>bird watching</td>
  </tr>
  <tr>
    <td style="text-align: right">17090</td>
    <td style="text-align: right">6.5</td>
    <td style="text-align: right">17090</td>
    <td style="text-align: right">6.5</td>
    <td>walking</td>
    <td>marching, rapidly, military</td>
  </tr>
  <tr>
    <td style="text-align: right">17100</td>
    <td style="text-align: right">2.5</td>
    <td style="text-align: right">17100</td>
    <td style="text-align: right">2.5</td>
    <td>walking</td>
    <td>pushing or pulling stroller with child or walking with children</td>
  </tr>
  <tr>
    <td></td>
    <td></td>
    <td style="text-align: right">17105</td>
    <td style="text-align: right">4.0</td>
    <td>walking</td>
    <td>pushing a wheelchair, non-occupational setting</td>
  </tr>
  <tr>
    <td style="text-align: right">17110</td>
    <td style="text-align: right">6.5</td>
    <td style="text-align: right">17110</td>
    <td style="text-align: right">6.5</td>
    <td>walking</td>
    <td>race walking</td>
  </tr>
  <tr>
    <td style="text-align: right">17120</td>
    <td style="text-align: right">8.0</td>
    <td style="text-align: right">17120</td>
    <td style="text-align: right">8.0</td>
    <td>walking</td>
    <td>rock or mountain climbing (Taylor Code 060)</td>
  </tr>
  <tr>
    <td style="text-align: right">17130</td>
    <td style="text-align: right">8.0</td>
    <td style="text-align: right">17130</td>
    <td style="text-align: right">8.0</td>
    <td>walking</td>
    <td>up stairs, using or climbing up ladder (Taylor Code 030)</td>
  </tr>
  <tr>
    <td style="text-align: right">17140</td>
    <td style="text-align: right">4.0</td>
    <td style="text-align: right">17140</td>
    <td style="text-align: right">5.0</td>
    <td>walking</td>
    <td>using crutches</td>
  </tr>
  <tr>
    <td style="text-align: right">17150</td>
    <td style="text-align: right">2.0</td>
    <td style="text-align: right">17150</td>
    <td style="text-align: right">2.0</td>
    <td>walking</td>
    <td>walking, household walking</td>
  </tr>
  <tr>
    <td></td>
    <td></td>
    <td style="text-align: right">17151</td>
    <td style="text-align: right">2.0</td>
    <td>walking</td>
    <td>walking, less than 2.0 mph, level ground, strolling, very slow</td>
  </tr>
  <tr>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td>Page 9 of 12</td>
  </tr>
</table>
<h2 class="pagenumber">Page 10</h2>
<table class="table table-striped table-bordered">
  <tr>
    <td style="text-align: right">1993</td>
    <td></td>
    <td style="text-align: right">2000</td>
    <td></td>
    <td></td>
    <td></td>
  </tr>
  <tr>
    <td>compcode</td>
    <td>METS</td>
    <td>compcode</td>
    <td>METS</td>
    <td>heading</td>
    <td>description</td>
  </tr>
  <tr>
    <td></td>
    <td></td>
    <td style="text-align: right">17152</td>
    <td style="text-align: right">2.5</td>
    <td>walking</td>
    <td>walking, 2.0 mph, level, slow pace, firm surface</td>
  </tr>
  <tr>
    <td style="text-align: right">17160</td>
    <td style="text-align: right">2.5</td>
    <td style="text-align: right">17160</td>
    <td style="text-align: right">3.5</td>
    <td>walking</td>
    <td>walking for pleasure (Taylor Code 010)</td>
  </tr>
  <tr>
    <td></td>
    <td></td>
    <td style="text-align: right">17161</td>
    <td style="text-align: right">2.5</td>
    <td>walking</td>
    <td>walking from house to car or bus, from car or bus to go places, from car or bus to and from the worksite</td>
  </tr>
  <tr>
    <td></td>
    <td></td>
    <td style="text-align: right">17162</td>
    <td style="text-align: right">2.5</td>
    <td>walking</td>
    <td>walking to neighbor’s house or family’s house for social reasons</td>
  </tr>
  <tr>
    <td></td>
    <td></td>
    <td style="text-align: right">17165</td>
    <td style="text-align: right">3.0</td>
    <td>walking</td>
    <td>walking the dog</td>
  </tr>
  <tr>
    <td style="text-align: right">17170</td>
    <td style="text-align: right">3.0</td>
    <td style="text-align: right">17170</td>
    <td style="text-align: right">3.0</td>
    <td>walking</td>
    <td>walking, 2.5 mph, firm surface</td>
  </tr>
  <tr>
    <td style="text-align: right">17180</td>
    <td style="text-align: right">3.0</td>
    <td style="text-align: right">17180</td>
    <td style="text-align: right">2.8</td>
    <td>walking</td>
    <td>walking, 2.5 mph, downhill</td>
  </tr>
  <tr>
    <td style="text-align: right">17190</td>
    <td style="text-align: right">3.5</td>
    <td style="text-align: right">17190</td>
    <td style="text-align: right">3.3</td>
    <td>walking</td>
    <td>walking, 3.0 mph, level, moderate pace, firm surface</td>
  </tr>
  <tr>
    <td style="text-align: right">17200</td>
    <td style="text-align: right">4.0</td>
    <td style="text-align: right">17200</td>
    <td style="text-align: right">3.8</td>
    <td>walking</td>
    <td>walking, 3.5 mph, level, brisk, firm surface, walking for exercise</td>
  </tr>
  <tr>
    <td style="text-align: right">17210</td>
    <td style="text-align: right">6.0</td>
    <td style="text-align: right">17210</td>
    <td style="text-align: right">6.0</td>
    <td>walking</td>
    <td>walking, 3.5 mph, uphill</td>
  </tr>
  <tr>
    <td style="text-align: right">17220</td>
    <td style="text-align: right">4.0</td>
    <td style="text-align: right">17220</td>
    <td style="text-align: right">5.0</td>
    <td>walking</td>
    <td>walking, 4.0 mph, level, firm surface, very brisk pace</td>
  </tr>
  <tr>
    <td style="text-align: right">17230</td>
    <td style="text-align: right">4.5</td>
    <td style="text-align: right">17230</td>
    <td style="text-align: right">6.3</td>
    <td>walking</td>
    <td>walking, 4.5 mph, level, firm surface, very, very brisk</td>
  </tr>
  <tr>
    <td></td>
    <td></td>
    <td style="text-align: right">17231</td>
    <td style="text-align: right">8.0</td>
    <td>walking</td>
    <td>walking, 5.0 mph</td>
  </tr>
  <tr>
    <td style="text-align: right">17250</td>
    <td style="text-align: right">3.5</td>
    <td style="text-align: right">17250</td>
    <td style="text-align: right">3.5</td>
    <td>walking</td>
    <td>walking, for pleasure, work break</td>
  </tr>
  <tr>
    <td style="text-align: right">17260</td>
    <td style="text-align: right">5.0</td>
    <td style="text-align: right">17260</td>
    <td style="text-align: right">5.0</td>
    <td>walking</td>
    <td>walking, grass track</td>
  </tr>
  <tr>
    <td style="text-align: right">17270</td>
    <td style="text-align: right">4.0</td>
    <td style="text-align: right">17270</td>
    <td style="text-align: right">4.0</td>
    <td>walking</td>
    <td>walking, to work or class (Taylor Code 015)</td>
  </tr>
  <tr>
    <td></td>
    <td></td>
    <td style="text-align: right">17280</td>
    <td style="text-align: right">2.5</td>
    <td>walking</td>
    <td>walking to and from an outhouse</td>
  </tr>
  <tr>
    <td style="text-align: right">18010</td>
    <td style="text-align: right">2.5</td>
    <td style="text-align: right">18010</td>
    <td style="text-align: right">2.5</td>
    <td>water activities</td>
    <td>boating, power</td>
  </tr>
  <tr>
    <td style="text-align: right">18020</td>
    <td style="text-align: right">4.0</td>
    <td style="text-align: right">18020</td>
    <td style="text-align: right">4.0</td>
    <td>water activities</td>
    <td>canoeing, on camping trip (Taylor Code 270)</td>
  </tr>
  <tr>
    <td></td>
    <td></td>
    <td style="text-align: right">18025</td>
    <td style="text-align: right">3.3</td>
    <td>water activities</td>
    <td>canoeing, harvesting wild rice, knocking rice off the stalks</td>
  </tr>
  <tr>
    <td style="text-align: right">18030</td>
    <td style="text-align: right">7.0</td>
    <td style="text-align: right">18030</td>
    <td style="text-align: right">7.0</td>
    <td>water activities</td>
    <td>canoeing, portaging</td>
  </tr>
  <tr>
    <td style="text-align: right">18040</td>
    <td style="text-align: right">3.0</td>
    <td style="text-align: right">18040</td>
    <td style="text-align: right">3.0</td>
    <td>water activities</td>
    <td>canoeing, rowing, 2.0-3.9 mph, light effort</td>
  </tr>
  <tr>
    <td style="text-align: right">18050</td>
    <td style="text-align: right">7.0</td>
    <td style="text-align: right">18050</td>
    <td style="text-align: right">7.0</td>
    <td>water activities</td>
    <td>canoeing, rowing, 4.0-5.9 mph, moderate effort</td>
  </tr>
  <tr>
    <td style="text-align: right">18060</td>
    <td style="text-align: right">12.0</td>
    <td style="text-align: right">18060</td>
    <td style="text-align: right">12.0</td>
    <td>water activities</td>
    <td>canoeing, rowing, &gt;6 mph, vigorous effort</td>
  </tr>
  <tr>
    <td style="text-align: right">18070</td>
    <td style="text-align: right">3.5</td>
    <td style="text-align: right">18070</td>
    <td style="text-align: right">3.5</td>
    <td>water activities</td>
    <td>canoeing, rowing, for pleasure, general (Taylor Code 250</td>
  </tr>
  <tr>
    <td style="text-align: right">18080</td>
    <td style="text-align: right">12.0</td>
    <td style="text-align: right">18080</td>
    <td style="text-align: right">12.0</td>
    <td>water activities</td>
    <td>canoeing, rowing, in competition, or crew or sculling (Taylor Code 260</td>
  </tr>
  <tr>
    <td style="text-align: right">18090</td>
    <td style="text-align: right">3.0</td>
    <td style="text-align: right">18090</td>
    <td style="text-align: right">3.0</td>
    <td>water activities</td>
    <td>diving, springboard or platform</td>
  </tr>
  <tr>
    <td style="text-align: right">18100</td>
    <td style="text-align: right">5.0</td>
    <td style="text-align: right">18100</td>
    <td style="text-align: right">5.0</td>
    <td>water activities</td>
    <td>kayaking</td>
  </tr>
  <tr>
    <td style="text-align: right">18110</td>
    <td style="text-align: right">4.0</td>
    <td style="text-align: right">18110</td>
    <td style="text-align: right">4.0</td>
    <td>water activities</td>
    <td>paddle boat</td>
  </tr>
  <tr>
    <td style="text-align: right">18120</td>
    <td style="text-align: right">3.0</td>
    <td style="text-align: right">18120</td>
    <td style="text-align: right">3.0</td>
    <td>water activities</td>
    <td>sailing, boat and board sailing, windsurfing, ice sailing, general (Taylor Code 235)</td>
  </tr>
  <tr>
    <td style="text-align: right">18130</td>
    <td style="text-align: right">5.0</td>
    <td style="text-align: right">18130</td>
    <td style="text-align: right">5.0</td>
    <td>water activities</td>
    <td>sailing, in competition</td>
  </tr>
  <tr>
    <td style="text-align: right">18140</td>
    <td style="text-align: right">3.0</td>
    <td style="text-align: right">18140</td>
    <td style="text-align: right">3.0</td>
    <td>water activities</td>
    <td>sailing, Sunfish/Laser/Hobby Cat, Keel boats, ocean sailing, yachting</td>
  </tr>
  <tr>
    <td style="text-align: right">18150</td>
    <td style="text-align: right">6.0</td>
    <td style="text-align: right">18150</td>
    <td style="text-align: right">6.0</td>
    <td>water activities</td>
    <td>skiing, water (Taylor Code 220)</td>
  </tr>
  <tr>
    <td style="text-align: right">18160</td>
    <td style="text-align: right">7.0</td>
    <td style="text-align: right">18160</td>
    <td style="text-align: right">7.0</td>
    <td>water activities</td>
    <td>skimobiling</td>
  </tr>
  <tr>
    <td style="text-align: right">18170</td>
    <td style="text-align: right">12.0</td>
    <td></td>
    <td></td>
    <td>water activities</td>
    <td></td>
  </tr>
  <tr>
    <td style="text-align: right">18180</td>
    <td style="text-align: right">16.0</td>
    <td style="text-align: right">18180</td>
    <td style="text-align: right">16.0</td>
    <td>water activities</td>
    <td>skindiving, fast</td>
  </tr>
  <tr>
    <td style="text-align: right">18190</td>
    <td style="text-align: right">12.5</td>
    <td style="text-align: right">18190</td>
    <td style="text-align: right">12.5</td>
    <td>water activities</td>
    <td>skindiving, moderate</td>
  </tr>
  <tr>
    <td style="text-align: right">18200</td>
    <td style="text-align: right">7.0</td>
    <td style="text-align: right">18200</td>
    <td style="text-align: right">7.0</td>
    <td>water activities</td>
    <td>skindiving, scuba diving, general (Taylor Code 310)</td>
  </tr>
  <tr>
    <td style="text-align: right">18210</td>
    <td style="text-align: right">5.0</td>
    <td style="text-align: right">18210</td>
    <td style="text-align: right">5.0</td>
    <td>water activities</td>
    <td>snorkeling (Taylor Code 320)</td>
  </tr>
  <tr>
    <td style="text-align: right">18220</td>
    <td style="text-align: right">3.0</td>
    <td style="text-align: right">18220</td>
    <td style="text-align: right">3.0</td>
    <td>water activities</td>
    <td>surfing, body or board</td>
  </tr>
  <tr>
    <td style="text-align: right">18230</td>
    <td style="text-align: right">10.0</td>
    <td style="text-align: right">18230</td>
    <td style="text-align: right">10.0</td>
    <td>water activities</td>
    <td>swimming laps, freestyle, fast, vigorous effort</td>
  </tr>
  <tr>
    <td style="text-align: right">18240</td>
    <td style="text-align: right">8.0</td>
    <td style="text-align: right">18240</td>
    <td style="text-align: right">7.0</td>
    <td>water activities</td>
    <td>swimming laps, freestyle, slow, moderate or light effort</td>
  </tr>
  <tr>
    <td style="text-align: right">18250</td>
    <td style="text-align: right">8.0</td>
    <td style="text-align: right">18250</td>
    <td style="text-align: right">7.0</td>
    <td>water activities</td>
    <td>swimming, backstroke, general</td>
  </tr>
  <tr>
    <td style="text-align: right">18260</td>
    <td style="text-align: right">10.0</td>
    <td style="text-align: right">18260</td>
    <td style="text-align: right">10.0</td>
    <td>water activities</td>
    <td>swimming, breaststroke, general</td>
  </tr>
  <tr>
    <td style="text-align: right">18270</td>
    <td style="text-align: right">11.0</td>
    <td style="text-align: right">18270</td>
    <td style="text-align: right">11.0</td>
    <td>water activities</td>
    <td>swimming, butterfly, general</td>
  </tr>
  <tr>
    <td style="text-align: right">18280</td>
    <td style="text-align: right">11.0</td>
    <td style="text-align: right">18280</td>
    <td style="text-align: right">11.0</td>
    <td>water activities</td>
    <td>swimming, crawl, fast (75 yards/minute), vigorous effort</td>
  </tr>
  <tr>
    <td style="text-align: right">18290</td>
    <td style="text-align: right">8.0</td>
    <td style="text-align: right">18290</td>
    <td style="text-align: right">8.0</td>
    <td>water activities</td>
    <td>swimming, crawl, slow (50 yards/minute), moderate or light effort</td>
  </tr>
  <tr>
    <td style="text-align: right">18300</td>
    <td style="text-align: right">6.0</td>
    <td style="text-align: right">18300</td>
    <td style="text-align: right">6.0</td>
    <td>water activities</td>
    <td>swimming, lake, ocean, river (Taylor Codes 280, 295)</td>
  </tr>
  <tr>
    <td style="text-align: right">18310</td>
    <td style="text-align: right">6.0</td>
    <td style="text-align: right">18310</td>
    <td style="text-align: right">6.0</td>
    <td>water activities</td>
    <td>swimming, leisurely, not lap swimming, general</td>
  </tr>
  <tr>
    <td style="text-align: right">18320</td>
    <td style="text-align: right">8.0</td>
    <td style="text-align: right">18320</td>
    <td style="text-align: right">8.0</td>
    <td>water activities</td>
    <td>swimming, sidestroke, general</td>
  </tr>
  <tr>
    <td style="text-align: right">18330</td>
    <td style="text-align: right">8.0</td>
    <td style="text-align: right">18330</td>
    <td style="text-align: right">8.0</td>
    <td>water activities</td>
    <td>swimming, synchronized</td>
  </tr>
  <tr>
    <td style="text-align: right">18340</td>
    <td style="text-align: right">10.0</td>
    <td style="text-align: right">18340</td>
    <td style="text-align: right">10.0</td>
    <td>water activities</td>
    <td>swimming, treading water, fast vigorous effort</td>
  </tr>
  <tr>
    <td style="text-align: right">18350</td>
    <td style="text-align: right">4.0</td>
    <td style="text-align: right">18350</td>
    <td style="text-align: right">4.0</td>
    <td>water activities</td>
    <td>swimming, treading water, moderate effort, general</td>
  </tr>
  <tr>
    <td></td>
    <td></td>
    <td style="text-align: right">18355</td>
    <td style="text-align: right">4.0</td>
    <td>water activities</td>
    <td>water aerobics, water calisthenics</td>
  </tr>
  <tr>
    <td style="text-align: right">18360</td>
    <td style="text-align: right">10.0</td>
    <td style="text-align: right">18360</td>
    <td style="text-align: right">10.0</td>
    <td>water activities</td>
    <td>water polo</td>
  </tr>
  <tr>
    <td style="text-align: right">18365</td>
    <td style="text-align: right">3.0</td>
    <td style="text-align: right">18365</td>
    <td style="text-align: right">3.0</td>
    <td>water activities</td>
    <td>water volleyball</td>
  </tr>
  <tr>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td>Page 10 of 12</td>
  </tr>
</table>
<h2 class="pagenumber">Page 11</h2>
<table class="table table-striped table-bordered">
  <tr>
    <td style="text-align: right">1993</td>
    <td></td>
    <td style="text-align: right">2000</td>
    <td></td>
    <td></td>
    <td></td>
  </tr>
  <tr>
    <td>compcode</td>
    <td>METS</td>
    <td>compcode</td>
    <td>METS</td>
    <td>heading</td>
    <td>description</td>
  </tr>
  <tr>
    <td></td>
    <td></td>
    <td style="text-align: right">18366</td>
    <td style="text-align: right">8.0</td>
    <td>water activities</td>
    <td>water jogging</td>
  </tr>
  <tr>
    <td style="text-align: right">18370</td>
    <td style="text-align: right">5.0</td>
    <td style="text-align: right">18370</td>
    <td style="text-align: right">5.0</td>
    <td>water activities</td>
    <td>whitewater rafting, kayaking, or canoeing</td>
  </tr>
  <tr>
    <td style="text-align: right">19010</td>
    <td style="text-align: right">6.0</td>
    <td style="text-align: right">19010</td>
    <td style="text-align: right">6.0</td>
    <td>winter activities</td>
    <td>moving ice house (set up/drill holes, etc.)</td>
  </tr>
  <tr>
    <td style="text-align: right">19020</td>
    <td style="text-align: right">5.5</td>
    <td style="text-align: right">19020</td>
    <td style="text-align: right">5.5</td>
    <td>winter activities</td>
    <td>skating, ice, 9 mph or less</td>
  </tr>
  <tr>
    <td style="text-align: right">19030</td>
    <td style="text-align: right">7.0</td>
    <td style="text-align: right">19030</td>
    <td style="text-align: right">7.0</td>
    <td>winter activities</td>
    <td>skating, ice, general (Taylor Code 360)</td>
  </tr>
  <tr>
    <td style="text-align: right">19040</td>
    <td style="text-align: right">9.0</td>
    <td style="text-align: right">19040</td>
    <td style="text-align: right">9.0</td>
    <td>winter activities</td>
    <td>skating, ice, rapidly, more than 9 mph</td>
  </tr>
  <tr>
    <td style="text-align: right">19050</td>
    <td style="text-align: right">15.0</td>
    <td style="text-align: right">19050</td>
    <td style="text-align: right">15.0</td>
    <td>winter activities</td>
    <td>skating, speed, competitive</td>
  </tr>
  <tr>
    <td style="text-align: right">19060</td>
    <td style="text-align: right">7.0</td>
    <td style="text-align: right">19060</td>
    <td style="text-align: right">7.0</td>
    <td>winter activities</td>
    <td>ski jumping (climb up carrying skis)</td>
  </tr>
  <tr>
    <td style="text-align: right">19075</td>
    <td style="text-align: right">7.0</td>
    <td style="text-align: right">19075</td>
    <td style="text-align: right">7.0</td>
    <td>winter activities</td>
    <td>skiing, general</td>
  </tr>
  <tr>
    <td style="text-align: right">19080</td>
    <td style="text-align: right">7.0</td>
    <td style="text-align: right">19080</td>
    <td style="text-align: right">7.0</td>
    <td>winter activities</td>
    <td>skiing, cross country, 2.5 mph, slow or light effort, ski walking</td>
  </tr>
  <tr>
    <td style="text-align: right">19090</td>
    <td style="text-align: right">8.0</td>
    <td style="text-align: right">19090</td>
    <td style="text-align: right">8.0</td>
    <td>winter activities</td>
    <td>skiing, cross country, 4.0-4.9 mph, moderate speed and effort, genera</td>
  </tr>
  <tr>
    <td style="text-align: right">19100</td>
    <td style="text-align: right">9.0</td>
    <td style="text-align: right">19100</td>
    <td style="text-align: right">9.0</td>
    <td>winter activities</td>
    <td>skiing, cross country, 5.0-7.9 mph, brisk speed, vigorous effort</td>
  </tr>
  <tr>
    <td style="text-align: right">19110</td>
    <td style="text-align: right">14.0</td>
    <td style="text-align: right">19110</td>
    <td style="text-align: right">14.0</td>
    <td>winter activities</td>
    <td>skiing, cross country, &gt;8.0 mph, racing</td>
  </tr>
  <tr>
    <td style="text-align: right">19130</td>
    <td style="text-align: right">16.5</td>
    <td style="text-align: right">19130</td>
    <td style="text-align: right">16.5</td>
    <td>winter activities</td>
    <td>skiing, cross country, hard snow, uphill, maximum, snow mountaineering</td>
  </tr>
  <tr>
    <td style="text-align: right">19150</td>
    <td style="text-align: right">5.0</td>
    <td style="text-align: right">19150</td>
    <td style="text-align: right">5.0</td>
    <td>winter activities</td>
    <td>skiing, downhill, light effort</td>
  </tr>
  <tr>
    <td style="text-align: right">19160</td>
    <td style="text-align: right">6.0</td>
    <td style="text-align: right">19160</td>
    <td style="text-align: right">6.0</td>
    <td>winter activities</td>
    <td>skiing, downhill, moderate effort, general</td>
  </tr>
  <tr>
    <td style="text-align: right">19170</td>
    <td style="text-align: right">8.0</td>
    <td style="text-align: right">19170</td>
    <td style="text-align: right">8.0</td>
    <td>winter activities</td>
    <td>skiing, downhill, vigorous effort, racing</td>
  </tr>
  <tr>
    <td style="text-align: right">19180</td>
    <td style="text-align: right">7.0</td>
    <td style="text-align: right">19180</td>
    <td style="text-align: right">7.0</td>
    <td>winter activities</td>
    <td>sledding, tobogganing, bobsledding, luge (Taylor Code 370)</td>
  </tr>
  <tr>
    <td style="text-align: right">19190</td>
    <td style="text-align: right">8.0</td>
    <td style="text-align: right">19190</td>
    <td style="text-align: right">8.0</td>
    <td>winter activities</td>
    <td>snow shoeing</td>
  </tr>
  <tr>
    <td style="text-align: right">19200</td>
    <td style="text-align: right">3.5</td>
    <td style="text-align: right">19200</td>
    <td style="text-align: right">3.5</td>
    <td>winter activities</td>
    <td>snowmobiling</td>
  </tr>
  <tr>
    <td></td>
    <td></td>
    <td style="text-align: right">20000</td>
    <td style="text-align: right">1.0</td>
    <td>religious activities</td>
    <td>sitting in church, in service, attending a ceremony, sitting quietly</td>
  </tr>
  <tr>
    <td></td>
    <td></td>
    <td style="text-align: right">20001</td>
    <td style="text-align: right">2.5</td>
    <td>religious activities</td>
    <td>sitting, playing an instrument at church</td>
  </tr>
  <tr>
    <td></td>
    <td></td>
    <td style="text-align: right">20005</td>
    <td style="text-align: right">1.5</td>
    <td>religious activities</td>
    <td>sitting in church, talking or singing, attending a ceremony, sitting, active participation</td>
  </tr>
  <tr>
    <td></td>
    <td></td>
    <td style="text-align: right">20010</td>
    <td style="text-align: right">1.3</td>
    <td>religious activities</td>
    <td>sitting, reading religious materials at home</td>
  </tr>
  <tr>
    <td></td>
    <td></td>
    <td style="text-align: right">20015</td>
    <td style="text-align: right">1.2</td>
    <td>religious activities</td>
    <td>standing in church (quietly), attending a ceremony, standing quietly</td>
  </tr>
  <tr>
    <td></td>
    <td></td>
    <td style="text-align: right">20020</td>
    <td style="text-align: right">2.0</td>
    <td>religious activities</td>
    <td>standing, singing in church, attending a ceremony, standing, active participation</td>
  </tr>
  <tr>
    <td></td>
    <td></td>
    <td style="text-align: right">20025</td>
    <td style="text-align: right">1.0</td>
    <td>religious activities</td>
    <td>kneeling in church/at home (praying)</td>
  </tr>
  <tr>
    <td></td>
    <td></td>
    <td style="text-align: right">20030</td>
    <td style="text-align: right">1.8</td>
    <td>religious activities</td>
    <td>standing, talking in church</td>
  </tr>
  <tr>
    <td></td>
    <td></td>
    <td style="text-align: right">20035</td>
    <td style="text-align: right">2.0</td>
    <td>religious activities</td>
    <td>walking in church</td>
  </tr>
  <tr>
    <td></td>
    <td></td>
    <td style="text-align: right">20036</td>
    <td style="text-align: right">2.0</td>
    <td>religious activities</td>
    <td>walking, less than 2.0 mph - very slow</td>
  </tr>
  <tr>
    <td></td>
    <td></td>
    <td style="text-align: right">20037</td>
    <td style="text-align: right">3.3</td>
    <td>religious activities</td>
    <td>walking, 3.0 mph, moderate speed, not carrying anything</td>
  </tr>
  <tr>
    <td></td>
    <td></td>
    <td style="text-align: right">20038</td>
    <td style="text-align: right">3.8</td>
    <td>religious activities</td>
    <td>walking, 3.5 mph, brisk speed, not carrying anything</td>
  </tr>
  <tr>
    <td></td>
    <td></td>
    <td style="text-align: right">20039</td>
    <td style="text-align: right">2.0</td>
    <td>religious activities</td>
    <td>walk/stand combination for religious purposes, usher</td>
  </tr>
  <tr>
    <td></td>
    <td></td>
    <td style="text-align: right">20040</td>
    <td style="text-align: right">5.0</td>
    <td>religious activities</td>
    <td>praise with dance or run, spiritual dancing in church</td>
  </tr>
  <tr>
    <td></td>
    <td></td>
    <td style="text-align: right">20045</td>
    <td style="text-align: right">2.5</td>
    <td>religious activities</td>
    <td>serving food at church</td>
  </tr>
  <tr>
    <td></td>
    <td></td>
    <td style="text-align: right">20046</td>
    <td style="text-align: right">2.0</td>
    <td>religious activities</td>
    <td>preparing food at church</td>
  </tr>
  <tr>
    <td></td>
    <td></td>
    <td style="text-align: right">20047</td>
    <td style="text-align: right">2.3</td>
    <td>religious activities</td>
    <td>washing dishes/cleaning kitchen at church</td>
  </tr>
  <tr>
    <td></td>
    <td></td>
    <td style="text-align: right">20050</td>
    <td style="text-align: right">1.5</td>
    <td>religious activities</td>
    <td>eating at church</td>
  </tr>
  <tr>
    <td></td>
    <td></td>
    <td style="text-align: right">20055</td>
    <td style="text-align: right">2.0</td>
    <td>religious activities</td>
    <td>eating/talking at church or standing eating, American Indian Feast days</td>
  </tr>
  <tr>
    <td></td>
    <td></td>
    <td style="text-align: right">20060</td>
    <td style="text-align: right">3.0</td>
    <td>religious activities</td>
    <td>cleaning church</td>
  </tr>
  <tr>
    <td></td>
    <td></td>
    <td style="text-align: right">20061</td>
    <td style="text-align: right">5.0</td>
    <td>religious activities</td>
    <td>general yard work at church</td>
  </tr>
  <tr>
    <td></td>
    <td></td>
    <td style="text-align: right">20065</td>
    <td style="text-align: right">2.5</td>
    <td>religious activities</td>
    <td>standing - moderate (lifting 50 lbs., assembling at fast rate)</td>
  </tr>
  <tr>
    <td></td>
    <td></td>
    <td style="text-align: right">20095</td>
    <td style="text-align: right">4.0</td>
    <td>religious activities</td>
    <td>standing - moderate/heavy work</td>
  </tr>
  <tr>
    <td></td>
    <td></td>
    <td style="text-align: right">20100</td>
    <td style="text-align: right">1.5</td>
    <td>religious activities</td>
    <td>typing, electric, manual, or computer</td>
  </tr>
  <tr>
    <td></td>
    <td></td>
    <td style="text-align: right">21000</td>
    <td style="text-align: right">1.5</td>
    <td>volunteer activities</td>
    <td>sitting - meeting, general, and/or with talking involved</td>
  </tr>
  <tr>
    <td></td>
    <td></td>
    <td style="text-align: right">21005</td>
    <td style="text-align: right">1.5</td>
    <td>volunteer activities</td>
    <td>sitting - light office work, in general</td>
  </tr>
  <tr>
    <td></td>
    <td></td>
    <td style="text-align: right">21010</td>
    <td style="text-align: right">2.5</td>
    <td>volunteer activities</td>
    <td>sitting - moderate work</td>
  </tr>
  <tr>
    <td></td>
    <td></td>
    <td style="text-align: right">21015</td>
    <td style="text-align: right">2.3</td>
    <td>volunteer activities</td>
    <td>standing - light work (filing, talking, assembling)</td>
  </tr>
  <tr>
    <td></td>
    <td></td>
    <td style="text-align: right">21016</td>
    <td style="text-align: right">2.5</td>
    <td>volunteer activities</td>
    <td>sitting, child care, only active periods</td>
  </tr>
  <tr>
    <td></td>
    <td></td>
    <td style="text-align: right">21017</td>
    <td style="text-align: right">3.0</td>
    <td>volunteer activities</td>
    <td>standing, child care, only active periods</td>
  </tr>
  <tr>
    <td></td>
    <td></td>
    <td style="text-align: right">21018</td>
    <td style="text-align: right">4.0</td>
    <td>volunteer activities</td>
    <td>walk/run play with children, moderate, only active periods</td>
  </tr>
  <tr>
    <td></td>
    <td></td>
    <td style="text-align: right">21019</td>
    <td style="text-align: right">5.0</td>
    <td>volunteer activities</td>
    <td>walk/run play with children, vigorous, only active periods</td>
  </tr>
  <tr>
    <td></td>
    <td></td>
    <td style="text-align: right">21020</td>
    <td style="text-align: right">3.0</td>
    <td>volunteer activities</td>
    <td>standing - light/moderate work (pack boxes, assemble/repair, set up chairs/furniture)</td>
  </tr>
  <tr>
    <td></td>
    <td></td>
    <td style="text-align: right">21025</td>
    <td style="text-align: right">3.5</td>
    <td>volunteer activities</td>
    <td>standing - moderate (lifting 50 lbs., assembling at fast rate)</td>
  </tr>
  <tr>
    <td></td>
    <td></td>
    <td style="text-align: right">21030</td>
    <td style="text-align: right">4.0</td>
    <td>volunteer activities</td>
    <td>standing - moderate/heavy work</td>
  </tr>
  <tr>
    <td></td>
    <td></td>
    <td style="text-align: right">21035</td>
    <td style="text-align: right">1.5</td>
    <td>volunteer activities</td>
    <td>typing, electric, manual, or computer</td>
  </tr>
  <tr>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td>Page 11 of 12</td>
  </tr>
</table>
<h2 class="pagenumber">Page 12</h2>
<table class="table table-striped table-bordered">
  <tr>
    <td style="text-align: right">1993</td>
    <td></td>
    <td style="text-align: right">2000</td>
    <td></td>
    <td></td>
    <td></td>
  </tr>
  <tr>
    <td>compcode</td>
    <td>METS</td>
    <td>compcode</td>
    <td>METS</td>
    <td>heading</td>
    <td>description</td>
  </tr>
  <tr>
    <td></td>
    <td></td>
    <td style="text-align: right">21040</td>
    <td style="text-align: right">2.0</td>
    <td>volunteer activities</td>
    <td>walking, less than 2.0 mph, very slow</td>
  </tr>
  <tr>
    <td></td>
    <td></td>
    <td style="text-align: right">21045</td>
    <td style="text-align: right">3.3</td>
    <td>volunteer activities</td>
    <td>walking, 3.0 mph, moderate speed, not carrying anything</td>
  </tr>
  <tr>
    <td></td>
    <td></td>
    <td style="text-align: right">21050</td>
    <td style="text-align: right">3.8</td>
    <td>volunteer activities</td>
    <td>walking, 3.5 mph, brisk speed, not carrying anything</td>
  </tr>
  <tr>
    <td></td>
    <td></td>
    <td style="text-align: right">21055</td>
    <td style="text-align: right">3.0</td>
    <td>volunteer activities</td>
    <td>walking, 2.5 mph slowly and carrying objects less than 25 pounds</td>
  </tr>
  <tr>
    <td></td>
    <td></td>
    <td style="text-align: right">21060</td>
    <td style="text-align: right">4.0</td>
    <td>volunteer activities</td>
    <td>walking, 3.0 mph moderately and carrying objects less than 25 pounds, pushing something</td>
  </tr>
  <tr>
    <td></td>
    <td></td>
    <td style="text-align: right">21065</td>
    <td style="text-align: right">4.5</td>
    <td>volunteer activities</td>
    <td>walking, 3.5 mph, briskly and carrying objects less than 25 pounds</td>
  </tr>
  <tr>
    <td></td>
    <td></td>
    <td style="text-align: right">21070</td>
    <td style="text-align: right">3.0</td>
    <td>volunteer activities</td>
    <td>walk/stand combination, for volunteer purposes</td>
  </tr>
  <tr>
    <td colspan="6">Footnote: METS for certain golfing activities were revised downward from 1993 estimates based on
      measurement of the activity using indirect calorimetry.</td>
  </tr>
  <tr>
    <td colspan="6">Page 12 of 12</td>
  </tr>
</table>`

export default async function main() {

  let activityService = new ActivityService
  let $ = cheerio.load(pageHTML)

  const activities: any[] = []

  $('body > table > tbody > tr').each(function (i, t) {
    const met = $('td:nth-child(4)', t).text()
    const activityGroupName = $('td:nth-child(5)', t).text()
    const activityName = $('td:nth-child(6)', t).text()

    if (met && activityGroupName && activityName) {
      activities.push({
        met,
        activityGroupName,
        activityName,
      })
    }
  })

  for (let activityData of activities) {
    let activityGroup = await activityService.addActivityGroup(activityData.activityGroupName, [{ locale: LanguageCode.en, text: activityData.activityGroupName, verified: true }])

    if (!Number.isNaN(Number(activityData.met))) {
      let activity = await activityService.addActivity({
        activityGroupId: mongoose.Types.ObjectId(activityGroup.id),
        activityTypeName: [{ locale: LanguageCode.en, text: activityData.activityName }],
        met: Number(activityData.met)
      })
    }
  }
}