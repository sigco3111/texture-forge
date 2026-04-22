# 🎨 텍스처 포지 — 절차적 텍스처 생성기

> Perlin/Simplex/Worley 노이즈로 18종 2D 텍스처를 브라우저에서 실시간 생성

## 📋 프로젝트 개요

절차적 생성(Procedural Generation) 기반의 텍스처 생성기입니다. 노이즈 알고리즘 파라미터를 실시간으로 조절하면서 텍스처를 미리보고, 원하는 결과를 PNG로 다운로드할 수 있습니다. 게임 개발자, 3D 아티스트, 디자이너가 브라우저에서 바로 사용할 수 있는 실용적 도구입니다.

**외부 API 없음, 외부 파일 없음, 비용 0**

## 🛠️ 기술 스택

| 항목 | 기술 |
|------|------|
| 프레임워크 | Next.js 16 (App Router, Turbopack) |
| 언어 | TypeScript |
| 렌더링 | HTML5 Canvas (ImageData + putImageData) |
| 노이즈 엔진 | simplex-noise 4.0 + 직접 구현 (Perlin, Worley, fBm, Turbulence, Domain Warp) |
| 스타일 | Tailwind CSS v4 |
| 테스트 | Vitest |
| PRNG | alea (시드 기반 결정적 난수) |

## 🎯 텍스처 프리셋 (18종)

### 🌿 자연 (Nature)

| 프리셋 | 설명 | 핵심 기법 |
|--------|------|-----------|
| **대리석** | 흰/회색 대리석 결 | Turbulence + Sin wave distortion |
| **나무** | 원통형 나무 결 링 | Cylindrical noise + 결 왜곡 |
| **화강암** | 세립 화강암 결 | Worley 노이즈 + 색상 변화 |
| **사암** | 수평 띠 층상 사암 | Layered fBm + 층 대비 |

### 🏔️ 지형 (Terrain)

| 프리셋 | 설명 | 핵심 기법 |
|--------|------|-----------|
| **높이맵** | 고도 기반 색상의 지형 | fBm + 해수면/산 높이 임계값 |
| **동굴** | 거친 벽면의 동굴 내부 | Worley + 이중 임계값 |
| **용암** | 열 왜곡이 있는 용암 | Domain warp + 열 그라디언트 |

### 🔩 재질 (Material)

| 프리셋 | 설명 | 핵심 기법 |
|--------|------|-----------|
| **금속** | 브러시 처리 금속 | 방향성 fBm + 반사 하이라이트 |
| **녹** | 반점 모양 부식 금속 | Worley F1 임계값 분할 |
| **직물** | 직교 실 직조 패턴 | 방향별 fBm 위브 패턴 |
| **가죽** | 자연 가죽 결 | Worley 셀 + fBm 미세 결 + 균열 |

### ☁️ 날씨 (Weather)

| 프리셋 | 설명 | 핵심 기법 |
|--------|------|-----------|
| **구름** | 투명도 있는 절차적 구름 | fBm + 임계값 기반 투명도 |
| **연기** | 방사형 페이드 소산 연기 | fBm + 중심 거리 감쇠 |
| **불** | 수직 그라디언트 화염 | Domain warp + 수직 온도 그라디언트 |

### 📐 기하학 (Geometric)

| 프리셋 | 설명 | 핵심 기법 |
|--------|------|-----------|
| **체스판** | 밝은/어두운 교차 사각형 | Modular coordinate |
| **벽돌** | 모르타르가 있는 벽돌 벽 | Procedural brick pattern + 노이즈 |
| **타일** | 줄눈과 노화 균열 타일 | Grid + Worley 균열 + Domain warp |
| **카펫** | 방향성 파일 카펫 | fBm + 방향성 밀도 + 색상 변화 |

## 🔧 공통 파라미터

모든 텍스처가 공유하는 기본 파라미터:

| 파라미터 | 설명 | 범위 | 기본값 |
|----------|------|------|--------|
| **크기** | 노이즈 스케일 (줌) | 1 ~ 200 | 50 |
| **옥타브** | fBm 옥타브 수 (디테일) | 1 ~ 8 | 4 |
| **지속성** | 옥타브별 진폭 감소율 | 0.1 ~ 0.9 | 0.5 |
| **래큐나리티** | 옥타브별 주파수 증가율 | 1.0 ~ 4.0 | 2.0 |
| **시드** | 난수 시드 | 0 ~ 9999 | 랜덤 |

각 프리셋은 추가 고유 파라미터를 가집니다.

## 🏗️ 프로젝트 구조

