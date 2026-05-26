// funny-counter.js
// 全局摸摸计数器 - 兼容 InstantClick 的独立模块

(function() {
  // 防止重复初始化
  if (window._funnyCounterInitialized) return;
  window._funnyCounterInitialized = true;

  // 全局配置
  const API_BASE = 'https://funny-api.969608.xyz';   // 你的自定义域名
  const COMMIT_DELAY = 2000;
  const MAX_DELTA = 800;
  const MAX_PENDING = 800;
  const COMBO_THRESHOLD = 500;
  const COMBO_RESET_DELAY = 1000;

  let currentCount = 0;
  let pendingDelta = 0;
  let commitTimer = null;
  let isCountMode = false;
  let hoverTimer = null;
  let leaveTimer = null;
  let lastClickTime = 0;
  let comboCount = 0;
  let comboTimer = null;
  let currentComboStreak = 0;
  let hintTimer = null;
  let limitHintTimer = null;

  // DOM 元素引用
  let funnyCard = null;
  let textSpan = null;
  let bubble = null;

  // 辅助函数
  async function fetchGlobalCount() {
    try {
      const res = await fetch(`${API_BASE}/count`);
      const data = await res.json();
      return data.count;
    } catch (err) {
      console.error('获取全局计数失败', err);
      return 0;
    }
  }

  async function commitDelta(delta) {
    if (delta === 0) return;
    try {
      const res = await fetch(`${API_BASE}/count`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ delta: Math.min(delta, MAX_DELTA) })
      });
      const data = await res.json();
      if (data.count !== undefined) {
        currentCount = data.count;
        if (isCountMode && !hintTimer && !limitHintTimer) {
          setTextWithAnimation(`被摸了 ${currentCount} 次`);
        }
        console.log(`提交 ${delta} 成功，最新总数: ${currentCount}`);
        return true;
      } else {
        throw new Error('提交失败');
      }
    } catch (err) {
      console.error('提交增量失败', err);
      return false;
    }
  }

  function scheduleCommit() {
    if (commitTimer) clearTimeout(commitTimer);
    commitTimer = setTimeout(async () => {
      if (pendingDelta > 0) {
        await commitDelta(pendingDelta);
        pendingDelta = 0;
      }
      commitTimer = null;
    }, COMMIT_DELAY);
  }

  function setTextWithAnimation(newText) {
    if (hintTimer || limitHintTimer) return;
    if (!textSpan) return;
    textSpan.style.animation = 'none';
    textSpan.offsetHeight;
    textSpan.textContent = newText;
    textSpan.style.animation = 'fadeText 0.4s ease-out';
  }

  function showLimitHint() {
    if (limitHintTimer) clearTimeout(limitHintTimer);
    if (!textSpan) return;
    const originalMode = isCountMode;
    textSpan.style.animation = 'none';
    textSpan.offsetHeight;
    textSpan.textContent = '🥵要被点坏惹🥵';
    textSpan.style.animation = 'fadeText 0.4s ease-out';
    limitHintTimer = setTimeout(() => {
      if (originalMode) {
        setTextWithAnimation(`被摸了 ${currentCount} 次`);
      } else {
        setTextWithAnimation('暗中观察（被发现了）');
      }
      limitHintTimer = null;
    }, 1500);
  }

  function addLocalCount(increment = 1) {
    if (pendingDelta + increment > MAX_PENDING) {
      showLimitHint();
      return false;
    }
    pendingDelta += increment;
    currentCount += increment;
    if (isCountMode && !hintTimer && !limitHintTimer) {
      setTextWithAnimation(`被摸了 ${currentCount} 次`);
    }
    scheduleCommit();
    return true;
  }

  function showHintMessage(message) {
    if (hintTimer) clearTimeout(hintTimer);
    if (!textSpan) return;
    textSpan.style.animation = 'none';
    textSpan.offsetHeight;
    textSpan.textContent = message;
    textSpan.style.animation = 'fadeText 0.4s ease-out';
    
    hintTimer = setTimeout(() => {
      hintTimer = null;
      textSpan.style.animation = 'none';
      textSpan.offsetHeight;
      textSpan.textContent = `被摸了 ${currentCount} 次`;
      textSpan.style.animation = 'fadeText 0.4s ease-out';
      isCountMode = true;
      if (hoverTimer) clearTimeout(hoverTimer);
    }, 2000);
  }

  function getShakeIntensity() {
    let translateX = Math.min(6 + comboCount * 2, 15);
    let rotate = Math.min(1 + comboCount * 0.5, 4);
    return { translateX, rotate };
  }

  function triggerComboAnimation() {
    if (!bubble) return;
    const { translateX, rotate } = getShakeIntensity();
    const steps = [
      { transform: `translateX(${translateX}px) rotate(${rotate}deg)`, offset: 0 },
      { transform: `translateX(${-translateX}px) rotate(${-rotate}deg)`, offset: 0.2 },
      { transform: `translateX(${translateX * 0.5}px) rotate(${rotate * 0.5}deg)`, offset: 0.6 },
      { transform: `translateX(0) rotate(0deg)`, offset: 1 }
    ];
    if (bubble.animate) {
      const keyframes = steps.map(s => ({ transform: s.transform }));
      const animation = bubble.animate(keyframes, {
        duration: 200,
        easing: 'cubic-bezier(0.2, 0.9, 0.4, 1.1)',
        fill: 'forwards'
      });
      animation.onfinish = () => { bubble.style.transform = ''; };
    } else {
      bubble.style.transform = `translateX(${translateX}px) rotate(${rotate}deg)`;
      setTimeout(() => { bubble.style.transform = ''; }, 100);
    }
  }

  function endComboStreak() {
    if (currentComboStreak >= 10) {
      showHintMessage(`✨ 连摸 ${currentComboStreak} 次！ ✨`);
    }
    currentComboStreak = 0;
    comboCount = 0;
    if (comboTimer) clearTimeout(comboTimer);
    comboTimer = null;
  }

  function recordCombo() {
    if (comboTimer) clearTimeout(comboTimer);
    comboTimer = setTimeout(() => {
      endComboStreak();
    }, COMBO_RESET_DELAY);
  }

  function showObserve() {
    if (!isCountMode) return;
    if (hintTimer || limitHintTimer) return;
    setTextWithAnimation('暗中观察（被发现了）');
    isCountMode = false;
    if (hoverTimer) clearTimeout(hoverTimer);
  }

  function showCount(immediate = false) {
    if (hintTimer || limitHintTimer) return;
    if (isCountMode) {
      setTextWithAnimation(`被摸了 ${currentCount} 次`);
      return;
    }
    if (!immediate && hoverTimer) clearTimeout(hoverTimer);
    setTextWithAnimation(`被摸了 ${currentCount} 次`);
    isCountMode = true;
  }

  // 事件处理
  async function onFunnyClick(e) {
    e.preventDefault();
    const now = Date.now();
    const timeDiff = now - lastClickTime;
    lastClickTime = now;
    
    const added = addLocalCount(1);
    if (!added) return;
    
    if (timeDiff < COMBO_THRESHOLD && timeDiff > 0) {
      comboCount++;
      currentComboStreak++;
      recordCombo();
      triggerComboAnimation();
    } else {
      endComboStreak();
      comboCount = 0;
      currentComboStreak = 1;
      recordCombo();
    }
  }

  function onMouseEnter() {
    if (leaveTimer) {
      clearTimeout(leaveTimer);
      leaveTimer = null;
    }
    if (isCountMode) return;
    if (hoverTimer) clearTimeout(hoverTimer);
    if (textSpan && textSpan.textContent !== '暗中观察（被发现了）' && !hintTimer && !limitHintTimer) {
      setTextWithAnimation('暗中观察（被发现了）');
      isCountMode = false;
    }
    hoverTimer = setTimeout(() => {
      showCount();
      hoverTimer = null;
    }, 1000);
  }

  function onMouseLeave() {
    if (hoverTimer) {
      clearTimeout(hoverTimer);
      hoverTimer = null;
    }
    if (leaveTimer) clearTimeout(leaveTimer);
    leaveTimer = setTimeout(() => {
      showObserve();
      leaveTimer = null;
    }, 500);
  }

  function onMouseDown(e) {
    if (e.button === 0 && funnyCard) {
      funnyCard.style.cursor = 'grabbing';
    }
  }
  function onMouseUp() {
    if (funnyCard) funnyCard.style.cursor = 'grab';
  }
  function onMouseLeaveCursor() {
    if (funnyCard) funnyCard.style.cursor = 'grab';
  }

  // 页面关闭前提交
  window.addEventListener('beforeunload', () => {
    if (pendingDelta > 0) {
      const data = JSON.stringify({ delta: Math.min(pendingDelta, MAX_DELTA) });
      navigator.sendBeacon(`${API_BASE}/count`, new Blob([data], { type: 'application/json' }));
    }
  });

  // 核心初始化函数（每次页面切换时调用）
  function init() {
    // 重新获取 DOM 元素（因为页面可能被 InstantClick 替换）
    funnyCard = document.querySelector('.funny');
    textSpan = document.getElementById('bubbleText');
    bubble = document.getElementById('nb');
    if (!funnyCard || !textSpan || !bubble) {
      console.warn('滑稽计数器 DOM 元素不存在，跳过初始化');
      return;
    }

    // 解绑旧事件（避免重复）
    funnyCard.removeEventListener('click', onFunnyClick);
    funnyCard.removeEventListener('mouseenter', onMouseEnter);
    funnyCard.removeEventListener('mouseleave', onMouseLeave);
    funnyCard.removeEventListener('mousedown', onMouseDown);
    funnyCard.removeEventListener('mouseup', onMouseUp);
    funnyCard.removeEventListener('mouseleave', onMouseLeaveCursor);

    // 绑定新事件
    funnyCard.addEventListener('click', onFunnyClick);
    funnyCard.addEventListener('mouseenter', onMouseEnter);
    funnyCard.addEventListener('mouseleave', onMouseLeave);
    funnyCard.addEventListener('mousedown', onMouseDown);
    funnyCard.addEventListener('mouseup', onMouseUp);
    funnyCard.addEventListener('mouseleave', onMouseLeaveCursor);

    // 重置状态
    isCountMode = false;
    pendingDelta = 0;
    if (hoverTimer) clearTimeout(hoverTimer);
    if (leaveTimer) clearTimeout(leaveTimer);
    if (commitTimer) clearTimeout(commitTimer);
    if (hintTimer) clearTimeout(hintTimer);
    if (limitHintTimer) clearTimeout(limitHintTimer);
    if (comboTimer) clearTimeout(comboTimer);

    // 加载最新计数并显示
    fetchGlobalCount().then(count => {
      currentCount = count;
      setTextWithAnimation('暗中观察（被发现了）');
      isCountMode = false;
      console.log('滑稽计数器已启动，当前总数：', currentCount);
    }).catch(err => {
      console.error('初始化计数器失败', err);
      setTextWithAnimation('暗中观察（被发现了）');
    });
  }

  // 暴露 init 方法供外部调用
  window.FunnyCounter = { init };

  // 自动初始化：如果 InstantClick 存在则挂载到 change 事件，否则在 DOMContentLoaded 时初始化
  if (typeof InstantClick !== 'undefined') {
    InstantClick.on('change', function() {
      window.FunnyCounter.init();
    });
  } else {
    document.addEventListener('DOMContentLoaded', function() {
      window.FunnyCounter.init();
    });
  }
})();
