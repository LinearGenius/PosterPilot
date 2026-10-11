import type { PosterBrief } from "@poster-pilot/shared";
import { describe, expect, it } from "vitest";
import { executePosterAgent } from "../src/index";

const fixtures: PosterBrief[] = [
  { productName: "云感防晒衣", campaign: "盛夏防晒季", sellingPoint: "轻薄透气，UPF50+", style: "energetic", ratio: "4:5" },
  { productName: "原野咖啡豆", campaign: "秋日限定", sellingPoint: "坚果香气，低酸顺滑", style: "premium", ratio: "1:1" },
  { productName: "澄净洗面奶", campaign: "敏感肌护理周", sellingPoint: "温和清洁，不拔干", style: "minimal", ratio: "4:5" },
  { productName: "星澜 X1 耳机", campaign: "夏日新品", sellingPoint: "轻盈降噪，全天舒适", style: "premium", ratio: "4:5" },
  { productName: "小岛气泡水", campaign: "周末补给站", sellingPoint: "零糖零脂，清爽果香", style: "energetic", ratio: "16:9" },
  { productName: "暮光香薰蜡烛", campaign: "睡眠关怀月", sellingPoint: "木质香调，舒缓入眠", style: "premium", ratio: "1:1" },
  { productName: "轻羽跑鞋", campaign: "城市开跑", sellingPoint: "回弹缓震，轻至 220g", style: "energetic", ratio: "4:5" },
  { productName: "云朵乳胶枕", campaign: "好眠焕新季", sellingPoint: "分区承托，透气防闷", style: "minimal", ratio: "16:9" },
  { productName: "山岚保温杯", campaign: "冬日暖饮计划", sellingPoint: "长效保温，单手开盖", style: "premium", ratio: "4:5" },
  { productName: "果园燕麦杯", campaign: "早餐能量周", sellingPoint: "高纤饱腹，即冲即食", style: "energetic", ratio: "1:1" },
  { productName: "柔雾粉底液", campaign: "底妆体验日", sellingPoint: "轻薄持妆，自然遮瑕", style: "minimal", ratio: "4:5" },
  { productName: "森语护手霜", campaign: "秋冬润养节", sellingPoint: "快速吸收，不黏双手", style: "minimal", ratio: "1:1" },
  { productName: "极昼机械键盘", campaign: "桌搭升级计划", sellingPoint: "低延迟连接，静音手感", style: "premium", ratio: "16:9" },
  { productName: "飞鸟旅行箱", campaign: "毕业旅行季", sellingPoint: "轻量耐摔，静音万向轮", style: "energetic", ratio: "4:5" },
  { productName: "纯白电动牙刷", campaign: "口腔健康周", sellingPoint: "智能计时，柔护牙龈", style: "minimal", ratio: "1:1" },
  { productName: "深海鱼油胶囊", campaign: "家庭健康月", sellingPoint: "高纯度 Omega-3", style: "premium", ratio: "4:5" },
  { productName: "赤霞葡萄汁", campaign: "节日礼赠季", sellingPoint: "零酒精，原汁风味", style: "premium", ratio: "16:9" },
  { productName: "元气坚果棒", campaign: "下午茶闪购", sellingPoint: "高蛋白，低负担", style: "energetic", ratio: "4:5" },
  { productName: "微风循环扇", campaign: "清凉家电节", sellingPoint: "柔和送风，低噪节能", style: "minimal", ratio: "1:1" },
  { productName: "灵感随身灯", campaign: "夜读好物节", sellingPoint: "无频闪，三档色温", style: "energetic", ratio: "16:9" },
];

describe("deterministic planner fixtures", () => {
  it.each(fixtures)("produces a valid plan for $productName", async (brief) => {
    const result = await executePosterAgent(brief);
    expect(result.status).toBe("succeeded");
    expect(result.plan?.title).toContain(brief.productName);
    expect(result.plan?.layers).toHaveLength(6);
  });
});