```
src/
├── app/
│   ├── globals.css          # 다크 테마, 체커보드 배경
│   ├── layout.tsx           # 루트 레이아웃 (Geist 폰트)
│   └── page.tsx             # 메인 페이지 (3컬럼 레이아웃)
├── components/
│   ├── Header.tsx           # 상단 헤더
│   ├── TextureCanvas.tsx    # 텍스처 렌더링 캔버스 (256×256)
│   ├── ParamPanel.tsx       # 파라미터 슬라이더 (100ms 디바운스)
│   ├── PresetGallery.tsx    # 프리셋 갤러리 (IntersectionObserver 썸네일)
│   └── ExportPanel.tsx      # 해상도 선택 + PNG 다운로드
├── lib/
│   ├── noise/
│   │   ├── simplex.ts       # Simplex 노이즈 (simplex-noise + alea)
│   │   ├── perlin.ts        # Perlin 노이즈
│   │   ├── worley.ts        # Worley/Voronoi (F1/F2)
│   │   ├── fbm.ts           # Fractal Brownian Motion
│   │   ├── turbulence.ts    # Turbulence (절대값 fBm)
│   │   ├── domain-warp.ts   # Domain Warping
│   │   └── index.ts
│   ├── textures/
│   │   ├── base.ts          # TextureGenerator 인터페이스 + 유틸리티
│   │   ├── registry.ts      # 18개 프리셋 레지스트리
│   │   ├── marble.ts        # 대리석
│   │   ├── wood.ts          # 나무
│   │   ├── granite.ts       # 화강암
│   │   ├── sandstone.ts     # 사암
│   │   ├── heightmap.ts     # 높이맵
│   │   ├── cave.ts          # 동굴
│   │   ├── lava.ts          # 용암
│   │   ├── metal.ts         # 금속
│   │   ├── rust.ts          # 녹
│   │   ├── fabric.ts        # 직물
│   │   ├── leather.ts       # 가죽
│   │   ├── cloud.ts         # 구름
│   │   ├── smoke.ts         # 연기
│   │   ├── fire.ts          # 불
│   │   ├── checkerboard.ts  # 체스판
│   │   ├── brick.ts         # 벽돌
│   │   ├── tile.ts          # 타일
│   │   └── carpet.ts        # 카펫
│   ├── colors.ts            # 색상 램프 (15종 프리셋)
│   └── worker/
│       ├── texture.worker.ts # Web Worker (고해상도 익스포트)
│       └── worker-manager.ts
├── hooks/
│   └── useTextureGenerator.ts
└── types/
    ├── texture.ts           # 핵심 타입 + 카테고리 정의
    ├── noise.ts             # 노이즈 함수 타입
    └── worker.ts            # Worker 메시지 타입
```

## 🎨 UI 레이아웃

```
┌──────────────────────────────────────────────────┐
│  🎨 텍스처 포지  │  절차적 텍스처 생성기          │
├──────────┬──────────────────┬─────────────────────┤
│  프리셋   │                  │  파라미터            │
│  갤러리   │   메인 캔버스     │  ─────────          │
│          │   (256×256)      │  크기    ══════○ 50  │
│ 🌿 자연   │                  │  옥타브  ══════○ 4   │
│ ┌──┬──┐  │                  │  지속성  ══════○ 0.5 │
│ │대│나│  │   [텍스처 이미지]  │  주파수  ══════○ 5   │
│ │리│무│  │                  │  왜곡    ══════○ 3   │
│ └──┴──┘  │                  │                     │
│ 🏔 지형   │                  │  내보내기            │
│ ┌──┬──┐  │                  │  ─────────          │
│ │높│동│  │                  │  해상도              │
│ │이│굴│  │                  │  [128][256][512][1K] │
│ └──┴──┘  │                  │  [⬇ PNG 다운로드]    │
│   ...    │                  │                     │
└──────────┴──────────────────┴─────────────────────┘
```

반응형 지원: 데스크톱(3컬럼) / 태블릿(상단 갤러리 스트립) / 모바일(싱글 컬럼)

## ⚡ 성능

- **실시간 미리보기**: 파라미터 변경 시 동기 렌더링 (256×256)
- **썸네일**: IntersectionObserver 기반 지연 생성 (64×64)
- **고해상도 익스포트**: 128/256/512/1024 해상도 PNG 다운로드
- **렌더링**: `ImageData` + `putImageData` 직접 조작

## 🚀 실행

```bash
cd texture-forge
npm install
npm run dev
```

## 🧪 테스트

```bash
npm test              # Vitest 실행
npx tsc --noEmit      # 타입 체크
npm run build         # 프로덕션 빌드
```

## 📄 라이선스

MIT
