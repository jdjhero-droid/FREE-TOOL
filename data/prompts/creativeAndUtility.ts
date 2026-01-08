import type { Category } from '../../types';

export const creativeAndUtility: Category = {
  name: '창의적인 활용',
  cases: [
    {
      id: 'f1-creative-3',
      name: 'CASE 143: 실세계 AR 정보',
      description: '참고 이미지를 업로드하고 관심 지점을 지정하여 해당 위치에 대한 관련 정보를 증강 현실(AR)처럼 표시합니다.',
      prompt: 'you are a location-based AR experience generator. highlight [point of interest] in this image and annotate relevant information about it.',
      imageUploads: 1,
      suggestionHint: 'AR 정보의 스타일을 변경해보세요 (예: 미래적인 UI, 손글씨 스타일).',
      author: '@bilawalsidhu',
      href: 'https://github.com/PicoTrex/Awesome-Nano-Banana-images/blob/main/README_en.md#case-3-real-world-ar-informationby-bilawalsidhu',
    },
    {
      id: 'f1-creative-14',
      name: 'CASE 144: 기사 인포그래픽',
      description: '긴 기사나 블로그 글의 핵심 내용을 추출하여 시각적으로 매력적인 인포그래픽을 생성합니다. 이미지 업로드가 필요 없습니다.',
      prompt: `Generate an infographic for the article content
Requirements:
1. Translate the content into English and extract key information from the article
2. Keep the content in the image concise, only retaining the main title
3. Use English text in the image
4. Add rich and cute cartoon characters and elements`,
      imageUploads: 0,
      suggestionHint: '인포그래픽의 디자인 스타일이나 색상 테마를 지정해보세요 (예: 미니멀리즘, 파스텔 톤).',
      author: '@黄建同学',
      href: 'https://github.com/PicoTrex/Awesome-Nano-Banana-images/blob/main/README_en.md#case-14-article-infographicby-%E9%BB%84%E5%BB%BA%E5%90%8C%E5%AD%A6',
    },
    {
      id: 'f1-creative-16',
      name: 'CASE 145: 모델 주석 설명 다이어그램',
      description: '학술 발표에 적합한 3D 인체 장기 모델과 같은 주제에 대한 주석과 설명이 포함된 다이어그램을 그립니다.',
      prompt: 'Draw [3D human organ model display example heart] for academic presentation, with annotations and explanations, suitable for showcasing its principles and [each organ\'s] functions, very realistic, highly detailed, with extremely fine design.',
      imageUploads: 0,
      suggestionHint: '다이어그램의 스타일을 변경해보세요 (예: 손그림 스타일, 청사진 스타일).',
      author: '@berryxia_ai',
      href: 'https://github.com/PicoTrex/Awesome-Nano-Banana-images/blob/main/README_en.md#case-16-model-annotation-explanation-diagramby-berryxia_ai',
    },
    {
      id: 'f1-creative-19',
      name: 'CASE 146: 수학 문제 추론',
      description: '수학 문제가 포함된 이미지를 업로드하여 문제에 대한 답을 해당 위치에 작성합니다.',
      prompt: 'Write the answer to the problem in the corresponding position based on the question',
      imageUploads: 1,
      suggestionHint: '답뿐만 아니라 풀이 과정도 함께 작성하도록 요청하세요.',
      author: '@Gorden Sun',
      href: 'https://github.com/PicoTrex/Awesome-Nano-Banana-images/blob/main/README_en.md#case-19-math-problem-reasoningby-gorden-sun',
    },
    {
      id: 'f1-creative-24',
      name: 'CASE 147: 영화 스토리보드',
      description: '두 캐릭터가 등장하는 12개의 이미지로 구성된 흑백 필름 누아르 탐정 이야기 스토리보드를 만듭니다.',
      prompt: 'Create an addictively intriguing 12 part story with 12 images with these two characters in a classic black and white film noir detective story. Make it about missing treasure that they get clues for throughout and then finally discover. The story is thrilling throughout with emotional highs and lows and ending on a great twist and high note. Do not include any words or text on the images but tell the story purely through the imagery itself.',
      imageUploads: 1,
      suggestionHint: '스토리보드의 장르나 그림 스타일을 변경해보세요 (예: SF, 컬러 웹툰 스타일).',
      author: '@GeminiApp',
      href: 'https://github.com/PicoTrex/Awesome-Nano-Banana-images/blob/main/README_en.md#case-24-movie-storyboardby-geminiapp',
    },
    {
      id: 'f1-creative-27',
      name: 'CASE 148: 이미지에 워터마크 추가',
      description: '이미지 전체에 특정 단어를 반복하여 워터마크를 추가합니다.',
      prompt: 'Watermark the word ‘TRUMP’ over and over again across the whole image.',
      imageUploads: 1,
      suggestionHint: '워터마크의 글꼴, 색상, 투명도를 변경하도록 요청하세요.',
      author: '@AiMachete',
      href: 'https://github.com/PicoTrex/Awesome-Nano-Banana-images/blob/main/README_en.md#case-27-add-watermark-to-imageby-aimachete',
    },
    {
      id: 'f1-creative-28',
      name: 'CASE 149: 지식 추론 이미지 생성',
      description: '특정 주제에 대한 정보를 바탕으로 다채로운 인포그래픽을 생성합니다. (예: 세계에서 가장 단 음식)',
      prompt: 'Make a colorful infographic of the sweetest things on Earth',
      imageUploads: 0,
      suggestionHint: '인포그래픽의 스타일이나 레이아웃을 지정해보세요 (예: 타임라인, 비교 차트).',
      author: '@icreatelife',
      href: 'https://github.com/PicoTrex/Awesome-Nano-Banana-images/blob/main/README_en.md#case-28-knowledge-reasoning-image-generationby-icreatelife',
    },
    {
      id: 'f1-creative-29',
      name: 'CASE 150: 빨간 펜 주석',
      description: '이미지를 분석하고 개선할 수 있는 부분을 빨간 펜으로 표시하도록 요청합니다.',
      prompt: 'Analyze this image. Use red pen to denote where you can improve.',
      imageUploads: 1,
      suggestionHint: '특정 관점에서 분석하도록 요청하세요 (예: 디자인 구도, 색상 조화).',
      author: '@AiMachete',
      href: 'https://github.com/PicoTrex/Awesome-Nano-Banana-images/blob/main/README_en.md#case-29-red-pen-annotationsby-aimachete',
    },
    {
      id: 'f1-creative-31',
      name: 'CASE 151: 만화책 제작',
      description: '업로드한 이미지를 기반으로 슈퍼히어로 만화책 스트립을 만들고, 설득력 있는 이야기를 추가합니다.',
      prompt: 'Based on the uploaded image, make a comic book strip, add text, write a compelling story. I want a superhero comic book.',
      imageUploads: 1,
      suggestionHint: '만화의 장르나 그림 스타일을 변경해보세요 (예: 로맨스, 일상툰).',
      author: '@icreatelife',
      href: 'https://github.com/PicoTrex/Awesome-Nano-Banana-images/blob/main/README_en.md#case-31-create-comic-bookby-icreatelife',
    },
    {
      id: 'f1-creative-37',
      name: 'CASE 152: 메이크업 분석',
      description: '인물 사진을 분석하여 개선할 수 있는 부분을 빨간 펜으로 표시하도록 요청합니다.',
      prompt: 'Analyze this image. Use a red pen to mark areas that can be improved',
      imageUploads: 1,
      suggestionHint: '특정 메이크업 스타일에 맞춰 분석하도록 요청하세요 (예: 데일리, 파티 메이크업).',
      author: '@ZHO_ZHO_ZHO',
      href: 'https://github.com/PicoTrex/Awesome-Nano-Banana-images/blob/main/README_en.md#case-37-makeup-analysisby-zho_zho_zho',
    },
    {
      id: 'f1-creative-39',
      name: 'CASE 153: 타이포그래피 일러스트 생성',
      description: '특정 문구의 글자만을 사용하여 미니멀한 흑백 타이포그래피 일러스트를 만듭니다.',
      prompt: `Create a minimalist black-and-white typographic illustration of the scene riding a bicycle using only the letters in the phrase ['riding a bicycle'] . Each letter should be creatively shaped or positioned to form the rider, the bicycle, and a sense of motion. The design should be clean, ultra-minimalist, and entirely composed of the modified ['riding a bicycle'] letters without adding any extra shapes or lines. The letters should flow or curve to mimic the natural form of the scene, while still remaining legible.`,
      imageUploads: 0,
      suggestionHint: '일러스트를 컬러로 변경하거나 다른 문구를 사용해보세요.',
      author: '@Umesh',
      href: 'https://github.com/PicoTrex/Awesome-Nano-Banana-images/blob/main/README_en.md#case-39-typographic-illustration-generationby-umesh',
    },
    {
      id: 'f1-creative-52',
      name: 'CASE 154: 패션 무드보드 콜라주',
      description: '인물 사진 주위에 모델이 착용한 개별 아이템 컷아웃, 손글씨 메모, 스케치를 추가하여 창의적인 패션 무드보드 콜라주를 만듭니다.',
      prompt: 'A fashion mood board collage. Surround a portrait with cutouts of the individual items the model is wearing. Add handwritten notes and sketches in a playful, marker-style font, and include the brand name and source of each item in English. The overall aesthetic should be creative and cute.',
      imageUploads: 1,
      suggestionHint: '무드보드의 테마나 스타일을 변경해보세요 (예: 여행, 빈티지 스타일).',
      author: '@tetumemo',
      href: 'https://github.com/PicoTrex/Awesome-Nano-Banana-images/blob/main/README_en.md#case-52-fashion-moodboard-collageby-tetumemo',
    },
    {
        id: 'f2-creative-100',
        name: 'CASE 155: 실물과 손그림 광고',
        description: '실제 사물과 손으로 그린 두들이 결합된 미니멀하고 창의적인 광고를 생성합니다. 대괄호 안의 내용을 수정하세요.',
        prompt: `A minimalist and creative advertisement set on a clean white background.
A real [Real Object] is integrated into a hand-drawn black ink doodle, using loose, playful lines. The [Doodle Concept] interacts with the object in a clever, imaginative way. Include bold black [Ad Copy] text at the top or center. Place the [Brand Logo] clearly at the bottom. The visual should be clean, fun, high-contrast, and conceptually smart.
For example: [Real Object]: coffee bean, [Doodle Concept]: The giant coffee bean becomes a space planet..., [Ad Copy]: "Explore Bold Flavor", [Brand Logo]: Starbucks logo`,
        imageUploads: 0,
        suggestionHint: '실물과 두들의 조합을 다른 컨셉으로 시도해보세요.',
        author: '@azed_ai',
        href: 'https://github.com/JimmyLv/awesome-nano-banana#cases-100',
    },
    {
        id: 'f2-creative-87',
        name: 'CASE 156: 단어 의미를 글자에 통합',
        description: '단어의 의미를 글자 자체에 창의적으로 통합하여 그래픽과 문자를 결합한 이미지를 생성합니다.',
        prompt: `Integrate the meaning of the word into the letters, cleverly blending graphics and letters.
Word: {beautify}
Add a brief explanation of the word below.`,
        imageUploads: 0,
        suggestionHint: '다른 단어를 사용하여 그래픽 문자를 만들어보세요.',
        author: '@dotey',
        href: 'https://github.com/JimmyLv/awesome-nano-banana#cases-87',
    },
    {
        id: 'f2-creative-82',
        name: 'CASE 157: 도시별 날씨 예보',
        description: '특정 도시의 상징적인 건물과 날씨를 결합한 아이소메트릭 미니어처 장면을 생성합니다.',
        prompt: `Show a clear 45-degree bird’s-eye view of an isometric miniature city scene featuring Seoul’s iconic buildings, such as the N Seoul Tower and Gyeongbok Palace. The weather effect—cloudy—blends softly into the city, interacting gently with the architecture. Use physically based rendering (PBR) and realistic lighting. Solid color background, crisp and clean. Centered composition to highlight the precision and detail of the 3D model. Display “Seoul Cloudy 20°C” and a cloudy weather icon at the top of the image.`,
        imageUploads: 0,
        suggestionHint: '다른 도시와 다른 날씨를 조합하여 예보 이미지를 만들어보세요.',
        author: '@dotey',
        href: 'https://github.com/JimmyLv/awesome-nano-banana#cases-82',
    },
    {
        id: 'f2-creative-80',
        name: 'CASE 158: 코드 스타일 명함',
        description: 'JSON 파일 형식의 코드가 적힌 VS Code 인터페이스처럼 디자인된 명함 이미지를 생성합니다.',
        prompt: `A close-up shot of a hand holding a business card designed to look like a JSON file opened in VS Code. The card shows code formatted in realistic syntax-highlighted JSON code. The window includes typical toolbar icons and a title bar labeled Business Card.json, styled exactly like the interface of VS Code. Background is slightly blurred, keeping the focus on the card.
The card displays the following code formatted in JSON:
{
  "name": "Jamez Bondos",
  "title": "Your Title",
  "email": "your@email.com",
  "link": "yourwebsite"
}`,
        imageUploads: 0,
        suggestionHint: '다른 프로그래밍 언어나 다른 테마의 명함을 요청해보세요.',
        author: '@umesh_ai',
        href: 'https://github.com/JimmyLv/awesome-nano-banana#cases-80',
    },
    {
        id: 'f2-creative-76',
        name: 'CASE 159: 향수를 불러일으키는 애니메이션 영화 포스터',
        description: '오랜 시간 접혀서 생긴 주름과 손상이 있는 특정 영화의 향수를 불러일으키는 애니메이션 포스터를 생성합니다.',
        prompt: `{The Lord of the Rings} anime film poster, the anime is in the style of a popular Korean action webtoon. Visible even folds are seen across the poster as it’s been folded over time, and due to some creases over damaging the poster has caused some physical damage scuffing along the creases and the color has partially faded. Indiscriminate flaps and folds and scratches all around simply from moving back and forth causing subtle yet incremental damage with the ever expanding of entropy we cannot escape, but the loving memories in our hearts will forever be whole. Making the objects we collect along the way priceless is the essence you feel when looking at this nostalgic poster.`,
        imageUploads: 0,
        suggestionHint: '다른 영화나 다른 애니메이션 스타일로 포스터를 만들어보세요.',
        author: 'photis (Sora)',
        href: 'https://github.com/JimmyLv/awesome-nano-banana#cases-76',
    },
    {
        id: 'f2-creative-75',
        name: 'CASE 160: 소셜 미디어 프레임 통합',
        description: '업로드한 사진을 기반으로 3D 꼬마 캐릭터를 만들고, 인스타그램 프레임과 상호작용하는 장면을 연출합니다.',
        prompt: `Create a stylized 3D chibi character based on the attached photo, accurately preserving the subject’s facial features and clothing details. The character is making a finger heart with the left hand (with a red heart element above the fingers) and playfully sitting on the edge of a giant Instagram frame, with both legs hanging outside the frame. The top of the frame displays the username “Beauty,” and various social media icons (like, comment, share) float around the scene.`,
        imageUploads: 1,
        suggestionHint: '다른 소셜 미디어 프레임과 상호작용하는 장면을 요청해보세요 (예: 틱톡, 유튜브).',
        author: '@dotey',
        href: 'https://github.com/JimmyLv/awesome-nano-banana#cases-75',
    },
    {
        id: 'f2-creative-61',
        name: 'CASE 161: 가짜 트윗 스크린샷',
        description: '유명인이 특정 상황에 대해 트윗을 올린 것처럼 보이는 초현실적인 가짜 트윗 스크린샷을 생성합니다.',
        prompt: `a hyper realistic twitter post by Albert Einstein right after finishing the theory of relativity. include a selfie where you can clearly see scribbled equations and a chalkboard in the background. have it visible that the post was liked by Nikola Tesla`,
        imageUploads: 0,
        suggestionHint: '다른 유명인과 다른 상황으로 가짜 트윗을 만들어보세요.',
        author: '@egeberkina',
        href: 'https://github.com/JimmyLv/awesome-nano-banana#cases-61',
    },
    {
        id: 'f2-creative-59',
        name: 'CASE 162: 다채로운 벡터 아트 포스터',
        description: '특정 도시를 주제로 한 다채로운 여름 벡터 아트 포스터를 생성합니다.',
        prompt: `Seoul Korea colourful summer vector art poster with big "SEOUL" title at the top and smaller "KOREA" title under`,
        imageUploads: 0,
        suggestionHint: '다른 도시나 다른 계절을 테마로 포스터를 만들어보세요.',
        author: '@michaelrabone',
        href: 'https://github.com/JimmyLv/awesome-nano-banana#cases-59',
    },
    {
        id: 'f2-creative-51',
        name: 'CASE 163: 여권 입국 도장',
        description: '특정 도시와 랜드마크가 포함된 사실적인 여권 입국 도장을 생성합니다.',
        prompt: `Create a realistic passport page with an entry stamp for [{City}, {Country}]. The stamp should say "Welcome to {City}" in bold English, designed in a round or oval shape with decorative borders. Include the word "ARRIVAL" and a fictional date like "15 APR 2025" Incorporate a subtle silhouette of {Main Landmark} as a background detail within the stamp. Use deep blue or red ink with light smudges for added realism. The stamp should appear slightly angled, as if hand-pressed. The passport page should show visible paper texture and security patterns.`,
        imageUploads: 0,
        suggestionHint: '가상의 국가나 행성의 입국 도장을 만들어보세요.',
        author: '@M_w14_',
        href: 'https://github.com/JimmyLv/awesome-nano-banana#cases-51',
    },
    {
        id: 'f2-creative-38',
        name: 'CASE 164: 손으로 그린 인포그래픽 카드',
        description: '특정 메시지를 담은 손글씨와 그림이 포함된 따뜻한 느낌의 인포그래픽 카드를 생성합니다.',
        prompt: `Create a hand-drawn style infographic card in a 9:16 vertical format. The card should have a clear theme, with a beige or off-white paper-textured background. The overall design should reflect a simple, warm, and handmade aesthetic.

At the top of the card, use large, eye-catching brush-style Korean calligraphy (Seoye) in red and black for the title, creating strong visual contrast. All text should be in Korean script (Hangeul). The layout should be divided into 2 to 4 clear sections, each conveying a core idea through concise and refined Korean phrases. The calligraphy should maintain a fluid, rhythmic style that is both legible and artistically expressive. Leave appropriate blank space around the text.

The card should be accented with simple and fun hand-drawn illustrations or icons — such as figures or symbolic elements — to enhance visual appeal and spark thought or emotional resonance. The overall layout should emphasize visual balance and include ample whitespace, ensuring the design is clean, clear, and easy to read.

“개인 브랜딩(IP)은 장기적인 복리입니다.
매일 꾸준히 업데이트하면 결과는 따라옵니다 — 99%의 사람들은 꾸준히 하지 못하기 때문입니다!”`,
        imageUploads: 0,
        suggestionHint: '카드의 메시지나 디자인 스타일을 변경해보세요.',
        author: '@dotey',
        href: 'https://github.com/JimmyLv/awesome-nano-banana#cases-38',
    },
    {
        id: 'f2-creative-34',
        name: 'CASE 165: 손으로 그린 인포그래픽 카드 (인식)',
        description: '인식과 인간관계에 대한 통찰력 있는 메시지를 담은 손글씨 인포그래픽 카드를 생성합니다.',
        prompt: `Create a hand-drawn style infographic card in vertical 9:16 ratio. The card should have a clear theme, with a beige or off-white paper-textured background. The overall design should convey a rustic, friendly, and handmade aesthetic.

At the top of the card, feature a bold, eye-catching title in large Korean brush calligraphy (Seoye) using contrasting red and black colors. All text content should be in Korean script (Hangeul), and the layout should be divided into 2 to 4 clear sections. Each section expresses a core idea with brief and concise Korean phrases. The cursive font should retain a smooth, rhythmic flow, remaining legible while carrying artistic appeal.

The card should include simple, playful hand-drawn illustrations or icons, such as figures or symbolic elements, to enhance visual interest and spark reader reflection or emotional resonance.

The overall layout should maintain visual balance, with ample white space reserved to ensure clarity, simplicity, and ease of reading and understanding.
<h1><span style="color:red">“인식”</span>이 당신의 한계를 결정하고
<span style="color:red">“인맥”</span>이 당신의 기회를 결정합니다</h1>
– 당신은 당신의 인식 수준을 넘어서는 돈을 벌 수 없으며,
– 당신의 인맥을 넘어서는 기회를 만날 수 없습니다.`,
        imageUploads: 0,
        suggestionHint: '카드의 메시지나 디자인 스타일을 변경해보세요.',
        author: '@dotey',
        href: 'https://github.com/JimmyLv/awesome-nano-banana#cases-34',
    },
    {
        id: 'f2-creative-22',
        name: 'CASE 166: 인스타그램 포스트 커버 이미지',
        description: '사용자의 클릭을 유도할 수 있는 매력적인 인스타그램 포스트 커버 이미지를 디자인합니다.',
        prompt: `Draw an image: Create a cover for an Instagram post.

Requirements:
– It must be visually compelling enough to attract user clicks.
– Use bold, characterful fonts.
– Vary font sizes to reflect the hierarchy of information; emphasize the structure of the copy.
– The main title should be at least twice the size of regular text.
– Leave white space between text sections.
– Only use bright accent colors to highlight key words and draw attention.
– The background should feature an eye-catching pattern (such as paper texture, notebook, or a KakaoTalk chat window—choose one).
– Add appropriate icons or illustrations to enhance visual layers, but avoid visual clutter.

Copy text:
BREAKING: ChatGPT just got even better!
– Superior multitasking ✨
– Stronger coding ability 💪
– Creativity off the charts 🎨
Try it now!

Image aspect ratio: 9:16`,
        imageUploads: 0,
        suggestionHint: '다른 주제나 다른 소셜 미디어 플랫폼의 커버 이미지를 디자인해보세요.',
        author: '@balconychy',
        href: 'https://github.com/JimmyLv/awesome-nano-banana#cases-22',
    },
    {
        id: 'f2-creative-15',
        name: 'CASE 167: 풍자 포스터 생성',
        description: '특정 주제에 대한 풍자적인 메시지를 담은 포스터를 생성합니다.',
        prompt: `Satirical Poster Text (English):
GPT-4o is taking over.
Forget working in image AI
maybe it’s time to deliver takeout instead.`,
        imageUploads: 0,
        suggestionHint: '다른 주제로 풍자 포스터를 만들거나 포스터의 디자인 스타일을 변경해보세요.',
        author: '@ZHO_ZHO_ZHO',
        href: 'https://github.com/JimmyLv/awesome-nano-banana#cases-15',
    },
    {
        id: 'f2-creative-10',
        name: 'CASE 168: 풍자 만화 생성',
        description: '정치적 소비주의를 비판하는 풍자적인 복고풍 미국 만화 스타일의 일러스트를 생성합니다.',
        prompt: `An illustration in satirical comic style, rendered in a vintage American comic aesthetic. The background features a multi-tiered shelf stocked entirely with identical red baseball caps. The caps have a bold slogan on the front: “MAKE AMERICA GREAT AGAIN,” while a white side tag on each reads “MADE IN CHINA.” The composition uses a close-up perspective focusing on one specific red cap.
At the bottom of the image, a price label is shown: the original price “$50.00” is crossed out with a thick black X and replaced with “$77.00.” The overall color palette uses nostalgic ochre and deep red tones, with shading that mimics the textured print style of 1990s retro comics.
The composition is exaggerated and satirical, carrying a strong critique of political consumerism.`,
        imageUploads: 0,
        suggestionHint: '다른 사회적 이슈를 주제로 풍자 만화를 만들어보세요.',
        author: '@dotey',
        href: 'https://github.com/JimmyLv/awesome-nano-banana#cases-10',
    },
  ],
};
