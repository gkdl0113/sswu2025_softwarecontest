// (선택) 댓글 폼을 제출할 때 중복 제출 방지 및 UX 개선
(function () {
  const form = document.getElementById('comment-form');
  if (!form) return;

  form.addEventListener('submit', () => {
    const btn = form.querySelector('button[type="submit"]');
    if (btn) {
      btn.disabled = true;
      btn.textContent = '작성 중...';
    }
  });
})();
