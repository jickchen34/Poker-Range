<template>
  <div class="range-stats-panel bg-[#2C2C2E] rounded-lg p-4 border border-mac-border">
    <h3 class="text-white font-bold mb-4 text-lg">范围统计</h3>
    
    <div class="grid grid-cols-2 gap-4">
      <!-- 总手牌数 -->
      <div class="stat-item">
        <div class="text-white/70 text-sm">总手牌数</div>
        <div class="text-2xl font-bold text-white">{{ stats.totalHands }}</div>
      </div>
      
      <!-- 占比 -->
      <div class="stat-item">
        <div class="text-white/70 text-sm">范围占比</div>
        <div class="text-2xl font-bold text-white">{{ stats.rangePercentage }}%</div>
      </div>
      
      <!-- 平均权重 -->
      <div class="stat-item">
        <div class="text-white/70 text-sm">平均权重</div>
        <div class="text-2xl font-bold text-white">{{ stats.avgWeight }}%</div>
      </div>
      
      <!-- 口袋对数量 -->
      <div class="stat-item">
        <div class="text-white/70 text-sm">口袋对</div>
        <div class="text-2xl font-bold text-yellow-400">{{ stats.pocketPairs }}</div>
      </div>
    </div>
    
    <!-- 分布饼图（简化版条形图） -->
    <div class="mt-4">
      <div class="text-white/70 text-sm mb-2">手牌类型分布</div>
      <div class="space-y-2">
        <div class="flex items-center gap-2">
          <div class="w-3 h-3 bg-yellow-400 rounded"></div>
          <span class="text-white text-sm flex-1">口袋对</span>
          <div class="w-24 h-2 bg-[#1E1E1E] rounded overflow-hidden">
            <div 
              class="h-full bg-yellow-400 transition-all duration-300"
              :style="{ width: stats.pocketPairPercent + '%' }"
            ></div>
          </div>
          <span class="text-white/70 text-sm w-10 text-right">{{ stats.pocketPairPercent }}%</span>
        </div>
        
        <div class="flex items-center gap-2">
          <div class="w-3 h-3 bg-green-400 rounded"></div>
          <span class="text-white text-sm flex-1">同花</span>
          <div class="w-24 h-2 bg-[#1E1E1E] rounded overflow-hidden">
            <div 
              class="h-full bg-green-400 transition-all duration-300"
              :style="{ width: stats.suitedPercent + '%' }"
            ></div>
          </div>
          <span class="text-white/70 text-sm w-10 text-right">{{ stats.suitedPercent }}%</span>
        </div>
        
        <div class="flex items-center gap-2">
          <div class="w-3 h-3 bg-blue-400 rounded"></div>
          <span class="text-white text-sm flex-1">杂色</span>
          <div class="w-24 h-2 bg-[#1E1E1E] rounded overflow-hidden">
            <div 
              class="h-full bg-blue-400 transition-all duration-300"
              :style="{ width: stats.offsuitPercent + '%' }"
            ></div>
          </div>
          <span class="text-white/70 text-sm w-10 text-right">{{ stats.offsuitPercent }}%</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  selectedCells: {
    type: Object,
    default: () => ({}),
  },
});

const cards = ["A", "K", "Q", "J", "T", "9", "8", "7", "6", "5", "4", "3", "2"];
const TOTAL_COMBOS = 1326; // 德州扑克总组合数

const stats = computed(() => {
  let totalHands = 0;
  let totalWeight = 0;
  let pocketPairs = 0;
  let suited = 0;
  let offsuit = 0;

  Object.entries(props.selectedCells).forEach(([key, cellData]) => {
    if (!cellData?.selected) return;

    const [rowIndex, colIndex] = key.split("-").map(Number);
    const weight = cellData.percentage || 100;

    totalHands++;
    totalWeight += weight;

    if (rowIndex === colIndex) {
      pocketPairs++;
    } else if (rowIndex < colIndex) {
      suited++;
    } else {
      offsuit++;
    }
  });

  const avgWeight = totalHands > 0 ? Math.round(totalWeight / totalHands) : 0;
  const rangePercentage = totalHands > 0 
    ? Math.round((totalHands / 169) * 100) // 13x13=169 种手牌类型
    : 0;

  const pocketPairPercent = totalHands > 0 ? Math.round((pocketPairs / totalHands) * 100) : 0;
  const suitedPercent = totalHands > 0 ? Math.round((suited / totalHands) * 100) : 0;
  const offsuitPercent = totalHands > 0 ? Math.round((offsuit / totalHands) * 100) : 0;

  return {
    totalHands,
    rangePercentage,
    avgWeight,
    pocketPairs,
    suited,
    offsuit,
    pocketPairPercent,
    suitedPercent,
    offsuitPercent,
  };
});
</script>

<style scoped>
.stat-item {
  @apply bg-[#1E1E1E] rounded-lg p-3;
}
</style>
