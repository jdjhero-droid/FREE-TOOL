import type { Category } from '../../types';

export const stylesAndEffects: Category = {
  name: '스타일 변환 & 효과',
  cases: [
    {
      id: 'f1-style-7',
      name: 'CASE 111: 자동 사진 편집',
      description: '밋밋한 사진을 업로드하여 대비, 색상, 조명을 향상시켜 더욱 풍부한 느낌의 사진으로 자동 편집합니다.',
      prompt: 'This photo is very boring and plain. Enhance it! Increase the contrast, boost the colors, and improve the lighting to make it richer,You can crop and delete details that affect the composition.',
      imageUploads: 1,
      suggestionHint: '사진에 특정 분위기를 추가하도록 요청하세요 (예: 따뜻한 느낌, 드라마틱한 느낌).',
      author: '@op7418',
      href: 'https://github.com/PicoTrex/Awesome-Nano-Banana-images/blob/main/README_en.md#case-7-automatic-photo-editingby-op7418',
    },
    {
      id: 'f1-style-13',
      name: 'CASE 112: 컬러 팔레트로 라인 아트 채색',
      description: '라인 아트 이미지와 컬러 팔레트 이미지를 업로드하여 지정된 색상으로 캐릭터를 정확하게 채색합니다.',
      prompt: 'Accurately use the color palette from Figure 2 to color the character in Figure 1',
      imageUploads: 2,
      suggestionHint: '채색 스타일에 그림자나 하이라이트를 추가하도록 지시하세요.',
      author: '@ZHO_ZHO_ZHO',
      href: 'https://github.com/PicoTrex/Awesome-Nano-Banana-images/blob/main/README_en.md#case-13-color-line-art-with-color-paletteby-zho_zho_zho',
    },
    {
      id: 'f1-style-20',
      name: 'CASE 113: 오래된 사진 복원 및 컬러화',
      description: '흑백의 오래된 사진을 복원하고 자연스러운 색상을 추가합니다.',
      prompt: 'restore and colorize this photo.',
      imageUploads: 1,
      suggestionHint: '사진의 특정 부분의 색상을 지정해보세요 (예: 옷을 파란색으로).',
      author: '@GeminiApp',
      href: 'https://github.com/PicoTrex/Awesome-Nano-Banana-images/blob/main/README_en.md#case-20-old-photo-colorizationby-geminiapp',
    },
    {
      id: 'f1-style-42',
      name: 'CASE 114: 필터/재질 오버레이',
      description: '참고 이미지에 다른 이미지의 필터나 재질 효과를 오버레이합니다. 대괄호 안의 효과를 수정하세요.',
      prompt: 'Overlay the [glass] effect from Image 2 onto the photo in Image 1',
      imageUploads: 2,
      suggestionHint: '오버레이 효과의 강도나 혼합 모드를 조절하도록 요청하세요.',
      author: '@ZHO_ZHO_ZHO',
      href: 'https://github.com/PicoTrex/Awesome-Nano-Banana-images/blob/main/README_en.md#case-42-overlay-filtermaterialby-zho_zho_zho',
    },
    {
      id: 'f1-style-44',
      name: 'CASE 115: 조명 제어',
      description: '캐릭터 이미지에 다른 이미지의 조명 효과를 적용하여 그림자를 만듭니다.',
      prompt: 'Change the character from Image 1 to the lighting from Image 2, with dark areas as shadows',
      imageUploads: 2,
      suggestionHint: '조명의 색상이나 방향을 변경하도록 지시하세요 (예: 붉은 조명, 위에서 아래로).',
      author: '@ZHO_ZHO_ZHO',
      href: 'https://github.com/PicoTrex/Awesome-Nano-Banana-images/blob/main/README_en.md#case-44-lighting-controlby-zho_zho_zho',
    },
    {
      id: 'f1-style-49',
      name: 'CASE 116: 피사체 추출 및 투명 배경',
      description: '이미지에서 특정 피사체를 추출하여 투명 배경에 배치합니다. 대괄호 안의 피사체를 수정하세요.',
      prompt: 'extract the [samurai] and put transparent background',
      imageUploads: 1,
      suggestionHint: '추출된 피사체에 그림자나 테두리 효과를 추가하도록 요청하세요.',
      author: '@nglprz',
      href: 'https://github.com/PicoTrex/Awesome-Nano-Banana-images/blob/main/README_en.md#case-49-extract-subject-and-place-on-transparent-layerby-nglprz',
    },
    {
      id: 'f1-style-50',
      name: 'CASE 117: 이미지 아웃페인팅 복원',
      description: '투명한 체커보드 영역이 포함된 이미지를 업로드하여 자연스럽게 복원합니다.',
      prompt: 'Repair the checkerboard (transparent) parts of the image and restore a complete, coherent photo.',
      imageUploads: 1,
      suggestionHint: '복원될 영역에 특정 사물이나 배경을 추가하도록 지시하세요.',
      author: '@bwabbage',
      href: 'https://github.com/PicoTrex/Awesome-Nano-Banana-images/blob/main/README_en.md#case-50-image-outpainting-repairby-bwabbage',
    },
    {
      id: 'f1-style-56',
      name: 'CASE 118: 만화 구도',
      description: '캐릭터 이미지와 장면 구도 참고 이미지를 업로드하여 만화 스타일의 한 장면을 구성합니다.',
      prompt: '',
      imageUploads: 2,
      suggestionHint: '장면에 말풍선이나 효과음을 추가하도록 요청하세요.',
      author: '@namaedousiyoka',
      href: 'https://github.com/PicoTrex/Awesome-Nano-Banana-images/blob/main/README_en.md#case-56-manga-compositionby-namaedousiyoka',
    },
    {
      id: 'f1-style-57',
      name: 'CASE 119: 만화 스타일 변환',
      description: '사진을 흑백 웹툰 스타일의 라인 드로잉으로 변환합니다.',
      prompt: 'Convert the input photo into a black-and-white webtoon-style line drawing.',
      imageUploads: 1,
      suggestionHint: '특정 웹툰 작가의 스타일을 모방하도록 요청하세요 (예: 조석 스타일).',
      author: '@nobisiro_2023',
      href: 'https://github.com/PicoTrex/Awesome-Nano-Banana-images/blob/main/README_en.md#case-57-manga-style-conversionby-nobisiro_2023',
    },
    {
      id: 'f1-style-58',
      name: 'CASE 120: 아이소메트릭 홀로그램 와이어프레임',
      description: '라인 아트 이미지를 기반으로 와이어프레임 라인만 사용한 홀로그램 묘사로 변환합니다.',
      prompt: 'Based on the uploaded image, convert it into a holographic depiction using wireframe lines only.',
      imageUploads: 1,
      suggestionHint: '홀로그램의 색상이나 애니메이션 효과를 추가하도록 요청하세요 (예: 빛나는 파란색, 깜빡이는 효과).',
      author: '@tetumemo',
      href: 'https://github.com/PicoTrex/Awesome-Nano-Banana-images/blob/main/README_en.md#case-58-isometric-holographic-wireframeby-tetumemo',
    },
    {
      id: 'f1-style-60',
      name: 'CASE 121: 로고에 재질 적용',
      description: '로고 이미지에 재질 구체 이미지의 질감을 적용하여 3D 오브젝트로 표현합니다.',
      prompt: 'Apply the material from Image 2 to the logo in Image 1, present it as a 3D object, render in a C4D-like style, with a solid-color background.',
      imageUploads: 2,
      suggestionHint: '배경에 그림자나 반사 효과를 추가하여 더 사실적으로 만들어보세요.',
      author: '@ZHO_ZHO_ZHO',
      href: 'https://github.com/PicoTrex/Awesome-Nano-Banana-images/blob/main/README_en.md#case-60-apply-material-sphere-to-logoby-zho_zho_zho',
    },
    {
      id: 'f1-style-62',
      name: 'CASE 122: 카메라 파라미터 재설정',
      description: '사진의 ISO, 조리개, 셔터 속도, 초점 거리 등 카메라 설정을 변경합니다.',
      prompt: 'RAW-ISO [100] - [F2.8-1/200 24mm] settings',
      imageUploads: 1,
      suggestionHint: '얕은 심도(아웃포커싱) 효과나 모션 블러 효과를 추가하도록 요청하세요.',
      author: '@hckinz',
      href: 'https://github.com/PicoTrex/Awesome-Nano-Banana-images/blob/main/README_en.md#case-62-reset-camera-parametersby-hckinz',
    },
    {
        id: 'f2-style-98',
        name: 'CASE 123: 반투명 유리 뒤 실루엣',
        description: '반투명 유리 뒤에 흐릿한 실루엣과 선명하게 대비되는 신체 일부를 흑백 사진으로 표현합니다.',
        prompt: `A black and white photograph shows the blurred silhouette of a [SUBJECT] behind a frosted or translucent surface. The [PART] is sharply defined and pressed against the surface, creating a stark contrast with the rest of the hazy, indistinct figure. The background is a soft gradient of gray tones, enhancing the mysterious and artistic atmosphere.`,
        imageUploads: 0,
        suggestionHint: '사진을 컬러로 변경하거나 다른 분위기를 연출해보세요 (예: 공포, 로맨틱).',
        author: '@umesh_ai',
        href: 'https://github.com/JimmyLv/awesome-nano-banana#cases-98',
    },
    {
        id: 'f2-style-93',
        name: 'CASE 124: 유리 질감 리텍스처링',
        description: '업로드한 이미지에 JSON으로 정의된 투명하고 무지갯빛 효과의 유리 질감을 적용합니다.',
        prompt: `retexture the image attached based on the JSON aesthetic below
{
  "style": "photorealistic 3D render",
  "material": "glass with transparent and iridescent effects",
  "surface_texture": "smooth, polished with subtle reflections and refractive effects",
  "lighting": {
    "type": "studio HDRI",
    "intensity": "high",
    "direction": "angled top-left key light and ambient fill",
    "accent_colors": ["blue", "green", "purple"],
    "reflections": true,
    "refractions": true,
    "dispersion_effects": true,
    "bloom": true
  },
  "color_scheme": {
    "primary": "transparent with iridescent blue, green, and purple hues",
    "secondary": "crystal-clear with subtle chromatic shifts",
    "highlights": "soft, glowing accents reflecting rainbow-like effects",
    "rim_light": "soft reflective light around edges"
  },
  "background": {
    "color": "black",
    "vignette": true,
    "texture": "none"
  },
  "post_processing": {
    "chromatic_aberration": true,
    "glow": true,
    "high_contrast": true,
    "sharp_details": true
  }
}`,
        imageUploads: 1,
        suggestionHint: 'JSON의 값을 수정하여 다른 유리 질감 효과를 만들어보세요 (예: 색상, 조명 변경).',
        author: '@egeberkina',
        href: 'https://github.com/JimmyLv/awesome-nano-banana#cases-93',
    },
    {
        id: 'f2-style-88',
        name: 'CASE 125: 어린이 색칠공부 일러스트',
        description: '특정 장면을 주제로 한 어린이용 색칠공부 흑백 라인 드로잉을 생성하며, 오른쪽 하단에 작은 컬러 예시 이미지를 포함합니다.',
        prompt: `A black and white line drawing coloring illustration, suitable for direct printing on standard size (8.5x11 inch) paper, without paper borders. The overall illustration style is fresh and simple, using clear and smooth black outline lines, without shadows, grayscale, or color filling, with a pure white background for easy coloring.
[At the same time, for the convenience of users who are not good at coloring, please generate a complete colored version in the lower right corner as a small image for reference]
Suitable for: [6-9 year old children]
Scene description:
[A Haetae (a mythical Korean creature) is walking through a palace courtyard, with bright sunshine, blue sky and white clouds]`,
        imageUploads: 0,
        suggestionHint: '다른 주제나 다른 연령대에 맞는 색칠공부 도안을 요청해보세요.',
        author: '@dotey',
        href: 'https://github.com/JimmyLv/awesome-nano-banana#cases-88',
    },
    {
        id: 'f2-style-86',
        name: 'CASE 126: 이중 노출',
        description: '인물의 실루엣과 풍경을 조화롭게 결합한 이중 노출 이미지를 생성합니다.',
        prompt: `Double exposure, Midjourney style, merging, blending, overlay double exposure image, Double Exposure style, An exceptional masterpiece by Yukisakura revealing a fantastic double exposure composition of Aragorn son of Arathorn's silhouette harmoniously intertwined with the visually striking, rugged landscapes of Middle Earth during a lively spring season. Sun-bathed pine forests, mountain peaks, and a lone horse cutting through the trail echo outward through the fabric of his figure, adding layers of narrative and solitude. Beautiful tension builds as the stark monochrome background maintains razor-sharp contrast, drawing all focus to the richly layered double exposure. Characterized by its vibrant full-color scheme within Aragorn's silhouette and crisp, deliberate lines that trace every contour with emotional precision. (Detailed:1.45). (Detailed background:1.4).`,
        imageUploads: 0,
        suggestionHint: '실루엣과 풍경을 다른 주제로 조합해보세요 (예: 도시와 동물).',
        author: 'rezzycheck (Sora)',
        href: 'https://github.com/JimmyLv/awesome-nano-banana#cases-86',
    },
    {
        id: 'f2-style-83',
        name: 'CASE 127: 빛나는 선 해부도',
        description: '특정 대상의 해부학적 구조를 빛나는 선으로 표현한 디지털 일러스트를 생성합니다.',
        prompt: `A digital illustration of a [SUBJECT], portrayed with a network of glowing clean pristine blue lines outlining its anatomy. The image is set against a dark background, highlighting the [SUBJECT] form and features. A specific area such as [PART] is emphasized with a red glow to indicate a point of interest or significance. The style is both educational and visually captivating, designed to resemble an advanced imaging technique`,
        imageUploads: 0,
        suggestionHint: '선의 색상이나 배경을 변경해보세요 (예: 녹색 선, 흰색 배경).',
        author: '@umesh_ai',
        href: 'https://github.com/JimmyLv/awesome-nano-banana#cases-83',
    },
    {
        id: 'f2-style-81',
        name: 'CASE 128: 3D 반투명 유리 변환',
        description: '업로드한 사물 이미지를 부드러운 반투명 유리 질감의 3D 오브제로 변환합니다.',
        prompt: `A soft, 3D translucent glass of the attached image with a frosty matte finish and detailed texture, original colors, centered on a light gray background, floats gently in space, soft shadows, natural lighting`,
        imageUploads: 1,
        suggestionHint: '유리의 색상이나 투명도를 조절하도록 요청하세요.',
        author: '@azed_ai',
        href: 'https://github.com/JimmyLv/awesome-nano-banana#cases-81',
    },
    {
        id: 'f2-style-78',
        name: 'CASE 129: 유리 질감 리텍스처링 (JSON)',
        description: '업로드한 이미지에 JSON으로 정의된 사실적인 유리 질감을 적용합니다.',
        prompt: `retexture the image attached based on the json below:

{
  "style": "photorealistic",
  "material": "glass",
  "background": "plain white",
  "object_position": "centered",
  "lighting": "soft, diffused studio lighting",
  "camera_angle": "eye-level, straight-on",
  "resolution": "high",
  "aspect_ratio": "2:3",
  "details": {
    "reflections": true,
    "shadows": false,
    "transparency": true
  }
}`,
        imageUploads: 1,
        suggestionHint: 'JSON의 값을 수정하여 다른 질감 효과를 만들어보세요 (예: 금속, 나무).',
        author: '@egeberkina',
        href: 'https://github.com/JimmyLv/awesome-nano-banana#cases-78',
    },
    {
        id: 'f2-style-69',
        name: 'CASE 130: 실루엣 아트',
        description: '밝은 노란색 배경에 특정 대상의 검은색 실루엣을 생성합니다.',
        prompt: `The silhouette of a basic outline of a [PROMPT]. The background is bright yellow, and the silhouette is solid black.`,
        imageUploads: 0,
        suggestionHint: '배경과 실루엣의 색상을 변경해보세요 (예: 파란 배경, 흰색 실루엣).',
        author: '@umesh_ai',
        href: 'https://github.com/JimmyLv/awesome-nano-banana#cases-69',
    },
    {
        id: 'f2-style-67',
        name: 'CASE 131: 초현실적 3D 게임',
        description: '특정 게임 캐릭터와 2008년도의 향수를 불러일으키는 방 안의 모습을 초현실적인 3D 렌더링 이미지로 재현합니다.',
        prompt: `Ultra-realistic 3D rendered image that replicates the character design of Natasha from Command & Conquer: Red Alert 3 in 2008, following the original model exactly. The scene is set in a dim and cluttered bedroom from the year 2008. The character is sitting on the carpet, facing an old-fashioned television that is playing Command & Conquer: Red Alert 3 and a game console controller.
The entire room is filled with a nostalgic atmosphere of the year 2008: snack packaging bags, soda cans, posters, and tangled wires are everywhere. Natasha Volkova is captured in the moment of turning her head, looking back at the camera over her shoulder. There is an innocent smile on her iconic ethereally beautiful face. Her upper body is slightly twisted, with a natural dynamic, as if she is reacting to being startled by the flash.
The flash slightly overexposes her face and clothes, making her silhouette stand out more prominently in the dimly lit room. The whole photo appears raw and natural. The strong contrast between light and dark casts deep shadows behind her. The image is full of tactile feel, with a simulated texture that resembles an authentic film snapshot from 2008.`,
        imageUploads: 0,
        suggestionHint: '다른 게임 캐릭터나 다른 연대의 방을 재현해보세요 (예: 1990년대, 2010년대).',
        author: '@ZHO_ZHO_ZHO',
        href: 'https://github.com/JimmyLv/awesome-nano-banana#cases-67',
    },
    {
        id: 'f2-style-57',
        name: 'CASE 132: 8비트 픽셀 아이콘',
        description: '특정 이모지나 사물을 복고풍 아케이드 게임 스타일의 미니멀한 8비트 픽셀 로고로 생성합니다.',
        prompt: `Create a minimalist 8-bit pixel logo of [🍔], centered on a pure white background. Use a limited retro color palette with pixelated detailing, sharp edges, and clean blocky forms. The logo should be simple, iconic, and clearly recognizable in pixel art style — inspired by classic arcade game aesthetics.`,
        imageUploads: 0,
        suggestionHint: '다른 스타일의 픽셀 아트를 요청해보세요 (예: 16비트, 아이소메트릭).',
        author: '@egeberkina',
        href: 'https://github.com/JimmyLv/awesome-nano-banana#cases-57',
    },
    {
        id: 'f2-style-50',
        name: 'CASE 133: 물리적 파괴 효과 카드',
        description: '캐릭터가 트레이딩 카드의 프레임을 부수고 튀어나오는 역동적인 장면을 연출합니다.',
        prompt: `An ultra-photorealistic, cinematic-style illustration depicting Lara Croft dynamically bursting through the frame of an “Archaeological Adventure” trading card. She is caught mid-jump or swinging on a rope, wearing her iconic adventurer outfit and possibly firing dual pistols. The muzzle flashes help shatter the card’s ancient stone-carved border, creating a visible dimensional rupture with energy cracks and spatial distortions, scattering dust and debris outward.

Her body lunges forward with powerful momentum, breaking through the card’s flat plane, emphasizing strong motion depth. Inside the card (the background) is a depiction of dense jungle ruins or a trap-filled ancient tomb. The shattered card fragments mix with crumbling stone, flying vines, broken ancient coins, and spent shell casings.

The title “Archaeological Adventure” and the name “Lara Croft” (accompanied by a stylized artifact icon) remain visible on the remaining cracked and weathered parts of the card. The scene is lit with adventurous, dynamic lighting that emphasizes her agility and the perilous environment.`,
        imageUploads: 0,
        suggestionHint: '다른 캐릭터나 다른 파괴 효과를 요청해보세요 (예: 불, 얼음 효과).',
        author: '@op7418',
        href: 'https://github.com/JimmyLv/awesome-nano-banana#cases-50',
    },
    {
        id: 'f2-style-48',
        name: 'CASE 134: 복셀 스타일 3D 아이콘 변환',
        description: '참고 스타일 이미지와 변환할 아이콘 이미지를 업로드하여 아이콘을 복셀 3D 스타일로 변환합니다.',
        prompt: `Take the icon on the right and transform it into a voxel 3d icon like the icons in the left image. Octane render. 8k.`,
        imageUploads: 2,
        suggestionHint: '복셀 아이콘의 색상이나 조명을 변경하도록 요청하세요.',
        author: '@BrettFromDJ',
        href: 'https://github.com/JimmyLv/awesome-nano-banana#cases-48',
    },
    {
        id: 'f2-style-36',
        name: 'CASE 135: 미니멀리스트 3D 일러스트 (마크다운)',
        description: '마크다운 형식으로 상세하게 스타일을 정의하여 미니멀한 3D 일러스트를 생성합니다.',
        prompt: `Draw a Toilet

## 🎨 Art Style: Minimalist 3D Illustration

### 🟢 Shape Language
- Rounded edges and smooth, soft forms using simplified geometric shapes.

### 🎨 Colors
- **Primary palette:** soft beige, light gray, warm orange.  
- **Accent color:** warm orange for focal elements.  
- **Shading:** gentle gradients and smooth transitions, avoiding harsh shadows and highlights.

### 💡 Lighting
- **Type:** soft, diffuse lighting.  
- **Light source direction:** from above, slightly to the right.  
- **Shadow style:** subtle and diffused, without sharp or high-contrast shadows.

### 🧱 Materials
- **Surface texture:** matte and smooth with subtle light variation.  
- **Reflectivity:** low to none, avoiding noticeable gloss.

### 🖼️ Composition
- **Object presentation:** a single, centered object with generous negative space around it.  
- **Perspective:** slight tilt to suggest depth, but no strong depth-of-field effects.  
- **Background:** flat color, low saturation, harmonious with the subject and non-distracting.

### ✒️ Typography
- **Font style:** minimalist sans-serif.  
- **Text placement:** bottom left corner, small and unobtrusive.  
- **Font color:** gray, low contrast with the background.

### 🖥️ Rendering Style
- **Technique:** 3D rendering in a simplified low-poly style.  
- **Detail level:** medium — focus on shape and color, avoiding complex textures or fine details.

## 🎯 Style Goal
> Create a clean and aesthetically pleasing visual that emphasizes simplicity, approachability, and modernity.`,
        imageUploads: 0,
        suggestionHint: '마크다운 내용을 수정하여 다른 스타일의 일러스트를 생성해보세요.',
        author: '@dotey',
        href: 'https://github.com/JimmyLv/awesome-nano-banana#cases-36',
    },
    {
        id: 'f2-style-32',
        name: 'CASE 136: 3D 종이 공예 팝업북',
        description: '특정 장면을 주제로 한 다층적인 접이식 종이 조각 팝업북을 생성합니다.',
        prompt: `Multi-layered foldable paper sculpture pop-up book, placed on a desk, with a clean background highlighting the main subject. The book presents a 3D flip-book style, with a 2:3 vertical aspect ratio. The open pages display the scene of [Nezha Demon Child version battling Ao Bing]. All elements are finely foldable and assembled, showcasing a realistic and delicate texture of folded paper. The composition uniformly adopts a frontal perspective, with an overall dreamy and beautiful visual style, vibrant and gorgeous colors, full of a fantastical and lively story atmosphere.`,
        imageUploads: 0,
        suggestionHint: '팝업북의 장면을 다른 이야기나 동화로 변경해보세요.',
        author: '@dotey',
        href: 'https://github.com/JimmyLv/awesome-nano-banana#cases-32',
    },
    {
        id: 'f2-style-18',
        name: 'CASE 137: 픽사 3D 스타일',
        description: '업로드한 사진을 픽사 애니메이션의 3D 스타일로 다시 그립니다.',
        prompt: `Redraw this photo in Pixar 3D style`,
        imageUploads: 1,
        suggestionHint: '다른 애니메이션 스튜디오 스타일을 적용해보세요 (예: 디즈니, 드림웍스).',
        author: 'AnimeAI',
        href: 'https://github.com/JimmyLv/awesome-nano-banana#cases-18',
    },
    {
        id: 'f2-style-17',
        name: 'CASE 138: 복고풍 CRT 컴퓨터 부팅 화면',
        description: '특정 모양이나 로고의 ASCII 아트로 해석되는 복고풍 CRT 컴퓨터 부팅 화면을 생성합니다.',
        prompt: `Retro CRT computer boot screen that resolves into ASCII-art of [shape or logo]`,
        imageUploads: 0,
        suggestionHint: '화면의 색상이나 폰트를 변경해보세요 (예: 녹색 텍스트, 터미널 폰트).',
        author: '@Gdgtify',
        href: 'https://github.com/JimmyLv/awesome-nano-banana#cases-17',
    },
    {
        id: 'f2-style-16',
        name: 'CASE 139: 애니메이션 스타일 배지',
        description: '업로드한 인물 사진을 기반으로 술이 달린 원형 애니메이션 스타일 배지 사진을 생성합니다.',
        prompt: `Based on the person in the attachment, generate a photo of an anime-style badge. Requirements:
Material: Tassel
Shape: Circular
Main subject: A hand holding the badge`,
        imageUploads: 1,
        suggestionHint: '배지의 모양이나 재질을 변경해보세요 (예: 사각형, 금속).',
        author: '@Alittlefatwhale',
        href: 'https://github.com/JimmyLv/awesome-nano-banana#cases-16',
    },
    {
        id: 'f2-style-169',
        name: 'CASE 169: 로고스타일로 변환',
        description: '사진을 로고 타이포그래피 스타일로 변형 합니다.',
        prompt: 'Create a typographic illustration shaped like a {OBJECT}, where the text itself forms the shape — bold and playful lettering style that fills the entire silhouette — letters adapt fluidly to the curves and contours of the object — vibrant and contrasting color palette that fits the theme — background is solid and enhances the focus on the main shape — vector-style, clean, high resolution, poster format, 1:1 aspect ratio.',
        imageUploads: 1,
        suggestionHint: '다양한 물건이나 사물을 로고로 변형해 보세요 (예: 신발, 머그컵 등등).',
        author: '@dotey',
        href: 'https://github.com/JimmyLv/awesome-nano-banana',
    },
  ],
};