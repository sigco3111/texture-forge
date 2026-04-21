# 🎨 Texture Forge — 절차적 텍스처 제네레이터

> Perlin/Simplex 노이즈로 돌, 나무, 대리석, 물, 구름 등 2D 텍스처를 브라우저에서 실시간 생성

## 📋 프로젝트 개요

절차적 생성(Procedural Generation) 기반의 텍스처 제네레이터입니다. 노이즈 알고리즘 파라미터를 실시간으로 조절하면서 텍스처를 미리보고, 원하는 결과를 PNG로 다운로드할 수 있습니다. 게임 개발자, 3D 아티스트, 디자이너가 브라우저에서 바로 사용할 수 있는 실용적 도구입니다.

## 🛠️ 기술 스택

| 항목 | 기술 |
|------|------|
| 프레임워크 | Next.js 14 (App Router) |
| 언어 | TypeScript |
| 렌더링 | HTML5 Canvas |
| 노이즈 엔진 | 직접 구현 (simplex-noise 라이브러리 또는 순수 구현) |
| 스타일 | Tailwind CSS |
| 배포 | Vercel (무료) |

> **외부 API 없음, 외부 파일 없음, 비용 0**

## 🎯 구현해야 할 텍스처 프리셋

### 자연 (Nature)

| 프리셋 | 설명 | 핵심 기법 |
|--------|------|-----------|
| **大理石 (Marble)** | 흰/회색 대리석 결 | Turbulence + Sin wave distortion |
| **花岗岩 (Granite)** | 알갱이가 보이는 화강암 | Voronoi 노이즈 + 색상 맵핑 |
| **木头 (Wood)** | 나무 결纹理 | Cylindrical noise (x축 왜곡) |
| **砂岩 (Sandstone)** | 층리가 보이는 사암 | Layered noise (여러 주파수 오프셋) |

### 지형 (Terrain)

| 프리셋 | 설명 | 핵심 기법 |
|--------|------|-----------|
| **地形高度图 (Heightmap)** | 지형 고도맵 | Fractal Brownian Motion (fBm) |
| **洞穴 (Cave)** | 동굴 벽면 질감 | Worley noise + 이중 임계값 |
| **熔岩 (Lava)** | 용암 표면 | Turbulence + 색상 그라디언트 (빨→주→검) |

### 재료 (Material)

| 프리셋 | 설명 | 핵심 기법 |
|--------|------|-----------|
| **金属 (Metal)** | 금속 표면 | Scratches + specular highlight 노이즈 |
| **铁锈 (Rust)** | 녹슨 금속 | Voronoi + 주황/갈색 팔레트 |
| **织物 (Fabric)** | 직물 결 | Directional noise + 반복 패턴 |
| **皮革 (Leather)** | 가죽 결 | Small-scale noise + 균열 |

### 기상 (Weather)

| 프리셋 | 설명 | 핵심 기법 |
|--------|------|-----------|
| **구름 (Clouds)** | 구름 질감 | fBm + 흰색 밴드 (임계값 이하 투명) |
| **烟雾 (Smoke)** | 연기 질감 | fBm + 회색 그라디언트 + fade |
| **불 (Fire)** | 화염 질감 | Warped fBm + 빨→주→노→검 색상 맵 |

### 기하학 (Geometric)

| 프리셋 | 설명 | 핵심 기법 |
|--------|------|-----------|
| **체크무늬 (Checkerboard)** | 바둑판 | Modular coordinate |
| **벽돌 (Brick)** | 벽돌 벽 | Procedural brick pattern + 노이즈 노후화 |
| **타일 (Tile)** | 세라믹 타일 | Grid + 균열 노이즈 |
| **카펫 (Carpet)** | 융단 결 | Directional noise + 색상 변형 |

## 🔧 공통 파라미터 (모든 텍스처 공유)

| 파라미터 | 설명 | 범위 | 기본값 |
|----------|------|------|--------|
| **Scale** | 노이즈 스케일 (줌) | 1 ~ 200 | 50 |
| **Octaves** | fBm 옥타브 수 (디테일) | 1 ~ 8 | 4 |
| **Persistence** | 옥타브별 진폭 감소율 | 0.1 ~ 0.9 | 0.5 |
| **Lacunarity** | 옥타브별 주파수 증가율 | 1.0 ~ 4.0 | 2.0 |
| **Seed** | 난수 시드 | 0 ~ 9999 | 랜덤 |
| **Resolution** | 출력 해상도 | 128 / 256 / 512 / 1024 | 256 |
| **Tiling** | 타일링 반복 여부 | on / off | off |

## 🏗️ 구조 설계

### 노이즈 엔진 (`src/lib/noise/`)

```
noise/
├── perlin.ts        # Perlin 노이즈 구현
├── simplex.ts       # Simplex 노이즈 구현
├── worley.ts        # Worley (Voronoi) 노이즈 구현
├── fbm.ts           # Fractal Brownian Motion
├── turbulence.ts    # Turbulence (절대값 fBm)
├── domain-warp.ts   # Domain warping
└── index.ts         # 통합 익스포트
```

