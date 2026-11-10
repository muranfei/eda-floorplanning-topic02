# Fixed-Outline Constraints — Bilingual Learning Video

## Production specification

- Format: 16:9, 1920 × 1080, 30 fps
- Narration: English
- On-screen subtitles: English and Simplified Chinese
- Visual style: warm ivory board, saturated flat-colour modules, bold type, fast pop-ins, playful transitions
- Mascot: **ChipBot**, an original-named friendly robot guide who asks questions, points to failures, and celebrates correct answers
- Source: [EDA Algorithms Platform — Floorplanning, Topic 02](https://yongfu-li.github.io/eda-learning/courses/learn_floorplanning/index.html)

## Voiceover and storyboard

### 01. Carry-on hook

**English narration**

Ever tried to zip a carry-on after buying too many souvenirs? You can rearrange, squeeze, or sit on it. But the suitcase refuses to grow. Floorplanning starts with the same kind of problem.

**Chinese subtitles**

买纪念品买多了以后，你有没有试过硬塞登机箱？你可以重新摆、用力压，甚至坐上去，但箱子不会变大。芯片布局规划，本质上就是同一类问题。

**Visual**

A large suitcase bounces in. ChipBot points at it and asks, “Will it close?” The suitcase gets a red **FIXED BAG** tag.

### 02. Life to chip

**English narration**

Shrink the suitcase onto a chip. The fixed chip outline is the bag. The circuit modules are the items. After clustering and partitioning, floorplanning decides where each module physically goes. Same packing rules. Much less space.

**Chinese subtitles**

把登机箱缩小到芯片上：固定轮廓就是箱子，电路模块就是行李。完成聚类和划分以后，布局规划要决定每个模块具体放在哪里。规则一样，空间更小。

**Visual**

A briefcase icon slides into a 10 × 8 outline. Three labels appear: **OUTLINE = BAG**, **MODULES = ITEMS**, **PACK = FLOORPLAN**.

### 03. The two checks

**English narration**

On a chip, a legal floorplan must pass two checks. Every module stays inside the outline. And no pair of modules may have a positive-area interior overlap. Both checks must pass. One failure is enough to reject the layout.

**Chinese subtitles**

在芯片里，合法布局必须通过两项检查：所有模块都在轮廓内，并且任意两个模块都不能有正面积的内部重叠。两项都必须通过，任何一项失败，整体就不合法。

**Visual**

Two rule cards snap in. A red boundary and a red overlap patch demonstrate the failures. Both cards then switch to green checks.

### 04. The teaching instance

**English narration**

Our teaching instance is ten units wide by eight units tall. Five modules must fit. A is three by two. B is two by three. C and E are two by two. D is three by one. Coordinates start at the lower-left corner.

**Chinese subtitles**

本课实例的轮廓宽10、高8，需要放进5个模块。A为3×2，B为2×3，C和E为2×2，D为3×1。坐标从左下角开始。

**Visual**

The five modules pop in around the board with their dimensions. The origin marker flashes.

### 05. Overflow

**English narration**

Start with a bad packing. E starts at x equals nine, and it is two units wide. That puts its right edge at eleven. The outline ends at ten. The suitcase does not stretch, so E is outside. Legality fails immediately.

**Chinese subtitles**

先看一个错误布局。E从x=9开始，宽为2，所以右边界到11，而轮廓只到10。箱子不会拉伸，E跑到了外面，合法性立即失败。

**Visual**

E slides past the right border. The overflowing part flashes red while the equation **9 + 2 = 11** builds on screen.

### 06. Interactive check 1

**English narration**

Quick check. Where does E end? Is its right edge ten, eleven, or does it still fit? Three. Two. One. Make your choice.

**Chinese subtitles**

快速检查：E的右边界到哪里？是10、11，还是仍然能放进去？三、二、一，请作答。

**Visual**

Three large buttons appear: **A — edge 10**, **B — edge 11**, **C — it fits**. ChipBot thinks while a 3–2–1 countdown pulses.

### 07. Answer 1

**English narration**

The right edge is eleven, not ten. E hangs one unit outside the outline. Answer B: containment failure. The rest of the layout does not matter yet.

**Chinese subtitles**

右边界是11，不是10。E有一格悬在轮廓外。答案是B：包含性失败。此时其他布局因素都还不重要。

**Visual**

The equation **9 + 2 = 11 > 10** lands with a red impact. ChipBot’s speech bubble says, “Too wide!”

### 08. Interior overlap

**English narration**

Now place a coffee cup on top of a laptop. Two objects occupy the same footprint. On a chip, that is illegal. Here, E sits on C. The checker reports C overlaps E because their interiors share positive area.

**Chinese subtitles**

现在把咖啡杯放在笔记本电脑上，两件物品占用了同一块位置。在芯片里，这是非法的。这里E压在C上面，检查器报告C与E内部重叠。

**Visual**

A coffee cup lands over a laptop. The same gesture repeats on the chip: E drops onto C, and the shared interior flashes red.

### 09. Edge contact

**English narration**

Think of two books side by side. They can touch at their covers with no shared page area. In floorplanning, C and E may share an edge. The contact has zero area, so it is legal. Stacking one block on the other is not.

**Chinese subtitles**

想象两本书并排摆放：书皮可以接触，但不会共享页面面积。布局中，C和E也可以共享一条边。这种接触面积为零，所以合法；把一个块压在另一个块上则不行。

**Visual**

Books stand side by side. The contact line glows green while the overlap patch shrinks to zero.

### 10. Interactive check 2

**English narration**

Which packing passes? A: E escapes the outline. B: E sits on C. C: C and E sit side by side. Three. Two. One.

**Chinese subtitles**

哪一种布局合法？A：E跑出轮廓；B：E压在C上；C：C和E并排接触。三、二、一。

**Visual**

Three miniature boards appear side by side. Each choice gets a distinct colour and label. ChipBot asks, “Which one?”

### 11. Answer 2

**English narration**

The answer is C. Edge contact has zero area, so it passes. A fails containment, and B fails overlap. The suitcase can close only when every block is inside and no interiors are shared.

**Chinese subtitles**

答案是C。边缘接触面积为零，所以通过。A违反包含性，B违反不重叠规则。只有所有模块都在箱内且内部不重叠，箱子才能真正合上。

**Visual**

C receives a large green check. A and B are crossed out with restrained red marks. ChipBot answers, “C!”

### 12. Golden packing

**English narration**

Here is the golden packing. A sits at the origin. D stacks above A. B, C, and E march along the bottom. Every module is inside ten by eight, and no interiors overlap. The suitcase closes, and legality flips to true.

**Chinese subtitles**

这是标准合法布局。A位于原点，D在A上方，B、C、E沿底部排列。所有模块都在10×8轮廓内，内部互不重叠。箱子合上了，合法性变为true。

**Visual**

Blocks snap into place with a short overshoot. Sparkles appear, ChipBot celebrates: “Packed!”

### 13. Legality before metrics

**English narration**

Imagine weighing a carry-on while it is still open. The scale gives you a number, but the bag is not packed. Chip metrics work the same way. You can compute density or deadspace from an illegal layout, but the score means nothing. Check legality first.

**Chinese subtitles**

想象给一个还开着、东西外溢的登机箱称重。你确实能得到数字，但箱子并没有装好。芯片指标也是这样：非法布局也能算出密度或空白率，但结果没有意义。先检查合法性。

**Visual**

A scale appears beside the density formula. The formula flashes red behind **INVALID**, then settles behind a green legality gate.

### 14. The checker

**English narration**

ChipBot runs two simple loops. Loop one checks containment for every module. Loop two checks every pair for positive-area interior overlap. The order does not matter. One failed check is enough to reject the pack.

**Chinese subtitles**

ChipBot执行两个简单循环：第一，检查每个模块是否都在轮廓内；第二，检查每一对模块是否有正面积内部重叠。顺序无关，只要一项失败，布局就被拒绝。

**Visual**

Animated pseudocode appears in a dark code card. A red teaching dot travels from the containment loop to the overlap loop.

### 15. Three traps

**English narration**

ChipBot sees three traps. An off-by-one edge can make a legal boundary look illegal. A centre coordinate is not a lower-left rectangle. And touching is not overlapping. Check the geometry, not the picture.

**Chinese subtitles**

ChipBot总结了三个常见陷阱：边界差一会把合法情况判错；中心坐标不等同于左下角定义；边缘接触也不等于重叠。要检查几何关系，而不是只看画面。

**Visual**

Three problem cards pop in. ChipBot’s antenna flashes after each card.

### 16. Interactive check 3

**English narration**

One more quick check. C starts at x equals five and is two units wide, so its right edge is seven. E starts at seven. Do they overlap by two, overlap by one, or only touch? Three. Two. One.

**Chinese subtitles**

最后一次快速检查：C从x=5开始，宽为2，所以右边界是7；E正好从7开始。它们重叠2、重叠1，还是只接触？三、二、一。

**Visual**

C and E sit on the board. Three answer buttons appear. A magnifying glass scans their shared boundary.

### 17. Answer 3

**English narration**

They only touch. C ends where E begins, so the contact has zero area. The answer is C, and the packing is legal. If E began at six, the blocks would overlap by one unit, and the checker would reject it.

**Chinese subtitles**

它们只是接触。C结束的位置正好是E开始的位置，接触面积为零。答案是C，布局合法。如果E从6开始，两个模块就会重叠1格，检查器会拒绝它。

**Visual**

The equation **5 + 2 = 7 = E.x** appears. The boundary turns green, and ChipBot celebrates with a party-popper icon.

### 18. Recap

**English narration**

That is fixed-outline legality. Two rules. One gate. Keep every module inside, and never let two interiors share space. Fix legality before optimising anything. Next, we will use the same packed suitcase to measure area, density, and deadspace. See you there.

**Chinese subtitles**

这就是固定轮廓合法性：两条规则，一道门槛。所有模块必须在轮廓内，任意两个内部区域都不能共享空间。先保证合法，再优化其他指标。下一课，我们会用同一个“装箱”实例计算面积、密度和空白率，下次见。

**Visual**

The final board returns to the two rules. ChipBot waves and says, “Level clear!”

## Asset notes

- ChipBot and the life-example icons use Twemoji artwork under CC BY 4.0.
- All circuit geometry and numeric examples come from the public Topic 02 material.
- The video uses an English neural voice as a preview. A human English narrator can replace the audio without changing the visuals.
