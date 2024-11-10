import GithubLogo from '@/assets/github-logo.png';

export function Credit() {
  return (
    <div className="absolute bottom-8 flex flex-col items-center">
      <a href="https://github.com/boostcampwm-2024/web18-inear/wiki">
        <img src={GithubLogo} className="w-8 h-8 mb-1" />
      </a>
      <p className="text-sm text-grayscale-150 mb-2">
        우리에게 커피를 사주고 싶습니까?
      </p>
      <p className="text-xs text-grayscale-400">Created By: BST(버그사냥단)</p>
    </div>
  );
}