### 텍스처 제네레이터 (`src/lib/textures/`)

```
textures/
├── base.ts          # 베이스 클래스 (ITextureGenerator 인터페이스)
├── marble.ts        # 대리석
├── wood.ts          # 나무 결
├── granite.ts       # 화강암
├── sandstone.ts     # 사암
├── heightmap.ts     # 지형 고도맵
├── cave.ts          # 동굴
├── lava.ts          # 용암
├── metal.ts         # 금속
├── rust.ts          # 녹
├── fabric.ts        # 직물
├── leather.ts       # 가죽
├── cloud.ts         # 구름
├── smoke.ts         # 연기
├── fire.ts          # 불
├── checkerboard.ts  # 체크무늬
├── brick.ts         # 벽돌
├── tile.ts          # 타일
└── carpet.ts        # 융단
```

### 각 텍스처는 다음 인터페이스 구현:

```typescript
interface TextureGenerator {
  name: string;
  category: 'nature' | 'terrain' | 'material' | 'weather' | 'geometric';
  description: string;
  
  // 고유 파라미터 (프리셋별 다름)
  params: TextureParam[];
  
  // 픽셀 생성
  generate(x: number, y: number, width: number, height: number, params: Record<string, number>): [number, number, number, number]; // RGBA
  
  // 썸네일 (카탈로그 미리보기용, 64x64)
  generateThumbnail(): ImageData;
}
```

### 컴포넌트 (`src/components/`)

```
components/
├── TextureCanvas.tsx       # 메인 텍스처 렌더링 캔버스
├── PresetGallery.tsx       # 프리셋 카탈로그 (썸네일 그리드)
├── ParamPanel.tsx          # 파라미터 슬라이더 패널
├── ColorRampEditor.tsx     # 색상 그라디언트 편집기 (선택)
├── ExportPanel.tsx         # 해상도 선택 + 다운로드 버튼
└── Header.tsx              # 상단 네비게이션
```

## 🎨 UI 레이아웃

```
┌─────────────────────────────────────────────┐
│  🎨 Texture Forge                          │
├──────────┬──────────────────┬───────────────┤
│          │                  │               │
│ 프리셋   │   메인 캔버스     │  파라미터     │
│ 갤러리   │   (256x256)      │  슬라이더     │
│          │                  │               │
│ ┌──────┐ │                  │  Scale ═══○   │
│ │대리석 │ │                  │  Octaves ══○  │
│ └──────┘ │                  │  Seed ═════○  │
│ ┌──────┐ │                  │  ...          │
│ │ 나무  │ │                  │               │
│ └──────┘ │                  │  [다운로드]   │
│ ┌──────┐ │                  │  [복사]       │
│ │구름   │ │                  │               │
│ └──────┘ │                  │               │
│   ...    │                  │               │
├──────────┴──────────────────┴───────────────┤
│  해상도: 128 | 256 | 512 | 1024   [Export]  │
└─────────────────────────────────────────────┘
```

## ⚡ 성능 요구사항

- **실시간 미리보기**: 파라미터 변경 시 100ms 이내 렌더링
- **썸네일**: 프리셋 카탈로그 64×64 썸네일 초기 로드 시 생성
- **고해상도**: 1024×1024도 Web Worker에서 생성 (UI 블로킹 방지)
- **렌더링**: `ImageData` + `putImageData` 직접 조작

## 🎨 디자인 가이드

- **배경**: 어두운 테마 (`#111111`)
- **사이드바**: 좌측 프리셋 갤러리 (스크롤 가능)
- **패널**: 우측 파라미터 (슬라이더 + 수치 입력)
- **캔버스**: 중앙, 체커보드 배경 (투명 영역 표시)
- **폰트**: 시스템 폰트
- **애니메이션**: 프리셋 선택 시 페이드 전환

## 📁 프로젝트 초기화

```bash
npx create-next-app@latest . --typescript --tailwind --app --src-dir --no-eslint
npm install
npm run dev
```

## ✅ MVP 체크리스트 (Phase 1 완성 기준)

- [ ] Simplex/Perlin 노이즈 엔진 구현
- [ ] fBm (Fractal Brownian Motion) 구현
- [ ] 기본 파라미터 UI (Scale, Octaves, Persistence, Seed)
- [ ] 프리셋 5개 구현: Marble, Wood, Cloud, Brick, Checkerboard
- [ ] 실시간 미리보기 (파라미터 변경 즉시 반영)
- [ ] PNG 다운로드 (256×256, 512×512, 1024×1024)
- [ ] 프리셋 갤러리 (썸네일 그리드)
- [ ] 반응형 레이아웃

## 🚀 배포

```bash
npm run build
vercel --prod
```

## 📄 라이선스

MIT
