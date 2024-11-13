export class RandomNameUtil {
  private static readonly adjective = [
    '행복한',
    '슬픈',
    '우울한',
    '쓸쓸한',
    '무거운',
    '따뜻한',
    '작은',
    '큰',
    '맛있는',
    '달콤한',
    '어려운',
    '쉬운',
    '재미있는',
    '훌륭한',
    '잘생긴',
    '예쁜',
    '귀여운',
    '매력적인',
    '편리한',
    '친절한',
    '순수한',
    '청결한',
    '상냥한',
    '예의바른',
    '높은 ',
    '먼',
    '정직한',
    '성실한',
    '공정한',
    '버릇없는',
    '더러운',
    '얇은',
    '뚱뚱한',
    '매끄러운',
    '유창한',
  ];
  private static readonly animal = [
    '사자',
    '호랑이',
    '코끼리',
    '기린',
    '얼룩말',
    '치타',
    '판다',
    '캥거루',
    '코알라',
    '고릴라',
    '자리',
    '코뿔소',
    '북극곰 ',
    '회색곰',
    '침팬지',
    '돌고래',
    '고래',
    '박쥐',
    '다람쥐',
    '토끼',
  ];

  public static generate() {
    const adjectvieLength = RandomNameUtil.adjective.length;
    const animalLength = RandomNameUtil.animal.length;

    const adjectvieIndex = Math.floor(Math.random() * adjectvieLength);
    const animalIndex = Math.floor(Math.random() * animalLength);

    return `${RandomNameUtil.adjective[adjectvieIndex]} ${RandomNameUtil.animal[animalIndex]}`;
  }
}
