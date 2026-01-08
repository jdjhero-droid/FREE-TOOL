import type { Category } from '../../types';

export const peopleAndCharacters: Category = {
  name: '인물 & 캐릭터',
  cases: [
    {
      id: 'f1-char-1',
      name: 'CASE 1: 일러스트를 피규어로',
      description: '참고 이미지를 업로드하여 캐릭터 피규어와 제품 상자가 있는 장면을 생성합니다.',
      prompt: 'turn this photo into a character figure. Behind it, place a box with the character\'s image printed on it, and a computer showing the Blender modeling process on its screen. In front of the box, add a round plastic base with the character figure standing on it. set the scene indoors if possible',
      imageUploads: 1,
      suggestionHint: '피규어의 재질 변경 (예: 크리스탈, 나무), 배경 소품 추가 (예: 조명, 식물)',
      author: '@ZHO_ZHO_ZHO',
      href: 'https://github.com/PicoTrex/Awesome-Nano-Banana-images/blob/main/README_en.md#case-1-illustration-to-figureby-zho_zho_zho',
    },
    {
      id: 'f1-char-5',
      name: 'CASE 2: 다양한 시대의 내 모습',
      description: '인물 사진을 업로드하고 프롬프트를 수정하여 특정 시대의 스타일로 변환합니다. 대괄호 안의 내용을 수정하여 사용하세요.',
      prompt: `Change the characer's style to [1970]'s classical [male] style

Add [long curly] hair, 
[long mustache], 
change the background to the iconic [californian summer landscape]

Don't change the character's face`,
      imageUploads: 1,
      suggestionHint: '다른 시대나 스타일을 시도해보세요 (예: 1920년대 재즈 시대, 사이버펑크 스타일)',
      author: '@AmirMushich',
      href: 'https://github.com/PicoTrex/Awesome-Nano-Banana-images/blob/main/README_en.md#case-5-photos-of-yourself-in-different-erasby-amirmushich',
    },
    {
      id: 'f1-char-8',
      name: 'CASE 3: 손그림으로 캐릭터 포즈 제어',
      description: '캐릭터 이미지와 손으로 그린 스케치를 업로드하여 두 캐릭터가 싸우는 장면을 연출합니다.',
      prompt: 'Have these two characters fight using the pose from Figure 3. Add appropriate visual backgrounds and scene interactions,Generated image ratio is 16:9',
      imageUploads: 2,
      suggestionHint: '배경을 특정 장소로 변경해보세요 (예: 우주, 고대 로마 콜로세움)',
      author: '@op7418',
      href: 'https://github.com/PicoTrex/Awesome-Nano-Banana-images/blob/main/README_en.md#case-8-hand-drawing-controls-multi-character-posesby-op7418',
    },
    {
      id: 'f1-char-10',
      name: 'CASE 4: 커스텀 캐릭터 스티커',
      description: '캐릭터 이미지와 스티커 참고 이미지를 업로드하여 웹 일러스트 스타일의 스티커를 생성합니다.',
      prompt: 'Help me turn the character into a white outline sticker similar to Figure 2. The character needs to be transformed into a web illustration style, and add a playful white outline short phrase describing Figure 1.',
      imageUploads: 2,
      suggestionHint: '스티커에 다른 문구를 추가하거나 캐릭터의 표정을 바꿔보세요 (예: "Hello!", 슬픈 표정)',
      author: '@op7418',
      href: 'https://github.com/PicoTrex/Awesome-Nano-Banana-images/blob/main/README_en.md#case-10-custom-character-stickersby-op7418',
    },
    {
      id: 'f1-char-11',
      name: 'CASE 5: 애니메이션 캐릭터를 실제 코스어로',
      description: '일러스트 이미지를 업로드하여 코믹마켓 배경의 코스프레 사진을 생성합니다.',
      prompt: 'Generate a photo of a girl cosplaying this illustration, with the background set at Comiket',
      imageUploads: 1,
      suggestionHint: '코스프레의 배경을 다른 장소로 변경해보세요 (예: 스튜디오, 판타지 숲)',
      author: '@ZHO_ZHO_ZHO',
      href: 'https://github.com/PicoTrex/Awesome-Nano-Banana-images/blob/main/README_en.md#case-11-anime-to-real-coserby-zho_zho_zho',
    },
    {
      id: 'f1-char-12',
      name: 'CASE 6: 캐릭터 디자인 생성',
      description: '캐릭터 참고 이미지를 기반으로 3면도, 표정, 포즈 등이 포함된 상세한 캐릭터 디자인 시트를 생성합니다.',
      prompt: `Generate character design for me (Character Design)

Proportion design (different height comparisons, head-to-body ratio, etc.)

Three views (front, side, back)

Expression design (Expression Sheet) → like the image you sent

Pose design (Pose Sheet) → various common poses

Costume design (Costume Design)`,
      imageUploads: 1,
      suggestionHint: '캐릭터의 의상이나 특정 소품 디자인을 구체적으로 지시하세요 (예: 갑옷 디자인 추가)',
      author: '@ZHO_ZHO_ZHO',
      href: 'https://github.com/PicoTrex/Awesome-Nano-Banana-images/blob/main/README_en.md#case-12-generate-character-designby-zho_zho_zho',
    },
    {
        id: 'f1-char-15',
        name: 'CASE 7: 다양한 헤어스타일 변경',
        description: '인물 사진을 업로드하여 3x3 그리드 형식으로 다양한 헤어스타일의 아바타를 생성합니다.',
        prompt: 'Generate avatars of this person with different hairstyles in a 3x3 grid format',
        imageUploads: 1,
        suggestionHint: '헤어스타일 외에 다른 요소 변경을 요청하세요 (예: 안경 추가, 다른 표정)',
        author: '@balconychy',
        href: 'https://github.com/PicoTrex/Awesome-Nano-Banana-images/blob/main/README_en.md#case-15-change-multiple-hairstylesby-balconychy',
    },
    {
        id: 'f1-char-21',
        name: 'CASE 8: OOTD 의상 코디',
        description: '인물 이미지와 의상 이미지를 업로드하여 자연스러운 OOTD 스타일 사진을 생성합니다.',
        prompt: 'Choose the person in Image 1 and dress them in all the clothing and accessories from Image 2. Shoot a series of realistic OOTD-style photos outdoors, using natural lighting, a stylish street style, and clear full-body shots. Keep the person\'s identity and pose from Image 1, but show the complete outfit and accessories from Image 2 in a cohesive, stylish way.',
        imageUploads: 2,
        suggestionHint: '의상의 색상이나 배경 장소를 구체적으로 지정하세요 (예: 빨간 드레스, 파리의 거리)',
        author: '@302.AI',
        href: 'https://github.com/PicoTrex/Awesome-Nano-Banana-images/blob/main/README_en.md#case-21-ootd-outfitby-302ai',
    },
    {
        id: 'f1-char-22',
        name: 'CASE 9: 캐릭터 의상 변경',
        description: '인물 이미지와 의상 이미지를 업로드하여 인물의 옷만 자연스럽게 변경합니다.',
        prompt: 'Replace the person\'s clothing in the input image with the target clothing shown in the reference image. Keep the person\'s pose, facial expression, background, and overall realism unchanged. Make the new outfit look natural, well-fitted, and consistent with lighting and shadows. Do not alter the person\'s identity or the environment — only change the clothes.',
        imageUploads: 2,
        suggestionHint: '의상의 종류나 색상을 구체적으로 지시하세요 (예: 파란색 정장으로 변경)',
        author: '@skirano',
        href: 'https://github.com/PicoTrex/Awesome-Nano-Banana-images/blob/main/README_en.md#case-22-character-clothing-changeby-skirano',
    },
    {
        id: 'f1-char-25',
        name: 'CASE 10: 캐릭터 포즈 수정',
        description: '참고 이미지를 업로드하고 간단한 프롬프트로 인물의 시선 방향을 수정합니다.',
        prompt: 'Have the person in the picture look straight ahead',
        imageUploads: 1,
        suggestionHint: '시선 방향 외 다른 포즈 수정을 요청하세요 (예: 손을 흔들게 해주세요)',
        author: '@arrakis_ai',
        href: 'https://github.com/PicoTrex/Awesome-Nano-Banana-images/blob/main/README_en.md#case-25-character-pose-modificationby-arrakis_ai',
    },
    {
        id: 'f1-char-26',
        name: 'CASE 11: 라인 드로잉으로 이미지 생성',
        description: '인물 이미지와 포즈 참고용 라인 드로잉을 업로드하여 스튜디오에서 촬영한 것처럼 인물의 포즈를 변경합니다.',
        prompt: 'Change the pose of the person in Figure 1 to that of Figure 2, and shoot in a professional studio',
        imageUploads: 2,
        suggestionHint: '배경을 다른 장소로 변경해보세요 (예: 해변, 도시의 밤거리)',
        author: '@ZHO_ZHO_ZHO',
        href: 'https://github.com/PicoTrex/Awesome-Nano-Banana-images/blob/main/README_en.md#case-26-generate-image-from-line-drawingby-zho_zho_zho',
    },
    {
        id: 'f1-char-32',
        name: 'CASE 12: 액션 피규어 제작',
        description: '자신의 사진을 업로드하고 원하는 아이템을 지정하여 커스텀 액션 피규어를 만듭니다. 대괄호 안의 내용을 수정하세요.',
        prompt: 'make an action figure of me that says [“AI Evangelist - Kris”] and features [coffee, turtle, laptop, phone and headphones]',
        imageUploads: 1,
        suggestionHint: '액션 피규어의 재질이나 포장을 더 구체적으로 묘사하세요 (예: 금속 재질, 한정판 포장)',
        author: '@icreatelife',
        href: 'https://github.com/PicoTrex/Awesome-Nano-Banana-images/blob/main/README_en.md#case-32-action-figureby-icreatelife',
    },
    {
        id: 'f1-char-34',
        name: 'CASE 13: 참고 이미지로 표정 제어',
        description: '캐릭터 이미지와 표정 참고 이미지를 업로드하여 캐릭터의 표정을 변경합니다.',
        prompt: 'Character reference from Image 1 / Change to the expression from Image 2',
        imageUploads: 2,
        suggestionHint: '표정 외에 다른 요소를 변경해보세요 (예: 머리 스타일, 의상 색상)',
        author: '@ZHO_ZHO_ZHO',
        href: 'https://github.com/PicoTrex/Awesome-Nano-Banana-images/blob/main/README_en.md#case-34-reference-image-controls-character-expressionby-zho_zho_zho',
    },
    {
        id: 'f1-char-35',
        name: 'CASE 14: 일러스트 드로잉 과정 4분할',
        description: '캐릭터 참고 이미지를 업로드하여 라인 아트부터 완성까지 4단계의 드로잉 과정을 생성합니다.',
        prompt: 'Generate a four-panel drawing process for the character: Step 1: Line art, Step 2: Flat colors, Step 3: Add shadows, Step 4: Refine and complete. No text.',
        imageUploads: 1,
        suggestionHint: '각 단계의 스타일을 구체적으로 지시하세요 (예: 수채화 스타일, 펜 드로잉 스타일)',
        author: '@ZHO_ZHO_ZHO',
        href: 'https://github.com/PicoTrex/Awesome-Nano-Banana-images/blob/main/README_en.md#case-35-illustration-drawing-process-four-panelby-zho_zho_zho',
    },
    {
        id: 'f1-char-36',
        name: 'CASE 15: 가상 메이크업 체험',
        description: '인물 사진과 메이크업 참고 이미지를 업로드하여 가상으로 메이크업을 적용합니다.',
        prompt: 'Apply the makeup from Image 2 to the character in Image 1, while maintaining the pose from Image 1.',
        imageUploads: 2,
        suggestionHint: '메이크업 스타일을 더 구체적으로 지시하세요 (예: 스모키 화장, 글리터 메이크업)',
        author: '@ZHO_ZHO_ZHO',
        href: 'https://github.com/PicoTrex/Awesome-Nano-Banana-images/blob/main/README_en.md#case-36-virtual-makeup-try-onby-zho_zho_zho',
    },
    {
        id: 'f1-char-40',
        name: 'CASE 16: 다양한 캐릭터 포즈 생성',
        description: '캐릭터 참고 이미지를 업로드하여 다양한 포즈 시트를 생성합니다.',
        prompt: 'Please create a pose sheet for this illustration, making various poses!',
        imageUploads: 1,
        suggestionHint: '특정 포즈를 추가로 요청하세요 (예: 점프하는 포즈, 앉아있는 포즈)',
        author: '@tapehead_Lab',
        href: 'https://github.com/PicoTrex/Awesome-Nano-Banana-images/blob/main/README_en.md#case-40-multiple-character-poses-generationby-tapehead_lab',
    },
    {
        id: 'f1-char-43',
        name: 'CASE 17: 캐릭터 얼굴형 제어',
        description: '캐릭터 이미지와 얼굴형 참고 이미지를 업로드하여 캐릭터를 원하는 얼굴형의 꼬마 버전으로 디자인합니다.',
        prompt: 'Design the character from Image 1 as a chibi version according to the face shape from Image 2',
        imageUploads: 2,
        suggestionHint: '캐릭터의 의상이나 액세서리를 추가해보세요 (예: 모자, 안경)',
        author: '@ZHO_ZHO_ZHO',
        href: 'https://github.com/PicoTrex/Awesome-Nano-Banana-images/blob/main/README_en.md#case-43-control-character-face-shapeby-zho_zho_zho',
    },
    {
        id: 'f1-char-63',
        name: 'CASE 18: 증명사진 만들기',
        description: '인물 사진을 업로드하여 파란색 배경의 전문적인 비즈니스 복장 스타일 증명사진을 생성합니다.',
        prompt: `Crop the head and create a 2-inch ID photo with:
  1. Blue background
  2. Professional business attire
  3. Frontal face
  4. Slight smile`,
        imageUploads: 1,
        suggestionHint: '배경 색상이나 의상 스타일을 변경해보세요 (예: 회색 배경, 캐주얼 복장)',
        author: '@songguoxiansen',
        href: 'https://github.com/PicoTrex/Awesome-Nano-Banana-images/blob/main/README_en.md#case-63-create-an-id-photoby-songguoxiansen',
    },
    {
        id: 'f2-char-99',
        name: 'CASE 19: 흑백 인물 사진 예술',
        description: '해리포터를 주제로 한 고해상도 흑백 인물 사진 작품을 생성합니다.',
        prompt: `A high-resolution black and white portrait artwork, in an editorial and fine art photography style. The background features a soft gradient, transitioning from mid-gray to almost pure white, creating a sense of depth and tranquility. Fine film grain adds a tactile, analog-like softness to the image, reminiscent of classic black and white photography.

On the right side of the frame, a blurred yet striking face of Harry Potter subtly emerges from the shadows, not in a traditional pose, but as if caught in a moment of thought or breath. Only a part of his face is visible: perhaps an eye, a cheekbone, the contour of his lips, evoking a sense of mystery, intimacy, and elegance. His features are delicate yet profound, exuding a melancholic and poetic beauty without being overly dramatic.

A gentle, directional light, softly diffused, caresses the curve of his cheek or glints in his eye—this is the emotional core of the image. The rest of the composition is dominated by ample negative space, intentionally kept simple, allowing the image to breathe. There are no texts, no logos in the image—only an interplay of light, shadow, and emotion.

The overall atmosphere is abstract yet deeply human, like a fleeting glance or a half-remembered dream: intimate, timeless, and poignantly beautiful.`,
        imageUploads: 0,
        suggestionHint: '다른 인물을 주제로 변경해보세요 (예: 셜록 홈즈, 헤르미온느)',
        author: '@ZHO_ZHO_ZHO',
        href: 'https://github.com/JimmyLv/awesome-nano-banana#cases-99',
    },
    {
        id: 'f2-char-96',
        name: 'CASE 20: 커스텀 애니메이션 피규어',
        description: '인물 사진을 업로드하여 책상 위에 놓인 애니메이션 스타일 피규어를 생성합니다.',
        prompt: `Generate an anime-style figure photo placed on a desktop, presented from a casual, everyday snapshot perspective as if taken with a mobile phone. The figure model is based on the attached character photo, accurately reproducing the full body posture, facial expression, and clothing style of the person in the photo, ensuring the entire figure is fully rendered. The overall design is exquisite and detailed, with hair and clothing featuring natural, soft gradient colors and fine textures. The style leans towards Japanese anime, rich in detail, with realistic textures and a beautiful appearance.`,
        imageUploads: 1,
        suggestionHint: '피규어의 재질이나 책상의 소품을 변경해보세요 (예: 크리스탈 피규어, 노트북 추가)',
        author: '@dotey',
        href: 'https://github.com/JimmyLv/awesome-nano-banana#cases-96',
    },
    {
        id: 'f2-char-95',
        name: 'CASE 21: 셀카로 버블헤드 인형 만들기',
        description: '셀카를 업로드하여 머리는 크고 몸은 만화처럼 표현된 버블헤드 인형을 만듭니다. 대괄호 안의 배경 설명을 수정하세요.',
        prompt: `Turn this photo into a bobblehead: enlarge the head slightly, keep the face accurate and cartoonify the body. [Place it on a bookshelf].`,
        imageUploads: 1,
        suggestionHint: '버블헤드 인형이 놓일 다른 배경을 지정하세요 (예: 자동차 대시보드 위)',
        author: '@thisdudelikesAI',
        href: 'https://github.com/JimmyLv/awesome-nano-banana#cases-95',
    },
    {
        id: 'f2-char-94',
        name: 'CASE 22: 랜드마크에서 동물 세 마리 셀카',
        description: '특정 랜드마크 앞에서 동물 세 마리가 셀카를 찍는 모습을 생성합니다. 대괄호 안의 동물 종류와 랜드마크를 수정하세요.',
        prompt: `A close-up selfie of three [animal type] with different expressions in front of the iconic [landmark], taken at golden hour with cinematic lighting. The animals are positioned close to the camera with their heads touching, mimicking a selfie pose, showing joyful, surprised, and calm expressions. The background features the full architectural detail of [landmark], softly illuminated, with a warm ambient atmosphere. Shot in a photographic, realistic cartoon style, high detail, 1:1 aspect ratio.`,
        imageUploads: 0,
        suggestionHint: '동물 종류나 랜드마크를 변경해보세요 (예: 판다, 만리장성)',
        author: '@berryxia_ai',
        href: 'https://github.com/JimmyLv/awesome-nano-banana#cases-94',
    },
    {
        id: 'f2-char-70',
        name: 'CASE 23: 오리지널 포켓몬 생성',
        description: '사물 사진을 업로드하여 그에 영감을 받은 새로운 포켓몬을 생성합니다.',
        prompt: `Create an original creature inspired by this object (photo provided). The creature should look like it belongs in a fantasy monster-catching universe, with a cute or cool design influenced by retro fantasy RPG monster art. The image must include:
– A full-body view of the creature, inspired by the shape, materials or purpose of the object.
– A small orb or capsule (similar an a pokeball) at its feet, designed with patterns and colors matching the object’s look — not a standard Pokéball, but a custom design.
– An invented name for the creature, displayed next to or below it. – Its elemental type (e.g., Fire, Water, Metal, Nature, Electric…), based on the object’s core properties. The illustration should look like it comes from a fantasy creature encyclopedia, with clean lines, soft shadows, and an expressive, character-driven design.`,
        imageUploads: 1,
        suggestionHint: '사물의 특징을 포켓몬 디자인에 어떻게 반영할지 구체적으로 지시하세요 (예: 날카로운 부분은 뿔로)',
        author: '@Anima_Labs',
        href: 'https://github.com/JimmyLv/awesome-nano-banana#cases-70',
    },
    {
        id: 'f2-char-54',
        name: 'CASE 24: 아주 평범한 아이폰 셀카',
        description: '의도적으로 평범하고, 흔들리고, 구도가 엉망인 "실수"로 찍은 듯한 셀카를 생성합니다.',
        prompt: `Please draw an extremely ordinary and unremarkable iPhone selfie, with no clear subject or sense of composition — just like a random snapshot taken casually. The photo should include slight motion blur, with uneven lighting caused by sunlight or indoor lights resulting in mild overexposure. The angle is awkward, the composition is messy, and the overall aesthetic is deliberately plain — as if it was accidentally taken while pulling the phone out of a pocket.
The subjects are Eason Chan and Nicholas Tse, taken at night, next to the Hong Kong Convention and Exhibition Centre, by Victoria Harbour in Hong Kong.`,
        imageUploads: 0,
        suggestionHint: '다른 인물이나 장소로 변경하여 셀카를 생성해보세요 (예: 타임스퀘어에서)',
        author: '@jiamimaodashu',
        href: 'https://github.com/JimmyLv/awesome-nano-banana#cases-54',
    },
    {
        id: 'f2-char-49',
        name: 'CASE 25: 패션 매거진 커버 스타일',
        description: '패션 매거진 커버 스타일의 고화질 인물 사진을 생성합니다.',
        prompt: `A beautiful woman wearing a modern, pink Hanbok, adorned with delicate floral accessories on her head and colorful blossoms woven into her hair. She wears an elegant Norigae (tassel) accessory. One of her hands gently holds several large butterflies. The overall photography style features high-definition detail and texture, resembling a fashion magazine cover. The word “FASHION DESIGN” is placed at the top center of the image. The background features the majestic and traditional architecture of Gyeongbokgung Palace, rendered with a soft focus to highlight the subject.`,
        imageUploads: 0,
        suggestionHint: '한복 색상이나 배경을 변경해보세요 (예: 파란색 한복, 경복궁 배경)',
        author: '@dotey',
        href: 'https://github.com/JimmyLv/awesome-nano-banana#cases-49',
    },
    {
        id: 'f2-char-45',
        name: 'CASE 26: 3D 꼬마 스타일 대학 마스코트',
        description: '대학의 특징을 살린 의인화된 3D 꼬마 스타일 애니메이션 소녀 캐릭터를 생성합니다.',
        prompt: `Create a personified 3D chibi-style anime girl character representing {KAIST}, embodying the school’s distinctive strengths in {science, technology, and engineering}.`,
        imageUploads: 0,
        suggestionHint: '다른 대학의 특징을 살린 캐릭터를 요청해보세요 (예: 예술 대학, 공과 대학)',
        author: '@dotey',
        href: 'https://github.com/JimmyLv/awesome-nano-banana#cases-45',
    },
    {
        id: 'f2-char-44',
        name: 'CASE 27: RPG 스타일 캐릭터 카드',
        description: '특정 직업을 주제로 한 RPG 수집용 카드 스타일의 디지털 캐릭터 카드를 만듭니다.',
        prompt: `Create a digital character card in RPG collectible style.
The subject is a {Programmer}, standing confidently with tools or symbols relevant to their job.
Render it in 3D cartoon style, soft lighting, vivid personality.
Include skill bars or stats like [Skill1 +x], [Skill2 +x, e.g., Creativity +10, UI/UX +8].
Add a title banner on top and a nameplate on the bottom.
Frame the card with clean edges like a real figure box.
Make the background fit the profession's theme.
Colors: warm highlights, profession-matching hues.`,
        imageUploads: 1,
        suggestionHint: '다른 직업의 캐릭터 카드를 만들어보세요 (예: 요리사, 소방관)',
        author: '@berryxia_ai',
        href: 'https://github.com/JimmyLv/awesome-nano-banana#cases-44',
    },
    {
        id: 'f2-char-43',
        name: 'CASE 28: 꼬마 한국 전통 인형',
        description: '인물 사진을 업로드하여 5개의 귀여운 꼬마 스타일 한국 전통 인형 세트로 변환합니다.',
        prompt: `Transform the person in the image into a set of five cute chibi-style Korean traditional dolls, arranged from largest to smallest. The dolls should be wearing colorful Hanbok. Place them on an elegant wooden table. Horizontal aspect ratio: 3:2.`,
        imageUploads: 1,
        suggestionHint: '한국 전통 인형의 디자인 스타일을 변경해보세요 (예: 다른 시대의 한복, 장신구 추가)',
        author: '@ZHO_ZHO_ZHO',
        href: 'https://github.com/JimmyLv/awesome-nano-banana#cases-43',
    },
    {
        id: 'f2-char-42',
        name: 'CASE 29: 3D 꼬마 커플 스노우 글로브',
        description: '커플 사진을 업로드하여 사랑스러운 꼬마 스타일 3D 캐릭터가 담긴 스노우 글로브 장면을 만듭니다.',
        prompt: `Transform the person in the attached image into a snow globe scene.
Overall environment: The snow globe is placed on a tabletop by the window, with a blurred, warm-toned background. Sunlight passes through the globe, casting golden sparkles that gently illuminate the surrounding darkness.
Inside the globe: The characters are in a cute chibi-style 3D design, gazing at each other with eyes full of love.`,
        imageUploads: 1,
        suggestionHint: '스노우 글로브 안의 계절이나 캐릭터 의상을 변경해보세요 (예: 겨울, 크리스마스 의상)',
        author: '@balconychy',
        href: 'https://github.com/JimmyLv/awesome-nano-banana#cases-42',
    },
    {
        id: 'f2-char-40',
        name: 'CASE 30: 한국식 웹툰',
        description: '인물 사진을 참조하여 "소녀 대통령의 일상"을 주제로 한 귀여운 한국 웹툰 스타일의 2컷 만화를 생성합니다.',
        prompt: `Create a two-panel vertical webtoon in a cute Korean webtoon style, theme: “The Daily Work Life of a Girl President.”

Character Design:
Transform the person in the uploaded image into a cute, webtoon-style girl while preserving all key details from the photo — including the outfit (a suit), hairstyle (bright golden-yellow), and facial features.

Panel 1:
- Expression: Pouting, disappointed, resting her cheek on one hand
- Text box: “What do I dooo?! He won’t take my call! (；´д｀)”
- Scene: Warm-toned office, with the U.S. flag in the background. On the desk: a pile of hamburgers and a vintage red rotary phone. The character is on the left side of the frame, the phone on the right.

Panel 2:
- Expression: Furious, face red with anger, gritting teeth
- Action: Slams the desk hard, making the hamburgers jump
- Speech bubble: “Hmph! Double the tariffs! Ignoring me is their loss! ( \`д´ )”
- Scene: Same office, now a complete mess

Additional Notes:
- Use a cute, casual handwritten font for all text
- Keep the composition full and expressive, with adequate space for dialogue and intentional white space
- Aspect ratio: 2:3
- The overall visual tone should be colorful and energetic, with a distinctly cartoony style`,
        imageUploads: 1,
        suggestionHint: '만화의 주제나 캐릭터의 감정을 변경해보세요 (예: 학교 생활, 기쁨)',
        author: '@hellokaton',
        href: 'https://github.com/JimmyLv/awesome-nano-banana#cases-40',
    },
    {
        id: 'f2-char-33',
        name: 'CASE 31: 가족 웨딩 사진 (꼬마 버전)',
        description: '가족 사진을 업로드하여 부모님은 웨딩 복장, 아이는 화동으로 변신한 꼬마 스타일 3D 캐릭터 사진을 생성합니다.',
        prompt: `Transform the people in the photo into chibi-style 3D characters. The parents are dressed in Western wedding attire — the father in a formal suit, the mother in a wedding gown. The child is a beautiful flower girl holding a bouquet.

The background features a colorful floral arch.
The characters are in 3D chibi style, while the environment is photorealistic.
The entire scene is placed inside a photo frame.`,
        imageUploads: 1,
        suggestionHint: '다른 가족 행사 컨셉을 시도해보세요 (예: 생일 파티, 졸업식)',
        author: '@balconychy',
        href: 'https://github.com/JimmyLv/awesome-nano-banana#cases-33',
    },
    {
        id: 'f2-char-31',
        name: 'CASE 32: 애니메이션 스티커 컬렉션',
        description: '캐릭터 이름을 입력하여 다양한 포즈의 스티커 세트를 생성합니다.',
        prompt: `Pororo stickers`,
        imageUploads: 0,
        suggestionHint: '다른 캐릭터나 이모티콘 스타일의 스티커를 요청해보세요 (예: 타요, 핑크퐁)',
        author: '@richardchang',
        href: 'https://github.com/JimmyLv/awesome-nano-banana#cases-31',
    },
    {
        id: 'f2-char-29',
        name: 'CASE 33: 명화 속 인물 OOTD',
        description: '명화 속 인물을 기반으로 특정 직업의 OOTD(오늘의 의상)를 입은 꼬마 캐릭터와 아이템들을 생성합니다.',
        prompt: `Generate a Q-style 3D C4D-rendered character based on the person in the photo, dressed in a fashion-forward “outfit of the day” (OOTD) inspired by a specific profession.
Profession: Fashion Designer
– Keep the original facial features and character pose
– Stylize the character with a cute, long-legged chibi proportion
– Outfit and accessories should reflect the profession, including trendy designer wear, glasses, sketchbook or tablet, and stylish shoes
– Match the outfit with fashion accessories to complete the look
– Use a solid background color that complements the character’s overall color palette (no gradients or textures)

Composition: Aspect ratio: 9:16
Top text: “OOTD”
Left side: the full-body chibi character wearing the complete outfit
Right side: individual clothing items and accessories laid out separately, as if in a style breakdown`,
        imageUploads: 1,
        suggestionHint: '다른 명화 속 인물이나 직업을 지정해보세요 (예: 모나리자, 의사)',
        author: '@ZHO_ZHO_ZHO',
        href: 'https://github.com/JimmyLv/awesome-nano-banana#cases-29',
    },
    {
        id: 'f2-char-28',
        name: 'CASE 34: 플랫 디자인 스티커',
        description: '인물 사진을 미니멀한 플랫 디자인의 꼬마 스타일 스티커 일러스트로 변환합니다.',
        prompt: `Turn this photo into a chibi-style sticker illustration in a minimalist flat design.
– Keep the character’s recognizable features
– Use a cute, simplified aesthetic
– The sticker should have a thick white border
– The character should break out of the circular frame, adding a playful touch
– The circular base should be a solid flat color (no 3D or gradients)
– Background should be transparent
The overall style should be clean, modern, and visually appealing for use as a fun Q-version sticker.`,
        imageUploads: 1,
        suggestionHint: '스티커의 배경 색상이나 모양을 변경해보세요 (예: 별 모양, 그라데이션 배경)',
        author: '@ZHO_ZHO_ZHO',
        href: 'https://github.com/JimmyLv/awesome-nano-banana#cases-28',
    },
    {
        id: 'f2-char-27',
        name: 'CASE 35: 꼬마 버전 이모티콘 스티커 팩',
        description: '인물 사진을 기반으로 6가지 독특한 포즈와 표정을 가진 꼬마 스타일 스티커 팩을 만듭니다.',
        prompt: `Create a brand-new set of chibi-style stickers featuring the user as the main character, with six unique poses:
  1.	Making a playful peace sign with both hands and winking.
  2.	Tearful eyes and slightly trembling lips, showing a cute crying expression.
  3.	Arms wide open in a warm, enthusiastic hug pose.
  4.	Lying on their side asleep, resting on a tiny pillow with a sweet smile.
  5.	Pointing forward with confidence, surrounded by shining visual effects.
  6.	Blowing a kiss, with heart symbols floating around.
Maintain the chibi aesthetic:
– Exaggerated, expressive big eyes
– Soft facial lines
– Playful, short black hairstyle
– A white outfit with a bold neckline design
Background: Vibrant red with star or colorful confetti elements for decoration. Leave some clean white space around each sticker.
Aspect ratio: 9:16`,
        imageUploads: 1,
        suggestionHint: '다른 표정이나 포즈의 스티커를 요청하세요 (예: 화난 표정, 춤추는 포즈)',
        author: '@dotey',
        href: 'https://github.com/JimmyLv/awesome-nano-banana#cases-27',
    },
    {
        id: 'f2-char-26',
        name: 'CASE 36: 명화 인물 시리얼 광고',
        description: '명화 속 인물을 마스코트로 한 맞춤형 시리얼과 포장 디자인 광고 커버를 생성합니다.',
        prompt: `“Master Oats”: Based on the visual features of the person in the uploaded photo, generate a custom oatmeal mix that reflects their personality traits — for example, using vegetables, fruits, yogurt, whole grains, etc.

Design a unique cereal box and package aesthetic that aligns with this tailored mix.

Then, create an advertising cover featuring the person as the mascot on the cereal box. The character should retain their recognizable features but be transformed into a cute chibi-style 3D figure with a C4D-quality rendering.

The oatmeal and packaging should be presented in a setting that matches the mood — such as a minimalist kitchen, a sleek supermarket display, or a clean design counter.

The process includes:
– Character analysis and oat mix pairing
– Cereal box concept and design
– Display environment selection
– Final image with mascot figure, packaging, and styled scene composition

All visuals should be balanced, modern, and appealing, reflecting a premium and fun oat brand identity.`,
        imageUploads: 1,
        suggestionHint: '다른 명화나 다른 종류의 제품 광고를 만들어보세요 (예: 별이 빛나는 밤, 음료수 광고)',
        author: '@ZHO_ZHO_ZHO',
        href: 'https://github.com/JimmyLv/awesome-nano-banana#cases-26',
    },
    {
        id: 'f2-char-24',
        name: 'CASE 37: Funko Pop 피규어 제작',
        description: '인물 사진을 Funko Pop 스타일 피규어와 포장 상자로 변환합니다.',
        prompt: `Transform the person in the photo into the style of a Funko Pop figure box, presented in isometric view.
The packaging is labeled with the title “JAMES BOND.”
Inside the box, display a chibi-style figure based on the person in the photo, along with their essential accessories: a pistol, a wristwatch, a suit, and other signature items.
Next to the box, show a realistic rendering of the actual figure itself outside the packaging, with detailed textures and lighting to achieve a lifelike product display.`,
        imageUploads: 1,
        suggestionHint: '다른 캐릭터로 Funko Pop 피규어를 만들어보세요 (예: 아이언맨, 해리포터)',
        author: '@dotey',
        href: 'https://github.com/JimmyLv/awesome-nano-banana#cases-24',
    },
    {
        id: 'f2-char-23',
        name: 'CASE 38: "타이타닉" 포즈 패러디',
        description: '커플 사진을 업로드하여 영화 "타이타닉"의 상징적인 포즈를 취하는 꼬마 스타일 3D 캐릭터로 변환합니다.',
        prompt: `Transform the person in the attached image into a cute chibi-style 3D character.
Scene: On the pointed bow of a luxurious cruise ship.
The man stands behind the woman at the bow, holding her waist with both hands. The woman is wearing a dress, arms spread wide, facing the wind, with a joyful and liberated expression on her face—just like the iconic scene from Titanic.
The sky is painted in warm sunset tones, and the vast ocean stretches beneath the ship.
Only the characters should be in chibi 3D style; the rest of the environment should be realistic.`,
        imageUploads: 1,
        suggestionHint: '다른 영화의 명장면을 패러디해보세요 (예: 라이온 킹, 매트릭스)',
        author: '@balconychy',
        href: 'https://github.com/JimmyLv/awesome-nano-banana#cases-23',
    },
    {
        id: 'f2-char-21',
        name: 'CASE 39: 꼬마 캐릭터 스티커 팩',
        description: '캐릭터 사진을 기반으로 다양한 감정을 표현하는 9개의 꼬마 캐릭터 스티커 팩을 생성합니다.',
        prompt: `Please create a set of 9 Chibi stickers featuring [the character in the reference image], arranged in a 3x3 grid.
Design requirements:
- Transparent background.
- 1:1 square aspect ratio.
- Consistent Chibi Ghibli cartoon style with vibrant colors.
- Each sticker must have a unique action, expression, and theme, reflecting diverse emotions like "sassy, mischievous, cute, frantic" (e.g., rolling eyes, laughing hysterically on the floor, soul leaving body, petrified, throwing money, foodie mode, social anxiety attack). Incorporate elements related to office workers and internet memes.
- Each character depiction must be complete, with no missing parts.
- Each sticker must have a uniform white outline, giving it a sticker-like appearance.
- No extraneous or detached elements in the image.
- Strictly no text, or ensure any text is 100% accurate (no text preferred).`,
        imageUploads: 1,
        suggestionHint: '스티커 팩의 테마나 스타일을 변경해보세요 (예: 동물 테마, 수채화 스타일)',
        author: '@leon_yuan2001',
        href: 'https://github.com/JimmyLv/awesome-nano-banana#cases-21',
    },
    {
        id: 'f2-char-20',
        name: 'CASE 40: 액션 피규어와 실물 인물 동시 프레임',
        description: '특정 인물의 액션 피규어와 실제 인물이 같은 프레임 안에서 비슷한 포즈를 취하는 재미있는 장면을 연출합니다.',
        prompt: `In a casual, everyday style as if shot on a mobile phone, an anime figure of [Jackie Chan] is placed on a desk, striking an exaggerated and cool pose, fully equipped. Simultaneously, the corresponding real-life person also appears in the frame, striking a similar pose to the figure, creating an interesting visual contrast with the figure and the real person in the same frame. The overall composition is harmonious and natural, delivering a warm and vibrant, true-to-life visual experience.`,
        imageUploads: 0,
        suggestionHint: '다른 인물이나 다른 포즈로 장면을 연출해보세요 (예: 이소룡, 쿵푸 포즈)',
        author: '@dotey',
        href: 'https://github.com/JimmyLv/awesome-nano-banana#cases-20',
    },
    {
        id: 'f2-char-14',
        name: 'CASE 41: 애니메이션 테마 피규어 제작',
        description: '인물 사진을 K-웹툰 테마의 애니메이션 스타일 액션 피규어와 수집용 상자로 변환합니다.',
        prompt: `Transform the person in the photo into a K-webtoon-themed anime-style action figure, presented inside a collectible figure box designed in the visual style of a popular fantasy webtoon. The box is shown in an isometric view.
Inside the box, display the character reimagined in the webtoon art style, posed dynamically and accompanied by essential everyday items such as a pistol, a wristwatch, a suit, and leather shoes — all miniaturized and arranged like collectible accessories.
Next to the box, include a realistic, fully rendered version of the actual figure itself, outside of the packaging. This figure should be rendered with high detail and realism, showcasing the material textures and craftsmanship, as if it were a professionally photographed product.`,
        imageUploads: 1,
        suggestionHint: '다른 웹툰 테마의 피규어를 만들어보세요 (예: 액션, 로맨스)',
        author: '@dotey',
        href: 'https://github.com/JimmyLv/awesome-nano-banana#cases-14',
    },
    {
        id: 'f2-char-13',
        name: 'CASE 42: 사진을 3D 꼬마 스타일로',
        description: '사진 속 인물들을 3D 꼬마 스타일 피규어로 변환하되, 원래의 장면 구성과 의상은 그대로 유지합니다.',
        prompt: `Transform the characters in the scene into 3D chibi-style figures, while keeping the original scene layout and their clothing exactly the same.`,
        imageUploads: 1,
        suggestionHint: '캐릭터를 다른 스타일로 변경해보세요 (예: 레고 스타일, 클레이 아트)',
        author: '@dotey',
        href: 'https://github.com/JimmyLv/awesome-nano-banana#cases-13',
    },
    {
        id: 'f2-char-12',
        name: 'CASE 43: 3D 커플 보석함 피규어',
        description: '커플 사진을 바탕으로 로맨틱한 보석함 안에 담긴 정교하고 사랑스러운 3D 꼬마 피규어를 생성합니다.',
        prompt: `Create a finely crafted, adorably charming 3D-rendered collectible figure based on the subjects in the photo, displayed inside a pastel-toned, warm and romantic presentation box. The box is designed in a soft cream color with gentle gold accents, resembling an elegant portable jewelry case.

When opened, the box reveals a heartwarming romantic scene: two chibi-style characters gazing sweetly at each other. The lid is engraved with the words “FOREVER TOGETHER,” surrounded by delicate star and heart motifs.

Inside the box stands the female from the photo, holding a small bouquet of white flowers. Beside her is her partner, the male from the photo. Both characters have large, expressive, sparkling eyes and soft, warm smiles that radiate affection and charm.

Behind them is a round window, through which a sunny skyline of a Korean traditional Hanok village can be seen, along with gently drifting clouds. The interior is softly lit with warm ambient lighting, and petals float in the background to enhance the atmosphere.

The overall color scheme of both the display box and the characters is elegant and harmonious, creating a luxurious and dreamlike miniature keepsake.

Aspect ratio: 9:16`,
        imageUploads: 1,
        suggestionHint: '보석함의 디자인이나 내부 배경을 변경해보세요 (예: 하트 모양, 밤하늘 배경)',
        author: '@dotey',
        href: 'https://github.com/JimmyLv/awesome-nano-banana#cases-12',
    },
    {
        id: 'f2-char-8',
        name: 'CASE 44: 레고 수집용 피규어',
        description: '자신과 어울리는 동물이 함께 있는 레고 미니피규어 장면을 생성합니다.',
        prompt: `Generate a vertically-oriented image based on my uploaded photo, using the following prompt:
Classic LEGO minifigure style in a miniature scene — an animal stands beside me. The color palette of the animal should match mine.
Please design the animal based on your understanding of me. You may choose any creature — real, surreal, or fantastical — that you feel best reflects my personality.
The entire scene is set within a transparent glass cube, with a minimalist interior design.
The base of the miniature is matte black with silver accents, following a clean and modern aesthetic.
On the base, there is an elegantly engraved nameplate in a refined serif font, displaying the name of the animal.
The lower part of the base subtly incorporates finely etched biological classification details, similar to a natural history museum display.
The overall composition should resemble a high-end collectible artwork: meticulously crafted, curated in style, and lit with refined lighting.
Balance is key to the layout. The background should feature a smooth gradient transition from dark to light tones, selected to match the dominant color theme.`,
        imageUploads: 1,
        suggestionHint: '다른 동물이나 다른 스타일의 미니피규어를 요청해보세요 (예: 용, 사이버펑크 스타일)',
        author: '@ZHO_ZHO_ZHO',
        href: 'https://github.com/JimmyLv/awesome-nano-banana#cases-8',
    },
    {
        id: 'f2-char-6',
        name: 'CASE 45: 포털을 통과하는 캐릭터',
        description: '사진 속 인물이 3D 꼬마 캐릭터가 되어 빛나는 포털을 통해 현실 세계로 나와 손을 잡아주는 장면을 연출합니다.',
        prompt: `A 3D chibi-style version of the person in the photo is stepping through a glowing portal, reaching out and holding the viewer’s hand. As the character pulls the viewer forward, they turn back with a dynamic glance, inviting the viewer into their world.
Behind the portal is the viewer’s real-life environment: a typical programmer’s study with a desk, monitor, and laptop, rendered in realistic detail. Inside the portal lies the character’s 3D chibi world, inspired by the photo, with a cool blue color scheme that sharply contrasts with the real-world surroundings.
The portal itself is a perfectly elliptical frame glowing with mysterious blue and purple light, positioned at the center of the image as a gateway between the two worlds.
The scene is captured from a third-person perspective, clearly showing the viewer’s hand being pulled into the character’s world. Use a 2:3 aspect ratio.`,
        imageUploads: 1,
        suggestionHint: '포털 너머의 세계를 다른 컨셉으로 변경해보세요 (예: 미래 도시, 수중 세계)',
        author: '@dotey',
        href: 'https://github.com/JimmyLv/awesome-nano-banana#cases-6',
    },
    {
        id: 'f2-char-4',
        name: 'CASE 46: 3D 꼬마 한국 전통 혼례',
        description: '커플 사진을 한국 전통 혼례복을 입은 꼬마 스타일 3D 카툰 캐릭터로 변환합니다.',
        prompt: `Transform the two people in the photo into chibi-style 3D cartoon characters, dressed in traditional Korean wedding attire (Hanbok). The overall theme is a festive Korean-style wedding. The background features a decorative Korean folding screen (Byeongpung) with traditional paintings. 
Clothing (realistic texture, traditional details):
Male: Wearing a groom's Gwanbok (official's robe) with a belt and boots. A ceremonial wooden goose (Kireogi) could be held or placed nearby.
Female: Dressed in a Hwarot or Wonsam, a lavishly embroidered bridal topcoat over a Hanbok skirt (Chima), showcasing elegance and luxury. She wears delicate hairpins (Binyeo) in her styled hair.
Headwear:
Male: A Samo, a black silk hat worn by officials.
Female: A Jokduri, a small, elaborate ceremonial cap, or a Hwagwan, a more ornate floral coronet.
This image should reflect the joy and blessing of a traditional Korean wedding, with realistic textures for costumes and accessories, combined with stylized 3D chibi characters.`,
        imageUploads: 1,
        suggestionHint: '다른 시대의 한국 전통 혼례복을 시도해보세요 (예: 고려 시대, 신라 시대)',
        author: '@balconychy',
        href: 'https://github.com/JimmyLv/awesome-nano-banana#cases-4',
    },
    {
        id: 'f2-char-1',
        name: 'CASE 47: 3D 꼬마 프로포즈 장면',
        description: '커플 사진을 꼬마 스타일 3D 카툰 캐릭터로 변환하고, 로맨틱한 프로포즈 장면으로 배경을 변경합니다.',
        prompt: `Transform the two people in the photo into chibi-style 3D cartoon characters. Change the scene to a proposal setting, with a soft pastel-colored floral arch in the background. Use romantic tones for the overall background. Rose petals are scattered on the ground. While the characters are rendered in cute chibi 3D style, the environment—including the arch, lighting, and textures—should be realistic and photorealistic.`,
        imageUploads: 1,
        suggestionHint: '프로포즈 장소를 다른 곳으로 변경해보세요 (예: 해변, 레스토랑)',
        author: '@balconychy',
        href: 'https://github.com/JimmyLv/awesome-nano-banana#cases-1',
    },
     {
        id: 'f1-char-48',
        name: 'CASE 48: 액션 피규어',
        description: '자신의 사진을 업로드하고 원하는 아이템을 지정하여 커스텀 액션 피규어를 만듭니다. 대괄호 안의 내용을 수정하세요.',
        prompt: 'make an action figure of me that says [“AI Evangelist - Kris”] and features [coffee, turtle, laptop, phone and headphones]',
        imageUploads: 1,
        suggestionHint: '액션 피규어에 포함될 다른 아이템을 지정하세요 (예: 검, 방패, 마법 지팡이)',
        author: '@icreatelife',
        href: 'https://github.com/PicoTrex/Awesome-Nano-Banana-images/blob/main/README_en.md#case-32-action-figureby-icreatelife',
    },
  ],
};
