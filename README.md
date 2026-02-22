# Poker Range

这是一个使用 Vue 和 Electron 构建的桌面应用程序，用于管理和显示扑克范围。

## 主要功能

### 核心功能
- 使用 Vue 3 构建前端界面
- 使用 Electron 构建桌面应用程序
- 通过 Electron 的 IPC 通信机制与文件系统交互，加载和读取扑克范围文件
- 可视化的手牌范围选择表格
- 支持多表格拖拽和复制
- 可缩放的表格视图

### 范围统计面板 (新增)
- 显示选中手牌总数和范围占比
- 计算平均权重
- 统计口袋对、同花、杂色数量
- 条形图展示手牌类型分布
- 实时响应表格数据变化

### JSON 导入/导出 (新增)
- 一键导出范围数据为 JSON 文件
- 支持从 JSON 文件导入恢复范围
- 操作状态反馈提示
- 包含版本和时间戳的导出格式

### 暗色主题优化 (新增)
- 高对比度的暗色主题设计
- 优化的边框和悬停效果
- 更好的视觉层次和可读性

## 安装和运行

### 安装依赖

```sh
npm install
# 或者使用 yarn
yarn install
```

### 开发模式

```sh
npm run electron:dev
# 或者使用 yarn
yarn electron:dev
```

### 构建

```sh
npm run build
npm run electron:build
# 或者使用 yarn
yarn build
yarn electron:build
```

## 变更记录

### v1.1.0 (2026-02-22)

#### 新增功能
- **范围统计面板** (`src/components/RangeStats.vue`)
  - 显示总手牌数、范围占比、平均权重
  - 口袋对/同花/杂色数量统计
  - 条形图展示手牌类型分布百分比

- **JSON 导入/导出** (`src/components/RangeIO.vue`)
  - 导出范围数据为 JSON 文件（包含版本和时间戳）
  - 从 JSON 文件导入恢复范围数据
  - 操作成功/失败状态反馈

- **右侧边栏面板** (`src/App.vue`)
  - 集成 RangeStats 和 RangeIO 组件
  - 256px 宽度的固定侧边栏
  - 支持多表格切换时自动更新统计数据

#### 主题优化
- **暗色主题对比度增强** (`tailwind.config.js`)
  - 背景色加深: `#1C1C1E` → `#0F0F10`
  - 边框对比度提升: `0.2` → `0.35`
  - 悬停效果增强: `0.1` → `0.15`

#### 技术细节
- 新增 2 个 Vue 组件
- 修改 2 个核心文件
- 共添加约 300 行代码

### v1.0.0 (初始版本)
- 基础的 Vue 3 + Electron 项目结构
- 手牌范围选择表格
- 预设范围加载功能
- 多表格拖拽和复制
- 可缩放视图

## 项目结构

```
Poker-Range/
├── src/
│   ├── components/
│   │   ├── RangeTable.vue      # 手牌范围表格
│   │   ├── RangeStats.vue      # 范围统计面板 (新增)
│   │   ├── RangeIO.vue         # JSON 导入/导出 (新增)
│   │   ├── MenuPanel.vue       # 菜单栏
│   │   ├── ControlPanel.vue    # 控制面板
│   │   └── ...
│   ├── electron/
│   │   ├── main.js             # Electron 主进程
│   │   └── preload.js          # 预加载脚本
│   ├── demoRange/              # 预设范围文件
│   ├── App.vue                 # 主应用组件
│   └── main.js                 # Vue 入口文件
├── tailwind.config.js          # Tailwind CSS 配置
├── vite.config.mjs             # Vite 配置
└── package.json
```

## 技术栈

- **前端框架**: Vue 3 (Composition API)
- **桌面框架**: Electron 19
- **构建工具**: Vite 5
- **样式框架**: Tailwind CSS 3
- **包管理器**: npm / yarn

## License

MIT
