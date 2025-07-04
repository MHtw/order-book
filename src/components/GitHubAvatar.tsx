const GithubAvatar = () => {
  return (
    <a
      href="https://github.com/rnike"
      target="_blank"
      className="flex items-center gap-2 text-defaultfg font-black hover:underline"
    >
      <img
        src="https://github.com/rnike.png"
        alt="avatar"
        className="rounded-full size-8"
      />
      <span>rnike@github</span>
    </a>
  );
};

export default GithubAvatar;
